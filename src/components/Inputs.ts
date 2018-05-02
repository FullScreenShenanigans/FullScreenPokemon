import { GeneralComponent } from "gamestartr";

import { FullScreenPokemon } from "../FullScreenPokemon";
import { Direction } from "./Constants";
import { IItemSchema } from "./constants/Items";
import { IPlayer } from "./Things";

/**
 * Routes user input.
 */
export class Inputs<TGameStartr extends FullScreenPokemon> extends GeneralComponent<TGameStartr> {
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
    public canDirectionsTrigger(thing: IPlayer): boolean {
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
    public keyDownUp(thing: IPlayer, event?: Event): void {
        if (!this.gameStarter.gameplay.canInputsTrigger(event) || !this.canDirectionsTrigger(thing)) {
            return;
        }

        thing.keys[Direction.Top] = true;

        this.gameStarter.timeHandler.addEvent(
            (): void => this.keyDownDirectionReal(thing as IPlayer, Direction.Top),
            this.inputTimeTolerance);

        this.gameStarter.modAttacher.fireEvent(this.gameStarter.mods.eventNames.onKeyDownUp);
    }

    /**
     * Reacts to a Character simulating a right key press. If possible, this causes
     * walking in the right direction. The onKeyDownRight mod trigger is fired.
     *
     * @param thing   The triggering Character.
     * @param event   The original user-caused Event.
     */
    public keyDownRight(thing: IPlayer, event?: Event): void {
        if (!this.gameStarter.gameplay.canInputsTrigger(event) || !this.canDirectionsTrigger(thing)) {
            return;
        }

        thing.keys[Direction.Right] = true;

        this.gameStarter.timeHandler.addEvent(
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
    public keyDownDown(thing: IPlayer, event?: Event): void {
        if (!this.gameStarter.gameplay.canInputsTrigger(event) || !this.canDirectionsTrigger(thing)) {
            return;
        }

        thing.keys[Direction.Bottom] = true;

        this.gameStarter.timeHandler.addEvent(
            (): void => this.keyDownDirectionReal(thing as IPlayer, Direction.Bottom),
            this.inputTimeTolerance);

        this.gameStarter.modAttacher.fireEvent(this.gameStarter.mods.eventNames.onKeyDownDown);
    }

    /**
     * Reacts to a Character simulating a left key press. If possible, this causes
     * walking in the left direction. The onKeyDownLeft mod trigger is fired.
     *
     * @param thing   The triggering Character.
     * @param event   The original user-caused Event.
     */
    public keyDownLeft(thing: IPlayer, event?: Event): void {
        if (!this.gameStarter.gameplay.canInputsTrigger(event) || !this.canDirectionsTrigger(thing)) {
            return;
        }

        thing.keys[Direction.Left] = true;

        this.gameStarter.timeHandler.addEvent(
            (): void => this.keyDownDirectionReal(thing as IPlayer, Direction.Left),
            this.inputTimeTolerance);

        this.gameStarter.modAttacher.fireEvent(this.gameStarter.mods.eventNames.onKeyDownLeft);
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

        this.gameStarter.modAttacher.fireEvent(this.gameStarter.mods.eventNames.onKeyDownDirectionReal, direction);
    }

    /**
     * Reacts to the A key being pressed. The MenuGraphr's active menu reacts to
     * the selection if it exists. The onKeyDownA mod event is fired.
     *
     * @param thing   The triggering Character.
     * @param event   The original user-caused Event.
     */
    public keyDownA(thing: IPlayer, event?: Event): void {
        if (!this.gameStarter.gameplay.canInputsTrigger(event) || this.gameStarter.gamesRunner.getPaused()) {
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

            if (thing.keys) {
                thing.keys.a = true;
            }
        }

        this.gameStarter.modAttacher.fireEvent(this.gameStarter.mods.eventNames.onKeyDownA);
    }

    /**
     * Reacts to the B key being pressed. The MenuGraphr's active menu reacts to
     * the deselection if it exists. The onKeyDownB mod event is fired.
     *
     * @param thing   The triggering Character.
     * @param event   The original user-caused Event.
     */
    public keyDownB(thing: IPlayer, event?: Event): void {
        if (!this.gameStarter.gameplay.canInputsTrigger(event) || this.gameStarter.gamesRunner.getPaused()) {
            return;
        }

        if (this.gameStarter.menuGrapher.getActiveMenu()) {
            this.gameStarter.menuGrapher.registerB();
        } else if (thing.keys) {
            thing.keys.b = true;
        }

        this.gameStarter.modAttacher.fireEvent(this.gameStarter.mods.eventNames.onKeyDownB);
    }

    /**
     * Reacts to the pause key being pressed. The game is paused if it isn't
     * already. The onKeyDownPause mod event is fired.
     *
     * @param _thing   The triggering Character.
     * @param event   The original user-caused Event.
     */
    public keyDownPause(_thing: IPlayer, event?: Event): void {
        this.gameStarter.gameplay.canInputsTrigger(event);

        this.gameStarter.menus.pause.toggle();
        this.gameStarter.modAttacher.fireEvent(this.gameStarter.mods.eventNames.onKeyDownPause);
    }

    /**
     * Reacts to the mute key being pressed. The game has mute toggled, and the
     * onKeyDownMute mod event is fired.
     *
     * @param _thing   The triggering Character.
     * @param event   The original user-caused Event.
     */
    public async keyDownMute(_thing: IPlayer, event?: Event): Promise<void> {
        this.gameStarter.gameplay.canInputsTrigger(event);
        await this.gameStarter.audioPlayer.setMuted(this.gameStarter.audioPlayer.getMuted());
        this.gameStarter.modAttacher.fireEvent(this.gameStarter.mods.eventNames.onKeyDownMute);
    }

    /**
     * Reacts to the select key being pressed. Toggles the use of the registered item.
     *
     * @param thing   The triggering Player.
     * @param event   The original user-caused Event.
     * @todo Extend the use for any registered item, not just the bicycle.
     */
    public keyDownSelect(thing: IPlayer, event?: Event): void {
        if (!this.gameStarter.gameplay.canInputsTrigger(event) || this.gameStarter.menuGrapher.getActiveMenu() || thing.walking) {
            return;
        }

        this.gameStarter.modAttacher.fireEvent(this.gameStarter.mods.eventNames.onKeyDownSelect);

        const selectItem = this.gameStarter.itemsHolder.getItem(this.gameStarter.storage.names.selectItem);
        if (!selectItem) {
            return;
        }

        const itemSchema: IItemSchema = this.gameStarter.constants.items.byName[selectItem.join("")];
        if (!itemSchema.bagActivate) {
            throw new Error("Currently selected item does not have a .bagActivate.");
        }

        if (!itemSchema.bagActivate.call(this, thing, itemSchema)) {
            this.gameStarter.menus.displayMessage(itemSchema.error || "");
        }
    }

    /**
     * Reacts to the left key being lifted. The onKeyUpLeft mod event is fired.
     *
     * @param thing   The triggering Character.
     * @param event   The original user-caused Event.
     */
    public keyUpLeft(thing: IPlayer, event?: Event): void {
        this.gameStarter.gameplay.canInputsTrigger(event);
        this.gameStarter.modAttacher.fireEvent(this.gameStarter.mods.eventNames.onKeyUpLeft);

        thing.keys[Direction.Left] = false;

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
    public keyUpRight(thing: IPlayer, event?: Event): void {
        this.gameStarter.gameplay.canInputsTrigger(event);
        this.gameStarter.modAttacher.fireEvent(this.gameStarter.mods.eventNames.onKeyUpRight);

        thing.keys[Direction.Right] = false;

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
    public keyUpUp(thing: IPlayer, event?: Event): void {
        this.gameStarter.gameplay.canInputsTrigger(event);
        this.gameStarter.modAttacher.fireEvent(this.gameStarter.mods.eventNames.onKeyUpUp);

        thing.keys[0] = false;

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
    public keyUpDown(thing: IPlayer, event?: Event): void {
        this.gameStarter.gameplay.canInputsTrigger(event);
        this.gameStarter.modAttacher.fireEvent(this.gameStarter.mods.eventNames.onKeyUpDown);

        thing.keys[2] = false;

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
    public keyUpA(thing: IPlayer, event?: Event): void {
        this.gameStarter.gameplay.canInputsTrigger(event);
        this.gameStarter.modAttacher.fireEvent(this.gameStarter.mods.eventNames.onKeyUpA);

        thing.keys.a = false;
    }

    /**
     * Reacts to the B key being lifted. The onKeyUpB mod event is fired.
     *
     * @param thing   The triggering Character.
     * @param event   The original user-caused Event.
     */
    public keyUpB(thing: IPlayer, event?: Event): void {
        this.gameStarter.gameplay.canInputsTrigger(event);
        this.gameStarter.modAttacher.fireEvent(this.gameStarter.mods.eventNames.onKeyUpB);

        thing.keys.b = false;
    }

    /**
     * Reacts to the pause key being lifted. The onKeyUpPause mod event is fired.
     *
     * @param _thing   The triggering Character.
     * @param event   The original user-caused Event.
     */
    public keyUpPause(_thing: IPlayer, event?: Event): void {
        this.gameStarter.gameplay.canInputsTrigger(event);
        this.gameStarter.modAttacher.fireEvent(this.gameStarter.mods.eventNames.onKeyUpPause);
    }

    /**
     * Reacts to the context menu being activated. The pause menu is opened,
     * and the onMouseDownRight mod event is fired.
     *
     * @param _thing   The triggering Character.
     * @param event   The original user-caused Event.
     */
    public mouseDownRight(_thing: IPlayer, event?: Event): void {
        this.gameStarter.gameplay.canInputsTrigger(event);
        this.gameStarter.menus.pause.toggle();
        this.gameStarter.modAttacher.fireEvent(this.gameStarter.mods.eventNames.onMouseDownRight);
    }
}
