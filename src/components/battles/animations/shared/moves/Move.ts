import { IMoveAction, IMoveEffect, ITeamAndAction, Team } from "battlemovr";
import { GeneralComponent } from "eightbittr";

import { FullScreenPokemon } from "../../../../../FullScreenPokemon";
import { IBattleInfo, IPokemon } from "../../../../Battles";
import { IMenu } from "../../../../Menus";
import { IThing } from "../../../../Things";

/**
 * Runs a battle move.
 */
export class Move<TEightBittr extends FullScreenPokemon> extends GeneralComponent<TEightBittr> {
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
     * Movement direction from the attacker to the defender.
     */
    protected direction: -1 | 1;

    /**
     * Battle display menu.
     */
    protected readonly menu: IMenu;

    /**
     * Initializes a new instance of the Move class.
     *
     * @param eightBitter   FullScreenPokemon instance this is used for.
     * @param teamAndAction   Team and move being performed.
     */
    public constructor(eightBitter: TEightBittr, teamAndAction: ITeamAndAction<IMoveAction>) {
        super(eightBitter);

        this.teamAndAction = teamAndAction;

        const battleInfo: IBattleInfo = eightBitter.battleMover.getBattleInfo() as IBattleInfo;
        this.attacker = battleInfo.teams[Team[teamAndAction.source.team]].selectedActor;
        this.attackerThing = battleInfo.things[Team[teamAndAction.source.team]];
        this.defender = battleInfo.teams[Team[teamAndAction.target.team]].selectedActor;
        this.defenderThing = battleInfo.things[Team[teamAndAction.target.team]];
        this.direction = this.teamAndAction.source.team === Team.opponent ? -1 : 1;
        this.menu = this.eightBitter.menuGrapher.getMenu("BattleDisplayInitial") as IMenu;
    }

    /**
     * @returns Effects running this move will cause.
     */
    public getEffects(): IMoveEffect[] {
        return this.eightBitter.constants.moves.byName[this.teamAndAction.action.move].effects;
    }

    /**
     * Runs the move's animation.
     *
     * @param onComplete   Callback for when the animation is done.
     * @todo Make this abstract when all moves have it implemented.
     */
    public runAnimation(onComplete: () => void): void {
        console.log(`Still need to implement '${this.teamAndAction.action.move}'...`);
        onComplete();
    }
}
