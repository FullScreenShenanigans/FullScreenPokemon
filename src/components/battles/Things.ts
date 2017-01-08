import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { IBattleInfo } from "../Battles";
import { IThing } from "../Things";

/**
 * Thing visual handlers used by FullScreenPokemon instances.
 */
export class Things<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
    /**
     * 
     */
    public setPlayer(thing: string, settings?: any): void {
        const battleInfo: IBattleInfo = this.gameStarter.battleMover.getBattleInfo() as IBattleInfo;

        this.gameStarter.physics.killNormal(battleInfo.things.player);
        battleInfo.things.player = this.gameStarter.objectMaker.make<IThing>(thing, settings);

        this.gameStarter.things.add(
            battleInfo.things.player,
            battleInfo.things.menu.left + 8,
            battleInfo.things.menu.bottom - 112);

        this.gameStarter.groupHolder.switchMemberGroup(battleInfo.things.player, battleInfo.things.player.groupType, "Text");
    }
}
