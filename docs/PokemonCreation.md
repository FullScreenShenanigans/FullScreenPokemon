## Pokemon Creation

The two main files that handle Pokemon creation are [`Equations`](../src/components/Equations.ts) and [`Utilities`](../src/components/Utilities.ts), both of which incorporate ['numberMaker'](../node_modules/numbermakr/lib/NumberMakr.d.ts) for random generation of numbers.
`Equations` includes functions for choosing random wild Pokemon and for creating the actual Pokemon object. `Utilities` facilitates the creating of a wild Pokemon by preparing parameters then calling `Equations` creation of the Pokemon object.

A newly created Pokemon's member types can be found in [`Battles`](../src/components/Battles.ts) under the IPokemon interface.

### Unit Test and Trainer Battles

The steps for creating a Pokemon in a unit test and trainer battle are:
1. Pass into the newPokemon function from `Equations` an object with appropriate members:

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

### Wild Pokemon Grass Encounter

The steps for creating a Pokemon in a wild Pokemon grass encounter are:
1. The chooseWildPokemonForBattle function is run.
    * This function returns the Pokemon object by using the grass IMap and IArea to determine what wild Pokemon can be encountered.
2. After selecting valid wild Pokemon that can be encountered chooseRandomWildPokemon is called and chooses a Pokemon from the list of valid Pokemon.
3. Next, createPokemon is called which sets up an object with information on the Pokemon.
4. newPokemon is called returning the wild encountered Pokemon.

```javascript
// Create Pokemon for wild grass encounter.
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
