---
title: "PhaseBreak"
start_date: 2025-11-10
end_date: 2026-06-19
description: "Turn-based tactical heist game in Unreal Engine 5, played across two overlapping dimensions. I owned the grid system and its editor tooling."
thumbnail: /assets/img/projects/phasebreak/steampage.jpg
background: /assets/img/projects/phasebreak/steampage_3.jpg
tags: [unreal-engine, cpp, tool, buas, game]
featured: true
team:
  producer: [Lasse Meerburg]
  designer-lead: [Gabriela Beșleagă]
  designer: [Lukas Čižauskaitė, Nick Heutmekers, Pepijn van der Ham, Jasmine de Jong, Jarod de Cleen, Jesper Hooijmans]
  programmer-lead: [Iddo Shoikhet]
  programmer: [Boas-Bas van der Veen, Justin Comans, Skye van den Reijen, Timethy Hyman, Jim van der Heijden, Robin Heijmans]
  artist-lead: [Simeon Glavchev]
  artist: [Jennifer Kamara, Ines Aroti, Manon van der poel, Nori David, Lyubomir Manchev, Leia Dekker, Marwa Omar, Zara Samaeva, Desislava Tsvetkova, Gwendolin Polyakov, Sydney Sahagun]
team-size: 27
role: "Engine & Tools Programmer"
links:
  - { name: Steam, url: "https://store.steampowered.com/app/4515410/Phasebreak/", icon: fa-brands fa-steam, color: "#1B2838" }
---

## Overview

PhaseBreak is a turn-based tactical heist game made in Unreal Engine 5. The level exists in two dimensions at the same time, and you swap between them to get past enemies and obstacles. Warping into a spot that's occupied in the other dimension even damages whatever is standing there.

It was the team project for the last three blocks of my third year at Breda University of Applied Sciences, made by 27 people: a producer, 7 designers, 7 programmers and 12 artists. The game is released on Steam.

<div class="image-todo">Trailer or a short gameplay GIF: a unit moving across the grid, swapping dimension, and the level changing around it.</div>

---

## What I Did

I owned the backend of the grid system: generating the grid from the level, handling both dimensions, and saving it so designers can edit it. Everything that moves or stands on the grid, from the units to the covers, goes through it.

### Grid System

Level designers build their level, drop a volume over it and get tiles that follow the geometry. The grid works for both dimensions at once, knows which dimension each piece of geometry belongs to, and only updates the tiles that changed when something moves, so dragging a volume around stays fast.

<video src="/assets/video/projects/phasebreak/grid_volume_tile_generation.mp4" width="100%" autoplay muted loop playsinline controls title="A grid volume generating tiles from the level"></video>

![Show and tell grid system v3 update](/assets/img/projects/phasebreak/show_and_tell_grid_system_v3_update.png)

![The grid in the dimension view of the viewport](/assets/img/projects/phasebreak/dimension_viewport.png)

<a href="/blogs/phasebreak-grid-system/" class="article-button"><i class="fas fa-newspaper"></i> Read the article</a>

### Designer Tooling

An editor mode where designers click tiles in the viewport to make them valid or invalid. Their changes stay when the volume moves or the grid rebuilds, and each level's grid is saved in its own data asset, so they get the normal "unsaved changes" flow instead of a separate save button.

<video src="/assets/video/projects/phasebreak/automatic_data_asset_saving_on_tile_changed.mp4" width="100%" autoplay muted loop playsinline controls title="Changing tiles in the tile editor mode"></video>

![Drag selecting multiple tiles](/assets/img/projects/phasebreak/gridvolume_v2.2_drag_selection_for_tiles.png)

Tiles a designer changed by hand stay the way they set them, even when the volume moves.

<video src="/assets/video/projects/phasebreak/grid_keep_modified.mp4" width="100%" autoplay muted loop playsinline controls title="Hand-edited tiles staying when the volume moves"></video>

The settings for how the grid gets generated, like the tile size, how much of a tile needs to be covered and which height to use, are all on the grid generator, so designers can tune them per level.

![The grid generator settings](/assets/img/projects/phasebreak/grid_generator_details_rework_trace_channel.png)

### Helping the Team Use the Grid

Because almost every system in the game uses the grid, a lot of my work was helping others use it. Robin, for example, came to me with questions while working on his AI tool, like how to clear an occupant without destroying its grid entity component, and how to get all tiles of a type in the editor. Timmy asked me to help with a performance issue in `DrawGrid`, which we fixed together over a call. Late in the project I also added events for when something on the grid gets added, moved, removed or swaps dimension, so other systems can react to that instead of recalculating everything.

<div class="image-pair">
  <div class="scroll-box"><img src="/assets/img/projects/phasebreak/grid_functions.png" alt="The grid functions available in Blueprint"></div>
  <div class="scroll-box"><img src="/assets/img/projects/phasebreak/grid_entity_events_bp.png" alt="The grid entity events in Blueprint"></div>
</div>

### Shipping the Game

In the final block I mostly fixed bugs to get the game ready for release. That included packaging failures, the grid data not loading when going from one level to another, visual effects not showing on top of the tile they were aimed at, the undo and redo buttons still working while an action was selected, and the telefrag health preview staying visible after swapping dimensions.

