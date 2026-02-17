---
title: "ZombieZnake"
date: 2021-02-05
start_date: 2021-02-01
end_date: 2021-02-05
description: "International GameJam project combining snake mechanics with zombie theme, featuring custom grid-based movement system"
# thumbnail: /assets/img/projects/zombieznake.png  
categories:
  - Game
tags:
  - unity
  - csharp
  - team
  - gameplay
featured: false

# Team (International - NL/Sweden)
team:
  programmer:
    - boas-bas
    - oscar-wilhelmsson
  artist:
    - bart-van-twillert
    - kimberly-g
    - susanne-vermeulen

team-size: 5
duration: "5 days"
role: "Programmer"
status: "Completed"

links:
  - name: GitHub Repository
    url: https://github.com/poppzy/GameJamZombieTheme
    icon: fab fa-github
  - name: Miro Board
    url: https://miro.com/app/board/o9J_lZByE5k=/
    icon: fas fa-clipboard
  - name: Itch.io
    url: https://saltoc.itch.io/zombie-znake
    icon: fab fa-itch-io
---

## Overview

GameJam project developed in 5 days with an international team (Netherlands & Sweden). Theme: "...and zombie". Combined classic snake gameplay with zombie aesthetics.

## Key Technical Achievement

Designed and implemented a grid-based movement system allowing smooth directional snake movement across a 2D grid while maintaining classic snake mechanics.

## Code Highlight

Grid-based movement with coroutine timing and direction handling:

```csharp
private IEnumerator Movement() {
    while (healthScript.isAlive) {
        yield return new WaitForSeconds(GridManager.instance.m_MovementUpdate);
        
        Vector2 desiredPosition = grid.m_PlayerGridLocations[0].gridLocation;
        Vector2 previousPosition = Vector2.zero;
        
        // Direction-based movement
        switch (m_Facing) {
            case Direction.Up: desiredPosition += new Vector2(0, -1); break;
            case Direction.Down: desiredPosition += new Vector2(0, 1); break;
            case Direction.Left: desiredPosition += new Vector2(-1, 0); break;
            case Direction.Right: desiredPosition += new Vector2(1, 0); break;
        }
        
        // Update all snake segments
        for (int i = 0; i < m_PlayerZombies.Count; i++) {
            if (i != 0) desiredPosition = previousPosition;
            m_PlayerZombies[i].transform.position = 
                grid.GetPlayerGridPosition((int)desiredPosition.x, (int)desiredPosition.y) 
                * GridManager.instance.m_StepSize;
            previousPosition = grid.m_PlayerGridLocations[i].gridLocation;
            grid.m_PlayerGridLocations[i] = 
                new GridManager.GridObject(m_PlayerZombies[i], desiredPosition);
        }
    }
}
```

## Technologies

- **Engine:** Unity2D
- **Language:** C#
- **Key Systems:** Grid management, coroutines, snake mechanics
- **Team:** International collaboration (NL/Sweden)
