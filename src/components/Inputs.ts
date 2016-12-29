import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../FullScreenPokemon";
import { Direction } from "./Constants";
import { IItemSchema } from "./constants/Items";
import { ICharacter, IPlayer } from "./Things";

/**
 * Input functions used by FullScreenPokemon instances.
 */
export class Inputs<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
    /**
     * Quickly tapping direction keys means to look in a direction, not walk.
     */
    public readonly inputTimeTolerance: number = 4;

    /**
     * Checks whether direction keys such as up may trigger for a Character.
     * 
     * @param thing   A Character that wants to move.
     * @returns Whether direction keys may trigger.
     */
    public canDirectionsTrigger(thing: ICharacter): boolean {
        if (thing.following || thing.ledge) {
            return false;
        }

        if (this.gameStarter.gamesRunner.getPaused()) {
            return false;
        }

        if (this.gameStarter.menuGrapher.getActiveMenu()) {
            return true;
        }

        return !this.gameStarter.mapScreener.blockInputs;
    }

    /**
     * Reacts to a Character simulating an up key press. If possible, this causes
     * walking in the up direction. The onKeyDownUp mod trigger is fired.
     * 
     * @param thing   The triggering Character.
     * @param event   The original user-caused Event.
     */
    public keyDownUp(thing: ICharacter, event?: Event): void {
        if (!this.canDirectionsTrigger(thing)) {
            return;
        }

        if (thing.player) {
            (thing as IPlayer).keys[Direction.Top] = true;
        }

        this.gameStarter.timeHandler.addEvent(
            (): void => this.keyDownDirectionReal(thing as IPlayer, Direction.Top),
            this.inputTimeTolerance);

        this.gameStarter.modAttacher.fireEvent("onKeyDownUpReal");

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
        if (!this.canDirectionsTrigger(thing)) {
            return;
        }

        if (thing.player) {
            (thing as IPlayer).keys[Direction.Right] = true;
        }

        this.gameStarter.timeHandler.addEvent(
            (): void => this.keyDownDirectionReal(thing as IPlayer, Direction.Right),
            this.inputTimeTolerance);

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
        if (!this.canDirectionsTrigger(thing)) {
            return;
        }

        if (thing.player) {
            (thing as IPlayer).keys[Direction.Bottom] = true;
        }

        this.gameStarter.timeHandler.addEvent(
            (): void => this.keyDownDirectionReal(thing as IPlayer, Direction.Bottom),
            this.inputTimeTolerance);

        this.gameStarter.modAttacher.fireEvent("onKeyDownDown");

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
        if (!this.canDirectionsTrigger(thing)) {
            return;
        }

        if (thing.player) {
            (thing as IPlayer).keys[Direction.Left] = true;
        }

        this.gameStarter.timeHandler.addEvent(
            (): void => this.keyDownDirectionReal(thing as IPlayer, Direction.Left),
            this.inputTimeTolerance);

        this.gameStarter.modAttacher.fireEvent("onKeyDownLeft");

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
    protected keyDownDirectionReal(thing: IPlayer, direction: Direction): void {
        if (!(thing.keys as any)[direction]) {
            return;
        }

        if (this.gameStarter.menuGrapher.getActiveMenu()) {
            this.gameStarter.menuGrapher.registerDirection(direction);
            return;
        }

        thing.nextDirection = direction;
        thing.wantsToWalk = true;

        if (!thing.walking) {
            this.gameStarter.actions.animateCharacterSetDirection(thing, direction);
        }

        this.gameStarter.modAttacher.fireEvent("onKeyDownDirectionReal", direction);
    }

    /**
     * Reacts to the A key being pressed. The MenuGraphr's active menu reacts to
     * the selection if it exists. The onKeyDownA mod event is fired.
     * 
     * @param thing   The triggering Character.
     * @param event   The original user-caused Event.
     */
    public keyDownA(thing: ICharacter, event?: Event): void {
        if (this.gameStarter.gamesRunner.getPaused()) {
            return;
        }

        if (this.gameStarter.menuGrapher.getActiveMenu()) {
            this.gameStarter.menuGrapher.registerA();
        } else if (thing.bordering[thing.direction]) {
            if (thing.bordering[thing.direction]!.activate) {
                thing.bordering[thing.direction]!.activate!.call(
                    this,
                    thing,
                    thing.bordering[thing.direction]);
            }

            if ((thing as IPlayer).keys) {
                (thing as IPlayer).keys.a = true;
            }
        }

        this.gameStarter.modAttacher.fireEvent("onKeyDownA");

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
        if (this.gameStarter.gamesRunner.getPaused()) {
            return;
        }

        if (this.gameStarter.menuGrapher.getActiveMenu()) {
            this.gameStarter.menuGrapher.registerB();
        } else if ((thing as IPlayer).keys) {
            (thing as IPlayer).keys.b = true;
        }

        this.gameStarter.modAttacher.fireEvent("onKeyDownB");

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
        this.gameStarter.menus.togglePauseMenu();
        this.gameStarter.modAttacher.fireEvent("onKeyDownPause");

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
        this.gameStarter.audioPlayer.toggleMuted();
        this.gameStarter.modAttacher.fireEvent("onKeyDownMute");

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
        if (this.gameStarter.menuGrapher.getActiveMenu() || thing.walking) {
            return;
        }

        this.gameStarter.modAttacher.fireEvent("onKeyDownSelect");

        const selectItem: string = this.gameStarter.itemsHolder.getItem("SelectItem");
        if (!selectItem) {
            return;
        }

        const itemSchema: IItemSchema = this.gameStarter.constants.items.byName[selectItem];
        if (!itemSchema.bagActivate) {
            throw new Error("Currently selected item does not have a .bagActivate.");
        }

        if (!itemSchema.bagActivate.call(this, thing, itemSchema)) {
            this.gameStarter.menus.displayMessage(itemSchema.error || "");
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
        this.gameStarter.modAttacher.fireEvent("onKeyUpLeft");

        if (thing.player) {
            (thing as IPlayer).keys[Direction.Left] = false;
        }

        if (thing.nextDirection === Direction.Left) {
            thing.nextDirection = undefined;
            thing.wantsToWalk = false;
        } else if (thing.nextDirection === undefined) {
            thing.wantsToWalk = false;
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
        this.gameStarter.modAttacher.fireEvent("onKeyUpRight");

        if (thing.player) {
            (thing as IPlayer).keys[Direction.Right] = false;
        }

        if (thing.nextDirection === Direction.Right) {
            thing.nextDirection = undefined;
            thing.wantsToWalk = false;
        } else if (thing.nextDirection === undefined) {
            thing.wantsToWalk = false;
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
        this.gameStarter.modAttacher.fireEvent("onKeyUpUp");

        if (thing.player) {
            (thing as IPlayer).keys[0] = false;
        }

        if (thing.nextDirection === Direction.Top) {
            thing.nextDirection = undefined;
            thing.wantsToWalk = false;
        } else if (thing.nextDirection === undefined) {
            thing.wantsToWalk = false;
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
        this.gameStarter.modAttacher.fireEvent("onKeyUpDown");

        if (thing.player) {
            (thing as IPlayer).keys[2] = false;
        }

        if (thing.nextDirection === Direction.Bottom) {
            thing.nextDirection = undefined;
            thing.wantsToWalk = false;
        } else if (thing.nextDirection === undefined) {
            thing.wantsToWalk = false;
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
        this.gameStarter.modAttacher.fireEvent("onKeyUpA");

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
        this.gameStarter.modAttacher.fireEvent("onKeyUpB");

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
        this.gameStarter.modAttacher.fireEvent("onKeyUpPause");

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
        this.gameStarter.menus.togglePauseMenu();
        this.gameStarter.modAttacher.fireEvent("onMouseDownRight");

        if (event && event.preventDefault) {
            event.preventDefault();
        }
    }
}
