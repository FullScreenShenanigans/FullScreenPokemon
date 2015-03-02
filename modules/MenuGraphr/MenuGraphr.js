/**
 * MenuGraphr.js
 * 
 * 
 * 
 * @author "Josh Goldberg" <josh@fullscreenmario.com>
 */
function MenuGraphr(settings) {
    "use strict";
    if (this === window) {
        return new MenuGraphr(settings);
    }
    var self = this,

        EightBitter,

        menus,

        activeMenu,

        schemas,

        aliases,

        replacements,

        replacerKey,
            
        replaceFromStatsHolder,
            
        replacementStatistics;

    /**
     * 
     */
    self.reset = function (settings) {
        EightBitter = settings.EightBitter;
        schemas = settings.schemas || {};
        aliases = settings.aliases || {};
        replacements = settings.replacements || {};
        replacerKey = settings.replacerKey || "%%%%%%%";
        replaceFromStatsHolder = settings.replaceFromStatsHolder;
        replacementStatistics = settings.replacementStatistics;

        menus = {};
    };


    /* Simple gets
    */

    /**
     * 
     */
    self.getMenus = function () {
        return menus;
    };

    /**
     * 
     */
    self.getMenu = function (name) {
        return menus[name];
    };


    /* Menu positioning
    */

    /**
     * 
     */
    self.createMenu = function (name, attributes) {
        var schemaRaw = EightBitter.proliferate({}, schemas[name]),
            schema = EightBitter.proliferate(schemaRaw, attributes),
            menu = EightBitter.ObjectMaker.make("Menu", schema),
            container = schema.container
                ? menus[schema.container]
                : {
                    "top": 0,
                    "left": 0,
                    "right": EightBitter.MapScreener.width,
                    "bottom": EightBitter.MapScreener.height,
                    "width": Math.ceil(
                        EightBitter.MapScreener.width / EightBitter.unitsize
                    ),
                    "height": Math.ceil(
                        EightBitter.MapScreener.height / EightBitter.unitsize
                    ),
                    "EightBitter": EightBitter
                };

        self.deleteMenu(name);

        menus[name] = menu;
        menu.name = name;
        self.positionItem(menu, schema.size, schema.position, container);

        menu.children = [];
        menu.textAreaWidth = (menu.width - menu.textXOffset * 2) * EightBitter.unitsize;

        if (menu.childrenSchemas) {
            menu.childrenSchemas.forEach(self.createChild.bind(undefined, name));
        }

        if (container.children) {
            container.children.push(menu);
        }

        EightBitter.proliferate(menu, attributes);
    };

    /**
     * 
     */
    self.createChild = function (name, schema) {
        switch (schema.type) {
            case "menu":
                self.createMenu(schema.name);
                break;
            case "text":
                self.createMenuWord(name, schema);
                break;
            case "thing":
                self.createMenuThing(name, schema);
                break;
        }
    };

    /**
     * 
     */
    self.createMenuWord = function (name, schema) {
        var menu = menus[name],
            container = EightBitter.ObjectMaker.make("Menu");

        self.positionItem(container, schema.size, schema.position, menu, true);

        menu.textX = container.left;
        self.addMenuWord(name, schema.words, 0, container.left, container.top)
    };

    /**
     * 
     */
    self.createMenuThing = function (name, schema) {
        var menu = menus[name],
            thing = EightBitter.ObjectMaker.make(schema.thing, schema.args);

        self.positionItem(thing, schema.size, schema.position, menu);

        EightBitter.GroupHolder.switchObjectGroup(
            thing,
            thing.groupType,
            "Text"
        );

        menu.children.push(thing);

        return thing;
    };

    /**
     * 
     */
    self.deleteMenu = function (name) {
        var menu = menus[name];

        if (menu) {
            self.deleteMenuChild(menu);
        }
    };

    /**
     * 
     */
    self.deleteActiveMenu = function () {
        if (activeMenu) {
            self.deleteMenu(activeMenu.name);
        }
    };

    /**
     * 
     */
    self.deleteMenuChild = function (child) {
        if (activeMenu === child) {
            if (child.backMenu) {
                self.setActiveMenu(child.backMenu);
            } else {
                activeMenu = undefined;
            }
        }

        if (child.killOnB) {
            child.killOnB.forEach(self.deleteMenu);
        }

        if (child.name) {
            delete menus[child.name];
        }

        EightBitter.killNormal(child);
        self.deleteMenuChildren(name);

        if (child.onDelete) {
            child.onDelete.call(EightBitter);
        }

        if (child.children) {
            child.children.forEach(self.deleteMenuChild)
        }
    };

    /**
     * 
     */
    self.deleteMenuChildren = function (name) {
        var menu = menus[name];
        if (menu && menu.children) {
            menu.children.forEach(self.deleteMenuChild);
        }
    };

    /**
     * 
     */
    self.positionItem = function (item, size, position, container, skipAdd) {
        var offset, i;

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
            EightBitter.setWidth(item, size.width);
        } else if (position.horizontal === "stretch") {
            EightBitter.setLeft(item, 0);
            EightBitter.setWidth(
                item,
                container.width - (offset.left || 0) - (offset.right || 0)
            );
        }

        if (size.height) {
            EightBitter.setHeight(item, size.height);
        } else if (position.vertical === "stretch") {
            EightBitter.setTop(item, 0);
            EightBitter.setHeight(
                item,
                container.height - (offset.top || 0) - (offset.bottom || 0)
            );
        }

        switch (position.horizontal) {
            case "center":
                EightBitter.setMidXObj(item, container);
                break;
            case "right":
                EightBitter.setRight(item, container.right);
                break;
            default:
                EightBitter.setLeft(item, container.left);
                break;
        }

        switch (position.vertical) {
            case "center":
                EightBitter.setMidYObj(item, container);
                break;
            case "bottom":
                EightBitter.setBottom(item, container.bottom);
                break;
            default:
                EightBitter.setTop(item, container.top);
                break;
        }

        if (offset.top) {
            EightBitter.shiftVert(
                item, position.offset.top * EightBitter.unitsize
            );
        }

        if (offset.left) {
            EightBitter.shiftHoriz(
                item, position.offset.left * EightBitter.unitsize
            );
        }

        if (!skipAdd) {
            EightBitter.addThing(item, item.left, item.top);
        }
    };


    /* Menu text
    */

    /**
     * 
     */
    self.addMenuDialog = function (name, dialog, onCompletion) {
        if (dialog.constructor === String) {
            dialog = [dialog];
        }

        self.addMenuText(name, dialog[0], function () {
            if (dialog.length === 1) {
                if (onCompletion) {
                    return onCompletion();
                }
                return true;
            }
            self.deleteMenuChildren(name);
            self.addMenuDialog(name, dialog.slice(1), onCompletion);
            return false;
        });
    };

    /**
     * 
     */
    self.addMenuText = function (name, words, onCompletion) {
        var menu = menus[name],
            x = EightBitter.getMidX(menu) - menu.textAreaWidth / 2,
            y = menu.top + menu.textYOffset * EightBitter.unitsize;

        if (words.constructor === String) {
            words = words.split(/ /);
        }

        menu.callback = self.continueMenu;
        menu.textX = x;

        self.addMenuWord(name, words, 0, x, y, onCompletion);
    };

    /**
     * 
     * 
     * @todo The calculation of whether a word can fit assumes equal width for
     *       all children, although apostrophes are tiny.
     */
    self.addMenuWord = function (name, words, i, x, y, onCompletion) {
        var menu = menus[name],
            word = filterWord(words[i]),
            textProperties = EightBitter.ObjectMaker.getPropertiesOf("Text"),
            textWidth, textHeight, textPaddingX, textPaddingY, textSpeed,
            title, character, j;

        if (word.constructor === Object && word.command) {
            switch (word.command) {
                case "attribute":
                    menu[word.attribute + "Old"] = menu[word.attribute];
                    menu[word.attribute] = word.value;
                    if (word.applyUnitsize) {
                        menu[word.attribute] *= EightBitter.unitsize;
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

        textSpeed = menu.textSpeed;
        textWidth = (menu.textWidth || textProperties.width) * EightBitter.unitsize,
        textHeight = (menu.textHeight || textProperties.height) * EightBitter.unitsize,
        textPaddingX = (menu.textPaddingX || textProperties.paddingX) * EightBitter.unitsize;
        textPaddingY = (menu.textPaddingY || textProperties.paddingY) * EightBitter.unitsize;
        
        if (word.constructor === Object && word.command) {
            switch (word.command) {
                case "padLeft":
                    word = EightBitter.stringOf(
                        " ", word.length - filterWord(word.word).length
                    ) + filterWord(word.word);
                    break;
            }
        }

        if (
            (word.constructor === String && word !== "\n")
            || word.constructor === Array
        ) {
            for (j = 0; j < word.length; j += 1) {
                if (word[j] !== " ") {
                    title = "Char" + getCharacterEquivalent(word[j]);
                    character = EightBitter.ObjectMaker.make(title);
                    character.paddingY = textPaddingY;
                    menu.children.push(character);

                    if (textSpeed) {
                        EightBitter.TimeHandler.addEvent(
                            EightBitter.addThing.bind(EightBitter),
                            j * textSpeed,
                            character,
                            x,
                            y
                        );
                    } else {
                        EightBitter.addThing(character, x, y);
                    }

                    
                    if (menu.textWidthMultiplier) {
                        x += menu.textWidthMultiplier * (
                            character.width * EightBitter.unitsize + textPaddingX   
                        );
                    } else {
                        x += character.width * EightBitter.unitsize + textPaddingX;
                    }
                } else {
                    x += textWidth;
                }
            }
        }

        if (i === words.length - 1) {
            menu.progress = {
                "complete": true,
                "onCompletion": onCompletion
            };
            if (menu.finishAutomatically) {
                EightBitter.TimeHandler.addEvent(
                    onCompletion,
                    (word.length + (menu.finishAutomaticSpeed || 1)) * textSpeed
                );
            }
            return;
        }

        if (!word.skipSpacing) {
            if (
                word === "\n"
                || (
                    x + (
                        (filterWord(words[i + 1]).length + 1) * textWidth
                        + menu.textXOffset * EightBitter.unitsize
                    )
                    > EightBitter.getMidX(menu) + menu.textAreaWidth / 2
                )
            ) {
                x = menu.textX;
                y += textPaddingY;
            } else {
                x += textWidth;
            }
        }

        if (y >= menu.bottom - (menu.textYOffset - 1) * EightBitter.unitsize) {
            menu.progress = {
                "words": words,
                "i": i + 1,
                "x": x,
                "y": y - (textPaddingY),
                "onCompletion": onCompletion
            };
            return;
        }

        if (textSpeed) {
            EightBitter.TimeHandler.addEvent(
                self.addMenuWord,
                (j + 1) * textSpeed,
                name,
                words,
                i + 1,
                x,
                y,
                onCompletion
            );
        } else {
            self.addMenuWord(name, words, i + 1, x, y, onCompletion);
        }
    }

    /**
     * 
     */
    self.continueMenu = function (name) {
        var menu = menus[name],
            children = menu.children,
            progress = menu.progress,
            character, i;

        if (!progress || progress.working) {
            return;
        }

        progress.working = true;

        if (progress.complete) {
            if (!progress.onCompletion || progress.onCompletion(EightBitter, menu)) {
                self.deleteMenu(name);
            }
            return;
        }


        for (i = 0; i < children.length; i += 1) {
            character = children[i];

            EightBitter.TimeHandler.addEventInterval(
                scrollCharacterUp,
                1,
                character.paddingY / EightBitter.unitsize,
                character,
                menu,
                -1
            );
        }

        EightBitter.TimeHandler.addEvent(
            self.addMenuWord,
            character.paddingY / EightBitter.unitsize + 1,
            name,
            progress.words,
            progress.i,
            progress.x,
            progress.y,
            progress.onCompletion
        );
    }


    /* Lists
    */

    /**
     * 
     */
    self.addMenuList = function (name, settings) {
        var menu = menus[name],
            options = settings.options instanceof Function
                ? settings.options()
                : settings.options,
            left = menu.left + menu.textXOffset * EightBitter.unitsize,
            top = menu.top + menu.textYOffset * EightBitter.unitsize,
            textProperties = EightBitter.ObjectMaker.getPropertiesOf("Text"),
            textWidth = (menu.textWidth || textProperties.width) * EightBitter.unitsize,
            textHeight = (menu.textHeight || textProperties.height) * EightBitter.unitsize,
            textPaddingY = (menu.textPaddingY || textProperties.paddingY) * EightBitter.unitsize,
            arrowXOffset = (menu.arrowXOffset || 0) * EightBitter.unitsize,
            arrowYOffset = (menu.arrowYOffset || 0) * EightBitter.unitsize,
            index = 0,
            y = top,
            option, schema, title, character, column,
            x, i, j;

        menu.options = options;

        menu.callback = self.selectMenuListOption;
        menu.onActive = self.activateMenuList;
        menu.onInactive = self.deactivateMenuList;

        menu.grid = [];
        menu.grid[0] = column = [];
        menu.gridRows = 0;

        if (!options.length) {
            return;
        }

        for (i = 0; i < options.length; i += 1) {
            x = left;
            option = options[i];
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
                    character = self.createMenuThing(name, schema);
                    menu.children.push(character);

                    if (!schema.position || !schema.position.relative) {
                        EightBitter.shiftVert(character, y - menu.top);
                    }
                }
            }
            
            option.schema = schema = filterWord(option.text);

            if (schema !== "\n") {
                for (j = 0; j < schema.length; j += 1) {
                    if (schema[j].command) {
                        if (schema[j].x) {
                            x += schema[j].x * EightBitter.unitsize;
                        }
                        if (schema[j].y) {
                            y += schema[j].y * EightBitter.unitsize;
                        }
                    } else if (schema[j] !== " ") {
                        option.title = title = "Char" + getCharacterEquivalent(schema[j]);
                        character = EightBitter.ObjectMaker.make(title);
                        menu.children.push(character);

                        EightBitter.addThing(character, x, y);

                        x += character.width * EightBitter.unitsize;
                    } else {
                        x += textWidth;
                    }
                }
            }

            y += textPaddingY;

            if (y > menu.bottom - textHeight + 1) {
                y = top;
                left += menu.textColumnWidth * EightBitter.unitsize;
                column = [];
                menu.grid.push(column);
            }
        }

        while (menu.grid[menu.grid.length - 1].length === 0) {
            menu.grid.pop();
        }
        menu.gridColumns = menu.grid.length;

        menu.selectedIndex = settings.selectedIndex || [0, 0];
        menu.arrow = character = EightBitter.ObjectMaker.make("CharArrowRight");
        menu.children.push(character);
        character.hidden = (activeMenu !== menu);
        
        EightBitter.addThing(character);
        EightBitter.setRight(character, options[0].x - menu.arrowXOffset * EightBitter.unitsize);
        EightBitter.setTop(character, options[0].y + menu.arrowYOffset * EightBitter.unitsize);
    };

    /**
     * 
     */
    self.activateMenuList = function (name) {
        menus[name].arrow.hidden = false;
    };

    /**
     * 
     */
    self.deactivateMenuList = function (name) {
        if (menus[name].arrow) {
            menus[name].arrow.hidden = true;
        }
    };

    /**
     * 
     */
    self.getMenuSelectedIndex = function (name) {
        return menus[name].selectedIndex;
    };

    /**
     * 
     */
    self.getMenuSelectedOption = function (name) {
        var menu = menus[name];

        return menu.grid[menu.selectedIndex[0]][menu.selectedIndex[1]];
    };

    /**
     * 
     */
    self.shiftSelectedIndex = function (name, dx, dy) {
        var menu = menus[name],
            textProperties = EightBitter.ObjectMaker.getPropertiesOf("Text"),
            textWidth = textProperties.width * EightBitter.unitsize,
            textHeight = textProperties.height * EightBitter.unitsize,
            textPaddingY = (menu.textPaddingY || textProperties.paddingY) * EightBitter.unitsize,
            x = (menu.selectedIndex[0] + dx) % menu.gridColumns,
            y = (menu.selectedIndex[1] + dy) % menu.gridRows,
            option;

        while (x < 0) {
            x += menu.gridColumns;
        }
        while (y < 0) {
            y += menu.gridRows;
        }

        y = Math.min(menu.grid[x].length - 1, y);

        menu.selectedIndex[0] = x;
        menu.selectedIndex[1] = y;
        option = self.getMenuSelectedOption(name);

        EightBitter.setRight(menu.arrow, option.x - menu.arrowXOffset * EightBitter.unitsize);
        EightBitter.setTop(menu.arrow, option.y + menu.arrowYOffset * EightBitter.unitsize);
    };

    /**
     * 
     */
    self.selectMenuListOption = function (name, index) {
        var menu = menus[name],
            selected = self.getMenuSelectedOption(name);

        if (selected.callback) {
            selected.callback(name);
        }
    };


    /* Interactivity
    */

    /**
     * 
     */
    self.setActiveMenu = function (name) {
        if (activeMenu && activeMenu.onInactive) {
            activeMenu.onInactive(activeMenu.name);
        }

        activeMenu = menus[name];

        if (activeMenu.onActive) {
            activeMenu.onActive(name);
        }
    };

    /**
     * 
     */
    self.getActiveMenu = function () {
        return activeMenu;
    };

    /**
     * 
     */
    self.getActiveMenuName = function () {
        return activeMenu.name;
    };

    /**
     * 
     */
    self.registerLeft = function () {
        if (!activeMenu) {
            return;
        }

        if (typeof activeMenu.selectedIndex !== "undefined") {
            self.shiftSelectedIndex(activeMenu.name, -1, 0);
        }
    };

    /**
     * 
     */
    self.registerRight = function () {
        if (!activeMenu) {
            return;
        }

        if (typeof activeMenu.selectedIndex !== "undefined") {
            self.shiftSelectedIndex(activeMenu.name, 1, 0);
        }
    };

    /**
     * 
     */
    self.registerUp = function () {
        if (!activeMenu) {
            return;
        }

        if (typeof activeMenu.selectedIndex !== "undefined") {
            self.shiftSelectedIndex(activeMenu.name, 0, -1);
        }
    };

    /**
     * 
     */
    self.registerDown = function () {
        if (!activeMenu) {
            return;
        }

        if (typeof activeMenu.selectedIndex !== "undefined") {
            self.shiftSelectedIndex(activeMenu.name, 0, 1);
        }
    };

    /**
     * 
     */
    self.registerA = function () {
        if (!activeMenu) {
            return;
        }

        if (activeMenu.callback) {
            activeMenu.callback(activeMenu.name);
        }
    };

    /**
     * 
     */
    self.registerB = function () {
        if (!activeMenu || activeMenu.ignoreB) {
            return;
        }

        if (activeMenu.keepOnBack) {
            self.setActiveMenu(activeMenu.backMenu);
        } else {
            self.deleteMenu(activeMenu.name);
        }
    };

    /**
     * 
     */
    self.registerStart = function () {
        if (!activeMenu) {
            return;
        }

        if (activeMenu.startMenu) {
            self.setActiveMenu(activeMenu.startMenu);
        //} else if (activeMenu.callback) {
        //    activeMenu.callback(activeMenu.name);
        }
    };


    /* Utilities
    */

    /**
     * 
     */
    function scrollCharacterUp(character, menu) {
        EightBitter.shiftVert(character, -EightBitter.unitsize);
        if (character.top < menu.top + (menu.textYOffset - 1) * EightBitter.unitsize) {
            EightBitter.killNormal(character);
            return true;
        }
    }

    /**
     * 
     */
    function getCharacterEquivalent(character) {
        if (aliases.hasOwnProperty(character)) {
            return aliases[character];
        }
        return character;
    }

    /**
     * 
     */
    function filterWord(word) {
        var start = 0,
            end, inside;

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
            word =
                word.substring(0, start)
                + getReplacement(inside)
                + word.substring(end + "%%%%%%%".length);

            start = end;
        }

        return word;
    }

    /**
     * 
     */
    function getReplacement(key) {
        var value = replacements[key];

        if (typeof value === "undefined") {
            return value;
        }

        if (replacementStatistics && replacementStatistics[value]) {
            return replacements[value](EightBitter);
        }

        if (replaceFromStatsHolder) {
            if (EightBitter.StatsHolder.hasKey(value)) {
                return EightBitter.StatsHolder.get(value);
            }
        }

        return value;
    }


    self.reset(settings || {});
}