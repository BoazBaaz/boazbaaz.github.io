---
title: "Runtime Reflection with EnTT Meta for Editor Tooling"
date: 2024-10-20 12:00:00 +0100
tags: [cpp, engine, tool, breda-university]
thumbnail: /assets/img/projects/bee-engine/engine_interface.png
---

When building an engine editor, you quickly run into a problem: how do you display and edit arbitrary components in an inspector without writing UI code for each one individually? And how do you serialize those same components to disk without a separate save/load function per type?

This post covers how I used EnTT's `entt::meta` system to solve both problems with a single registration step per component.

## The Problem

In an ECS-based engine, entities are just IDs and components are plain structs. There's no shared base class, no virtual functions -- that's the whole point. But an editor needs to iterate over whatever components an entity has, display their fields, and let the user edit them. A serializer needs to do the same but write to JSON instead of ImGui.

The naive approach is a giant `if/else` chain: if this entity has a `Transform`, draw the transform UI, if it has an `Emitter`, draw the emitter UI, and so on. This works, but every new component means touching the editor code in multiple places.

## The Solution: entt::meta

EnTT has a built-in meta reflection system that lets you register types, properties, and functions at runtime. The key insight is that you can register a `DrawInspector` function and a `SaveType`/`LoadType` function on any component, then iterate over all registered types generically.

### Registration

I created two template functions. One registers a component for the inspector, the other for serialization. Each stores a human-readable name as a property and attaches the relevant functions.

```cpp
template <typename Type>
void RegisterInspectorMeta(const std::string& name)
{
    entt::meta<Type>()
        .prop(entt::hashed_string("ComponentName"), name)
        .template func<&Type::DrawInspector>(entt::hashed_string("DrawInspector"))
        .template func<&GetType<Type>, entt::as_ref_t>(entt::hashed_string("GetType"));
}
```

Registering a component is a single line:

```cpp
RegisterInspectorMeta<Transform>(ICON_FA_BORDER_STYLE " Transform");
RegisterInspectorMeta<Camera>(ICON_FA_CAMERA " Camera");
RegisterInspectorMeta<ParticleSystem::Emitter>(ICON_FA_BURN " Emitter");
```

### Generic Inspector

The inspector iterates all registered meta types, checks if the currently selected entity has that component in its storage, and invokes `DrawInspector` on it. No `if/else`, no per-component logic in the editor.

```cpp
for (auto&& [componentID, metaType] : entt::resolve())
{
    const auto* storage = Engine.Registry().storage(componentID);
    if (storage && storage->contains(selectedEntity))
    {
        auto getter = metaType.func(entt::hashed_string("GetType"));
        if (!getter) continue;

        auto component = getter.invoke({}, entt::forward_as_meta(Engine.Registry()), selectedEntity);
        if (auto drawFunc = metaType.func(entt::hashed_string("DrawInspector")))
        {
            drawFunc.invoke(component);
        }
    }
}
```

### Generic Serialization

The same pattern works for serialization. The `SaveType` and `LoadType` functions use the cereal library. Loading uses `try/catch` -- it attempts to deserialize each registered type from the JSON, and silently removes the component if it doesn't match.

```cpp
template <typename Type>
void LoadType(cereal::JSONInputArchive& archive, entt::registry& registry, const entt::entity entity)
{
    Type& component = registry.emplace<Type>(entity);
    const auto property = entt::resolve<Type>()
        .prop(entt::hashed_string("TypeName")).value().template cast<std::string>();
    try {
        archive(cereal::make_nvp(property.c_str(), component));
    } catch (...) {
        registry.remove<Type>(entity);
    }
}
```

## What I'd Do Differently

The `try/catch` approach for loading is functional but not elegant. If there are 20 registered types, loading one entity means 19 failed catches. A better approach would be to store the type name in the JSON and look it up directly. I also learned that splitting inspector registration and serialization registration into two separate systems was unnecessary -- a single registration with optional flags would have been cleaner.

That said, the core pattern of "register once, use everywhere" held up well. Adding a new component to the engine meant writing one struct, one `DrawInspector` function, one `serialize` function, and two registration calls. Everything else -- the editor, the serializer, the scene save/load -- picked it up automatically.
