---
title: "PhaseBreak"
start_date: 2025-11-10
end_date: 2026-06-19
description: "Turn-based tactical heist game in Unreal Engine 5, played across two overlapping dimensions. I owned the grid system and its editor tooling."
thumbnail: /assets/img/projects/placeholder.jpg
tags: [unreal-engine, cpp, tool, team, breda-university, game]
featured: true
role: "Grid System & Tools Programmer"
---

## Overview

PhaseBreak is a turn-based tactical heist game made in Unreal Engine 5 by a student team at Breda University of Applied Sciences. The level exists in two dimensions at the same time, and the player swaps between them to get past enemies and obstacles. Warping into an occupied spot in the other dimension even damages whatever is standing there.

<div class="image-todo">Trailer or a short gameplay GIF: a unit moving across the grid, swapping dimension, and the level changing around it.</div>

---

## What I Did

I owned the grid system for the whole project. Every other system, movement, AI pathfinding, cover and dimension swapping, sits on top of it.

### Grid System

The grid is generated from the level geometry, so level designers just build their level, drop a volume over it and get tiles. It supports both dimensions at once, figures out which dimension each piece of geometry belongs to, and only updates the tiles that actually changed when something moves.

<div class="image-todo">Editor viewport GIF: a grid volume being dragged and resized over a level, tiles appearing and disappearing in real time.</div>

<div class="image-todo">Screenshot of the same spot in both dimensions with the debug tiles drawn, showing different valid tiles per dimension.</div>

<a href="/blogs/phasebreak-grid-system/" class="article-button"><i class="fas fa-newspaper"></i> Read the article</a>

### Designer Tooling

I built an editor mode where designers click tiles directly in the viewport to mark them valid or invalid. Manual edits survive when the volume is moved or rebuilt. Each level's grid is saved to its own data asset, so designers get the normal "unsaved changes" flow instead of a separate save button.

<div class="image-todo">GIF of the tile editor mode: clicking tiles in the viewport to toggle them, then the data asset showing as modified.</div>

### Shipping the Game

In the final block I fixed packaging failures and editor crashes, worked through gameplay bugs with the team, and profiled the game to track down performance spikes before release.

<div class="image-todo">In-game screenshot of a level that shipped, showing the grid and units during a turn.</div>
