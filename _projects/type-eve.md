---
title: "Type.EVE"
start_date: 2021-01-04
end_date: 2021-01-29
description: "AI project implementing a behavior tree system for strategic unit control and decision-making"
thumbnail: /assets/img/projects/placeholder.jpg
tags: [unity, csharp, ai, team, game]
featured: false
team:
  programmer: [Boas-Bas van der Veen, Justin Comans]
team-size: 2
role: "AI Programmer"
links:
  - { name: GitLab, url: "https://gitlab.glu.nl/rbalkenende/SteeringBehaviorGame/-/tree/G25_Type.EVE", icon: fab fa-gitlab, color: "#FC6D26" }
---

## Overview

A two-person project focused on AI decision-making. Built a strategic game where units make hierarchical decisions using behavior trees -- pursuing targets, attacking when in range, patrolling waypoints, and retreating when health is low.

## What I Did

### Behavior Tree System

Implemented a full behavior tree framework with sequences, selectors, conditions, actions, and repeat-until-failure nodes. The tree evaluates top-down each frame, choosing between aggressive behavior (chase and attack) and defensive behavior (waypoint patrol with opportunistic attacks). Over 600 lines of AI logic.

### Unit AI

Each unit runs its own behavior tree instance with configurable parameters for aggression range, attack cooldowns, and waypoint routes. Units use NavMeshAgent for pathfinding and switch between idle, pursue, and attack states based on tree evaluation.
