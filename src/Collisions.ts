/// <reference path="../typings/EightBittr.d.ts" />

import { FullScreenPokemon } from "./FullScreenPokemon";
import { IThing } from "./IFullScreenPokemon";

/**
 * Collision functions used by FullScreenPokemon instances.
 */
export class Collisions<TEightBittr extends FullScreenPokemon> extends EightBittr.Component<TEightBittr> {
    /**
     * Function generator for the generic canThingCollide checker. This is used
     * repeatedly by ThingHittr to generate separately optimized Functions for
     * different Thing types.
     * 
     * @returns A Function that generates a canThingCollide checker.
     */
    generateCanThingCollide(): (thing: IThing) => boolean {
        /**
         * Generic checker for canCollide. This just returns if the Thing is alive.
         * 
         * @param thing
         * @returns Whether the thing can collide.
         */
        return function canThingCollide(thing: IThing): boolean {
            return thing.alive;
        };
    }

    /**
     * Function generator for the generic isCharacterTouchingCharacter checker.
     * This is used repeatedly by ThingHittr to generate separately optimized
     * Functions for different Thing types.
     * 
     * @returns A Function that generates isCharacterTouchingCharacter. 
     */
    generateIsCharacterTouchingCharacter(): (thing: ICharacter, other: ICharacter) => boolean {
        /**
         * Generic checker for whether two characters are touching each other.
         * This checks to see if either has the nocollide flag, or if they're
         * overlapping, respecting tolerances.
         * 
         * @param thing
         * @param other
         * @returns Whether thing is touching other.
         */
        return function isCharacterTouchingCharacter(thing: ICharacter, other: ICharacter): boolean {
            // if (other.xvel || other.yvel) {
            //     // check destination...
            // }
            return (
                !thing.nocollide && !other.nocollide
                && thing.right >= (other.left + other.tolLeft)
                && thing.left <= (other.right - other.tolRight)
                && thing.bottom >= (other.top + other.tolTop)
                && thing.top <= (other.bottom - other.tolBottom));
        };
    }

    /**
     * Function generator for the generic isCharacterTouchingSolid checker. This
     * is used repeatedly by ThingHittr to generate separately optimized
     * Functions for different Thing types.
     * 
     * @returns A Function that generates isCharacterTouchingSolid.
     */
    generateIsCharacterTouchingSolid(): (thing: ICharacter, other: IThing) => boolean {
        /**
         * Generic checker for whether a character is touching a solid. The
         * hidden, collideHidden, and nocollidesolid flags are most relevant.
         * 
         * @param thing
         * @param other
         * @returns Whether thing is touching other.
         */
        return function isCharacterTouchingSolid(thing: ICharacter, other: IThing): boolean {
            return (
                !thing.nocollide && !other.nocollide
                && thing.right >= (other.left + other.tolLeft)
                && thing.left <= (other.right - other.tolRight)
                && thing.bottom >= (other.top + other.tolTop)
                && thing.top <= (other.bottom - other.tolBottom));
        };
    }

    /**
     * Function generator for the generic hitCharacterThing callback. This is 
     * used repeatedly by ThingHittr to generate separately optimized Functions
     * for different Thing types.
     * 
     * @returns A Function that generates hitCharacterThing.
     */
    generateHitCharacterThing(): (thing: ICharacter, other: IThing) => boolean {
        /**
         * Generic callback for when a Character touches a Thing. Other may have a
         * .collide to override with, but normally this just sets thing's position.
         * 
         * @param thing
         * @param other
         * @returns Whether thing is hitting other.
         */
        return function hitCharacterThing(thing: ICharacter, other: IThing): boolean {
            // If either Thing is the player, it should be the first
            if ((<ICharacter>other).player && !thing.player) {
                [thing, other] = [<ICharacter>other, thing];
            }

            // The other's collide may return true to cancel overlapping checks
            if (other.collide && other.collide(thing, other)) {
                return;
            }

            // Both the thing and other should know they're bordering each other
            // If other is a large solid, this will be irreleveant, so it's ok
            // that multiple borderings will be replaced by the most recent
            switch (thing.FSP.getDirectionBordering(thing, other)) {
                case Direction.Top:
                    if (thing.left !== other.right - other.tolRight && thing.right !== other.left + other.tolLeft) {
                        thing.FSP.setThingBordering(thing, other, Direction.Top);
                        thing.FSP.setThingBordering(other, thing, Direction.Bottom);
                        thing.FSP.setTop(thing, other.bottom - other.tolBottom);
                    }
                    break;

                case Direction.Right:
                    if (thing.top !== other.bottom - other.tolBottom && thing.bottom !== other.top + other.tolTop) {
                        thing.FSP.setThingBordering(thing, other, Direction.Right);
                        thing.FSP.setThingBordering(other, thing, Direction.Left);
                        thing.FSP.setRight(thing, other.left + other.tolLeft);
                    }
                    break;

                case Direction.Bottom:
                    if (thing.left !== other.right - other.tolRight && thing.right !== other.left + other.tolLeft) {
                        thing.FSP.setThingBordering(thing, other, Direction.Bottom);
                        thing.FSP.setThingBordering(other, thing, Direction.Top);
                        thing.FSP.setBottom(thing, other.top + other.tolTop);
                    }
                    break;

                case Direction.Left:
                    if (thing.top !== other.bottom - other.tolBottom && thing.bottom !== other.top + other.tolTop) {
                        thing.FSP.setThingBordering(thing, other, Direction.Left);
                        thing.FSP.setThingBordering(other, thing, Direction.Right);
                        thing.FSP.setLeft(thing, other.right - other.tolRight);
                    }
                    break;

                default:
                    break;
            }
        };
    }

    /**
     * Marks other as being a border of thing in the given direction, respecting borderPrimary.
     * 
     * @param thing   A Thing whose borders are being checked.
     * @param other   A new border for thing.
     * @param direction   The direction border being changed.
     */
    setThingBordering(thing: IThing, other: IThing, direction: Direction): void {
        if (thing.bordering[direction] && thing.bordering[direction].borderPrimary && !other.borderPrimary) {
            return;
        }

        thing.bordering[direction] = other;
    }

    /**
     * Collision callback for a Character and a CollisionDetector. Only Players may
     * trigger the detector, which has to be active to do anything.
     * 
     * @param thing   A Character triggering other.
     * @param other   A Detector triggered by thing.
     * @returns Whether to override normal positioning logic in hitCharacterThing.
     */
    collideCollisionDetector(thing: IPlayer, other: IDetector): boolean {
        if (!thing.player) {
            return false;
        }

        if (other.active) {
            if (!other.requireOverlap || thing.FSP.isThingWithinOther(thing, other)) {
                if (
                    typeof other.requireDirection !== "undefined"
                    && !thing.keys[other.requireDirection]
                    && !thing.allowDirectionAsKeys
                    && thing.direction !== other.requireDirection
                ) {
                    return false;
                }

                if (other.singleUse) {
                    other.active = false;
                }
                other.activate.call(thing.FSP, thing, other);
            }

            return true;
        }

        // If the thing is moving towards the triggerer, it's now active
        if (thing.direction === thing.FSP.getDirectionBordering(thing, other)) {
            other.active = true;
            return true;
        }
    }

    /**
     * Collision callback for a Player and a dialog-containing Character. The
     * dialog is started if it exists, as with a cutscene from other.
     * 
     * @param thing   A Player triggering other.
     * @param other   A Character with dialog triggered by thing.
     */
    collideCharacterDialog(thing: IPlayer, other: ICharacter): void {
        let dialog: MenuGraphr.IMenuDialogRaw | MenuGraphr.IMenuDialogRaw[] = other.dialog,
            direction: Direction;

        if (other.cutscene) {
            thing.FSP.ScenePlayer.startCutscene(other.cutscene, {
                "thing": thing,
                "triggerer": other
            });
        }

        if (!dialog) {
            return;
        }

        direction = thing.FSP.getDirectionBetween(other, thing);

        if (other.dialogDirections) {
            dialog = (<MenuGraphr.IMenuDialogRaw[]>dialog)[direction];
            if (!dialog) {
                return;
            }
        }

        thing.talking = true;
        other.talking = true;
        thing.canKeyWalking = false;

        if (!thing.FSP.MenuGrapher.getActiveMenu()) {
            thing.FSP.MenuGrapher.createMenu("GeneralText", {
                "deleteOnFinish": !other.dialogOptions
            });
            thing.FSP.MenuGrapher.setActiveMenu("GeneralText");
            thing.FSP.MenuGrapher.addMenuDialog(
                "GeneralText",
                dialog,
                thing.FSP.animateCharacterDialogFinish.bind(thing.FSP, thing, other)
            );
        }

        if (other.switchDirectionOnDialog) {
            thing.FSP.animateCharacterSetDirection(other, direction);
        }
    }

    /**
     * Collision callback for a Player and a Pokeball it's interacting with.
     * 
     * @param thing   A Player interacting with other.
     * @param other   A Pokeball being interacted with by thing.
     */
    collidePokeball(thing: IPlayer, other: IPokeball): void {
        switch (other.action) {
            case "item":
                thing.FSP.MenuGrapher.createMenu("GeneralText");
                thing.FSP.MenuGrapher.addMenuDialog(
                    "GeneralText",
                    [
                        "%%%%%%%PLAYER%%%%%%% found " + other.item + "!"
                    ],
                    function (): void {
                        thing.FSP.MenuGrapher.deleteActiveMenu();
                        thing.FSP.killNormal(other);
                        thing.FSP.StateHolder.addChange(
                            other.id, "alive", false
                        );
                    }
                );
                thing.FSP.MenuGrapher.setActiveMenu("GeneralText");

                thing.FSP.addItemToBag(other.item, other.amount);
                break;

            case "cutscene":
                thing.FSP.ScenePlayer.startCutscene(other.cutscene, {
                    "player": thing,
                    "triggerer": other
                });
                if (other.routine) {
                    thing.FSP.ScenePlayer.playRoutine(other.routine);
                }
                break;

            case "pokedex":
                thing.FSP.openPokedexListing(other.pokemon);
                break;

            case "dialog":
                thing.FSP.MenuGrapher.createMenu("GeneralText");
                thing.FSP.MenuGrapher.addMenuDialog("GeneralText", other.dialog);
                thing.FSP.MenuGrapher.setActiveMenu("GeneralText");
                break;

            case "yes/no":
                thing.FSP.MenuGrapher.createMenu("Yes/No", {
                    "killOnB": ["GeneralText"]
                });
                thing.FSP.MenuGrapher.addMenuList("Yes/No", {
                    "options": [
                        {
                            "text": "YES",
                            "callback": console.log.bind(console, "What do, yes?")
                        }, {
                            "text": "NO",
                            "callback": console.log.bind(console, "What do, no?")
                        }]
                });
                thing.FSP.MenuGrapher.setActiveMenu("Yes/No");
                break;

            default:
                throw new Error("Unknown Pokeball action: " + other.action + ".");
        }
    }

    /**
     * Marks a Character as being visually within grass. 
     * 
     * @param thing   A Character within grass.
     * @param other   The specific Grass that thing is within.
     */
    collideCharacterGrass(thing: ICharacter, other: IGrass): boolean {
        if (thing.grass || !thing.FSP.isThingWithinGrass(thing, other)) {
            return true;
        }

        thing.grass = other;
        thing.FSP.addStateHistory(thing, "height", thing.height);

        // Todo: Find a better way than manually setting canvas height?
        thing.canvas.height = thing.heightGrass * thing.FSP.unitsize;
        thing.FSP.PixelDrawer.setThingSprite(thing);

        thing.shadow = thing.FSP.ObjectMaker.make(thing.title, {
            "nocollide": true,
            "id": thing.id + " shadow"
        });

        if (thing.shadow.className !== thing.className) {
            thing.FSP.setClass(thing.shadow, thing.className);
        }

        thing.FSP.addThing(thing.shadow, thing.left, thing.top);

        // Todo: is the arrayToEnd call necessary?
        thing.FSP.GroupHolder.switchMemberGroup(thing.shadow, thing.shadow.groupType, "Terrain");
        thing.FSP.arrayToEnd(thing.shadow, <IThing[]>thing.FSP.GroupHolder.getGroup("Terrain"));

        return true;
    }

    /**
     * Collision callback for a Character and a Ledge. If possible, the Character
     * is animated to start hopping over the Ledge.
     * 
     * @param thing   A Character walking to other.
     * @param other   A Ledge walked to by thing.
     */
    collideLedge(thing: ICharacter, other: IThing): boolean {
        if (thing.ledge || !thing.walking) {
            return true;
        }

        if (thing.direction !== other.direction) {
            return false;
        }

        if (thing.direction % 2 === 0) {
            if (thing.left === other.right || thing.right === other.left) {
                return true;
            }
        } else {
            if (thing.top === other.bottom || thing.bottom === other.top) {
                return true;
            }
        }

        if (thing.player) {
            (<IPlayer>thing).canKeyWalking = false;
            thing.FSP.MapScreener.blockInputs = true;
        }
        thing.FSP.animateCharacterHopLedge(thing, other);

        return true;
    }

    /**
     * Collision callback for a Character and a WaterEdge. If possible, the Character
     * is animated to move onto land.
     *
     * @param thing   A Character walking to other.
     * @param other   A Ledge walked to by thing.
     */
    collideWaterEdge(thing: ICharacter, other: IThing): boolean {
        let edge: IWaterEdge = <IWaterEdge>other;

        if (!thing.surfing || edge.exitDirection !== thing.direction) {
            return false;
        }

        thing.FSP.animateCharacterStartWalking(thing, thing.direction, [2]);
        thing.surfing = false;
        this.removeClass(thing, "surfing");
        return true;
    }
}
