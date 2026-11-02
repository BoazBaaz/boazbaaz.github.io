---
title: "Pirate Game"
start_date: 2021-11-02
end_date: 2021-11-06
description: "Complete solo game featuring NavMesh AI, object pooling, and procedural world generation"
thumbnail: /assets/img/projects/placeholder.jpg
tags: [unity, csharp, solo, gameplay, glu, game]
featured: false
status: draft
team:
  programmer: [Boas-Bas van der Veen]
team-size: 1
role: "Solo Developer"
links:
  - { name: GitHub, url: "https://github.com/BoazBaaz/PirateGame", icon: fab fa-github, color: "#3a3a3f" }
---

## Overview

A pirate game I made on my own in one week, with enemies that chase you, loot to collect, a shop to spend it in, and a world that's laid out differently every time.

<div class="text-todo">Was this a school assignment at Grafisch Lyceum Utrecht or something you made for fun? Add a sentence about what the game is about and what the goal was.</div>

<div class="image-todo">A gameplay screenshot or GIF, also to use as the thumbnail instead of the placeholder.</div>

---

## What I Did

### Random World Layout

Loot boxes and enemies are spread randomly over the available tiles, and every used tile is removed from the list so nothing spawns on top of each other. Both use object pooling instead of creating new objects while playing.

### Enemies

Enemies use Unity's NavMeshAgent to chase the player when they're in range, and patrol otherwise.

<div class="image-todo">A GIF of an enemy noticing and chasing the player.</div>

### Shop

You collect resources from loot boxes and spend them in a shop to upgrade your stats. The items are defined as ScriptableObjects.

<div class="image-todo">A screenshot of the shop.</div>
