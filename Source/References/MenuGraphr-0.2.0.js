/// <reference path="EightBittr-0.2.0.ts" />
/// <reference path="GroupHoldr-0.2.1.ts" />
/// <reference path="ItemsHoldr-0.2.1.ts" />
/// <reference path="MapScreenr-0.2.1.ts" />
/// <reference path="ObjectMakr-0.2.2.ts" />
/// <reference path="TimeHandlr-0.2.0.ts" />
var MenuGraphr;
(function (_MenuGraphr) {
    /**
     *
     */
    var MenuGraphr = (function () {
        /**
         *
         */
        function MenuGraphr(settings) {
            this.GameStarter = settings.GameStarter;
            this.killNormal = settings.killNormal;
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
            var schemaRaw = this.GameStarter.proliferate({}, this.schemas[name]), schema = this.GameStarter.proliferate(schemaRaw, attributes), menu = this.GameStarter.ObjectMaker.make("Menu", schema), container = schema.container ? this.menus[schema.container] : {
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
            }
        };
        /**
         *
         */
        MenuGraphr.prototype.createMenuWord = function (name, schema) {
            var menu = this.getExistingMenu(name), container = this.GameStarter.ObjectMaker.make("Menu");
            this.positionItem(container, schema.size, schema.position, menu, true);
            menu.textX = container.left;
            this.addMenuWord(name, schema.words, 0, container.left, container.top);
        };
        /**
         *
         */
        MenuGraphr.prototype.createMenuThing = function (name, schema) {
            var menu = this.getExistingMenu(name), thing = this.GameStarter.ObjectMaker.make(schema.thing, schema.args);
            this.positionItem(thing, schema.size, schema.position, menu);
            this.GameStarter.GroupHolder.switchObjectGroup(thing, thing.groupType, "Text");
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
                child.killOnB.forEach(this.deleteMenu);
            }
            if (child.name) {
                delete this.menus[child.name];
            }
            this.killNormal(child);
            this.deleteMenuChildren(name);
            if (child.onMenuDelete) {
                child.onMenuDelete.call(this.GameStarter);
            }
            if (child.children) {
                child.children.forEach(this.deleteMenuChild);
            }
        };
        /**
         *
         */
        MenuGraphr.prototype.deleteMenuChildren = function (name) {
            var menu = this.menus[name];
            if (menu && menu.children) {
                menu.children.forEach(this.deleteMenuChild);
            }
        };
        /**
         *
         */
        MenuGraphr.prototype.positionItem = function (item, size, position, container, skipAdd) {
            var offset, i;
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
        MenuGraphr.prototype.addMenuDialog = function (name, dialog, onCompletion) {
            if (!dialog) {
                dialog = [""];
            }
            else if (dialog.constructor === String) {
                dialog = [dialog];
            }
            else if (!(dialog instanceof Array)) {
                dialog = [String(dialog)];
            }
            this.addMenuText(name, dialog[0], function () {
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
            if (words.constructor === String) {
                words = words.split(/ /);
            }
            menu.callback = this.continueMenu;
            menu.textX = x;
            this.addMenuWord(name, words, 0, x, y, onCompletion);
        };
        /**
         *
         *
         * @todo The calculation of whether a word can fit assumes equal width for
         *       all children, although apostrophes are tiny.
         */
        MenuGraphr.prototype.addMenuWord = function (name, words, i, x, y, onCompletion) {
            var menu = this.getExistingMenu(name), word = this.filterWord(words[i]), textProperties = this.GameStarter.ObjectMaker.getPropertiesOf("Text"), things = [], textWidth, textHeight, textPaddingX, textPaddingY, textSpeed, textWidthMultiplier, title, character, j;
            // First, filter for commands that affect the containing menu
            if (word.constructor === Object && word.command) {
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
                    case "position":
                        if (word.x) {
                            x += word.x;
                        }
                        if (word.y) {
                            y += word.y;
                        }
                        break;
                }
            }
            // Numerics require any commands that should have affected the window 
            // to have already been applied
            textSpeed = menu.textSpeed;
            textWidth = (menu.textWidth || textProperties.width) * this.GameStarter.unitsize, textHeight = (menu.textHeight || textProperties.height) * this.GameStarter.unitsize, textPaddingX = (menu.textPaddingX || textProperties.paddingX) * this.GameStarter.unitsize;
            textPaddingY = (menu.textPaddingY || textProperties.paddingY) * this.GameStarter.unitsize;
            textWidthMultiplier = menu.textWidthMultiplier || 1;
            if (word.constructor === Object && word.command) {
                title = this.filterWord(this.getCharacterEquivalent(word.word));
                switch (word.command) {
                    case "padLeft":
                        if (word.length.constructor === String) {
                            word = this.stringOf(" ", (this.filterWord(word.length).length - title.length)) + this.filterWord(title);
                        }
                        else {
                            word = this.stringOf(" ", word.length - title.length) + title;
                        }
                        break;
                }
            }
            if ((word.constructor === String && word !== "\n") || word.constructor === Array) {
                for (j = 0; j < word.length; j += 1) {
                    if (word[j] !== " ") {
                        title = "Char" + this.getCharacterEquivalent(word[j]);
                        character = this.GameStarter.ObjectMaker.make(title);
                        character.paddingY = textPaddingY;
                        menu.children.push(character);
                        things.push(character);
                        if (textSpeed) {
                            this.GameStarter.TimeHandler.addEvent(this.GameStarter.addThing.bind(this.GameStarter), j * textSpeed, character, x, y);
                        }
                        else {
                            this.GameStarter.addThing(character, x, y);
                        }
                        x += textWidthMultiplier * (character.width * this.GameStarter.unitsize + textPaddingX);
                    }
                    else {
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
                    this.GameStarter.TimeHandler.addEvent(onCompletion, (word.length + (menu.finishAutomaticSpeed || 1)) * textSpeed);
                }
                return things;
            }
            if (!word.skipSpacing) {
                if (word === "\n" || (x + ((this.filterWord(words[i + 1]).length + .5) * textWidthMultiplier * textWidth + menu.textXOffset * this.GameStarter.unitsize) > this.GameStarter.getMidX(menu) + menu.textAreaWidth / 2)) {
                    x = menu.textX;
                    y += textPaddingY;
                }
                else {
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
                this.GameStarter.TimeHandler.addEvent(this.addMenuWord.bind(this), (j + 1) * textSpeed, name, words, i + 1, x, y, onCompletion);
            }
            else {
                this.addMenuWord(name, words, i + 1, x, y, onCompletion);
            }
            return things;
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
                this.GameStarter.TimeHandler.addEventInterval(this.scrollCharacterUp.bind(this), 1, character.paddingY / this.GameStarter.unitsize, character, menu, -1);
            }
            this.GameStarter.TimeHandler.addEvent(this.addMenuWord.bind(this), character.paddingY / this.GameStarter.unitsize + 1, name, progress.words, progress.i, progress.x, progress.y, progress.onCompletion);
        };
        /* Lists
        */
        /**
         *
         */
        MenuGraphr.prototype.addMenuList = function (name, settings) {
            var menu = this.getExistingMenu(name), options = settings.options.constructor === Function ? settings.options() : settings.options, left = menu.left + menu.textXOffset * this.GameStarter.unitsize, top = menu.top + menu.textYOffset * this.GameStarter.unitsize, textProperties = this.GameStarter.ObjectMaker.getPropertiesOf("Text"), textWidth = (menu.textWidth || textProperties.width) * this.GameStarter.unitsize, textHeight = (menu.textHeight || textProperties.height) * this.GameStarter.unitsize, textPaddingY = (menu.textPaddingY || textProperties.paddingY) * this.GameStarter.unitsize, arrowXOffset = (menu.arrowXOffset || 0) * this.GameStarter.unitsize, arrowYOffset = (menu.arrowYOffset || 0) * this.GameStarter.unitsize, selectedIndex = settings.selectedIndex || [0, 0], optionChildren = [], index = 0, y = top, option, optionChild, schema, title, character, column, x, i, j, k;
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
                        optionChild.things = optionChild.things.concat(this.addMenuWord(name, [schema.text], 0, x + schema.x * this.GameStarter.unitsize, y + schema.y * this.GameStarter.unitsize));
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
                        }
                        else if (schema[j] !== " ") {
                            option.title = title = "Char" + this.getCharacterEquivalent(schema[j]);
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
                };
                optionChildren.push(optionChild);
                x = menu.left + (menu.textXOffset + option.position.left) * this.GameStarter.unitsize;
                y = menu.top + (menu.textYOffset + option.position.top) * this.GameStarter.unitsize;
                option.x = x;
                option.y = y;
                for (j = 0; j < schema.length; j += 1) {
                    if (schema[j].command) {
                        if (schema[j].x) {
                            x += schema[j].x * this.GameStarter.unitsize;
                        }
                        if (schema[j].y) {
                            y += schema[j].y * this.GameStarter.unitsize;
                        }
                    }
                    else if (schema[j] !== " ") {
                        option.title = title = "Char" + this.getCharacterEquivalent(schema[j]);
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
            var menu = this.getExistingMenu(name), textProperties = this.GameStarter.ObjectMaker.getPropertiesOf("Text"), textWidth = textProperties.width * this.GameStarter.unitsize, textHeight = textProperties.height * this.GameStarter.unitsize, textPaddingY = (menu.textPaddingY || textProperties.paddingY) * this.GameStarter.unitsize, option, x, y;
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
            //y = Math.min(menu.grid[x].length - 1, y);
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
            var menu = this.getExistingMenu(name), scrollingItems = menu.scrollingItems, scrollingOld = menu.scrollingAmount, offset = -dy * textPaddingY, scrollingNew, indexNew, option, optionChild, i, j;
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
                    if (i < menu.scrollingAmountReal || i >= menu.scrollingItems + menu.scrollingAmountReal) {
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
            var menu = this.getExistingMenu(name), selected = this.getMenuSelectedOption(name);
            if (selected.callback) {
                selected.callback(name);
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
                this.killNormal(character);
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
        MenuGraphr.prototype.filterWord = function (word) {
            var start = 0, end, inside;
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
        };
        /**
         *
         */
        MenuGraphr.prototype.getReplacement = function (key) {
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
        };
        /**
         *
         */
        MenuGraphr.prototype.getAliasOf = function (key, forced) {
            if (forced) {
                return this.aliases[key];
            }
            else {
                return typeof this.aliases[key] === "undefined" ? key : this.aliases[key];
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
        return MenuGraphr;
    })();
    _MenuGraphr.MenuGraphr = MenuGraphr;
})(MenuGraphr || (MenuGraphr = {}));
