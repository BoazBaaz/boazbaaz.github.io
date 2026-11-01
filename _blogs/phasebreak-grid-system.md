---
title: "Building a Two-Dimension Grid System for PhaseBreak"
date: 2026-06-19 12:00:00 +0100
project: phasebreak
tags: [unreal-engine, cpp, tool, architecture, breda-university]
thumbnail: /assets/img/blogs/phasebreak-grid/after_trace_channel_rework.png
---

For [PhaseBreak](/projects/phasebreak/), a turn-based tactical heist game in Unreal Engine 5, I owned the grid system. Movement, AI pathfinding, cover and dimension swapping all read from it. This article covers how it's structured, how tiles get evaluated from level geometry, and what I'd change if I built it again.

The system went through several rewrites over three blocks. What's below is where it ended up.

## The Requirements

Two things made this grid harder than a normal tactics grid.

First, the game has two dimensions that occupy the same physical space. A wall can exist in one dimension and not the other, so every tile needs its own state per dimension.

Second, the level designers had to be able to work without a programmer. They build a level, drop a volume over it, and the grid should follow the geometry. When they need to, they override individual tiles by hand, and those overrides have to survive when the grid regenerates.

## Architecture

The structure is inspired by Unreal's navigation system, which splits a data-owning actor (`ARecastNavMesh`) from the system that manages it.

`AGridSystemV1` is an abstract `AActor` that owns all tile data and tracks the grid volumes. `AGridGenerator` is the concrete child that owns the evaluation settings and the sweep logic. Volumes are thin authoring shapes. They tell the system when their bounds change, but they don't own any data.

I considered putting the data on a `UWorldSubsystem` instead. That would work for storage, but a subsystem has no actor in the world, so there's no details panel for designers to configure tile size, coverage or the trace channel. Keeping the data on an actor gave them something to click on.

The code is split over two modules. `GridSystem` is the runtime module, and `GridEditor` holds the editor mode and the tooling. The game's target only includes `GridSystem`, so editor code can't end up in a cooked build.

### Data Layout

Tile data is stored per dimension:

- `FTileData` holds a tile's state, its height, and a `Modified` flag for manual overrides.
- `FDimensionData` holds a `TMap<FIntPoint, FTileData>` of tiles and a `TMap<FIntPoint, TWeakObjectPtr<AActor>>` of occupants.
- `AGridSystemV1` holds `FDimensionData m_Dimensions[TOTAL_TILE_DIMENSIONS]`.

`TOTAL_TILE_DIMENSIONS` is a single define. The dimension array, the evaluation loop and the dirty processing all loop over it, so a third dimension would mostly be a one-number change.

Every dimension access goes through a check that logs a warning instead of crashing, because the dimension index often comes straight from a Blueprint:

```cpp
bool AGridSystemV1::IsValidDimension(const int32 Dimension)
{
    if (Dimension >= 0 && Dimension < TOTAL_TILE_DIMENSIONS) return true;
    UE_LOG(LogGridSystem, Warning, TEXT("IsValidDimension: Invalid dimension index %d (max %d)"),
        Dimension, TOTAL_TILE_DIMENSIONS - 1);
    return false;
}
```

## Only Evaluating What Changed

Early on, moving a volume re-evaluated every tile it covered. For a 20x20 volume that's 400 sweeps per drag, which made the editor unusable while building levels.

The system now keeps a `TSet<FIntPoint>` of dirty coordinates. When a volume's bounds change, it compares the old and new rectangles and only dirties the difference: tiles that left the volume and tiles that entered it. That scales with the perimeter of the move instead of the area of the volume. Height changes dirty the overlapping region, and changing a generator setting like tile size dirties everything. Dirty tiles are processed on tick.

Tiles a designer edited by hand have `Modified` set, and evaluation skips them, so manual work isn't overwritten.

## Which Dimension Does Geometry Belong To

Both dimensions are overlapping geometry in the same space, so evaluation needs to know which dimension each hit belongs to. The options I looked at were a trace channel per dimension, actor tags, or a separate sweep per dimension. Channels and tags both need setup on every asset, and two sweeps doubles the cost.

I went with Custom Primitive Data. Meshes already carried a CPD value for which dimension they belong to, which their materials use, so evaluation reads that same value from each hit component. Value 0 means dimension one, 1 means dimension two, and geometry without the value counts for both. No extra setup for designers.

![Grid refactor showcase](/assets/img/blogs/phasebreak-grid/showcase_grid_refactor_v3_2.png)

## Evaluating a Tile

In the final version, each tile gets one `OverlapMultiByChannel` with a column-shaped box, on a dedicated GridTrace channel. Geometry generates tiles by default. Objects that shouldn't, opt out by setting their GridTrace response to Ignore. This replaced an older component designers had to attach to blocking objects, which they never used because set dressing first had to be turned into an actor.

Coverage is checked by splitting the tile into a grid of cells and testing each cell against the XY bounds of the overlapping components. That tells you whether geometry actually covers part of the tile, not just whether something is near its center:

```cpp
for (int32 cy = 0; cy < resolution; ++cy)
{
    for (int32 cx = 0; cx < resolution; ++cx)
    {
        const float cellMinX = tileMinX + cx * cellSize;
        const float cellMaxX = cellMinX + cellSize;

        // ...skip this cell if it's blocked

        for (const FCompBounds& b : dimValid[dim])
        {
            if (Overlaps2D(cellMinX, cellMinY, cellMaxX, cellMaxY,
                b.MinX, b.MinY, b.MaxX, b.MaxY))
            {
                validCells++;
                break;
            }
        }
    }
}

const float coverage = static_cast<float>(validCells) / static_cast<float>(totalCells);
if (coverage >= MinCoveragePercent * 0.01f)
    OutResults[dim].TileState = ETileState::VALID;
```

Tile height comes from the top of the component bounds. When several components overlap a tile, designers pick which height to use. Median is there for geometry with outliers, like thin trim that sits above the walkable floor:

```cpp
allHeights.Sort();
switch (HeightMode)
{
  case ETileHeightMode::Lowest:
    OutResults[dim].Height = allHeights[0];
    break;
  case ETileHeightMode::Highest:
    OutResults[dim].Height = allHeights.Last();
    break;
  case ETileHeightMode::Median:
    OutResults[dim].Height = allHeights[allHeights.Num() / 2];
    break;
}
```

![Before the evaluation rework](/assets/img/blogs/phasebreak-grid/before_trace_channel_rework.png)

![After the evaluation rework](/assets/img/blogs/phasebreak-grid/after_trace_channel_rework.png)

Before the rework, tiles showed up where there was no geometry. After it, they don't.

## Saving the Grid

Each level's grid is stored in a `UGridDataAsset`. The generator references it with a `TSoftObjectPtr`, so the cooker follows the reference into the build and the asset isn't loaded until it's needed.

This part caused more bugs than anything else. My first auto-save called `UPackage::SavePackage` on every change. While a designer dragged a volume, that meant rapid repeated writes, the Windows file operation failed, and the editor crashed. A forced save on startup crashed the engine on launch for the same reason.

The fix was to stop writing to disk myself. Grid changes fire a delegate, and the handler compares the in-memory data with the asset and marks it dirty when something changed:

```cpp
OnTilesChanged.AddUObject(this, &AGridSystemV1::SyncDataAsset);
OnTileSizeChanged.AddUObject(this, &AGridSystemV1::SyncDataAsset);
OnTileOffsetChanged.AddUObject(this, &AGridSystemV1::SyncDataAsset);
```

```cpp
void AGridSystemV1::SyncDataAsset()
{
    UGridDataAsset* dataAsset = GridDataAsset.LoadSynchronous();

    // ...compare the data in memory with the data in the asset

    if (changed)
        dataAsset->Modify();
}
```

Designers now get the normal Unreal "unsaved changes" flow. That was also what they asked for, since they didn't want temporary changes while testing in PIE to overwrite the asset on disk.

## Grid Entity Events

Late in the project I added events to the grid entity component, which every unit on the grid has. They fire when the entity is added, moved, removed, or swaps dimension, and they're bindable from both C++ and Blueprint:

```cpp
DECLARE_DYNAMIC_MULTICAST_DELEGATE_TwoParams(FOnGridEntityMoved, FIntPoint, OldCoordinate, FIntPoint, NewCoordinate);
DECLARE_DYNAMIC_MULTICAST_DELEGATE_TwoParams(FOnGridEntityDimensionSwapped, int32, OldDimension, int32, NewDimension);

UPROPERTY(BlueprintAssignable, Category = "Grid|Events")
FOnGridEntityMoved OnMoved;

UPROPERTY(BlueprintAssignable, Category = "Grid|Events")
FOnGridEntityDimensionSwapped OnDimensionSwapped;
```

The goal was to let systems react to a unit moving instead of recalculating everything all the time. Cover was the main offender. It recalculated every cover and unit relation in the level whenever anything moved, and it showed up clearly in Unreal Insights. I started reworking it to cache which covers each enemy can see, but didn't finish before release. The fix that shipped, which Justin and I worked out together, only recalculates while the move action is selected, because that's the only time the player sees that data.

## What I'd Do Differently

The evaluation still isn't fast. Big maps mean a lot of physics queries. Doing a single overlap for the whole volume and computing coverage from the component bounds myself would cut that down a lot, at the cost of bounds being less accurate than the real mesh shape.

Near the end I also started splitting the system's responsibilities more cleanly. After 12 hours I stopped, together with the lead programmer. Finishing it meant checking out the whole grid system, blocking the other programmers, and replacing every grid Blueprint node right before release. Cleaner code wasn't worth that at that point.

Looking back, I iterated on this system a lot and judged it mostly by whether it felt right in the editor. On my current project I'm validating architecture decisions with unit tests, stress tests and profiling instead.
