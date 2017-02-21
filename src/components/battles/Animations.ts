import { BattleOutcome, IAnimations } from "battlemovr/lib/Animations";
import { Team } from "battlemovr/lib/Teams";
import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { Ending } from "./animations/Ending";
import { Opponent } from "./animations/Opponent";
import { Player } from "./animations/Player";
import { Starting } from "./animations/Starting";
import { Things } from "./animations/Things";

/**
 * Battle animations used by FullScreenPokemon instances.
 */
export class Animations<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> implements IAnimations {
    /**
     * Opponent animations used by the FullScreenPokemon instance.
     */
    public readonly opponent: Opponent<TGameStartr> = new Opponent(this.gameStarter);

    /**
     * Player animations used by the FullScreenPokemon instance.
     */
    public readonly player: Player<TGameStartr> = new Player(this.gameStarter);

    /**
     * Thing animations for battles.
     */
    public readonly things: Things<TGameStartr> = new Things(this.gameStarter);

    /**
     * Animation for a battle starting.
     * 
     * @param onComplete   Callback for when this is done.
     */
    public readonly start = (onComplete: () => void): void => {
        new Starting(this.gameStarter).run(onComplete);
    }

    /**
     * Animation for a battle ending.
     * 
     * @param outcome   Descriptor of what finished the battle.
     * @param onComplete   Callback for when this is done.
     */
    public readonly complete = (outcome: BattleOutcome, onComplete: () => void): void => {
        new Ending(this.gameStarter).run(outcome, onComplete);
    }

    /**
     * Retrieves the animator for a team.
     * 
     * @param team   Which team's animator to retrieve.
     * @returns The team's animator.
     */
    public getTeamAnimations(team: Team): Opponent<TGameStartr> | Player<TGameStartr> {
        return team === Team.opponent ? this.opponent : this.player;
    }
}
