import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { Direction } from "../Constants";
import { ICharacter } from "../Things";

/**
 * 
 */
export class Following<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
    /**
     * 
     */
    public startFollowing(follow: ICharacter, lead: ICharacter): void {
        const direction: Direction | undefined = this.gameStarter.physics.getDirectionBordering(follow, lead);
        if (direction === undefined) {
            throw new Error("Characters are too far away to follow.");
        }

        lead.follower = follow;
        follow.following = lead;
        follow.nocollide = true;
        follow.followCommands = [direction];

        this.gameStarter.saves.addStateHistory(follow, "speed", follow.speed);
        follow.speed = lead.speed;

        this.gameStarter.actions.animateCharacterSetDirection(follow, direction);

        switch (direction) {
            case Direction.Top:
                this.gameStarter.physics.setTop(follow, lead.bottom);
                break;
            case Direction.Right:
                this.gameStarter.physics.setRight(follow, lead.left);
                break;
            case Direction.Bottom:
                this.gameStarter.physics.setBottom(follow, lead.top);
                break;
            case Direction.Left:
                this.gameStarter.physics.setLeft(follow, lead.right);
                break;
            default:
                break;
        }
    }

    /**
     * 
     */
    public continueFollowing(follow: ICharacter, direction: Direction): void {
        follow.wantsToWalk = true;
        follow.nextDirection = direction;
    }

    /**
     * 
     */
    public pauseFollowing(follow: ICharacter): void {
        follow.wantsToWalk = false;
    }

    /**
     * 
     */
    public stopFollowing(follow: ICharacter, lead: ICharacter): void {
        lead.follower = undefined;
        follow.following = undefined;
        follow.nocollide = false;
        follow.followCommands = [];
    }
}
