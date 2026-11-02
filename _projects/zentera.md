---
title: "Zentera"
start_date: 2025-05-05
end_date: 2025-06-27
description: "Voxel puzzle platformer built in the custom Kudzu engine. Contributed engine console, hot reloading system, and PS5 platform support."
thumbnail: /assets/img/projects/zentera/thumbnail.png
background: /assets/img/projects/zentera/background.png
tags: [cpp, vulkan, engine, tool, buas, game]
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

Zentera is a voxel puzzle platformer where you play as Gori, a lizard who uses his tongue to push, pull and swing through small diorama-like worlds. It was the final project of my second year at Breda University of Applied Sciences, made in eight weeks by a team of 16 programmers, designers, artists and a producer. We built it in **Kudzu**, a custom C++/Vulkan voxel engine, and released it on itch.io together with the full engine source code.

<div class="video-embed">
  <iframe src="https://www.youtube.com/embed/Z_Zsby4ZBBI" title="Zentera Trailer" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

---

## What I Did

I was on the engine side of the team, building tools for the rest of the team and fixing engine bugs. In the first sprints I was in the level feature team, but since I was mostly working on the engine, I moved to the engine feature team from the third sprint on.

### Engine Console

A console that captures everything the engine and its libraries print, writes it to a log file, and shows it in the editor with filters and search. Gameplay programmers used it all the time to check their scripts, and for artists and designers without a debugger, the log file was the way to find out why something crashed.

![Console](/assets/img/projects/zentera/console_final.png)

<a href="/blogs/zentera-engine-console/" class="article-button"><i class="fas fa-newspaper"></i> Read the article</a>

### Hot Reloading

Artists and designers can edit a voxel model in MagicaVoxel, save it, and see it update in the engine right away. This replaced a planned blockout tool, since designers could now block out levels in MagicaVoxel instead. Near the end of the project I redesigned it to make it about 910 times faster.

<div class="image-todo">The hot_reload.mp4 video from the Y2D evidence folder.</div>

<a href="/blogs/zentera-hot-reloading/" class="article-button"><i class="fas fa-newspaper"></i> Read the article</a>

### PlayStation 5 Support

> *Due to NDA restrictions, details on the PS5 work are limited.*

I fixed the scripting engine so it worked on PS5, and made packaging a PS5 build run on a background thread, so the editor stays usable while it packages and shows the status in the toolbar.

<div class="image-todo">The ps5_packaging.mp4 video from the Y2D evidence folder, if it doesn't show anything under NDA.</div>

### Other Work

I added an FPS limiter to test how the game ran on lower end hardware, which helped us find issues in the physics. I also fixed a lot of engine bugs, like UI buttons that registered clicks in the wrong place. That one turned out to be caused by the world scale and rotation calculations of the transform, and fixing it unblocked the UI work.

<div class="image-todo">The fps_limit.mp4 video from the Y2D evidence folder, or a screenshot of the fixed UI button collision with the debug outline.</div>
