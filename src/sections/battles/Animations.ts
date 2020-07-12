import { member } from "babyioc";
import { BattleOutcome, IAnimations, Team } from "battlemovr";
import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../FullScreenPokemon";

import { Ending } from "./animations/Ending";
import { Opponent } from "./animations/Opponent";
import { Player } from "./animations/Player";
import { Starting } from "./animations/Starting";
import { Things } from "./animations/Things";

/**
 * Animations for battle events.
 */
export class Animations extends Section<FullScreenPokemon> implements IAnimations {
    /**
     * Animations for opponent battle events.
     */
    @member(Opponent)
    public readonly opponent: Opponent;

    /**
     * Animations for player battle events.
     */
    @member(Player)
    public readonly player: Player;

    /**
     * Thing animations for battles.
     */
    @member(Things)
    public readonly things: Things;

    /**
     * Animation for a battle starting.
     *
     * @param onComplete   Callback for when this is done.
     */
    public readonly start = (onComplete: () => void): void => {
        new Starting(this.game).run(onComplete);
    };

    /**
     * Animation for a battle ending.
     *
     * @param outcome   Descriptor of what finished the battle.
     * @param onComplete   Callback for when this is done.
     */
    public readonly complete = (outcome: BattleOutcome, onComplete: () => void): void => {
        new Ending(this.game).run(outcome, onComplete);
    };

    /**
     * Retrieves the animator for a team.
     *
     * @param team   Which team's animator to retrieve.
     * @returns The team's animator.
     */
    public getTeamAnimations(team: Team): Opponent | Player {
        return team === Team.opponent ? this.opponent : this.player;
    }
}
