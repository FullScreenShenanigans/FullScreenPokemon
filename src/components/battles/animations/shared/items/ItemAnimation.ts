import { IMoveAction, IMoveEffect, ITeamAndAction, Team } from "battlemovr";
import { GeneralComponent } from "gamestartr";

import { FullScreenPokemon } from "../../../../../FullScreenPokemon";
import { IBattleInfo, IPokemon } from "../../../../Battles";
import { IMenu } from "../../../../Menus";
import { IThing } from "../../../../Things";

/**
 * Uses an item.
 */
export class ItemAnimation<TGameStartr extends FullScreenPokemon> extends GeneralComponent<TGameStartr> {
    /**
     * Team and move being performed.
     */
    protected readonly teamAndAction: ITeamAndAction<IMoveAction>;

    /**
     * Item being used.
     */
    protected readonly item: string;

    /**
     * Pokemon being targeted.
     */
    protected readonly attacker: IPokemon;

    /**
     * Visually attaching Thing.
     */
    protected readonly attackerThing: IThing;

    /**
     * Pokemon using the item.
     */
    protected readonly defender: IPokemon;

    /**
     * Visually defending Thing being attacked.
     */
    protected readonly defenderThing: IThing;

    /**
     * Movement direction from the attacker to the defender.
     */
    protected direction: -1 | 1;

    /**
     * Battle display menu.
     */
    protected readonly menu: IMenu;

    /**
     * Initializes a new instance of the Item class.
     *
     * @param gameStarter   FullScreenPokemon instance this is used for.
     * @param teamAndAction   Team and move being performed.
     * @param item   Item being used.
     */
    public constructor(gameStarter: TGameStartr, teamAndAction: ITeamAndAction<IMoveAction>, item: string) {
        super(gameStarter);

        this.teamAndAction = teamAndAction;
        this.item = item;

        const battleInfo: IBattleInfo = gameStarter.battleMover.getBattleInfo() as IBattleInfo;
        this.attacker = battleInfo.teams[Team[teamAndAction.source.team]].selectedActor;
        this.attackerThing = battleInfo.things[Team[teamAndAction.source.team]];
        this.defender = battleInfo.teams[Team[teamAndAction.target.team]].selectedActor;
        this.defenderThing = battleInfo.things[Team[teamAndAction.target.team]];
        this.direction = this.teamAndAction.source.team === Team.opponent ? -1 : 1;
        this.menu = this.gameStarter.menuGrapher.getMenu("BattleDisplayInitial") as IMenu;

    }

    /**
     * Runs the items animation.
     *
     * @param onComplete   Callback for when the animation is done.
     * @todo Make this abstract when all items have it implemented.
     */
    public runAnimation(onComplete: () => void): void {
        console.log("Still need to implement " + this.item + "...");
        onComplete();
    }
}
