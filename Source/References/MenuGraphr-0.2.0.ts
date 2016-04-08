/// <reference path="GameStartr-0.2.0.ts" />

declare module MenuGraphr {
    /**
     * General attributes for both Menus and MenuSchemas.
     */
    export interface IMenuBase {
        /**
         * A menu to set as active when this one is deleted.
         */
        backMenu?: string;

        /**
         * A callback for when this menu is set as active.
         */
        callback?: (...args: any[]) => void;

        /**
         * Schemas of children to add on creation.
         */
        childrenSchemas?: IMenuChildSchema[];

        /**
         * A containing menu to position within.
         */
        container?: string;

        /**
         * Whether this should be deleted when its dialog finishes.
         */
        deleteOnFinish?: boolean;

        /**
         * Whether the dialog should finish when the last word is displayed, instead
         * of waiting for user input.
         */
        finishAutomatically?: boolean;

        /**
         * How long to delay completion when finishAutomatically is true.
         */
        finishAutomaticSpeed?: number;

        /**
         * How tall this should be.
         */
        height?: number;

        /**
         * Whether user selection events should be ignored.
         */
        ignoreA?: boolean;

        /**
         * Whether user deselection events should be ignored.
         */
        ignoreB?: boolean;

        /**
         * Whether deselection events should count as selection during dialogs.
         */
        ignoreProgressB?: boolean;

        /**
         * Whether this should be kept alive when deselected.
         */
        keepOnBack?: boolean;

        /**
         * Other menus to delete when this is deleted.
         */
        killOnB?: string[];

        /**
         * A callback for when this becomes active.
         */
        onActive?: (name: string) => void;

        /**
         * A callback for when this is deselected.
         */
        onBPress?: (name: string) => void;

        /**
         * A callback for a user event directing down.
         */
        onDown?: (GameStartr: GameStartr.IGameStartr) => void;

        /**
         * A callback for when this becomes inactive.
         */
        onInactive?: (name: string) => void;

        /**
         * A callback for a user event directing to the left.
         */
        onLeft?: (GameStartr: GameStartr.IGameStartr) => void;

        /**
         * A callback for when this is deleted.
         */
        onMenuDelete?: (GameStartr: GameStartr.IGameStartr) => void;

        /**
         * A callback for a user event directing to the right.
         */
        onRight?: (GameStartr: GameStartr.IGameStartr) => void;

        /**
         * A callback for a user event directing up.
         */
        onUp?: (GameStartr: GameStartr.IGameStartr) => void;

        /**
         * A sizing description for this, including width and height.
         */
        size?: IMenuSchemaSize;

        /**
         * A menu to set as active if the start button is pressed while this menu is active.
         */
        startMenu?: string;

        /**
         * A manual width for the area text may be placed in.
         */
        textAreaWidth?: number;

        /**
         * How tall text characters should be treated as.
         */
        textHeight?: number;

        /**
         * How much horizontal padding should be between characters.
         */
        textPaddingX?: number;

        /**
         * How much vertical padding should be between characters.
         */
        textPaddingY?: number;

        /**
         * How long to delay between placing words.
         */
        textSpeed?: number;

        /**
         * A manual starting x-location for dialog text.
         */
        textStartingX?: string;

        /**
         * How wide text characters should be treated as.
         */
        textWidth?: number;

        /**
         * A multiplier for textWidth. Commonly -1 for right-to-left text.
         */
        textWidthMultiplier?: number;

        /**
         * A horizontal offset for the text placement area.
         */
        textXOffset?: number;

        /**
         * A vertical offset for text placement area.
         */
        textYOffset?: number;

        /**
         * How wide this should be.
         */
        width?: number;
    }

    /**
     * Existing menus, listed by name.
     */
    export interface IMenusContainer {
        [i: string]: IMenu;
    }

    /**
     * A Menu Thing, with any number of children.
     */
    export interface IMenu extends GameStartr.IThing, IMenuSchema {
        /**
         * Child Things visible within the Menu.
         */
        children: GameStartr.IThing[];

        /**
         * How tall this is.
         */
        height: number;

        /**
         * A summary of where this menu is in its dialog.
         */
        progress?: IMenuProgress;

        /**
         * Where text should start displaying, horizontally.
         */
        textX?: number;

        /**
         * How wide this is.
         */
        width: number;
    }

    /**
     * A general Text THing.
     */
    export interface IText extends GameStartr.IThing {
        /**
         * How much vertical padding this Thing requires.
         */
        paddingY: number;
    }

    /**
     * A summary of a menu's progress through its dialog.
     */
    export interface IMenuProgress {
        /**
         * Whether the dialog has been completed.
         */
        complete?: boolean;

        /**
         * A callback for when the dialog completes.
         */
        onCompletion?: (...args: any[]) => void;

        /**
         * Whether the dialog is currently being added to the menu.
         */
        working?: boolean;
    }

    /**
     * Known menu schemas, keyed by name.
     */
    export interface IMenuSchemas {
        [i: string]: IMenuSchema;
    }

    /**
     * A schema to specify creating a menu. 
     */
    export interface IMenuSchema extends IMenuBase {
        /**
         * How the menu should be positioned within its container.
         */
        position?: IMenuSchemaPosition;
    }

    /**
     * A schema to specify creating a list menu.
     */
    export interface IListMenuSchema extends IMenuSchema {
        /**
         * How many scrolling items should be visible within the menu.
         */
        scrollingItems?: number;

        /**
         * Whether scrolling items should be computed on creation.
         */
        scrollingItemsComputed?: boolean;
    }

    /**
     * A description of how wide and tall a menu should be.
     */
    export interface IMenuSchemaSize {
        /**
         * How wide the menu should be.
         */
        width?: number;

        /**
         * How tall the menu should be.
         */
        height?: number;
    }

    /**
     * A description of how a meny should be positioned within its container.
     */
    export interface IMenuSchemaPosition {
        /**
         * An optional horizontal position modifier, as "center", "right", or "stretch".
         */
        horizontal?: string;

        /**
         * Horizontal and vertical offsets to shfit the menu by.
         */
        offset?: IMenuSchemaPositionOffset;

        /**
         * Whether this should have children not shifted vertically relative to the 
         * menu top (used exclusively by list menus).
         */
        relative?: boolean;

        /**
         * An optional vertical position modifier, as "center", "bottom", or "stretch".
         */
        vertical?: string;
    }

    /**
     * Horizontal and vertical offsets to shift the menu by.
     */
    export interface IMenuSchemaPositionOffset {
        /**
         * How far to shift the menu vertically from the top.
         */
        top?: number;

        /**
         * How far to shift the menu horizontally from the right.
         */
        right?: number;

        /**
         * How far to shift the menu vertically from the bottom.
         */
        bottom?: number;

        /**
         * How far to shift the menu horizontally from the left.
         */
        left?: number;
    }

    /**
     * A description of a menu child to create, including name and child type.
     */
    export interface IMenuChildSchema extends IMenuSchema {
        /**
         * What type of child this is, as "menu", "text", or "thing".
         */
        type: string;
    }

    /**
     * A description of a menu to create as a menu child.
     */
    export interface IMenuChildMenuSchema extends IMenuChildSchema {
        /**
         * Menu attributes to pass to the menu.
         */
        attributes: IMenuSchema;

        /**
         * The name of the menu.
         */
        name: string;
    }

    /**
     * A descripion of a word to create as a menu child.
     */
    export interface IMenuWordSchema extends IMenuChildSchema {
        /**
         * How to position the word within the menu.
         */
        position?: IMenuSchemaPosition;

        /**
         * A description of the word area's size.
         */
        size?: IMenuSchemaSize;

        /**
         * Raw words to set as the text contents.
         */
        words: (string | IMenuWordCommand)[];
    }

    /**
     * A description of a Thing to create as a menu child.
     */
    export interface IMenuThingSchema extends IMenuChildSchema {
        /**
         * Arguments to proliferate onto the Thing.
         */
        args?: any;

        /**
         * How to position the Thing within the menu.
         */
        position?: IMenuSchemaPosition;

        /**
         * A description of the Thing's size.
         */
        size?: IMenuSchemaSize;

        /**
         * What Thing title to create.
         */
        thing: string;
    }

    /**
     * Various raw forms of dialog that may be used. A single String is common
     * for short dialogs, and longer ones may use a String for each word or character,
     * as well as filtered Objects.
     */
    export type IMenuDialogRaw = string | (string | string[] | (string | string[])[] | IMenuWordCommandBase)[]

    /**
     * A general word and/or command to use within a text dialog.
     */
    export interface IMenuWordCommandBase {
        /**
         * How many characters long the word is.
         */
        length?: number | string;

        /**
         * The actual word to place, if this is a text
         */
        word?: string;
    }

    /**
     * A word command to modify dialog within its text.
     */
    export interface IMenuWordCommand extends IMenuWordCommandBase {
        /**
         * Whether the command's position changing should have unitsize applied.
         */
        applyUnitsize?: boolean;

        /**
         * An attribute to change, if this is an attribute change command.
         */
        attribute: string;

        /**
         * The command, as "attribute", "attributeReset", "padLeft", or "position".
         */
        command: string;

        /**
         * A value for the attribute to change, if this is an attribute change command.
         */
        value: any;
    }

    /**
     * A pad left command to add a word with padding.
     */
    export interface IMenuWordPadLeftCommand extends IMenuWordCommandBase {
        /**
         * Whether the amount of padding should be reduced by the word length.
         */
        alignRight?: boolean;
    }

    /**
     * A word command to reset an attribute after an attribute change command.
     */
    export interface IMenuWordReset extends IMenuWordCommandBase {
        /**
         * The name of the attribute to reset.
         */
        attribute: string;
    }

    /**
     * A word command to shift the position to add subsequent words.
     */
    export interface IMenuWordPosition extends IMenuWordCommandBase {
        /**
         * How far to shift horizontally.
         */
        x?: number;

        /**
         * How far to shift vertically.
         */
        y?: number;
    }

    /**
     * Base grid attributes for a list menu.
     */
    export interface IListMenuBase {
        /**
         * The grid of options, as columns containing rows.
         */
        grid: IGridCell[][];

        /**
         * How many columns are available in the grid.
         */
        gridColumns: number;

        /**
         * How many rows are available in the grid.
         */
        gridRows: number;

        /**
         * All options available in the grid.
         */
        options: IGridCell[];

        /**
         * The currently selected [column, row] in the grid.
         */
        selectedIndex: [number, number];
    }

    /**
     * A menu containing some number of options as cells in a grid.
     */
    export interface IListMenu extends IListMenuBase, IListMenuSchema, IMenu {
        /**
         * The arrow Thing indicating the current selection.
         */
        arrow: GameStartr.IThing;

        /**
         * A horizontal offset for the arrow Thing.
         */
        arrowXOffset?: number;

        /**
         * A vertical offset for the arrow Thing.
         */
        arrowYOffset?: number;

        /**
         * How tall this is.
         */
        height: number;

        /**
         * Descriptions of the options, with their grid cell and Things.
         */
        optionChildren: any[];

        /**
         * A summary of the menu's progress through its list.
         */
        progress: IListMenuProgress;

        /**
         * How many rows the menu has visually scrolled.
         */
        scrollingVisualOffset?: number;

        /**
         * Whether the list should be a single column, rather than auto-flow.
         */
        singleColumnList: boolean;

        /**
         * How wide each column of text should be in the grid.
         */
        textColumnWidth: number;

        /**
         * How wide this is.
         */
        width: number;
    }

    /**
     * A single option within a list menu's grid.
     */
    export interface IGridCell {
        /**
         * A callback for selecting this cell with a user selection event.
         */
        callback?: (...args: any[]) => void;

        /**
         * The column containing this option.
         */
        column: IGridCell[];

        /**
         * What number column contains this option.
         */
        columnNumber: number;

        /**
         * This option's index within all grid options.
         */
        index: number;

        /**
         * What number row contains this option.
         */
        rowNumber: number;

        /**
         * Text to display to represent this option.
         */
        text: (string | IMenuWordCommand)[];

        /**
         * Optionally, an equivalent title that represents this option.
         */
        title?: string;

        /**
         * Floating texts that should be added with the option.
         */
        textsFloating?: any;

        /**
         * Things that visually represent this option.
         */
        things: GameStartr.IThing[];

        /**
         * Optionally, some value represented by this option.
         */
        value?: any;

        /**
         * A horizontal left edge for this option's area.
         */
        x: number;

        /**
         * A vertical top edge for this option's area.
         */
        y: number;
    }

    /**
     * Settings to create a new list menu.
     */
    export interface IListMenuOptions {
        /**
         * A bottom option to place below all grid options.
         */
        bottom?: any;

        /**
         * Options within the menu, or a Function to generate them.
         */
        options: any[] | {
            (): any[];
        };

        /**
         * A default starting selected index.
         */
        selectedIndex?: [number, number];
    }

    /**
     * A summary of the menu's progress through its list.
     */
    export interface IListMenuProgress extends IMenuProgress {
        /**
         * The current words in the list.
         */
        words: any;

        /**
         * The index of the currently selected option.
         */
        i: any;

        /**
         * The horizontal position of the currently selected option.
         */
        x: any;

        /**
         * The vertical position of the currently selected option.
         */
        y: any;
    }

    /**
     * Alternate Thing titles for characters, such as " " to "space".
     */
    export interface IAliases {
        [i: string]: string;
    }

    /**
     * Programmatic replacements for deliniated words.
     */
    export interface IReplacements {
        [i: string]: string[] | IReplacerFunction;
    }

    /**
     * A Function to generate a word replacement based on the GameStarter's state.
     */
    export interface IReplacerFunction {
        (GameStarter: GameStartr.IGameStartr): string[];
    }

    /**
     * Settings to initialize a new IMenuGraphr.
     */
    export interface IMenuGraphrSettings {
        /**
         * The parent GameStartr.IGameStartr managing Things.
         */
        GameStarter: GameStartr.IGameStartr;

        /**
         * Known menu schemas, keyed by name.
         */
        schemas?: IMenuSchemas;

        /**
         * Alternate Thing titles for charactes, such as " " for "space".
         */
        aliases?: IAliases;

        /**
         * Programmatic replacements for deliniated words.
         */
        replacements?: IReplacements;

        /**
         * The separator for words to replace using replacements.
         */
        replacerKey?: string;
    }

    /**
     * A menu management system. Menus can have dialog-style text, scrollable
     * and unscrollable grids, and children menus or decorations added.
     */
    export interface IMenuGraphr {
        /**
         * @returns All available menus, keyed by name.
         */
        getMenus(): IMenusContainer;

        /**
         * @param name   A name of a menu.
         * @returns The menu under the given name.
         */
        getMenu(name: string): IMenu;

        /**
         * Returns a menu, throwing an error if it doesn't exist.
         * 
         * @param name   A name of a menu.
         * @returns The menu under the given name.
         */
        getExistingMenu(name: string): IMenu;

        /**
         * @returns The currently active menu.
         */
        getActiveMenu(): IMenu;

        /**
         * @returns The name of the currently active menu.
         */
        getActiveMenuName(): string;

        /**
         * @returns The alternate Thing titles for characters.
         */
        getAliases(): IAliases;

        /**
         * @returns The programmatic replacements for deliniated words.
         */
        getReplacements(): IReplacements;

        /**
         * Creates a menu with the given name and attributes, and stores it under the name.
         * Default information is used from the schema of that name, such as position and
         * children, but may be override by attributes.
         * 
         * @param name   The name of the menu.
         * @param attributes   Custom attributes to apply to the menu.
         * @returns The newly created menu.
         */
        createMenu(name: string, attributes?: IMenuSchema): IMenu;

        /**
         * Adds a child object to an existing menu.
         * 
         * @param name   The name of the existing menu.
         * @param schema   Settings for the child, including name and child type.
         * @returns The newly created Thing or Things.
         * @remarks Creating a menu is done using this.createMenu, so the created menu might
         *          not mark itself as a child of the parent.
         */
        createMenuChild(name: string, schema: IMenuChildSchema): GameStartr.IThing | GameStartr.IThing[];

        /**
         * Creates a series of words as a child of a menu.
         * 
         * @param name   The name of the menu.
         * @param schema   Settings for the words.
         * @returns The words' character Things.
         */
        createMenuWord(name: string, schema: IMenuWordSchema): GameStartr.IThing[];

        /**
         * Creates a Thing as a child of a menu.
         * 
         * @param name   The name of the menu.
         * @param schema   Settings for the Thing.
         * @returns The newly created Thing.
         */
        createMenuThing(name: string, schema: IMenuThingSchema): GameStartr.IThing;

        /**
         * Hides a menu of the given name and deletes its children, if it exists.
         * 
         * @param name   The name of the menu to hide.
         */
        hideMenu(name: string): void;

        /**
         * Deletes a menu of the given name, if it exists.
         * 
         * @param name   The name of the menu to delete.
         */
        deleteMenu(name: string): void;

        /**
         * Deletes the active menu, if it exists.
         */
        deleteActiveMenu(): void;

        /**
         * Deletes all menus.
         */
        deleteAllMenus(): void;

        /**
         * Adds dialog-style text to a menu. If the text overflows, 
         * 
         * @param name   The name of the menu.
         * @param dialog   Raw dialog to add to the menu.
         * @param onCompletion   An optional callback for when the text is done.
         */
        addMenuDialog(name: string, dialog: IMenuDialogRaw, onCompletion?: () => any): void;

        /**
         * Continues a menu from its current display words to the next line.
         * 
         * @param name    The name of the menu.
         */
        continueMenu(name: string): void;

        /**
         * Adds a list of text options to a menu.
         * 
         * @param name   The name of the menu.
         * @param settings   Settings for the list, particularly its options, starting
         *                   index, and optional floating bottom.
         */
        addMenuList(name: string, settings: IListMenuOptions): void;

        /**
         * Retrives the currently selected grid cell of a menu.
         * 
         * @param name   The name of the menu.
         * @returns The currently selected grid cell of the menu.
         */
        getMenuSelectedOption(name: string): IGridCell;

        /**
         * Shifts the selected index of a list menu, adjusting for scrolling if necessary.
         * 
         * @param name   The name of the menu.
         * @param dx   How far along the menu's grid to shift horizontally.
         * @param dy   How far along the menu's grid to shift vertically.
         */
        shiftSelectedIndex(name: string, dx: number, dy: number): void;

        /**
         * Sets the current selected index of a menu.
         * 
         * @param name   The name of the menu.
         * @param x   The new horizontal value for the index.
         * @param y   The new vertical value for the index.
         */
        setSelectedIndex(name: string, x: number, y: number): void;

        /**
         * Sets the currently active menu.
         * 
         * @param name   The name of the menu to set as active. If not given, no menu
         *               is set as active.
         */
        setActiveMenu(name?: string): void;

        /**
         * Reacts to a user event directing in the given direction.
         * 
         * @param direction   The direction of the interaction.
         */
        registerDirection(direction: Direction): void;

        /**
         * Reacts to a user event directing up.
         */
        registerUp(): void;

        /**
         * Reacts to a user event directing to the right.
         */
        registerRight(): void;

        /**
         * Reacts to a user event directing down.
         */
        registerDown(): void;

        /**
         * Reacts to a user event directing to the left.
         */
        registerLeft(): void;

        /**
         * Reacts to a user event from pressing a selection key.
         */
        registerA(): void;

        /**
         * Reacts to a user event from pressing a deselection key.
         */
        registerB(): void;

        /**
         * Reacts to a user event from pressing a start key.
         */
        registerStart(): void;
    }
}


module MenuGraphr {
    "use strict";

    /**
     * Cardinal directions as Numbers.
     */
    export enum Direction {
        Top = 0,
        Right = 1,
        Bottom = 2,
        Left = 3
    }

    /**
     * A menu management system for GameStartr. Menus can have dialog-style text, scrollable
     * and unscrollable grids, and children menus or decorations added.
     */
    export class MenuGraphr implements IMenuGraphr {
        /**
         * The parent IGameStartr managing Things.
         */
        private GameStarter: GameStartr.IGameStartr;

        /**
         * All available menus, keyed by name.
         */
        private menus: IMenusContainer;

        /**
         * The currently "active" (user-selected) menu.
         */
        private activeMenu: IMenu;

        /**
         * Known menu schemas, keyed by name.
         */
        private schemas: IMenuSchemas;

        /**
         * Alternate Thing titles for charactes, such as " " for "space".
         */
        private aliases: IAliases;

        /**
         * Programmatic replacements for deliniated words.
         */
        private replacements: IReplacements;

        /**
         * The separator for words to replace using replacements.
         */
        private replacerKey: string;

        /**
         * Initializes a new instance of the MenuGraphr class.
         * 
         * @param settings   Settings to be used for initialization.
         */
        constructor(settings: IMenuGraphrSettings) {
            if (!settings) {
                throw new Error("No settings object given to MenuGraphr.");
            }
            if (!settings.GameStarter) {
                throw new Error("No GameStarter given to MenuGraphr.");
            }

            this.GameStarter = settings.GameStarter;

            this.schemas = settings.schemas || {};
            this.aliases = settings.aliases || {};
            this.replacements = settings.replacements || {};
            this.replacerKey = settings.replacerKey || "%%%%%%%";

            this.menus = {};
        }


        /* Simple gets
        */

        /**
         * @returns All available menus, keyed by name.
         */
        getMenus(): IMenusContainer {
            return this.menus;
        }

        /**
         * @param name   A name of a menu.
         * @returns The menu under the given name.
         */
        getMenu(name: string): IMenu {
            return this.menus[name];
        }

        /**
         * Returns a menu, throwing an error if it doesn't exist.
         * 
         * @param name   A name of a menu.
         * @returns The menu under the given name.
         */
        getExistingMenu(name: string): IMenu {
            if (!this.menus[name]) {
                throw new Error("'" + name + "' menu does not exist.");
            }

            return this.menus[name];
        }

        /**
         * @returns The currently active menu.
         */
        getActiveMenu(): IMenu {
            return this.activeMenu;
        }

        /**
         * @returns The name of the currently active menu.
         */
        getActiveMenuName(): string {
            return this.activeMenu.name;
        }

        /**
         * @returns The alternate Thing titles for characters.
         */
        getAliases(): IAliases {
            return this.aliases;
        }

        /**
         * @returns The programmatic replacements for deliniated words.
         */
        getReplacements(): IReplacements {
            return this.replacements;
        }


        /* Creations
        */

        /**
         * Creates a menu with the given name and attributes, and stores it under the name.
         * Default information is used from the schema of that name, such as position and
         * children, but may be override by attributes.
         * 
         * @param name   The name of the menu.
         * @param attributes   Custom attributes to apply to the menu.
         * @returns The newly created menu.
         */
        createMenu(name: string, attributes?: IMenuSchema): IMenu {
            var schemaRaw: IMenuSchema = this.GameStarter.proliferate({}, this.schemas[name]),
                schema: IMenuSchema = this.GameStarter.proliferate(schemaRaw, attributes),
                menu: IMenu = this.GameStarter.ObjectMaker.make("Menu", schema),
                // If the container menu doesn't exist, a pseudo-menu the size of the screen is used
                container: IMenu = schema.container
                    ? this.menus[schema.container]
                    : <IMenu><any>{
                        top: 0,
                        right: this.GameStarter.MapScreener.width,
                        bottom: this.GameStarter.MapScreener.height,
                        left: 0,
                        width: Math.ceil(this.GameStarter.MapScreener.width / this.GameStarter.unitsize),
                        height: Math.ceil(this.GameStarter.MapScreener.height / this.GameStarter.unitsize),
                        EightBitter: this.GameStarter,
                        GameStarter: this.GameStarter,
                        children: []
                    };

            this.deleteMenu(name);

            this.menus[name] = menu;
            menu.name = name;
            this.placeMenuThing(container, menu, schema.size, schema.position);

            menu.children = [];
            menu.textAreaWidth = (menu.width - menu.textXOffset * 2) * this.GameStarter.unitsize;

            if (menu.childrenSchemas) {
                menu.childrenSchemas.forEach(this.createMenuChild.bind(this, name));
            }

            if (container.children) {
                container.children.push(menu);
            }

            this.GameStarter.proliferate(menu, attributes);

            return menu;
        }

        /**
         * Adds a child object to an existing menu.
         * 
         * @param name   The name of the existing menu.
         * @param schema   Settings for the child, including name and child type.
         * @returns The newly created Thing or Things.
         * @remarks Creating a menu is done using this.createMenu, so the created menu might
         *          not mark itself as a child of the parent.
         */
        createMenuChild(name: string, schema: IMenuChildSchema): GameStartr.IThing | GameStartr.IThing[] {
            switch (schema.type) {
                case "menu":
                    return this.createMenu((<IMenuChildMenuSchema>schema).name, (<IMenuChildMenuSchema>schema).attributes);

                case "text":
                    return this.createMenuWord(name, <IMenuWordSchema>schema);

                case "thing":
                    return this.createMenuThing(name, <IMenuThingSchema>schema);

                default:
                    throw new Error("Unknown schema type: " + schema.type);
            }
        }

        /**
         * Creates a series of words as a child of a menu.
         * 
         * @param name   The name of the menu.
         * @param schema   Settings for the words.
         * @returns The words' character Things.
         */
        createMenuWord(name: string, schema: IMenuWordSchema): GameStartr.IThing[] {
            var menu: IMenu = this.getExistingMenu(name),
                container: IMenu = this.GameStarter.ObjectMaker.make("Menu"),
                words: (string[] | IMenuWordCommand)[] = this.filterMenuWords(schema.words);

            this.placeMenuThing(menu, container, schema.size, schema.position, true);
            menu.textX = container.left;

            return this.addMenuWords(name, words, 0, container.left, container.top);
        }

        /**
         * Creates a Thing as a child of a menu.
         * 
         * @param name   The name of the menu.
         * @param schema   Settings for the Thing.
         * @returns The newly created Thing.
         */
        createMenuThing(name: string, schema: IMenuThingSchema): GameStartr.IThing {
            var menu: IMenu = this.getExistingMenu(name),
                thing: GameStartr.IThing = this.GameStarter.ObjectMaker.make(schema.thing, schema.args);

            this.placeMenuThing(menu, thing, schema.size, schema.position);

            this.GameStarter.GroupHolder.switchMemberGroup(
                thing,
                thing.groupType,
                "Text");

            menu.children.push(thing);

            return thing;
        }


        /* Removals
        */

        /**
         * Hides a menu of the given name and deletes its children, if it exists.
         * 
         * @param name   The name of the menu to hide.
         */
        hideMenu(name: string): void {
            var menu: IMenu = this.menus[name];

            if (menu) {
                menu.hidden = true;
                this.deleteMenuChildren(name);
            }
        }

        /**
         * Deletes a menu of the given name, if it exists.
         * 
         * @param name   The name of the menu to delete.
         */
        deleteMenu(name: string): void {
            var menu: IMenu = this.menus[name];

            if (menu) {
                this.deleteMenuChild(menu);
            }
        }

        /**
         * Deletes the active menu, if it exists.
         */
        deleteActiveMenu(): void {
            if (this.activeMenu) {
                this.deleteMenu(this.activeMenu.name);
            }
        }

        /**
         * Deletes all menus.
         */
        deleteAllMenus(): void {
            for (var key in this.menus) {
                if (this.menus.hasOwnProperty(key)) {
                    this.deleteMenu(key);
                }
            }
        }


        /* Menu text
        */

        /**
         * Adds dialog-style text to a menu. If the text overflows, 
         * 
         * @param name   The name of the menu.
         * @param dialog   Raw dialog to add to the menu.
         * @param onCompletion   An optional callback for when the text is done.
         */
        addMenuDialog(name: string, dialog: IMenuDialogRaw, onCompletion?: () => any): void {
            var dialogParsed: (string[] | IMenuWordCommand)[][] = this.parseRawDialog(dialog),
                currentLine: number = 1,
                callback: () => void = (): void => {
                    // If all dialog has been exhausted, delete the menu and finish
                    if (currentLine >= dialogParsed.length) {
                        if (this.menus[name].deleteOnFinish) {
                            this.deleteMenu(name);
                        }
                        if (onCompletion) {
                            onCompletion();
                        }
                        return;
                    }

                    currentLine += 1;

                    // Delete any previous texts. This is only done if continuing
                    // so that when the dialog is finished, the last text remains
                    this.deleteMenuChildren(name);

                    // This continues the dialog with the next iteration (word)
                    this.addMenuText(name, dialogParsed[currentLine - 1], callback);
                };

            // This first call to addmenuText shouldn't be the callback, because if 
            // being called from a childrenSchema of type "text", it shouldn't delete 
            // any other menu children from childrenSchemas.
            this.addMenuText(name, dialogParsed[0], callback);
        }

        /**
         * Continues a menu from its current display words to the next line.
         * 
         * @param name    The name of the menu.
         */
        continueMenu(name: string): void {
            var menu: IListMenu = <IListMenu>this.getExistingMenu(name),
                children: IText[] = <IText[]>menu.children,
                progress: IListMenuProgress = menu.progress,
                character: IText,
                i: number;

            if (!progress || progress.working) {
                return;
            }

            progress.working = true;

            if (progress.complete) {
                if (!progress.onCompletion || progress.onCompletion(this.GameStarter, menu)) {
                    this.deleteMenu(name);
                }
                return;
            }


            for (i = 0; i < children.length; i += 1) {
                character = children[i];

                this.GameStarter.TimeHandler.addEventInterval(
                    this.scrollCharacterUp.bind(this),
                    1,
                    (<IText>character).paddingY,
                    character,
                    menu,
                    -1);
            }

            this.GameStarter.TimeHandler.addEvent(
                (): void => {
                    this.addMenuWords(name, progress.words, progress.i, progress.x, progress.y, progress.onCompletion);
                },
                character.paddingY + 1);
        }


        /* Lists
        */

        /**
         * Adds a list of text options to a menu.
         * 
         * @param name   The name of the menu.
         * @param settings   Settings for the list, particularly its options, starting
         *                   index, and optional floating bottom.
         */
        addMenuList(name: string, settings: IListMenuOptions): void {
            var menu: IListMenu = <IListMenu>this.getExistingMenu(name),
                options: any[] = settings.options.constructor === Function
                    ? (<any>settings.options)()
                    : settings.options,
                left: number = menu.left + menu.textXOffset * this.GameStarter.unitsize,
                top: number = menu.top + menu.textYOffset * this.GameStarter.unitsize,
                textProperties: any = this.GameStarter.ObjectMaker.getPropertiesOf("Text"),
                textWidth: number = (menu.textWidth || textProperties.width) * this.GameStarter.unitsize,
                textHeight: number = (menu.textHeight || textProperties.height) * this.GameStarter.unitsize,
                textPaddingY: number = (menu.textPaddingY || textProperties.paddingY) * this.GameStarter.unitsize,
                selectedIndex: [number, number] = settings.selectedIndex || [0, 0],
                optionChildren: any[] = [],
                index: number = 0,
                y: number = top,
                option: any,
                optionChild: any,
                schema: any,
                title: string,
                character: GameStartr.IThing,
                column: IGridCell[],
                x: number,
                i: number,
                j: number,
                k: number;

            menu.options = options;
            menu.optionChildren = optionChildren;

            menu.callback = this.triggerMenuListOption.bind(this);
            menu.onActive = this.activateMenuList.bind(this);
            menu.onInactive = this.deactivateMenuList.bind(this);

            menu.grid = [];
            menu.grid[0] = column = [];
            menu.gridRows = 0;

            if (!options.length) {
                return;
            }

            for (i = 0; i < options.length; i += 1) {
                x = left;
                option = options[i];
                optionChild = {
                    "option": option,
                    "things": []
                };

                optionChildren.push(optionChild);

                option.x = x;
                option.y = y;

                column.push(option);
                option.column = column;
                option.index = index;
                option.columnNumber = menu.grid.length - 1;
                option.rowNumber = column.length - 1;
                menu.gridRows = Math.max(menu.gridRows, column.length);
                index += 1;

                if (option.things) {
                    for (j = 0; j < option.things.length; j += 1) {
                        schema = option.things[j];
                        character = this.createMenuThing(name, schema);
                        menu.children.push(character);
                        optionChild.things.push(character);

                        if (!schema.position || !schema.position.relative) {
                            this.GameStarter.shiftVert(character, y - menu.top);
                        }
                    }
                }

                if (option.textsFloating) {
                    for (j = 0; j < option.textsFloating.length; j += 1) {
                        schema = option.textsFloating[j];

                        optionChild.things = optionChild.things.concat(
                            this.addMenuWords(
                                name,
                                [schema.text],
                                0,
                                x + schema.x * this.GameStarter.unitsize,
                                y + schema.y * this.GameStarter.unitsize)
                        );
                    }
                }

                option.schema = schema = this.filterText(option.text);

                if (schema !== "\n") {
                    for (j = 0; j < schema.length; j += 1) {
                        for (k = 0; k < schema[j].length; k += 1) {
                            if (schema[j][k].command) {
                                if (schema[j][k].x) {
                                    x += schema[j][k].x * this.GameStarter.unitsize;
                                }
                                if (schema[j][k].y) {
                                    y += schema[j][k].y * this.GameStarter.unitsize;
                                }
                            } else {
                                option.title = title = "Char" + this.getCharacterEquivalent(schema[j][k]);
                                character = this.GameStarter.ObjectMaker.make(title);
                                menu.children.push(character);
                                optionChild.things.push(character);

                                this.GameStarter.addThing(character, x, y);

                                x += character.width * this.GameStarter.unitsize;
                            }
                        }
                    }
                }

                y += textPaddingY;

                if (!menu.singleColumnList && y > menu.bottom - textHeight + 1) {
                    y = top;
                    left += menu.textColumnWidth * this.GameStarter.unitsize;
                    column = [];
                    menu.grid.push(column);
                }
            }

            while (menu.grid[menu.grid.length - 1].length === 0) {
                menu.grid.pop();
            }
            menu.gridColumns = menu.grid.length;

            if (settings.bottom) {
                option = settings.bottom;
                option.schema = schema = this.filterText(option.text);

                optionChild = {
                    "option": option,
                    "things": []
                };
                optionChildren.push(optionChild);

                x = menu.left + (menu.textXOffset + option.position.left) * this.GameStarter.unitsize;
                y = menu.top + (menu.textYOffset + option.position.top) * this.GameStarter.unitsize;

                option.x = x;
                option.y = y;

                // Copy & pasted from the above options loop
                // Todo: make this into its own helper function?
                for (j = 0; j < schema.length; j += 1) {
                    for (k = 0; k < schema[j].length; k += 1) {
                        if (schema[j][k].command) {
                            if (schema[j][k].x) {
                                x += schema[j][k].x * this.GameStarter.unitsize;
                            }
                            if (schema[j][k].y) {
                                y += schema[j][k].y * this.GameStarter.unitsize;
                            }
                        } else if (schema[j][k] !== " ") {
                            option.title = title = "Char" + this.getCharacterEquivalent(schema[j][k]);
                            character = this.GameStarter.ObjectMaker.make(title);
                            menu.children.push(character);
                            optionChild.things.push(character);

                            this.GameStarter.addThing(character, x, y);

                            x += character.width * this.GameStarter.unitsize;
                        } else {
                            x += textWidth;
                        }
                    }
                }

                menu.gridRows += 1;
                for (j = 0; j < menu.grid.length; j += 1) {
                    menu.grid[j].push(option);
                }
            }

            if (menu.scrollingItemsComputed) {
                menu.scrollingItems = this.computeMenuScrollingItems(menu);
            }

            if (menu.scrollingItems) {
                menu.scrollingVisualOffset = 0;

                for (i = menu.scrollingItems; i < menu.gridRows; i += 1) {
                    optionChild = optionChildren[i];
                    for (j = 0; j < optionChild.things.length; j += 1) {
                        optionChild.things[j].hidden = true;
                    }
                }
            }

            menu.selectedIndex = selectedIndex;
            menu.arrow = character = this.GameStarter.ObjectMaker.make("CharArrowRight");
            menu.children.push(character);
            character.hidden = (this.activeMenu !== menu);

            option = menu.grid[selectedIndex[0]][selectedIndex[1]];

            this.GameStarter.addThing(character);
            this.GameStarter.setRight(character, option.x - menu.arrowXOffset * this.GameStarter.unitsize);
            this.GameStarter.setTop(character, option.y + menu.arrowYOffset * this.GameStarter.unitsize);
        }

        /**
         * Retrives the currently selected grid cell of a menu.
         * 
         * @param name   The name of the menu.
         * @returns The currently selected grid cell of the menu.
         */
        getMenuSelectedOption(name: string): IGridCell {
            var menu: IListMenu = <IListMenu>this.getExistingMenu(name);

            if (!menu.grid || !menu.selectedIndex) {
                throw new Error("The " + name + " menu does not behave like a list menu.");
            }

            return menu.grid[menu.selectedIndex[0]][menu.selectedIndex[1]];
        }

        /**
         * Shifts the selected index of a list menu, adjusting for scrolling if necessary.
         * 
         * @param name   The name of the menu.
         * @param dx   How far along the menu's grid to shift horizontally.
         * @param dy   How far along the menu's grid to shift vertically.
         */
        shiftSelectedIndex(name: string, dx: number, dy: number): void {
            var menu: IListMenu = <IListMenu>this.getExistingMenu(name),
                textProperties: any = this.GameStarter.ObjectMaker.getPropertiesOf("Text"),
                textPaddingY: number = (menu.textPaddingY || textProperties.paddingY) * this.GameStarter.unitsize,
                option: IGridCell,
                x: number,
                y: number;

            if (menu.scrollingItems) {
                x = menu.selectedIndex[0] + dx;
                y = menu.selectedIndex[1] + dy;

                x = Math.max(Math.min(menu.gridColumns - 1, x), 0);
                y = Math.max(Math.min(menu.gridRows - 1, y), 0);
            } else {
                x = (menu.selectedIndex[0] + dx) % menu.gridColumns;
                y = (menu.selectedIndex[1] + dy) % menu.gridRows;

                while (x < 0) {
                    x += menu.gridColumns;
                }

                while (y < 0) {
                    y += menu.gridRows;
                }
            }

            if (x === menu.selectedIndex[0] && y === menu.selectedIndex[1]) {
                return;
            }

            menu.selectedIndex[0] = x;
            menu.selectedIndex[1] = y;
            option = this.getMenuSelectedOption(name);

            if (menu.scrollingItems) {
                this.scrollListThings(name, dy, textPaddingY);
            }

            this.GameStarter.setRight(menu.arrow, option.x - menu.arrowXOffset * this.GameStarter.unitsize);
            this.GameStarter.setTop(menu.arrow, option.y + menu.arrowYOffset * this.GameStarter.unitsize);
        }

        /**
         * Sets the current selected index of a menu.
         * 
         * @param name   The name of the menu.
         * @param x   The new horizontal value for the index.
         * @param y   The new vertical value for the index.
         */
        setSelectedIndex(name: string, x: number, y: number): void {
            var menu: IListMenu = <IListMenu>this.getExistingMenu(name),
                selectedIndex: [number, number] = menu.selectedIndex;

            this.shiftSelectedIndex(name, x - selectedIndex[0], y - selectedIndex[1]);
        }


        /* Interactivity
        */

        /**
         * Sets the currently active menu.
         * 
         * @param name   The name of the menu to set as active. If not given, no menu
         *               is set as active.
         */
        setActiveMenu(name?: string): void {
            if (this.activeMenu && this.activeMenu.onInactive) {
                this.activeMenu.onInactive(this.activeMenu.name);
            }

            if (typeof name !== "undefined") {
                this.activeMenu = this.menus[name];

                if (this.activeMenu && this.activeMenu.onActive) {
                    this.activeMenu.onActive(name);
                }
            }
        }

        /**
         * Reacts to a user event directing in the given direction.
         * 
         * @param direction   The direction of the interaction.
         */
        registerDirection(direction: number): void {
            switch (direction) {
                case Direction.Top:
                    return this.registerUp();
                case Direction.Right:
                    return this.registerRight();
                case Direction.Bottom:
                    return this.registerDown();
                case Direction.Left:
                    return this.registerLeft();
                default:
                    throw new Error("Unknown direction: " + direction);
            }
        }

        /**
         * Reacts to a user event directing up.
         */
        registerUp(): void {
            var menu: IListMenu = <IListMenu>this.activeMenu;

            if (!menu) {
                return;
            }

            if (menu.selectedIndex) {
                this.shiftSelectedIndex(menu.name, 0, -1);
            }

            if (menu.onUp) {
                menu.onUp(this.GameStarter);
            }
        }

        /**
         * Reacts to a user event directing to the right.
         */
        registerRight(): void {
            var menu: IListMenu = <IListMenu>this.activeMenu;

            if (!menu) {
                return;
            }

            if (menu.selectedIndex) {
                this.shiftSelectedIndex(menu.name, 1, 0);
            }

            if (menu.onRight) {
                menu.onRight(this.GameStarter);
            }
        }

        /**
         * Reacts to a user event directing down.
         */
        registerDown(): void {
            var menu: IListMenu = <IListMenu>this.activeMenu;

            if (!menu) {
                return;
            }

            if (menu.selectedIndex) {
                this.shiftSelectedIndex(menu.name, 0, 1);
            }

            if (menu.onDown) {
                menu.onDown(this.GameStarter);
            }
        }

        /**
         * Reacts to a user event directing to the left.
         */
        registerLeft(): void {
            var menu: IListMenu = <IListMenu>this.activeMenu;

            if (!menu) {
                return;
            }

            if (menu.selectedIndex) {
                this.shiftSelectedIndex(menu.name, -1, 0);
            }

            if (menu.onLeft) {
                menu.onLeft(this.GameStarter);
            }
        }

        /**
         * Reacts to a user event from pressing a selection key.
         */
        registerA(): void {
            var menu: IMenu = this.activeMenu;

            if (!menu || menu.ignoreA) {
                return;
            }

            if (menu.callback) {
                menu.callback(menu.name);
            }
        }

        /**
         * Reacts to a user event from pressing a deselection key.
         */
        registerB(): void {
            var menu: IMenu = this.activeMenu;

            if (!menu) {
                return;
            }

            if (menu.progress && !menu.ignoreProgressB) {
                return this.registerA();
            }

            if (menu.ignoreB) {
                return;
            }

            if (menu.onBPress) {
                menu.onBPress(menu.name);
                return;
            }

            if (menu.keepOnBack) {
                this.setActiveMenu(menu.backMenu);
            } else {
                this.deleteMenu(menu.name);
            }
        }

        /**
         * Reacts to a user event from pressing a start key.
         */
        registerStart(): void {
            var menu: IListMenu = <IListMenu>this.activeMenu;

            if (!menu) {
                return;
            }

            if (menu.startMenu) {
                this.setActiveMenu(menu.startMenu);
            }
        }


        /* Utilities
        */

        /**
         * Adds a series of words to a menu.
         * 
         * @param name   The name of the menu.
         * @param words   Words to add to the menu, as String[]s and/or commands.
         * @param onCompletion   An optional event for when the words are added.
         */
        private addMenuText(name: string, words: (string[] | IMenuWordCommand)[], onCompletion?: (...args: any[]) => void): void {
            var menu: IMenu = this.getExistingMenu(name),
                x: number = this.GameStarter.getMidX(menu),
                y: number = menu.top + menu.textYOffset * this.GameStarter.unitsize;

            switch (menu.textStartingX) {
                case "right":
                    x += menu.textAreaWidth / 2;
                    break;

                case "center":
                    break;

                default:
                    x -= menu.textAreaWidth / 2;
            }

            menu.callback = this.continueMenu.bind(this);
            menu.textX = x;

            if (words.length) {
                this.addMenuWords(name, words, 0, x, y, onCompletion);
            } else {
                onCompletion();
            }
        }

        /**
         * Adds a word within a series of words to a menu, then adds the next word,
         * and so on. This is the real force behind addMenuDialog and addMenuText.
         * 
         * @param name   The name of the menu.
         * @param words   Words to add to the menu, as String[]s and/or commands.
         * @param i   The index of the current word to add.
         * @param x   The x-location to place the word at.
         * @param y   The y-location to place the word at.
         * @param onCompletion   An optional event for when the words are added.
         * @returns The generated Things from the word's characters.
         */
        private addMenuWords(
            name: string,
            words: (string[] | IMenuWordCommand)[],
            i: number,
            x: number,
            y: number,
            onCompletion?: (...args: any[]) => void): GameStartr.IThing[] {
            var menu: IMenu = this.getExistingMenu(name),
                textProperties: any = this.GameStarter.ObjectMaker.getPropertiesOf("Text"),
                command: IMenuWordCommandBase,
                word: string[],
                things: GameStartr.IThing[] = [],
                textWidth: number,
                textPaddingX: number,
                textPaddingY: number,
                textSpeed: number,
                textWidthMultiplier: number,
                character: IText,
                j: number;

            // Command objects must be parsed here in case they modify the x/y position
            if ((<IMenuWordCommand>words[i]).command) {
                command = <IMenuWordCommand>words[i];
                word = this.parseWordCommand(<IMenuWordCommand>command, menu);

                if ((<IMenuWordCommand>command).command === "position") {
                    x += (<IMenuWordPosition>command).x || 0;
                    y += (<IMenuWordPosition>command).y || 0;
                }
            } else {
                word = <string[]>words[i];
            }

            textSpeed = menu.textSpeed;
            textWidth = (menu.textWidth || textProperties.width) * this.GameStarter.unitsize;
            textPaddingX = (menu.textPaddingX || textProperties.paddingX) * this.GameStarter.unitsize;
            textPaddingY = (menu.textPaddingY || textProperties.paddingY) * this.GameStarter.unitsize;
            textWidthMultiplier = menu.textWidthMultiplier || 1;

            // For each character in the word, schedule it appearing in the menu
            for (j = 0; j < word.length; j += 1) {
                // For non-whitespace characters, add them and move to the right
                if (/\S/.test(word[j])) {
                    character = this.addMenuCharacter(name, word[j], x, y, j * textSpeed);
                    x += textWidthMultiplier * (character.width * this.GameStarter.unitsize + textPaddingX);
                    continue;
                }

                // Endlines skip a line; general whitespace moves to the right
                // (" " spaces at the start do not move to the right)
                if (word[j] === "\n") {
                    x = menu.textX;
                    y += textPaddingY;
                } else if (word[j] !== " " || x !== menu.textX) {
                    x += textWidth * textWidthMultiplier;
                }
            }

            // Only create a new progress object if one doesn't exist (slight performance boost)
            if (!menu.progress) {
                menu.progress = {};
            }

            // If this is the last word in the the line (words), mark progress as done
            if (i === words.length - 1) {
                menu.progress.complete = true;
                menu.progress.onCompletion = onCompletion;

                if (menu.finishAutomatically) {
                    this.GameStarter.TimeHandler.addEvent(
                        onCompletion,
                        (word.length + (menu.finishAutomaticSpeed || 1)) * textSpeed);
                }

                this.GameStarter.TimeHandler.addEvent(
                    function (): void {
                        menu.progress.working = false;
                    },
                    (j + 1) * textSpeed);

                return things;
            }

            // If the next word would pass the edge of the menu, move down a line
            if (x + this.computeFutureWordLength(words[i + 1], textWidth, textPaddingX) >= menu.right - menu.textXOffset) {
                x = menu.textX;
                y += textPaddingY;
            }

            // Mark the menu's progress as working and incomplete
            menu.progress.working = true;
            menu.progress.complete = false;
            menu.progress.onCompletion = onCompletion;
            (<IListMenu>menu).progress.words = words;
            (<IListMenu>menu).progress.i = i + 1;
            (<IListMenu>menu).progress.x = x;
            (<IListMenu>menu).progress.y = y - textPaddingY;

            // If the bottom of the menu has been reached, pause the progress
            if (y >= menu.bottom - (menu.textYOffset - 1) * this.GameStarter.unitsize) {
                this.GameStarter.TimeHandler.addEvent(
                    function (): void {
                        menu.progress.working = false;
                    },
                    (j + 1) * textSpeed);

                return things;
            }

            if (textSpeed) {
                this.GameStarter.TimeHandler.addEvent(
                    (): void => {
                        this.addMenuWords(name, words, i + 1, x, y, onCompletion);
                    },
                    (j + 1) * textSpeed);
            } else {
                this.addMenuWords(name, words, i + 1, x, y, onCompletion);
            }

            return things;
        }

        /**
         * Places and positions a Thing within a menu basd on its size and position schemas.
         * 
         * @param thing   The Thing to place and position.
         * @param size   An optional description of the Thing's size.
         * @param position   An optional description of the Thing's position.
         * @param skipAdd   Whether to skip calling this.GameStarter.addThing on the Thing.
         */
        private placeMenuThing(
            menu: IMenu,
            thing: GameStartr.IThing,
            size: IMenuSchemaSize = {},
            position: IMenuSchemaPosition = {},
            skipAdd?: boolean): void {
            var offset: IMenuSchemaPositionOffset = position.offset || {};

            if (size.width) {
                this.GameStarter.setWidth(thing, size.width);
            } else if (position.horizontal === "stretch") {
                this.GameStarter.setLeft(thing, 0);
                this.GameStarter.setWidth(thing, menu.width - (offset.left || 0) - (offset.right || 0));
            }

            if (size.height) {
                this.GameStarter.setHeight(thing, size.height);
            } else if (position.vertical === "stretch") {
                this.GameStarter.setTop(thing, 0);
                this.GameStarter.setHeight(thing, menu.height - (offset.top || 0) - (offset.bottom || 0));
            }

            switch (position.horizontal) {
                case "center":
                    this.GameStarter.setMidXObj(thing, menu);
                    break;
                case "right":
                    this.GameStarter.setRight(thing, menu.right);
                    break;
                default:
                    this.GameStarter.setLeft(thing, menu.left);
                    break;
            }

            switch (position.vertical) {
                case "center":
                    this.GameStarter.setMidYObj(thing, menu);
                    break;
                case "bottom":
                    this.GameStarter.setBottom(thing, menu.bottom);
                    break;
                default:
                    this.GameStarter.setTop(thing, menu.top);
                    break;
            }

            if (offset.top) {
                this.GameStarter.shiftVert(thing, position.offset.top * this.GameStarter.unitsize);
            }

            if (offset.left) {
                this.GameStarter.shiftHoriz(thing, position.offset.left * this.GameStarter.unitsize);
            }

            if (!skipAdd) {
                this.GameStarter.addThing(thing, thing.left, thing.top);
            }
        }

        /**
         * Adds a single character as an GameStartr.IThing to a menu, potentially with a time delay.
         * 
         * @param name   The name of the menu.
         * @param character   The character to add.
         * @param x   The x-position of the character.
         * @param y   The y-position of the character.
         * @param delay   Optionally, how long to delay adding using TimeHandlr.
         * @returns The character's new Thing representation.
         */
        private addMenuCharacter(name: string, character: string, x: number, y: number, delay?: number): IText {
            var menu: IMenu = this.getExistingMenu(name),
                textProperties: any = this.GameStarter.ObjectMaker.getPropertiesOf("Text"),
                textPaddingY: number = (menu.textPaddingY || textProperties.paddingY) * this.GameStarter.unitsize,
                title: string = "Char" + this.getCharacterEquivalent(character),
                thing: IText = this.GameStarter.ObjectMaker.make(title, {
                    "textPaddingY": textPaddingY
                });

            menu.children.push(thing);

            if (delay) {
                this.GameStarter.TimeHandler.addEvent(
                    (): void => {
                        this.GameStarter.addThing(thing, x, y);
                    },
                    delay);
            } else {
                this.GameStarter.addThing(thing, x, y);
            }

            return thing;
        }

        /**
         * Scrolls a menu's character up once. If it's above the menu's area, it's deleted.
         * 
         * @param character   The Thing to scroll up.
         * @param menu 
         * @returns Whether the character was deleted.
         */
        private scrollCharacterUp(character: GameStartr.IThing, menu: IMenu): boolean {
            this.GameStarter.shiftVert(character, -this.GameStarter.unitsize);

            if (character.top < menu.top + (menu.textYOffset - 1) * this.GameStarter.unitsize) {
                this.GameStarter.killNormal(character);
                return true;
            }

            return false;
        }

        /**
         * Deletes all children of a menu.
         * 
         * @param name   The name of the menu.
         */
        private deleteMenuChildren(name: string): void {
            var menu: IMenu = this.menus[name];

            if (menu && menu.children) {
                menu.children.forEach((child: IMenu) => this.deleteMenuChild(child));
            }
        }

        /**
         * Deletes the child of a menu and any of its children.
         * 
         * @param child   A menu child to delete.
         */
        private deleteMenuChild(child: IMenu): void {
            if (this.activeMenu === child) {
                if (child.backMenu) {
                    this.setActiveMenu(child.backMenu);
                } else {
                    this.activeMenu = undefined;
                }
            }

            if (child.killOnB) {
                child.killOnB.forEach(this.deleteMenu.bind(this));
            }

            if (child.name) {
                delete this.menus[child.name];
            }

            this.GameStarter.killNormal(child);
            this.deleteMenuChildren(name);

            if (child.onMenuDelete) {
                child.onMenuDelete.call(this.GameStarter);
            }

            if (child.children) {
                child.children.forEach(this.deleteMenuChild.bind(this));
            }
        }


        /* List utilities
        */

        /**
         * Un-hides a list menu's arrow Thing.
         * 
         * @param name   The name of the menu.
         */
        private activateMenuList(name: string): void {
            var menu: IListMenu = <IListMenu>this.menus[name];

            if (menu && menu.arrow) {
                menu.arrow.hidden = false;
            }
        }

        /**
         * Hides a list menu's arrow Thing.
         * 
         * @param name   The name of the menu.
         */
        private deactivateMenuList(name: string): void {
            var menu: IListMenu = <IListMenu>this.menus[name];

            if (menu && menu.arrow) {
                menu.arrow.hidden = true;
            }
        }

        /**
         * Runs the callback for a menu's selected list option.
         * 
         * @param name   The name of the menu.
         */
        private triggerMenuListOption(name: string): void {
            var selected: IGridCell = this.getMenuSelectedOption(name);

            if (selected.callback) {
                selected.callback.call(this, name);
            }
        }

        /**
         * Determines how many scrolling items are able to fit within a list menu, as 
         * the index of the first bottom not within the menu.
         * 
         * @param menu   The list menu.
         * @returns The number of scrolling items, or Infinity if they all fit.
         */
        private computeMenuScrollingItems(menu: IListMenu): number {
            var bottom: number = menu.bottom
                - (menu.textPaddingY * this.GameStarter.unitsize || 0)
                - (menu.textYOffset * this.GameStarter.unitsize || 0),
                i: number;

            for (i = 0; i < menu.gridRows; i += 1) {
                if (menu.grid[0][i].y >= bottom) {
                    return i;
                }
            }

            return Infinity;
        }

        /**
         * Scrolls a list menu's Things vertically.
         * 
         * @param name   The name of the menu.
         * @param dy   How far along the list menu's grid to scroll.
         * @param textPaddingY   How much text is padded, to compute scrolling with dy.
         */
        private scrollListThings(name: string, dy: number, textPaddingY: number): void {
            var menu: IListMenu = <IListMenu>this.getExistingMenu(name),
                scrollingOld: number = menu.selectedIndex[1] - dy,
                offset: number = -dy * textPaddingY,
                option: IGridCell,
                optionChild: any,
                i: number,
                j: number;

            if (dy > 0) {
                if (scrollingOld - menu.scrollingVisualOffset < menu.scrollingItems - 1) {
                    return;
                }
            } else if (scrollingOld - menu.scrollingVisualOffset > 0) {
                return;
            }

            menu.scrollingVisualOffset += dy;

            for (i = 0; i < menu.optionChildren.length; i += 1) {
                option = menu.options[i];
                optionChild = menu.optionChildren[i];

                option.y += offset;

                for (j = 0; j < optionChild.things.length; j += 1) {
                    this.GameStarter.shiftVert(optionChild.things[j], offset);
                    if (
                        i < menu.scrollingVisualOffset
                        || i >= menu.scrollingItems + menu.scrollingVisualOffset
                    ) {
                        optionChild.things[j].hidden = true;
                    } else {
                        optionChild.things[j].hidden = false;
                    }
                }
            }
        }


        /* Text parsing
        */

        /**
         * @param character   A String to retrieve an equivalent title of.
         * @returns The character's title from this.aliases if it exists, or the
         *          character itself otherwise.
         */
        private getCharacterEquivalent(character: string): string {
            if (this.aliases.hasOwnProperty(character)) {
                return this.aliases[character];
            }

            return character;
        }

        /**
         * @param dialogRaw   Raw dialog of any type.
         * @returns The dialog parsed into lines of words.
         */
        private parseRawDialog(dialogRaw: IMenuDialogRaw): (string[] | IMenuWordCommand)[][] {
            // A raw String becomes a single line of dialog
            if (dialogRaw.constructor === String) {
                return [this.parseRawDialogString(<string>dialogRaw)];
            }

            var output: (string[] | IMenuWordCommand)[][] = [],
                component: any,
                i: number;

            for (i = 0; i < dialogRaw.length; i += 1) {
                component = dialogRaw[i];

                if (component.constructor === String) {
                    output.push(this.parseRawDialogString(<string>component));
                } else {
                    output.push(this.parseRawDialogStrings(<string[]>component));
                }
            }

            return output;
        }

        /**
         * @param dialogRaw   A raw String or set of Strings.
         * @returns The raw dialog as lines of words.
         */
        private parseRawDialogString(dialogRaw: string | string[]): string[][] {
            var characters: string[] = this.filterWord(dialogRaw),
                words: string[][] = [],
                word: string[],
                currentlyWhitespace: boolean = undefined,
                i: number;

            word = [];

            // For each character to be added...
            for (i = 0; i < characters.length; i += 1) {
                // If it matches what's currently being added (whitespace or not), keep going
                if (currentlyWhitespace) {
                    if (/\s/.test(characters[i])) {
                        word.push(characters[i]);
                        continue;
                    }
                } else {
                    if (/\S/.test(characters[i])) {
                        word.push(characters[i]);
                        continue;
                    }
                }

                // Since it doesn't match, start a new word
                currentlyWhitespace = /\s/.test(characters[i]);
                words.push(word);
                word = [characters[i]];
            }

            // Any extra characters should be added as well
            if (word.length > 0) {
                words.push(word);
            }

            return words;
        }

        /**
         * @param words   Any number of raw dialog words.
         * @returns The words filtered using this.parseRawDialogString.
         */
        private parseRawDialogStrings(words: string[]): string[][] {
            var output: string[][] = [],
                i: number;

            for (i = 0; i < words.length; i += 1) {
                output.push(...this.parseRawDialogString(words[i]));
            }

            return output;
        }

        /**
         * @param wordRaw   A word that may need to have replacements applied.
         * @returns The same word as an Array of characters, and with replacements applied.
         */
        private filterWord(wordRaw: string | string[]): string[] {
            if (wordRaw.constructor === Array) {
                return <string[]>wordRaw;
            }

            var word: string = <string>wordRaw,
                output: string[] = [],
                start: number = 0,
                end: number,
                inside: string | string[];

            start = word.indexOf("%%%%%%%", start);
            end = word.indexOf("%%%%%%%", start + 1);

            if (start !== -1 && end !== -1) {
                inside = this.getReplacement(word.substring(start + "%%%%%%%".length, end));
                if (inside.constructor === Number) {
                    inside = inside.toString().split("");
                } else if (inside.constructor === String) {
                    inside = (<string>inside).split("");
                }

                output.push(...word.substring(0, start).split(""));
                output.push(...(<string[]>inside));
                output.push(...this.filterWord(word.substring(end + "%%%%%%%".length)));

                return output;
            }

            return word.split("");
        }

        /**
         * Filters all String words in a menu's text using this.filterWord.
         * 
         * @param words   The words to filter, as Strings or command Objects.
         * @returns The words, with all Strings filtered.
         */
        private filterMenuWords(words: (string | IMenuWordCommand)[]): (string[] | IMenuWordCommand)[] {
            var output: (string[] | IMenuWordCommand)[] = [],
                i: number;

            for (i = 0; i < words.length; i += 1) {
                if (words[i].constructor === String) {
                    output.push(this.filterWord(<string>words[i]));
                } else {
                    output.push(<IMenuWordCommand>words[i]);
                }
            }

            return output;
        }

        /**
         * @param textRaw   Text that, if String(s), should be filtered using this.filterWord.
         * @returns The words, filtered.
         */
        private filterText(textRaw: IMenuDialogRaw): string[][] {
            if (textRaw.constructor === Array) {
                if (textRaw.length === 0) {
                    return [];
                }

                if (textRaw[0].constructor === String) {
                    return [<string[]>textRaw];
                }

                return <string[][]>textRaw;
            }

            var characters: string[] = [],
                total: string = <string>textRaw,
                component: string = "",
                i: number;

            for (i = 0; i < total.length; i += 1) {
                if (/\s/.test(total[i])) {
                    if (component.length > 0) {
                        characters.push(...this.filterWord(component));
                        component = "";
                    }

                    characters.push(total[i]);
                    continue;
                }

                component += total[i];
            }

            if (component.length > 0) {
                characters.push(...this.filterWord(component));
            }

            return [characters];
        }

        /**
         * Converts a word command into its equivalent word text.
         * 
         * @param wordCommand   The word command.
         * @param menu   The menu containing the word command.
         * @returns The equivalent word text for the command.
         */
        private parseWordCommand(wordCommand: IMenuWordCommand, menu?: IMenu): string[] {
            // If no menu is provided, this is from a simulation; pretend there is a menu
            if (!menu) {
                menu = <any>{};
            }

            switch (wordCommand.command) {
                case "attribute":
                    menu[wordCommand.attribute + "Old"] = menu[wordCommand.attribute];
                    menu[wordCommand.attribute] = wordCommand.value;
                    if (wordCommand.applyUnitsize) {
                        menu[wordCommand.attribute] *= this.GameStarter.unitsize;
                    }
                    break;

                case "attributeReset":
                    menu[wordCommand.attribute] = menu[wordCommand.attribute + "Old"];
                    break;

                case "padLeft":
                    return this.parseWordCommandPadLeft(<IMenuWordPadLeftCommand>wordCommand);

                // Position is handled directly in addMenuWord
                case "position":
                    break;

                default:
                    throw new Error("Unknown word command: " + (<any>wordCommand).command);
            }

            return wordCommand.word.split("");
        }

        /**
         * Converts a word command to pad text from the left.
         * 
         * @param wordCommand   The word command.
         * @returns   The word command's parsed text.
         */
        private parseWordCommandPadLeft(wordCommand: IMenuWordPadLeftCommand): string[] {
            var filtered: string[] = this.filterWord(wordCommand.word),
                length: number;

            // Length may be a String (for its length) or a direct number
            switch ((<any>wordCommand.length).constructor) {
                case String:
                    length = this.filterText(<string>wordCommand.length)[0].length;
                    break;

                case Number:
                    length = <number>wordCommand.length;
                    break;

                default:
                    throw new Error("Unknown padLeft command: " + wordCommand);
            }

            // Right-aligned commands reduce the amount of spacing by the length of the word
            if (wordCommand.alignRight) {
                length = Math.max(0, length - filtered.length);
            }

            // Tabs are considered to be a single space, so they're added to the left
            filtered.unshift.apply(filtered, this.stringOf("\t", length).split(""));

            return filtered;
        }

        /**
         * Retrieves the value of a text replacement of the given key.
         * 
         * @param key   The key of the text replacement to retrieve.
         * @returns The value of the text replacement, if it exists.
         */
        private getReplacement(key: string): string[] {
            var replacement: string[] | IReplacerFunction = this.replacements[key];

            if (typeof replacement === "undefined") {
                return [""];
            } else if (typeof replacement === "function") {
                return (<IReplacerFunction>replacement).call(this, this.GameStarter);
            } else {
                return <string[]>replacement;
            }
        }

        /**
         * Creates a new String equivalent to an old String repeated any number of
         * times. If times is 0, a blank String is returned.
         * 
         * @param string   The characters to repeat.
         * @param times   How many times to repeat (by default, 1).
         * @returns The original string, repeated.
         */
        private stringOf(string: string, times: number = 1): string {
            return (times === 0) ? "" : new Array(1 + (times)).join(string);
        }

        /**
         * Predicts how wide a word's area will be when displayed as dialog.
         * 
         * @param wordRaw   The word that will be displayed.
         * @param textWidth   How wide each character should be.
         * @param textPaddingX   How much space between each character.
         * @returns The total predicted width of the word's area.
         * @remarks This ignores commands under the assumption they shouldn't be
         *          used in dialogs that react to box size. This may be wrong.
         */
        private computeFutureWordLength(wordRaw: string[] | IMenuWordCommand, textWidth: number, textPaddingX: number): number {
            var total: number = 0,
                word: string[],
                i: number;

            if (wordRaw.constructor === Array) {
                word = <string[]>wordRaw;
            } else {
                word = this.parseWordCommand(<IMenuWordCommand>wordRaw);
            }

            for (i = 0; i < word.length; i += 1) {
                if (/\s/.test(word[i])) {
                    total += textWidth + textPaddingX;
                } else {
                    total += this.computeFutureLetterLength(word[i]) + textPaddingX;
                }
            }

            return total;
        }

        /**
         * Predicts how wide a letter will be, based on its equivalent Thing's width.
         * 
         * @param letter   The name of the letter to create.
         * @returns How wide the letter will be on the screen.
         */
        private computeFutureLetterLength(letter: string): number {
            var title: string = "Char" + this.getCharacterEquivalent(letter),
                properties: any = this.GameStarter.ObjectMaker.getFullPropertiesOf(title);

            return properties.width * this.GameStarter.unitsize;
        }
    }
}
