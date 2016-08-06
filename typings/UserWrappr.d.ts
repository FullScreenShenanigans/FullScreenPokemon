/// <reference path="../typings/AreaSpawnr.d.ts" />
/// <reference path="../typings/DeviceLayr.d.ts" />
/// <reference path="../typings/FPSAnalyzr.d.ts" />
/// <reference path="../typings/GamesRunnr.d.ts" />
/// <reference path="../typings/GroupHoldr.d.ts" />
/// <reference path="../typings/InputWritr.d.ts" />
/// <reference path="../typings/ItemsHoldr.d.ts" />
/// <reference path="../typings/LevelEditr.d.ts" />
/// <reference path="../typings/MapsCreatr.d.ts" />
/// <reference path="../typings/MapScreenr.d.ts" />
/// <reference path="../typings/ObjectMakr.d.ts" />
/// <reference path="../typings/PixelDrawr.d.ts" />
/// <reference path="../typings/PixelRendr.d.ts" />
/// <reference path="../typings/QuadsKeepr.d.ts" />
/// <reference path="../typings/StringFilr.d.ts" />
/// <reference path="../typings/TimeHandlr.d.ts" />
declare namespace UserWrappr.Generators {
    /**
     * Base class for options generators. These all store a UserWrapper and
     * its GameStartr, along with a generate Function
     */
    abstract class OptionsGenerator implements IOptionsGenerator {
        /**
         * The container UserWrappr using this generator.
         */
        protected UserWrapper: IUserWrappr;
        /**
         * The container UserWrappr's GameStartr instance.
         */
        protected GameStarter: IGameStartr;
        /**
         * Initializes a new instance of the OptionsGenerator class.
         *
         * @param UserWrappr   The container UserWrappr using this generator.
         */
        constructor(UserWrapper: IUserWrappr);
        /**
         * Generates a control element based on the provided schema.
         *
         * @param schema   A description of an element to create.
         * @returns An HTML element representing the schema.
         */
        abstract generate(schema: ISchema): HTMLDivElement;
        /**
         * Recursively searches for an element with the "control" class
         * that's a parent of the given element.
         *
         * @param element   An element to start searching on.
         * @returns The closest node with className "control" to the given element
         *          in its ancestry tree.
         */
        protected getParentControlElement(element: HTMLElement): HTMLElement;
    }
    /**
     * Description of a user control for a listing of buttons.
     */
    interface IOptionsButtonsSchema extends ISchema {
        /**
         * Descriptions of the options to be displayed as buttons.
         */
        options: IOptionSource | IOptionsButtonSchema[];
        /**
         * A general, default callback for when a button is clicked.
         */
        callback: (GameStarter: IGameStartr, ...args: any[]) => void;
        /**
         * A key to add to buttons when they're active.
         */
        keyActive?: string;
        /**
         * Whether buttons should be assumed to be inactive visually.
         */
        assumeInactive?: boolean;
    }
    /**
     * Description for a single button in a buttons schema.
     */
    interface IOptionsButtonSchema extends IOption {
        /**
         * A callback for when this specific button is pressed.
         */
        callback?: (GameStarter: IGameStartr, ...args: any[]) => void;
        /**
         * A source for the button's initial value.
         */
        source: IOptionSource;
        /**
         * Whether the button's value should be stored locally between sessions.
         */
        storeLocally?: boolean;
        /**
         * What type of button this is, as keyed in the generator.
         */
        type: string;
    }
    /**
     * A buttons generator for an options section that contains any number
     * of general buttons.
     */
    class ButtonsGenerator extends OptionsGenerator implements IOptionsGenerator {
        /**
         * Generates a control element with buttons described in the schema.
         *
         * @param schema   A description of the element to create.
         * @returns An HTML element representing the schema.
         */
        generate(schema: IOptionsButtonsSchema): HTMLDivElement;
        /**
         * Ensures a value exists in localStorage, and has the given settings. If
         * it doesn't have a value, the schema's callback is used to provide one.
         *
         * @param child   The value's representational HTML element.
         * @param details   Details for the button to be created.
         * @param schema   The overall schema for the button.
         */
        protected ensureLocalStorageButtonValue(child: HTMLDivElement, details: IOptionsButtonSchema, schema: IOptionsButtonsSchema): void;
        /**
         * Generates an onclick callback for a button.
         *
         * @param schema   The button's schema description.
         * @param element   The button's generated HTML element.
         * @returns An onclick callback for the button.
         */
        private generateOptionElementClick(schema, element);
    }
    /**
     * Description of a user control for a level editor.
     */
    interface IOptionsEditorSchema extends ISchema {
        /**
         * Map names the user may load into the editor.
         */
        maps: IOptionsMapGridSchema;
        /**
         * Loads a built-in map into the editor after the user has clicked a button.
         */
        callback: IMapSelectionCallback;
    }
    /**
     * Options generator for a LevelEditr dialog.
     */
    class LevelEditorGenerator extends OptionsGenerator implements IOptionsGenerator {
        /**
         * Generates a control for a level editor based on the provided schema.
         *
         * @param schema   The overall description of the editor control.
         * @returns An HTML element representing the schema.
         */
        generate(schema: IOptionsEditorSchema): HTMLDivElement;
        /**
         * Creates an HTML element that can be clicked or dragged on to upload a JSON file
         * into the level editor.
         *
         * @returns An element containing the uploader div.
         */
        protected createUploaderDiv(): HTMLDivElement;
        /**
         * Creates an HTML element that allows a user to choose between maps to load into
         * the level editor.
         *
         * @param schema   The overall description of the container user control.
         * @returns An element containing the map selector.
         */
        protected createMapSelectorDiv(schema: IOptionsEditorSchema): HTMLDivElement;
        /**
         * Handles a dragged file entering a map selector. Visual styles are updated.
         *
         * @param uploader   The element being dragged onto.
         * @param event   The event caused by the dragging.
         */
        protected handleFileDragEnter(uploader: HTMLDivElement, event: LevelEditr.IDataMouseEvent): void;
        /**
         * Handles a dragged file moving over a map selector.
         *
         * @param uploader   The element being dragged onto.
         * @param event   The event caused by the dragging.
         */
        protected handleFileDragOver(uploader: HTMLElement, event: MouseEvent): boolean;
        /**
         * Handles a dragged file leaving a map selector. Visual styles are updated.
         *
         * @param uploader   The element being dragged onto.
         * @param event   The event caused by the dragging.
         */
        protected handleFileDragLeave(uploader: HTMLElement, event: LevelEditr.IDataMouseEvent): void;
        /**
         * Handles a dragged file being dropped onto a map selector. The file is read, and
         * events attached to its progress.
         *
         * @param input   The HTMLInputElement triggering the file event.
         * @param uploader   The element being dragged onto.
         * @param event   The event caused by the dragging.
         */
        protected handleFileDrop(input: HTMLInputElement, uploader: HTMLDivElement, event: LevelEditr.IDataMouseEvent): void;
        /**
         * Handles a file upload reporting some amount of progress.
         *
         * @param file   The file being uploaded.
         * @param uploader   The element the file was being dragged onto.
         * @param event   The event caused by the progress.
         */
        protected handleFileUploadProgress(file: File, uploader: HTMLDivElement, event: LevelEditr.IDataProgressEvent): void;
        /**
         * Handles a file upload completing. The file's contents are loaded into
         * the level editor.
         *
         * @param file   The file being uploaded.
         * @param uploader   The element the file was being dragged onto.
         * @param event   The event caused by the upload completing.
         */
        protected handleFileUploadCompletion(file: File, uploader: HTMLDivElement, event: LevelEditr.IDataProgressEvent): void;
    }
    /**
     * Handler for a map being selected.
     *
     * @param GameStarter   The GameStarter whose level is being edited.
     * @param schema   The overall description of the editor control.
     * @param button   The button that was just clicked.
     * @param event   The event associated with the user clicking the button.
     */
    interface IMapSelectionCallback {
        (GameStarter: IGameStartr, schema: IOptionsMapGridSchema, button: HTMLElement, event: Event): void;
    }
    /**
     * Description of a user control for a map selector.
     */
    interface IOptionsMapGridSchema extends ISchema {
        /**
         * Handler for a map being selected.
         */
        callback: IMapSelectionCallback;
        /**
         * If there is a table of maps, the start and end x-values.
         */
        rangeX?: [number, number];
        /**
         * If there is a table of maps, the start and end y-values.
         */
        rangeY?: [number, number];
        /**
         * Extra options to be displayed.
         */
        extras?: IOptionsMapGridExtra[];
    }
    /**
     * An extra option to be displayed in a maps grid.
     */
    interface IOptionsMapGridExtra {
        /**
         * The visible label of the extra's button.
         */
        title: string;
        /**
         * Handler for when this extra's button is triggered.
         */
        callback: IMapSelectionCallback;
        /**
         * Descriptions of any extra elements to be displayed.
         */
        extraElements: IOptionsMapGridExtraElement[];
    }
    /**
     * A description of an extra element to place after a maps grid extra, to be piped
     * directly int IGameStartr::createElement.
     */
    interface IOptionsMapGridExtraElement {
        /**
         * The tag name of the element.
         */
        tag: string;
        /**
         * Options for the element, such as className or value.
         */
        options: any;
    }
    /**
     * Options generator for a grid of maps.
     */
    class MapsGridGenerator extends OptionsGenerator implements IOptionsGenerator {
        /**
         * Generates the HTML element for the maps.
         *
         * @param schema   The overall description of the editor control.
         * @returns An HTML element representing the schema.
         */
        generate(schema: IOptionsMapGridSchema): HTMLDivElement;
        /**
         * Generates a table of map selection buttons from x- and y- ranges.
         *
         * @param schema   The overall description of the editor control.
         * @returns An HTMLTableElement with a grid of map selection buttons.
         */
        generateRangedTable(schema: IOptionsMapGridSchema): HTMLTableElement;
        /**
         * Adds any specified extra elements to this control's element.
         *
         * @param output   The element created by this generator.
         * @param schema   The overall discription of the editor control.
         */
        appendExtras(output: HTMLDivElement, schema: IOptionsMapGridSchema): void;
    }
    /**
     * Description of a user control for a table of options.
     */
    interface IOptionsTableSchema extends ISchema {
        /**
         * Descriptions of action buttons that should be appended to the options.
         */
        actions?: IOptionsTableAction[];
        /**
         * Descriptions of the options to be displayed in the table.
         */
        options: IOptionsTableOption[];
    }
    /**
     * Description of an action button in the control.
     */
    interface IOptionsTableAction {
        /**
         * The button's label, displayed to the user.
         */
        title: string;
        /**
         * Callback for when the button is triggered.
         *
         * @param GameStarter   The GameStarter this option is controlling.
         */
        action: (GameStarter: IGameStartr) => void;
    }
    /**
     * Desription of an option to be displayed in a table control.
     */
    interface IOptionsTableOption extends IOption {
        /**
         * The key for the type of option, such as "Button".
         */
        type: string;
        /**
         * Whether the button's value should be stored locally between sessions.
         */
        storeLocally?: boolean;
    }
    /**
     * Description of an option with a boolean value.
     */
    interface IOptionsTableBooleanOption extends IOptionsTableOption {
        /**
         * Callback for when the value becomes false.
         *
         * @param GameStarter   The GameStarter this option is controlling.
         */
        disable: (GameStarter: IGameStartr) => void;
        /**
         * Callback for when the value becomes true.
         *
         * @param GameStarter   The GameStarter this option is controlling.
         */
        enable: (GameStarter: IGameStartr) => void;
        /**
         * A key to add to the button's className when the value is true.
         */
        keyActive?: string;
        /**
         * Whether the button's value is assumed to be false visually.
         */
        assumeInactive?: boolean;
    }
    /**
     * Description of an option for keyboard keys.
     */
    interface IOptionsTableKeysOption extends IOptionsTableOption {
        /**
         * Callback for when the value changes.
         *
         * @param GameStarter   The GameStarter this option is controlling.
         */
        callback: (GameStarter: IGameStartr) => void;
        /**
         * A source for the allowed keys in the option.
         *
         * @returns The allowed keys in the option.
         */
        source: (GameStarter: IGameStartr) => string[];
    }
    /**
     * Description of an option with a numeric value.
     */
    interface IOptionsTableNumberOption extends IOptionsTableOption {
        /**
         * A minimum value.
         */
        minimum?: number;
        /**
         * A maximum value.
         */
        maximum?: number;
        /**
         * Callback for when the value changes.
         *
         * @param GameStarter   The GameStarter this option is controlling.
         */
        update: (GameStarter: IGameStartr) => void;
    }
    /**
     * Description of an option with multiple preset values.
     */
    interface IOptionsTableSelectOption extends IOptionsTableOption {
        /**
         * A source for the allowed keys in the option.
         *
         * @param GameStarter   The GameStarter this option is controlling.
         * @returns The allowed keys in the option.
         */
        options: (GameStarter: IGameStartr) => string[];
        /**
         * A source for the initially selected value.
         *
         * @param GameStarter   The GameStarter this option is controlling.
         * @returns The allowed keys in the option.
         */
        source: (GameStarter: IGameStartr) => string;
        /**
         * Callback for when the value changes.
         *
         * @param GameStarter   The GameStarter this option is controlling.
         * @param value   A new value, if this is triggered via a code callback.
         */
        update: (GameStarter: IGameStartr, value?: any) => void;
    }
    /**
     * Description of an option for setting the GameStartr's screen size.
     */
    interface IOptionsTableScreenSizeOption extends IOptionsTableOption {
        /**
         * A source for names of the allowed screen sizes.
         *
         * @param GameStarter   The GameStarter this option is controlling.
         * @returns Names of the allowed screen sizes.
         */
        options: (GameStarter: IGameStartr) => string[];
        /**
         * A source for the initially selected value.
         *
         * @param GameStarter   The GameStarter this option is controlling.
         * @returns The allowed keys in the option.
         */
        source: (GameStarter: IGameStartr) => string;
        /**
         * Callback for when the value changes.
         *
         * @param GameStarter   The GameStarter this option is controlling.
         * @param value   The newly selected size information.
         */
        update: (GameStarter: IGameStartr, value: ISizeSummary) => void;
    }
    /**
     * Container of table option descriptions, keyed by name.
     */
    interface IOptionsTableTypes {
        [i: string]: (input: IInputElement | ISelectElement, details: IOptionsTableOption, schema: ISchema) => any;
    }
    /**
     * An options generator for a table of options. Each table contains a (left) label cell
     * and a (right) value cell with some sort of input.
     */
    class TableGenerator extends OptionsGenerator implements IOptionsGenerator {
        /**
         * Generators for the value cells within table rows.
         */
        protected static optionTypes: IOptionsTableTypes;
        /**
         * Generates a control element with tabular information based on the provided schema.
         *
         * @param schema   A description of the tabular data to represent.
         * @returns An HTML element representing the schema.
         */
        generate(schema: IOptionsTableSchema): HTMLDivElement;
        /**
         * Initializes an input for a boolean value.
         *
         * @param input   An input that will contain a boolean value.
         * @param details   Details for this individual value.
         * @param schema   Details for the overall table schema.
         * @returns An HTML element containing the input.
         */
        protected setBooleanInput(input: IInputElement, details: IOptionsTableBooleanOption, schema: ISchema): IInputElement;
        /**
         * Initializes an input for a keyboard key value.
         *
         * @param input   An input that will contain a keyboard key value.
         * @param details   Details for this individual value.
         * @param schema   Details for the overall table schema.
         * @returns An HTML element containing the input.
         */
        protected setKeyInput(input: IInputElement, details: IOptionsTableKeysOption, schema: ISchema): ISelectElement[];
        /**
         * Initializes an input for a numeric value.
         *
         * @param input   An input that will contain a numeric value.
         * @param details   Details for this individual value.
         * @param schema   Details for the overall table schema.
         * @returns An HTML element containing the input.
         */
        protected setNumberInput(input: IInputElement, details: IOptionsTableNumberOption, schema: ISchema): IInputElement;
        /**
         * Initializes an input for a value with multiple preset options.
         *
         * @param input   An input that will contain a value with multiple present options.
         * @param details   Details for this individual value.
         * @param schema   Details for the overall table schema.
         * @returns An HTML element containing the input.
         */
        protected setSelectInput(input: ISelectElement, details: IOptionsTableSelectOption, schema: ISchema): ISelectElement;
        /**
         * Initializes an input for setting the GameStartr's screen size.
         *
         * @param input   An input that will set a GameStartr's screen size.
         * @param details   Details for this individual value.
         * @param schema   Details for the overall table schema.
         * @returns An HTML element containing the input.
         */
        protected setScreenSizeInput(input: ISelectElement, details: IOptionsTableScreenSizeOption, schema: ISchema): ISelectElement;
        /**
         * Ensures an input's required local storage value is being stored,
         * and adds it to the internal GameStarter.ItemsHolder if not. If it
         * is, and the child's value isn't equal to it, the value is set.
         *
         * @param childRaw   An input or select element, or an Array thereof.
         * @param details   Details containing the title of the item and the
         *                  source Function to get its value.
         * @param schema   The container schema this child is within.
         */
        protected ensureLocalStorageInputValue(childRaw: IChoiceElement | IChoiceElement[], details: IOption, schema: ISchema): void;
        /**
         * Ensures a collection of items all exist in localStorage. If their values
         * don't exist, their schema's .callback is used to provide them.
         *
         * @param childRaw   An Array of input or select elements.
         * @param details   Details containing the title of the item and the source
         *                  Function to get its value.
         * @param schema   The container schema this child is within.
         */
        protected ensureLocalStorageValues(children: (IInputElement | ISelectElement)[], details: IOption, schema: ISchema): void;
        /**
         * Stores an element's value in the internal GameStarter.ItemsHolder,
         * if it has the "localStorageKey" attribute.
         *
         * @param {HTMLElement} child   An element with a value to store.
         * @param {Mixed} value   What value is to be stored under the key.
         */
        protected storeLocalStorageValue(child: IInputElement | ISelectElement, value: any): void;
    }
}
declare namespace UserWrappr {
    interface IHTMLElement extends HTMLElement {
        requestFullScreen: () => void;
        webkitRequestFullScreen: () => void;
        mozRequestFullScreen: () => void;
        msRequestFullscreen: () => void;
        webkitFullscreenElement: () => void;
        cancelFullScreen: () => void;
        webkitCancelFullScreen: () => void;
        mozCancelFullScreen: () => void;
        msCancelFullScreen: () => void;
    }
    interface IEvent {
        target: HTMLElement;
    }
    /**
     * The class of game being controlled by the UserWrappr. This will normally
     * be implemented by the GameStartr project itself.
     */
    interface IGameStartr {
        DeviceLayer: DeviceLayr.IDeviceLayr;
        GamesRunner: GamesRunnr.IGamesRunnr;
        ItemsHolder: ItemsHoldr.IItemsHoldr;
        InputWriter: InputWritr.IInputWritr;
        LevelEditor: LevelEditr.ILevelEditr;
        UserWrapper: IUserWrappr;
        container: HTMLElement;
        addPageStyles(styles: StyleSheet): void;
        gameStart(): void;
        createElement(tag: string, ...args: any[]): HTMLElement;
        createElement(tag: "div", ...args: any[]): HTMLDivElement;
        proliferate(recipient: any, donor: any, noOverride?: boolean): any;
    }
    /**
     * Custom settings for an individual IGameStartr instance, such as size info.
     */
    type IGameStartrCustoms = any;
    /**
     * Initializes a new instance of the IGameStartr interface.
     */
    interface IGameStartrConstructor {
        new (...args: any[]): IGameStartr;
    }
    /**
     * Generator for a user-facing HTML control.
     *
     * @param schema   A general description of the control to create.
     * @returns An HTML element as described by the schema.
     */
    interface IOptionsGenerator {
        generate: (schema: ISchema) => HTMLDivElement;
    }
    /**
     * Options generators, keyed by name.
     */
    interface IOptionsGenerators {
        [i: string]: IOptionsGenerator;
    }
    /**
     * How wide and tall an IUserWrappr's contained IGameStartr should be sized.
     */
    interface ISizeSummary {
        /**
         * How wide the contained IGameStartr should be, as a standard Number or Infinity.
         */
        width: number;
        /**
         * How tall the contained IGameStartr should be, as a standard Number or Infinity.
         */
        height: number;
        /**
         * Whether the contained IGameStartr should request full screen size.
         */
        full?: boolean;
        /**
         * What this size summary should be referred to, if not its key in the container.
         */
        name?: string;
    }
    /**
     * Size summaries keyed by name.
     */
    interface ISizeSummaries {
        [i: string]: ISizeSummary;
    }
    /**
     * Settings to initialize a new IUserWrappr.
     */
    interface IUserWrapprSettings {
        /**
         * What the global object is called, such as "window".
         */
        globalName: string;
        /**
         * Allowed sizes for the game.
         */
        sizes: ISizeSummaries;
        /**
         * The default starting size.
         */
        sizeDefault: string;
        /**
         * Schemas for each UI control to be made.
         */
        schemas: ISchema[];
        /**
         * A list of all allowed keyboard keys to replace the UserWrappr class default.
         */
        allPossibleKeys?: string[];
        /**
         * A CSS selector for the game's container.
         */
        gameElementSelector?: string;
        /**
         * A CSS selector for the UI buttons container.
         */
        gameControlsSelector?: string;
        /**
         * A utility Function to log messages, commonly console.log.
         */
        logger?: (...args: any[]) => void;
        /**
         * Custom arguments to be passed to the IGameStartr's modules.
         */
        customs?: IGameStartrCustoms;
        /**
         * Any additional CSS styles to be applied to the page.
         */
        styleSheet?: StyleSheet;
        /**
         * The constructor for the IGameStartr implementation.
         */
        GameStartrConstructor: IGameStartrConstructor;
    }
    /**
     * A user interface wrapper for configurable HTML displays over GameStartr games.
     */
    interface IUserWrappr {
        /**
         * Resets the internal GameStarter by storing it under window, adding
         * InputWritr pipes for input to the page, creating the HTML buttons,
         * and setting additional CSS styles and page visiblity.
         *
         * @param settings   Settings for the GameStartr constructor.
         * @param customs   Additional settings for sizing information.
         */
        resetGameStarter(settings: IUserWrapprSettings, customs?: IGameStartrCustoms): void;
        /**
         * Resets the visual aspect of the controls so they are updated with the
         * recently changed values in ItemsHolder.
         */
        resetControls(): void;
        /**
         * @returns The GameStartr implementation this is wrapping around.
         */
        getGameStartrConstructor(): IGameStartrConstructor;
        /**
         * @returns The GameStartr instance created by GameStartrConstructor.
         */
        getGameStarter(): IGameStartr;
        /**
         * @returns The ItemsHoldr used to store UI settings.
         */
        getItemsHolder(): ItemsHoldr.IItemsHoldr;
        /**
         * @returns The settings used to construct this UserWrappr.
         */
        getSettings(): IUserWrapprSettings;
        /**
         * @returns The customs used to construct the IGameStartr.
         */
        getCustoms(): IGameStartrCustoms;
        /**
         * @returns All the keys the user is allowed to pick from in UI controls.
         */
        getAllPossibleKeys(): string[];
        /**
         * @returns The allowed sizes for the game.
         */
        getSizes(): ISizeSummaries;
        /**
         * @returns The currently selected size for the game.
         */
        getCurrentSize(): ISizeSummary;
        /**
         * @returns Whether the game is currently in full screen mode.
         */
        getIsFullScreen(): boolean;
        /**
         * @returns Whether the page is currently known to be hidden.
         */
        getIsPageHidden(): boolean;
        /**
         * @returns A utility Function to log messages, commonly console.log.
         */
        getLogger(): (...args: any[]) => string;
        /**
         * @returns Generators used to generate HTML controls for the user.
         */
        getGenerators(): IOptionsGenerators;
        /**
         * @returns The document element that contains the game.
         */
        getDocumentElement(): HTMLHtmlElement;
        /**
         * @returns The method to request to enter full screen mode.
         */
        getRequestFullScreen(): () => void;
        /**
         * @returns The method to request to exit full screen mode.
         */
        getCancelFullScreen(): () => void;
        /**
         * @returns The identifier for the device input checking interval.
         */
        getDeviceChecker(): number;
        /**
         * Sets the size of the GameStartr by resetting the game with the size
         * information as part of its customs object. Full screen status is
         * changed accordingly.
         *
         * @param size The size to set, as a String to retrieve the size from
         *             known info, or a container of settings.
         */
        setCurrentSize(size: string | ISizeSummary): void;
    }
    /**
     * A general descripton of a user control containing some number of options.
     */
    interface ISchema {
        /**
         * The name of the generator that should create this control.
         */
        generator: string;
        /**
         * The label for the control that users will see.
         */
        title: string;
    }
    /**
     * A general description of a single option within a user control.
     */
    interface IOption {
        /**
         * The label for the option that users will see.
         */
        title: string;
        /**
         * A source Function for the option's initial value.
         */
        source: IOptionSource;
    }
    /**
     * A source Function for an option's individual value.
     *
     * @param GameStarter   The GameStarter instance this control is for.
     * @returns An initial value for an option control.
     */
    interface IOptionSource {
        (GameStarter: any, ...args: any[]): any;
    }
    /**
     * An HTMLElement that has been given a utility setValue Function.
     */
    interface IChoiceElement extends HTMLElement {
        /**
         * A utility Function to set this HTMLElement's value.
         *
         * @param value   A new value for this element.
         */
        setValue(value: any): void;
    }
    /**
     * An HTMLInputElement that has been given a utility setValue Function.
     */
    interface IInputElement extends HTMLInputElement, IChoiceElement {
    }
    /**
     * An HTMLSelectElement that has been given a utility setValue Function, as
     * well as a variable to hold a previous value.
     */
    interface ISelectElement extends HTMLSelectElement {
        /**
         * A previous value for this element.
         */
        valueOld?: string;
        /**
         * A utility Function to set this HTMLElement's value.
         *
         * @param value   A new value for this element.
         */
        setValue(value: any): void;
    }
    /**
     * A user interface wrapper for configurable HTML displays over GameStartr games.
     */
    class UserWrappr implements IUserWrappr {
        /**
         * The default list of all allowed keyboard keys.
         */
        private static allPossibleKeys;
        /**
         * The GameStartr implementation this is wrapping around, such as
         * FullScreenMario or FullScreenPokemon.
         */
        private GameStartrConstructor;
        /**
         * The GameStartr instance created by GameStartrConstructor and stored
         * under window.
         */
        private GameStarter;
        /**
         * A ItemsHoldr used to store UI settings.
         */
        private ItemsHolder;
        /**
         * The settings used to construct the UserWrappr.
         */
        private settings;
        /**
         * Custom arguments to be passed to the GameStartr's modules.
         */
        private customs;
        /**
         * What the global object is called (typically "window" for browser
         * environments and "global" for node-style environments).
         */
        private globalName;
        /**
         * All the keys the user is allowed to pick from as key bindings.
         */
        private allPossibleKeys;
        /**
         * The allowed sizes for the game.
         */
        private sizes;
        /**
         * The currently selected size for the game.
         */
        private currentSize;
        /**
         * The CSS selector for the HTML element containing GameStarter's container.
         */
        private gameElementSelector;
        /**
         * The CSS selector for the HTMl element containing the UI buttons.
         */
        private gameControlsSelector;
        /**
         * Whether the game is currently in full screen mode.
         */
        private isFullScreen;
        /**
         * Whether the page is currently known to be hidden.
         */
        private isPageHidden;
        /**
         * A utility Function to log messages, commonly console.log.
         */
        private logger;
        /**
         * Generators used to generate HTML controls for the user.
         */
        private generators;
        /**
         * Identifier for the interval Function checking for device input.
         */
        private deviceChecker;
        /**
         * The document element that will contain the game.
         */
        private documentElement;
        /**
         * A browser-dependent method for request to enter full screen mode.
         */
        private requestFullScreen;
        /**
         * A browser-dependent method for request to exit full screen mode.
         */
        private cancelFullScreen;
        /**
         * Initializes a new instance of the UserWrappr class.
         *
         * @param settings   Settings to be used for initialization.
         */
        constructor(settings: IUserWrapprSettings);
        /**
         * Resets the internal GameStarter by storing it under window, adding
         * InputWritr pipes for input to the page, creating the HTML buttons,
         * and setting additional CSS styles and page visiblity.
         *
         * @param settings   Settings for the GameStartr constructor.
         * @param customs   Additional settings for sizing information.
         */
        resetGameStarter(settings: IUserWrapprSettings, customs?: IGameStartrCustoms): void;
        /**
         * Resets the visual aspect of the controls so they are updated with the
         * recently changed values in ItemsHolder.
         */
        resetControls(): void;
        /**
         * @returns The GameStartr implementation this is wrapping around.
         */
        getGameStartrConstructor(): IGameStartrConstructor;
        /**
         * @returns The GameStartr instance created by GameStartrConstructor.
         */
        getGameStarter(): IGameStartr;
        /**
         * @returns The ItemsHoldr used to store UI settings.
         */
        getItemsHolder(): ItemsHoldr.IItemsHoldr;
        /**
         * @returns The settings used to construct this UserWrappr.
         */
        getSettings(): IUserWrapprSettings;
        /**
         * @returns The customs used to construct the IGameStartr.
         */
        getCustoms(): IGameStartrCustoms;
        /**
         * @returns All the keys the user is allowed to pick from in UI controls.
         */
        getAllPossibleKeys(): string[];
        /**
         * @returns The allowed sizes for the game.
         */
        getSizes(): ISizeSummaries;
        /**
         * @returns The currently selected size for the game.
         */
        getCurrentSize(): ISizeSummary;
        /**
         * @returns Whether the game is currently in full screen mode.
         */
        getIsFullScreen(): boolean;
        /**
         * @returns Whether the page is currently known to be hidden.
         */
        getIsPageHidden(): boolean;
        /**
         * @returns A utility Function to log messages, commonly console.log.
         */
        getLogger(): (...args: any[]) => string;
        /**
         * @returns Generators used to generate HTML controls for the user.
         */
        getGenerators(): IOptionsGenerators;
        /**
         * @returns The document element that contains the game.
         */
        getDocumentElement(): HTMLHtmlElement;
        /**
         * @returns The method to request to enter full screen mode.
         */
        getRequestFullScreen(): () => void;
        /**
         * @returns The method to request to exit full screen mode.
         */
        getCancelFullScreen(): () => void;
        /**
         * @returns The identifier for the device input checking interval.
         */
        getDeviceChecker(): number;
        /**
         * Sets the size of the GameStartr by resetting the game with the size
         * information as part of its customs object. Full screen status is
         * changed accordingly.
         *
         * @param size The size to set, as a String to retrieve the size from
         *             known info, or a container of settings.
         */
        setCurrentSize(size: string | ISizeSummary): void;
        /**
         * Starts the checkDevices loop to scan for gamepad status changes.
         */
        private startCheckingDevices();
        /**
         * Calls the DeviceLayer to check for gamepad triggers, after scheduling
         * another checkDevices call via setTimeout.
         */
        private checkDevices();
        /**
         * Creates as a copy of the given sizes with names as members.
         *
         * @param sizesRaw   The listing of preset sizes to go by.
         * @returns A copy of sizes, with names as members.
         */
        private importSizes(sizesRaw);
        /**
         * Creates a copy of the given customs and adjusts sizing information,
         * such as for infinite width or height.
         *
         * @param customsRaw   Raw, user-provided customs.
         */
        private fixCustoms(customsRaw);
        /**
         * Adds a "visibilitychange" handler to the document bound to
         * this.handleVisibilityChange.
         */
        private resetPageVisibilityHandlers();
        /**
         * Handles a visibility change event by calling either this.onPageHidden
         * or this.onPageVisible.
         */
        private handleVisibilityChange();
        /**
         * Reacts to the page becoming hidden by pausing the GameStartr.
         */
        private onPageHidden();
        /**
         * Reacts to the page becoming visible by unpausing the GameStartr.
         */
        private onPageVisible();
        /**
         * Loads the internal GameStarter, resetting it with the given customs
         * and attaching handlers to document.body and the holder elements.
         *
         * @param customs   Custom arguments to pass to this.GameStarter.
         */
        private loadGameStarter(customs);
        /**
         * Loads the internal OptionsGenerator instances under this.generators.
         */
        private loadGenerators();
        /**
         * Loads the externally facing UI controls and the internal ItemsHolder,
         * appending the controls to the controls HTML element.
         *
         * @param schemas   The schemas for each UI control to be made.
         */
        private loadControls(schemas);
        /**
         * Creates an individual UI control element based on a UI schema.
         *
         * @param schemas   The schemas for a UI control to be made.
         * @returns An individual UI control element.
         */
        private loadControlDiv(schema);
    }
}
declare var module: any;
