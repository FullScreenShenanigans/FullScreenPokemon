/// <reference path="GameStartr-0.2.0.ts" />
var MenuGraphr;
(function (MenuGraphr_1) {
    "use strict";
    /**
     * Cardinal directions as Numbers.
     */
    (function (Direction) {
        Direction[Direction["Top"] = 0] = "Top";
        Direction[Direction["Right"] = 1] = "Right";
        Direction[Direction["Bottom"] = 2] = "Bottom";
        Direction[Direction["Left"] = 3] = "Left";
    })(MenuGraphr_1.Direction || (MenuGraphr_1.Direction = {}));
    var Direction = MenuGraphr_1.Direction;
    /**
     * A menu management system for GameStartr. Menus can have dialog-style text, scrollable
     * and unscrollable grids, and children menus or decorations added.
     */
    var MenuGraphr = (function () {
        /**
         * Initializes a new instance of the MenuGraphr class.
         *
         * @param settings   Settings to be used for initialization.
         */
        function MenuGraphr(settings) {
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
        MenuGraphr.prototype.getMenus = function () {
            return this.menus;
        };
        /**
         * @param name   A name of a menu.
         * @returns The menu under the given name.
         */
        MenuGraphr.prototype.getMenu = function (name) {
            return this.menus[name];
        };
        /**
         * Returns a menu, throwing an error if it doesn't exist.
         *
         * @param name   A name of a menu.
         * @returns The menu under the given name.
         */
        MenuGraphr.prototype.getExistingMenu = function (name) {
            if (!this.menus[name]) {
                throw new Error("'" + name + "' menu does not exist.");
            }
            return this.menus[name];
        };
        /**
         * @returns The currently active menu.
         */
        MenuGraphr.prototype.getActiveMenu = function () {
            return this.activeMenu;
        };
        /**
         * @returns The name of the currently active menu.
         */
        MenuGraphr.prototype.getActiveMenuName = function () {
            return this.activeMenu.name;
        };
        /**
         * @returns The alternate Thing titles for characters.
         */
        MenuGraphr.prototype.getAliases = function () {
            return this.aliases;
        };
        /**
         * @returns The programmatic replacements for deliniated words.
         */
        MenuGraphr.prototype.getReplacements = function () {
            return this.replacements;
        };
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
        MenuGraphr.prototype.createMenu = function (name, attributes) {
            var schemaRaw = this.GameStarter.proliferate({}, this.schemas[name]), schema = this.GameStarter.proliferate(schemaRaw, attributes), menu = this.GameStarter.ObjectMaker.make("Menu", schema), 
            // If the container menu doesn't exist, a pseudo-menu the size of the screen is used
            container = schema.container
                ? this.menus[schema.container]
                : {
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
        };
        /**
         * Adds a child object to an existing menu.
         *
         * @param name   The name of the existing menu.
         * @param schema   Settings for the child, including name and child type.
         * @returns The newly created Thing or Things.
         * @remarks Creating a menu is done using this.createMenu, so the created menu might
         *          not mark itself as a child of the parent.
         */
        MenuGraphr.prototype.createMenuChild = function (name, schema) {
            switch (schema.type) {
                case "menu":
                    return this.createMenu(schema.name, schema.attributes);
                case "text":
                    return this.createMenuWord(name, schema);
                case "thing":
                    return this.createMenuThing(name, schema);
                default:
                    throw new Error("Unknown schema type: " + schema.type);
            }
        };
        /**
         * Creates a series of words as a child of a menu.
         *
         * @param name   The name of the menu.
         * @param schema   Settings for the words.
         * @returns The words' character Things.
         */
        MenuGraphr.prototype.createMenuWord = function (name, schema) {
            var menu = this.getExistingMenu(name), container = this.GameStarter.ObjectMaker.make("Menu"), words = this.filterMenuWords(schema.words);
            this.placeMenuThing(menu, container, schema.size, schema.position, true);
            menu.textX = container.left;
            return this.addMenuWords(name, words, 0, container.left, container.top);
        };
        /**
         * Creates a Thing as a child of a menu.
         *
         * @param name   The name of the menu.
         * @param schema   Settings for the Thing.
         * @returns The newly created Thing.
         */
        MenuGraphr.prototype.createMenuThing = function (name, schema) {
            var menu = this.getExistingMenu(name), thing = this.GameStarter.ObjectMaker.make(schema.thing, schema.args);
            this.placeMenuThing(menu, thing, schema.size, schema.position);
            this.GameStarter.GroupHolder.switchMemberGroup(thing, thing.groupType, "Text");
            menu.children.push(thing);
            return thing;
        };
        /* Removals
        */
        /**
         * Hides a menu of the given name and deletes its children, if it exists.
         *
         * @param name   The name of the menu to hide.
         */
        MenuGraphr.prototype.hideMenu = function (name) {
            var menu = this.menus[name];
            if (menu) {
                menu.hidden = true;
                this.deleteMenuChildren(name);
            }
        };
        /**
         * Deletes a menu of the given name, if it exists.
         *
         * @param name   The name of the menu to delete.
         */
        MenuGraphr.prototype.deleteMenu = function (name) {
            var menu = this.menus[name];
            if (menu) {
                this.deleteMenuChild(menu);
            }
        };
        /**
         * Deletes the active menu, if it exists.
         */
        MenuGraphr.prototype.deleteActiveMenu = function () {
            if (this.activeMenu) {
                this.deleteMenu(this.activeMenu.name);
            }
        };
        /**
         * Deletes all menus.
         */
        MenuGraphr.prototype.deleteAllMenus = function () {
            for (var key in this.menus) {
                if (this.menus.hasOwnProperty(key)) {
                    this.deleteMenu(key);
                }
            }
        };
        /* Menu text
        */
        /**
         * Adds dialog-style text to a menu. If the text overflows,
         *
         * @param name   The name of the menu.
         * @param dialog   Raw dialog to add to the menu.
         * @param onCompletion   An optional callback for when the text is done.
         */
        MenuGraphr.prototype.addMenuDialog = function (name, dialog, onCompletion) {
            var _this = this;
            var dialogParsed = this.parseRawDialog(dialog), currentLine = 1, callback = function () {
                // If all dialog has been exhausted, delete the menu and finish
                if (currentLine >= dialogParsed.length) {
                    if (_this.menus[name].deleteOnFinish) {
                        _this.deleteMenu(name);
                    }
                    if (onCompletion) {
                        onCompletion();
                    }
                    return;
                }
                currentLine += 1;
                // Delete any previous texts. This is only done if continuing
                // so that when the dialog is finished, the last text remains
                _this.deleteMenuChildren(name);
                // This continues the dialog with the next iteration (word)
                _this.addMenuText(name, dialogParsed[currentLine - 1], callback);
            };
            // This first call to addmenuText shouldn't be the callback, because if 
            // being called from a childrenSchema of type "text", it shouldn't delete 
            // any other menu children from childrenSchemas.
            this.addMenuText(name, dialogParsed[0], callback);
        };
        /**
         * Continues a menu from its current display words to the next line.
         *
         * @param name    The name of the menu.
         */
        MenuGraphr.prototype.continueMenu = function (name) {
            var _this = this;
            var menu = this.getExistingMenu(name), children = menu.children, progress = menu.progress, character, i;
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
                this.GameStarter.TimeHandler.addEventInterval(this.scrollCharacterUp.bind(this), 1, character.paddingY, character, menu, -1);
            }
            this.GameStarter.TimeHandler.addEvent(function () {
                _this.addMenuWords(name, progress.words, progress.i, progress.x, progress.y, progress.onCompletion);
            }, character.paddingY + 1);
        };
        /* Lists
        */
        /**
         * Adds a list of text options to a menu.
         *
         * @param name   The name of the menu.
         * @param settings   Settings for the list, particularly its options, starting
         *                   index, and optional floating bottom.
         */
        MenuGraphr.prototype.addMenuList = function (name, settings) {
            var menu = this.getExistingMenu(name), options = settings.options.constructor === Function
                ? settings.options()
                : settings.options, left = menu.left + menu.textXOffset * this.GameStarter.unitsize, top = menu.top + menu.textYOffset * this.GameStarter.unitsize, textProperties = this.GameStarter.ObjectMaker.getPropertiesOf("Text"), textWidth = (menu.textWidth || textProperties.width) * this.GameStarter.unitsize, textHeight = (menu.textHeight || textProperties.height) * this.GameStarter.unitsize, textPaddingY = (menu.textPaddingY || textProperties.paddingY) * this.GameStarter.unitsize, selectedIndex = settings.selectedIndex || [0, 0], optionChildren = [], index = 0, y = top, option, optionChild, schema, title, character, column, x, i, j, k;
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
                        optionChild.things = optionChild.things.concat(this.addMenuWords(name, [schema.text], 0, x + schema.x * this.GameStarter.unitsize, y + schema.y * this.GameStarter.unitsize));
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
                            }
                            else {
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
                        }
                        else if (schema[j][k] !== " ") {
                            option.title = title = "Char" + this.getCharacterEquivalent(schema[j][k]);
                            character = this.GameStarter.ObjectMaker.make(title);
                            menu.children.push(character);
                            optionChild.things.push(character);
                            this.GameStarter.addThing(character, x, y);
                            x += character.width * this.GameStarter.unitsize;
                        }
                        else {
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
        };
        /**
         * Retrives the currently selected grid cell of a menu.
         *
         * @param name   The name of the menu.
         * @returns The currently selected grid cell of the menu.
         */
        MenuGraphr.prototype.getMenuSelectedOption = function (name) {
            var menu = this.getExistingMenu(name);
            if (!menu.grid || !menu.selectedIndex) {
                throw new Error("The " + name + " menu does not behave like a list menu.");
            }
            return menu.grid[menu.selectedIndex[0]][menu.selectedIndex[1]];
        };
        /**
         * Shifts the selected index of a list menu, adjusting for scrolling if necessary.
         *
         * @param name   The name of the menu.
         * @param dx   How far along the menu's grid to shift horizontally.
         * @param dy   How far along the menu's grid to shift vertically.
         */
        MenuGraphr.prototype.shiftSelectedIndex = function (name, dx, dy) {
            var menu = this.getExistingMenu(name), textProperties = this.GameStarter.ObjectMaker.getPropertiesOf("Text"), textPaddingY = (menu.textPaddingY || textProperties.paddingY) * this.GameStarter.unitsize, option, x, y;
            if (menu.scrollingItems) {
                x = menu.selectedIndex[0] + dx;
                y = menu.selectedIndex[1] + dy;
                x = Math.max(Math.min(menu.gridColumns - 1, x), 0);
                y = Math.max(Math.min(menu.gridRows - 1, y), 0);
            }
            else {
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
        };
        /**
         * Sets the current selected index of a menu.
         *
         * @param name   The name of the menu.
         * @param x   The new horizontal value for the index.
         * @param y   The new vertical value for the index.
         */
        MenuGraphr.prototype.setSelectedIndex = function (name, x, y) {
            var menu = this.getExistingMenu(name), selectedIndex = menu.selectedIndex;
            this.shiftSelectedIndex(name, x - selectedIndex[0], y - selectedIndex[1]);
        };
        /* Interactivity
        */
        /**
         * Sets the currently active menu.
         *
         * @param name   The name of the menu to set as active. If not given, no menu
         *               is set as active.
         */
        MenuGraphr.prototype.setActiveMenu = function (name) {
            if (this.activeMenu && this.activeMenu.onInactive) {
                this.activeMenu.onInactive(this.activeMenu.name);
            }
            if (typeof name !== "undefined") {
                this.activeMenu = this.menus[name];
                if (this.activeMenu && this.activeMenu.onActive) {
                    this.activeMenu.onActive(name);
                }
            }
        };
        /**
         * Reacts to a user event directing in the given direction.
         *
         * @param direction   The direction of the interaction.
         */
        MenuGraphr.prototype.registerDirection = function (direction) {
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
        };
        /**
         * Reacts to a user event directing up.
         */
        MenuGraphr.prototype.registerUp = function () {
            var menu = this.activeMenu;
            if (!menu) {
                return;
            }
            if (menu.selectedIndex) {
                this.shiftSelectedIndex(menu.name, 0, -1);
            }
            if (menu.onUp) {
                menu.onUp(this.GameStarter);
            }
        };
        /**
         * Reacts to a user event directing to the right.
         */
        MenuGraphr.prototype.registerRight = function () {
            var menu = this.activeMenu;
            if (!menu) {
                return;
            }
            if (menu.selectedIndex) {
                this.shiftSelectedIndex(menu.name, 1, 0);
            }
            if (menu.onRight) {
                menu.onRight(this.GameStarter);
            }
        };
        /**
         * Reacts to a user event directing down.
         */
        MenuGraphr.prototype.registerDown = function () {
            var menu = this.activeMenu;
            if (!menu) {
                return;
            }
            if (menu.selectedIndex) {
                this.shiftSelectedIndex(menu.name, 0, 1);
            }
            if (menu.onDown) {
                menu.onDown(this.GameStarter);
            }
        };
        /**
         * Reacts to a user event directing to the left.
         */
        MenuGraphr.prototype.registerLeft = function () {
            var menu = this.activeMenu;
            if (!menu) {
                return;
            }
            if (menu.selectedIndex) {
                this.shiftSelectedIndex(menu.name, -1, 0);
            }
            if (menu.onLeft) {
                menu.onLeft(this.GameStarter);
            }
        };
        /**
         * Reacts to a user event from pressing a selection key.
         */
        MenuGraphr.prototype.registerA = function () {
            var menu = this.activeMenu;
            if (!menu || menu.ignoreA) {
                return;
            }
            if (menu.callback) {
                menu.callback(menu.name);
            }
        };
        /**
         * Reacts to a user event from pressing a deselection key.
         */
        MenuGraphr.prototype.registerB = function () {
            var menu = this.activeMenu;
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
            }
            else {
                this.deleteMenu(menu.name);
            }
        };
        /**
         * Reacts to a user event from pressing a start key.
         */
        MenuGraphr.prototype.registerStart = function () {
            var menu = this.activeMenu;
            if (!menu) {
                return;
            }
            if (menu.startMenu) {
                this.setActiveMenu(menu.startMenu);
            }
        };
        /* Utilities
        */
        /**
         * Adds a series of words to a menu.
         *
         * @param name   The name of the menu.
         * @param words   Words to add to the menu, as String[]s and/or commands.
         * @param onCompletion   An optional event for when the words are added.
         */
        MenuGraphr.prototype.addMenuText = function (name, words, onCompletion) {
            var menu = this.getExistingMenu(name), x = this.GameStarter.getMidX(menu), y = menu.top + menu.textYOffset * this.GameStarter.unitsize;
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
            }
            else {
                onCompletion();
            }
        };
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
        MenuGraphr.prototype.addMenuWords = function (name, words, i, x, y, onCompletion) {
            var _this = this;
            var menu = this.getExistingMenu(name), textProperties = this.GameStarter.ObjectMaker.getPropertiesOf("Text"), command, word, things = [], textWidth, textPaddingX, textPaddingY, textSpeed, textWidthMultiplier, character, j;
            // Command objects must be parsed here in case they modify the x/y position
            if (words[i].command) {
                command = words[i];
                word = this.parseWordCommand(command, menu);
                if (command.command === "position") {
                    x += command.x || 0;
                    y += command.y || 0;
                }
            }
            else {
                word = words[i];
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
                }
                else if (word[j] !== " " || x !== menu.textX) {
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
                    this.GameStarter.TimeHandler.addEvent(onCompletion, (word.length + (menu.finishAutomaticSpeed || 1)) * textSpeed);
                }
                this.GameStarter.TimeHandler.addEvent(function () {
                    menu.progress.working = false;
                }, (j + 1) * textSpeed);
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
            menu.progress.words = words;
            menu.progress.i = i + 1;
            menu.progress.x = x;
            menu.progress.y = y - textPaddingY;
            // If the bottom of the menu has been reached, pause the progress
            if (y >= menu.bottom - (menu.textYOffset - 1) * this.GameStarter.unitsize) {
                this.GameStarter.TimeHandler.addEvent(function () {
                    menu.progress.working = false;
                }, (j + 1) * textSpeed);
                return things;
            }
            if (textSpeed) {
                this.GameStarter.TimeHandler.addEvent(function () {
                    _this.addMenuWords(name, words, i + 1, x, y, onCompletion);
                }, (j + 1) * textSpeed);
            }
            else {
                this.addMenuWords(name, words, i + 1, x, y, onCompletion);
            }
            return things;
        };
        /**
         * Places and positions a Thing within a menu basd on its size and position schemas.
         *
         * @param thing   The Thing to place and position.
         * @param size   An optional description of the Thing's size.
         * @param position   An optional description of the Thing's position.
         * @param skipAdd   Whether to skip calling this.GameStarter.addThing on the Thing.
         */
        MenuGraphr.prototype.placeMenuThing = function (menu, thing, size, position, skipAdd) {
            if (size === void 0) { size = {}; }
            if (position === void 0) { position = {}; }
            var offset = position.offset || {};
            if (size.width) {
                this.GameStarter.setWidth(thing, size.width);
            }
            else if (position.horizontal === "stretch") {
                this.GameStarter.setLeft(thing, 0);
                this.GameStarter.setWidth(thing, menu.width - (offset.left || 0) - (offset.right || 0));
            }
            if (size.height) {
                this.GameStarter.setHeight(thing, size.height);
            }
            else if (position.vertical === "stretch") {
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
        };
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
        MenuGraphr.prototype.addMenuCharacter = function (name, character, x, y, delay) {
            var _this = this;
            var menu = this.getExistingMenu(name), textProperties = this.GameStarter.ObjectMaker.getPropertiesOf("Text"), textPaddingY = (menu.textPaddingY || textProperties.paddingY) * this.GameStarter.unitsize, title = "Char" + this.getCharacterEquivalent(character), thing = this.GameStarter.ObjectMaker.make(title, {
                "textPaddingY": textPaddingY
            });
            menu.children.push(thing);
            if (delay) {
                this.GameStarter.TimeHandler.addEvent(function () {
                    _this.GameStarter.addThing(thing, x, y);
                }, delay);
            }
            else {
                this.GameStarter.addThing(thing, x, y);
            }
            return thing;
        };
        /**
         * Scrolls a menu's character up once. If it's above the menu's area, it's deleted.
         *
         * @param character   The Thing to scroll up.
         * @param menu
         * @returns Whether the character was deleted.
         */
        MenuGraphr.prototype.scrollCharacterUp = function (character, menu) {
            this.GameStarter.shiftVert(character, -this.GameStarter.unitsize);
            if (character.top < menu.top + (menu.textYOffset - 1) * this.GameStarter.unitsize) {
                this.GameStarter.killNormal(character);
                return true;
            }
            return false;
        };
        /**
         * Deletes all children of a menu.
         *
         * @param name   The name of the menu.
         */
        MenuGraphr.prototype.deleteMenuChildren = function (name) {
            var _this = this;
            var menu = this.menus[name];
            if (menu && menu.children) {
                menu.children.forEach(function (child) { return _this.deleteMenuChild(child); });
            }
        };
        /**
         * Deletes the child of a menu and any of its children.
         *
         * @param child   A menu child to delete.
         */
        MenuGraphr.prototype.deleteMenuChild = function (child) {
            if (this.activeMenu === child) {
                if (child.backMenu) {
                    this.setActiveMenu(child.backMenu);
                }
                else {
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
        };
        /* List utilities
        */
        /**
         * Un-hides a list menu's arrow Thing.
         *
         * @param name   The name of the menu.
         */
        MenuGraphr.prototype.activateMenuList = function (name) {
            var menu = this.menus[name];
            if (menu && menu.arrow) {
                menu.arrow.hidden = false;
            }
        };
        /**
         * Hides a list menu's arrow Thing.
         *
         * @param name   The name of the menu.
         */
        MenuGraphr.prototype.deactivateMenuList = function (name) {
            var menu = this.menus[name];
            if (menu && menu.arrow) {
                menu.arrow.hidden = true;
            }
        };
        /**
         * Runs the callback for a menu's selected list option.
         *
         * @param name   The name of the menu.
         */
        MenuGraphr.prototype.triggerMenuListOption = function (name) {
            var selected = this.getMenuSelectedOption(name);
            if (selected.callback) {
                selected.callback.call(this, name);
            }
        };
        /**
         * Determines how many scrolling items are able to fit within a list menu, as
         * the index of the first bottom not within the menu.
         *
         * @param menu   The list menu.
         * @returns The number of scrolling items, or Infinity if they all fit.
         */
        MenuGraphr.prototype.computeMenuScrollingItems = function (menu) {
            var bottom = menu.bottom
                - (menu.textPaddingY * this.GameStarter.unitsize || 0)
                - (menu.textYOffset * this.GameStarter.unitsize || 0), i;
            for (i = 0; i < menu.gridRows; i += 1) {
                if (menu.grid[0][i].y >= bottom) {
                    return i;
                }
            }
            return Infinity;
        };
        /**
         * Scrolls a list menu's Things vertically.
         *
         * @param name   The name of the menu.
         * @param dy   How far along the list menu's grid to scroll.
         * @param textPaddingY   How much text is padded, to compute scrolling with dy.
         */
        MenuGraphr.prototype.scrollListThings = function (name, dy, textPaddingY) {
            var menu = this.getExistingMenu(name), scrollingOld = menu.selectedIndex[1] - dy, offset = -dy * textPaddingY, option, optionChild, i, j;
            if (dy > 0) {
                if (scrollingOld - menu.scrollingVisualOffset < menu.scrollingItems - 1) {
                    return;
                }
            }
            else if (scrollingOld - menu.scrollingVisualOffset > 0) {
                return;
            }
            menu.scrollingVisualOffset += dy;
            for (i = 0; i < menu.optionChildren.length; i += 1) {
                option = menu.options[i];
                optionChild = menu.optionChildren[i];
                option.y += offset;
                for (j = 0; j < optionChild.things.length; j += 1) {
                    this.GameStarter.shiftVert(optionChild.things[j], offset);
                    if (i < menu.scrollingVisualOffset
                        || i >= menu.scrollingItems + menu.scrollingVisualOffset) {
                        optionChild.things[j].hidden = true;
                    }
                    else {
                        optionChild.things[j].hidden = false;
                    }
                }
            }
        };
        /* Text parsing
        */
        /**
         * @param character   A String to retrieve an equivalent title of.
         * @returns The character's title from this.aliases if it exists, or the
         *          character itself otherwise.
         */
        MenuGraphr.prototype.getCharacterEquivalent = function (character) {
            if (this.aliases.hasOwnProperty(character)) {
                return this.aliases[character];
            }
            return character;
        };
        /**
         * @param dialogRaw   Raw dialog of any type.
         * @returns The dialog parsed into lines of words.
         */
        MenuGraphr.prototype.parseRawDialog = function (dialogRaw) {
            // A raw String becomes a single line of dialog
            if (dialogRaw.constructor === String) {
                return [this.parseRawDialogString(dialogRaw)];
            }
            var output = [], component, i;
            for (i = 0; i < dialogRaw.length; i += 1) {
                component = dialogRaw[i];
                if (component.constructor === String) {
                    output.push(this.parseRawDialogString(component));
                }
                else {
                    output.push(this.parseRawDialogStrings(component));
                }
            }
            return output;
        };
        /**
         * @param dialogRaw   A raw String or set of Strings.
         * @returns The raw dialog as lines of words.
         */
        MenuGraphr.prototype.parseRawDialogString = function (dialogRaw) {
            var characters = this.filterWord(dialogRaw), words = [], word, currentlyWhitespace = undefined, i;
            word = [];
            // For each character to be added...
            for (i = 0; i < characters.length; i += 1) {
                // If it matches what's currently being added (whitespace or not), keep going
                if (currentlyWhitespace) {
                    if (/\s/.test(characters[i])) {
                        word.push(characters[i]);
                        continue;
                    }
                }
                else {
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
        };
        /**
         * @param words   Any number of raw dialog words.
         * @returns The words filtered using this.parseRawDialogString.
         */
        MenuGraphr.prototype.parseRawDialogStrings = function (words) {
            var output = [], i;
            for (i = 0; i < words.length; i += 1) {
                output.push.apply(output, this.parseRawDialogString(words[i]));
            }
            return output;
        };
        /**
         * @param wordRaw   A word that may need to have replacements applied.
         * @returns The same word as an Array of characters, and with replacements applied.
         */
        MenuGraphr.prototype.filterWord = function (wordRaw) {
            if (wordRaw.constructor === Array) {
                return wordRaw;
            }
            var word = wordRaw, output = [], start = 0, end, inside;
            start = word.indexOf("%%%%%%%", start);
            end = word.indexOf("%%%%%%%", start + 1);
            if (start !== -1 && end !== -1) {
                inside = this.getReplacement(word.substring(start + "%%%%%%%".length, end));
                if (inside.constructor === Number) {
                    inside = inside.toString().split("");
                }
                else if (inside.constructor === String) {
                    inside = inside.split("");
                }
                output.push.apply(output, word.substring(0, start).split(""));
                output.push.apply(output, inside);
                output.push.apply(output, this.filterWord(word.substring(end + "%%%%%%%".length)));
                return output;
            }
            return word.split("");
        };
        /**
         * Filters all String words in a menu's text using this.filterWord.
         *
         * @param words   The words to filter, as Strings or command Objects.
         * @returns The words, with all Strings filtered.
         */
        MenuGraphr.prototype.filterMenuWords = function (words) {
            var output = [], i;
            for (i = 0; i < words.length; i += 1) {
                if (words[i].constructor === String) {
                    output.push(this.filterWord(words[i]));
                }
                else {
                    output.push(words[i]);
                }
            }
            return output;
        };
        /**
         * @param textRaw   Text that, if String(s), should be filtered using this.filterWord.
         * @returns The words, filtered.
         */
        MenuGraphr.prototype.filterText = function (textRaw) {
            if (textRaw.constructor === Array) {
                if (textRaw.length === 0) {
                    return [];
                }
                if (textRaw[0].constructor === String) {
                    return [textRaw];
                }
                return textRaw;
            }
            var characters = [], total = textRaw, component = "", i;
            for (i = 0; i < total.length; i += 1) {
                if (/\s/.test(total[i])) {
                    if (component.length > 0) {
                        characters.push.apply(characters, this.filterWord(component));
                        component = "";
                    }
                    characters.push(total[i]);
                    continue;
                }
                component += total[i];
            }
            if (component.length > 0) {
                characters.push.apply(characters, this.filterWord(component));
            }
            return [characters];
        };
        /**
         * Converts a word command into its equivalent word text.
         *
         * @param wordCommand   The word command.
         * @param menu   The menu containing the word command.
         * @returns The equivalent word text for the command.
         */
        MenuGraphr.prototype.parseWordCommand = function (wordCommand, menu) {
            // If no menu is provided, this is from a simulation; pretend there is a menu
            if (!menu) {
                menu = {};
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
                    return this.parseWordCommandPadLeft(wordCommand);
                // Position is handled directly in addMenuWord
                case "position":
                    break;
                default:
                    throw new Error("Unknown word command: " + wordCommand.command);
            }
            return wordCommand.word.split("");
        };
        /**
         * Converts a word command to pad text from the left.
         *
         * @param wordCommand   The word command.
         * @returns   The word command's parsed text.
         */
        MenuGraphr.prototype.parseWordCommandPadLeft = function (wordCommand) {
            var filtered = this.filterWord(wordCommand.word), length;
            // Length may be a String (for its length) or a direct number
            switch (wordCommand.length.constructor) {
                case String:
                    length = this.filterText(wordCommand.length)[0].length;
                    break;
                case Number:
                    length = wordCommand.length;
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
        };
        /**
         * Retrieves the value of a text replacement of the given key.
         *
         * @param key   The key of the text replacement to retrieve.
         * @returns The value of the text replacement, if it exists.
         */
        MenuGraphr.prototype.getReplacement = function (key) {
            var replacement = this.replacements[key];
            if (typeof replacement === "undefined") {
                return [""];
            }
            else if (typeof replacement === "function") {
                return replacement.call(this, this.GameStarter);
            }
            else {
                return replacement;
            }
        };
        /**
         * Creates a new String equivalent to an old String repeated any number of
         * times. If times is 0, a blank String is returned.
         *
         * @param string   The characters to repeat.
         * @param times   How many times to repeat (by default, 1).
         * @returns The original string, repeated.
         */
        MenuGraphr.prototype.stringOf = function (string, times) {
            if (times === void 0) { times = 1; }
            return (times === 0) ? "" : new Array(1 + (times)).join(string);
        };
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
        MenuGraphr.prototype.computeFutureWordLength = function (wordRaw, textWidth, textPaddingX) {
            var total = 0, word, i;
            if (wordRaw.constructor === Array) {
                word = wordRaw;
            }
            else {
                word = this.parseWordCommand(wordRaw);
            }
            for (i = 0; i < word.length; i += 1) {
                if (/\s/.test(word[i])) {
                    total += textWidth + textPaddingX;
                }
                else {
                    total += this.computeFutureLetterLength(word[i]) + textPaddingX;
                }
            }
            return total;
        };
        /**
         * Predicts how wide a letter will be, based on its equivalent Thing's width.
         *
         * @param letter   The name of the letter to create.
         * @returns How wide the letter will be on the screen.
         */
        MenuGraphr.prototype.computeFutureLetterLength = function (letter) {
            var title = "Char" + this.getCharacterEquivalent(letter), properties = this.GameStarter.ObjectMaker.getFullPropertiesOf(title);
            return properties.width * this.GameStarter.unitsize;
        };
        return MenuGraphr;
    })();
    MenuGraphr_1.MenuGraphr = MenuGraphr;
})(MenuGraphr || (MenuGraphr = {}));
