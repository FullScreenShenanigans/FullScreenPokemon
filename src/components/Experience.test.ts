import { BattleOutcome } from "battlemovr";
import { expect } from "chai";
import { Clock } from "lolex";
import { IListMenuProgress, MenuGraphr } from "menugraphr";
import { Children } from "react";
import { FullScreenPokemon } from "../";
import { stubBlankGame } from "../fakes.test";
import { IBattleInfo, IBattleTeam, IPartialBattleOptions, IPokemon } from "./Battles";
import { IPlayer } from "./Things";

const skipBattle = (clock: Clock, fsp: FullScreenPokemon, player: IPlayer): void => {
    fsp.inputs.keyDownA(player);
    clock.tick(2000);
    fsp.inputs.keyDownA(player);
    clock.tick(2000);
    fsp.inputs.keyDownA(player);
    clock.tick(2000);
    fsp.inputs.keyDownA(player);
    clock.tick(2000);
    fsp.inputs.keyDownA(player);
    clock.tick(2000);
    fsp.inputs.keyDownA(player);
    clock.tick(2000);
    fsp.inputs.keyDownA(player);
    clock.tick(2000);
    fsp.inputs.keyDownA(player);
    clock.tick(2000);
};

const startBattle = (clock: Clock, fsp: FullScreenPokemon, player: IPlayer, enemyPokemon: IPokemon, charmander: IPokemon) => {
    fsp.battles.startBattle({
        teams: {
            opponent: {
                actors: [enemyPokemon],
            },
        },
        texts: {
            start: (team: IBattleTeam): string =>
                `Wild ${team.selectedActor.nickname.join("")} appeared!`,
        },
    });
    charmander.statistics.attack.current = 999;
    skipBattle(clock, fsp, player);
};

const createGame = (charmanderLevel: number) => {
    const { fsp, player, clock } = stubBlankGame();
    const charmander = fsp.equations.newPokemon({
        level: charmanderLevel,
        title: "CHARMANDER".split(""),
        moves: [
            {
                remaining: 10,
                title: "Scratch",
                uses: 10,
            },
        ],
    });
    fsp.itemsHolder.setItem(fsp.storage.names.pokemonInParty, [
        charmander,
    ]);
    const enemyPokemon: IPokemon = fsp.equations.newPokemon({
        level: 3,
        title: "PIDGEY".split(""),
        moves: [
            {
                remaining: 10,
                title: "Growl",
                uses: 10,
            },
        ],
    });
    return{fsp, player, clock, charmander, enemyPokemon};
};
describe("Experience", () => {
    it("Ensures a pokemon levels up through the levelup function call", (): void => {
        // Arrange
        const { fsp } = stubBlankGame();
        const pokemon: IPokemon = fsp.equations.newPokemon({
            level: 5,
            title: "CHARMANDER".split(""),
        });

        // Act
        fsp.experience.levelup(pokemon);

        // Assert
        expect(pokemon.level).to.be.equal(6);
    });
    it("Ensures a pokemon gains experience through gainExperience the function call", (): void => {
        // Arrange
        const { fsp } = stubBlankGame();
        const pokemon: IPokemon = fsp.equations.newPokemon({
            level: 5,
            title: "CHARMANDER".split(""),
        });

        // Act
        const result = fsp.experience.gainExperience(pokemon, 50);

        // Assert
        expect(pokemon.experience).to.be.equal(175);
    });
    it("Ensures a pokemon does not level up when it is shouldn't through the gainExperience function call", (): void => {
        // Arrange
        const { fsp } = stubBlankGame();
        const pokemon: IPokemon = fsp.equations.newPokemon({
            level: 5,
            title: "CHARMANDER".split(""),
        });

        // Act
        const result = fsp.experience.gainExperience(pokemon, 50);

        // Assert
        expect(result).to.be.equal(false);
    });
    it("Ensures a pokemon levels up when it should through the gainExpereince function call", (): void => {
        // Arrange
        const { fsp } = stubBlankGame();
        const pokemon: IPokemon = fsp.equations.newPokemon({
            level: 5,
            title: "CHARMANDER".split(""),
        });

        // Act
        const result = fsp.experience.gainExperience(pokemon, 100);

        // Assert
        expect(pokemon.level).to.be.equal(6);
        expect(result).to.be.equal(true);
    });
    it("Ensures a pokemon gains experience during a battle", (): void => {
        // Arrange
        const {fsp, player, clock, charmander, enemyPokemon} = createGame(99);
        const startingExperience = charmander.experience;

        // Act
        startBattle(clock, fsp, player, enemyPokemon, charmander);

        // Assert
        expect(charmander.experience).to.be.greaterThan(startingExperience);
    });
    it("Ensures a pokemon levels up after a battle", (): void => {
        // Arrange
        const {fsp, player, clock, charmander, enemyPokemon} = createGame(1);

        // Act
        startBattle(clock, fsp, player, enemyPokemon, charmander);

        // Assert
        expect(charmander.level).to.be.equal(2);
    });
});
