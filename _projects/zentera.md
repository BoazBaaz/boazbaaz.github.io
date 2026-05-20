---
title: "Zentera"
start_date: 2025-05-05
end_date: 2025-06-27
description: "Voxel puzzle platformer built in the custom Kudzu engine. Contributed engine console, hot reloading system (910x performance improvement), and PS5 platform support."
thumbnail: /assets/img/projects/zentera/thumbnail.png
background: /assets/img/projects/zentera/background.png
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
  - { name: Play on Itch.io, url: "https://buas.itch.io/zentera", icon: fab fa-itch-io, color: "#FA5C5C" }
  - { name: Read Article, url: "/blogs/zentera-engine-tools/", icon: fas fa-newspaper }
  - { name: Engine Source, url: "https://buas.itch.io/zentera/devlog/1001019/zentera-goes-open-game-engine-release", icon: fas fa-code, color: "#333" }
---

## Overview

Zentera is a voxel-based puzzle platformer where you control Gori, a lizard who uses his tongue to push, pull, and swing through miniature dioramic worlds. Built in **Kudzu**, a custom C++/Vulkan voxel engine, by a team of 16 at Breda University of Applied Sciences. The game shipped with 3 early access builds and a final release on itch.io, including full engine source code.

<div class="video-embed">
  <iframe src="https://www.youtube.com/embed/Z_Zsby4ZBBI" title="Zentera Trailer" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## What I Did

My role was **Engine & Tools Programmer**, focused on building developer tooling and platform support for the team.

### Engine Console

Built a full debug console for the engine using ImGui. The system captures all `stdout`/`stderr` output via C-level stream redirection and presents it in a searchable, filterable UI with color-coded warning levels. Used by the entire team across all disciplines -- and served as the only debugging tool for artists and designers running release builds.

![Console](/assets/img/projects/zentera/console_final.png)

### Hot Reloading System

Implemented real-time asset hot reloading so artists could edit voxel models in MagicaVoxel and see changes instantly in-engine without restarting. The initial implementation had serious performance issues (7.28ms/frame), which I optimized down to **0.012ms/frame** -- a **910x improvement** -- by redesigning the file monitoring architecture.

![Before optimization](/assets/img/projects/zentera/hot_reloading_before_optimization.png)
![After optimization](/assets/img/projects/zentera/hot_reloading_after_optimization.png)

### PlayStation 5 Support

> *Due to NDA restrictions, implementation details for PS5 work are limited.*

Fixed the AngelScript scripting engine for PS5's stricter calling conventions and built a **multithreaded packaging pipeline** so the engine stays responsive during PS5 builds, with real-time progress in the editor toolbar.

## Technologies

- **Engine:** Kudzu (custom C++/Vulkan voxel engine)
- **UI:** ImGui
- **Scripting:** AngelScript
- **Platforms:** Windows, PlayStation 5
- **VCS:** GitHub, Perforce
