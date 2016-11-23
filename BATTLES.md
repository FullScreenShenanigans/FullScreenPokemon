# Battles

A guide to battles.

## Starting Battles

The code below immediately initiates a battle with a level 1 Rattata.
It can be used before selecting "continue" after loading the FullScreenPokemon index.html file.
This is useful when repeatedly testing minor edits to battle animations.

```
var pokemonTitle = "RATTATA";
var pokemon = FSP.utilities.createPokemon({
    title: "RATTATA".split(""),
});

FSP.battles.startBattle({
    battlers: {
        opponent: {
            actors: [pokemon],
            name: pokemonTitle,
            category: "Wild",
            sprite: pokemonTitle + "Front"
        }
    }
});
```

When making short edits like timing/positioning changes, the Cutscenes.js file can be directly modified.
This avoids the use of "gulp" after editing the .ts file, which can take a while.
The .js file can either be modified with a text editor, or with the Chrome DevTools.


## Animation Additions

To create new animations, the function must be added in src/Cutscenes.ts with the following format:

```
public cutsceneBattleAttackAttackName(settings: IBattleCutsceneSettings, args: IBattleAttackRoutineSettings): void {
    ...
}
```

Additionally, a line must be added in src/Settings/Scenes.ts with the following format:

```
AttackAttackName: Cutscenes.prototype.cutsceneBattleAttackAttackName
```

## Sprite Additions

To create new sprites, two lines must be added in src/Settings/Objects.ts with the following format:

```
"SpriteName": {}

"SpriteName": [x, x]
```

Additionally, a line must be added in src/Settings/Sprites.ts with the following format:

```
"SpriteName": "p[x,y,z]......................"
```

If sprites don't look right, you either need to get a better picture of the sprite, or you need to change the x values in the Objects.ts file.