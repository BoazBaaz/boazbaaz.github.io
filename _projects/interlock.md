---
title: "Interlock"
status: wip
start_date: 2026-09-01
end_date: 2027-01-29
description: "Roguelite deckbuilder and grid puzzle game in Unreal Engine 5, made in the first semester of my 4th year at Breda University of Applied Sciences."
thumbnail: /assets/gif/projects/interlock/combat_preview.gif
tags: [unreal-engine, cpp, tool, team, buas, game]
featured: true
team:
  programmer: [Boas-Bas van der Veen, Justin Comans]
  designer: [Nick Heutmekers]
team-size: 3
role: "Engine, Tools and Gameplay Programmer"
---

## Overview

Interlock is a roguelite deckbuilder where you play shape cards onto a 4x4 grid. Lining up elements like Fire, Water and Wood sets off combos in combat. The same cards are used to build paths through the overworld, and your hand, deck and discard pile are shared between both, so every card you spend on traveling is one you don't have in the next fight.

It's my graduation-year project at Breda University of Applied Sciences, running over the first semester of my fourth year, with a small team of two programmers and a designer.

![Combat preview](/assets/gif/projects/interlock/combat_preview.gif)

---

## What I'm Working On

### Card System

Cards are defined entirely in data: their element, shape and effects. That lets our designer create and balance new cards without a programmer touching code. Shapes are drawn in a custom editor widget instead of typed in as raw values.

<div class="image-todo">Screenshot of a card data asset in the editor, with the clickable shape grid and the effect list.</div>

### Combat and Enemy Intent

I'm responsible for the enemy and combat side. Before you commit to a move, the game previews what will happen: stat changes show up as ghost values, and enemies show what they plan to do this turn above their heads.

<div class="image-todo">GIF of placing a card and the ghost values and enemy intent icons updating before the turn ends.</div>
