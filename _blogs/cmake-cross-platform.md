---
title: "Converting a Game Engine from Visual Studio to CMake"
date: 2026-01-10 12:00:00 +0100
status: draft
tags: [cpp, cmake, engine, buas]
thumbnail: /assets/img/blogs/cmake/thumbnail.png
---

For my self-study project I converted the BeeEngine, our in-house C++/OpenGL engine, from a Visual Studio solution to CMake. It now builds and runs on both Windows (MSVC) and Linux (GCC on WSL) from the same build files. I started out trying to convert a different engine, and switching halfway is a big part of why it worked out.

<div class="image-todo">The engine running on Windows and on Linux side by side (bee_windows_build.png and bee_linux_build.png from the Y3B evidence).</div>

## Why CMake

A Visual Studio solution only works in one IDE and on one platform. CMake generates the build files for whatever toolchain you want, like Visual Studio, Ninja, Make or Xcode, so the same `CMakeLists.txt` builds on Windows and Linux. For an engine that might need to run on multiple platforms, that matters.

## Project structure

The engine is a static library, and the game is an executable that links against it. The game adds the engine as a subdirectory and links it with one line.

```
BeeEngine/
├── game/
│   ├── CMakeLists.txt       # Executable, links bee
│   └── Game.cpp
└── bee-engine/
    ├── CMakeLists.txt        # Platform config
    ├── external/
    │   └── CMakeLists.txt    # All dependencies
    ├── source/
    │   └── CMakeLists.txt    # Library compilation
    └── include/
```

```cmake
add_subdirectory(${CMAKE_CURRENT_SOURCE_DIR}/../bee-engine ${CMAKE_BINARY_DIR}/bee-engine)
add_executable(game Game.cpp)
target_link_libraries(game PRIVATE bee)
```

## PUBLIC, PRIVATE and INTERFACE

These keywords decide what gets passed on to the targets that link against your library. `PRIVATE` means only this target uses it. `PUBLIC` means this target and everything that links against it. `INTERFACE` means only the targets that link against it, which is what you want for header-only libraries like EnTT.

Most of bee's dependencies are `PRIVATE`, because the game should only see bee's own API. Only things that show up in bee's public headers, like glm and glad, are `PUBLIC`. EnTT is `INTERFACE` because there is nothing to compile, but everything using it needs the include path.

```cmake
# Header-only: INTERFACE
add_library(entt INTERFACE)
target_include_directories(entt INTERFACE ${CMAKE_CURRENT_SOURCE_DIR})

# Regular library: PUBLIC headers, PRIVATE internals
add_library(tinygltf STATIC tinygltf/tiny_gltf.cc)
target_include_directories(tinygltf PUBLIC ${CMAKE_CURRENT_SOURCE_DIR}/tinygltf)
target_include_directories(tinygltf PRIVATE ${BEE_ROOT}/include)
```

## Cross-platform

A CMake cache variable picks the target platform, which the platform-specific parts use. The differences mostly show up in the dependencies. On Windows GLFW comes from a pre-built binary and on Linux from the system package. FMOD only has Windows binaries, so on Linux it's left out.

```cmake
set(BEE_PLATFORM "Windows" CACHE STRING "Target platform")
set_property(CACHE BEE_PLATFORM PROPERTY STRINGS "Windows" "Linux")
```

## What went wrong

At first I tried to convert the Kudzu engine, the custom Vulkan engine from Zentera. After a few weeks of fighting circular dependencies and third-party code that had been modified, my lecturer told me to switch. The BeeEngine is one simple library, so I could focus on actually learning CMake instead of fixing architecture problems. That was good advice, and switching probably saved the project.

## What I learned

The most important thing I learned was how `PUBLIC`, `PRIVATE` and `INTERFACE` propagate through targets, and that most dependencies should be `PRIVATE` so they don't leak into everything that links against your library.

<div class="text-todo">Anything else you learned, for example from the Kudzu attempt about when to stop and switch.</div>

## Result

The engine builds and runs on Windows (MSVC in CLion) and Linux (GCC in WSL). This is the full dependency tree:

```
game (executable)
└── bee (STATIC)
    ├── glm, entt, cereal (INTERFACE, PUBLIC)
    ├── fmt, glad (STATIC, PUBLIC)
    ├── nlohmann_json, clipper, tinygltf (STATIC, PRIVATE)
    ├── imgui, imguizmo, xsr (STATIC, PRIVATE)
    └── fmod_studio (IMPORTED, Windows only)
```
