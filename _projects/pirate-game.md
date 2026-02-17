---
title: "Pirate Game"
date: 2021-11-06
start_date: 2021-11-02
end_date: 2021-11-06
description: "Complete solo game featuring NavMesh AI, object pooling, and procedural world generation"
# thumbnail: /assets/img/projects/pirate-game.png
categories:
  - Game
tags:
  - unity
  - csharp
  - solo
  - gameplay
featured: false

# Team
team:
  programmer:
    - boas-bas

team-size: 1
duration: "1 week"
role: "Solo Developer"
status: "Completed"

links:
  - name: GitHub Repository
    url: https://github.com/BoazBaaz/PirateGame
    icon: fab fa-github
---

## Overview

Early project demonstrating NavMesh AI implementation and procedural generation. Features enemy AI, resource collection, shop system, and randomized world layouts.

## Key Features

- **NavMesh AI:** Enemy pathfinding and behavior
- **Object Pooling:** Efficient enemy and lootbox management
- **Procedural Generation:** Random world layouts with collision-free spawning
- **Shop System:** Resource management and upgrades
- **3D to 2D Controller:** Top-down movement in 3D space

## Code Highlight

World generation with randomized spawning and object pooling:

```csharp
private void SpawnObjectsOnTiles(Transform[] spawnedObjects) {
    for (int i = 0; i < spawnedObjects.Length; i++) {
        int randomInt = Random.Range(0, m_AvailableSpawnTiles.Count);
        spawnedObjects[i] = m_AvailableSpawnTiles[randomInt];
        m_AvailableSpawnTiles.RemoveAt(randomInt);
        
        if (spawnedObjects == lootBoxSpawnTiles) {
            GameObject lootBoxOBJ = GameManager.instance.lootBoxPool.GetObjectFromPool();
            lootBoxOBJ.transform.position = spawnedObjects[i].position;
            lootBoxOBJ.transform.rotation = Quaternion.identity;
        } else if (spawnedObjects == enemySpawnTiles) {
            GameObject enemyOBJ = GameManager.instance.enemyPool.GetObjectFromPool();
            enemyOBJ.transform.position = new Vector3(
                spawnedObjects[i].position.x, -0.5f, spawnedObjects[i].position.z
            );
            enemyOBJ.GetComponent<Enemy>().Initialize();
        }
    }
}
```

## Technologies

- **Engine:** Unity3D
- **Language:** C#
- **Key Systems:** NavMeshAgent, Object Pooling, Scriptable Objects, Grid Layout
- **Design Patterns:** Singleton, Object Pool
