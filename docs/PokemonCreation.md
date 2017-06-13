## Pokemon Creation

Pokemon creation in FullScreenPokemon consists of three different types, Unit Test Pokemon creation, Trainer Battle Pokemon creation, and Wild Pokemon Grass Encounter creation.
The two main files that handle Pokemon creation are [`Equations`] (../src/components/Equations.ts) and [`Utilities`] (../src/components/Utilities.ts),both of which incorporate ['numberMaker'] (../node_modules/numbermakr/lib) for random generation of numbers.
`Equations` includes functions for choosing random wild Pokemon and for creating the actual Pokemon object. `Utilities` facilitates the creating of a wild Pokemon by preparing parameters than calling `Equations` creation of the Pokemon object.

A newly created Pokemon has members of types:
* experience: number
* level: number
* ev: IValuePoints
* item?: string[]
* iv: IValuePoints
* raisedCriticalHitProbability?: boolean
* statistics: IPokemonStatistics
* status?: IStatus
* types: string[]

### Unit Test and Trainer Battles

The steps for creating a Pokemon in a Unit Test and Trainer Battles are:
    1. Pass into the newPokemon(chosenInfo: INewPokemon) function from `Equations` an on object with members:
        * level: number
        * title: string[]
    2. Catch the return value in a variable of type IPokemon.

```javascript
//Create Pokemon in Unit Test and for Trainer Battle.
const pokemonTitle: string[] = "CHARMANDER".split("");
const pokemonLevel: number = 10;
const pokemon: IPokemon = fsp.equations.newPokemon({
    item: undefined, // || item as string[]
    level: undefined || pokemonLevel,
    moves: undefined, // || array type of IMove
    title: pokemonTitle
});
```

### Wild Pokemon Grass Encounter

The steps for creating a Pokemon in a Wild Pokemon Grass Encounter are:
1. The chooseWildPokemonForBattle(grass: Ithing) function is run.
    * This function returns the Pokemon object by using the grass IMap and        IArea to determine what wild Pokemon can be encountered.
2. After selecting valid wild Pokemon that can be encountered                      chooseRandomWildPokemon(options: IWildPokemonSchema[]) of return type           IWildPokemonSchema is called and chooses a Pokemon from the list of valid       Pokemon.
3. Next, createPokemon(schema: IWildPokemonSchema) of return type IPokemon is      called which sets up an object of type INewPokemon which includes members:
    * level: number
    * title: string[]
4. newPokemon is called returning the wild encountered Pokemon in an object of     type IPokemon.
5. Catch this return value in a variable of type IPokemon.

```javascript
//Create Pokemon for Wild Grass Encounter.
const options: IWildPokemonSchema[] = [
    {
        title: "CHARMANDER",
        level: 10 // || levels if array of possible levels
        //moves: string[]; if moves are predetermined
        //rate: appearance rate of this Pokemon, in [0, 1]
    },
    {
        title: "Squirtle",
        levels: [10,5,4,7]
        //moves: string[]; if moves are predetermined
        //rate: appearance rate of this Pokemon, in [0, 1]
    }
];
const chosen: IWildPokemonScham = fsp.equations.chooseRandomWildPokemon(options);
cosnt chosenPokemon = fsp.utilities.createPokemon(chosen);
```
