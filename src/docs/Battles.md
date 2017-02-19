## Battles

Battles in FullScreenPokemon are driven by the [`Battles`](../src/components/Battles.ts) component and run by [BattleMovr](https://github.com/FullScreenShenanigans/FullScreenPokemon).
BattleMovr provides for keeping track of two teams of actors; `Battles` adds FullScreenPokemon-specific logic such as visualizing the battles.

### Simulating battles

Battles are generally started with `FSP.battles.startBattle`.
Its settings object requires a `teams` member that contains a descriptor for the `player` and `opponent`.

Each team descriptor requires an `actors` array of created Pokemon.
Those are most easily made with `FSP.utilities.createPokemon`.

Team descriptors can optionally also take a `leader` object that indicate the team is a trainer rather than a wild Pokemon.


```javascript
// Starts a battle with a wild level 50 Mew using the player's party
FSP.battles.startBattle({
    teams: {
        opponent: {
            actors: [
                FSP.utilities.createPokemon({
                    level: 50,
                    title: "MEW".split("")
                })
            ]
        },
        player: {
            actors: FSP.itemsHolder.getItem("PokemonInParty"),
            leader: {
                nickname: FSP.itemsHolder.getItem("name"),
                title: "Player".split("")
            }
        }
    }
});
```

```javascript
// Starts a battle against a bug catcher
FSP.battles.startBattle({
    teams: {
        opponent: {
            actors: [
                FSP.utilities.createPokemon({
                    level: 7,
                    title: "METAPOD".split("")
                }),
                FSP.utilities.createPokemon({
                    level: 7,
                    title: "METAPOD".split("")
                })
            ],
            leader: {
                nickname: "Bug Catcher".split(""),
                title: "BugCatcher".split("")
            }
        },
        player: {
            actors: [
                FSP.utilities.createPokemon({
                    level: 50,
                    title: "CHARIZARD".split("")
                })
            ],
            leader: {
                nickname: FSP.itemsHolder.getItem("name"),
                title: "Player".split("")
            }
        }
    }
});
```

