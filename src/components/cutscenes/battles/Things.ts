import { IUnderEachTeam } from "battlemovr/lib/Teams";
import { Component } from "eightbittr/lib/Component";

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
     * Sets up the Things displayed in a battle.
     * 
     * @param cutscene   Settings for the battle cutscene.
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
     * Creates the initial Things displayed in a battle.
     * 
     * @param cutscene   Settings for the cutscene.
     */
    protected createThings(cutscene: IBattleCutsceneSettings): IBattleThings {
        const background: IThing = this.addThingAsText(
            "DirtWhite",
            {
                height: this.gameStarter.mapScreener.height,
                width: this.gameStarter.mapScreener.width
            });
        this.gameStarter.utilities.arrayToBeginning(background, this.gameStarter.groupHolder.getGroup("Text") as IThing[]);

        const menu: IMenu = this.gameStarter.menuGrapher.createMenu("BattleDisplayInitial") as IMenu;

        const opponent: IThing = this.addThingAsText(
            cutscene.battleInfo.teams.opponent.selectedActor.title.join("") + "Front",
            {
                opacity: 0
            });

        const player: IThing = this.addThingAsText(
            cutscene.battleInfo.teams.player.selectedActor.title.join("") + "Back",
            {
                opacity: 0
            });

        return { background, menu, opponent, player };
    }

    /**
     * Adds a new Thing and moves it to the Text group.
     * 
     * @param title   Title of the Thing to add.
     * @param attributes   Any attributes for the Thing.
     * @returns The newly created Thing.
     */
    private addThingAsText(title: string, attributes: any): IThing {
        const thing: IThing = this.gameStarter.things.add([title, attributes]);

        this.gameStarter.groupHolder.switchMemberGroup(thing, thing.groupType, "Text");

        return thing;
    }
}
