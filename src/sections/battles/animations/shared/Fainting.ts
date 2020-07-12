import { Team } from "battlemovr";
import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../../../FullScreenPokemon";
import { IBattleInfo, IPokemon } from "../../../Battles";
import { IThing } from "../../../Things";

/**
 * Animations for a Pokemon fainting.
 */
export class Fainting extends Section<FullScreenPokemon> {
    /**
     * Runs a fainting animation.
     *
     * @param pokemon   Pokemon fainting.
     * @param team   The Pokemon's team.
     * @param onComplete   Handler for when this is done.
     */
    public run(pokemon: IPokemon, team: Team, onComplete: () => void): void {
        const battleInfo: IBattleInfo = this.game.battleMover.getBattleInfo() as IBattleInfo;
        const teamName: "player" | "opponent" = Team[team] as "player" | "opponent";
        const thing: IThing = battleInfo.things[teamName];
        const scale = thing.scale === undefined ? 1 : thing.scale;
        const blank: IThing = this.game.battles.decorations.addThingAsText("WhiteSquare", {
            width: thing.width * scale,
            height: thing.height * scale,
        });

        this.game.battles.decorations.moveToBeforeBackground(blank);
        this.game.battles.decorations.moveToBeforeBackground(thing);

        this.game.physics.setLeft(blank, thing.left);
        this.game.physics.setTop(blank, thing.top + thing.height * scale);

        this.game.animations.sliding.slideVertically(
            thing,
            8,
            this.game.physics.getMidY(thing) + thing.height * scale,
            1,
            (): void => {
                const playerName = this.game.itemsHolder.getItem(this.game.storage.names.name);
                const partyIsWipedText: (string | string[])[][] = [
                    [pokemon.nickname, " fainted!"],
                ];

                if (teamName === "opponent") {
                    this.processOpponentFainting(partyIsWipedText, onComplete, battleInfo);
                } else {
                    this.processPlayerFainting(partyIsWipedText, onComplete, playerName);
                }
                this.game.menuGrapher.setActiveMenu("GeneralText");
                this.game.death.kill(thing);
                this.game.death.kill(blank);
            }
        );

        this.game.modAttacher.fireEvent(
            this.game.mods.eventNames.onFaint,
            pokemon,
            battleInfo.teams.player.actors
        );
    }

    /**
     * Helper function to start the process of gaining experience
     */
    private processOpponentFainting(
        partyIsWipedText: (string | string[])[][],
        onComplete: () => void,
        battleInfo: IBattleInfo
    ) {
        this.game.menuGrapher.createMenu("GeneralText");
        this.game.menuGrapher.addMenuDialog("GeneralText", partyIsWipedText, () =>
            this.game.experience.processBattleExperience(battleInfo, onComplete)
        );
    }

    /**
     * Helper function to start the process of a player's pokemon fainitng
     */
    private processPlayerFainting(
        partyIsWipedText: (string | string[])[][],
        onComplete: () => void,
        playerName: string[]
    ) {
        this.game.menuGrapher.createMenu("GeneralText");
        if (this.game.battles.isPartyWiped()) {
            partyIsWipedText.push(
                [playerName, " is out of useable Pokemon!"],
                [playerName, " blacked out!"]
            );
        }

        this.game.menuGrapher.addMenuDialog("GeneralText", partyIsWipedText, onComplete);
    }
}
