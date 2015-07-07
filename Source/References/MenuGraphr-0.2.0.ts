/// <reference path="EightBittr-0.2.0.ts" />
/// <reference path="GroupHoldr-0.2.1.ts" />
/// <reference path="ItemsHoldr-0.2.1.ts" />
/// <reference path="MapScreenr-0.2.1.ts" />
/// <reference path="ObjectMakr-0.2.2.ts" />
/// <reference path="TimeHandlr-0.2.0.ts" />

declare module MenuGraphr {
    export interface IGameStartr extends EightBittr.IEightBittr {
        GroupHolder: GroupHoldr.IGroupHoldr;
        ItemsHolder: ItemsHoldr.IItemsHoldr;
        MapScreener: MapScreenr.IMapScreenr;
        ObjectMaker: ObjectMakr.IObjectMakr;
        TimeHandler: TimeHandlr.ITimeHandlr;
        addThing(thing: IThing | string | any[], left?: number, top?: number): IThing;
        killNormal(thing: IThing): void;
        setHeight(thing: IThing, height: number);
        setWidth(thing: IThing, width: number);
    }

    export interface IThing extends EightBittr.IThing {
        name: string;
        groupType: string;
        hidden: boolean;
    }

    export interface IMenusContainer {
        [i: string]: IMenu;
    }

    export interface IMenu extends IThing {
        backMenu?: string;
        callback?: (...args: any[]) => void;
        children: IThing[];
        childrenSchemas: IMenuChildSchema[];
        finishAutomatically?: boolean;
        finishAutomaticSpeed?: number;
        ignoreA?: boolean;
        ignoreB?: boolean;
        ignoreProgressB?: boolean;
        keepOnBack?: boolean;
        killOnB?: string[];
        onActive?: (name: string) => void;
        onBPress?: (name: string) => void;
        onDown?: (GameStartr: IGameStartr) => void;
        onInactive?: (name: string) => void;
        onLeft?: (GameStartr: IGameStartr) => void;
        onMenuDelete?: (GameStartr: IGameStartr) => void;
        onRight?: (GameStartr: IGameStartr) => void;
        onUp?: (GameStartr: IGameStartr) => void;
        progress?: IMenuProgress;
        startMenu?: string;
        textAreaWidth?: number;
        textArrowXOffset?: number;
        textArrowYOffset?: number;
        textHeight?: number;
        textPaddingX?: number;
        textPaddingY?: number;
        textSpeed?: number;
        textStartingX?: string;
        textWidth?: number;
        textWidthMultiplier?: number;
        textX?: number;
        textXOffset?: number;
        textYOffset?: number;
    }

    export interface IMenuProgress {
        complete?: boolean;
        onCompletion?: (...args: any[]) => void;
        working?: boolean;
    }

    export interface IListMenu extends IMenu {
        arrow: IThing;
        arrowXOffset?: number;
        arrowYOffset?: number;
        grid: any[][];
        gridColumns: number;
        gridRows: number;
        options: any[];
        optionChildren: any;
        progress: IListMenuProgress;
        scrollingAmount?: number;
        scrollingAmountReal?: number;
        scrollingItems?: number;
        selectedIndex: number[];
        textColumnWidth: number;
    }

    export interface IListMenuOptions {
        bottom?: any;
        options: any[]| { (): any[]; };
        selectedIndex?: number[];
    }

    export interface IListMenuProgress extends IMenuProgress {
        words: any;
        i: any;
        x: any;
        y: any;
    }

    export interface IMenuSchema {
        backMenu?: string;
        container?: string;
        finishAutomatically?: boolean;
        finishAutomaticSpeed?: number;
        ignoreA?: boolean;
        ignoreB?: boolean;
        ignoreProgressB?: boolean;
        keepOnBack?: boolean;
        position?: IMenuSchemaPosition;
        size?: IMenuSchemaSize;
        startMenu?: string;
        textAreaWidth?: number;
        textArrowXOffset?: number;
        textArrowYOffset?: number;
        textHeight?: number;
        textPaddingX?: number;
        textPaddingY?: number;
        textSpeed?: number;
        textStartingX?: string;
        textWidth?: number;
        textWidthMultiplier?: number;
        textXOffset?: number;
        textYOffset?: number;
    }

    export interface IMenuSchemaSize {
        width?: number;
        height?: number;
    }

    export interface IMenuSchemaPosition {
        horizontal?: string;
        offset?: IMenuSchemaPositionOffset;
        relative?: boolean;
        vertical?: string;
    }

    export interface IMenuSchemaPositionOffset {
        top?: number;
        right?: number;
        bottom?: number;
        left?: number;
    }

    export interface IMenuChildSchema {
        type: string;
    }

    export interface IMenuChildMenuSchema extends IMenuChildSchema {
        attributes: IMenuSchema;
        name: string;
    }

    export interface IMenuWordSchema extends IMenuChildSchema {
        position: IMenuSchemaPosition;
        size: IMenuSchemaSize;
        words: string[];
    }

    export interface IMenuThingSchema extends IMenuChildSchema {
        position: IMenuSchemaPosition;
        size: IMenuSchemaSize;
        thing: string;
        args: any;
    }

    export interface IMenuWordFiltered {
        command: string;
        length?: number;
        skipSpacing?: boolean;
        word?: string;
    }

    export interface IMenuWordCommand extends IMenuWordFiltered {
        applyUnitsize?: boolean;
        attribute: string;
        value: any;
    }

    export interface IMenuWordReset extends IMenuWordFiltered {
        attribute: string;
    }

    export interface IMenuWordPosition extends IMenuWordFiltered {
        x?: number;
        y?: number;
    }

    export interface IMenuWordLength extends IMenuWordFiltered { }

    export interface IText extends IThing {
        paddingY: number;
    }

    export interface IMenuGraphrSettings {
        GameStarter: IGameStartr;
        schemas?: {
            [i: string]: IMenuSchema;
        };
        aliases?: {
            [i: string]: string;
        };
        replacements?: {
            [i: string]: string;
        };
        replacerKey?: string;
        replaceFromItemsHolder?: boolean;
        replacementStatistics?: {
            [i: string]: boolean;
        };
    }

    export interface IMenuGraphr {
        getMenus(): IMenusContainer;
        getMenu(name: string): IMenu;
        getExistingMenu(name: string): IMenu;
        getAliases(): { [i: string]: string };
        getReplacements(): { [i: string]: string };
        createMenu(name: string, attributes?: IMenuSchema): void;
        createChild(name: string, schema: IMenuChildSchema): void;
        createMenuWord(name: string, schema: IMenuWordSchema): void;
        createMenuThing(name: string, schema: IMenuThingSchema): IThing;
        hideMenu(name: string): void;
        deleteMenu(name: string): void;
        deleteActiveMenu(): void;
        deleteMenuChild(child: IMenu): void;
        deleteMenuChildren(name: string): void;
        positionItem(
            item: IThing,
            size: IMenuSchemaSize,
            position: IMenuSchemaPosition,
            container: IMenu,
            skipAdd?: boolean): void;
        addMenuDialog(name: string, dialog?: any, onCompletion?: () => any): void;
        addMenuText(name: string, words: string | string[], onCompletion?: (...args: any[]) => void): void;
        addMenuWord(
            name: string,
            words: string[],
            i: number,
            x: number,
            y: number,
            onCompletion?: (...args: any[]) => void): IThing[];
        continueMenu(name: string): void;
        addMenuList(name: string, settings: IListMenuOptions): void;
        activateMenuList(name: string): void;
        deactivateMenuList(name: string): void;
        getMenuSelectedIndex(name: string): number[];
        getMenuSelectedOption(name: string): any;
        shiftSelectedIndex(name: string, dx: number, dy: number): void;
        setSelectedIndex(name: string, x: number, y: number): void;
        adjustVerticalScrollingListThings(name: string, dy: number, textPaddingY: number): void;
        selectMenuListOption(name: string): void;
        setActiveMenu(name: string): void;
        getActiveMenu(): IMenu;
        getActiveMenuName(): string;
        registerDirection(direction: number): void;
        registerLeft(): void;
        registerRight(): void;
        registerUp(): void;
        registerDown(): void;
        registerA(): void;
        registerB(): void;
        registerStart(): void;
    }
}


module MenuGraphr {
    /**
     * 
     */
    export class MenuGraphr {
        private GameStarter: IGameStartr;

        private menus: IMenusContainer;

        private activeMenu: IMenu;

        private schemas: {
            [i: string]: IMenuSchema;
        };

        private aliases: {
            [i: string]: string
        };

        private replacements: {
            [i: string]: string
        };

        private replacerKey: string;

        private replaceFromItemsHolder: boolean;

        private replacementStatistics: {
            [i: string]: boolean
        };

        /**
         * 
         */
        constructor(settings: IMenuGraphrSettings) {
            this.GameStarter = settings.GameStarter;

            this.schemas = settings.schemas || {};
            this.aliases = settings.aliases || {};
            this.replacements = settings.replacements || {};
            this.replacerKey = settings.replacerKey || "%%%%%%%";

            this.replaceFromItemsHolder = settings.replaceFromItemsHolder;
            this.replacementStatistics = settings.replacementStatistics;

            this.menus = {};
        }


        /* Simple gets
        */

        /**
         * 
         */
        getMenus(): IMenusContainer {
            return this.menus;
        }

        /**
         * 
         */
        getMenu(name: string): IMenu {
            return this.menus[name];
        }

        /**
         * 
         */
        getExistingMenu(name: string): IMenu {
            if (!this.menus[name]) {
                throw new Error("'" + name + "' menu does not exist.");
            }

            return this.menus[name];
        }

        /**
         * 
         */
        getAliases(): { [i: string]: string } {
            return this.aliases;
        }

        /**
         * 
         */
        getReplacements(): { [i: string]: string } {
            return this.replacements;
        }


        /* Menu positioning
        */

        /**
         * 
         */
        createMenu(name: string, attributes?: IMenuSchema): void {
            var schemaRaw: IMenuSchema = this.GameStarter.proliferate({}, this.schemas[name]),
                schema: IMenuSchema = this.GameStarter.proliferate(schemaRaw, attributes),
                menu: IMenu = this.GameStarter.ObjectMaker.make("Menu", schema),
                container: any = schema.container
                    ? this.menus[schema.container]
                    : {
                        "top": 0,
                        "left": 0,
                        "right": this.GameStarter.MapScreener.width,
                        "bottom": this.GameStarter.MapScreener.height,
                        "width": Math.ceil(this.GameStarter.MapScreener.width / this.GameStarter.unitsize),
                        "height": Math.ceil(this.GameStarter.MapScreener.height / this.GameStarter.unitsize),
                        "GameStarter": this.GameStarter,
                        "children": []
                    };

            this.deleteMenu(name);

            this.menus[name] = menu;
            menu.name = name;
            this.positionItem(menu, schema.size, schema.position, container);

            menu.children = [];
            menu.textAreaWidth = (menu.width - menu.textXOffset * 2) * this.GameStarter.unitsize;

            if (menu.childrenSchemas) {
                menu.childrenSchemas.forEach(this.createChild.bind(this, name));
            }

            if (container.children) {
                container.children.push(menu);
            }

            this.GameStarter.proliferate(menu, attributes);
        }

        /**
         * 
         */
        createChild(name: string, schema: IMenuChildSchema): void {
            switch (schema.type) {
                case "menu":
                    this.createMenu((<IMenuChildMenuSchema>schema).name,(<IMenuChildMenuSchema>schema).attributes);
                    break;
                case "text":
                    this.createMenuWord(name, <IMenuWordSchema>schema);
                    break;
                case "thing":
                    this.createMenuThing(name, <IMenuThingSchema>schema);
                    break;
            }
        }

        /**
         * 
         */
        createMenuWord(name: string, schema: IMenuWordSchema): void {
            var menu: IMenu = this.getExistingMenu(name),
                container: IMenu = this.GameStarter.ObjectMaker.make("Menu");

            this.positionItem(container, schema.size, schema.position, menu, true);

            menu.textX = container.left;
            this.addMenuWord(name, schema.words, 0, container.left, container.top)
        }

        /**
         * 
         */
        createMenuThing(name: string, schema: IMenuThingSchema): IThing {
            var menu: IMenu = this.getExistingMenu(name),
                thing: IThing = this.GameStarter.ObjectMaker.make(schema.thing, schema.args);

            this.positionItem(thing, schema.size, schema.position, menu);

            this.GameStarter.GroupHolder.switchObjectGroup(
                thing,
                thing.groupType,
                "Text");

            menu.children.push(thing);

            return thing;
        }

        /**
         * 
         */
        hideMenu(name: string): void {
            var menu: IMenu = this.menus[name];

            if (menu) {
                menu.hidden = true;
                this.deleteMenuChildren(name);
            }
        }

        /**
         * 
         */
        deleteMenu(name: string): void {
            var menu: IMenu = this.menus[name];

            if (menu) {
                this.deleteMenuChild(menu);
            }
        }

        /**
         * 
         */
        deleteActiveMenu(): void {
            if (this.activeMenu) {
                this.deleteMenu(this.activeMenu.name);
            }
        }

        /**
         * 
         */
        deleteMenuChild(child: IMenu): void {
            if (this.activeMenu === child) {
                if (child.backMenu) {
                    this.setActiveMenu(child.backMenu);
                } else {
                    this.activeMenu = undefined;
                }
            }

            if (child.killOnB) {
                child.killOnB.forEach(this.deleteMenu);
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
                child.children.forEach(this.deleteMenuChild)
            }
        }

        /**
         * 
         */
        deleteMenuChildren(name): void {
            var menu: IMenu = this.menus[name];

            if (menu && menu.children) {
                menu.children.forEach(this.deleteMenuChild);
            }
        }

        /**
         * 
         */
        positionItem(
            item: IThing,
            size: IMenuSchemaSize,
            position: IMenuSchemaPosition,
            container: IMenu,
            skipAdd?: boolean): void {
            var offset: IMenuSchemaPositionOffset,
                i: number;

            if (!position) {
                position = {};
                offset = {};
            } else {
                offset = position.offset || {};
            }

            if (!size) {
                size = {};
            }

            if (size.width) {
                this.GameStarter.setWidth(item, size.width);
            } else if (position.horizontal === "stretch") {
                this.GameStarter.setLeft(item, 0);
                this.GameStarter.setWidth(
                    item,
                    container.width - (offset.left || 0) - (offset.right || 0));
            }

            if (size.height) {
                this.GameStarter.setHeight(item, size.height);
            } else if (position.vertical === "stretch") {
                this.GameStarter.setTop(item, 0);
                this.GameStarter.setHeight(
                    item,
                    container.height - (offset.top || 0) - (offset.bottom || 0));
            }

            switch (position.horizontal) {
                case "center":
                    this.GameStarter.setMidXObj(item, container);
                    break;
                case "right":
                    this.GameStarter.setRight(item, container.right);
                    break;
                default:
                    this.GameStarter.setLeft(item, container.left);
                    break;
            }

            switch (position.vertical) {
                case "center":
                    this.GameStarter.setMidYObj(item, container);
                    break;
                case "bottom":
                    this.GameStarter.setBottom(item, container.bottom);
                    break;
                default:
                    this.GameStarter.setTop(item, container.top);
                    break;
            }

            if (offset.top) {
                this.GameStarter.shiftVert(
                    item, position.offset.top * this.GameStarter.unitsize);
            }

            if (offset.left) {
                this.GameStarter.shiftHoriz(
                    item, position.offset.left * this.GameStarter.unitsize);
            }

            if (!skipAdd) {
                this.GameStarter.addThing(item, item.left, item.top);
            }
        }


        /* Menu text
        */

        /**
         * 
         */
        addMenuDialog(name: string, dialog?: any, onCompletion?: () => any): void {
            if (!dialog) {
                dialog = [""];
            } else if (dialog.constructor === String) {
                dialog = [dialog];
            } else if (!(dialog instanceof Array)) {
                dialog = [String(dialog)];
            }

            this.addMenuText(name, dialog[0], function (): boolean {
                if (dialog.length === 1) {
                    if (this.menus[name].deleteOnFinish) {
                        this.deleteMenu(name);
                    }
                    if (onCompletion) {
                        return onCompletion();
                    }
                    return true;
                }

                this.deleteMenuChildren(name);
                this.addMenuDialog(name, dialog.slice(1), onCompletion);

                return false;
            });
        }

        /**
         * 
         */
        addMenuText(name: string, words: string | string[], onCompletion?: (...args: any[]) => void): void {
            var menu: IMenu = this.getExistingMenu(name),
                x: number = this.GameStarter.getMidX(menu), // - menu.textAreaWidth / 2,
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

            if (words.constructor === String) {
                words = (<string>words).split(/ /);
            }

            menu.callback = this.continueMenu;
            menu.textX = x;

            this.addMenuWord(name, <string[]>words, 0, x, y, onCompletion);
        }

        /**
         * 
         * 
         * @todo The calculation of whether a word can fit assumes equal width for
         *       all children, although apostrophes are tiny.
         */
        addMenuWord(name: string, words: string[], i: number, x: number, y: number, onCompletion?: (...args: any[]) => void): IThing[] {
            var menu: IMenu = this.getExistingMenu(name),
                word: string | IMenuWordFiltered = this.filterWord(words[i]),
                textProperties: any = this.GameStarter.ObjectMaker.getPropertiesOf("Text"),
                things: IThing[] = [],
                textWidth: number,
                textHeight: number,
                textPaddingX: number,
                textPaddingY: number,
                textSpeed: number,
                textWidthMultiplier: number,
                title: string | IMenuWordFiltered,
                character, j;

            // First, filter for commands that affect the containing menu
            if (word.constructor === Object && (<IMenuWordFiltered>word).command) {
                switch ((<IMenuWordFiltered>word).command) {
                    case "attribute":
                        menu[(<IMenuWordCommand>word).attribute + "Old"] = menu[(<IMenuWordCommand>word).attribute];
                        menu[(<IMenuWordCommand>word).attribute] = (<IMenuWordCommand>word).value;
                        if ((<IMenuWordCommand>word).applyUnitsize) {
                            menu[(<IMenuWordCommand>word).attribute] *= this.GameStarter.unitsize;
                        }
                        break;

                    case "attributeReset":
                        menu[(<IMenuWordReset>word).attribute] = menu[(<IMenuWordReset>word).attribute + "Old"];
                        break;

                    case "position":
                        if ((<IMenuWordPosition>word).x) {
                            x += (<IMenuWordPosition>word).x;
                        }
                        if ((<IMenuWordPosition>word).y) {
                            y += (<IMenuWordPosition>word).y;
                        }
                        break;
                }
            }

            // Numerics require any commands that should have affected the window 
            // to have already been applied
            textSpeed = menu.textSpeed;
            textWidth = (menu.textWidth || textProperties.width) * this.GameStarter.unitsize,
            textHeight = (menu.textHeight || textProperties.height) * this.GameStarter.unitsize,
            textPaddingX = (menu.textPaddingX || textProperties.paddingX) * this.GameStarter.unitsize;
            textPaddingY = (menu.textPaddingY || textProperties.paddingY) * this.GameStarter.unitsize;
            textWidthMultiplier = menu.textWidthMultiplier || 1;

            if (word.constructor === Object && (<IMenuWordFiltered>word).command) {
                title = this.filterWord(this.getCharacterEquivalent((<IMenuWordFiltered>word).word));

                switch ((<IMenuWordFiltered>word).command) {
                    // Length may be a String (for its length) or a direct number
                    case "padLeft":
                        if ((<any>word).length.constructor === String) {
                            word = this.stringOf(
                                " ",
                                (
                                    (<any>this.filterWord((<any>word).length)).length
                                    - (<any>title).length
                                    )
                                ) + this.filterWord(title);
                        } else {
                            word = this.stringOf(
                                " ",(<any>word).length - (<any>title).length
                                ) + title;
                        }
                        break;
                }
            }

            if (
                (word.constructor === String && word !== "\n")
                || word.constructor === Array
                ) {
                for (j = 0; j < (<string>word).length; j += 1) {
                    if (word[j] !== " ") {
                        title = "Char" + this.getCharacterEquivalent(word[j]);
                        character = this.GameStarter.ObjectMaker.make(<string>title);
                        character.paddingY = textPaddingY;
                        menu.children.push(character);
                        things.push(character);

                        if (textSpeed) {
                            this.GameStarter.TimeHandler.addEvent(
                                this.GameStarter.addThing.bind(this.GameStarter),
                                j * textSpeed,
                                character,
                                x,
                                y);
                        } else {
                            this.GameStarter.addThing(character, x, y);
                        }

                        x += textWidthMultiplier * (
                            character.width * this.GameStarter.unitsize + textPaddingX);
                    } else {
                        x += textWidth * textWidthMultiplier;
                    }
                }
            }

            if (i === words.length - 1) {
                menu.progress = {
                    "complete": true,
                    "onCompletion": onCompletion
                };
                if (menu.finishAutomatically) {
                    this.GameStarter.TimeHandler.addEvent(
                        onCompletion,
                        (word.length + (menu.finishAutomaticSpeed || 1)) * textSpeed);
                }
                return things;
            }

            if (!(<IMenuWordFiltered>word).skipSpacing) {
                if (
                    word === "\n"
                    || (
                        x + (
                            (this.filterWord(words[i + 1]).length + .5)
                            * textWidthMultiplier * textWidth
                            + menu.textXOffset * this.GameStarter.unitsize
                            )
                        > this.GameStarter.getMidX(menu) + menu.textAreaWidth / 2)
                    ) {
                    x = menu.textX;
                    y += textPaddingY;
                } else {
                    x += textWidth * textWidthMultiplier;
                }
            }

            if (y >= menu.bottom - (menu.textYOffset - 1) * this.GameStarter.unitsize) {
                menu.progress = {
                    "words": words,
                    "i": i + 1,
                    "x": x,
                    "y": y - (textPaddingY),
                    "onCompletion": onCompletion
                };
                return things;
            }

            if (textSpeed) {
                this.GameStarter.TimeHandler.addEvent(
                    this.addMenuWord.bind(this),
                    (j + 1) * textSpeed,
                    name,
                    words,
                    i + 1,
                    x,
                    y,
                    onCompletion);
            } else {
                this.addMenuWord(name, words, i + 1, x, y, onCompletion);
            }

            return things;
        }

        /**
         * 
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
                    (<IText>character).paddingY / this.GameStarter.unitsize,
                    character,
                    menu,
                    -1);
            }

            this.GameStarter.TimeHandler.addEvent(
                this.addMenuWord.bind(this),
                character.paddingY / this.GameStarter.unitsize + 1,
                name,
                progress.words,
                progress.i,
                progress.x,
                progress.y,
                progress.onCompletion);
        }


        /* Lists
        */

        /**
         * 
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
                arrowXOffset: number = (menu.arrowXOffset || 0) * this.GameStarter.unitsize,
                arrowYOffset: number = (menu.arrowYOffset || 0) * this.GameStarter.unitsize,
                selectedIndex: number[] = settings.selectedIndex || [0, 0],
                optionChildren = [],
                index = 0,
                y = top,
                option: any,
                optionChild: any,
                schema: any,
                title: string,
                character: IThing,
                column: IThing[],
                x: number,
                i: number,
                j: number,
                k: number;

            menu.options = options;
            menu.optionChildren = optionChildren;

            menu.callback = this.selectMenuListOption;
            menu.onActive = this.activateMenuList;
            menu.onInactive = this.deactivateMenuList;

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
                            this.addMenuWord(
                                name,
                                [schema.text],
                                0,
                                x + schema.x * this.GameStarter.unitsize,
                                y + schema.y * this.GameStarter.unitsize)
                            );
                    }
                }

                option.schema = schema = this.filterWord(option.text);

                if (schema !== "\n") {
                    for (j = 0; j < schema.length; j += 1) {
                        if (schema[j].command) {
                            if (schema[j].x) {
                                x += schema[j].x * this.GameStarter.unitsize;
                            }
                            if (schema[j].y) {
                                y += schema[j].y * this.GameStarter.unitsize;
                            }
                        } else if (schema[j] !== " ") {
                            option.title = title = "Char" + this.getCharacterEquivalent(schema[j]);
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

                y += textPaddingY;

                if (y > menu.bottom - textHeight + 1) {
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
                option.schema = schema = this.filterWord(option.text);

                optionChild = {
                    "option": option,
                    "things": []
                }
                optionChildren.push(optionChild);

                x = menu.left + (menu.textXOffset + option.position.left) * this.GameStarter.unitsize;
                y = menu.top + (menu.textYOffset + option.position.top) * this.GameStarter.unitsize;

                option.x = x;
                option.y = y;

                // Copy & pasted from the above options loop
                // To do: make this into its own helper function?
                for (j = 0; j < schema.length; j += 1) {
                    if (schema[j].command) {
                        if (schema[j].x) {
                            x += schema[j].x * this.GameStarter.unitsize;
                        }
                        if (schema[j].y) {
                            y += schema[j].y * this.GameStarter.unitsize;
                        }
                    } else if (schema[j] !== " ") {
                        option.title = title = "Char" + this.getCharacterEquivalent(schema[j]);
                        character = this.GameStarter.ObjectMaker.make(title);
                        menu.children.push(character);
                        optionChild.things.push(character);

                        this.GameStarter.addThing(character, x, y);

                        x += character.width * this.GameStarter.unitsize;
                    } else {
                        x += textWidth;
                    }
                }

                menu.gridRows += 1;
                for (j = 0; j < menu.grid.length; j += 1) {
                    menu.grid[j].push(option);
                }
            }

            if (menu.scrollingItems) {
                menu.scrollingAmount = 0;
                menu.scrollingAmountReal = 0;

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
         * 
         */
        activateMenuList(name: string): void {
            if (this.menus[name] && (<IListMenu>this.menus[name]).arrow) {
                (<IListMenu>this.menus[name]).arrow.hidden = false;
            }
        }

        /**
         * 
         */
        deactivateMenuList(name: string): void {
            if (this.menus[name] && (<IListMenu>this.menus[name]).arrow) {
                (<IListMenu>this.menus[name]).arrow.hidden = true;
            }
        }

        /**
         * 
         */
        getMenuSelectedIndex(name: string): number[] {
            return (<IListMenu>this.menus[name]).selectedIndex;
        }

        /**
         * 
         */
        getMenuSelectedOption(name: string): any {
            var menu = <IListMenu>this.menus[name];

            return menu.grid[menu.selectedIndex[0]][menu.selectedIndex[1]];
        }

        /**
         * 
         */
        shiftSelectedIndex(name: string, dx: number, dy: number): void {
            var menu: IListMenu = <IListMenu>this.getExistingMenu(name),
                textProperties: any = this.GameStarter.ObjectMaker.getPropertiesOf("Text"),
                textWidth: number = textProperties.width * this.GameStarter.unitsize,
                textHeight: number = textProperties.height * this.GameStarter.unitsize,
                textPaddingY: number = (menu.textPaddingY || textProperties.paddingY) * this.GameStarter.unitsize,
                option: any,
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

            //y = Math.min(menu.grid[x].length - 1, y);

            menu.selectedIndex[0] = x;
            menu.selectedIndex[1] = y;
            option = this.getMenuSelectedOption(name);

            if (menu.scrollingItems) {
                this.adjustVerticalScrollingListThings(name, dy, textPaddingY);
            }

            this.GameStarter.setRight(
                menu.arrow, option.x - menu.arrowXOffset * this.GameStarter.unitsize);
            this.GameStarter.setTop(
                menu.arrow, option.y + menu.arrowYOffset * this.GameStarter.unitsize);
        }

        /**
         * 
         */
        setSelectedIndex(name: string, x: number, y: number): void {
            var menu: IListMenu = <IListMenu>this.getExistingMenu(name),
                selectedIndex: number[] = menu.selectedIndex;

            this.shiftSelectedIndex(name, x - selectedIndex[0], y - selectedIndex[1]);
        }

        /**
         * 
         */
        adjustVerticalScrollingListThings(name: string, dy: number, textPaddingY: number): void {
            var menu: IListMenu = <IListMenu>this.getExistingMenu(name),
                scrollingItems: number = menu.scrollingItems,
                scrollingOld: number = menu.scrollingAmount,
                offset: number = -dy * textPaddingY,
                scrollingNew: number,
                indexNew: number,
                option: any,
                optionChild: any,
                i: number,
                j: number;

            menu.scrollingAmount += dy;

            if (dy > 0) {
                if (scrollingOld < menu.scrollingItems - 2) {
                    return;
                }
            } else if (menu.scrollingAmount < menu.scrollingItems - 2) {
                return;
            }

            menu.scrollingAmountReal += dy;

            for (i = 0; i < menu.optionChildren.length; i += 1) {
                option = menu.options[i];
                optionChild = menu.optionChildren[i];

                option.y += offset;

                for (j = 0; j < optionChild.things.length; j += 1) {
                    this.GameStarter.shiftVert(optionChild.things[j], offset);
                    if (
                        i < menu.scrollingAmountReal
                        || i >= menu.scrollingItems + menu.scrollingAmountReal
                        ) {
                        optionChild.things[j].hidden = true;
                    } else {
                        optionChild.things[j].hidden = false;
                    }
                }
            }
        }

        /**
         * 
         */
        selectMenuListOption(name: string): void {
            var menu: IListMenu = <IListMenu>this.getExistingMenu(name),
                selected: any = this.getMenuSelectedOption(name);

            if (selected.callback) {
                selected.callback(name);
            }
        }


        /* Interactivity
        */

        /**
         * 
         */
        setActiveMenu(name: string): void {
            if (this.activeMenu && this.activeMenu.onInactive) {
                this.activeMenu.onInactive(this.activeMenu.name);
            }

            this.activeMenu = this.menus[name];

            if (this.activeMenu && this.activeMenu.onActive) {
                this.activeMenu.onActive(name);
            }
        }

        /**
         * 
         */
        getActiveMenu(): IMenu {
            return this.activeMenu;
        }

        /**
         * 
         */
        getActiveMenuName(): string {
            return this.activeMenu.name;
        }

        /**
         * 
         */
        registerDirection(direction: number): void {
            switch (direction) {
                case 0:
                    return this.registerUp();
                case 1:
                    return this.registerRight();
                case 2:
                    return this.registerDown();
                case 3:
                    return this.registerLeft();
            }
        }

        /**
         * 
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
         * 
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
         * 
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
         * 
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
         * 
         */
        registerA(): void {
            var menu: IListMenu = <IListMenu>this.activeMenu;

            if (!menu || menu.ignoreA) {
                return;
            }

            if (menu.callback) {
                menu.callback(menu.name);
            }
        }

        /**
         * 
         */
        registerB(): void {
            var menu: IListMenu = <IListMenu>this.activeMenu;

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
         * 
         */
        registerStart(): void {
            var menu: IListMenu = <IListMenu>this.activeMenu;

            if (!menu) {
                return;
            }

            if (menu.startMenu) {
                this.setActiveMenu(menu.startMenu);
                // } else if (activeMenu.callback) {
                //     activeMenu.callback(activeMenu.name);
            }
        }


        /* Utilities
        */

        /**
         * 
         */
        private scrollCharacterUp(character: IThing, menu: IMenu): boolean {
            this.GameStarter.shiftVert(character, -this.GameStarter.unitsize);

            if (character.top < menu.top + (menu.textYOffset - 1) * this.GameStarter.unitsize) {
                this.GameStarter.killNormal(character);
                return true;
            }

            return false;
        }

        /**
         * 
         */
        private getCharacterEquivalent(character: string): string {
            if (this.aliases.hasOwnProperty(character)) {
                return this.aliases[character];
            }
            return character;
        }

        /**
         * 
         */
        private filterWord(word: any): IMenuWordFiltered {
            var start = 0,
                end: number,
                inside: string;

            if (word.constructor !== String) {
                return word;
            }

            while (true) {
                start = word.indexOf("%%%%%%%", start);
                end = word.indexOf("%%%%%%%", start + 1);
                if (start === -1 || end === -1) {
                    return word;
                }

                inside = word.substring(start + "%%%%%%%".length, end);
                word = word.substring(0, start) + this.getReplacement(inside) + word.substring(end + "%%%%%%%".length);

                start = end;
            }

            return word;
        }

        /**
         * 
         */
        private getReplacement(key: string): string {
            var value = this.replacements[key];

            if (typeof value === "undefined") {
                return value;
            }

            // if (this.replacementStatistics && this.replacementStatistics[value]) {
            //     return this.replacements[value](this.GameStarter);
            // }

            if (this.replaceFromItemsHolder) {
                if (this.GameStarter.ItemsHolder.hasKey(value)) {
                    return this.GameStarter.ItemsHolder.getItem(value);
                }
            }

            return value;
        }

        /**
         * 
         */
        private getAliasOf(key: string, forced?: boolean): string {
            if (forced) {
                return this.aliases[key];
            } else {
                return typeof this.aliases[key] === "undefined" ? key : this.aliases[key];
            }
        }

        /**
         * Creates a new String equivalent to an old String repeated any number of
         * times. If times is 0, a blank String is returned.
         * 
         * @param {String} str The characters to repeat.
         * @param {Number} [times]   How many times to repeat (by default, 1).
         */
        private stringOf(str: string, times: number = 1): string {
            return (times === 0) ? "" : new Array(1 + (times)).join(str);
        }
    }
}
