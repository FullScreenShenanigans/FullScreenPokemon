import { IMoveAction } from "battlemovr/lib/Actions";
import { IMoveEffect } from "battlemovr/lib/Effects";
import { ITeamAndAction } from "battlemovr/lib/Teams";
import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../../../../../FullScreenPokemon";
import { IBattleInfo, IPokemon } from "../../../../Battles";
import { IMenu } from "../../../../Menus";
import { IThing } from "../../../../Things";

/**
 * Runs a battle move.
 */
export class Move<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
    /**
     * Team and move being performed.
     */
    protected readonly teamAndAction: ITeamAndAction<IMoveAction>;

    /**
     * Pokemon being targeted.
     */
    protected readonly attacker: IPokemon;

    /**
     * Visually attaching Thing.
     */
    protected readonly attackerThing: IThing;

    /**
     * Pokemon using the move.
     */
    protected readonly defender: IPokemon;

    /**
     * Visually defending Thing being attacked.
     */
    protected readonly defenderThing: IThing;

    /**
     * Battle display menu.
     */
    protected readonly menu: IMenu;

    /**
     * Initializes a new instance of the Move class.
     * 
     * @param gameStarter   FullScreenPokemon instance this is used for.
     * @param teamAndAction   Team and move being performed.
     */
    public constructor(gameStarter: TGameStartr, teamAndAction: ITeamAndAction<IMoveAction>) {
        super(gameStarter);

        this.teamAndAction = teamAndAction;

        const battleInfo: IBattleInfo = gameStarter.battleMover.getBattleInfo() as IBattleInfo;
        this.attacker = battleInfo.teams[teamAndAction.source.team].selectedActor;
        this.attackerThing = battleInfo.things[teamAndAction.source.team];
        this.defender = battleInfo.teams[teamAndAction.target.team].selectedActor;
        this.defenderThing = battleInfo.things[teamAndAction.target.team];

        this.menu = this.gameStarter.menuGrapher.getMenu("BattleDisplayInitial") as IMenu;
    }

    /**
     * @returns Effects running this move will cause.
     */
    public getEffects(): IMoveEffect[] {
        return this.gameStarter.constants.moves.byName[this.teamAndAction.action.move].effects;
    }

    /**
     * Runs the move's animation.
     * 
     * @param callback   Callback for when the animation is done.
     */
    public runAnimation(callback: () => void): void {
        console.log(`Still need to implement '${this.teamAndAction.action.move}'...`);
        callback();
    }
}
