/// <reference path="../typings/EightBittr.d.ts" />

import { Direction } from "./Constants";
import { FullScreenPokemon } from "./FullScreenPokemon";
import { ICharacter, IDetector, IGrass, IPlayer, IPokeball, IThing, IWaterEdge } from "./IFullScreenPokemon";

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
    public generateCanThingCollide(): (thing: IThing) => boolean {
        /**
         * Generic checker for canCollide. This just returns if the Thing is alive.
         * 
         * @param thing
         * @returns Whether the thing can collide.
         */
        return (thing: IThing): boolean => thing.alive;
    }

    /**
     * Function generator for the generic isCharacterTouchingCharacter checker.
     * This is used repeatedly by ThingHittr to generate separately optimized
     * Functions for different Thing types.
     * 
     * @returns A Function that generates isCharacterTouchingCharacter. 
     */
    public generateIsCharacterTouchingCharacter(): (thing: ICharacter, other: ICharacter) => boolean {
        /**
         * Generic checker for whether two characters are touching each other.
         * This checks to see if either has the nocollide flag, or if they're
         * overlapping, respecting tolerances.
         * 
         * @param thing
         * @param other
         * @returns Whether thing is touching other.
         */
        return (thing: ICharacter, other: ICharacter): boolean => (
            !thing.nocollide && !other.nocollide
            && thing.right >= (other.left + other.tolLeft)
            && thing.left <= (other.right - other.tolRight)
            && thing.bottom >= (other.top + other.tolTop)
            && thing.top <= (other.bottom - other.tolBottom));
    }

    /**
     * Function generator for the generic isCharacterTouchingSolid checker. This
     * is used repeatedly by ThingHittr to generate separately optimized
     * Functions for different Thing types.
     * 
     * @returns A Function that generates isCharacterTouchingSolid.
     */
    public generateIsCharacterTouchingSolid(): (thing: ICharacter, other: IThing) => boolean {
        /**
         * Generic checker for whether a character is touching a solid. The
         * hidden, collideHidden, and nocollidesolid flags are most relevant.
         * 
         * @param thing
         * @param other
         * @returns Whether thing is touching other.
         */
        return (thing: ICharacter, other: IThing): boolean => (
            !thing.nocollide && !other.nocollide
            && thing.right >= (other.left + other.tolLeft)
            && thing.left <= (other.right - other.tolRight)
            && thing.bottom >= (other.top + other.tolTop)
            && thing.top <= (other.bottom - other.tolBottom));
    }

    /**
     * Function generator for the generic hitCharacterThing callback. This is 
     * used repeatedly by ThingHittr to generate separately optimized Functions
     * for different Thing types.
     * 
     * @returns A Function that generates hitCharacterThing.
     */
    public generateHitCharacterThing(): (thing: ICharacter, other: IThing) => boolean {
        /**
         * Generic callback for when a Character touches a Thing. Other may have a
         * .collide to override with, but normally this just sets thing's position.
         * 
         * @param thing
         * @param other
         * @returns Whether thing is hitting other.
         */
        return (thing: ICharacter, other: IThing): boolean => {
            // If either Thing is the player, it should be the first
            if ((other as ICharacter).player && !thing.player) {
                [thing, other] = [other as ICharacter, thing];
            }

            // The other's collide may return true to cancel overlapping checks
            if (other.collide && other.collide(thing, other)) {
                return;
            }

            // Both the thing and other should know they're bordering each other
            // If other is a large solid, this will be irreleveant, so it's ok
            // that multiple borderings will be replaced by the most recent
            switch (this.EightBitter.physics.getDirectionBordering(thing, other)) {
                case Direction.Top:
                    if (thing.left !== other.right - other.tolRight && thing.right !== other.left + other.tolLeft) {
                        this.setThingBordering(thing, other, Direction.Top);
                        this.setThingBordering(other, thing, Direction.Bottom);
                        this.EightBitter.physics.setTop(thing, other.bottom - other.tolBottom);
                    }
                    break;

                case Direction.Right:
                    if (thing.top !== other.bottom - other.tolBottom && thing.bottom !== other.top + other.tolTop) {
                        this.setThingBordering(thing, other, Direction.Right);
                        this.setThingBordering(other, thing, Direction.Left);
                        this.EightBitter.physics.setRight(thing, other.left + other.tolLeft);
                    }
                    break;

                case Direction.Bottom:
                    if (thing.left !== other.right - other.tolRight && thing.right !== other.left + other.tolLeft) {
                        this.setThingBordering(thing, other, Direction.Bottom);
                        this.setThingBordering(other, thing, Direction.Top);
                        this.EightBitter.physics.setBottom(thing, other.top + other.tolTop);
                    }
                    break;

                case Direction.Left:
                    if (thing.top !== other.bottom - other.tolBottom && thing.bottom !== other.top + other.tolTop) {
                        this.setThingBordering(thing, other, Direction.Left);
                        this.setThingBordering(other, thing, Direction.Right);
                        this.EightBitter.physics.setLeft(thing, other.right - other.tolRight);
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
    public setThingBordering(thing: IThing, other: IThing, direction: Direction): void {
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
    public collideCollisionDetector(thing: IPlayer, other: IDetector): boolean {
        if (!thing.player) {
            return false;
        }

        if (other.active) {
            if (!other.requireOverlap || this.EightBitter.physics.isThingWithinOther(thing, other)) {
                if (
                    typeof other.requireDirection !== "undefined"
                    && !(thing.keys as any)[other.requireDirection]
                    && !thing.allowDirectionAsKeys
                    && thing.direction !== other.requireDirection
                ) {
                    return false;
                }

                if (other.singleUse) {
                    other.active = false;
                }
                other.activate.call(this.EightBitter.animations, thing, other);
            }

            return true;
        }

        // If the thing is moving towards the triggerer, it's now active
        if (thing.direction === this.EightBitter.physics.getDirectionBordering(thing, other)) {
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
    public collideCharacterDialog(thing: IPlayer, other: ICharacter): void {
        let dialog: MenuGraphr.IMenuDialogRaw | MenuGraphr.IMenuDialogRaw[] = other.dialog;
        let direction: Direction;

        if (other.cutscene) {
            this.EightBitter.ScenePlayer.startCutscene(other.cutscene, {
                thing: thing,
                triggerer: other
            });
        }

        if (!dialog) {
            return;
        }

        direction = this.EightBitter.physics.getDirectionBetween(other, thing);

        if (other.dialogDirections) {
            dialog = (dialog as MenuGraphr.IMenuDialogRaw[])[direction];
            if (!dialog) {
                return;
            }
        }

        thing.talking = true;
        other.talking = true;
        thing.canKeyWalking = false;

        if (!this.EightBitter.MenuGrapher.getActiveMenu()) {
            this.EightBitter.MenuGrapher.createMenu("GeneralText", {
                deleteOnFinish: !other.dialogOptions
            });
            this.EightBitter.MenuGrapher.setActiveMenu("GeneralText");
            this.EightBitter.MenuGrapher.addMenuDialog(
                "GeneralText",
                dialog,
                (): void => this.EightBitter.animations.animateCharacterDialogFinish(thing, other)
            );
        }

        if (other.switchDirectionOnDialog) {
            this.EightBitter.animations.animateCharacterSetDirection(other, direction);
        }
    }

    /**
     * Collision callback for a Player and a Pokeball it's interacting with.
     * 
     * @param thing   A Player interacting with other.
     * @param other   A Pokeball being interacted with by thing.
     */
    public collidePokeball(thing: IPlayer, other: IPokeball): void {
        switch (other.action) {
            case "item":
                this.EightBitter.MenuGrapher.createMenu("GeneralText");
                this.EightBitter.MenuGrapher.addMenuDialog(
                    "GeneralText",
                    [
                        "%%%%%%%PLAYER%%%%%%% found " + other.item + "!"
                    ],
                    (): void => {
                        this.EightBitter.MenuGrapher.deleteActiveMenu();
                        this.EightBitter.physics.killNormal(other);
                        this.EightBitter.StateHolder.addChange(
                            other.id, "alive", false
                        );
                    }
                );
                this.EightBitter.MenuGrapher.setActiveMenu("GeneralText");

                this.EightBitter.storage.addItemToBag(other.item, other.amount);
                break;

            case "cutscene":
                this.EightBitter.ScenePlayer.startCutscene(other.cutscene, {
                    player: thing,
                    triggerer: other
                });
                if (other.routine) {
                    this.EightBitter.ScenePlayer.playRoutine(other.routine);
                }
                break;

            case "pokedex":
                this.EightBitter.menus.openPokedexListing(other.pokemon);
                break;

            case "dialog":
                this.EightBitter.MenuGrapher.createMenu("GeneralText");
                this.EightBitter.MenuGrapher.addMenuDialog("GeneralText", other.dialog);
                this.EightBitter.MenuGrapher.setActiveMenu("GeneralText");
                break;

            case "yes/no":
                this.EightBitter.MenuGrapher.createMenu("Yes/No", {
                    killOnB: ["GeneralText"]
                });
                this.EightBitter.MenuGrapher.addMenuList("Yes/No", {
                    options: [
                        {
                            text: "YES",
                            callback: (): void => console.log("What do, yes?")
                        }, {
                            text: "NO",
                            callback: (): void => console.log("What do, no?")
                        }]
                });
                this.EightBitter.MenuGrapher.setActiveMenu("Yes/No");
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
    public collideCharacterGrass(thing: ICharacter, other: IGrass): boolean {
        if (thing.grass || !this.EightBitter.physics.isThingWithinGrass(thing, other)) {
            return true;
        }

        thing.grass = other;
        this.EightBitter.storage.addStateHistory(thing, "height", thing.height);

        // Todo: Find a better way than manually setting canvas height?
        thing.canvas.height = thing.heightGrass * this.EightBitter.unitsize;
        this.EightBitter.PixelDrawer.setThingSprite(thing);

        thing.shadow = this.EightBitter.ObjectMaker.make(thing.title, {
            nocollide: true,
            id: thing.id + " shadow"
        });

        if (thing.shadow.className !== thing.className) {
            this.EightBitter.graphics.setClass(thing.shadow, thing.className);
        }

        this.EightBitter.things.add(thing.shadow, thing.left, thing.top);

        // Todo: is the arrayToEnd call necessary?
        this.EightBitter.GroupHolder.switchMemberGroup(thing.shadow, thing.shadow.groupType, "Terrain");
        this.EightBitter.utilities.arrayToEnd(thing.shadow, this.EightBitter.GroupHolder.getGroup("Terrain") as IThing[]);

        return true;
    }

    /**
     * Collision callback for a Character and a Ledge. If possible, the Character
     * is animated to start hopping over the Ledge.
     * 
     * @param thing   A Character walking to other.
     * @param other   A Ledge walked to by thing.
     */
    public collideLedge(thing: ICharacter, other: IThing): boolean {
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
            (thing as IPlayer).canKeyWalking = false;
            this.EightBitter.MapScreener.blockInputs = true;
        }
        this.EightBitter.animations.animateCharacterHopLedge(thing, other);

        return true;
    }

    /**
     * Collision callback for a Character and a WaterEdge. If possible, the Character
     * is animated to move onto land.
     *
     * @param thing   A Character walking to other.
     * @param other   A Ledge walked to by thing.
     */
    public collideWaterEdge(thing: ICharacter, other: IThing): boolean {
        const edge: IWaterEdge = other as IWaterEdge;

        if (!thing.surfing || edge.exitDirection !== thing.direction) {
            return false;
        }

        this.EightBitter.animations.animateCharacterStartWalking(thing, thing.direction, [2]);
        thing.surfing = false;
        this.EightBitter.graphics.removeClass(thing, "surfing");
        return true;
    }
}
