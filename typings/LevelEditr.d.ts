/// <reference path="../typings/AreaSpawnr.d.ts" />
/// <reference path="../typings/AudioPlayr.d.ts" />
/// <reference path="../typings/ChangeLinr.d.ts" />
/// <reference path="../typings/DeviceLayr.d.ts" />
/// <reference path="../typings/EightBittr.d.ts" />
/// <reference path="../typings/FPSAnalyzr.d.ts" />
/// <reference path="../typings/GamesRunnr.d.ts" />
/// <reference path="../typings/GameStartr.d.ts" />
/// <reference path="../typings/GroupHoldr.d.ts" />
/// <reference path="../typings/InputWritr.d.ts" />
/// <reference path="../typings/ItemsHoldr.d.ts" />
/// <reference path="../typings/MapsCreatr.d.ts" />
/// <reference path="../typings/MapScreenr.d.ts" />
/// <reference path="../typings/MathDecidr.d.ts" />
/// <reference path="../typings/ModAttachr.d.ts" />
/// <reference path="../typings/NumberMakr.d.ts" />
/// <reference path="../typings/ObjectMakr.d.ts" />
/// <reference path="../typings/PixelDrawr.d.ts" />
/// <reference path="../typings/PixelRendr.d.ts" />
/// <reference path="../typings/QuadsKeepr.d.ts" />
/// <reference path="../typings/ScenePlayr.d.ts" />
/// <reference path="../typings/StringFilr.d.ts" />
/// <reference path="../typings/ThingHittr.d.ts" />
/// <reference path="../typings/TimeHandlr.d.ts" />
/// <reference path="../typings/TouchPassr.d.ts" />
/// <reference path="../typings/WorldSeedr.d.ts" />
/// <reference path="../typings/js-beautify.d.ts" />
declare namespace LevelEditr {
    interface IThing extends GameStartr.IThing {
        dead: boolean;
        outerok?: number;
    }
    interface IPreThing extends MapsCreatr.IPreThing {
        thing: IThing;
        xloc: number;
        yloc: number;
    }
    interface IPreThingDescriptor {
        offsetTop?: number;
        offsetLeft?: number;
        width?: IPreThingDimensionDescriptor;
        height?: IPreThingDimensionDescriptor;
        options?: {
            [i: string]: IPreThingDimensionDescriptor;
        };
    }
    interface IPreThingDimensionDescriptor {
        type?: string;
        value?: any;
        Infinite?: any;
        mod?: number;
        real?: number;
    }
    interface IMapRaw extends MapsCreatr.IMapRaw {
        areas: {
            [i: number]: IAreaRaw;
            [i: string]: IAreaRaw;
        };
        time?: number;
    }
    interface IAreaRaw extends MapsCreatr.IAreaRaw {
        setting?: string;
    }
    interface IDataMouseEvent extends MouseEvent {
        dataTransfer: DataTransfer;
    }
    interface IDataProgressEvent extends ProgressEvent {
        currentTarget: IDataEventTarget;
    }
    interface IDataEventTarget extends EventTarget {
        result: string;
    }
    interface IThingIcon extends HTMLElement {
        options: any[];
    }
    interface IDisplayContainer {
        "container": HTMLElement;
        "scrollers": {
            "container": HTMLElement;
            "left": HTMLElement;
            "right": HTMLElement;
        };
        "gui": HTMLElement;
        "head": HTMLElement;
        "namer": HTMLInputElement;
        "minimizer": HTMLElement;
        "stringer": {
            "textarea": HTMLTextAreaElement;
            "messenger": HTMLElement;
        };
        "inputDummy": HTMLInputElement;
        "sections": {
            "ClickToPlace": {
                "container": HTMLElement;
                "Things": HTMLElement;
                "Macros": HTMLElement;
                "VisualOptions": HTMLElement;
            };
            "MapSettings": {
                "container": HTMLElement;
                "Time": HTMLSelectElement;
                "Setting": {
                    "Primary": HTMLSelectElement;
                    "Secondary": HTMLSelectElement;
                    "Tertiary": HTMLSelectElement;
                };
                "Area": HTMLSelectElement;
                "Location": HTMLSelectElement;
                "Entry": HTMLSelectElement;
            };
            "JSON": HTMLElement;
            "buttons": {
                "ClickToPlace": {
                    "container": HTMLElement;
                    "Things": HTMLElement;
                    "Macros": HTMLElement;
                };
                "MapSettings": HTMLElement;
                "JSON": HTMLElement;
            };
        };
    }
    interface ILevelEditrSettings {
        GameStarter: GameStartr.GameStartr;
        prethings: {
            [i: string]: IPreThing[];
        };
        thingGroups: string[];
        things: {
            [i: string]: IThing;
        };
        macros: {
            [i: string]: MapsCreatr.IMacro;
        };
        beautifier: (text: string) => string;
        mapNameDefault?: string;
        mapTimeDefault?: number;
        mapSettingDefault?: string;
        mapEntrances?: string[];
        mapDefault?: IMapRaw;
        blocksize?: number;
        keyUndefined?: string;
    }
    /**
     * GUI-based level creation & editing for GameStartr.
     */
    interface ILevelEditr {
        getEnabled(): boolean;
        enable(): void;
        disable(): void;
        minimize(): void;
        maximize(): void;
        startBuilding(): void;
        startPlaying(): void;
        downloadCurrentJSON(): void;
        setCurrentJSON(json: string): void;
        loadCurrentJSON(): void;
        beautify(text: string): string;
        handleUploadCompletion(event: IDataProgressEvent): void;
    }
    /**
     * GUI-based level creation & editing for GameStartr.
     */
    class LevelEditr implements ILevelEditr {
        /**
         * Whether the editor is currently visible and active.
         */
        private enabled;
        /**
         * The container game object to store Thing and map information
         */
        private GameStarter;
        /**
         * The GameStarter's settings before this LevelEditr was enabled
         */
        private oldInformation;
        /**
         * The listings of PreThings that the GUI displays
         */
        private prethings;
        /**
         * The listing of groups that Things may fall into
         */
        private thingGroups;
        /**
         * The complete list of Things that may be placed
         */
        private things;
        /**
         * The listings of macros that the GUI display
         */
        private macros;
        /**
         * The default String name of the map
         */
        private mapNameDefault;
        /**
         * The default integer time of the map
         */
        private mapTimeDefault;
        /**
         * The default String setting of the map's areas
         */
        private mapSettingDefault;
        /**
         * The allowed String entries of the map's locations
         */
        private mapEntrances;
        /**
         * The starting Object used as a default template for new maps
         */
        private mapDefault;
        /**
         * An Object containing the display's HTML elements
         */
        private display;
        /**
         * The current mode of editing as a string, such as "Build" or "Play"
         */
        private currentMode;
        /**
         * The current mode of click as a string, such as "Thing" or "Macro"
         */
        private currentClickMode;
        /**
         * What size "blocks" placed Things should snap to
         */
        private blocksize;
        /**
         * A Function to beautify text given to the map displayer, such as js_beautify
         */
        private beautifier;
        /**
         * The currently selected Thing to be placed
         */
        private currentPreThings;
        /**
         * The type string of the currently selected thing, such as "Koopa"
         */
        private currentTitle;
        /**
         * The current arguments for currentPreThings, such as { "smart": true }
         */
        private currentArgs;
        /**
         * Whether the pageStyle styles have been added to the page
         */
        private pageStylesAdded;
        /**
         * A key to use in dropdowns to should indicate an undefined value
         */
        private keyUndefined;
        /**
         * Whether clicking to place a Thing or macro is currently allowed.
         */
        private canClick;
        /**
         * @param {ILevelEditrSettings} settings
         */
        constructor(settings: ILevelEditrSettings);
        getEnabled(): boolean;
        /**
         *
         */
        getGameStarter(): GameStartr.GameStartr;
        /**
         *
         */
        getOldInformation(): any;
        /**
         *
         */
        getPreThings(): {
            [i: string]: IPreThingDimensionDescriptor[];
        };
        /**
         *
         */
        getThingGroups(): string[];
        /**
         *
         */
        getThings(): {
            [i: string]: IPreThingDescriptor;
        };
        /**
         *
         */
        getMacros(): {
            [i: string]: MapsCreatr.IMacro;
        };
        /**
         *
         */
        getMapNameDefault(): string;
        /**
         *
         */
        getMapTimeDefault(): number;
        /**
         *
         */
        getMapDefault(): IMapRaw;
        /**
         *
         */
        getDisplay(): IDisplayContainer;
        /**
         *
         */
        getCurrentMode(): string;
        /**
         *
         */
        getBlockSize(): number;
        /**
         *
         */
        getBeautifier(): (text: string) => string;
        /**
         *
         */
        getCurrentPreThings(): IPreThing[];
        /**
         *
         */
        getCurrentTitle(): string;
        /**
         *
         */
        getCurrentArgs(): any;
        /**
         *
         */
        getPageStylesAdded(): boolean;
        /**
         *
         */
        getKeyUndefined(): string;
        /**
         *
         */
        getCanClick(): boolean;
        /**
         *
         */
        enable(): void;
        /**
         *
         */
        disable(): void;
        /**
         *
         */
        minimize(): void;
        /**
         *
         */
        maximize(): void;
        /**
         *
         */
        startBuilding(): void;
        /**
         *
         */
        startPlaying(): void;
        /**
         *
         */
        downloadCurrentJSON(): void;
        /**
         *
         */
        setCurrentJSON(json: string): void;
        /**
         *
         */
        loadCurrentJSON(): void;
        /**
         *
         */
        beautify(text: string): string;
        /**
         *
         */
        handleUploadCompletion(event: IDataProgressEvent): void;
        /**
         *
         */
        private setCurrentMode(mode);
        /**
         *
         */
        private setCurrentClickMode(mode, event?);
        /**
         *
         */
        private setCurrentThing(title, x?, y?);
        /**
         *
         */
        private resetCurrentThings(event?);
        /**
         *
         */
        private clearCurrentThings();
        /**
         *
         */
        private setCurrentArgs(event?);
        /**
         *
         */
        private onMouseDownScrolling(direction, event);
        /**
         *
         */
        private onMouseUpScrolling(event);
        /**
         *
         */
        private onMouseMoveEditing(event);
        /**
         * Temporarily disables this.canClick, so double clicking doesn't happen.
         */
        private afterClick();
        /**
         *
         */
        private onClickEditingThing(event);
        /**
         *
         */
        private onClickEditingMacro(event);
        /**
         *
         */
        private onClickEditingGenericAdd(x, y, title, args);
        /**
         *
         */
        private onThingIconClick(title, event);
        /**
         *
         */
        private onMacroIconClick(title, description, options, event?);
        /**
         *
         */
        private createPrethingsHolder(prethings);
        /**
         *
         */
        private generateCurrentArgs();
        /**
         *
         */
        private setMapName();
        /**
         *
         *
         * @param {Boolean} fromGui   Whether this is from the MapSettings section
         *                            of the GUI (true), or from the Raw JSON
         *                            section (false).
         */
        private setMapTime(fromGui);
        /**
         *
         *
         * @param {Boolean} fromGui   Whether this is from the MapSettings section
         *                            of the GUI (true), or from the Raw JSON
         *                            section (false).
         */
        private setMapSetting(fromGui, event?);
        /**
         *
         */
        private setLocationArea();
        /**
         *
         *
         * @param {Boolean} fromGui   Whether this is from the MapSettings section
         *                            of the GUI (true), or from the Raw JSON
         *                            section (false).
         */
        private setMapEntry(fromGui);
        /**
         *
         */
        private setCurrentLocation();
        /**
         *
         */
        private addLocationToMap();
        /**
         *
         */
        private addAreaToMap();
        /**
         *
         */
        private resetAllVisualOptionSelects(className, options);
        private getMapObject();
        private getMapObjectAndTry(event?);
        /**
         *
         */
        private getCurrentArea();
        /**
         *
         */
        private getCurrentAreaObject(map?);
        /**
         *
         */
        private getCurrentLocation();
        /**
         *
         */
        private getCurrentLocationObject(map);
        /**
         *
         */
        private addMapCreationThing(x, y);
        private addMapCreationMacro(x, y);
        private resetDisplay();
        private resetDisplayThinCheck();
        private resetDisplayGui();
        private resetDisplayScrollers();
        private resetDisplayHead();
        private resetDisplaySectionChoosers();
        private resetDisplayOptionsList();
        private resetDisplayOptionsListSubOptionsMenu();
        private resetDisplayMapSettings();
        private resetDisplayMapSettingsCurrent();
        private resetDisplayMapSettingsMap();
        private resetDisplayMapSettingsArea();
        private resetDisplayMapSettingsLocation();
        private resetDisplayJSON();
        private resetDisplayVisualContainers();
        private resetDisplayButtons();
        /**
         * Adds the Things and Macros menus to the EditorOptionsList container in
         * the main GUI.
         */
        private resetDisplayOptionsListSubOptions();
        /**
         * Creates the menu of icons for Things, with a dropdown select to choose
         * the groupings being displayed. These icons, when clicked, trigger
         * this.onThingIconClick on the Thing's title.
         */
        private resetDisplayOptionsListSubOptionsThings();
        /**
         * Creates the menu of (text) icons for Macros. When clicked, these trigger
         * this.onMacroIconClick on the macro's title, description, and options.
         */
        private resetDisplayOptionsListSubOptionsMacros();
        /**
         *
         */
        private setSectionClickToPlace();
        /**
         *
         */
        private setSectionMapSettings(event?);
        /**
         *
         */
        private setSectionJSON(event?);
        /**
         *
         */
        private setSectionClickToPlaceThings(event?);
        /**
         *
         */
        private setSectionClickToPlaceMacros(event?);
        /**
         *
         */
        private setTextareaValue(value, doBeautify?);
        /**
         *
         */
        private beautifyTextareaValue();
        /**
         *
         */
        private setVisualOptions(name, description, options);
        /**
         *
         */
        private createVisualOption(optionRaw);
        /**
         *
         */
        private createVisualOptionObject(optionRaw);
        /**
         *
         */
        private createVisualOptionBoolean();
        /**
         *
         */
        private createVisualOptionNumber(option);
        /**
         *
         */
        private createVisualOptionSelect(option);
        /**
         *
         */
        private createVisualOptionString(option);
        /**
         *
         */
        private createVisualOptionLocation(option);
        /**
         *
         */
        private createVisualOptionArea(option);
        /**
         *
         */
        private createVisualOptionEverything(option);
        /**
         *
         */
        private resetDisplayMap();
        /**
         *
         */
        private setDisplayMap(doDisableThings?);
        /**
         *
         */
        private getMapName();
        /**
         *
         */
        private roundTo(num, rounding);
        /**
         *
         */
        private stringifySmart(object?);
        /**
         *
         *
         * @remarks Settings .editor=true informs the area that the player
         *          should respawn upon death without resetting gameplay.
         */
        private parseSmart(text);
        /**
         *
         */
        private jsonReplacerSmart(key, value);
        /**
         *
         */
        private disableThing(thing, opacity?);
        /**
         *
         */
        private disableAllThings();
        /**
         *
         */
        private addThingAndDisableEvents(thing, x?, y?);
        /**
         *
         */
        private clearAllThings();
        /**
         *
         */
        private getNormalizedX(raw);
        /**
         *
         */
        private getNormalizedY(raw);
        /**
         *
         */
        private getNormalizedThingArguments(args);
        /**
         *
         */
        private getNormalizedMouseEventCoordinates(event, referenceThing?);
        /**
         *
         */
        private getPrethingSizeArguments(descriptor);
        /**
         *
         */
        private getPrethingSizeArgument(descriptor);
        /**
         *
         */
        private createSelect(options, attributes);
        /**
         *
         */
        private applyElementAttributes(element, attributes);
        /**
         *
         */
        private downloadFile(name, content);
        /**
         *
         */
        private killCurrentPreThings();
        /**
         *
         */
        private handleUploadStart(event);
        /**
         *
         */
        private handleDragEnter(event);
        /**
         *
         */
        private handleDragOver(event);
        /**
         *
         */
        private handleDragDrop(event);
        /**
         *
         */
        private cancelEvent(event?);
        private createPageStyles();
    }
}
declare var module: any;
