# Map Spawning

Individual sections of the overworld are stored as separate maps under `src/creators/mapLibrary`.
Areas register their neighbors by placing an `AreaSpawner` Actor on the border between the two areas:

```typescript
creation: [
    { actor: "AreaSpawner", width: 608, height: 544, map: "Route 1", area: "Land", direction: 0 },
    // ...
],
```

Once spawned into the game map, that `AreaSpawner` will kill itself and place an `AreaGate` on the border.
That `AreaGate`, when collided with, sets the active area and starts a new audio theme.

## Active Areas

`AreaSpawner`'s core logic only has awareness of the originally spawned area.
Use `FSP.mapScreener.activeArea` to get the currently active area.
