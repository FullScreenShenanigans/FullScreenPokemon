import { IUnderEachTeam } from "battlemovr/lib/Teams";
import { Component } from "eightbittr/lib/Component";

import { IBattleInfo } from "../../../components/Battles";
import { IMenu } from "../../../components/Menus";
import { IThing } from "../../../components/Things";
import { FullScreenPokemon } from "../../../FullScreenPokemon";
import { IBattleCutsceneSettings } from "../BattleCutscene";

/**
 * Things displayed in a battle.
 */
export interface IBattleThings extends IUnderEachTeam<IThing> {
    /**
     * Solid background color behind everything.
     */
    background: IThing;

    /**
     * Menu surrounding the battle area.
     */
    menu: IMenu;
}

/**
 * Thing handlers for battle cutscene functions used by FullScreenPokemon instances.
 */
export class Things<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
    /**
     * 
     */
    public setup(cutscene: IBattleCutsceneSettings): void {
        this.gameStarter.menuGrapher.createMenu("Battle");

        cutscene.things = this.createThings(cutscene);

        this.gameStarter.physics.setLeft(cutscene.things.player, cutscene.things.menu.right + cutscene.things.player.width);
        this.gameStarter.physics.setBottom(cutscene.things.player, cutscene.things.menu.bottom - cutscene.things.player.height);
        this.gameStarter.physics.setRight(cutscene.things.opponent, cutscene.things.menu.left);
        this.gameStarter.physics.setTop(cutscene.things.opponent, cutscene.things.menu.top);
    }

    /**
     * 
     */
    public takedown(battleInfo: IBattleInfo): void {
        console.log("Takedown", battleInfo);
    }

    /**
     * 
     */
    protected createThings(cutscene: IBattleCutsceneSettings): IBattleThings {
        const things: IBattleThings = {
            background: this.gameStarter.things.add(
                [
                    "DirtWhite",
                    {
                        height: this.gameStarter.mapScreener.height,
                        width: this.gameStarter.mapScreener.width
                    }
                ]),
            menu: this.gameStarter.menuGrapher.createMenu("BattleDisplayInitial") as IMenu,
            opponent: this.gameStarter.objectMaker.make<IThing>(
                cutscene.battleInfo.teams.opponent.selectedActor.title.join("") + "Back",
                {
                    opacity: 0
                }),
            player: this.gameStarter.objectMaker.make<IThing>(
                cutscene.battleInfo.teams.player.selectedActor.title.join("") + "Back",
                {
                    opacity: 0
                })
        };

        this.gameStarter.groupHolder.switchMemberGroup(things.background, things.background.groupType, "Text");

        return things;
    }
}
