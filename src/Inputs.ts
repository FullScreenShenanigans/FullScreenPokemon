/// <reference path="../typings/EightBittr.d.ts" />

import { Direction } from "./Constants";
import { FullScreenPokemon } from "./FullScreenPokemon";
import { ICharacter, IItemSchema, IPlayer } from "./IFullScreenPokemon";

/**
 * Input functions used by IGameStartr instances.
 */
export class Inputs<TEightBittr extends FullScreenPokemon> extends EightBittr.Component<TEightBittr> {
    /**
     * Checks whether direction keys such as up may trigger, which is true if the
     * game isn't paused, the isn't an active menu, and the MapScreener doesn't
     * specify blockInputs = true.
     * 
     * @returns Whether direction keys may trigger.
     */
    canDirectionsTrigger(): boolean {
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
    keyDownUp(thing: ICharacter, event?: Event): void {
        if (!thing.FSP.canDirectionsTrigger()) {
            return;
        }

        if (thing.player) {
            (thing as IPlayer).keys[Direction.Top] = true;
        }

        thing.FSP.TimeHandler.addEvent(
            thing.FSP.keyDownDirectionReal,
            FullScreenPokemon.inputTimeTolerance,
            thing,
            0);

        thing.FSP.ModAttacher.fireEvent("onKeyDownUpReal");

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
    keyDownRight(thing: ICharacter, event?: Event): void {
        if (!thing.FSP.canDirectionsTrigger()) {
            return;
        }

        if (thing.player) {
            (<IPlayer>thing).keys[Direction.Right] = true;
        }

        thing.FSP.TimeHandler.addEvent(
            thing.FSP.keyDownDirectionReal,
            FullScreenPokemon.inputTimeTolerance,
            thing,
            1);

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
    keyDownDown(thing: ICharacter, event?: Event): void {
        if (!thing.FSP.canDirectionsTrigger()) {
            return;
        }

        if (thing.player) {
            (<IPlayer>thing).keys[Direction.Bottom] = true;
        }

        thing.FSP.TimeHandler.addEvent(
            thing.FSP.keyDownDirectionReal,
            FullScreenPokemon.inputTimeTolerance,
            thing,
            2);

        thing.FSP.ModAttacher.fireEvent("onKeyDownDown");

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
    keyDownLeft(thing: ICharacter, event?: Event): void {
        if (!thing.FSP.canDirectionsTrigger()) {
            return;
        }

        if (thing.player) {
            (<IPlayer>thing).keys[Direction.Left] = true;
        }

        thing.FSP.TimeHandler.addEvent(
            thing.FSP.keyDownDirectionReal,
            FullScreenPokemon.inputTimeTolerance,
            thing,
            3);

        thing.FSP.ModAttacher.fireEvent("onKeyDownLeft");

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
    keyDownDirectionReal(thing: IPlayer, direction: Direction): void {
        if (!thing.player || !(<IPlayer>thing).keys[direction]) {
            return;
        }

        if (thing.FSP.MenuGrapher.getActiveMenu()) {
            thing.FSP.MenuGrapher.registerDirection(<number>direction);
        } else {
            if (thing.direction !== direction) {
                thing.turning = direction;
            }

            if (thing.canKeyWalking && !thing.shouldWalk) {
                thing.FSP.setPlayerDirection(thing, direction);
                thing.canKeyWalking = false;
            } else {
                thing.nextDirection = direction;
            }
        }

        thing.FSP.ModAttacher.fireEvent("onKeyDownDirectionReal", direction);
    }

    /**
     * Reacts to the A key being pressed. The MenuGraphr's active menu reacts to
     * the selection if it exists. The onKeyDownA mod event is fired.
     * 
     * @param thing   The triggering Character.
     * @param event   The original user-caused Event.
     */
    keyDownA(thing: ICharacter, event?: Event): void {
        if (thing.FSP.GamesRunner.getPaused()) {
            return;
        }

        if (thing.FSP.MenuGrapher.getActiveMenu()) {
            thing.FSP.MenuGrapher.registerA();
        } else if (thing.bordering[thing.direction]) {
            if (thing.bordering[thing.direction].activate) {
                thing.bordering[thing.direction].activate(
                    thing,
                    thing.bordering[thing.direction]);
            }

            if ((<IPlayer>thing).keys) {
                (<IPlayer>thing).keys.a = true;
            }
        }

        thing.FSP.ModAttacher.fireEvent("onKeyDownA");

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
    keyDownB(thing: ICharacter, event?: Event): void {
        if (thing.FSP.GamesRunner.getPaused()) {
            return;
        }

        if (thing.FSP.MenuGrapher.getActiveMenu()) {
            thing.FSP.MenuGrapher.registerB();
        } else if ((<IPlayer>thing).keys) {
            (<IPlayer>thing).keys.b = true;
        }

        thing.FSP.ModAttacher.fireEvent("onKeyDownB");

        if (event && event.preventDefault) {
            event.preventDefault();
        }
    }

    /**
     * Reacts to the pause key being pressed. The game is paused if it isn't 
     * already. The onKeyDownPause mod event is fired.
     * 
     * @param thing   The triggering Character.
     * @param event   The original user-caused Event.
     */
    keyDownPause(thing: ICharacter, event?: Event): void {
        if (!thing.FSP.GamesRunner.getPaused()) {
            thing.FSP.GamesRunner.pause();
        }

        thing.FSP.ModAttacher.fireEvent("onKeyDownPause");

        if (event && event.preventDefault) {
            event.preventDefault();
        }
    }

    /**
     * Reacts to the mute key being pressed. The game has mute toggled, and the
     * onKeyDownMute mod event is fired.
     * 
     * @param thing   The triggering Character.
     * @param event   The original user-caused Event.
     */
    keyDownMute(thing: ICharacter, event?: Event): void {
        thing.FSP.AudioPlayer.toggleMuted();
        thing.FSP.ModAttacher.fireEvent("onKeyDownMute");

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
    keyDownSelect(thing: IPlayer, event?: Event): void {
        if (thing.FSP.MenuGrapher.getActiveMenu() || thing.walking) {
            return;
        }

        thing.FSP.ModAttacher.fireEvent("onKeyDownSelect");

        let selectItem: string = thing.FSP.ItemsHolder.getItem("SelectItem");
        if (!selectItem) {
            return;
        }

        let itemSchema: IItemSchema = thing.FSP.MathDecider.getConstant("items")[selectItem];

        if (!itemSchema.bagActivate(thing, itemSchema)) {
            thing.FSP.displayMessage(thing, itemSchema.error);
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
    keyUpLeft(thing: ICharacter, event?: Event): void {
        thing.FSP.ModAttacher.fireEvent("onKeyUpLeft");

        if (thing.player) {
            (<IPlayer>thing).keys[3] = false;

            if ((<IPlayer>thing).nextDirection === 3) {
                delete (<IPlayer>thing).nextDirection;
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
    keyUpRight(thing: ICharacter, event?: Event): void {
        thing.FSP.ModAttacher.fireEvent("onKeyUpRight");

        if (thing.player) {
            (<IPlayer>thing).keys[1] = false;

            if ((<IPlayer>thing).nextDirection === 1) {
                delete (<IPlayer>thing).nextDirection;
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
    keyUpUp(thing: ICharacter, event?: Event): void {
        thing.FSP.ModAttacher.fireEvent("onKeyUpUp");

        if (thing.player) {
            (<IPlayer>thing).keys[0] = false;

            if ((<IPlayer>thing).nextDirection === 0) {
                delete (<IPlayer>thing).nextDirection;
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
    keyUpDown(thing: ICharacter, event?: Event): void {
        thing.FSP.ModAttacher.fireEvent("onKeyUpDown");

        if (thing.player) {
            (<IPlayer>thing).keys[2] = false;

            if ((<IPlayer>thing).nextDirection === 2) {
                delete (<IPlayer>thing).nextDirection;
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
    keyUpA(thing: ICharacter, event?: Event): void {
        thing.FSP.ModAttacher.fireEvent("onKeyUpA");

        if (thing.player) {
            (<IPlayer>thing).keys.a = false;
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
    keyUpB(thing: ICharacter, event?: Event): void {
        thing.FSP.ModAttacher.fireEvent("onKeyUpB");

        if (thing.player) {
            (<IPlayer>thing).keys.b = false;
        }

        if (event && event.preventDefault) {
            event.preventDefault();
        }
    }

    /**
     * Reacts to the pause key being lifted. The onKeyUpLeft mod event is fired.
     * 
     * @param thing   The triggering Character.
     * @param event   The original user-caused Event.
     */
    keyUpPause(thing: ICharacter, event?: Event): void {
        if (thing.FSP.GamesRunner.getPaused()) {
            thing.FSP.GamesRunner.play();
        }
        thing.FSP.ModAttacher.fireEvent("onKeyUpPause");

        if (event && event.preventDefault) {
            event.preventDefault();
        }
    }

    /**
     * Reacts to the context menu being activated. The pause menu is opened,
     * and the onMouseDownRight mod event is fired.
     * 
     * @param thing   The triggering Character.
     * @param event   The original user-caused Event.
     */
    mouseDownRight(thing: ICharacter, event?: Event): void {
        thing.FSP.togglePauseMenu(thing);

        thing.FSP.ModAttacher.fireEvent("onMouseDownRight");

        if (event && event.preventDefault) {
            event.preventDefault();
        }
    }
}
