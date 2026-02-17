---
title: "Endless Runner"
start_date: 2021-02-08
end_date: 2021-02-18
description: "Team project featuring a vertical endless runner with dynamic platform spawning using bitshift collision detection"
thumbnail: /assets/img/projects/placeholder.jpg
categories:
  - Game
tags:
  - unity
  - csharp
  - team
featured: false

team:
  programmer:
    - boas-bas
    - luca-mouissie
  artist:
    - wesley-chan
    - alicia-van-altena

team-size: 4
duration: "2 weeks"
role: "Programmer"

links:
  - name: GitHub Repository
    url: https://github.com/BoazBaaz/EndlessRunner
    icon: fab fa-github
  - name: Trello
    url: https://trello.com/b/mXPNTskb/endless-runner
    icon: fab fa-trello
---

## Overview

End-of-period team project creating a vertical endless runner. Players descend downward instead of moving horizontally, requiring careful platform spawning logic to ensure playability.

## Key Technical Challenge

The main challenge was implementing spawnable space detection using layermask bitshift operations to prevent platform overlap and ensure valid spawn locations.

## Code Highlight

Implemented a collision detection system using Physics2D.OverlapAreaAll with bitshift layer checking:

```csharp
private bool CalculateSpawnable(float _x, float _y, Vector2 _bounds) {
    Collider2D[] obstacles = Physics2D.OverlapAreaAll(
        new Vector2(_x - _bounds.x / 2, _y + _bounds.y / 2),
        new Vector2(_x + _bounds.x / 2, _y - _bounds.y / 2)
    );
    
    foreach (var obst in obstacles) {
        int obstLayer = 1 << obst.gameObject.layer;  // Bitshift layer
        bool hasLayer = (m_SpawnObstacles & obstLayer) == obstLayer;
        if (hasLayer) return false;
    }
    return true;
}
```

## Technologies

- **Engine:** Unity2D
- **Language:** C#
- **Key Systems:** Platform spawning, collision detection, layer masking
