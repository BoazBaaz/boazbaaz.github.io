---
title: "Hot Reloading in Zentera: From 7.28ms to 0.012ms per Frame"
date: 2025-06-27 12:00:00 +0100
project: zentera
redirect_from: /blogs/zentera-engine-tools/
tags: [cpp, engine, tool, optimization, breda-university]
thumbnail: /assets/img/projects/zentera/hot_reloading_after_optimization.png
---

This article covers the hot reloading system I built for [Zentera](/projects/zentera/), a voxel puzzle platformer made in the custom Kudzu engine. Hot reloading let artists edit voxel models in MagicaVoxel and see the result in-engine right away, without restarting.

## How It Works

The system monitors the modification timestamp of every file used by a `Resource` and reloads that resource when the file changes on disk.

## The First Version

The first version checked every registered resource every frame by calling `std::filesystem::last_write_time`. That was fine at low asset counts but scaled badly. At production asset counts it cost **7.28ms per frame** and dropped the editor from 167fps to 86fps.

![Before optimization](/assets/img/projects/zentera/hot_reloading_before_optimization.png)

## The Redesign

I made three changes.

### 1. Check files, not resources

The original design checked each `Resource` on its own. Several resources can point at the same file, like a texture used by multiple materials, which meant the same file got checked multiple times. I added a `FileResource` struct that maps one file to all the resources that use it:

```cpp
struct FileResource {
    std::string filename;
    FileIO::Directory directory;
    uint64_t last_modified;
    std::vector<size_t> resource_ids;
};
```

Now every unique file gets checked once, no matter how many resources depend on it.

### 2. Queue the reloads

Instead of reloading inside the check loop, changed resources go into an `std::unordered_map` queue. This splits detection from reloading and fixes a subtle problem with how external tools save files.

A save isn't instant. For a few milliseconds the file can be empty or only partly written. If you reload the moment you see the timestamp change, the reload can fail on a half-written file. The queue retries failed reloads on later frames, with a timeout:

```cpp
for (auto it = reload_queue.begin(); it != reload_queue.end();) {
    const size_t id = it->first;
    int& counter = it->second;
    if (resources[id]->reload()) {
        it = reload_queue.erase(it);
        reloaded = true;
    } else {
        if (++counter >= RELOAD_TIMEOUT) {
            it = reload_queue.erase(it);
        } else { ++it; }
    }
}
```

### 3. Throttle the polling

File checking now runs once per second instead of every frame. Editors save a few times per second at most, so checking every frame was wasted work.

## Result

After the three changes the system averages **0.012ms per frame**, down from 7.28ms, and the editor stays at 167fps with the full asset count. That's roughly a **910x improvement**.

![After optimization](/assets/img/projects/zentera/hot_reloading_after_optimization.png)
