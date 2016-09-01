/// <reference path="../typings/changelinr.d.ts" />
/// <reference path="../typings/stringfilr.d.ts" />
/// <reference path="../typings/mapscreenr.d.ts" />
/// <reference path="../typings/itemsholdr.d.ts" />
/// <reference path="../typings/devicelayr.d.ts" />
/// <reference path="../typings/eightbittr.d.ts" />
/// <reference path="../typings/audioplayr.d.ts" />
/// <reference path="../typings/fpsanalyzr.d.ts" />
/// <reference path="../typings/gamesrunnr.d.ts" />
/// <reference path="../typings/groupholdr.d.ts" />
/// <reference path="../typings/InputWritr.d.ts" />
/// <reference path="../typings/mapscreatr.d.ts" />
/// <reference path="../typings/mathdecidr.d.ts" />
/// <reference path="../typings/modattachr.d.ts" />
/// <reference path="../typings/numbermakr.d.ts" />
/// <reference path="../typings/ObjectMakr.d.ts" />
/// <reference path="../typings/quadskeepr.d.ts" />
/// <reference path="../typings/areaspawnr.d.ts" />
/// <reference path="../typings/pixelrendr.d.ts" />
/// <reference path="../typings/pixeldrawr.d.ts" />
/// <reference path="../typings/sceneplayr.d.ts" />
/// <reference path="../typings/thinghittr.d.ts" />
/// <reference path="../typings/timehandlr.d.ts" />
/// <reference path="../typings/touchpassr.d.ts" />
/// <reference path="../typings/worldseedr.d.ts" />
/// <reference path="../typings/gamestartr.d.ts" />
declare namespace MenuGraphr {
    /**
     * General attributes for both Menus and MenuSchemas.
     */
    interface IMenuBase {
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
        onDown?: (GameStartr: GameStartr.GameStartr) => void;
        /**
         * A callback for when this becomes inactive.
         */
        onInactive?: (name: string) => void;
        /**
         * A callback for a user event directing to the left.
         */
        onLeft?: (GameStartr: GameStartr.GameStartr) => void;
        /**
         * A callback for when this is deleted.
         */
        onMenuDelete?: (GameStartr: GameStartr.GameStartr) => void;
        /**
         * A callback for a user event directing to the right.
         */
        onRight?: (GameStartr: GameStartr.GameStartr) => void;
        /**
         * A callback for a user event directing up.
         */
        onUp?: (GameStartr: GameStartr.GameStartr) => void;
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
    interface IMenusContainer {
        [i: string]: IMenu;
    }
    /**
     * A Menu Thing, with any number of children.
     */
    interface IMenu extends GameStartr.IThing, IMenuSchema {
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
    interface IText extends GameStartr.IThing {
        /**
         * How much vertical padding this Thing requires.
         */
        paddingY: number;
    }
    /**
     * A summary of a menu's progress through its dialog.
     */
    interface IMenuProgress {
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
    interface IMenuSchemas {
        [i: string]: IMenuSchema;
    }
    /**
     * A schema to specify creating a menu.
     */
    interface IMenuSchema extends IMenuBase {
        /**
         * How the menu should be positioned within its container.
         */
        position?: IMenuSchemaPosition;
    }
    /**
     * A schema to specify creating a list menu.
     */
    interface IListMenuSchema extends IMenuSchema {
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
    interface IMenuSchemaSize {
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
    interface IMenuSchemaPosition {
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
    interface IMenuSchemaPositionOffset {
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
    interface IMenuChildSchema extends IMenuSchema {
        /**
         * What type of child this is.
         */
        type: "menu" | "text" | "thing";
    }
    /**
     * A description of a menu to create as a menu child.
     */
    interface IMenuChildMenuSchema extends IMenuChildSchema {
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
    interface IMenuWordSchema extends IMenuChildSchema {
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
    interface IMenuThingSchema extends IMenuChildSchema {
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
    type IMenuDialogRaw = string | (string | string[] | (string | string[])[] | IMenuWordCommandBase)[];
    /**
     * A general word and/or command to use within a text dialog.
     */
    interface IMenuWordCommandBase {
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
    interface IMenuWordCommand extends IMenuWordCommandBase {
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
    interface IMenuWordPadLeftCommand extends IMenuWordCommandBase {
        /**
         * Whether the amount of padding should be reduced by the word length.
         */
        alignRight?: boolean;
    }
    /**
     * A word command to reset an attribute after an attribute change command.
     */
    interface IMenuWordReset extends IMenuWordCommandBase {
        /**
         * The name of the attribute to reset.
         */
        attribute: string;
    }
    /**
     * A word command to shift the position to add subsequent words.
     */
    interface IMenuWordPosition extends IMenuWordCommandBase {
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
    interface IListMenuBase {
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
    interface IListMenu extends IListMenuBase, IListMenuSchema, IMenu {
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
    interface IGridCell {
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
    interface IListMenuOptions {
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
    interface IListMenuProgress extends IMenuProgress {
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
     * A list of sounds that should be played for certain menu actions.
     */
    interface ISoundNames {
        /**
         * The sound to play, if any, when interacting with a menu (usually off the A
         * or B buttons being registered).
         */
        onInteraction?: string;
    }
    /**
     * Alternate Thing titles for characters, such as " " to "space".
     */
    interface IAliases {
        [i: string]: string;
    }
    /**
     * Programmatic replacements for deliniated words.
     */
    interface IReplacements {
        [i: string]: string[] | IReplacerFunction;
    }
    /**
     * A Function to generate a word replacement based on the GameStarter's state.
     */
    interface IReplacerFunction {
        (GameStarter: GameStartr.GameStartr): string[];
    }
    /**
     * Settings to initialize a new IMenuGraphr.
     */
    interface IMenuGraphrSettings {
        /**
         * The parent GameStartr.GameStartr managing Things.
         */
        GameStarter: GameStartr.GameStartr;
        /**
         * Known menu schemas, keyed by name.
         */
        schemas?: IMenuSchemas;
        /**
         * Alternate Thing titles for charactes, such as " " for "space".
         */
        aliases?: IAliases;
        /**
         * A list of sounds that should be played for certain menu actions.
         */
        sounds?: ISoundNames;
        /**
         * Programmatic replacements for deliniated words.
         */
        replacements?: IReplacements;
        /**
         * The separator for words to replace using replacements.
         */
        replacerKey?: string;
        /**
         * A scope to call text modifiers in, if not this IMenuGraphr.
         */
        modifierScope?: any;
    }
    /**
     * A menu management system. Menus can have dialog-style text, scrollable
     * and unscrollable grids, and children menus or decorations added.
     */
    interface IMenuGraphr {
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
        registerDirection(direction: number): void;
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
    /**
     * Cardinal directions as Numbers.
     */
    enum Direction {
        Top = 0,
        Right = 1,
        Bottom = 2,
        Left = 3,
    }
    /**
     * A menu management system for GameStartr. Menus can have dialog-style text, scrollable
     * and unscrollable grids, and children menus or decorations added.
     */
    class MenuGraphr implements IMenuGraphr {
        /**
         * The parent IGameStartr managing Things.
         */
        private GameStarter;
        /**
         * All available menus, keyed by name.
         */
        private menus;
        /**
         * The currently "active" (user-selected) menu.
         */
        private activeMenu;
        /**
         * Known menu schemas, keyed by name.
         */
        private schemas;
        /**
         * A list of sounds that should be played for certain menu actions
         */
        private sounds;
        /**
         * Alternate Thing titles for charactes, such as " " for "space".
         */
        private aliases;
        /**
         * Programmatic replacements for deliniated words.
         */
        private replacements;
        /**
         * The separator for words to replace using replacements.
         */
        private replacerKey;
        /**
         * A scope to call text modifiers in, if not this.
         */
        private modifierScope;
        /**
         * Initializes a new instance of the MenuGraphr class.
         *
         * @param settings   Settings to be used for initialization.
         */
        constructor(settings: IMenuGraphrSettings);
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
         * @param name   The name of the menu to set as active.
         */
        setActiveMenu(name: string): void;
        /**
         * Reacts to a user event directing in the given direction.
         *
         * @param direction   The direction of the interaction.
         */
        registerDirection(direction: number): void;
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
        /**
         * Adds a series of words to a menu.
         *
         * @param name   The name of the menu.
         * @param words   Words to add to the menu, as String[]s and/or commands.
         * @param onCompletion   An optional event for when the words are added.
         */
        private addMenuText(name, words, onCompletion?);
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
        private addMenuWords(name, words, i, x, y, onCompletion?);
        /**
         * Places and positions a Thing within a menu basd on its size and position schemas.
         *
         * @param thing   The Thing to place and position.
         * @param size   An optional description of the Thing's size.
         * @param position   An optional description of the Thing's position.
         * @param skipAdd   Whether to skip calling this.GameStarter.things.add on the Thing.
         */
        private placeMenuThing(menu, thing, size?, position?, skipAdd?);
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
        private addMenuCharacter(name, character, x, y, delay?);
        /**
         * Scrolls a menu's character up once. If it's above the menu's area, it's deleted.
         *
         * @param character   The Thing to scroll up.
         * @param menu
         * @returns Whether the character was deleted.
         */
        private scrollCharacterUp(character, menu);
        /**
         * Deletes all children of a menu.
         *
         * @param name   The name of the menu.
         */
        private deleteMenuChildren(name);
        /**
         * Deletes the child of a menu and any of its children.
         *
         * @param child   A menu child to delete.
         */
        private deleteMenuChild(child);
        /**
         * Un-hides a list menu's arrow Thing.
         *
         * @param name   The name of the menu.
         */
        private activateMenuList(name);
        /**
         * Hides a list menu's arrow Thing.
         *
         * @param name   The name of the menu.
         */
        private deactivateMenuList(name);
        /**
         * Runs the callback for a menu's selected list option.
         *
         * @param name   The name of the menu.
         */
        private triggerMenuListOption(name);
        /**
         * Determines how many scrolling items are able to fit within a list menu, as
         * the index of the first bottom not within the menu.
         *
         * @param menu   The list menu.
         * @returns The number of scrolling items, or Infinity if they all fit.
         */
        private computeMenuScrollingItems(menu);
        /**
         * Scrolls a list menu's Things vertically.
         *
         * @param name   The name of the menu.
         * @param dy   How far along the list menu's grid to scroll.
         * @param textPaddingY   How much text is padded, to compute scrolling with dy.
         */
        private scrollListThings(name, dy, textPaddingY);
        /**
         * @param character   A String to retrieve an equivalent title of.
         * @returns The character's title from this.aliases if it exists, or the
         *          character itself otherwise.
         */
        private getCharacterEquivalent(character);
        /**
         * @param dialogRaw   Raw dialog of any type.
         * @returns The dialog parsed into lines of words.
         */
        private parseRawDialog(dialogRaw);
        /**
         * @param dialogRaw   A raw String or set of Strings.
         * @returns The raw dialog as lines of words.
         */
        private parseRawDialogString(dialogRaw);
        /**
         * @param words   Any number of raw dialog words.
         * @returns The words filtered using this.parseRawDialogString.
         */
        private parseRawDialogStrings(words);
        /**
         * @param wordRaw   A word that may need to have replacements applied.
         * @returns The same word as an Array of characters, and with replacements applied.
         */
        private filterWord(wordRaw);
        /**
         * Filters all String words in a menu's text using this.filterWord.
         *
         * @param words   The words to filter, as Strings or command Objects.
         * @returns The words, with all Strings filtered.
         */
        private filterMenuWords(words);
        /**
         * @param textRaw   Text that, if String(s), should be filtered using this.filterWord.
         * @returns The words, filtered.
         */
        private filterText(textRaw);
        /**
         * Converts a word command into its equivalent word text.
         *
         * @param wordCommand   The word command.
         * @param menu   The menu containing the word command.
         * @returns The equivalent word text for the command.
         */
        private parseWordCommand(wordCommand, menu?);
        /**
         * Converts a word command to pad text from the left.
         *
         * @param wordCommand   The word command.
         * @returns   The word command's parsed text.
         */
        private parseWordCommandPadLeft(wordCommand);
        /**
         * Retrieves the value of a text replacement of the given key.
         *
         * @param key   The key of the text replacement to retrieve.
         * @returns The value of the text replacement, if it exists.
         */
        private getReplacement(key);
        /**
         * Creates a new String equivalent to an old String repeated any number of
         * times. If times is 0, a blank String is returned.
         *
         * @param text   The characters to repeat.
         * @param times   How many times to repeat (by default, 1).
         * @returns The original string, repeated.
         */
        private stringOf(text, times?);
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
        private computeFutureWordLength(wordRaw, textWidth, textPaddingX);
        /**
         * Predicts how wide a letter will be, based on its equivalent Thing's width.
         *
         * @param letter   The name of the letter to create.
         * @returns How wide the letter will be on the screen.
         */
        private computeFutureLetterLength(letter);
    }
}
declare var module: any;
