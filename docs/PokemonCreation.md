## Pokemon Creation

The two main files that handle Pokemon creation are [`Equations.ts`](../src/components/Equations.ts) and [`Utilities.ts`](../src/components/Utilities.ts).
`Equations.ts` includes functions for choosing random wild Pokemon and for creating the actual Pokemon object.
`Utilities.ts` facilitates the creating of a wild Pokemon by preparing parameters then calling `Equations.ts` creation of the Pokemon object.

A newly created Pokemon's member types can be found in [`Battles`.ts](../src/components/Battles.ts) under the IPokemon interface.

### Equations

`Equations.ts` contains the functions necessary for choosing a random Pokemon (chooseRandomWildPokemon), creating a new Pokemon (newPokemon), choosing that new Pokemon's statistics (newPokemonStatistics), and choosing a new Pokemon's IVs and EVs (newPokemonIVs and newPokemonEvs).

### Utilities

`Utilities.ts` contains the function necessary for calling newPokemon in `Equations.ts` (createPokemon), which uses the chosen random Pokemon, from `Equations.ts` chooseRandomWildPokemon, to get the get the level of the chosen Pokemon and title which it then feeds to newPokemon.

### Unit Test and Trainer Battles

The step for creating a Pokemon in a unit test and trainer battle are:
1. Pass into the newPokemon function from `Equations.ts` an object with appropriate members:

```javascript
const pokemonTitle: string[] = "CHARMANDER".split("");
const pokemonLevel: number = 10;
const pokemon: IPokemon = FSP.equations.newPokemon({
    level: undefined || pokemonLevel,
    title: pokemonTitle
});
const pokemon: IPokemon = FSP.equations.newPokemon({
    item: "Potion".split(""),
    level: undefined || pokemonLevel,
    moves: [{
        title: "Ember",
        remaining: FSP.constants.moves.Ember.pp,
        uses: FSP.constants.moves.Ember.pp}],
    title: pokemonTitle
});
```

### Wild Pokemon Encounter

The steps for creating a Pokemon in a wild Pokemon grass encounter are:
1. The chooseWildPokemonForBattle function is run.
    * This function returns the Pokemon object by using the grass IMap and IArea to determine what wild Pokemon can be encountered.
    * The grass IMap and IArea determine which wild Pokemon can be encountered by accessing the predetermined Pokemon natural to that location.
2. After selecting a valid wild Pokemon that can be encountered chooseRandomWildPokemon is called and chooses a Pokemon from the list of valid Pokemon.
    * This is done by looking at the chance of a Pokemon being found in the area and generating a random number to see which Pokemon is picked.
3. Next, createPokemon is called which sets up an object containing information on the level and title of the chosen Pokemon.
4. newPokemon is called creating and returning the wild encountered Pokemon.

```javascript
const options: IWildPokemonSchema[] = [
    {
        title: "CHARMANDER".split(""),
        level: 10,
        moves: [{
            title: "Ember",
            remaining: FSP.constants.moves.Ember.pp,
            uses: FSP.constants.moves.Ember.pp}],
        rate: .25
    },
    {
        title: "Squirtle".split(""),
        levels: [10,5,4,7],
        rate: .75
    }
];
const chosen: IWildPokemonSchema = fsp.equations.chooseRandomWildPokemon(options);
const chosenPokemon = fsp.utilities.createPokemon(chosen);
```
