---
title: "Type.EVE"
start_date: 2021-01-04
end_date: 2021-01-29
description: "AI project implementing complex behavior tree system for strategic unit control and decision-making"
thumbnail: /assets/img/projects/placeholder.jpg
tags: [unity, csharp, ai, team]
featured: false
team:
  programmer: [Boas-Bas van der Veen, Justin Comans]
team-size: 2
role: "AI Programmer"
links:
  - { name: GitLab Repository, url: "https://gitlab.glu.nl/rbalkenende/SteeringBehaviorGame/-/tree/G25_Type.EVE", icon: fab fa-gitlab }
  - { name: Trello, url: "https://trello.com/b/ncOBEXRk/typeeve", icon: fab fa-trello }
---

## Overview

School project focused on implementing Behavior Trees for AI control. Created a strategic game where AI units make complex decisions using hierarchical behavior tree structures.

## Technical Focus: Behavior Trees

Implemented a comprehensive behavior tree system with over 600 lines of AI logic, featuring sequences, selectors, conditions, and actions for strategic unit control.

## Code Highlight

Behavior tree builder showing hierarchical decision-making structure:

```csharp
private RootNode BuildBehaviourTree() {
    return new RootNode(new Selector(new List<Node>() {
        new Sequence(new List<Node>() {
            new Condition(NormalBehaviour) { Name="AggressiveCheck" },
            new Action(ToPursue) { Name="ToPursue" },
            new Sequence(new List<Node>() {
                new Condition(CanAttackTarget) { Name="CanAttackTarget" },
                new Action(ToIdle) { Name="ToIdle" },
                new Sequence(new List<Node>() {
                    new Action(DealDamage) { Name="DealDamage" },
                    new RepeatUntilFailure(new Condition(TargetDied)) { Name="TargetDied" }
                })
            }) { Name="AttackTarget" },
        }) { Name="NormalBehaviour" },
        
        new Sequence(new List<Node>() {
            new Condition(UsingWaypoints) { Name="DefensiveCheck" },
            new Action(ToPursue) { Name="ToPursue" },
            new Selector(new List<Node>() {
                // ... waypoint and attack logic
            })
        }) { Name="WaypointBehaviour" },
    }));
}
```

## Technologies

- **Engine:** Unity3D
- **Language:** C#
- **Key Systems:** Behavior Trees, AI, NavMesh, coroutines
- **Libraries:** TextMeshPro
