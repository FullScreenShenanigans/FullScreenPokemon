import { Section } from "eightbittr";
import { MenuDialogRaw } from "menugraphr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { Character, Detector, Player } from "../Actors";

/**
 * Handlers for collisions with Detector Actors.
 */
export class Detectors extends Section<FullScreenPokemon> {
    /**
     * Collision callback for a Player and a dialog-containing Character. The
     * dialog is started if it exists, as with a cutscene from other.
     *
     * @param actor   A Player triggering other.
     * @param other   A Character with dialog triggered by actor.
     */
    public collideCharacterDialog = (actor: Player, other: Character): void => {
        let dialog = other.dialog;

        if (other.cutscene) {
            this.game.scenePlayer.startCutscene(other.cutscene, {
                actor,
                triggerer: other,
            });
        }

        if (!dialog) {
            return;
        }

        const direction = this.game.physics.getDirectionBetween(other, actor);

        if (other.dialogDirections) {
            dialog = (dialog as MenuDialogRaw[])[direction];
            if (!dialog) {
                return;
            }
        }

        actor.talking = true;
        other.talking = true;

        if (!this.game.menuGrapher.getActiveMenu()) {
            this.game.menuGrapher.createMenu("GeneralText", {
                deleteOnFinish: !other.dialogOptions,
            });
            this.game.menuGrapher.setActiveMenu("GeneralText");
            this.game.menuGrapher.addMenuDialog("GeneralText", dialog, (): void =>
                this.game.actions.animateCharacterDialogFinish(actor, other)
            );
        }

        if (other.switchDirectionOnDialog) {
            this.game.actions.animateCharacterSetDirection(other, direction);
        }
    };

    /**
     * Collision callback for a Character and a CollisionDetector. Only Players may
     * trigger the detector, which has to be active to do anything.
     *
     * @param actor   A Character triggering other.
     * @param other   A Detector triggered by actor.
     * @returns Whether to override normal positioning logic in hitCharacterActor.
     */
    public collideCollisionDetector = (actor: Player, other: Detector): boolean => {
        if (!actor.player) {
            return false;
        }

        if (other.active) {
            if (!other.requireOverlap || this.game.physics.isActorWithinOther(actor, other)) {
                if (
                    typeof other.requireDirection !== "undefined" &&
                    !actor.keys[other.requireDirection] &&
                    !actor.allowDirectionAsKeys &&
                    actor.direction !== other.requireDirection
                ) {
                    return false;
                }

                if (other.singleUse) {
                    other.active = false;
                }

                if (!other.activate) {
                    throw new Error("No activate callback for collision detector.");
                }

                other.activate.call(this.game.actions, actor, other);
            }

            return true;
        }

        // If the actor is moving towards the triggerer, it's now active
        if (actor.direction === this.game.physics.getDirectionBordering(actor, other)) {
            other.active = true;
            return true;
        }

        return false;
    };
}
