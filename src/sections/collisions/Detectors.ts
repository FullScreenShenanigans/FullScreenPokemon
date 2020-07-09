import { Section } from "eightbittr";
import { IMenuDialogRaw } from "menugraphr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { Direction } from "../Constants";
import { ICharacter, IDetector, IPlayer } from "../Things";

/**
 * Handlers for collisions with Detector Things.
 */
export class Detectors extends Section<FullScreenPokemon> {
    /**
     * Collision callback for a Player and a dialog-containing Character. The
     * dialog is started if it exists, as with a cutscene from other.
     *
     * @param thing   A Player triggering other.
     * @param other   A Character with dialog triggered by thing.
     */
    public collideCharacterDialog = (thing: IPlayer, other: ICharacter): void => {
        let dialog: IMenuDialogRaw | IMenuDialogRaw[] | undefined = other.dialog;
        let direction: Direction | undefined;

        if (other.cutscene) {
            this.game.scenePlayer.startCutscene(other.cutscene, {
                thing,
                triggerer: other,
            });
        }

        if (!dialog) {
            return;
        }

        direction = this.game.physics.getDirectionBetween(other, thing);

        if (other.dialogDirections) {
            dialog = (dialog as IMenuDialogRaw[])[direction];
            if (!dialog) {
                return;
            }
        }

        thing.talking = true;
        other.talking = true;

        if (!this.game.menuGrapher.getActiveMenu()) {
            this.game.menuGrapher.createMenu("GeneralText", {
                deleteOnFinish: !other.dialogOptions,
            });
            this.game.menuGrapher.setActiveMenu("GeneralText");
            this.game.menuGrapher.addMenuDialog(
                "GeneralText",
                dialog,
                (): void => this.game.actions.animateCharacterDialogFinish(thing, other),
            );
        }

        if (other.switchDirectionOnDialog) {
            this.game.actions.animateCharacterSetDirection(other, direction);
        }
    }

    /**
     * Collision callback for a Character and a CollisionDetector. Only Players may
     * trigger the detector, which has to be active to do anything.
     *
     * @param thing   A Character triggering other.
     * @param other   A Detector triggered by thing.
     * @returns Whether to override normal positioning logic in hitCharacterThing.
     */
    public collideCollisionDetector = (thing: IPlayer, other: IDetector): boolean => {
        if (!thing.player) {
            return false;
        }

        if (other.active) {
            if (!other.requireOverlap || this.game.physics.isThingWithinOther(thing, other)) {
                if (
                    typeof other.requireDirection !== "undefined"
                    && !(thing.keys)[other.requireDirection]
                    && !thing.allowDirectionAsKeys
                    && thing.direction !== other.requireDirection
                ) {
                    return false;
                }

                if (other.singleUse) {
                    other.active = false;
                }

                if (!other.activate) {
                    throw new Error("No activate callback for collision detector.");
                }

                other.activate.call(this.game.actions, thing, other);
            }

            return true;
        }

        // If the thing is moving towards the triggerer, it's now active
        if (thing.direction === this.game.physics.getDirectionBordering(thing, other)) {
            other.active = true;
            return true;
        }

        return false;
    }
}
