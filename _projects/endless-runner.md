---
title: "Endless Runner"
start_date: 2021-02-08
end_date: 2021-02-18
description: "Team project featuring a vertical endless runner with dynamic platform spawning using bitshift collision detection"
thumbnail: /assets/img/projects/endlesstunner/thumbnail.png
background: /assets/img/projects/endlesstunner/background.png
tags: [unity, csharp, team]
featured: false
team:
  programmer: [Boas-Bas van der Veen, Luca Mouissie]
  artist: [Wesley Chan, Alicia van Altena]
team-size: 4
role: "Programmer & Scrum Master"
links:
  - { name: GitHub, url: "https://github.com/BoazBaaz/EndlessRunner", icon: fab fa-github, color: "#3a3a3f" }
---

## Overview

A two-week team project focused on both game development and learning Scrum methodology. We decided early on to keep the scope small and achievable, settling on a 2D game after a team-wide poll chose "Hell" as the theme. I took on the role of Scrum Master alongside programming, keeping the team on track with standups and sprint tasks.

The game is a vertical endless runner -- instead of running sideways, the player descends deeper into Hell. Platforms spawn below the camera and scroll upward. Your score is the number of seconds you survive, and the goal is to reach the deepest point of Hell to find a portal back to Earth. Fall off-screen and you're dead.

<div class="video-embed">
  <iframe src="https://www.youtube.com/embed/BKa8aL9P0iY" title="Endless Runner Gameplay" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

---

## What I Did

### Platform Spawning System

Built the core platform spawning system, which I'm still proud of for this stage of my development. Rather than spawning platforms and removing them if they overlapped with something, I wrote a pre-spawn check that uses `Physics2D.OverlapAreaAll` with Unity's layermask bitmask system to verify there's room before anything gets instantiated. This was my first time working with bitwise operations in a practical context.

### Player Controller

Implemented the player movement using force-based physics with a velocity dampening system for responsive directional changes. The player has boundary checks on both axes -- walls on the sides and death zones above and below the camera.

### Team Lead & Code Quality

As Scrum Master I kept the team organized with regular check-ins and managed the sprint board. I also went through all scripts -- including those written by teammates -- and added documentation and comments throughout the codebase.

![Gameplay](/assets/img/projects/endlesstunner/gameplay.png)
