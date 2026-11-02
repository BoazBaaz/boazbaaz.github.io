---
title: "ZombieZnake"
start_date: 2021-02-01
end_date: 2021-02-05
description: "International Game Jam entry where you play as a zombie infecting humans in a snake-like chain. All grid movement and collisions built from scratch in code."
thumbnail: /assets/img/projects/zombieznake/thumbnail.png
background: /assets/img/projects/zombieznake/background.png
tags: [unity, csharp, team, gameplay, gamejam, glu, game]
featured: false
status: draft
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

ZombieZnake was made in 5 days for the **International Educations Game Jam 2021**, with the theme "...and zombie". The team was international, with two programmers and three artists from the Netherlands and Sweden. You play as a zombie walking around a town. Infect humans to grow your chain of zombies, but don't run into your own tail. The game placed **26th out of 34** entries.

![Gameplay](/assets/img/projects/zombieznake/gameplay.png)

---

## What I Did

### Grid and Movement

I built the grid and the movement from scratch instead of using Unity's physics. Every tick the head of the snake moves one tile, and every zombie behind it moves to where the one in front of it was, with its own directional sprite.

<div class="image-todo">A short GIF of the zombie chain moving through the town and turning corners.</div>

### Infection and Collision

All collisions are done by comparing grid positions. Moving off the grid or into your own tail kills you, and moving onto a human infects them, adding a new zombie to your chain and to your score.

<div class="image-todo">A GIF of infecting a few humans and the chain growing.</div>

Looking back, building it all on Unity's physics would have been more practical for a 5-day jam. But doing it myself taught me a lot about what an engine normally does for you.
