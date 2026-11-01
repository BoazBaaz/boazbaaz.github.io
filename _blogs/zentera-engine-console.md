---
title: "Building an Engine Console for Zentera"
date: 2025-06-27 11:00:00 +0100
project: zentera
tags: [cpp, engine, tool, breda-university]
thumbnail: /assets/img/projects/zentera/console_final.png
---

This article covers the debug console I built for [Zentera](/projects/zentera/), a voxel puzzle platformer made in the custom Kudzu engine. The console has two parts: a logger that captures output, and an ImGui window for reading it.

## Capturing Output with Stream Redirection

The logger redirects `stdout` and `stderr` to a log file using `freopen_s` and `_dup2`. That captures output from both engine code and external libraries like AngelScript, without changing any existing logging calls:

```cpp
fopen_s(&log_file, KUDZU_LOG, "wb+");
AllocConsole();
console_window = GetConsoleWindow();
hide_console();

FILE* empty = nullptr;
freopen_s(&empty, "CONOUT$", "wb", stdout);
freopen_s(&empty, "CONOUT$", "wb", stderr);

stdout_fd = _dup(_fileno(stdout));
stderr_fd = _dup(_fileno(stderr));

_dup2(_fileno(log_file), _fileno(stdout));
_dup2(_fileno(log_file), _fileno(stderr));
```

The important part is using `_dup` to save the original file descriptors before redirecting. That way output can be restored later, or sent to both the file and the console window at the same time.

## The Console Window

The ImGui console parses the log into typed entries. Each entry has a warning level (Info, Warning or Error, each with its own configurable color) and a source (Engine or Scripting), and both can be filtered on their own. There's text search across all entries, and auto-scroll that you can override by scrolling up manually.

Colors are saved to the editor settings, so every developer can set up their own view.

![Console](/assets/img/projects/zentera/console_final.png)

## Why the Log File Matters

Because everything goes to a file first, the log survives a crash. For artists and designers running release builds without a debugger, that made the console and its log file the main way to figure out what went wrong.
