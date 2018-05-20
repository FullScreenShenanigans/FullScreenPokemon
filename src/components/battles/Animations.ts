import { component } from "babyioc";
import { BattleOutcome, IAnimations, Team } from "battlemovr";
import { GeneralComponent } from "eightbittr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { Ending } from "./animations/Ending";
import { Opponent } from "./animations/Opponent";
import { Player } from "./animations/Player";
import { Starting } from "./animations/Starting";
import { Things } from "./animations/Things";

/**
 * Animations for battle events.
 */
export class Animations<TEightBittr extends FullScreenPokemon> extends GeneralComponent<TEightBittr> implements IAnimations {
    /**
     * Animations for opponent battle events.
     */
    @component(Opponent)
    public readonly opponent: Opponent<TEightBittr>;

    /**
     * Animations for player battle events.
     */
    @component(Player)
    public readonly player: Player<TEightBittr>;

    /**
     * Thing animations for battles.
     */
    @component(Things)
    public readonly things: Things<TEightBittr>;

    /**
     * Animation for a battle starting.
     *
     * @param onComplete   Callback for when this is done.
     */
    public readonly start = (onComplete: () => void): void => {
        new Starting(this.eightBitter).run(onComplete);
    }

    /**
     * Animation for a battle ending.
     *
     * @param outcome   Descriptor of what finished the battle.
     * @param onComplete   Callback for when this is done.
     */
    public readonly complete = (outcome: BattleOutcome, onComplete: () => void): void => {
        new Ending(this.eightBitter).run(outcome, onComplete);
    }

    /**
     * Retrieves the animator for a team.
     *
     * @param team   Which team's animator to retrieve.
     * @returns The team's animator.
     */
    public getTeamAnimations(team: Team): Opponent<TEightBittr> | Player<TEightBittr> {
        return team === Team.opponent ? this.opponent : this.player;
    }
}
