import { MoveAction, MoveEffect, TeamAndAction, TeamId } from "battlemovr";
import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../../../../FullScreenPokemon";
import { BattleInfo, Pokemon } from "../../../../Battles";
import { Menu } from "../../../../Menus";
import { Actor } from "../../../../Actors";

/**
 * Runs a battle move.
 */
export class Move extends Section<FullScreenPokemon> {
    /**
     * Team and move being performed.
     */
    protected readonly teamAndAction: TeamAndAction<MoveAction>;

    /**
     * Pokemon being targeted.
     */
    protected readonly attacker: Pokemon;

    /**
     * Visually attaching Actor.
     */
    protected readonly attackerActor: Actor;

    /**
     * Pokemon using the move.
     */
    protected readonly defender: Pokemon;

    /**
     * Visually defending Actor being attacked.
     */
    protected readonly defenderActor: Actor;

    /**
     * Movement direction from the attacker to the defender.
     */
    protected direction: -1 | 1;

    /**
     * Battle display menu.
     */
    protected readonly menu: Menu;

    /**
     * Initializes a new instance of the Move class.
     *
     * @param eightBitter   FullScreenPokemon instance this is used for.
     * @param teamAndAction   Team and move being performed.
     */
    public constructor(eightBitter: FullScreenPokemon, teamAndAction: TeamAndAction<MoveAction>) {
        super(eightBitter);

        this.teamAndAction = teamAndAction;

        const battleInfo: BattleInfo = eightBitter.battleMover.getBattleInfo() as BattleInfo;
        this.attacker = battleInfo.teams[TeamId[teamAndAction.source.team]].selectedActor;
        this.attackerActor = battleInfo.actors[TeamId[teamAndAction.source.team]];
        this.defender = battleInfo.teams[TeamId[teamAndAction.target.team]].selectedActor;
        this.defenderActor = battleInfo.actors[TeamId[teamAndAction.target.team]];
        this.direction = this.teamAndAction.source.team === TeamId.opponent ? -1 : 1;
        this.menu = this.game.menuGrapher.getMenu("BattleDisplayInitial") as Menu;
    }

    /**
     * @returns Effects running this move will cause.
     */
    public getEffects(): MoveEffect[] {
        return this.game.constants.moves.byName[this.teamAndAction.action.move].effects;
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
