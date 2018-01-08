import { Team } from "battlemovr";
import { GeneralComponent } from "gamestartr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { IBattleInfo } from "../Battles";
import { IThing } from "../Things";

/**
 * Sets Things visually representing each team.
 */
export class Things<TGameStartr extends FullScreenPokemon> extends GeneralComponent<TGameStartr> {
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
        const battleInfo: IBattleInfo = this.gameStarter.battleMover.getBattleInfo() as IBattleInfo;

        this.gameStarter.physics.killNormal(battleInfo.things.opponent);
        battleInfo.things.opponent = this.gameStarter.objectMaker.make<IThing>(thing, settings);

        this.gameStarter.things.add(battleInfo.things.opponent);
        this.gameStarter.physics.setBottom(battleInfo.things.opponent, battleInfo.things.menu.top + 108);
        this.gameStarter.physics.setRight(battleInfo.things.opponent, battleInfo.things.menu.right - 16);

        this.gameStarter.groupHolder.switchGroup(battleInfo.things.opponent, battleInfo.things.opponent.groupType, "Text");
    }

    /**
     * Sets the visual player Pokemon Thing.
     *
     * @param thing   Title for the Thing.
     * @param settings   Any additional settings for the Thing.
     */
    private setPlayerThing(thing: string, settings?: any): void {
        const battleInfo: IBattleInfo = this.gameStarter.battleMover.getBattleInfo() as IBattleInfo;

        this.gameStarter.physics.killNormal(battleInfo.things.player);
        battleInfo.things.player = this.gameStarter.objectMaker.make<IThing>(thing, settings);

        this.gameStarter.things.add(
            battleInfo.things.player,
            battleInfo.things.menu.left,
            battleInfo.things.menu.bottom - battleInfo.things.player.height * 2);

        this.gameStarter.groupHolder.switchGroup(battleInfo.things.player, battleInfo.things.player.groupType, "Text");
    }
}
