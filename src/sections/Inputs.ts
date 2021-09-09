import { GameWindow, Inputs as EightBittrInputs } from "eightbittr";
import { Aliases, TriggerContainer } from "inputwritr";

import { FullScreenPokemon } from "../FullScreenPokemon";

import { Direction } from "./Constants";
import { ItemSchema } from "./constants/Items";
import { Character, Player } from "./Actors";

/**
 * User input filtering and handling.
 */
export class Inputs<Game extends FullScreenPokemon> extends EightBittrInputs<Game> {
    /**
     * Known, allowed aliases for input event triggers.
     */
    public readonly aliases: Aliases = {
        // Keyboard aliases
        left: [65, 37], // a, left
        right: [68, 39], // d, right
        up: [87, 38], // w, up
        down: [83, 40], // s, down
        a: [90, 13], // z, enter
        b: [88, 8], // x, backspace
        pause: [80, 27], // p, escape
        select: [17, 16], // ctrl, shift
        // Mouse aliases
        rightclick: [3],
    };

    /**
     * Mapping of events to their key codes, to their callbacks.
     */
    public readonly triggers: TriggerContainer = {
        onkeydown: {
            left: (event: Event): void => this.keyDownLeft(this.game.players[0], event),
            right: (event: Event): void => this.keyDownRight(this.game.players[0], event),
            up: (event: Event): void => this.keyDownUp(this.game.players[0], event),
            down: (event: Event): void => this.keyDownDown(this.game.players[0], event),
            a: (event: Event): void => this.keyDownA(this.game.players[0], event),
            b: (event: Event): void => this.keyDownB(this.game.players[0], event),
            pause: (event: Event): void => this.keyDownPause(this.game.players[0], event),
            mute: (event: Event): void => {
                this.keyDownMute(this.game.players[0], event);
            },
            select: (event: Event): void => this.keyDownSelect(this.game.players[0], event),
        },
        onkeyup: {
            left: (event: Event): void => this.keyUpLeft(this.game.players[0], event),
            right: (event: Event): void => this.keyUpRight(this.game.players[0], event),
            up: (event: Event): void => this.keyUpUp(this.game.players[0], event),
            down: (event: Event): void => this.keyUpDown(this.game.players[0], event),
            a: (event: Event): void => this.keyUpA(this.game.players[0], event),
            b: (event: Event): void => this.keyUpB(this.game.players[0], event),
            pause: (event: Event): void => this.keyUpPause(this.game.players[0], event),
        },
        onmousedown: {
            rightclick: (event: Event): void => this.mouseDownRight(this.game.players[0], event),
        },
        oncontextmenu: {},
    };

    /**
     * Quickly tapping direction keys means to look in a direction, not walk.
     */
    public readonly inputTimeTolerance: number = 4;

    /**
     * Adds InputWritr pipes as global event listeners.
     */
    public initializeGlobalPipes(gameWindow: GameWindow) {
        super.initializeGlobalPipes(gameWindow);

        gameWindow.addEventListener(
            "keydown",
            this.game.inputWriter.makePipe("onkeydown", "keyCode")
        );

        gameWindow.addEventListener(
            "keyup",
            this.game.inputWriter.makePipe("onkeyup", "keyCode")
        );

        gameWindow.addEventListener(
            "mousedown",
            this.game.inputWriter.makePipe("onmousedown", "which")
        );

        gameWindow.addEventListener(
            "contextmenu",
            this.game.inputWriter.makePipe("oncontextmenu", "", true)
        );
    }

    /**
     * Checks whether direction keys such as up may trigger for a Character.
     *
     * @param actor   A Character that wants to move.
     * @returns Whether direction keys may trigger.
     */
    public canDirectionsTrigger(actor: Character): boolean {
        if (actor.following || actor.ledge) {
            return false;
        }

        if (this.game.frameTicker.getPaused()) {
            return false;
        }

        if (this.game.menuGrapher.getActiveMenu()) {
            return true;
        }

        return !this.game.mapScreener.blockInputs;
    }

    /**
     * Reacts to a Character simulating an up key press. If possible, this causes
     * walking in the up direction. The onKeyDownUp mod trigger is fired.
     *
     * @param actor   The triggering Character.
     * @param event   The original user-caused Event.
     */
    public keyDownUp(actor: Character, event?: Event): void {
        this.preventEventDefault(event);
        if (!this.canDirectionsTrigger(actor)) {
            return;
        }

        if (actor.player) {
            (actor as Player).keys[Direction.Top] = true;
        }

        this.game.timeHandler.addEvent(
            (): void => this.keyDownDirectionReal(actor as Player, Direction.Top),
            this.inputTimeTolerance
        );

        this.game.modAttacher.fireEvent(this.game.mods.eventNames.onKeyDownUp);
    }

    /**
     * Reacts to a Character simulating a right key press. If possible, this causes
     * walking in the right direction. The onKeyDownRight mod trigger is fired.
     *
     * @param actor   The triggering Character.
     * @param event   The original user-caused Event.
     */
    public keyDownRight(actor: Character, event?: Event): void {
        this.preventEventDefault(event);
        if (!this.canDirectionsTrigger(actor)) {
            return;
        }

        if (actor.player) {
            (actor as Player).keys[Direction.Right] = true;
        }

        this.game.timeHandler.addEvent(
            (): void => this.keyDownDirectionReal(actor as Player, Direction.Right),
            this.inputTimeTolerance
        );
    }

    /**
     * Reacts to a Character simulating a down key press. If possible, this causes
     * walking in the down direction. The onKeyDownDown mod trigger is fired.
     *
     * @param actor   The triggering Character.
     * @param event   The original user-caused Event.
     */
    public keyDownDown(actor: Character, event?: Event): void {
        this.preventEventDefault(event);
        if (!this.canDirectionsTrigger(actor)) {
            return;
        }

        if (actor.player) {
            (actor as Player).keys[Direction.Bottom] = true;
        }

        this.game.timeHandler.addEvent(
            (): void => this.keyDownDirectionReal(actor as Player, Direction.Bottom),
            this.inputTimeTolerance
        );

        this.game.modAttacher.fireEvent(this.game.mods.eventNames.onKeyDownDown);
    }

    /**
     * Reacts to a Character simulating a left key press. If possible, this causes
     * walking in the left direction. The onKeyDownLeft mod trigger is fired.
     *
     * @param actor   The triggering Character.
     * @param event   The original user-caused Event.
     */
    public keyDownLeft(actor: Character, event?: Event): void {
        this.preventEventDefault(event);
        if (!this.canDirectionsTrigger(actor)) {
            return;
        }

        if (actor.player) {
            (actor as Player).keys[Direction.Left] = true;
        }

        this.game.timeHandler.addEvent(
            (): void => this.keyDownDirectionReal(actor as Player, Direction.Left),
            this.inputTimeTolerance
        );

        this.game.modAttacher.fireEvent(this.game.mods.eventNames.onKeyDownLeft);
    }

    /**
     * Reacts to the A key being pressed. The MenuGraphr's active menu reacts to
     * the selection if it exists. The onKeyDownA mod event is fired.
     *
     * @param actor   The triggering Character.
     * @param event   The original user-caused Event.
     */
    public keyDownA(actor: Character, event?: Event): void {
        this.preventEventDefault(event);
        if (this.game.frameTicker.getPaused()) {
            return;
        }

        if (this.game.menuGrapher.getActiveMenu()) {
            this.game.menuGrapher.registerA();
        } else if (actor.bordering[actor.direction]) {
            if (actor.bordering[actor.direction]!.activate) {
                actor.bordering[actor.direction]!.activate!.call(
                    this,
                    actor,
                    actor.bordering[actor.direction]
                );
            }

            if ((actor as Player).keys) {
                (actor as Player).keys.a = true;
            }
        }

        this.game.modAttacher.fireEvent(this.game.mods.eventNames.onKeyDownA);
    }

    /**
     * Reacts to the B key being pressed. The MenuGraphr's active menu reacts to
     * the deselection if it exists. The onKeyDownB mod event is fired.
     *
     * @param actor   The triggering Character.
     * @param event   The original user-caused Event.
     */
    public keyDownB(actor: Character, event?: Event): void {
        this.preventEventDefault(event);
        if (this.game.frameTicker.getPaused()) {
            return;
        }

        if (this.game.menuGrapher.getActiveMenu()) {
            this.game.menuGrapher.registerB();
        } else if ((actor as Player).keys) {
            (actor as Player).keys.b = true;
        }

        this.game.modAttacher.fireEvent(this.game.mods.eventNames.onKeyDownB);
    }

    /**
     * Reacts to the pause key being pressed. The game is paused if it isn't
     * already. The onKeyDownPause mod event is fired.
     *
     * @param _actor   The triggering Character.
     * @param event   The original user-caused Event.
     */
    public keyDownPause(_actor: Character, event?: Event): void {
        this.preventEventDefault(event);
        this.game.menus.pause.toggle();
        this.game.modAttacher.fireEvent(this.game.mods.eventNames.onKeyDownPause);
    }

    /**
     * Reacts to the mute key being pressed. The game has mute toggled, and the
     * onKeyDownMute mod event is fired.
     *
     * @param _actor   The triggering Character.
     * @param event   The original user-caused Event.
     */
    public async keyDownMute(_actor: Character, event?: Event): Promise<void> {
        this.preventEventDefault(event);
        await this.game.audioPlayer.setMuted(this.game.audioPlayer.getMuted());
        this.game.modAttacher.fireEvent(this.game.mods.eventNames.onKeyDownMute);
    }

    /**
     * Reacts to the select key being pressed. Toggles the use of the registered item.
     *
     * @param actor   The triggering Player.
     * @param event   The original user-caused Event.
     * @todo Extend the use for any registered item, not just the bicycle.
     */
    public keyDownSelect(actor: Player, event?: Event): void {
        this.preventEventDefault(event);
        if (this.game.menuGrapher.getActiveMenu() || actor.walking) {
            return;
        }

        this.game.modAttacher.fireEvent(this.game.mods.eventNames.onKeyDownSelect);

        const selectItem = this.game.itemsHolder.getItem(this.game.storage.names.selectItem);
        if (!selectItem) {
            return;
        }

        const itemSchema: ItemSchema = this.game.constants.items.byName[selectItem.join("")];
        if (!itemSchema.bagActivate) {
            throw new Error("Currently selected item does not have a .bagActivate.");
        }

        itemSchema.bagActivate.call(this, actor, itemSchema);
    }

    /**
     * Reacts to the left key being lifted. The onKeyUpLeft mod event is fired.
     *
     * @param actor   The triggering Character.
     * @param event   The original user-caused Event.
     */
    public keyUpLeft(actor: Character, event?: Event): void {
        this.preventEventDefault(event);
        this.game.modAttacher.fireEvent(this.game.mods.eventNames.onKeyUpLeft);

        if (actor.player) {
            (actor as Player).keys[Direction.Left] = false;
        }

        if (actor.nextDirection === Direction.Left) {
            actor.nextDirection = undefined;
            actor.wantsToWalk = false;
        } else if (actor.nextDirection === undefined) {
            actor.wantsToWalk = false;
        }
    }

    /**
     * Reacts to the right key being lifted. The onKeyUpRight mod event is fired.
     *
     * @param actor   The triggering Character.
     * @param event   The original user-caused Event.
     */
    public keyUpRight(actor: Character, event?: Event): void {
        this.preventEventDefault(event);
        this.game.modAttacher.fireEvent(this.game.mods.eventNames.onKeyUpRight);

        if (actor.player) {
            (actor as Player).keys[Direction.Right] = false;
        }

        if (actor.nextDirection === Direction.Right) {
            actor.nextDirection = undefined;
            actor.wantsToWalk = false;
        } else if (actor.nextDirection === undefined) {
            actor.wantsToWalk = false;
        }
    }

    /**
     * Reacts to the up key being lifted. The onKeyUpUp mod event is fired.
     *
     * @param actor   The triggering Character.
     * @param event   The original user-caused Event.
     */
    public keyUpUp(actor: Character, event?: Event): void {
        this.preventEventDefault(event);
        this.game.modAttacher.fireEvent(this.game.mods.eventNames.onKeyUpUp);

        if (actor.player) {
            (actor as Player).keys[0] = false;
        }

        if (actor.nextDirection === Direction.Top) {
            actor.nextDirection = undefined;
            actor.wantsToWalk = false;
        } else if (actor.nextDirection === undefined) {
            actor.wantsToWalk = false;
        }
    }

    /**
     * Reacts to the down key being lifted. The onKeyUpDown mod event is fired.
     *
     * @param actor   The triggering Character.
     * @param event   The original user-caused Event.
     */
    public keyUpDown(actor: Character, event?: Event): void {
        this.preventEventDefault(event);
        this.game.modAttacher.fireEvent(this.game.mods.eventNames.onKeyUpDown);

        if (actor.player) {
            (actor as Player).keys[2] = false;
        }

        if (actor.nextDirection === Direction.Bottom) {
            actor.nextDirection = undefined;
            actor.wantsToWalk = false;
        } else if (actor.nextDirection === undefined) {
            actor.wantsToWalk = false;
        }
    }

    /**
     * Reacts to the A key being lifted. The onKeyUpA mod event is fired.
     *
     * @param actor   The triggering Character.
     * @param event   The original user-caused Event.
     */
    public keyUpA(actor: Character, event?: Event): void {
        this.preventEventDefault(event);
        this.game.modAttacher.fireEvent(this.game.mods.eventNames.onKeyUpA);

        if (actor.player) {
            (actor as Player).keys.a = false;
        }
    }

    /**
     * Reacts to the B key being lifted. The onKeyUpB mod event is fired.
     *
     * @param actor   The triggering Character.
     * @param event   The original user-caused Event.
     */
    public keyUpB(actor: Character, event?: Event): void {
        this.preventEventDefault(event);
        this.game.modAttacher.fireEvent(this.game.mods.eventNames.onKeyUpB);

        if (actor.player) {
            (actor as Player).keys.b = false;
        }
    }

    /**
     * Reacts to the pause key being lifted. The onKeyUpPause mod event is fired.
     *
     * @param _actor   The triggering Character.
     * @param event   The original user-caused Event.
     */
    public keyUpPause(_actor: Character, event?: Event): void {
        this.preventEventDefault(event);
        this.game.modAttacher.fireEvent(this.game.mods.eventNames.onKeyUpPause);
    }

    /**
     * Reacts to the context menu being activated. The pause menu is opened,
     * and the onMouseDownRight mod event is fired.
     *
     * @param _actor   The triggering Character.
     * @param event   The original user-caused Event.
     */
    public mouseDownRight(_actor: Character, event?: Event): void {
        this.preventEventDefault(event);
        this.game.menus.pause.toggle();
        this.game.modAttacher.fireEvent(this.game.mods.eventNames.onMouseDownRight);
    }

    /**
     * Driver for a direction key being pressed. The MenuGraphr's active menu reacts
     * to the movement if it exists, or the triggering Character attempts to walk
     * if not. The onKeyDownDirectionReal mod event is fired.
     *
     * @param actor   The triggering Character.
     * @param event   The original user-caused Event.
     */
    private keyDownDirectionReal(actor: Player, direction: Direction): void {
        if (!actor.keys[direction]) {
            return;
        }

        if (this.game.menuGrapher.getActiveMenu()) {
            this.game.menuGrapher.registerDirection(direction);
            return;
        }

        actor.nextDirection = direction;
        actor.wantsToWalk = true;

        if (!actor.walking) {
            this.game.actions.animateCharacterSetDirection(actor, direction);
        }

        this.game.modAttacher.fireEvent(
            this.game.mods.eventNames.onKeyDownDirectionReal,
            direction
        );
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
