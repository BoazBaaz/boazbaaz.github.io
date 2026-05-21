---
title: "ZombieZnake"
start_date: 2021-02-01
end_date: 2021-02-05
description: "International Game Jam entry where you play as a zombie infecting humans in a snake-like chain. All grid movement and collisions built from scratch in code."
thumbnail: /assets/img/projects/zombieznake/thumbnail.png
background: /assets/img/projects/zombieznake/background.png
tags: [unity, csharp, team, gameplay, gamejam]
featured: false
team:
  programmer: [Boas-Bas van der Veen, Oscar Wilhelmsson]
  artist: [Bart van Twillert, Kimberly G., Susanne Vermeulen]
team-size: 5
role: "Programmer"
links:
  - { name: Itch.io, url: "https://saltoc.itch.io/zombie-znake", icon: fab fa-itch-io, color: "#FA5C5C" }
  - { name: Game Jam, url: "https://itch.io/jam/international-educations-jam/rate/908946", icon: fas fa-trophy, color: "#E67E22" }
  - { name: GitHub, url: "https://github.com/poppzy/GameJamZombieTheme", icon: fab fa-github, color: "#3a3a3f" }
---

## Overview

ZombieZnake was made in 5 days for the **International Educations Game Jam 2021** (theme: "...and zombie") with an international team from the Netherlands and Sweden. You play as a zombie roaming a town -- infect humans to grow your zombie chain, but don't collide with your own tail. The game ranked **26th out of 34** entries.

![Gameplay](/assets/img/projects/zombieznake/gameplay.png)

---

## What I Did

### Custom Grid System

Built the entire grid and movement system from scratch rather than using Unity's built-in physics. The grid generates from top-left to bottom-right, with each cell tracked as a coordinate pair. In hindsight, building from bottom-left would have simplified the math, and relying on Unity's physics would have been more practical for a 5-day jam -- but it was a great learning experience in understanding what engines do for you under the hood.

### Snake Movement & Infection

Player movement runs on a coroutine-based tick system. Each tick, the head moves in the current direction and every body segment shifts forward to the previous position of the one in front of it. Animator parameters are set per-segment for directional sprites. When the head's grid position overlaps a human, the human is destroyed, a new zombie segment is added to the chain, and the score updates.

### Grid-Based Collision

All collision detection is handled through grid coordinate comparison -- no Unity physics involved. The system checks three cases every tick: boundary collision (instant death if the head moves off-grid), self-collision (death if the head overlaps any body segment), and human intersection (triggers infection and chain growth).
