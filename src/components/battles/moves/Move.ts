import { IMoveEffect } from "battlemovr/lib/Effects";
import { Team } from "battlemovr/lib/Teams";
import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../../../FullScreenPokemon";
import { IPokemon } from "../../Battles";
import { IMenu } from "../../Menus";
import { IThing } from "../../Things";

/**
 * Runs a battle move.
 */
export class Move<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
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
     * Title of the move.
     */
    protected readonly title: string;

    /**
     * Team whose Pokemon is using the move.
     */
    protected readonly source: Team;

    /**
     * Team whose Pokemon is being targeted.
     */
    protected readonly target: Team;

    /**
     * Initializes a new instance of the Move class.
     * 
     * @param gameStarter   FullScreenPokemon instance this is used for.
     * @param title   Tit;le of the move.
     * @param source   Team whose Pokemon is using the move.
     * @param target   Team whose Pokemon is being targeted.
     */
    public constructor(gameStarter: TGameStartr, title: string, source: Team, target: Team) {
        super(gameStarter);

        this.title = title;
        this.source = source;
        this.target = target;

        this.attacker = gameStarter.battleMover.getBattleInfo().teams[source].selectedActor as IPokemon;
        this.defender = gameStarter.battleMover.getBattleInfo().teams[target].selectedActor as IPokemon;

        // Todo: where should this be done...?
        this.attackerThing = {} as any;
        this.defenderThing = {} as any;

        this.menu = this.gameStarter.menuGrapher.getMenu("BattleDisplayInitial") as IMenu;
    }

    /**
     * @returns Effects running this move will cause.
     */
    public getEffects(): IMoveEffect[] {
        return this.gameStarter.constants.moves.byName[this.title].effects;
    }

    /**
     * Runs the move's animation.
     * 
     * @param callback   Callback for when the animation is done.
     */
    public runAnimation(callback: () => void): void {
        console.log(`Still need to implement '${this.title}'...`);
        callback();
    }
}
