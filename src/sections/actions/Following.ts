import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { Direction } from "../Constants";
import { Character } from "../Actors";

/**
 * Sets characters following each other.
 */
export class Following extends Section<FullScreenPokemon> {
    /**
     * Starts a Character following another Character.
     *
     * @param follow   The following Character.
     * @param lead   The leading Character.
     */
    public startFollowing(follow: Character, lead: Character): void {
        const direction: Direction | undefined = this.game.physics.getDirectionBordering(
            follow,
            lead
        );
        if (direction === undefined) {
            throw new Error("Characters are too far away to follow.");
        }

        lead.follower = follow;
        follow.following = lead;

        this.game.saves.addStateHistory(follow, "speed", follow.speed);
        follow.speed = lead.speed;

        this.game.actions.animateCharacterSetDirection(follow, direction);

        switch (direction) {
            case Direction.Top:
                this.game.physics.setTop(follow, lead.bottom);
                break;
            case Direction.Right:
                this.game.physics.setRight(follow, lead.left);
                break;
            case Direction.Bottom:
                this.game.physics.setBottom(follow, lead.top);
                break;
            case Direction.Left:
                this.game.physics.setLeft(follow, lead.right);
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
    public continueFollowing(follow: Character, direction: Direction): void {
        follow.wantsToWalk = true;
        follow.nextDirection = direction;
    }

    /**
     * Handles a following Charcater's lead stopping walking.
     *
     * @param follow   The following Character.
     */
    public pauseFollowing(follow: Character): void {
        follow.wantsToWalk = false;
    }

    /**
     * Handles a following Character ceasing to follow.
     *
     * @param follow   The following Character.
     * @param lead   The leading Character.
     */
    public stopFollowing(follow: Character, lead: Character): void {
        lead.follower = undefined;
        follow.following = undefined;
    }
}
