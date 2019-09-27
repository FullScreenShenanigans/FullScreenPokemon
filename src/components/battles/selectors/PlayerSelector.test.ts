import { ITeamLeader } from "battlemovr";
import { expect } from "chai";
import { Clock } from "lolex";

import { stubBlankGame } from "../../../fakes.test";
import { FullScreenPokemon } from "../../../FullScreenPokemon";

const startBattle = (fsp: FullScreenPokemon, clock: Clock, leader?: ITeamLeader) => {
    fsp.itemsHolder.setItem(fsp.storage.names.pokemonInParty, [
        fsp.equations.newPokemon({
            title: "CHARMANDER".split(""),
        }),
    ]);

    fsp.battles.startBattle({
        teams: {
            opponent: {
                actors: [
                    fsp.equations.newPokemon({
                        title: "PIDGEY".split(""),
                    })
                ],
                leader,
            },
        },
    });

    clock.tick(3000);
    fsp.inputs.keyDownA(fsp.players[0]);
    clock.tick(2000);
};

const attemptToFlee = (fsp: FullScreenPokemon, clock: Clock) => {
    fsp.equations.canFleeBattle = () => true;

    fsp.menuGrapher.registerDown();
    fsp.menuGrapher.registerRight();
    fsp.menuGrapher.registerA();
    
    clock.tick(2000);
    fsp.menuGrapher.registerA();
    clock.tick(2000);
};

describe("PlayerSelector", () => {
    it("allows fleeing the battle when the opponent is a wild Pokemon", () => {
        // Arrange
        const { clock, fsp } = stubBlankGame({
            width: 500,
            height: 500,
        });
        startBattle(fsp, clock);
        
        // Act
        attemptToFlee(fsp, clock);

        // Assert
        expect(fsp.battleMover.inBattle()).to.be.equal(false);
    });

    it("refuses to flee the battle when the opponent is a trainer", () => {
        // Arrange
        const { clock, fsp } = stubBlankGame();
        startBattle(fsp, clock, {
            nickname: "Bug Catcher".split(""),
            title: "BugCatcher".split("")
        });

        // Act
        attemptToFlee(fsp, clock);

        // Assert
        expect(fsp.battleMover.inBattle()).to.be.equal(true);
    });
});
