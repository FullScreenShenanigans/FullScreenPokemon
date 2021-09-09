import { TeamId } from "battlemovr";
import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { BattleInfo } from "../Battles";
import { Actor } from "../Actors";

/**
 * Sets Actors visually representing each team.
 */
export class Actors extends Section<FullScreenPokemon> {
    /**
     * Sets a team's visual Pokemon Actor.
     *
     * @param actor   Title for the Actor.
     * @param settings   Any additional settings for the actor.
     */
    public setActor(teamId: TeamId, actor: string, settings?: any): void {
        teamId === TeamId.opponent
            ? this.setOpponentActor(actor, settings)
            : this.setPlayerActor(actor, settings);
    }

    /**
     * Sets the visual opponent Pokemon Actor.
     *
     * @param actor   Title for the Actor.
     * @param settings   Any additional settings for the Actor.
     */
    private setOpponentActor(actor: string, settings?: any): void {
        const battleInfo: BattleInfo = this.game.battleMover.getBattleInfo() as BattleInfo;

        this.game.death.kill(battleInfo.actors.opponent);
        battleInfo.actors.opponent = this.game.objectMaker.make<Actor>(actor, settings);

        this.game.actors.add(battleInfo.actors.opponent);
        this.game.physics.setBottom(battleInfo.actors.opponent, battleInfo.actors.menu.top + 108);
        this.game.physics.setRight(battleInfo.actors.opponent, battleInfo.actors.menu.right - 16);

        this.game.groupHolder.switchGroup(
            battleInfo.actors.opponent,
            battleInfo.actors.opponent.groupType,
            "Text"
        );
    }

    /**
     * Sets the visual player Pokemon Actor.
     *
     * @param actor   Title for the Actor.
     * @param settings   Any additional settings for the Actor.
     */
    private setPlayerActor(actor: string, settings?: any): void {
        const battleInfo: BattleInfo = this.game.battleMover.getBattleInfo() as BattleInfo;

        this.game.death.kill(battleInfo.actors.player);
        battleInfo.actors.player = this.game.objectMaker.make<Actor>(actor, settings);

        this.game.actors.add(
            battleInfo.actors.player,
            battleInfo.actors.menu.left,
            battleInfo.actors.menu.bottom - battleInfo.actors.player.height * 2
        );

        this.game.groupHolder.switchGroup(
            battleInfo.actors.player,
            battleInfo.actors.player.groupType,
            "Text"
        );
    }
}
