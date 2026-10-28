---
title: "Bee Engine Editor"
start_date: 2024-09-02
end_date: 2024-10-25
description: "Custom engine editor built on top of the in-house Bee engine, featuring a full ImGui-based editor with hierarchy, inspector, particle system, and scene serialization."
thumbnail: /assets/img/projects/bee-engine/engine_interface.png
tags: [cpp, opengl, engine, tool, breda-university]
featured: true
team:
  programmer: [Boas-Bas van der Veen]
team-size: 1
role: "Engine & Tools Programmer"
links:
  - { name: GitHub, url: "https://github.com/BredaUniversityGames/2425-Y2A-PR-230896", icon: fab fa-github, color: "#3a3a3f" }
---

## Overview

For the Year 2 Engine & Tools specialization at BUAS, I built a full editor on top of the in-house Bee engine. The goal was to create an environment where you could create, edit, and save scenes with entities and components -- similar to how Unity or Unreal work under the hood. Everything runs through EnTT for entity management and ImGui for the interface.

![Editor Interface](/assets/img/projects/bee-engine/engine_interface.png)

## What I Did

### Editor & Inspector

Built the full editor layout with docking, a scene hierarchy with parent/child relationships, and a component inspector. The inspector uses EnTT's `entt::meta` reflection system -- every component registers itself once and is automatically displayed with the correct UI fields. Selecting an entity in the hierarchy or clicking it in the viewport shows its properties in the inspector.

### Particle System

Created a particle system with configurable emitters supporting both burst and continuous emission modes. Properties like colour, size, lifetime, and velocity are all tweakable through the inspector. Particles interpolate between start and end values over their lifetime.

![Particle System](/assets/img/projects/bee-engine/particle_system.gif)

### Scene Serialization

Implemented full scene save and load using the cereal library. Every component that registers for serialization can be written to JSON and reconstructed. Saving a scene serializes all root entities and their children, loading reconstructs the full hierarchy.

![Save and Load](/assets/img/projects/bee-engine/save_and_load.gif)

### Other Systems

Built a generalized resource manager using a templated static class with custom loaders for meshes, textures, and GLTF models. Also implemented a tile map system, GLTF model loading via tinygltf, and ImGuizmo integration for transform manipulation in the viewport.
