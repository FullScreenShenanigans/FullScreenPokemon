import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { Direction } from "../Constants";
import { ICharacter } from "../Things";

/**
 * Following functions used by FullScreenPokemon instances.
 */
export class Following<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
    /**
     * Starts a Character following another Character.
     * 
     * @param follow   The following Character.
     * @param lead   The leading Character.
     */
    public startFollowing(follow: ICharacter, lead: ICharacter): void {
        const direction: Direction | undefined = this.gameStarter.physics.getDirectionBordering(follow, lead);
        if (direction === undefined) {
            throw new Error("Characters are too far away to follow.");
        }

        lead.follower = follow;
        follow.following = lead;

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
     * Handles a follow needing to continue following after a block.
     * 
     * @param follow   The following Character.
     * @param direction   What direction to walk in next.
     */
    public continueFollowing(follow: ICharacter, direction: Direction): void {
        follow.wantsToWalk = true;
        follow.nextDirection = direction;
    }

    /**
     * Handles a following Charcater's lead stopping walking.
     * 
     * @param follow   The following Character.
     */
    public pauseFollowing(follow: ICharacter): void {
        follow.wantsToWalk = false;
    }

    /**
     * Handles a following Character ceasing to follow.
     * 
     * @param follow   The following Character.
     * @param lead   The leading Character.
     */
    public stopFollowing(follow: ICharacter, lead: ICharacter): void {
        lead.follower = undefined;
        follow.following = undefined;
    }
}
