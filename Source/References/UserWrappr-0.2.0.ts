/// <reference path="DeviceLayr-0.2.0.ts" />
/// <reference path="GamesRunnr-0.2.0.ts" />
/// <reference path="ItemsHoldr-0.2.1.ts" />
/// <reference path="InputWritr-0.2.0.ts" />
/// <reference path="LevelEditr-0.2.0.ts" />

interface HTMLElement {
    requestFullScreen: () => void;
    webkitRequestFullScreen: () => void;
    mozRequestFullScreen: () => void;
    webkitFullscreenElement: () => void;
    cancelFullScreen: () => void;
    webkitCancelFullScreen: () => void;
    mozCancelFullScreen: () => void;
    msCancelFullScreen: () => void;
}

declare module UserWrappr {
    export interface IGameStartr {
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
        proliferate(recipient: any, donor: any, noOverride?: boolean): any;
    }

    type IGameStartrCustoms = any;

    export interface IGameStartrConstructor {
        new (GameStartrSettings?): IGameStartr;
    }

    export interface IGameStartrUIHelpSettings {
        globalNameAlias: string;
        openings: string[];
        options: {
            [i: string]: IGameStartrUIHelpOption[]
        };
    }

    export interface IGameStartrUIHelpOption {
        title: string;
        description: string;
        usage?: string;
        examples?: IGameStartrUIHelpExample[];
    }

    export interface IGameStartrUIHelpExample {
        code: string;
        comment: string;
    }

    export module UISchemas {
        export interface ISchema {
            generator: string;
            title: string;
        }

        export interface IOption {
            title: string;
            source: IOptionSource;
        }

        export interface IOptionSource {
            (GameStarter: IGameStartr, ...args: any[]): any;
        }

        export interface IChoiceElement extends HTMLElement {
            setValue(value: any): void;
        }

        export interface IInputElement extends HTMLInputElement, IChoiceElement { }

        export interface ISelectElement extends HTMLSelectElement {
            valueOld?: string;
            setValue(value: any): void;
        }

        export interface IOptionsButtonsSchema extends ISchema {
            options: IOptionSource | IOptionsButtonSchema[];
            callback: (GameStarter: IGameStartr, ...args: any[]) => void;
            keyActive?: string;
            assumeInactive?: boolean;
        }

        export interface IOptionsButtonSchema extends IOption {
            callback: (GameStarter: IGameStartr, ...args: any[]) => void;
            source: IOptionSource;
            storeLocally?: boolean;
            type: string;
        }

        export interface IOptionsTableSchema extends ISchema {
            actions?: IOptionsTableAction[];
            options: IOptionsTableOption[];
        }

        export interface IOptionsTableTypes {
            [i: string]: (input: any, details: IOptionsTableOption, schema: ISchema) => any;
        }

        export interface IOptionsTableAction {
            title: string;
            action: (GameStarter: IGameStartr, ...args: any[]) => void;
        }

        export interface IOptionsTableOption extends IOption {
            type: string;
            storeLocally?: boolean;
        }

        export interface IOptionsTableBooleanOption extends IOptionsTableOption {
            disable: (GameStarter: IGameStartr, ...args: any[]) => void;
            enable: (GameStarter: IGameStartr, ...args: any[]) => void;
            options?: (GameStarter: IGameStartr, ...args: any[]) => string[];
            keyActive?: string;
            assumeInactive?: boolean;
        }

        export interface IOptionsTableKeysOption extends IOptionsTableOption {
            callback: (GameStarter: IGameStartr, ...args: any[]) => void;
            source: (GameStarter: IGameStartr, ...args: any[]) => string[];
        }

        export interface IOptionsTableNumberOption extends IOptionsTableOption {
            minimum: number;
            maximum: number;
            update: (GameStarter: IGameStartr, ...args: any[]) => void;
        }

        export interface IOptionsTableSelectOption extends IOptionsTableOption {
            options: (GameStarter: IGameStartr, ...args: any[]) => string[];
            source: (GameStarter: IGameStartr, ...args: any[]) => void;
            update: (GameStarter: IGameStartr, ...args: any[]) => void;
        }

        export interface IOptionsTableScreenSizeOption extends IOptionsTableOption {
            options: () => string[];
            source: () => string;
            update: (GameStarter: IGameStartr, value: IUserWrapprSizeSummary) => ISelectElement;
        }

        export interface IOptionsEditorSchema extends ISchema {
            maps: IOptionsMapGridSchema;
            callback: (GameStarter: IGameStartr, ...args: any[]) => void;
        }

        export interface IOptionsMapGridSchema extends ISchema {
            rangeX: number[];
            rangeY: number[];
            callback: (GameStarter: IGameStartr, ...args: any[]) => void;
            extras?: {
                [i: string]: IOptionsMapGridExtra;
            };
        }

        export interface IOptionsMapGridExtra {
            title: string;
            callback: (GameStarter: IGameStartr, ...args: any[]) => void;
            extraElements: IOptionsMapGridExtraElement[];
        }

        export interface IOptionsMapGridExtraElement {
            tag: string;
            options: any;
        }
    }

    export interface IOptionsGenerator {
        generate: (schema: UISchemas.ISchema) => HTMLDivElement;
    }

    export interface IUserWrapprSizeSummary {
        width: number;
        height: number;
        name?: string;
        full?: boolean;
    }

    export interface IUISettings {
        helpSettings: IGameStartrUIHelpSettings;
        globalName: string;
        sizes: {
            [i: string]: IUserWrapprSizeSummary;
        };
        sizeDefault: string;
        schemas: UISchemas.ISchema[];
        allPossibleKeys?: string[];
        gameElementSelector?: string;
        gameControlsSelector?: string;
        log?: (...args: any[]) => void;
        customs?: IGameStartrCustoms;
        styleSheet?: StyleSheet;
    }

    export interface IUserWrapprSettings extends IUISettings {
        GameStartrConstructor: IGameStartrConstructor;
    }

    export interface IUserWrappr {
        resetGameStarter(settings: IUserWrapprSettings, customs?: IGameStartrCustoms): void;
        getGameStartrConstructor(): IGameStartrConstructor;
        getGameStarter(): IGameStartr;
        getItemsHolder(): ItemsHoldr.ItemsHoldr;
        getSettings(): IUserWrapprSettings;
        getCustoms(): IGameStartrCustoms;
        getHelpSettings(): IGameStartrUIHelpSettings;
        getGlobalName(): string;
        getGameNameAlias(): string;
        getAllPossibleKeys(): string[];
        getSizes(): { [i: string]: IUserWrapprSizeSummary };
        getCurrentSize(): IUserWrapprSizeSummary;
        getIsFullScreen(): boolean;
        getIsPageHidden(): boolean;
        getLog(): (...args: any[]) => string;
        getGenerators(): { [i: string]: IOptionsGenerator };
        getDocumentElement(): HTMLHtmlElement;
        getRequestFullScreen(): () => void;
        getCancelFullScreen(): () => void;
        setCurrentSize(size: string | IUserWrapprSizeSummary): void;
        displayHelpMenu(): void;
        displayHelpOptions(): void;
        displayHelpGroupSummary(optionName: string): void;
        displayHelpOption(optionName: string): void;
        logHelpText(text: string): void;
        filterHelpText(text: string): string;
        padTextRight(text: string, length: number): string;
    }
}


module UserWrappr {
    "use strict";

    /**
     * A user interface manager made to work on top of GameStartr implementations
     * and provide a configurable HTML display of options.
     */
    export class UserWrappr {
        /**
         * The GameStartr implementation this is wrapping around, such as
         * FullScreenMario or FullScreenPokemon.
         */
        private GameStartrConstructor: IGameStartrConstructor;

        /**
         * The GameStartr instance created by GameStartrConstructor and stored
         * under window.
         */
        private GameStarter: IGameStartr;

        /**
         * A ItemsHoldr used to store UI settings.
         */
        private ItemsHolder: ItemsHoldr.ItemsHoldr;

        /**
         * The settings used to construct the UserWrappr.
         */
        private settings: IUserWrapprSettings;

        /**
         * Custom arguments to be passed to the GameStartr's modules.
         */
        private customs: any;

        /**
         * Help settings specifically for the user interface, obtained from
         * settings.helpSettings.
         */
        private helpSettings: IGameStartrUIHelpSettings;

        /**
         * What the global object is called (typically "window" for browser 
         * environments and "global" for node-style environments).
         */
        private globalName: string;

        /**
         * What to replace with the name of the game in help text settings.
         */
        private gameNameAlias: string;

        /**
         * All the keys the user is allowed to pick from as key bindings.
         */
        private allPossibleKeys: string[];

        /**
         * The allowed sizes for the game.
         */
        private sizes: {
            [i: string]: IUserWrapprSizeSummary
        };

        /**
         * The currently selected size for the game.
         */
        private currentSize: IUserWrapprSizeSummary;

        /**
         * The CSS selector for the HTML element containing GameStarter's container.
         */
        private gameElementSelector: string;

        /**
         * The CSS selector for the HTMl element containing the UI buttons.
         */
        private gameControlsSelector: string;

        /**
         * Whether the game is currently in full screen mode.
         */
        private isFullScreen: boolean;

        /**
         * Whether the page is currently known to be hidden.
         */
        private isPageHidden: boolean;

        /**
         * A utility Function to log messages, commonly console.log.
         */
        private log: (...args: any[]) => string;

        /**
         * Generators used to generate HTML controls for the user.
         */
        private generators: { [i: string]: IOptionsGenerator };

        /**
         * The document element that will contain the game.
         */
        private documentElement: HTMLHtmlElement = <HTMLHtmlElement>document.documentElement;

        /**
         * Identifier for the interval Function checking for device input.
         */
        private deviceChecker: number;

        /**
         * A browser-dependent method for request to enter full screen mode.
         */
        private requestFullScreen: () => void = (
            this.documentElement.requestFullScreen
            || this.documentElement.webkitRequestFullScreen
            || this.documentElement.mozRequestFullScreen
            || (<any>this.documentElement).msRequestFullscreen
            || function (): void {
                console.warn("Not able to request full screen...");
            }
        ).bind(this.documentElement);

        /**
         * A browser-dependent method for request to exit full screen mode.
         */
        private cancelFullScreen: () => void = (
            this.documentElement.cancelFullScreen
            || this.documentElement.webkitCancelFullScreen
            || this.documentElement.mozCancelFullScreen
            || (<any>this.documentElement).msCancelFullScreen
            || function (): void {
                console.warn("Not able to cancel full screen...");
            }
        ).bind(document);

        /**
         * @param {IUserWrapprSettings} settings
         */
        constructor(settings: IUserWrapprSettings) {
            if (typeof settings === "undefined") {
                throw new Error("No settings object given to UserWrappr.");
            }
            if (typeof settings.GameStartrConstructor === "undefined") {
                throw new Error("No GameStartrConstructor given to UserWrappr.");
            }
            if (typeof settings.helpSettings === "undefined") {
                throw new Error("No helpSettings given to UserWrappr.");
            }
            if (typeof settings.globalName === "undefined") {
                throw new Error("No globalName given to UserWrappr.");
            }
            if (typeof settings.sizes === "undefined") {
                throw new Error("No sizes given to UserWrappr.");
            }
            if (typeof settings.sizeDefault === "undefined") {
                throw new Error("No sizeDefault given to UserWrappr.");
            }
            if (typeof settings.schemas === "undefined") {
                throw new Error("No schemas given to UserWrappr.");
            }

            this.settings = settings;
            this.GameStartrConstructor = settings.GameStartrConstructor;
            this.globalName = settings.globalName;
            this.helpSettings = this.settings.helpSettings;

            this.customs = settings.customs || {};

            this.importSizes(settings.sizes);

            this.gameNameAlias = this.helpSettings.globalNameAlias || "{%%%%GAME%%%%}";
            this.gameElementSelector = settings.gameElementSelector || "#game";
            this.gameControlsSelector = settings.gameControlsSelector || "#controls";
            this.log = settings.log || console.log.bind(console);

            this.isFullScreen = false;
            this.setCurrentSize(this.sizes[settings.sizeDefault]);

            this.allPossibleKeys = settings.allPossibleKeys || [
                "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m",
                "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
                "up", "right", "down", "left", "space", "shift", "ctrl"
            ];

            // Size information is also passed to modules via this.customs
            this.GameStartrConstructor.prototype.proliferate(this.customs, this.currentSize, true);

            this.resetGameStarter(settings, this.customs);
        }

        /**
         * Resets the internal GameStarter by storing it under window, adding
         * InputWritr pipes for input to the page, creating the HTML buttons,
         * and setting additional CSS styles and page visiblity.
         * 
         * @param {IUserWrapprSettings} settings
         * @param {IGameStartrCustoms} customs
         */
        resetGameStarter(settings: IUserWrapprSettings, customs: any = {}): void {
            this.loadGameStarter(this.fixCustoms(customs || {}));

            window[settings.globalName || "GameStarter"] = this.GameStarter;
            this.GameStarter.UserWrapper = this;

            this.loadGenerators();
            this.loadControls(settings.schemas);

            if (settings.styleSheet) {
                this.GameStarter.addPageStyles(settings.styleSheet);
            }

            this.resetPageVisibilityHandlers();

            this.GameStarter.gameStart();

            this.startCheckingDevices();
        }


        /* Simple gets
        */

        /**
         * @return {IGameStartrConstructor} The GameStartr implementation this
         *                                  is wrapping around.
         */
        getGameStartrConstructor(): IGameStartrConstructor {
            return this.GameStartrConstructor;
        }

        /**
         * @return {GameStartr} The GameStartr instance created by GameStartrConstructor
         *                      and stored under window.
         */
        getGameStarter(): IGameStartr {
            return this.GameStarter;
        }

        /**
         * @return {ItemsHoldr} The ItemsHoldr used to store UI settings.
         */
        getItemsHolder(): ItemsHoldr.ItemsHoldr {
            return this.ItemsHolder;
        }

        /**
         * @return {Object} The settings used to construct this UserWrappr.
         */
        getSettings(): IUserWrapprSettings {
            return this.settings;
        }

        /**
         * @return {Object} The customs used to construct the GameStartr.
         */
        getCustoms(): IGameStartrCustoms {
            return this.customs;
        }

        /**
         * @return {Object} The help settings from settings.helpSettings.
         */
        getHelpSettings(): IGameStartrUIHelpSettings {
            return this.helpSettings;
        }

        /**
         * @return {String} What the global object is called, such as "window".
         */
        getGlobalName(): string {
            return this.globalName;
        }

        /**
         * @return {String} What to replace with the name of the game in help
         *                  text settings.
         */
        getGameNameAlias(): string {
            return this.gameNameAlias;
        }

        /**
         * @return {String} All the keys the user is allowed to pick from.
         */
        getAllPossibleKeys(): string[] {
            return this.allPossibleKeys;
        }

        /**
         * @return {Object} The allowed sizes for the game.
         */
        getSizes(): { [i: string]: IUserWrapprSizeSummary } {
            return this.sizes;
        }

        /**
         * @return {Object} The currently selected size for the game.
         */
        getCurrentSize(): IUserWrapprSizeSummary {
            return this.currentSize;
        }

        /**
         * @return {Boolean} Whether the game is currently in full screen mode.
         */
        getIsFullScreen(): boolean {
            return this.isFullScreen;
        }

        /**
         * @return {Boolean} Whether the page is currently known to be hidden.
         */
        getIsPageHidden(): boolean {
            return this.isPageHidden;
        }

        /**
         * @return {Function} A utility Function to log messages, commonly console.log.
         */
        getLog(): (...args: any[]) => string {
            return this.log;
        }

        /**
         * @return {Object} Generators used to generate HTML controls for the user.
         */
        getGenerators(): { [i: string]: IOptionsGenerator } {
            return this.generators;
        }

        /**
         * @return {HTMLHtmlElement} The document element that contains the game.
         */
        getDocumentElement(): HTMLHtmlElement {
            return this.documentElement;
        }

        /**
         * @return {Function} The method to request to enter full screen mode.
         */
        getRequestFullScreen(): () => void {
            return this.requestFullScreen;
        }

        /**
         * @return {Function} The method to request to exit full screen mode.
         */
        getCancelFullScreen(): () => void {
            return this.cancelFullScreen;
        }

        /**
         * @return {Number} The identifier for the device input checking interval.
         */
        getDeviceChecker(): number {
            return this.deviceChecker;
        }


        /* Externally allowed sets
        */

        /**
         * Sets the size of the GameStartr by resetting the game with the size
         * information as part of its customs object. Full screen status is
         * changed accordingly.
         * 
         * @param {Mixed} The size to set, as a String to retrieve the size from
         *                known info, or a container of settings.
         */
        setCurrentSize(size: string | IUserWrapprSizeSummary): void {
            if (typeof size === "string" || size.constructor === String) {
                if (!this.sizes.hasOwnProperty(<string>size)) {
                    throw new Error("Size " + size + " does not exist on the UserWrappr.");
                }
                size = <IUserWrapprSizeSummary>this.sizes[<string>size];
            }

            this.customs = this.fixCustoms(this.customs);

            if ((<IUserWrapprSizeSummary>size).full) {
                this.requestFullScreen();
                this.isFullScreen = true;
            } else if (this.isFullScreen) {
                this.cancelFullScreen();
                this.isFullScreen = false;
            }

            this.currentSize = <IUserWrapprSizeSummary>size;

            if (this.GameStarter) {
                this.GameStarter.container.parentNode.removeChild(this.GameStarter.container);
                this.resetGameStarter(this.settings, this.customs);
            }
        }


        /* Help dialog
        */

        /**
         * Displays the root help menu dialog, which contains all the openings
         * for each help settings opening.
         */
        displayHelpMenu(): void {
            this.helpSettings.openings.forEach(this.logHelpText.bind(this));
        }

        /**
         * Displays the texts of each help settings options, all surrounded by
         * instructions on how to focus on a group.
         */
        displayHelpOptions(): void {
            this.logHelpText(
                "To focus on a group, enter `"
                + this.globalName
                + ".UserWrapper.displayHelpOption(\"<group-name>\");`"
            );

            Object.keys(this.helpSettings.options).forEach(this.displayHelpGroupSummary.bind(this));

            this.logHelpText(
                "\nTo focus on a group, enter `"
                + this.globalName
                + ".UserWrapper.displayHelpOption(\"<group-name>\");`"
            );
        }

        /**
         * Displays the summary for a help group of the given optionName.
         * 
         * @param {String} optionName   The help group to display the summary of.
         */
        displayHelpGroupSummary(optionName: string): void {
            var actions: IGameStartrUIHelpOption[] = this.helpSettings.options[optionName],
                action: IGameStartrUIHelpOption,
                maxTitleLength: number = 0,
                i: number;

            this.log("\n" + optionName);

            for (i = 0; i < actions.length; i += 1) {
                maxTitleLength = Math.max(maxTitleLength, this.filterHelpText(actions[i].title).length);
            }

            for (i = 0; i < actions.length; i += 1) {
                action = actions[i];
                this.log(this.padTextRight(this.filterHelpText(action.title), maxTitleLength) + " ... " + action.description);
            }
        }

        /**
         * Displays the full information on a help group of the given optionName.
         * 
         * @param {String} optionName   The help group to display the information of.
         */
        displayHelpOption(optionName: string): void {
            var actions: IGameStartrUIHelpOption[] = this.helpSettings.options[optionName],
                action: IGameStartrUIHelpOption,
                example: IGameStartrUIHelpExample,
                maxExampleLength: number,
                i: number,
                j: number;

            for (i = 0; i < actions.length; i += 1) {
                action = actions[i];
                maxExampleLength = 0;
                this.logHelpText(action.title + " -- " + action.description);

                if (action.usage) {
                    this.logHelpText(action.usage);
                }

                if (action.examples) {
                    for (j = 0; j < action.examples.length; j += 1) {
                        example = action.examples[j];
                        maxExampleLength = Math.max(
                            maxExampleLength,
                            this.filterHelpText("    " + example.code).length
                        );
                    }

                    for (j = 0; j < action.examples.length; j += 1) {
                        example = action.examples[j];
                        this.logHelpText(
                            this.padTextRight(
                                this.filterHelpText("    " + example.code),
                                maxExampleLength
                            )
                            + "  // " + example.comment
                        );
                    }
                }

                this.log("\n");
            }
        }

        /**
         * Logs a bit of help text, filtered by this.filterHelpText.
         * 
         * @param {String} text   The text to be filtered and logged.
         */
        logHelpText(text: string): void {
            this.log(this.filterHelpText(text));
        }

        /**
         * @param {String} text
         * @return {String} The text, with gamenameAlias replaced by globalName.
         */
        filterHelpText(text: string): string {
            return text.replace(new RegExp(this.gameNameAlias, "g"), this.globalName);
        }

        /**
         * Ensures a bit of text is of least a certain length.
         * 
         * @param {String} text   The text to pad.
         * @param {Number} length   How wide the text must be, at minimum.
         * @return {String} The text with spaces padded to the right.
         */
        padTextRight(text: string, length: number): string {
            var diff: number = 1 + length - text.length;

            if (diff <= 0) {
                return text;
            }

            return text + Array.call(Array, diff).join(" ");
        }


        /* Devices
        */

        /**
         * Starts the checkDevices loop to scan for gamepad status changes.
         */
        private startCheckingDevices(): void {
            this.checkDevices();
        }

        /**
         * Calls the DeviceLayer to check for gamepad triggers, after scheduling
         * another checkDevices call via setTimeout.
         */
        private checkDevices(): void {
            this.deviceChecker = setTimeout(
                this.checkDevices.bind(this),
                this.GameStarter.GamesRunner.getPaused()
                    ? 117
                    : this.GameStarter.GamesRunner.getInterval() / this.GameStarter.GamesRunner.getSpeed());

            this.GameStarter.DeviceLayer.checkNavigatorGamepads();
            this.GameStarter.DeviceLayer.activateAllGamepadTriggers();
        }


        /* Settings parsing
        */

        /**
         * Sets the internal this.sizes as a copy of the given sizes, but with
         * names as members of every size summary.
         * 
         * @param {Object} sizes   The listing of preset sizes to go by.
         */
        private importSizes(sizes: { [i: string]: IUserWrapprSizeSummary }): void {
            var i: string;

            this.sizes = this.GameStartrConstructor.prototype.proliferate({}, sizes);

            for (i in this.sizes) {
                if (this.sizes.hasOwnProperty(i)) {
                    this.sizes[i].name = this.sizes[i].name || i;
                }
            }
        }

        /**
         * 
         */
        private fixCustoms(customsRaw: IGameStartrCustoms): any {
            var customs: IGameStartrCustoms = this.GameStartrConstructor.prototype.proliferate({}, customsRaw);

            this.GameStartrConstructor.prototype.proliferate(customs, this.currentSize);

            if (!isFinite(customs.width)) {
                customs.width = document.body.clientWidth;
            }
            if (!isFinite(customs.height)) {
                if (customs.full) {
                    customs.height = screen.height;
                } else if (this.isFullScreen) {
                    // Guess for browser window...
                    // @todo Actually compute this!
                    customs.height = window.innerHeight - 140;
                } else {
                    customs.height = window.innerHeight;
                }
                // 49px from header, 77px from menus
                customs.height -= 126;
            }

            return customs;
        }


        /* Page visibility
        */

        /**
         * Adds a "visibilitychange" handler to the document bound to 
         * this.handleVisibilityChange.
         */
        private resetPageVisibilityHandlers(): void {
            document.addEventListener("visibilitychange", this.handleVisibilityChange.bind(this));
        }

        /**
         * Handles a visibility change event by calling either this.onPageHidden
         * or this.onPageVisible.
         * 
         * @param {Event} event
         */
        private handleVisibilityChange(event: Event): void {
            switch (document.visibilityState) {
                case "hidden":
                    this.onPageHidden();
                    return;
                case "visible":
                    this.onPageVisible();
                    return;
                default:
                    return;
            }
        }

        /**
         * Reacts to the page becoming hidden by pausing the GameStartr.
         */
        private onPageHidden(): void {
            if (!this.GameStarter.GamesRunner.getPaused()) {
                this.isPageHidden = true;
                this.GameStarter.GamesRunner.pause();
            }
        }

        /**
         * Reacts to the page becoming visible by unpausing the GameStartr.
         */
        private onPageVisible(): void {
            if (this.isPageHidden) {
                this.isPageHidden = false;
                this.GameStarter.GamesRunner.play();
            }
        }


        /* Control section loaders
        */

        /**
         * Loads the internal GameStarter, resetting it with the given customs
         * and attaching handlers to document.body and the holder elements.
         * 
         * @param {Object} customs   Custom arguments to pass to this.GameStarter.
         */
        private loadGameStarter(customs: IGameStartrCustoms): void {
            var section: HTMLElement = <HTMLElement>document.querySelector(this.gameElementSelector);

            if (this.GameStarter) {
                this.GameStarter.GamesRunner.pause();
            }

            this.GameStarter = new this.GameStartrConstructor(customs);

            section.textContent = "";
            section.appendChild(this.GameStarter.container);

            this.GameStarter.proliferate(document.body, {
                "onkeydown": this.GameStarter.InputWriter.makePipe("onkeydown", "keyCode"),
                "onkeyup": this.GameStarter.InputWriter.makePipe("onkeyup", "keyCode")
            });

            this.GameStarter.proliferate(section, {
                "onmousedown": this.GameStarter.InputWriter.makePipe("onmousedown", "which"),
                "oncontextmenu": this.GameStarter.InputWriter.makePipe("oncontextmenu", null, true)
            });
        }

        /**
         * Loads the internal OptionsGenerator instances under this.generators.
         */
        private loadGenerators(): void {
            this.generators = {
                OptionsButtons: new UISchemas.OptionsButtonsGenerator(this),
                OptionsTable: new UISchemas.OptionsTableGenerator(this),
                LevelEditor: new UISchemas.LevelEditorGenerator(this),
                MapsGrid: new UISchemas.MapsGridGenerator(this)
            };
        }

        /**
         * Loads the externally facing UI controls and the internal ItemsHolder,
         * appending the controls to the controls HTML element.
         * 
         * @param {Object[]} schemas   The schemas each a UI control to be made.
         */
        private loadControls(schemas: UISchemas.ISchema[]): void {
            var section: HTMLElement = <HTMLElement>document.querySelector(this.gameControlsSelector),
                length: number = schemas.length,
                i: number;

            this.ItemsHolder = new ItemsHoldr.ItemsHoldr({
                "prefix": this.globalName + "::UserWrapper::ItemsHolder"
            });

            section.textContent = "";
            section.className = "length-" + length;

            for (i = 0; i < length; i += 1) {
                section.appendChild(this.loadControlDiv(schemas[i]));
            }
        }

        /** 
         * Creates an individual UI control element based on a UI schema.
         * 
         * @param {Object} schema
         * @return {HTMLDivElement}
         */
        private loadControlDiv(schema: UISchemas.ISchema): HTMLDivElement {
            var control: HTMLDivElement = document.createElement("div"),
                heading: HTMLHeadingElement = document.createElement("h4"),
                inner: HTMLDivElement = document.createElement("div");

            control.className = "control";
            control.id = "control-" + schema.title;

            heading.textContent = schema.title;

            inner.className = "control-inner";
            inner.appendChild(this.generators[schema.generator].generate(schema));

            control.appendChild(heading);
            control.appendChild(inner);

            // Touch events often propogate to children before the control div has
            // been fully extended. Setting the "active" attribute fixes that.
            control.onmouseover = setTimeout.bind(
                undefined,
                function (): void {
                    control.setAttribute("active", "on");
                },
                35);

            control.onmouseout = function (): void {
                control.setAttribute("active", "off");
            };

            return control;
        }
    }

    export module UISchemas {
        /**
         * Base class for options generators. These all store a UserWrapper and
         * its GameStartr, along with a generate Function 
         */
        export class AbstractOptionsGenerator implements IOptionsGenerator {
            /**
             * 
             */
            protected UserWrapper: UserWrappr.UserWrappr;

            /**
             * 
             */
            protected GameStarter: IGameStartr;

            /**
             * @param {UserWrappr} UserWrappr
             */
            constructor(UserWrapper: UserWrappr.UserWrappr) {
                this.UserWrapper = UserWrapper;
                this.GameStarter = this.UserWrapper.getGameStarter();
            }

            /**
             * Generates a control element based on the provided schema.
             */
            generate(schema: ISchema): HTMLDivElement {
                throw new Error("AbstractOptionsGenerator is abstract. Subclass it.");
            }

            /**
             * Recursively searches for an element with the "control" class
             * that's a parent of the given element.
             * 
             * @param {HTMLElement} element
             * @return {HTMLElement}
             */
            protected getParentControlDiv(element: HTMLElement): HTMLElement {
                if (element.className === "control") {
                    return element;
                } else if (!element.parentNode) {
                    return element;
                }

                return this.getParentControlDiv(element.parentElement);
            }

            /**
             *
             */
            protected ensureLocalStorageButtonValue(
                child: HTMLDivElement,
                details: IOptionsButtonSchema,
                schema: IOptionsButtonsSchema): void {
                var key: string = schema.title + "::" + details.title,
                    valueDefault: string = details.source.call(this, this.GameStarter).toString(),
                    value: string;

                child.setAttribute("localStorageKey", key);
                this.GameStarter.ItemsHolder.addItem(key, {
                    "storeLocally": true,
                    "valueDefault": valueDefault
                });

                value = this.GameStarter.ItemsHolder.getItem(key);
                if (value.toString().toLowerCase() === "true") {
                    details[schema.keyActive || "active"] = true;
                    schema.callback.call(this, this.GameStarter, schema, child);
                }
            }

            /**
             * Ensures an input's required local storage value is being stored,
             * and adds it to the internal GameStarter.ItemsHolder if not. If it
             * is, and the child's value isn't equal to it, the value is set.
             * 
             * @param {Mixed} childRaw   An input or select element, or an Array
             *                           thereof. 
             * @param {Object} details   Details containing the title of the item 
             *                           and the source Function to get its value.
             * @param {Object} schema   The container schema this child is within.
             */
            protected ensureLocalStorageInputValue(childRaw: IChoiceElement | IChoiceElement[], details: IOption, schema: ISchema): void {
                if (childRaw.constructor === Array) {
                    this.ensureLocalStorageValues(<IInputElement[]>childRaw, details, schema);
                    return;
                }

                var child: IInputElement | ISelectElement = <IInputElement | ISelectElement>childRaw,
                    key: string = schema.title + "::" + details.title,
                    valueDefault: string = details.source.call(this, this.GameStarter).toString(),
                    value: string;

                child.setAttribute("localStorageKey", key);
                this.GameStarter.ItemsHolder.addItem(key, {
                    "storeLocally": true,
                    "valueDefault": valueDefault
                });

                value = this.GameStarter.ItemsHolder.getItem(key);
                if (value !== "" && value !== child.value) {
                    child.value = value;

                    if (child.setValue) {
                        child.setValue(value);
                    } else if (child.onchange) {
                        child.onchange(undefined);
                    } else if (child.onclick) {
                        child.onclick(undefined);
                    }
                }
            }

            /**
             * The equivalent of ensureLocalStorageValue for an entire set of 
             * elements, running the equivalent logic on all of them.
             * 
             * @param {Mixed} childRaw   An Array of input or select elements.
             * @param {Object} details   Details containing the title of the item 
             *                           and the source Function to get its value.
             * @param {Object} schema   The container schema this child is within.
             */
            protected ensureLocalStorageValues(children: (IInputElement | ISelectElement)[], details: IOption, schema: ISchema): void {
                var keyGeneral: string = schema.title + "::" + details.title,
                    values: any[] = details.source.call(this, this.GameStarter),
                    key: string,
                    value: any,
                    child: IInputElement | ISelectElement,
                    i: number;

                for (i = 0; i < children.length; i += 1) {
                    key = keyGeneral + "::" + i;
                    child = children[i];
                    child.setAttribute("localStorageKey", key);

                    this.GameStarter.ItemsHolder.addItem(key, {
                        "storeLocally": true,
                        "valueDefault": values[i]
                    });

                    value = this.GameStarter.ItemsHolder.getItem(key);
                    if (value !== "" && value !== child.value) {
                        child.value = value;

                        if (child.onchange) {
                            child.onchange(undefined);
                        } else if (child.onclick) {
                            child.onclick(undefined);
                        }
                    }
                }
            }

            /**
             * Stores an element's value in the internal GameStarter.ItemsHolder,
             * if it has the "localStorageKey" attribute.
             * 
             * @param {HTMLElement} child   An element with a value to store.
             * @param {Mixed} value   What value is to be stored under the key.
             */
            protected storeLocalStorageValue(child: IInputElement | ISelectElement, value: any): void {
                var key: string = child.getAttribute("localStorageKey");

                if (key) {
                    this.GameStarter.ItemsHolder.setItem(key, value);
                    this.GameStarter.ItemsHolder.saveItem(key);
                }
            }
        }

        /**
         * A buttons generator for an options section that contains any number
         * of general buttons.
         */
        export class OptionsButtonsGenerator extends AbstractOptionsGenerator implements IOptionsGenerator {
            generate(schema: IOptionsButtonsSchema): HTMLDivElement {
                var output: HTMLDivElement = document.createElement("div"),
                    options: IOptionsButtonSchema[] = schema.options instanceof Function
                        ? (<IOptionSource>schema.options).call(self, this.GameStarter)
                        : schema.options,
                    optionKeys: string[] = Object.keys(options),
                    keyActive: string = schema.keyActive || "active",
                    classNameStart: string = "select-option options-button-option",
                    scope: OptionsButtonsGenerator = this,
                    option: IOptionsButtonSchema,
                    element: HTMLDivElement,
                    i: number;

                output.className = "select-options select-options-buttons";

                for (i = 0; i < optionKeys.length; i += 1) {
                    option = options[optionKeys[i]];

                    element = document.createElement("div");
                    element.className = classNameStart;
                    element.textContent = optionKeys[i];

                    element.onclick = function (schema: IOptionsButtonSchema, element: HTMLDivElement): void {
                        if (scope.getParentControlDiv(element).getAttribute("active") !== "on") {
                            return;
                        }
                        schema.callback.call(scope, scope.GameStarter, schema, element);

                        if (element.getAttribute("option-enabled") === "true") {
                            element.setAttribute("option-enabled", "false");
                            element.className = classNameStart + " option-disabled";
                        } else {
                            element.setAttribute("option-enabled", "true");
                            element.className = classNameStart + " option-enabled";
                        }
                    }.bind(this, schema, element);

                    this.ensureLocalStorageButtonValue(element, option, schema);

                    if (option[keyActive]) {
                        element.className += " option-enabled";
                        element.setAttribute("option-enabled", "true");
                    } else if (schema.assumeInactive) {
                        element.className += " option-disabled";
                        element.setAttribute("option-enabled", "false");
                    } else {
                        element.setAttribute("option-enabled", "true");
                    }

                    output.appendChild(element);
                }

                return output;
            }
        }

        /**
         * An options generator for a table of options,.
         */
        export class OptionsTableGenerator extends AbstractOptionsGenerator implements IOptionsGenerator {
            protected optionTypes: IOptionsTableTypes = {
                "Boolean": this.setBooleanInput,
                "Keys": this.setKeyInput,
                "Number": this.setNumberInput,
                "Select": this.setSelectInput,
                "ScreenSize": this.setScreenSizeInput
            };

            generate(schema: IOptionsTableSchema): HTMLDivElement {
                var output: HTMLDivElement = document.createElement("div"),
                    table: HTMLTableElement = document.createElement("table"),
                    option: IOptionsTableOption,
                    action: IOptionsTableAction,
                    row: HTMLTableRowElement | HTMLDivElement,
                    label: HTMLTableDataCellElement,
                    input: HTMLTableDataCellElement,
                    child: IInputElement | ISelectElement,
                    i: number;

                output.className = "select-options select-options-table";

                if (schema.options) {
                    for (i = 0; i < schema.options.length; i += 1) {
                        row = document.createElement("tr");
                        label = document.createElement("td");
                        input = document.createElement("td");

                        option = schema.options[i];

                        label.className = "options-label-" + option.type;
                        label.textContent = option.title;

                        input.className = "options-cell-" + option.type;

                        row.appendChild(label);
                        row.appendChild(input);

                        child = this.optionTypes[schema.options[i].type].call(this, input, option, schema);
                        if (option.storeLocally) {
                            this.ensureLocalStorageInputValue(child, option, schema);
                        }

                        table.appendChild(row);
                    }
                }

                output.appendChild(table);

                if (schema.actions) {
                    for (i = 0; i < schema.actions.length; i += 1) {
                        row = document.createElement("div");

                        action = schema.actions[i];

                        row.className = "select-option options-button-option";
                        row.textContent = action.title;
                        row.onclick = action.action.bind(this, this.GameStarter);

                        output.appendChild(row);
                    }
                }

                return output;
            }

            protected setBooleanInput(input: IInputElement, details: IOptionsTableBooleanOption, schema: ISchema): IInputElement {
                var status: boolean = details.source.call(this, this.GameStarter),
                    statusClass: string = status ? "enabled" : "disabled",
                    scope: OptionsTableGenerator = this;

                input.className = "select-option options-button-option option-" + statusClass;
                input.textContent = status ? "on" : "off";

                input.onclick = function (): void {
                    input.setValue(input.textContent === "off");
                };

                input.setValue = function (newStatus: string | boolean): void {
                    if (newStatus.constructor === String) {
                        if (newStatus === "false" || newStatus === "off") {
                            newStatus = false;
                        } else if (newStatus === "true" || newStatus === "on") {
                            newStatus = true;
                        }
                    }

                    if (newStatus) {
                        details.enable.call(scope, scope.GameStarter);
                        input.textContent = "on";
                        input.className = input.className.replace("disabled", "enabled");
                    } else {
                        details.disable.call(scope, scope.GameStarter);
                        input.textContent = "off";
                        input.className = input.className.replace("enabled", "disabled");
                    }

                    if (details.storeLocally) {
                        scope.storeLocalStorageValue(input, newStatus.toString());
                    }
                };

                return input;
            }

            protected setKeyInput(input: IInputElement, details: IOptionsTableKeysOption, schema: ISchema): ISelectElement[] {
                var values: string = details.source.call(this, this.GameStarter),
                    possibleKeys: string[] = this.UserWrapper.getAllPossibleKeys(),
                    children: ISelectElement[] = [],
                    child: ISelectElement,
                    scope: OptionsTableGenerator = this,
                    valueLower: string,
                    i: number,
                    j: number;

                for (i = 0; i < values.length; i += 1) {
                    valueLower = values[i].toLowerCase();

                    child = <ISelectElement>document.createElement("select");
                    child.className = "options-key-option";
                    child.value = child.valueOld = valueLower;

                    for (j = 0; j < possibleKeys.length; j += 1) {
                        child.appendChild(new Option(possibleKeys[j]));

                        // Setting child.value won't work in IE or Edge...
                        if (possibleKeys[j] === valueLower) {
                            child.selectedIndex = j;
                        }
                    }

                    child.onchange = (function (child: ISelectElement): void {
                        details.callback.call(scope, scope.GameStarter, child.valueOld, child.value);
                        if (details.storeLocally) {
                            scope.storeLocalStorageValue(child, child.value);
                        }
                    }).bind(undefined, child);

                    children.push(child);
                    input.appendChild(child);
                }

                return children;
            }

            protected setNumberInput(input: IInputElement, details: IOptionsTableNumberOption, schema: ISchema): IInputElement {
                var child: IInputElement = <UISchemas.IInputElement>document.createElement("input"),
                    scope: OptionsTableGenerator = this;

                child.type = "number";
                child.value = Number(details.source.call(scope, scope.GameStarter)).toString();
                child.min = (details.minimum || 0).toString();
                child.max = (details.maximum || Math.max(details.minimum + 10, 10)).toString();

                child.onchange = child.oninput = function (): void {
                    if (child.checkValidity()) {
                        details.update.call(scope, scope.GameStarter, child.value);
                    }
                    if (details.storeLocally) {
                        scope.storeLocalStorageValue(child, child.value);
                    }
                };

                input.appendChild(child);

                return child;
            }

            protected setSelectInput(input: ISelectElement, details: IOptionsTableSelectOption, schema: ISchema): ISelectElement {
                var child: ISelectElement = <ISelectElement>document.createElement("select"),
                    options: string[] = details.options(this.GameStarter),
                    scope: OptionsTableGenerator = this,
                    i: number;

                for (i = 0; i < options.length; i += 1) {
                    child.appendChild(new Option(options[i]));
                }

                child.value = details.source.call(scope, scope.GameStarter);

                child.onchange = function (): void {
                    details.update.call(scope, scope.GameStarter, child.value);
                    child.blur();

                    if (details.storeLocally) {
                        scope.storeLocalStorageValue(child, child.value);
                    }
                };

                input.appendChild(child);

                return child;
            }

            protected setScreenSizeInput(input: ISelectElement, details: IOptionsTableScreenSizeOption, schema: ISchema): ISelectElement {
                var scope: OptionsTableGenerator = this,
                    child: ISelectElement;

                details.options = function (): string[] {
                    return Object.keys(scope.UserWrapper.getSizes());
                };

                details.source = function (): string {
                    return scope.UserWrapper.getCurrentSize().name;
                };

                details.update = function (GameStarter: IGameStartr, value: IUserWrapprSizeSummary | string): ISelectElement {
                    if (value === scope.UserWrapper.getCurrentSize()) {
                        return undefined;
                    }

                    scope.UserWrapper.setCurrentSize(value);
                };
                child = scope.setSelectInput(input, details, schema);

                return child;
            }
        }

        /**
         * Options generator for a LevelEditr dialog.
         */
        export class LevelEditorGenerator extends AbstractOptionsGenerator implements IOptionsGenerator {
            generate(schema: IOptionsEditorSchema): HTMLDivElement {
                var output: HTMLDivElement = document.createElement("div"),
                    starter: HTMLDivElement = document.createElement("div"),
                    betweenOne: HTMLDivElement = document.createElement("div"),
                    betweenTwo: HTMLDivElement = document.createElement("div"),
                    uploader: HTMLDivElement = this.createUploaderDiv(),
                    mapper: HTMLDivElement = this.createMapSelectorDiv(schema),
                    scope: LevelEditorGenerator = this;

                output.className = "select-options select-options-level-editor";

                starter.className = "select-option select-option-large options-button-option";
                starter.innerHTML = "Start the <br /> Level Editor!";
                starter.onclick = function (): void {
                    scope.GameStarter.LevelEditor.enable();
                };

                betweenOne.className = betweenTwo.className = "select-option-title";
                betweenOne.innerHTML = betweenTwo.innerHTML = "<em>- or -</em><br />";

                output.appendChild(starter);
                output.appendChild(betweenOne);
                output.appendChild(uploader);
                output.appendChild(betweenTwo);
                output.appendChild(mapper);

                return output;
            }

            protected createUploaderDiv(): HTMLDivElement {
                var uploader: HTMLDivElement = document.createElement("div"),
                    input: HTMLInputElement = document.createElement("input");

                uploader.className = "select-option select-option-large options-button-option";
                uploader.innerHTML = "Continue an<br />editor file!";
                uploader.setAttribute("textOld", uploader.textContent);

                input.type = "file";
                input.className = "select-upload-input";
                input.onchange = this.handleFileDrop.bind(this, input, uploader);

                uploader.ondragenter = this.handleFileDragEnter.bind(this, uploader);
                uploader.ondragover = this.handleFileDragOver.bind(this, uploader);
                uploader.ondragleave = input.ondragend = this.handleFileDragLeave.bind(this, uploader);
                uploader.ondrop = this.handleFileDrop.bind(this, input, uploader);
                uploader.onclick = input.click.bind(input);

                uploader.appendChild(input);

                return uploader;
            }

            protected createMapSelectorDiv(schema: IOptionsEditorSchema): HTMLDivElement {
                var expanded: boolean = true,
                    generatorName: string = "MapsGrid",
                    container: HTMLDivElement = <HTMLDivElement>this.GameStarter.createElement(
                        "div",
                        {
                            "className": "select-options-group select-options-editor-maps-selector"
                        }),
                    toggler: HTMLDivElement = <HTMLDivElement>this.GameStarter.createElement(
                        "div",
                        {
                            "className": "select-option select-option-large options-button-option"
                        }),
                    mapsOut: HTMLDivElement = <HTMLDivElement>this.GameStarter.createElement(
                        "div",
                        {
                            "className": "select-options-holder select-options-editor-maps-holder"
                        }),
                    mapsIn: HTMLDivElement = this.UserWrapper.getGenerators()[generatorName].generate(
                        this.GameStarter.proliferate(
                            {
                                "callback": schema.callback
                            },
                            schema.maps));

                toggler.onclick = function (event?: Event): void {
                    expanded = !expanded;

                    if (expanded) {
                        toggler.textContent = "(cancel)";
                        mapsOut.style.position = "";
                        mapsIn.style.height = "";
                    } else {
                        toggler.innerHTML = "Edit a <br />built-in map!";
                        mapsOut.style.position = "absolute";
                        mapsIn.style.height = "0";
                    }

                    if (!container.parentElement) {
                        return;
                    }

                    [].slice.call(container.parentElement.children)
                        .forEach(function (element: HTMLElement): void {
                            if (element !== container) {
                                element.style.display = (expanded ? "none" : "block");
                            }
                        });
                };

                toggler.onclick(null);

                mapsOut.appendChild(mapsIn);
                container.appendChild(toggler);
                container.appendChild(mapsOut);

                return container;
            }

            protected handleFileDragEnter(uploader: HTMLDivElement, event: LevelEditr.IDataMouseEvent): void {
                if (event.dataTransfer) {
                    event.dataTransfer.dropEffect = "copy";
                }
                uploader.className += " hovering";
            }

            protected handleFileDragOver(uploader: HTMLElement, event: MouseEvent): boolean {
                event.preventDefault();
                return false;
            }

            protected handleFileDragLeave(element: HTMLElement, event: LevelEditr.IDataMouseEvent): void {
                if (event.dataTransfer) {
                    event.dataTransfer.dropEffect = "none";
                }
                element.className = element.className.replace(" hovering", "");
            }

            protected handleFileDrop(input: HTMLInputElement, uploader: HTMLDivElement, event: LevelEditr.IDataMouseEvent): void {
                var files: FileList = input.files || event.dataTransfer.files,
                    file: File = files[0],
                    reader: FileReader = new FileReader();

                this.handleFileDragLeave(input, event);
                event.preventDefault();
                event.stopPropagation();

                reader.onprogress = this.handleFileUploadProgress.bind(this, file, uploader);
                reader.onloadend = this.handleFileUploadCompletion.bind(this, file, uploader);

                reader.readAsText(file);
            }

            protected handleFileUploadProgress(file: File, uploader: HTMLDivElement, event: LevelEditr.IDataProgressEvent): void {
                var percent: number;

                if (!event.lengthComputable) {
                    return;
                }

                percent = Math.round((event.loaded / event.total) * 100);

                if (percent > 100) {
                    percent = 100;
                }

                uploader.innerText = "Uploading '" + file.name + "' (" + percent + "%)...";
            }

            protected handleFileUploadCompletion(file: File, uploader: HTMLDivElement, event: LevelEditr.IDataProgressEvent): void {
                this.GameStarter.LevelEditor.handleUploadCompletion(event);
                uploader.innerText = uploader.getAttribute("textOld");
            }
        }

        /**
         * Options generator for a grid of maps, along with other options.
         */
        export class MapsGridGenerator extends AbstractOptionsGenerator implements IOptionsGenerator {
            generate(schema: IOptionsMapGridSchema): HTMLDivElement {
                var output: HTMLDivElement = document.createElement("div");

                output.className = "select-options select-options-maps-grid";

                if (schema.rangeX && schema.rangeY) {
                    output.appendChild(this.generateRangedTable(schema));
                }

                if (schema.extras) {
                    this.appendExtras(output, schema);
                }

                return output;
            }

            generateRangedTable(schema: IOptionsMapGridSchema): HTMLTableElement {
                var scope: MapsGridGenerator = this,
                    table: HTMLTableElement = document.createElement("table"),
                    rangeX: number[] = schema.rangeX,
                    rangeY: number[] = schema.rangeY,
                    row: HTMLTableRowElement,
                    cell: HTMLTableCellElement,
                    i: number,
                    j: number;

                for (i = rangeY[0]; i <= rangeY[1]; i += 1) {
                    row = document.createElement("tr");
                    row.className = "maps-grid-row";

                    for (j = rangeX[0]; j <= rangeX[1]; j += 1) {
                        cell = document.createElement("td");
                        cell.className = "select-option maps-grid-option maps-grid-option-range";
                        cell.textContent = i + "-" + j;
                        cell.onclick = (function (callback: () => any): void {
                            if (scope.getParentControlDiv(cell).getAttribute("active") === "on") {
                                callback();
                            }
                        }).bind(scope, schema.callback.bind(scope, scope.GameStarter, schema, cell));
                        row.appendChild(cell);
                    }

                    table.appendChild(row);
                }

                return table;
            }

            appendExtras(output: HTMLDivElement, schema: IOptionsMapGridSchema): void {
                var element: HTMLDivElement,
                    extra: IOptionsMapGridExtra,
                    i: string,
                    j: number;

                for (i in schema.extras) {
                    if (!schema.extras.hasOwnProperty(i)) {
                        continue;
                    }

                    extra = schema.extras[i];
                    element = document.createElement("div");

                    element.className = "select-option maps-grid-option maps-grid-option-extra";
                    element.textContent = extra.title;
                    element.setAttribute("value", extra.title);
                    element.onclick = extra.callback.bind(this, this.GameStarter, schema, element);
                    output.appendChild(element);

                    if (extra.extraElements) {
                        for (j = 0; j < extra.extraElements.length; j += 1) {
                            output.appendChild(this.GameStarter.createElement.apply(this.GameStarter, extra.extraElements[j]));
                        }
                    }
                }
            }
        }
    }
}
