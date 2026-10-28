---
title: "Pirate Game"
start_date: 2021-11-02
end_date: 2021-11-06
description: "Complete solo game featuring NavMesh AI, object pooling, and procedural world generation"
thumbnail: /assets/img/projects/placeholder.jpg
tags: [unity, csharp, solo, gameplay, game]
featured: false
team:
  programmer: [Boas-Bas van der Veen]
team-size: 1
role: "Solo Developer"
links:
  - { name: GitHub, url: "https://github.com/BoazBaaz/PirateGame", icon: fab fa-github, color: "#3a3a3f" }
---

## Overview

A solo project built in one week featuring NavMesh AI enemies, object pooling, a shop system with resource management, and procedurally generated world layouts.

## What I Did

### Procedural World Generation

Built a spawn system that randomly distributes loot boxes and enemies across available tiles, removing used tiles to prevent overlaps. Uses object pooling for both enemies and loot boxes to avoid runtime instantiation.

### NavMesh AI

Enemies use Unity's NavMeshAgent for pathfinding, chasing the player when in range and patrolling otherwise.

### Shop & Resource System

Players collect resources from loot boxes and spend them in a shop to upgrade stats. Uses ScriptableObjects for item definitions.
