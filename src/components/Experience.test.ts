import { BattleOutcome } from "battlemovr";
import { expect } from "chai";
import { Clock } from "lolex";
import { IListMenuProgress, MenuGraphr } from "menugraphr";
import { Children } from "react";
import { FullScreenPokemon } from "../";
import { stubBlankGame } from "../fakes.test";
import { IBattleTeam, IPartialBattleOptions, IPokemon } from "./Battles";
import { IPlayer } from "./Things";

describe("Experience", () => {
    it("Ensures a pokemon levels up through the function call", (): void => {
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
    it("Ensures a pokemon gains experience through the function call and doesn't level up", (): void => {
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
        expect(result).to.be.equal(false);
    });
    it("Ensures a pokemon gains experience through the function call and levels up", (): void => {
        // Arrange
        const { fsp } = stubBlankGame();
        const pokemon: IPokemon = fsp.equations.newPokemon({
            level: 5,
            title: "CHARMANDER".split(""),
        });

        // Act
        const result = fsp.experience.gainExperience(pokemon, 100);

        // Assert
        expect(pokemon.experience).to.be.equal(225);
        expect(pokemon.level).to.be.equal(6);
        expect(result).to.be.equal(true);
    });
    it("Ensures a pokemon gains experience through during a battle", (): void => {
        // Arrange
        const { clock, fsp, player } = stubBlankGame();
        const charmander = fsp.equations.newPokemon({
            level: 99,
            title: "CHARMANDER".split(""),
            moves: [
                {
                    remaining: 10,
                    title: "Growl",
                    uses: 10,
                },
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
        const startingExperience = charmander.experience;
        const temp = () => 0;
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

        // Act
        const battleInfo = fsp.battleMover.getBattleInfo();
        fsp.experience.processBattleExperience (battleInfo, temp);

        // Assert
        expect(charmander.experience).to.be.greaterThan(startingExperience);
    });
    it("Ensures a pokemon levels up after a battle", (): void => {
        // Arrange
        const { clock, fsp, player } = stubBlankGame();
        const charmander = fsp.equations.newPokemon({
            level: 1,
            title: "CHARMANDER".split(""),
            moves: [
                {
                    remaining: 10,
                    title: "Growl",
                    uses: 10,
                },
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
            level: 2,
            title: "PIDGEY".split(""),
            moves: [
                {
                    remaining: 10,
                    title: "Growl",
                    uses: 10,
                },
            ],
        });
        const startingExperience = charmander.experience;
        const temp = () => 0;
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

        // Act
        const battleInfo = fsp.battleMover.getBattleInfo();
        fsp.experience.processBattleExperience (battleInfo, temp);

        // Assert
        expect(charmander.level).to.be.equal(2);
    });
});
