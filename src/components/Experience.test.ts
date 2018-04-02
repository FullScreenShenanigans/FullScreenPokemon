import { expect } from "chai";
import { stubBlankGame } from "../fakes.test";
import { IPartialBattleOptions, IPokemon } from "./Battles";

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
        const { fsp } = stubBlankGame();
        fsp.maps.addPlayer(0, 0);
        fsp.itemsHolder.setItem(fsp.storage.names.pokemonInParty, [
            fsp.equations.newPokemon({
                level: 5,
                title: "CHARMANDER".split(""),
            }),
        ]);
        // const pokemon: IPokemon = fsp.equations.newPokemon({
        //     level: 5,
        //     title: "CHARMANDER".split(""),
        // });
        const enemyPokemon: IPokemon = fsp.equations.newPokemon({
            level: 1,
            title: "PIDGEY".split(""),
        });
        const battleInfo: IPartialBattleOptions = {
            onComplete: (): void => {
                fsp.scenePlayer.startCutscene("OakIntroRivalLeaves");
            },
            teams: {
                opponent: {
                    leader: {
                        title: "RivalPortrait".split(""),
                        nickname: fsp.itemsHolder.getItem(fsp.storage.names.nameRival),
                    },
                    nextCutscene: "OakIntroRivalLeaves",
                    reward: 175,
                    actors: [
                        enemyPokemon,
                    ],
                },
            },
        };
        fsp.battles.startBattle(battleInfo);

        //processBattleExperience
        // Act
        //fsp.experience.gainExperience(pokemon, 99);

        // Assert
        //expect(pokemon.experience) .to.be.equal(100); , , , , , , , , , , , ,
    });
