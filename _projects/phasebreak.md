---
title: "PhaseBreak"
start_date: 2025-11-10
end_date: 2026-06-19
description: "Turn-based tactical heist game in Unreal Engine 5, played across two overlapping dimensions. I owned the grid system and its editor tooling."
thumbnail: /assets/img/projects/placeholder.jpg
tags: [unreal-engine, cpp, tool, team, buas, game]
featured: true
role: "Grid System & Tools Programmer"
---

## Overview

PhaseBreak is a turn-based tactical heist game made in Unreal Engine 5. The level exists in two dimensions at the same time, and you swap between them to get past enemies and obstacles. Warping into a spot that's occupied in the other dimension even damages whatever is standing there. It was a team project at Breda University of Applied Sciences that ran across three blocks of my third year.

<div class="text-todo">Add the team size and what the team was made of (programmers, designers, artists), and where it was released if it was.</div>

<div class="image-todo">Trailer or a short gameplay GIF: a unit moving across the grid, swapping dimension, and the level changing around it.</div>

---

## What I Did

I owned the backend of the grid system: generating the grid from the level, handling both dimensions, and saving it so designers can edit it.

### Grid System

Level designers build their level, drop a volume over it and get tiles that follow the geometry. The grid works for both dimensions at once, knows which dimension each piece of geometry belongs to, and only updates the tiles that changed when something moves.

<div class="image-todo">Editor viewport GIF: a grid volume being dragged and resized over a level, tiles appearing and disappearing in real time.</div>

<div class="image-todo">Screenshot of the same spot in both dimensions with the debug tiles drawn, showing different valid tiles per dimension.</div>

<a href="/blogs/phasebreak-grid-system/" class="article-button"><i class="fas fa-newspaper"></i> Read the article</a>

### Designer Tooling

An editor mode where designers click tiles in the viewport to make them valid or invalid. Their changes stay when the volume moves or the grid rebuilds, and each level's grid is saved in its own data asset, so they get the normal "unsaved changes" flow instead of a separate save button.

<div class="image-todo">GIF of the tile editor mode: clicking tiles in the viewport to toggle them, then the data asset showing as modified.</div>

### Shipping the Game

In the final block I fixed packaging failures and editor crashes, worked through gameplay bugs with the team, and profiled the game to find performance spikes before release.

<div class="image-todo">In-game screenshot of a level that shipped, showing the grid and units during a turn.</div>
