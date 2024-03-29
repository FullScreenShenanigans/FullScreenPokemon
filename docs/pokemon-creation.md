## Pokemon Creation

The main file that handles Pokemon creation is [`Equations.ts`](../src/sections/Equations.ts).
`Equations.ts` includes functions for choosing random wild Pokemon and for creating the actual Pokemon object.
It also facilitates the creating of a wild Pokemon by preparing parameters then calling creation of the Pokemon object.

A newly created Pokemon's member types can be found in [`Battles.ts`](../src/sections/Battles.ts) under the `Pokemon` interface.

### Equations

`Equations.ts` contains the functions necessary for choosing a random Pokemon (`chooseRandomWildPokemon`), creating a new Pokemon (`newPokemon`), choosing that new Pokemon's statistics (`newPokemonStatistics`), and choosing a new Pokemon's IVs and EVs (`newPokemonIVs` and `newPokemonEvs`).

It also contains the function necessary for calling `newPokemon` in `Equations.ts` (`createPokemon`), which uses the chosen random Pokemon, from `Equations.ts` `chooseRandomWildPokemon`, to get the get the level of the chosen Pokemon and title which it then feeds to `newPokemon`.

### Unit Test and Trainer Battles

Pass into the `newPokemon` function from `Equations.ts` an object of type `INewPokemon`.
`INewPokemon` holds information on the Pokemon being created and eventually helps spit out a fully created Pokemon.

```javascript
const pokemonTitle: string[] = "CHARMANDER".split("");
const pokemonLevel: number = 10;
const pokemon: Pokemon = FSP.equations.newPokemon({
    level: pokemonLevel,
    title: pokemonTitle,
});
const pokemon: Pokemon = FSP.equations.newPokemon({
    item: "Potion".split(""),
    level: pokemonLevel,
    moves: [
        {
            title: "Ember",
            remaining: FSP.constants.moves.byName.Ember.pp,
            uses: FSP.constants.moves.byName.Ember.pp,
        },
    ],
    title: pokemonTitle,
});
```

### Wild Pokemon Encounter

The steps for creating a Pokemon in a wild Pokemon encounter are:

1. The `chooseWildPokemonForBattle` function is run.
   The grass `Map` and `Area` determine which wild Pokemon can be encountered by looking at the current location which is an object labeled `areas` that includes an object `wildPokemon` that holds what Pokemon can be found along with appearance rates.
2. After selecting a valid wild Pokemon that can be encountered `chooseRandomWildPokemon` is called and chooses a Pokemon from the list of valid Pokemon based on the chance of encountering that wild Pokemon.
3. Next, `createPokemon` is called which sets up an object of type `INewPokemon` containing information on the level and title of the chosen Pokemon.
4. `newPokemon` is called creating and returning the wild encountered Pokemon.

```javascript
const options: WildPokemonSchema[] = [
    {
        title: "CHARMANDER".split(""),
        level: 10,
        moves: [
            {
                title: "Ember",
                remaining: FSP.constants.moves.byName.Ember.pp,
                uses: FSP.constants.moves.byName.Ember.pp,
            },
        ],
        rate: 0.25,
    },
    {
        title: "Squirtle".split(""),
        levels: [10, 5, 4, 7],
        rate: 0.75,
    },
];

// Chosen has a 75% chance of being a Squirtle and 25% chance of being a Charmander.
const chosen: WildPokemonSchema = fsp.equations.chooseRandomWildPokemon(options);
const chosenPokemon = fsp.equations.createPokemon(chosen);
```
