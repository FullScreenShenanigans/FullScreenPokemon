
import { BattleOutcome } from "battlemovr";
import { expect } from "chai";
import { MenuGraphr } from "menugraphr";
import * as sinon from "sinon";
import { stubBlankGame } from "../fakes.test";
import { IBattleTeam, IPartialBattleOptions, IPokemon } from "./Battles";
import { Ending } from "./battles/animations/Ending";

describe("Battles", () => {
    it("Ensures a status condition pokeball sprite is displayed when pokemon is affected by a status condition", (): void => {
        //Arrange
        const { clock, fsp, player } = stubBlankGame(
            {height: 1000,
             width: 1000},
        );
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
        charmander.status = "paralyzed";
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

        //Act
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
        fsp.inputs.keyDownA(player);
        clock.tick(2000);

        //Assert
        const menus = fsp.menuGrapher.getMenu("BattlePlayerPokeballs");
        expect(menus.children[0].className).to.be.equal("CharBallStatus");
    });
    it("Ensures a healthly pokeball sprite is displayed when pokemon is healthy", (): void => {
        //Arrange
        const { clock, fsp, player } = stubBlankGame(
            {height: 1000,
             width: 1000},
        );
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

        //Act
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
        fsp.inputs.keyDownA(player);
        clock.tick(2000);

        //Assert
        const menus = fsp.menuGrapher.getMenu("BattlePlayerPokeballs");
        expect(menus.children[0].className).to.be.equal("CharBall");
    });
    it("Ensures a fainted pokeball sprite is displayed when pokemon is fainted", (): void => {
        //Arrange
        const { clock, fsp, player } = stubBlankGame(
            {height: 1000,
             width: 1000},
        );
        const charmanderfainted = fsp.equations.newPokemon({
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
        charmander.statistics.health.current = 0;
        fsp.itemsHolder.setItem(fsp.storage.names.pokemonInParty, [
            charmanderfainted,
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

        //Act
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
        fsp.inputs.keyDownA(player);
        clock.tick(2000);

        //Assert
        const menus = fsp.menuGrapher.getMenu("BattlePlayerPokeballs");
        expect(menus.children[0].className).to.be.equal("CharBallFaint");
    });
});
