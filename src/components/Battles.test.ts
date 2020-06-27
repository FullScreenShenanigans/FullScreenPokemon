import { Clock } from "@sinonjs/fake-timers";
import { expect } from "chai";

import { FullScreenPokemon } from "..";
import { stubBlankGame } from "../fakes.test";

import { IBattleTeam, IPokemon } from "./Battles";
import { IPlayer } from "./Things";

const createGame = () => {
    const { clock, fsp, player } = stubBlankGame({
        height: 1000,
        width: 1000,
    });
    const charmander = fsp.equations.newPokemon({
        level: 99,
        title: "CHARMANDER".split(""),
        moves: [
            {
                remaining: 10,
                title: "Scratch",
                uses: 10,
            },
        ],
    });

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

    return { clock, fsp, player, charmander, enemyPokemon };
};

const processBattle = (fsp: FullScreenPokemon, enemyPokemon: IPokemon, player: IPlayer, clock: Clock) => {
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
};

describe("Battles", () => {
    it("displays a status condition Pokeball sprite when a Pokemon is affected by a status condition", (): void => {
        // Arrange
        const { clock, fsp, player, charmander, enemyPokemon } = createGame();
        charmander.status = "paralyzed";
        fsp.itemsHolder.setItem(fsp.storage.names.pokemonInParty, [
            charmander,
        ]);

        // Act
        processBattle(fsp, enemyPokemon, player, clock);

        // Assert
        const menus = fsp.menuGrapher.getMenu("BattlePlayerPokeballs");
        expect(menus.children[0].className).to.be.equal("CharBallStatus");
    });

    it("displays a normal Pokeball sprite when a Pokemon is not affected by any status conditions", (): void => {
        // Arrange
        const { clock, fsp, player, charmander, enemyPokemon } = createGame();
        fsp.itemsHolder.setItem(fsp.storage.names.pokemonInParty, [
            charmander,
        ]);

        // Act
        processBattle(fsp, enemyPokemon, player, clock);

        // Assert
        const menus = fsp.menuGrapher.getMenu("BattlePlayerPokeballs");
        expect(menus.children[0].className).to.be.equal("CharBall");
    });

    it("displays a fainted Pokeball sprite when a Pokemon is fainted", (): void => {
        // Arrange
        const { clock, fsp, player, charmander, enemyPokemon } = createGame();
        const charmanderfainted = fsp.equations.newPokemon({
            level: 99,
            title: "CHARMANDER".split(""),
            moves: [
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

        // Act
        processBattle(fsp, enemyPokemon, player, clock);

        // Assert
        const menus = fsp.menuGrapher.getMenu("BattlePlayerPokeballs");
        expect(menus.children[1].className).to.be.equal("CharBallFaint");
    });
});
