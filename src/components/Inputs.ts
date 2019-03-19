import { GeneralComponent } from "eightbittr";

import { FullScreenPokemon } from "../FullScreenPokemon";

import { Direction } from "./Constants";
import { IItemSchema } from "./constants/Items";
import { ICharacter, IPlayer } from "./Things";

/**
 * Routes user input.
 */
export class Inputs<TEightBittr extends FullScreenPokemon> extends GeneralComponent<TEightBittr> {
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

        if (this.eightBitter.gamesRunner.getPaused()) {
            return false;
        }

        if (this.eightBitter.menuGrapher.getActiveMenu()) {
            return true;
        }

        return !this.eightBitter.mapScreener.blockInputs;
    }

    /**
     * Reacts to a Character simulating an up key press. If possible, this causes
     * walking in the up direction. The onKeyDownUp mod trigger is fired.
     *
     * @param thing   The triggering Character.
     * @param event   The original user-caused Event.
     */
    public keyDownUp(thing: ICharacter, event?: Event): void {
        this.preventEventDefault(event);
        if (!this.canDirectionsTrigger(thing)) {
            return;
        }

        if (thing.player) {
            (thing as IPlayer).keys[Direction.Top] = true;
        }

        this.eightBitter.timeHandler.addEvent(
            (): void => this.keyDownDirectionReal(thing as IPlayer, Direction.Top),
            this.inputTimeTolerance);

        this.eightBitter.modAttacher.fireEvent(this.eightBitter.mods.eventNames.onKeyDownUp);
    }

    /**
     * Reacts to a Character simulating a right key press. If possible, this causes
     * walking in the right direction. The onKeyDownRight mod trigger is fired.
     *
     * @param thing   The triggering Character.
     * @param event   The original user-caused Event.
     */
    public keyDownRight(thing: ICharacter, event?: Event): void {
        this.preventEventDefault(event);
        if (!this.canDirectionsTrigger(thing)) {
            return;
        }

        if (thing.player) {
            (thing as IPlayer).keys[Direction.Right] = true;
        }

        this.eightBitter.timeHandler.addEvent(
            (): void => this.keyDownDirectionReal(thing as IPlayer, Direction.Right),
            this.inputTimeTolerance);
    }

    /**
     * Reacts to a Character simulating a down key press. If possible, this causes
     * walking in the down direction. The onKeyDownDown mod trigger is fired.
     *
     * @param thing   The triggering Character.
     * @param event   The original user-caused Event.
     */
    public keyDownDown(thing: ICharacter, event?: Event): void {
        this.preventEventDefault(event);
        if (!this.canDirectionsTrigger(thing)) {
            return;
        }

        if (thing.player) {
            (thing as IPlayer).keys[Direction.Bottom] = true;
        }

        this.eightBitter.timeHandler.addEvent(
            (): void => this.keyDownDirectionReal(thing as IPlayer, Direction.Bottom),
            this.inputTimeTolerance);

        this.eightBitter.modAttacher.fireEvent(this.eightBitter.mods.eventNames.onKeyDownDown);
    }

    /**
     * Reacts to a Character simulating a left key press. If possible, this causes
     * walking in the left direction. The onKeyDownLeft mod trigger is fired.
     *
     * @param thing   The triggering Character.
     * @param event   The original user-caused Event.
     */
    public keyDownLeft(thing: ICharacter, event?: Event): void {
        this.preventEventDefault(event);
        if (!this.canDirectionsTrigger(thing)) {
            return;
        }

        if (thing.player) {
            (thing as IPlayer).keys[Direction.Left] = true;
        }

        this.eightBitter.timeHandler.addEvent(
            (): void => this.keyDownDirectionReal(thing as IPlayer, Direction.Left),
            this.inputTimeTolerance);

        this.eightBitter.modAttacher.fireEvent(this.eightBitter.mods.eventNames.onKeyDownLeft);
    }

    /**
     * Reacts to the A key being pressed. The MenuGraphr's active menu reacts to
     * the selection if it exists. The onKeyDownA mod event is fired.
     *
     * @param thing   The triggering Character.
     * @param event   The original user-caused Event.
     */
    public keyDownA(thing: ICharacter, event?: Event): void {
        this.preventEventDefault(event);
        if (this.eightBitter.gamesRunner.getPaused()) {
            return;
        }

        if (this.eightBitter.menuGrapher.getActiveMenu()) {
            this.eightBitter.menuGrapher.registerA();
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

        this.eightBitter.modAttacher.fireEvent(this.eightBitter.mods.eventNames.onKeyDownA);
    }

    /**
     * Reacts to the B key being pressed. The MenuGraphr's active menu reacts to
     * the deselection if it exists. The onKeyDownB mod event is fired.
     *
     * @param thing   The triggering Character.
     * @param event   The original user-caused Event.
     */
    public keyDownB(thing: ICharacter, event?: Event): void {
        this.preventEventDefault(event);
        if (this.eightBitter.gamesRunner.getPaused()) {
            return;
        }

        if (this.eightBitter.menuGrapher.getActiveMenu()) {
            this.eightBitter.menuGrapher.registerB();
        } else if ((thing as IPlayer).keys) {
            (thing as IPlayer).keys.b = true;
        }

        this.eightBitter.modAttacher.fireEvent(this.eightBitter.mods.eventNames.onKeyDownB);
    }

    /**
     * Reacts to the pause key being pressed. The game is paused if it isn't
     * already. The onKeyDownPause mod event is fired.
     *
     * @param _thing   The triggering Character.
     * @param event   The original user-caused Event.
     */
    public keyDownPause(_thing: ICharacter, event?: Event): void {
        this.preventEventDefault(event);
        this.eightBitter.menus.pause.toggle();
        this.eightBitter.modAttacher.fireEvent(this.eightBitter.mods.eventNames.onKeyDownPause);
    }

    /**
     * Reacts to the mute key being pressed. The game has mute toggled, and the
     * onKeyDownMute mod event is fired.
     *
     * @param _thing   The triggering Character.
     * @param event   The original user-caused Event.
     */
    public async keyDownMute(_thing: ICharacter, event?: Event): Promise<void> {
        this.preventEventDefault(event);
        await this.eightBitter.audioPlayer.setMuted(this.eightBitter.audioPlayer.getMuted());
        this.eightBitter.modAttacher.fireEvent(this.eightBitter.mods.eventNames.onKeyDownMute);
    }

    /**
     * Reacts to the select key being pressed. Toggles the use of the registered item.
     *
     * @param thing   The triggering Player.
     * @param event   The original user-caused Event.
     * @todo Extend the use for any registered item, not just the bicycle.
     */
    public keyDownSelect(thing: IPlayer, event?: Event): void {
        this.preventEventDefault(event);
        if (this.eightBitter.menuGrapher.getActiveMenu() || thing.walking) {
            return;
        }

        this.eightBitter.modAttacher.fireEvent(this.eightBitter.mods.eventNames.onKeyDownSelect);

        const selectItem = this.eightBitter.itemsHolder.getItem(this.eightBitter.storage.names.selectItem);
        if (!selectItem) {
            return;
        }

        const itemSchema: IItemSchema = this.eightBitter.constants.items.byName[selectItem.join("")];
        if (!itemSchema.bagActivate) {
            throw new Error("Currently selected item does not have a .bagActivate.");
        }

        itemSchema.bagActivate.call(this, thing, itemSchema);
    }

    /**
     * Reacts to the left key being lifted. The onKeyUpLeft mod event is fired.
     *
     * @param thing   The triggering Character.
     * @param event   The original user-caused Event.
     */
    public keyUpLeft(thing: ICharacter, event?: Event): void {
        this.preventEventDefault(event);
        this.eightBitter.modAttacher.fireEvent(this.eightBitter.mods.eventNames.onKeyUpLeft);

        if (thing.player) {
            (thing as IPlayer).keys[Direction.Left] = false;
        }

        if (thing.nextDirection === Direction.Left) {
            thing.nextDirection = undefined;
            thing.wantsToWalk = false;
        } else if (thing.nextDirection === undefined) {
            thing.wantsToWalk = false;
        }
    }

    /**
     * Reacts to the right key being lifted. The onKeyUpRight mod event is fired.
     *
     * @param thing   The triggering Character.
     * @param event   The original user-caused Event.
     */
    public keyUpRight(thing: ICharacter, event?: Event): void {
        this.preventEventDefault(event);
        this.eightBitter.modAttacher.fireEvent(this.eightBitter.mods.eventNames.onKeyUpRight);

        if (thing.player) {
            (thing as IPlayer).keys[Direction.Right] = false;
        }

        if (thing.nextDirection === Direction.Right) {
            thing.nextDirection = undefined;
            thing.wantsToWalk = false;
        } else if (thing.nextDirection === undefined) {
            thing.wantsToWalk = false;
        }
    }

    /**
     * Reacts to the up key being lifted. The onKeyUpUp mod event is fired.
     *
     * @param thing   The triggering Character.
     * @param event   The original user-caused Event.
     */
    public keyUpUp(thing: ICharacter, event?: Event): void {
        this.preventEventDefault(event);
        this.eightBitter.modAttacher.fireEvent(this.eightBitter.mods.eventNames.onKeyUpUp);

        if (thing.player) {
            (thing as IPlayer).keys[0] = false;
        }

        if (thing.nextDirection === Direction.Top) {
            thing.nextDirection = undefined;
            thing.wantsToWalk = false;
        } else if (thing.nextDirection === undefined) {
            thing.wantsToWalk = false;
        }
    }

    /**
     * Reacts to the down key being lifted. The onKeyUpDown mod event is fired.
     *
     * @param thing   The triggering Character.
     * @param event   The original user-caused Event.
     */
    public keyUpDown(thing: ICharacter, event?: Event): void {
        this.preventEventDefault(event);
        this.eightBitter.modAttacher.fireEvent(this.eightBitter.mods.eventNames.onKeyUpDown);

        if (thing.player) {
            (thing as IPlayer).keys[2] = false;
        }

        if (thing.nextDirection === Direction.Bottom) {
            thing.nextDirection = undefined;
            thing.wantsToWalk = false;
        } else if (thing.nextDirection === undefined) {
            thing.wantsToWalk = false;
        }
    }

    /**
     * Reacts to the A key being lifted. The onKeyUpA mod event is fired.
     *
     * @param thing   The triggering Character.
     * @param event   The original user-caused Event.
     */
    public keyUpA(thing: ICharacter, event?: Event): void {
        this.preventEventDefault(event);
        this.eightBitter.modAttacher.fireEvent(this.eightBitter.mods.eventNames.onKeyUpA);

        if (thing.player) {
            (thing as IPlayer).keys.a = false;
        }
    }

    /**
     * Reacts to the B key being lifted. The onKeyUpB mod event is fired.
     *
     * @param thing   The triggering Character.
     * @param event   The original user-caused Event.
     */
    public keyUpB(thing: ICharacter, event?: Event): void {
        this.preventEventDefault(event);
        this.eightBitter.modAttacher.fireEvent(this.eightBitter.mods.eventNames.onKeyUpB);

        if (thing.player) {
            (thing as IPlayer).keys.b = false;
        }
    }

    /**
     * Reacts to the pause key being lifted. The onKeyUpPause mod event is fired.
     *
     * @param _thing   The triggering Character.
     * @param event   The original user-caused Event.
     */
    public keyUpPause(_thing: ICharacter, event?: Event): void {
        this.preventEventDefault(event);
        this.eightBitter.modAttacher.fireEvent(this.eightBitter.mods.eventNames.onKeyUpPause);
    }

    /**
     * Reacts to the context menu being activated. The pause menu is opened,
     * and the onMouseDownRight mod event is fired.
     *
     * @param _thing   The triggering Character.
     * @param event   The original user-caused Event.
     */
    public mouseDownRight(_thing: ICharacter, event?: Event): void {
        this.preventEventDefault(event);
        this.eightBitter.menus.pause.toggle();
        this.eightBitter.modAttacher.fireEvent(this.eightBitter.mods.eventNames.onMouseDownRight);
    }

    /**
     * Driver for a direction key being pressed. The MenuGraphr's active menu reacts
     * to the movement if it exists, or the triggering Character attempts to walk
     * if not. The onKeyDownDirectionReal mod event is fired.
     *
     * @param thing   The triggering Character.
     * @param event   The original user-caused Event.
     */
    private keyDownDirectionReal(thing: IPlayer, direction: Direction): void {
        if (!thing.keys[direction]) {
            return;
        }

        if (this.eightBitter.menuGrapher.getActiveMenu()) {
            this.eightBitter.menuGrapher.registerDirection(direction);
            return;
        }

        thing.nextDirection = direction;
        thing.wantsToWalk = true;

        if (!thing.walking) {
            this.eightBitter.actions.animateCharacterSetDirection(thing, direction);
        }

        this.eightBitter.modAttacher.fireEvent(this.eightBitter.mods.eventNames.onKeyDownDirectionReal, direction);
    }

    /**
     * Prevents an event's default, if the event exists.
     *
     * @param event   Event optionally attached to a user key input.
     */
    private preventEventDefault(event?: Event) {
        if (event && event.preventDefault) {
            event.preventDefault();
        }
    }
}
