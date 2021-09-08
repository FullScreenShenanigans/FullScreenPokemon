# Walking

## Walking paths

Characters can be told to walk along a predefined path as per `WalkingInstructions`.
Each "step" on that path must be either an instruction with the number of `blocks` in which `direction` or a lambda to generate them.
You can manually trigger a character to talk along a path using `FSP.walking.startWalkingOnPath`:

```typescript
FSP.walking.startWalkingOnPath(FSP.players[0], [
    {
        blocks: 1,
        direction: 2,
    },
    () => ({
        blocks: 4,
        direction: 3,
    }),
]);
```

### Following

If two characters are bordering, one may be told to follow the other.
This will prevent the follower from walking of its own accord; instead, it will mirror the path of its lead.

```typescript
// Assuming the player is bordering a character to the right
const player = FSP.players[0];
const borderingCharacter = player.bordering[1];

FSP.following.startFollowing(player, borderingCharacter);
```

## Wild Pokemon

When walking in grass, within a cave, or while in surf mode, the player will randomly encounter wild Pokemon.
This is checked in the `Walking` component's `continueWalking`, which, if a given Actor is a player, checks for cave, grass, or water battle starts.

Which Pokemon may be encountered by an area are stored within the area's `wildPokemon` member, which may specify `grass`, `fishing`, `surfing`, and/or `walking`.
See `AreaWildPokemonOptionGroups`.

### Grass

When a character collides with a `Grass` actor, several changes happen to the character:

-   The grass is stored as a member of the character.
-   The character's height is reduced.
-   The character is given a "shadow" that appears to be the character's body partially hidden by grass.

Once the character is no longer bording the grass, those changes are undone.

### Fishing

Starting the fishing routine is only allowed if the player is bording and facing a `WaterEdge*` Actor.
You can trigger a fishing session by providing a Player and a rod item to `fishing.startFishing`:

```typescript
const player = FSP.players[0];
const rod = FSP.constants.items.byName["Good Rod"];

FSP.fishing.startFishing(player, rod);
```

See [Battles](./docs/battles.md) for how to trigger battles in general.
