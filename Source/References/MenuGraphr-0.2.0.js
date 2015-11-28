/// <reference path="EightBittr-0.2.0.ts" />
/// <reference path="GroupHoldr-0.2.1.ts" />
/// <reference path="ItemsHoldr-0.2.1.ts" />
/// <reference path="MapScreenr-0.2.1.ts" />
/// <reference path="ObjectMakr-0.2.2.ts" />
/// <reference path="TimeHandlr-0.2.0.ts" />
var MenuGraphr;
(function (MenuGraphr_1) {
    "use strict";
    /**
     *
     */
    var MenuGraphr = (function () {
        /**
         *
         */
        function MenuGraphr(settings) {
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
        MenuGraphr.prototype.getMenus = function () {
            return this.menus;
        };
        /**
         *
         */
        MenuGraphr.prototype.getMenu = function (name) {
            return this.menus[name];
        };
        /**
         *
         */
        MenuGraphr.prototype.getExistingMenu = function (name) {
            if (!this.menus[name]) {
                throw new Error("'" + name + "' menu does not exist.");
            }
            return this.menus[name];
        };
        /**
         *
         */
        MenuGraphr.prototype.getAliases = function () {
            return this.aliases;
        };
        /**
         *
         */
        MenuGraphr.prototype.getReplacements = function () {
            return this.replacements;
        };
        /* Menu positioning
        */
        /**
         *
         */
        MenuGraphr.prototype.createMenu = function (name, attributes) {
            var schemaRaw = this.GameStarter.proliferate({}, this.schemas[name]), schema = this.GameStarter.proliferate(schemaRaw, attributes), menu = this.GameStarter.ObjectMaker.make("Menu", schema), container = schema.container
                ? this.menus[schema.container]
                : {
                    "top": 0,
                    "left": 0,
                    "right": this.GameStarter.MapScreener.width,
                    "bottom": this.GameStarter.MapScreener.height,
                    "width": Math.ceil(this.GameStarter.MapScreener.width / this.GameStarter.unitsize),
                    "height": Math.ceil(this.GameStarter.MapScreener.height / this.GameStarter.unitsize),
                    "EightBitter": this.GameStarter,
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
            return menu;
        };
        /**
         *
         */
        MenuGraphr.prototype.createChild = function (name, schema) {
            switch (schema.type) {
                case "menu":
                    this.createMenu(schema.name, schema.attributes);
                    break;
                case "text":
                    this.createMenuWord(name, schema);
                    break;
                case "thing":
                    this.createMenuThing(name, schema);
                    break;
                default:
                    throw new Error("Unknown schema type: " + schema.type);
            }
        };
        /**
         *
         */
        MenuGraphr.prototype.createMenuWord = function (name, schema) {
            var menu = this.getExistingMenu(name), container = this.GameStarter.ObjectMaker.make("Menu"), words = this.filterMenuWords(schema.words);
            this.positionItem(container, schema.size, schema.position, menu, true);
            menu.textX = container.left;
            this.addMenuWords(name, words, 0, container.left, container.top);
        };
        /**
         *
         */
        MenuGraphr.prototype.createMenuThing = function (name, schema) {
            var menu = this.getExistingMenu(name), thing = this.GameStarter.ObjectMaker.make(schema.thing, schema.args);
            this.positionItem(thing, schema.size, schema.position, menu);
            this.GameStarter.GroupHolder.switchMemberGroup(thing, thing.groupType, "Text");
            menu.children.push(thing);
            return thing;
        };
        /**
         *
         */
        MenuGraphr.prototype.hideMenu = function (name) {
            var menu = this.menus[name];
            if (menu) {
                menu.hidden = true;
                this.deleteMenuChildren(name);
            }
        };
        /**
         *
         */
        MenuGraphr.prototype.deleteMenu = function (name) {
            var menu = this.menus[name];
            if (menu) {
                this.deleteMenuChild(menu);
            }
        };
        /**
         *
         */
        MenuGraphr.prototype.deleteActiveMenu = function () {
            if (this.activeMenu) {
                this.deleteMenu(this.activeMenu.name);
            }
        };
        /**
         *
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
        /**
         *
         */
        MenuGraphr.prototype.deleteMenuChildren = function (name) {
            var menu = this.menus[name];
            if (menu && menu.children) {
                menu.children.forEach(this.deleteMenuChild.bind(this));
            }
        };
        /**
         *
         */
        MenuGraphr.prototype.positionItem = function (item, size, position, container, skipAdd) {
            var offset;
            if (!position) {
                position = {};
                offset = {};
            }
            else {
                offset = position.offset || {};
            }
            if (!size) {
                size = {};
            }
            if (size.width) {
                this.GameStarter.setWidth(item, size.width);
            }
            else if (position.horizontal === "stretch") {
                this.GameStarter.setLeft(item, 0);
                this.GameStarter.setWidth(item, container.width - (offset.left || 0) - (offset.right || 0));
            }
            if (size.height) {
                this.GameStarter.setHeight(item, size.height);
            }
            else if (position.vertical === "stretch") {
                this.GameStarter.setTop(item, 0);
                this.GameStarter.setHeight(item, container.height - (offset.top || 0) - (offset.bottom || 0));
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
                this.GameStarter.shiftVert(item, position.offset.top * this.GameStarter.unitsize);
            }
            if (offset.left) {
                this.GameStarter.shiftHoriz(item, position.offset.left * this.GameStarter.unitsize);
            }
            if (!skipAdd) {
                this.GameStarter.addThing(item, item.left, item.top);
            }
        };
        /* Menu text
        */
        /**
         *
         */
        MenuGraphr.prototype.addMenuDialog = function (name, dialogRaw, onCompletion) {
            var dialog = this.parseRawDialog(dialogRaw), currentLine = 1, callback = (function () {
                // If all dialog has been exhausted, delete the menu and finish
                if (currentLine >= dialog.length) {
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
                this.addMenuText(name, dialog[currentLine - 1], callback);
            }.bind(this));
            // This first call to addmenuText shouldn't be the callback, because if there
            // bing called from a childrenSchema of type "text", it shouldn't delete any
            // other menu children from childrenSchemas.
            this.addMenuText(name, dialog[0], callback);
        };
        /**
         *
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
         *
         *
         * @remarks This is the real force behind addMenuDialog and addMenuText.
         */
        MenuGraphr.prototype.addMenuWords = function (name, words, i, x, y, onCompletion) {
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
                this.GameStarter.TimeHandler.addEvent(this.addMenuWords.bind(this), (j + 1) * textSpeed, name, words, i + 1, x, y, onCompletion);
            }
            else {
                this.addMenuWords(name, words, i + 1, x, y, onCompletion);
            }
            return things;
        };
        /**
         *
         */
        MenuGraphr.prototype.addMenuCharacter = function (name, character, x, y, delay) {
            var menu = this.getExistingMenu(name), textProperties = this.GameStarter.ObjectMaker.getPropertiesOf("Text"), textPaddingY = (menu.textPaddingY || textProperties.paddingY) * this.GameStarter.unitsize, title = "Char" + this.getCharacterEquivalent(character), thing = this.GameStarter.ObjectMaker.make(title, {
                "textPaddingY": textPaddingY
            });
            menu.children.push(thing);
            if (delay) {
                this.GameStarter.TimeHandler.addEvent(this.GameStarter.addThing.bind(this.GameStarter), delay, thing, x, y);
            }
            else {
                this.GameStarter.addThing(thing, x, y);
            }
            return thing;
        };
        /**
         *
         */
        MenuGraphr.prototype.continueMenu = function (name) {
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
            this.GameStarter.TimeHandler.addEvent(this.addMenuWords.bind(this), character.paddingY + 1, name, progress.words, progress.i, progress.x, progress.y, progress.onCompletion);
        };
        /* Lists
        */
        /**
         *
         */
        MenuGraphr.prototype.addMenuList = function (name, settings) {
            var menu = this.getExistingMenu(name), options = settings.options.constructor === Function
                ? settings.options()
                : settings.options, left = menu.left + menu.textXOffset * this.GameStarter.unitsize, top = menu.top + menu.textYOffset * this.GameStarter.unitsize, textProperties = this.GameStarter.ObjectMaker.getPropertiesOf("Text"), textWidth = (menu.textWidth || textProperties.width) * this.GameStarter.unitsize, textHeight = (menu.textHeight || textProperties.height) * this.GameStarter.unitsize, textPaddingY = (menu.textPaddingY || textProperties.paddingY) * this.GameStarter.unitsize, selectedIndex = settings.selectedIndex || [0, 0], optionChildren = [], index = 0, y = top, option, optionChild, schema, title, character, column, x, i, j, k;
            menu.options = options;
            menu.optionChildren = optionChildren;
            menu.callback = this.selectMenuListOption.bind(this);
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
                // To do: make this into its own helper function?
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
        };
        /**
         *
         */
        MenuGraphr.prototype.activateMenuList = function (name) {
            if (this.menus[name] && this.menus[name].arrow) {
                this.menus[name].arrow.hidden = false;
            }
        };
        /**
         *
         */
        MenuGraphr.prototype.deactivateMenuList = function (name) {
            if (this.menus[name] && this.menus[name].arrow) {
                this.menus[name].arrow.hidden = true;
            }
        };
        /**
         *
         */
        MenuGraphr.prototype.getMenuSelectedIndex = function (name) {
            return this.menus[name].selectedIndex;
        };
        /**
         *
         */
        MenuGraphr.prototype.getMenuSelectedOption = function (name) {
            var menu = this.menus[name];
            return menu.grid[menu.selectedIndex[0]][menu.selectedIndex[1]];
        };
        /**
         *
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
            // y = Math.min(menu.grid[x].length - 1, y);
            menu.selectedIndex[0] = x;
            menu.selectedIndex[1] = y;
            option = this.getMenuSelectedOption(name);
            if (menu.scrollingItems) {
                this.adjustVerticalScrollingListThings(name, dy, textPaddingY);
            }
            this.GameStarter.setRight(menu.arrow, option.x - menu.arrowXOffset * this.GameStarter.unitsize);
            this.GameStarter.setTop(menu.arrow, option.y + menu.arrowYOffset * this.GameStarter.unitsize);
        };
        /**
         *
         */
        MenuGraphr.prototype.setSelectedIndex = function (name, x, y) {
            var menu = this.getExistingMenu(name), selectedIndex = menu.selectedIndex;
            this.shiftSelectedIndex(name, x - selectedIndex[0], y - selectedIndex[1]);
        };
        /**
         *
         */
        MenuGraphr.prototype.adjustVerticalScrollingListThings = function (name, dy, textPaddingY) {
            var menu = this.getExistingMenu(name), scrollingOld = menu.scrollingAmount, offset = -dy * textPaddingY, option, optionChild, i, j;
            menu.scrollingAmount += dy;
            if (dy > 0) {
                if (scrollingOld < menu.scrollingItems - 2) {
                    return;
                }
            }
            else if (menu.scrollingAmount < menu.scrollingItems - 2) {
                return;
            }
            menu.scrollingAmountReal += dy;
            for (i = 0; i < menu.optionChildren.length; i += 1) {
                option = menu.options[i];
                optionChild = menu.optionChildren[i];
                option.y += offset;
                for (j = 0; j < optionChild.things.length; j += 1) {
                    this.GameStarter.shiftVert(optionChild.things[j], offset);
                    if (i < menu.scrollingAmountReal
                        || i >= menu.scrollingItems + menu.scrollingAmountReal) {
                        optionChild.things[j].hidden = true;
                    }
                    else {
                        optionChild.things[j].hidden = false;
                    }
                }
            }
        };
        /**
         *
         */
        MenuGraphr.prototype.selectMenuListOption = function (name) {
            var selected = this.getMenuSelectedOption(name);
            if (selected.callback) {
                selected.callback.call(this, name);
            }
        };
        /* Interactivity
        */
        /**
         *
         */
        MenuGraphr.prototype.setActiveMenu = function (name) {
            if (this.activeMenu && this.activeMenu.onInactive) {
                this.activeMenu.onInactive(this.activeMenu.name);
            }
            this.activeMenu = this.menus[name];
            if (this.activeMenu && this.activeMenu.onActive) {
                this.activeMenu.onActive(name);
            }
        };
        /**
         *
         */
        MenuGraphr.prototype.getActiveMenu = function () {
            return this.activeMenu;
        };
        /**
         *
         */
        MenuGraphr.prototype.getActiveMenuName = function () {
            return this.activeMenu.name;
        };
        /**
         *
         */
        MenuGraphr.prototype.registerDirection = function (direction) {
            switch (direction) {
                case 0:
                    return this.registerUp();
                case 1:
                    return this.registerRight();
                case 2:
                    return this.registerDown();
                case 3:
                    return this.registerLeft();
                default:
                    throw new Error("Unknown direction: " + direction);
            }
        };
        /**
         *
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
         *
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
         *
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
         *
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
         *
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
         *
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
         *
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
         *
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
         *
         */
        MenuGraphr.prototype.getCharacterEquivalent = function (character) {
            if (this.aliases.hasOwnProperty(character)) {
                return this.aliases[character];
            }
            return character;
        };
        /**
         *
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
                    output.push(this.filterArray(component));
                }
            }
            return output;
        };
        /**
         *
         */
        MenuGraphr.prototype.parseRawDialogString = function (dialogRaw) {
            var characters = this.filterWord(dialogRaw), words = [], word, currentlyWhitespace = undefined, i;
            word = [];
            // For each character to be added...
            for (i = 0; i < characters.length; i += 1) {
                // If it matches what's currently being added, keep going
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
         *
         *
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
                output.push.apply(output, word.substring(0, start).split(""));
                output.push.apply(output, (inside.constructor === String ? inside.split("") : inside));
                output.push.apply(output, this.filterWord(word.substring(end + "%%%%%%%".length)));
                return output;
            }
            return word.split("");
        };
        /**
         *
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
         *
         */
        MenuGraphr.prototype.filterArray = function (words) {
            var output = [], i;
            for (i = 0; i < words.length; i += 1) {
                output.push.apply(output, this.parseRawDialogString(words[i]));
            }
            return output;
        };
        /**
         *
         */
        MenuGraphr.prototype.filterText = function (word) {
            if (word.constructor === Array) {
                if (word.length === 0) {
                    return [];
                }
                if (word[0].constructor === String) {
                    return [word];
                }
                return word;
            }
            var characters = [], total = word, component = "", i;
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
         *
         */
        MenuGraphr.prototype.parseWordCommand = function (word, menu) {
            // If no menu is provided, this is from a simulation; pretend there is a menu
            if (!menu) {
                menu = {};
            }
            switch (word.command) {
                case "attribute":
                    menu[word.attribute + "Old"] = menu[word.attribute];
                    menu[word.attribute] = word.value;
                    if (word.applyUnitsize) {
                        menu[word.attribute] *= this.GameStarter.unitsize;
                    }
                    break;
                case "attributeReset":
                    menu[word.attribute] = menu[word.attribute + "Old"];
                    break;
                case "padLeft":
                    return this.parseWordCommandPadLeft(word);
                // Position is handled directly in addMenuWord
                case "position":
                    break;
                default:
                    throw new Error("Unknown word command: " + word.command);
            }
            return word.word.split("");
        };
        /**
         *
         */
        MenuGraphr.prototype.parseWordCommandPadLeft = function (command) {
            var filtered = this.filterWord(command.word), length;
            // Length may be a String (for its length) or a direct number
            switch (command.length.constructor) {
                case String:
                    length = this.filterText(command.length)[0].length;
                    break;
                case Number:
                    length = command.length;
                    break;
                default:
                    throw new Error("Unknown padLeft command: " + command);
            }
            // Right-aligned commands reduce the amount of spacing by the length of the word
            if (command.alignRight) {
                length = Math.max(0, length - filtered.length);
            }
            // Tabs are considered to be a single space, so they're added to the left
            filtered.unshift.apply(filtered, this.stringOf("\t", length).split(""));
            return filtered;
        };
        /**
         *
         */
        MenuGraphr.prototype.getReplacement = function (key) {
            var replacement = this.replacements[key], value;
            if (typeof replacement === "undefined") {
                return [""];
            }
            // if (this.replacementStatistics && this.replacementStatistics[value]) {
            //     return this.replacements[value](this.GameStarter);
            // }
            if (this.replaceFromItemsHolder) {
                if (this.GameStarter.ItemsHolder.hasKey(replacement)) {
                    value = this.GameStarter.ItemsHolder.getItem(replacement);
                }
            }
            if (!value) {
                return replacement.split("");
            }
            else if (value.constructor === String) {
                return value.split("");
            }
            else {
                return value;
            }
        };
        /**
         * Creates a new String equivalent to an old String repeated any number of
         * times. If times is 0, a blank String is returned.
         *
         * @param {String} str The characters to repeat.
         * @param {Number} [times]   How many times to repeat (by default, 1).
         */
        MenuGraphr.prototype.stringOf = function (str, times) {
            if (times === void 0) { times = 1; }
            return (times === 0) ? "" : new Array(1 + (times)).join(str);
        };
        /**
         *
         *
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
                    total += this.computeFutureLetterLength(word[i], textPaddingX);
                }
            }
            return total;
        };
        /**
         *
         */
        MenuGraphr.prototype.computeFutureLetterLength = function (letter, textPaddingX) {
            var title = "Char" + this.getCharacterEquivalent(letter), properties = this.GameStarter.ObjectMaker.getFullPropertiesOf(title);
            return properties.width * this.GameStarter.unitsize + textPaddingX;
        };
        return MenuGraphr;
    })();
    MenuGraphr_1.MenuGraphr = MenuGraphr;
})(MenuGraphr || (MenuGraphr = {}));
