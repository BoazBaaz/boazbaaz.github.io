---
title: "ZombieZnake"
start_date: 2021-02-01
end_date: 2021-02-05
description: "International Game Jam entry where you play as a zombie infecting humans in a snake-like chain. All grid movement and collisions built from scratch in code."
thumbnail: /assets/img/projects/zombieznake/banner.png
banner: /assets/img/projects/zombieznake/banner.png
video: https://www.youtube.com/embed/tL_3l_RcgJM
tags: [unity, csharp, team, gameplay, gamejam]
featured: true
team:
  programmer: [Boas-Bas van der Veen, Oscar Wilhelmsson]
  artist: [Bart van Twillert, Kimberly G., Susanne Vermeulen]
team-size: 5
role: "Programmer"
links:
  - { name: Itch.io, url: "https://saltoc.itch.io/zombie-znake", icon: fab fa-itch-io }
  - { name: Game Jam Page, url: "https://itch.io/jam/international-educations-jam/rate/908946", icon: fas fa-trophy }
  - { name: GitHub, url: "https://github.com/poppzy/GameJamZombieTheme", icon: fab fa-github }
---

## Overview

ZombieZnake was made in 5 days for the **International Educations Game Jam 2021** (theme: "...and zombie") with an international team from the Netherlands and Sweden. You play as a zombie roaming a town -- infect humans to grow your zombie chain, but don't let your own zombies collide with each other. The game ranked **26th out of 34** entries.

All grid logic, movement, and collisions were built entirely from code rather than relying on Unity's built-in physics -- a deliberate choice for full control, though in hindsight Unity's tools would have been more practical for a 5-day jam.

![Gameplay](/assets/img/projects/zombieznake/gameplay.png)

---

## Grid System

The grid is generated from top-left to bottom-right. In retrospect, building it from bottom-left to top-right would have simplified the coordinate math.

```csharp
private void CreateGrid(float _width, float _length)
{
    for (int y = 0; y < _length; y++)
    {
        for (int x = 0; x < _width; x++)
        {
            m_Grid[x, y] = new Vector2(m_GridOffset.x + x, m_GridOffset.y - y);
        }
    }
}
```

---

## Player Movement

Movement is coroutine-based with a fixed tick rate. The snake chain updates head-first -- each segment takes the previous position of the one in front. Animator parameters are set per-segment for directional sprites.

```csharp
private IEnumerator Movement()
{
    while (healthScript.isAlive)
    {
        yield return new WaitForSeconds(GridManager.instance.m_MovementUpdate);

        Vector2 desiredPosition = grid.m_PlayerGridLocations[0].gridLocation;
        Vector2 previousPosition = Vector2.zero;

        switch (m_Faceing)
        {
            case Direction.Up:    desiredPosition += new Vector2(0, -1); break;
            case Direction.Down:  desiredPosition += new Vector2(0, 1);  break;
            case Direction.Left:  desiredPosition += new Vector2(-1, 0); break;
            case Direction.Right: desiredPosition += new Vector2(1, 0);  break;
        }

        for (int i = 0; i < m_PlayerZombies.Count; i++)
        {
            if (i != 0) desiredPosition = previousPosition;

            m_PlayerZombies[i].transform.position =
                grid.GetPlayerGridPosition((int)desiredPosition.x, (int)desiredPosition.y)
                * GridManager.instance.m_StepSize;

            previousPosition = grid.m_PlayerGridLocations[i].gridLocation;

            m_PlayerZombies[i].GetComponent<Animator>().SetFloat("X",
                desiredPosition.x - previousPosition.x);
            m_PlayerZombies[i].GetComponent<Animator>().SetFloat("Y",
                desiredPosition.y - previousPosition.y);

            grid.m_PlayerGridLocations[i] =
                new GridManager.GridObject(m_PlayerZombies[i], desiredPosition);
        }
    }
}
```

---

## Collision & Infection

All collision is grid-based -- no Unity physics involved. The `GetPlayerGridPosition` function handles three cases: boundary death, self-collision death, and human infection (which grows the chain and updates the score).

```csharp
public Vector2 GetPlayerGridPosition(int xVariable, int yVariable)
{
    IDamagable IDamageble = PlayerController.instance.GetComponent<IDamagable>();

    // Boundary check -- kill player if out of bounds
    if (xVariable < 0 || xVariable >= m_GridSize.x ||
        yVariable < 0 || yVariable >= m_GridSize.y)
    {
        if (IDamageble != null)
        {
            IDamageble.ChangeHealth(-IDamageble.healthpoints);
            return m_Grid[(int)m_PlayerGridLocations[0].gridLocation.x,
                          (int)m_PlayerGridLocations[0].gridLocation.y];
        }
    }

    // Self-collision -- kill player if head hits body
    for (int i = 1; i < m_PlayerGridLocations.Count; i++)
    {
        if (m_PlayerGridLocations[0].gridLocation == m_PlayerGridLocations[i].gridLocation)
            IDamageble.ChangeHealth(-IDamageble.healthpoints);
    }

    // Human infection -- eat human, grow chain, add score
    for (int i = 0; i < m_HumanGridLocations.Count; i++)
    {
        if (m_PlayerGridLocations[0].gridLocation == m_HumanGridLocations[i].gridLocation)
        {
            Destroy(m_HumanGridLocations[i].gridObject);
            m_HumanGridLocations.RemoveAt(i);
            UI_Manager.instance.AddScore(1);

            GameObject zombie = Instantiate(
                PlayerController.instance.m_ZombiePrefab,
                PlayerController.instance.gameObject.transform);
            PlayerController.instance.m_PlayerZombies.Add(zombie);
            m_PlayerGridLocations.Add(new GridObject(zombie,
                m_PlayerGridLocations[m_PlayerGridLocations.Count - 1].gridLocation));
        }
    }

    return m_Grid[xVariable, yVariable];
}
```

---

## Technologies

- **Engine:** Unity 2D
- **Language:** C#
- **Key Systems:** Custom grid, coroutine movement, IDamagable interface, animator blending
- **Event:** International Educations Game Jam 2021
