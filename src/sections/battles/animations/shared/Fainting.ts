import { TeamId } from "battlemovr";
import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../../../FullScreenPokemon";
import { BattleInfo, Pokemon } from "../../../Battles";
import { Actor } from "../../../Actors";

/**
 * Animations for a Pokemon fainting.
 */
export class Fainting extends Section<FullScreenPokemon> {
    /**
     * Runs a fainting animation.
     *
     * @param pokemon   Pokemon fainting.
     * @param teamId   The Pokemon's team.
     * @param onComplete   Handler for when this is done.
     */
    public run(pokemon: Pokemon, teamId: TeamId, onComplete: () => void): void {
        const battleInfo: BattleInfo = this.game.battleMover.getBattleInfo() as BattleInfo;
        const teamName: "player" | "opponent" = TeamId[teamId] as "player" | "opponent";
        const actor: Actor = battleInfo.actors[teamName];
        const scale = actor.scale === undefined ? 1 : actor.scale;
        const blank: Actor = this.game.battles.decorations.addActorAsText("WhiteSquare", {
            width: actor.width * scale,
            height: actor.height * scale,
        });

        this.game.battles.decorations.moveToBeforeBackground(blank);
        this.game.battles.decorations.moveToBeforeBackground(actor);

        this.game.physics.setLeft(blank, actor.left);
        this.game.physics.setTop(blank, actor.top + actor.height * scale);

        this.game.animations.sliding.slideVertically(
            actor,
            8,
            this.game.physics.getMidY(actor) + actor.height * scale,
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
                this.game.death.kill(actor);
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
        battleInfo: BattleInfo
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
