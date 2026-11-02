---
title: "Changing the Unreal Engine 5 Source to Improve the Custom Expression Node"
date: 2025-10-30 12:00:00 +0100
status: draft
tags: [cpp, unreal-engine, shader, buas]
thumbnail: /assets/img/blogs/ue5-source/thumbnail.png
---

For my self-study project I forked the Unreal Engine 5 source code and changed how the Custom Expression node in the material editor compiles your code. You can now write global code like structs and helper functions in the node, import an external `.hlsl` file into it, and use the same global code in multiple nodes without redefinition errors. It was my first time working in the engine source instead of the plugin and Blueprint APIs.

<div class="image-todo">Screenshot of a Custom Expression node with a struct and a helper function above void main(), and the material compiling.</div>

## Why change the engine source

The Custom Expression node lets you write HLSL inside the material editor. But everything you type gets wrapped inside a function called `CustomExpression0()` by the `HLSLMaterialTranslator`. That means you can't define structs or helper functions, because those can't live inside a function. If you want the same utility code in multiple nodes, you have to copy it into every one of them.

This also meant a plugin wasn't an option. The behaviour I needed to change lives inside `HLSLMaterialTranslator`, which isn't exposed through any plugin API. There is no delegate or extension point for it, so the only way to change it is to change the engine source directly.

## Setting up the engine source

Before I could change anything I had to build the engine from source. Cloning the UE5 repository kept failing on my laptop, and it took me three tries to find out why: Windows has a 260 character path limit by default and the UE5 folder structure goes deeper than that. After enabling `LongPathsEnabled` in the registry I could follow Epic's setup guide (`Setup.bat`, `GenerateProjectFiles.bat` and a full source build). The first compile took about 6.5 hours.

## Finding where the node lives

The Custom Expression node is split over three layers:

- `SGraphNodeMaterialCustom`, the Slate UI (the text box you type in)
- `UMaterialExpressionCustom`, the data (your code, the pins, etc.)
- `HLSLMaterialTranslator`, the compiler that turns it into shader code

There is no documentation for how these connect, so I traced the path from `UMaterialExpressionCustom::Compile` through the translator to the generated HLSL, reading functions like `FindHlslIdentifierInCode` and `CustomExpressionSceneTextureInputFixup` along the way, until I knew where I could add global code without breaking everything.

## Parsing global code

The main change is a function called `ParseCustomExpressionCodeSections` that splits the code in the node into two parts. Code inside `void main() { ... }` goes into `CustomExpression0()` like before, and everything outside of it gets placed at the global scope of the shader. To find where `main` starts and ends, the parser keeps track of how deep it is in braces, so nested scopes like structs or if statements inside `main` don't end it early.

Old materials don't have a `void main()`. For those the code is treated the way it always was, so existing materials keep working.

<div class="text-todo">Add the ParseCustomExpressionCodeSections code (or a trimmed version) from your fork here.</div>

## Include guards

Once global code worked, I found out that two Custom Expression nodes with the same global code cause redefinition errors. To fix that, every block of global code gets wrapped in an `#ifndef` / `#define` guard, with the name generated from a hash of the code using `GetTypeHash()`. The same code always gets the same guard, so it only ends up in the shader once.

<div class="text-todo">Add the include guard generation code from your fork here.</div>

## Importing external files

I added an import button to the node. It opens a file picker using `IDesktopPlatform` and reads the file into the code field with `FFileHelper`. That way you can write your shader code in a proper editor with syntax highlighting and import it into Unreal.

<div class="image-todo">The "final" show and tell post: importing an external .hlsl file into the node, with the guard wrapping.</div>

## What I tried instead

My original goal was an "Enhanced Custom Expression Editor" with syntax highlighting, error checking and automatic pin generation. A lot of that didn't make it:

- **Line numbers.** I put a separate `SMultiLineEditableText` next to the code editor for the numbers. But Slate doesn't let you ask where a specific line is drawn in a `SMultiLineEditableTextBox`, and the code editor has its own internal margins. I tried matching fonts and adjusting padding, but after about 8 hours over three weeks I removed the feature.
- **Automatic pin generation.** I wanted to add input pins automatically based on the code. Every time I added pins from code, the material graph rebuilt and crashed. My lecturer told me to drop it and focus on something I could actually deliver.
- **Real-time error checking.** I looked into UE5's existing error reporting, and decided it was out of scope.
- **A separate Declarations text box.** Before the `void main()` parser, I tried adding a second text box for global code. It worked, but it broke serialization on existing materials, so I scrapped it.

## What I learned

- How to fork and build Unreal Engine 5 from source, including the long path issue.
- How Unreal splits a feature like this into a UI layer, a data layer and a compilation layer, and why that matters for where you make changes.
- How to build Slate UI, chaining methods like `.Padding()`, `.Text()` and `.OnClicked()`, and binding to data with `TAttribute` and `BindUObject()`.
- How to find my way around a codebase this big, and adapt to its file structure and coding style.
- My first parser. I started reading *Crafting Interpreters* to understand how parsers work, but in the end tracking brace depth was enough for this.

## Looking back

The block didn't go great. I lost momentum halfway through, stopped tracking my time after week 5, and only made four commits in eight weeks because I only committed when something felt done. The HLSL parsing ended up as about 35 hours under one task, when it was really four or five separate problems that only showed up one after the other.

I also spent too long on automatic pin generation before pivoting. Pivoting earlier would have given me more time to look into the `HLSLSyntaxTokenizer`. The biggest lesson for me is that without structure I find it very hard to work toward a goal, so now I track my time, commit often, and split big features into small tasks.
