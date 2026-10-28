---
title: "What I Learned Modifying Unreal Engine 5 Source Code"
date: 2025-10-30 12:00:00 +0100
tags: [cpp, unreal-engine, shader, breda-university]
thumbnail: /assets/img/blogs/ue5-source/thumbnail.png
---

For my Year 3 self-study project, I forked Unreal Engine 5's source code to improve the Custom Expression node in the material editor. I wanted to add support for global code (structs, helper functions), external HLSL file importing, and include guards. I got most of it working, but the bigger lesson was about when source modification is the right approach -- and when it isn't.

## The Problem

UE5's Custom Expression node lets you write HLSL in the material editor. The problem is that everything you type gets wrapped inside a function called `CustomExpression0()`. That means you can't define structs, helper functions, or anything that lives outside a function scope. If you need shared utility code across multiple Custom Expression nodes, you're stuck copying it everywhere.

## Navigating the Source

The Custom Expression node has three layers:

- **SGraphNodeMaterialCustom** -- the Slate UI widget (the text box you type in)
- **UMaterialExpressionCustom** -- the data model (stores your code, pins, etc.)
- **HLSLMaterialTranslator** -- the compiler (turns your code into actual shader code)

Finding this took a couple of weeks of reading through UE5's source. The codebase is massive, and there's no clear entry point. I traced backwards from error messages and function names like `FindHlslIdentifierInCode` until I understood the full pipeline.

## What I Built

### HLSL Parsing

The core change was a function called `ParseCustomExpressionCodeSections` that separates user code into two parts: code inside `void main() { ... }` goes into the wrapped `CustomExpression0()` function as before, and everything outside it gets placed at the global scope in the generated shader.

The parser tracks brace depth to find where `main` starts and ends. Anything outside that block -- structs, constants, helper functions -- gets extracted as global code.

### Include Guards

When multiple Custom Expression nodes share global code (via copy-paste or imports), you get redefinition errors. I added automatic include guards using `GetTypeHash()` on the content string. Each unique block of global code gets a `#ifndef` / `#define` wrapper with a hash-based name, preventing duplicates.

### External File Import

Added a button to the node UI that opens a file picker (using `IDesktopPlatform`) and reads an external `.hlsl` file into the code field. This lets you write shader code in a proper editor with syntax highlighting and import it into UE5.

## The Real Lesson

All of this worked. But during the block I realized that modifying engine source code is almost never the right approach for this kind of feature. A source fork means:

- You can't easily update to new engine versions
- Other team members need the same fork
- Epic could change the underlying systems at any time

The same functionality could be achieved with an editor plugin that extends the material editor without touching engine code. Plugins are modular, shareable, and survive engine updates. If I were to revisit this project, I'd build it as a plugin from day one.

That said, I don't regret the source approach for a self-study project. I learned how UE5's material pipeline works from the inside, how Slate UI is structured, and how the HLSL translator processes code. That knowledge is valuable regardless of the delivery method.
