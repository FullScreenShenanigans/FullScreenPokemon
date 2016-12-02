import { Component } from "eightbittr/lib/Component";

import { Direction, InputTimeTolerance } from "./Constants";
import { FullScreenPokemon } from "./FullScreenPokemon";
import { ICharacter, IItemSchema, IPlayer } from "./IFullScreenPokemon";

/**
 * Input functions used by IGameStartr instances.
 */
export class Inputs<TEightBittr extends FullScreenPokemon> extends Component<TEightBittr> {
    /**
     * Checks whether direction keys such as up may trigger, which is true if the
     * game isn't paused, the isn't an active menu, and the MapScreener doesn't
     * specify blockInputs = true.
     * 
     * @returns Whether direction keys may trigger.
     */
    public canDirectionsTrigger(): boolean {
        if (this.EightBitter.GamesRunner.getPaused()) {
            return false;
        }

        if (this.EightBitter.MenuGrapher.getActiveMenu()) {
            return true;
        }

        return !this.EightBitter.MapScreener.blockInputs;
    }

    /**
     * Reacts to a Character simulating an up key press. If possible, this causes
     * walking in the up direction. The onKeyDownUp mod trigger is fired.
     * 
     * @param thing   The triggering Character.
     * @param event   The original user-caused Event.
     */
    public keyDownUp(thing: ICharacter, event?: Event): void {
        if (!this.canDirectionsTrigger()) {
            return;
        }

        if (thing.player) {
            ((thing as IPlayer).keys as any)[Direction.Top] = true;

            this.EightBitter.TimeHandler.addEvent(
                (): void => this.keyDownDirectionReal(thing as IPlayer, 0),
                InputTimeTolerance);
        }

        this.EightBitter.ModAttacher.fireEvent("onKeyDownUpReal");

        if (event && event.preventDefault) {
            event.preventDefault();
        }
    }

    /**
     * Reacts to a Character simulating a right key press. If possible, this causes
     * walking in the right direction. The onKeyDownRight mod trigger is fired.
     * 
     * @param thing   The triggering Character.
     * @param event   The original user-caused Event.
     */
    public keyDownRight(thing: ICharacter, event?: Event): void {
        if (!this.canDirectionsTrigger()) {
            return;
        }

        if (thing.player) {
            ((thing as IPlayer).keys as any)[Direction.Right] = true;

            this.EightBitter.TimeHandler.addEvent(
                (): void => this.keyDownDirectionReal(thing as IPlayer, 1),
                InputTimeTolerance);
        }

        if (event && event.preventDefault) {
            event.preventDefault();
        }
    }

    /**
     * Reacts to a Character simulating a down key press. If possible, this causes
     * walking in the down direction. The onKeyDownDown mod trigger is fired.
     * 
     * @param thing   The triggering Character.
     * @param event   The original user-caused Event.
     */
    public keyDownDown(thing: ICharacter, event?: Event): void {
        if (!this.canDirectionsTrigger()) {
            return;
        }

        if (thing.player) {
            ((thing as IPlayer).keys as any)[Direction.Bottom] = true;
        }

        this.EightBitter.TimeHandler.addEvent(
            (): void => this.keyDownDirectionReal(thing as IPlayer, 2),
            2);

        this.EightBitter.ModAttacher.fireEvent("onKeyDownDown");

        if (event && event.preventDefault) {
            event.preventDefault();
        }
    }

    /**
     * Reacts to a Character simulating a left key press. If possible, this causes
     * walking in the left direction. The onKeyDownLeft mod trigger is fired.
     * 
     * @param thing   The triggering Character.
     * @param event   The original user-caused Event.
     */
    public keyDownLeft(thing: ICharacter, event?: Event): void {
        if (!this.canDirectionsTrigger()) {
            return;
        }

        if (thing.player) {
            ((thing as IPlayer).keys as any)[Direction.Left] = true;

            this.EightBitter.TimeHandler.addEvent(
                (): void => this.keyDownDirectionReal(thing as IPlayer, 3),
                3);
        }

        this.EightBitter.ModAttacher.fireEvent("onKeyDownLeft");

        if (event && event.preventDefault) {
            event.preventDefault();
        }
    }

    /**
     * Driver for a direction key being pressed. The MenuGraphr's active menu reacts
     * to the movement if it exists, or the triggering Character attempts to walk
     * if not. The onKeyDownDirectionReal mod event is fired.
     * 
     * @param thing   The triggering Character.
     * @param event   The original user-caused Event.
     */
    public keyDownDirectionReal(thing: IPlayer, direction: Direction): void {
        if (!thing.player || !((thing as IPlayer).keys as any)[direction]) {
            return;
        }

        if (this.EightBitter.MenuGrapher.getActiveMenu()) {
            this.EightBitter.MenuGrapher.registerDirection(direction as number);
        } else {
            if (thing.direction !== direction) {
                thing.turning = direction;
            }

            if (thing.canKeyWalking && !thing.shouldWalk) {
                this.EightBitter.physics.setPlayerDirection(thing, direction);
                thing.canKeyWalking = false;
            } else {
                thing.nextDirection = direction;
            }
        }

        this.EightBitter.ModAttacher.fireEvent("onKeyDownDirectionReal", direction);
    }

    /**
     * Reacts to the A key being pressed. The MenuGraphr's active menu reacts to
     * the selection if it exists. The onKeyDownA mod event is fired.
     * 
     * @param thing   The triggering Character.
     * @param event   The original user-caused Event.
     */
    public keyDownA(thing: ICharacter, event?: Event): void {
        if (this.EightBitter.GamesRunner.getPaused()) {
            return;
        }

        if (this.EightBitter.MenuGrapher.getActiveMenu()) {
            this.EightBitter.MenuGrapher.registerA();
        } else if (thing.bordering[thing.direction]) {
            if (thing.bordering[thing.direction]!.activate) {
                thing.bordering[thing.direction]!.activate!(
                    thing,
                    thing.bordering[thing.direction]);
            }

            if ((thing as IPlayer).keys) {
                (thing as IPlayer).keys.a = true;
            }
        }

        this.EightBitter.ModAttacher.fireEvent("onKeyDownA");

        if (event && event.preventDefault) {
            event.preventDefault();
        }
    }

    /**
     * Reacts to the B key being pressed. The MenuGraphr's active menu reacts to
     * the deselection if it exists. The onKeyDownB mod event is fired.
     * 
     * @param thing   The triggering Character.
     * @param event   The original user-caused Event.
     */
    public keyDownB(thing: ICharacter, event?: Event): void {
        if (this.EightBitter.GamesRunner.getPaused()) {
            return;
        }

        if (this.EightBitter.MenuGrapher.getActiveMenu()) {
            this.EightBitter.MenuGrapher.registerB();
        } else if ((thing as IPlayer).keys) {
            (thing as IPlayer).keys.b = true;
        }

        this.EightBitter.ModAttacher.fireEvent("onKeyDownB");

        if (event && event.preventDefault) {
            event.preventDefault();
        }
    }

    /**
     * Reacts to the pause key being pressed. The game is paused if it isn't 
     * already. The onKeyDownPause mod event is fired.
     * 
     * @param _thing   The triggering Character.
     * @param event   The original user-caused Event.
     */
    public keyDownPause(_thing: ICharacter, event?: Event): void {
        this.EightBitter.menus.togglePauseMenu();
        this.EightBitter.ModAttacher.fireEvent("onKeyDownPause");

        if (event && event.preventDefault) {
            event.preventDefault();
        }
    }

    /**
     * Reacts to the mute key being pressed. The game has mute toggled, and the
     * onKeyDownMute mod event is fired.
     * 
     * @param _thing   The triggering Character.
     * @param event   The original user-caused Event.
     */
    public keyDownMute(_thing: ICharacter, event?: Event): void {
        this.EightBitter.AudioPlayer.toggleMuted();
        this.EightBitter.ModAttacher.fireEvent("onKeyDownMute");

        if (event && event.preventDefault) {
            event.preventDefault();
        }
    }

    /**
     * Reacts to the select key being pressed. Toggles the use of the registered item.
     * 
     * @param thing   The triggering Player.
     * @param event   The original user-caused Event.
     * @todo Extend the use for any registered item, not just the bicycle.
     */
    public keyDownSelect(thing: IPlayer, event?: Event): void {
        if (this.EightBitter.MenuGrapher.getActiveMenu() || thing.walking) {
            return;
        }

        this.EightBitter.ModAttacher.fireEvent("onKeyDownSelect");

        const selectItem: string = this.EightBitter.ItemsHolder.getItem("SelectItem");
        if (!selectItem) {
            return;
        }

        const itemSchema: IItemSchema = this.EightBitter.MathDecider.getConstant("items")[selectItem];

        if (!itemSchema.bagActivate) {
            throw new Error("Currently selected item does not have a .bagActivate.");
        }

        if (!itemSchema.bagActivate.call(this, thing, itemSchema)) {
            this.EightBitter.menus.displayMessage(thing, itemSchema.error || "");
        }

        if (event && event.preventDefault) {
            event.preventDefault();
        }
    }

    /**
     * Reacts to the left key being lifted. The onKeyUpLeft mod event is fired.
     * 
     * @param thing   The triggering Character.
     * @param event   The original user-caused Event.
     */
    public keyUpLeft(thing: ICharacter, event?: Event): void {
        this.EightBitter.ModAttacher.fireEvent("onKeyUpLeft");

        if (thing.player) {
            (thing as IPlayer).keys[3] = false;

            if ((thing as IPlayer).nextDirection === 3) {
                delete (thing as IPlayer).nextDirection;
            }
        }

        if (event && event.preventDefault) {
            event.preventDefault();
        }
    }

    /**
     * Reacts to the right key being lifted. The onKeyUpRight mod event is fired.
     * 
     * @param thing   The triggering Character.
     * @param event   The original user-caused Event.
     */
    public keyUpRight(thing: ICharacter, event?: Event): void {
        this.EightBitter.ModAttacher.fireEvent("onKeyUpRight");

        if (thing.player) {
            (thing as IPlayer).keys[1] = false;

            if ((thing as IPlayer).nextDirection === 1) {
                delete (thing as IPlayer).nextDirection;
            }
        }

        if (event && event.preventDefault) {
            event.preventDefault();
        }
    }

    /**
     * Reacts to the up key being lifted. The onKeyUpUp mod event is fired.
     * 
     * @param thing   The triggering Character.
     * @param event   The original user-caused Event.
     */
    public keyUpUp(thing: ICharacter, event?: Event): void {
        this.EightBitter.ModAttacher.fireEvent("onKeyUpUp");

        if (thing.player) {
            (thing as IPlayer).keys[0] = false;

            if ((thing as IPlayer).nextDirection === 0) {
                delete (thing as IPlayer).nextDirection;
            }
        }

        if (event && event.preventDefault) {
            event.preventDefault();
        }
    }

    /**
     * Reacts to the down key being lifted. The onKeyUpDown mod event is fired.
     * 
     * @param thing   The triggering Character.
     * @param event   The original user-caused Event.
     */
    public keyUpDown(thing: ICharacter, event?: Event): void {
        this.EightBitter.ModAttacher.fireEvent("onKeyUpDown");

        if (thing.player) {
            (thing as IPlayer).keys[2] = false;

            if ((thing as IPlayer).nextDirection === 2) {
                delete (thing as IPlayer).nextDirection;
            }
        }

        if (event && event.preventDefault) {
            event.preventDefault();
        }
    }

    /**
     * Reacts to the A key being lifted. The onKeyUpA mod event is fired.
     * 
     * @param thing   The triggering Character.
     * @param event   The original user-caused Event.
     */
    public keyUpA(thing: ICharacter, event?: Event): void {
        this.EightBitter.ModAttacher.fireEvent("onKeyUpA");

        if (thing.player) {
            (thing as IPlayer).keys.a = false;
        }

        if (event && event.preventDefault) {
            event.preventDefault();
        }
    }

    /**
     * Reacts to the B key being lifted. The onKeyUpB mod event is fired.
     * 
     * @param thing   The triggering Character.
     * @param event   The original user-caused Event.
     */
    public keyUpB(thing: ICharacter, event?: Event): void {
        this.EightBitter.ModAttacher.fireEvent("onKeyUpB");

        if (thing.player) {
            (thing as IPlayer).keys.b = false;
        }

        if (event && event.preventDefault) {
            event.preventDefault();
        }
    }

    /**
     * Reacts to the pause key being lifted. The onKeyUpPause mod event is fired.
     * 
     * @param _thing   The triggering Character.
     * @param event   The original user-caused Event.
     */
    public keyUpPause(_thing: ICharacter, event?: Event): void {
        this.EightBitter.ModAttacher.fireEvent("onKeyUpPause");

        if (event && event.preventDefault) {
            event.preventDefault();
        }
    }

    /**
     * Reacts to the context menu being activated. The pause menu is opened,
     * and the onMouseDownRight mod event is fired.
     * 
     * @param _thing   The triggering Character.
     * @param event   The original user-caused Event.
     */
    public mouseDownRight(_thing: ICharacter, event?: Event): void {
        this.EightBitter.menus.togglePauseMenu();
        this.EightBitter.ModAttacher.fireEvent("onMouseDownRight");

        if (event && event.preventDefault) {
            event.preventDefault();
        }
    }
}
