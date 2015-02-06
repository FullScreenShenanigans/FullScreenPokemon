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
        return new PixelDrawr(settings);
    }
    var self = this,

        EightBitter,

        menus,

        activeMenu,

        schemas,

        aliases,

        replacements,

        replacerKey;

    /**
     * 
     */
    self.reset = function (settings) {
        EightBitter = settings.EightBitter;
        schemas = settings.schemas || {};
        aliases = settings.aliases || {};
        replacements = settings.replacements || {};
        replacerKey = settings.replacerKey || "%%%%%%%";

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


    /* Menu positioning
    */

    /**
     * 
     */
    self.createMenu = function (name) {
        var schema = schemas[name],
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
        menu.textWidth = (menu.width - menu.textXOffset * 2) * EightBitter.unitsize;

        if (menu.childrenSchemas) {
            menu.childrenSchemas.forEach(self.createChild.bind(undefined, name));
        }

        if (container.children) {
            container.children.push(menu);
        }
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
    self.deleteMenuChild = function (child) {
        if (activeMenu === child) {
            if (child.backMenu) {
                self.setActiveMenu(child.backMenu);
            } else {
                activeMenu = undefined;
            }
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
                    onCompletion();
                }
                return true;
            } else {
                self.deleteMenuChildren(name);
                self.addMenuDialog(name, dialog.slice(1), onCompletion);
                return false;
            }
        });
    };

    /**
     * 
     */
    self.addMenuText = function (name, words, onCompletion) {
        var menu = menus[name],
            x = EightBitter.getMidX(menu) - menu.textWidth / 2,
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
            textWidth = textProperties.width * EightBitter.unitsize,
            textHeight = textProperties.height * EightBitter.unitsize,
            textPaddingX = (menu.textPaddingX || textProperties.paddingX) * EightBitter.unitsize,
            textPaddingY = (menu.textPaddingY || textProperties.paddingY) * EightBitter.unitsize,
            textSpeed = menu.textSpeed || 0,
            title, character, j;

        if (word !== "\n") {
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

                    x += character.width * EightBitter.unitsize + textPaddingX;
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
            return;
        }

        if (
            word === "\n"
            || (
                x + (filterWord(words[i + 1]).length + 1) * textWidth
                > EightBitter.getMidX(menu) + menu.textWidth / 2
            )
        ) {
            x = menu.textX;
            y += textPaddingY;
        } else {
            x += textWidth;
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

        if (progress.complete) {
            if (!progress.onCompletion || progress.onCompletion(EightBitter, menu)) {
                self.deleteMenu(name);
            }
            return;
        }

        progress.working = true;

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
            index = settings.index || 0,
            left = menu.left + menu.textXOffset * EightBitter.unitsize,
            top = menu.top + menu.textYOffset * EightBitter.unitsize,
            textProperties = EightBitter.ObjectMaker.getPropertiesOf("Text"),
            textWidth = textProperties.width * EightBitter.unitsize,
            textHeight = textProperties.height * EightBitter.unitsize,
            textPaddingY = (menu.textPaddingY || textProperties.paddingY) * EightBitter.unitsize,
            arrowXOffset = (menu.arrowXOffset || 0) * EightBitter.unitsize,
            arrowYOffset = (menu.arrowYOffset || 0) * EightBitter.unitsize,
            option, word, title, character,
            y = top,
            x, i, j;

        menu.options = options;

        for (i = 0; i < options.length; i += 1) {
            option = options[i];
            word = filterWord(option.text);
            x = left;

            if (word !== "\n") {
                for (j = 0; j < word.length; j += 1) {
                    if (word[j].command) {
                        if (word[j].x) {
                            x += word[j].x * EightBitter.unitsize;
                        }
                        if (word[j].y) {
                            y += word[j].y * EightBitter.unitsize;
                        }
                    } else if (word[j] !== " ") {
                        title = "Char" + getCharacterEquivalent(word[j]);
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
        }

        menu.selectedIndex = index;
        character = EightBitter.ObjectMaker.make("CharArrowRight");
        menu.children.push(character);
        menu.arrow = character;
        character.hidden = (activeMenu !== menu);

        menu.callback = self.selectMenuListOption;
        menu.onActive = self.activateMenuList;
        menu.onInactive = self.deactivateMenuList;

        EightBitter.addThing(
            character,
            menu.left + arrowXOffset,
            top + arrowYOffset + index * textPaddingY
        );
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
        menus[name].arrow.hidden = true;
    };

    /**
     * 
     */
    self.shiftMenuArrow = function (name, difference) {
        var menu = menus[name],
            textProperties = EightBitter.ObjectMaker.getPropertiesOf("Text"),
            textWidth = textProperties.width * EightBitter.unitsize,
            textHeight = textProperties.height * EightBitter.unitsize,
            textPaddingY = (menu.textPaddingY || textProperties.paddingY) * EightBitter.unitsize;

        if (difference > 0) {
            if (difference + menu.selectedIndex > menu.options.length - 1) {
                difference = Math.min(
                    menu.options.length - menu.selectedIndex,
                    0
                );
            }
        } else {
            if (difference + menu.selectedIndex < 0) {
                difference = Math.max(menu.selectedIndex, 0);
            }
        }

        if (!difference) {
            return;
        }

        menu.selectedIndex += difference;
        EightBitter.shiftVert(menu.arrow, difference * textPaddingY);
    };

    /**
     * 
     */
    self.selectMenuListOption = function (name, index) {
        var menu = menus[name],
            selected = menu.options[index || menu.selectedIndex];

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
    self.registerLeft = function () {
        if (!activeMenu) {
            return;
        }


    };

    /**
     * 
     */
    self.registerRight = function () {
        if (!activeMenu) {
            return;
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
            self.shiftMenuArrow(activeMenu.name, -1);
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
            self.shiftMenuArrow(activeMenu.name, 1);
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
        if (!activeMenu) {
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
        } else if (activeMenu.callback) {
            activeMenu.callback(activeMenu.name);
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

        while (true) {
            start = word.indexOf("%%%%%%%", start);
            end = word.indexOf("%%%%%%%", start + 1);
            if (start === -1 || end === -1) {
                return word;
            }

            inside = word.substring(start + "%%%%%%%".length, end);
            word =
                word.substring(0, start)
                + (replacements.hasOwnProperty(inside) ? replacements[inside] : inside)
                + word.substring(end + "%%%%%%%".length);

            start = end;
        }

        return word;
    }


    self.reset(settings || {});
}