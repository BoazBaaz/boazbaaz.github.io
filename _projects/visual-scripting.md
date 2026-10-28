---
title: "Visual Scripting Language"
start_date: 2024-11-11
end_date: 2025-01-17
description: "A node-based visual scripting system inspired by Unreal Engine Blueprints, built as a self-study project with typed pins, topological execution, and an ImGui node editor."
thumbnail: /assets/img/projects/visual-scripting/nodes_banner.png
tags: [cpp, tool, solo, breda-university]
featured: false
team:
  programmer: [Boas-Bas van der Veen]
team-size: 1
role: "Solo Developer"
links:
  - { name: GitHub, url: "https://github.com/BredaUniversityGames/2425-Y2B-PR-230896", icon: fab fa-github, color: "#3a3a3f" }
---

## Overview

A self-study project to build a visual scripting system inspired by Unreal Engine's Blueprint system. The goal was to create something where non-programmers could wire together logic visually, with execution handled under the hood through a sorted graph. Built on top of the Bee engine's ECS.

![Node Editor](/assets/img/projects/visual-scripting/nodes_banner.png)

## What I Did

### Pin & Node System

Designed a typed pin system using a `BasePin` base class and a templated `Pin<T>` that holds the actual data. Pins support custom operators so you can write node logic like `m_result = m_left * m_right` directly. Creating a new node type is straightforward: inherit from `BaseNode`, register your pins, and override `Execute`.

### Node Registry

Built a registration system using macros inspired by the cereal library. Any node type can register itself with a single macro call, making it available in the editor's right-click menu at runtime. Nodes are grouped by category (math, conversions, logic, etc).

### Execution Graph

The graph sorts its nodes using topological sort based on pin connections, then executes them in order every frame while the engine is in play mode. Connecting and disconnecting pins automatically updates the execution order.

![Node Connections](/assets/img/projects/visual-scripting/node_connections.gif)

### Reflection

Looking back, I'm not fully satisfied with the type safety of the pin system -- it relies on runtime `dynamic_cast` checks rather than compile-time guarantees. If I were to redo this, I'd look into stronger type erasure patterns or a variant-based approach. That said, this project directly led to the blog post on storing dynamic data types, which explored the underlying problem in depth.
