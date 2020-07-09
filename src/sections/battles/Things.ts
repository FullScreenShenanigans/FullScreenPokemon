import { Team } from "battlemovr";
import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { IBattleInfo } from "../Battles";
import { IThing } from "../Things";

/**
 * Sets Things visually representing each team.
 */
export class Things extends Section<FullScreenPokemon> {
    /**
     * Sets a team's visual Pokemon Thing.
     *
     * @param thing   Title for the Thing.
     * @param settings   Any additional settings for the thing.
     */
    public setThing(team: Team, thing: string, settings?: any): void {
        team === Team.opponent
            ? this.setOpponentThing(thing, settings)
            : this.setPlayerThing(thing, settings);
    }

    /**
     * Sets the visual opponent Pokemon Thing.
     *
     * @param thing   Title for the Thing.
     * @param settings   Any additional settings for the Thing.
     */
    private setOpponentThing(thing: string, settings?: any): void {
        const battleInfo: IBattleInfo = this.game.battleMover.getBattleInfo() as IBattleInfo;

        this.game.death.kill(battleInfo.things.opponent);
        battleInfo.things.opponent = this.game.objectMaker.make<IThing>(thing, settings);

        this.game.things.add(battleInfo.things.opponent);
        this.game.physics.setBottom(battleInfo.things.opponent, battleInfo.things.menu.top + 108);
        this.game.physics.setRight(battleInfo.things.opponent, battleInfo.things.menu.right - 16);

        this.game.groupHolder.switchGroup(battleInfo.things.opponent, battleInfo.things.opponent.groupType, "Text");
    }

    /**
     * Sets the visual player Pokemon Thing.
     *
     * @param thing   Title for the Thing.
     * @param settings   Any additional settings for the Thing.
     */
    private setPlayerThing(thing: string, settings?: any): void {
        const battleInfo: IBattleInfo = this.game.battleMover.getBattleInfo() as IBattleInfo;

        this.game.death.kill(battleInfo.things.player);
        battleInfo.things.player = this.game.objectMaker.make<IThing>(thing, settings);

        this.game.things.add(
            battleInfo.things.player,
            battleInfo.things.menu.left,
            battleInfo.things.menu.bottom - battleInfo.things.player.height * 2);

        this.game.groupHolder.switchGroup(battleInfo.things.player, battleInfo.things.player.groupType, "Text");
    }
}
