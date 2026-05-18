---
title: "Zentera"
start_date: 2025-05-05
end_date: 2025-06-27
description: "Voxel puzzle platformer built in the custom Kudzu engine. Contributed engine console, hot reloading system (910x performance improvement), and PS5 platform support."
thumbnail: /assets/img/projects/zentera/thumbnail.png
banner: /assets/img/projects/zentera/banner.png
video: https://www.youtube.com/embed/Z_Zsby4ZBBI
tags: [cpp, vulkan, engine, tool, team, breda-university]
featured: true
team:
  producer: [Ivan Nekrasov]
  designer: [Axel Bouten, Simon Laasholdt]
  programmer: [Zhangir Nurmukhambetov, Boas-Bas van der Veen, Jaeden Zitman, Sven van Huessen, Loek van der Beele, Milan Bonten, Quinten Bubberman, Lynn van Birgelen, Max Coppen]
  artist: [Barbora Čížková, Betti Bodrogi, Matúš Skaličan, Michal Macek]
team-size: 16
role: "Engine & Tools Programmer"
links:
  - { name: Zentera on Itch.io, url: "https://buas.itch.io/zentera", icon: fab fa-itch-io }
  - { name: Engine Source (Open), url: "https://buas.itch.io/zentera/devlog/1001019/zentera-goes-open-game-engine-release", icon: fas fa-code }
---

## Overview

Zentera is a voxel-based puzzle platformer where you control Gori, a lizard who uses his tongue to push, pull, and swing through miniature dioramic worlds. Built in **Kudzu**, a custom C++/Vulkan voxel engine, by a team of 16 at Breda University of Applied Sciences. The game shipped with 3 early access builds and a final release on itch.io, including full engine source code.

My role was **Engine & Tools Programmer**, focused on developer tooling, runtime systems, and platform support.

---

## Engine Console

Built a debug console system for the engine using ImGui, used by the entire team for debugging across all disciplines. The system has two parts: a **logger** that captures `stdout`/`stderr` via C-level stream redirection, and a **console UI** with filtering and search.

The logger redirects standard output to a log file using `freopen_s` and `_dup2`, capturing output from both engine code and external libraries without modifying existing logging infrastructure:

```cpp
fopen_s(&log_file, KUDZU_LOG, "wb+");
AllocConsole();
console_window = GetConsoleWindow();
hide_console();

FILE* empty = nullptr;
freopen_s(&empty, "CONOUT$", "wb", stdout);
freopen_s(&empty, "CONOUT$", "wb", stderr);

stdout_fd = _dup(_fileno(stdout));
stderr_fd = _dup(_fileno(stderr));

_dup2(_fileno(log_file), _fileno(stdout));
_dup2(_fileno(log_file), _fileno(stderr));
```

The console parses log content into typed entries with warning levels (Info/Warning/Error) and source types (Engine/Scripting), supports text search, per-type filtering, auto-scroll, and customizable colors saved to editor settings. The log file also serves as the only debugging tool for artists and designers running release builds without a debugger attached.

![Console](/assets/img/projects/zentera/console_final.png)

---

## Hot Reloading System

Implemented a hot reloading system that monitors file modification timestamps and reloads any `Resource` in real time. This eliminated the need for engine restarts during asset iteration and replaced a planned voxel blockout tool -- artists and designers could edit models in MagicaVoxel and see changes instantly in-engine.

### Performance Optimization (910x Faster)

The initial implementation checked every resource every frame, which degraded as asset count grew to **7.28ms/frame**, dropping the editor from 167fps to 86fps.

![Before optimization](/assets/img/projects/zentera/hot_reloading_before_optimization.png)

I redesigned the system with three changes:

**File-centric architecture** -- moved from per-resource checks to a `FileResource` struct that maps one file to many resources, avoiding redundant filesystem calls:

```cpp
struct FileResource {
    std::string filename;
    FileIO::Directory directory;
    uint64_t last_modified;
    std::vector<size_t> resource_ids;
};
```

**Queue-based reloading** -- changed resources are added to an `std::unordered_map` queue instead of reloading inline. Failed reloads retry next frame (handling atomic write operations), with a timeout after max retries:

```cpp
for (auto it = reload_queue.begin(); it != reload_queue.end();) {
    const size_t id = it->first;
    int& counter = it->second;
    if (resources[id]->reload()) {
        it = reload_queue.erase(it);
        reloaded = true;
    } else {
        if (++counter >= RELOAD_TIMEOUT) {
            it = reload_queue.erase(it);
        } else { ++it; }
    }
}
```

**Throttled file checking** -- filesystem polling runs every 1 second instead of every frame.

![After optimization](/assets/img/projects/zentera/hot_reloading_after_optimization.png)

Result: **0.012ms average** (from 7.28ms), maintaining 167fps. A **910x improvement**.

---

## Playstation 5 Support

> *Due to NDA restrictions, implementation details for PlayStation 5 platform work are limited.*

### Scripting Engine Fix

The AngelScript scripting integration failed on PS5 due to stricter calling conventions on the platform. A type used throughout the scripting system wasn't registered for automatic type conversion, which x64 handled implicitly but the PS5 architecture rejected. The fix involved adding the correct type registration flags so the scripting engine could perform the necessary conversions on the target platform.

### Multithreaded Packaging Pipeline

The PS5 packaging process uses Python scripts to generate project files for the platform SDK toolchain. I fixed path resolution issues in the existing pipeline and added **multithreaded packaging** using `std::atomic` and `std::thread` so the engine remains responsive during the build process, with real-time status display in the editor toolbar via ImGui.

```cpp
namespace kudzu::packaging {
static std::atomic packaging_thread_active {false};
static std::atomic packaging_finished {false};
static std::atomic packaging_failed {false};
static std::thread packaging_thread;

bool start_packaging(const std::string& command) {
    if (packaging_thread_active) return false;
    reset_thread();

    packaging_thread = std::thread([command]() {
        packaging_thread_active = true;
        packaging_failed = system(command.c_str()) != 0;
        packaging_finished = true;
    });
    return true;
}
}
```

---

## Technologies

- **Engine:** Kudzu (custom C++/Vulkan voxel engine)
- **Language:** C++
- **Graphics:** Vulkan
- **UI:** ImGui
- **Scripting:** AngelScript
- **Platforms:** Windows, PlayStation 5
- **VCS:** GitHub, Perforce
