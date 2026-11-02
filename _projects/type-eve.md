---
title: "Type.EVE"
start_date: 2021-01-04
end_date: 2021-01-29
description: "AI project implementing a behavior tree system for strategic unit control and decision-making"
thumbnail: /assets/img/projects/placeholder.jpg
tags: [unity, csharp, behaviour-tree, glu, game]
featured: false
status: draft
team:
  programmer: [Boas-Bas van der Veen, Justin Comans]
team-size: 2
role: "AI Programmer"
links:
  - { name: GitLab, url: "https://gitlab.glu.nl/rbalkenende/SteeringBehaviorGame/-/tree/G25_Type.EVE", icon: fab fa-gitlab, color: "#FC6D26" }
---

## Overview

A school project at Grafisch Lyceum Utrecht where we made a strategy game around AI, with two programmers. The units decide what to do with behavior trees: chase a target, attack when it's in range, patrol a route, or retreat when their health is low.

<div class="image-todo">A gameplay screenshot or GIF of the units fighting, also to use as the thumbnail instead of the placeholder.</div>

---

## What I Did

### Behavior Trees

I built the behavior tree framework, with sequences, selectors, conditions, actions and repeat-until-failure nodes. Every frame the tree is evaluated from the top down and picks between aggressive behavior, chasing and attacking, and defensive behavior, patrolling waypoints and attacking when the chance is there.

### Unit AI

Every unit runs its own behavior tree, with its own settings for how far it looks for enemies, its attack cooldown and its patrol route. Units move with Unity's NavMeshAgent.

<div class="image-todo">A GIF of a unit switching from patrolling to chasing and attacking when an enemy comes in range.</div>
