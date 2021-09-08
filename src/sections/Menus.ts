import { member } from "babyioc";
import { Section } from "eightbittr";
import * as menugraphr from "menugraphr";

import { FullScreenPokemon } from "../FullScreenPokemon";

import { Computer } from "./menus/Computer";
import { Items } from "./menus/Items";
import { Keyboards } from "./menus/Keyboards";
import { Pause } from "./menus/Pause";
import { Player } from "./menus/Player";
import { Pokedex } from "./menus/Pokedex";
import { Pokemon } from "./menus/Pokemon";
import { Save } from "./menus/Save";
import { TownMap } from "./menus/TownMap";
import { Actor } from "./Actors";

/**
 * A description of a simple general text dialog to start.
 */
export interface Dialog {
    /**
     * An optional cutscene to start after the dialog.
     */
    cutscene?: string;

    /**
     * Options for a yes or no dialog menu with callbacks after the dialog.
     */
    options?: DialogOptions;

    /**
     * The actual text to display in the dialog.
     */
    words: menugraphr.MenuDialogRaw;
}

/**
 * Dialog settings for a yes or no menu after a dialog.
 */
export interface DialogOptions {
    /**
     * What to display after the "Yes" option is activated.
     */
    Yes: string | Dialog;

    /**
     * What to display after the "No" option is activated.
     */
    No: string | Dialog;
}

/**
 * General attributes for all menus.
 */
export interface MenuBase extends menugraphr.MenuBase {
    /**
     * Whether this has the dirty visual background.
     */
    dirty?: boolean;

    /**
     * Whether this has the light visual background.
     */
    light?: boolean;

    /**
     * Whether this has the lined visual background.
     */
    lined?: boolean;

    /**
     * Whether this has the plain white visual background.
     */
    plain?: boolean;

    /**
     * Whether this has the water visual background.
     */
    watery?: boolean;
}

/**
 * A schema to specify creating a menu.
 */
export interface MenuSchema extends menugraphr.MenuSchema {
    /**
     * Whether the menu should be hidden.
     */
    hidden?: boolean;
}

/**
 * A Menu Actor.
 */
export interface Menu extends MenuBase, Actor {
    /**
     * Children Actors attached to the Menu.
     */
    children: Actor[];

    /**
     * How tall this is.
     */
    height: number;

    /**
     * Menu name this is listed under.
     */
    name: string;

    /**
     * Any settings to attach to this Menu.
     */
    settings?: any;

    /**
     * How wide this is.
     */
    width: number;
}

/**
 * A ListMenu Actor.
 */
export interface ListMenu extends Menu, menugraphr.ListMenuBase {}

/**
 * Manipulates MenuGraphr menus.
 */
export class Menus extends Section<FullScreenPokemon> {
    /**
     * Menus for PokeCenter computers.
     */
    @member(Computer)
    public readonly computer: Computer;

    /**
     * Manipulates item menus.
     */
    @member(Items)
    public readonly items: Items;

    /**
     * Manipulates the on-screen keyboard menus.
     */
    @member(Keyboards)
    public readonly keyboards: Keyboards;

    /**
     * Opens and closes the root pause menu.
     */
    @member(Pause)
    public readonly pause: Pause;

    /**
     * Opens the Player menu.
     */
    @member(Player)
    public readonly player: Player;

    /**
     * Opens the Pokedex and its individual listings.
     */
    @member(Pokedex)
    public readonly pokedex: Pokedex;

    /**
     * Manipulates Pokemon party and detail menus.
     */
    @member(Pokemon)
    public readonly pokemon: Pokemon;

    /**
     * Opens the Save menu.
     */
    @member(Save)
    public readonly save: Save;

    /**
     * Opens and animates displays on the Town Map menu.
     */
    @member(TownMap)
    public readonly townMap: TownMap;

    /**
     * Displays message when a Player tries to use an item that cannot be used.
     */
    public cannotDoThat(): void {
        this.displayMessage("OAK: %%%%%%%PLAYER%%%%%%%! \n This isn't the \n time to use that!");
    }

    /**
     * Displays a message to the user.
     *
     * @param message   The message to be displayed.
     */
    public displayMessage(message: string): void {
        this.game.menuGrapher.createMenu("GeneralText", {
            deleteOnFinish: true,
        });
        this.game.menuGrapher.addMenuDialog("GeneralText", [message]);
        this.game.menuGrapher.setActiveMenu("GeneralText");
    }
}
