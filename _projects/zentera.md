---
title: "Zentera"
start_date: 2025-05-05
end_date: 2025-06-27
description: "Voxel puzzle platformer built in the custom Kudzu engine. Contributed engine console, hot reloading system, and PS5 platform support."
thumbnail: /assets/img/projects/zentera/thumbnail.png
background: /assets/img/projects/zentera/background.png
tags: [cpp, vulkan, engine, tool, team, breda-university, game]
featured: true
team:
  producer: [Ivan Nekrasov]
  designer: [Axel Bouten, Simon Laasholdt]
  programmer: [Zhangir Nurmukhambetov, Boas-Bas van der Veen, Jaeden Zitman, Sven van Huessen, Loek van der Beele, Milan Bonten, Quinten Bubberman, Lynn van Birgelen, Max Coppen]
  artist: [Barbora Čížková, Betti Bodrogi, Matúš Skaličan, Michal Macek]
team-size: 16
role: "Engine & Tools Programmer"
links:
  - { name: Itch.io, url: "https://buas.itch.io/zentera", icon: fab fa-itch-io, color: "#FA5C5C" }
  - { name: Engine Source, url: "https://buas.itch.io/zentera/devlog/1001019/zentera-goes-open-game-engine-release", icon: fas fa-code, color: "#3a3a3f" }
---

## Overview

Zentera is a voxel-based puzzle platformer where you control Gori, a lizard who uses his tongue to push, pull, and swing through miniature dioramic worlds. It was built in **Kudzu**, a custom C++/Vulkan voxel engine, by a team of 16 at Breda University of Applied Sciences. The game shipped with 3 early access builds and a final release on itch.io, including the full engine source code.

<div class="video-embed">
  <iframe src="https://www.youtube.com/embed/Z_Zsby4ZBBI" title="Zentera Trailer" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

---

## What I Did

My role was **Engine & Tools Programmer**. I focused on developer tooling and platform support for the rest of the team.

### Engine Console

I built a debug console for the engine using ImGui. It captures everything the engine and its libraries print and shows it in a searchable, filterable window with color-coded warning levels. The whole team used it, artists and designers included, and it was the only way to debug release builds.

![Console](/assets/img/projects/zentera/console_final.png)

<a href="/blogs/zentera-engine-console/" class="article-button"><i class="fas fa-newspaper"></i> Read the article</a>

### Hot Reloading

I made it possible for artists to edit voxel models in MagicaVoxel and see the changes in-engine right away, without restarting. The first version was slow at production asset counts, so I redesigned it until the cost per frame was basically gone.

<div class="image-todo">GIF of a model being saved in MagicaVoxel and updating live in the Kudzu editor, side by side.</div>

<a href="/blogs/zentera-hot-reloading/" class="article-button"><i class="fas fa-newspaper"></i> Read the article</a>

### PlayStation 5 Support

> *Due to NDA restrictions, details on the PS5 work are limited.*

I fixed the scripting engine so it ran on PS5 and made the packaging pipeline run on a background thread, so the editor stays usable during a PS5 build and shows the progress in the toolbar.
