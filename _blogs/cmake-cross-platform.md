---
title: "Converting a Game Engine from Visual Studio to CMake"
date: 2026-01-10 12:00:00 +0100
tags: [cpp, cmake, engine, breda-university]
thumbnail: /assets/img/blogs/cmake/thumbnail.png
---

For my Year 3 self-study I converted the BeeEngine (our in-house C++/OpenGL engine) from a Visual Studio solution to a CMake project with cross-platform builds on Windows (MSVC) and Linux (WSL/GCC). This post covers the key concepts I learned and the problems I ran into.

## Why CMake

Visual Studio solutions lock you into one IDE and one platform. CMake generates build files for any toolchain: Visual Studio, Ninja, Make, Xcode, whatever. The same CMakeLists.txt builds on Windows and Linux without changes to the build configuration. For an engine that might need to target multiple platforms, that matters.

## Project Structure

The engine is structured as a static library that the game executable links against:

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

The game adds the engine as a subdirectory and links it with a single line:

```cmake
add_subdirectory(${CMAKE_CURRENT_SOURCE_DIR}/../bee-engine ${CMAKE_BINARY_DIR}/bee-engine)
add_executable(game Game.cpp)
target_link_libraries(game PRIVATE bee)
```

## PUBLIC, PRIVATE, and INTERFACE

This was the most important concept I learned. These keywords control what propagates to targets that link against your library.

`PRIVATE` means "only this target uses it." `PUBLIC` means "this target and anyone linking against it." `INTERFACE` means "only consumers, not this target itself" -- useful for header-only libraries like EnTT.

Most of bee's dependencies are `PRIVATE` because the game should only see bee's API, not its internal libraries. Only things exposed in bee's public headers (glm, glad) are `PUBLIC`. EnTT is `INTERFACE` because it's header-only -- there's nothing to compile, but consumers need the include path.

```cmake
# Header-only: INTERFACE
add_library(entt INTERFACE)
target_include_directories(entt INTERFACE ${CMAKE_CURRENT_SOURCE_DIR})

# Regular library: PUBLIC headers, PRIVATE internals
add_library(tinygltf STATIC tinygltf/tiny_gltf.cc)
target_include_directories(tinygltf PUBLIC ${CMAKE_CURRENT_SOURCE_DIR}/tinygltf)
target_include_directories(tinygltf PRIVATE ${BEE_ROOT}/include)
```

## Generator Expressions

Single-config generators (Make, Ninja) pick one configuration at generation time. Multi-config generators (Visual Studio, Ninja Multi-Config) handle Debug/Release in one build tree. Generator expressions let you write rules that work with both:

```cmake
target_compile_options(bee PRIVATE
    $<$<CXX_COMPILER_ID:MSVC>:/W4>
    $<$<NOT:$<CXX_COMPILER_ID:MSVC>>:-Wall -Wextra -Wpedantic>
)
```

This sets `/W4` for MSVC and `-Wall -Wextra -Wpedantic` for everything else, resolved at build time.

## Cross-Platform Handling

I used a CMake cache variable to select the target platform, which enables conditional compilation throughout:

```cmake
set(BEE_PLATFORM "Windows" CACHE STRING "Target platform")
set_property(CACHE BEE_PLATFORM PROPERTY STRINGS "Windows" "Linux")
```

Platform differences show up in dependency resolution. Windows uses a pre-built GLFW binary, Linux uses the system package. FMOD only ships Windows binaries, so it's excluded on Linux entirely.

## What Went Wrong

I originally tried to convert the Kudzu engine (the custom Vulkan engine from Zentera). After a few weeks of fighting circular dependencies and modified third-party code, my lecturer told me to pivot. The BeeEngine had a simpler single-library structure that let me focus on actually learning CMake instead of wrestling with architecture problems. Good advice -- the pivot probably saved the project.

## The Result

The engine compiles and runs on both Windows (MSVC via CLion) and Linux (GCC via WSL). The full dependency tree:

```
game (executable)
└── bee (STATIC)
    ├── glm, entt, cereal (INTERFACE, PUBLIC)
    ├── fmt, glad (STATIC, PUBLIC)
    ├── nlohmann_json, clipper, tinygltf (STATIC, PRIVATE)
    ├── imgui, imguizmo, xsr (STATIC, PRIVATE)
    └── fmod_studio (IMPORTED, Windows only)
```
