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

        replacerKey,

        textSpeed;


    /**
     * 
     */
    self.reset = function (settings) {
        EightBitter = settings.EightBitter;
        schemas = settings.schemas || {};
        aliases = settings.aliases || {};
        replacements = settings.replacements || {};
        replacerKey = settings.replacerKey || "%%%%%%%";
        textSpeed = settings.textSpeed || 7;

        menus = {};
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
                    "width": Math.floor(
                        EightBitter.MapScreener.width / EightBitter.unitsize
                    ),
                    "height": Math.floor(
                        EightBitter.MapScreener.height / EightBitter.unitsize
                    ),
                    "EightBitter": EightBitter
                };

        self.deleteMenu(name);

        menus[name] = menu;
        menu.name = name;
        self.positionMenu(menu, schema.size, schema.position, container);

        menu.textWidth = (menu.width - menu.textXOffset * 2) * EightBitter.unitsize;
    };

    /**
     * 
     */
    self.deleteMenu = function (name) {
        var menu = menus[name];
        if (!menu) {
            return;
        }

        if (activeMenu === menu) {
            activeMenu = undefined;
        }

        EightBitter.killNormal(menu);
        self.deleteMenuCharacters(name);

        delete menus[name];
    };

    /**
     * 
     */
    self.deleteMenuCharacters = function (name) {
        var menu = menus[name];
        if (menu && menu.characters) {
            menu.characters.forEach(EightBitter.killNormal);
        }
    };

    /**
     * 
     */
    self.positionMenu = function (menu, size, position, container) {
        var i;

        if (!size) {
            size = {};
        }

        if (size.offsets) {
            for (i in size.offsets) {
                menu[i] = size.offsets[i];
            }
        }

        if (size.width) {
            EightBitter.setWidth(menu, size.width);
        } else if (position.horizontal === "stretch") {
            EightBitter.setLeft(menu, 0);
            EightBitter.setWidth(menu, container.width);
        }

        if (size.height) {
            EightBitter.setHeight(menu, size.height);
        } else if (position.vertical === "stretch") {
            EightBitter.setTop(menu, 0);
            EightBitter.setHeight(menu, container.height);
        }

        switch (position.horizontal) {
            case "left":
                EightBitter.setLeft(menu, container.left);
                break;
            case "center":
                EightBitter.setMidXObj(menu, container);
                break;
            case "right":
                EightBitter.setRight(menu, container.right);
                break;
        }

        switch (position.vertical) {
            case "top":
                EightBitter.setTop(menu, container.top);
                break;
            case "center":
                EightBitter.setMidXObj(menu, container);
                break;
            case "bottom":
                EightBitter.setBottom(menu, container.bottom);
                break;
        }

        if (position.offset) {
            if (position.offset.horizontal) {
                EightBitter.shiftHoriz(menu, position.offset.horizontal * EightBitter.unitsize);
            }
            if (position.offset.vertical) {
                EightBitter.shiftVert(menu, position.offset.vertical * EightBitter.unitsize);
            }
        }

        EightBitter.addThing(menu, menu.left, menu.top);
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
                onCompletion();
                return true;
            } else {
                self.deleteMenuCharacters(name);
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

        menu.characters = [];

        self.addMenuWord(name, words, 0, x, y, onCompletion);
    };

    /**
     * 
     * 
     * @todo The calculation of whether a word can fit assumes equal width for
     *       all characters, although apostrophes are tiny.
     */
    self.addMenuWord = function (name, words, i, x, y, onCompletion) {
        var menu = menus[name],
            word = filterWord(words[i]),
            textProperties = EightBitter.ObjectMaker.getPropertiesOf("Text"),
            textWidth = textProperties.width * EightBitter.unitsize,
            textHeight = textProperties.height * EightBitter.unitsize,
            textPaddingY = (menu.textPaddingY || textProperties.paddingY) * EightBitter.unitsize,
            title, character, j;

        if (word !== "\n") {
            for (j = 0; j < word.length; j += 1) {
                if (word[j] !== " ") {
                    title = "Char" + getCharacterEquivalent(word[j]);
                    character = EightBitter.ObjectMaker.make(title);
                    character.paddingY = textPaddingY;
                    menu.characters.push(character);

                    EightBitter.TimeHandler.addEvent(
                        EightBitter.addThing.bind(EightBitter),
                        j * textSpeed,
                        character,
                        x,
                        y
                    );

                    x += character.width * EightBitter.unitsize;
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
            x = EightBitter.getMidX(menu) - menu.textWidth / 2;
            y += textPaddingY;
        } else {
            x += textWidth;
        }

        if (y >= menu.bottom - menu.textYOffset * EightBitter.unitsize) {
            menu.progress = {
                "words": words,
                "i": i + 1,
                "x": x,
                "y": y - (textPaddingY),
                "onCompletion": onCompletion
            };
            return;
        }

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
    }

    /**
     * 
     */
    self.continueMenu = function (name) {
        var menu = menus[name],
            characters = menu.characters,
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

        for (i = 0; i < characters.length; i += 1) {
            character = characters[i];

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
            options = settings.options,
            index = settings.index || 0,
            left = menu.left + menu.textXOffset * EightBitter.unitsize,
            top = menu.top + menu.textYOffset * EightBitter.unitsize,
            textProperties = EightBitter.ObjectMaker.getPropertiesOf("Text"),
            textWidth = textProperties.width * EightBitter.unitsize,
            textHeight = textProperties.height * EightBitter.unitsize,
            textPaddingY = (menu.textPaddingY || textProperties.paddingY) * EightBitter.unitsize,
            arrowOffset = (menu.arrowOffset || 0) * EightBitter.unitsize,
            option, word, title, character,
            x, y, i, j;

        menu.options = options;
        menu.characters = [];
        y = top;

        for (i = 0; i < options.length; i += 1) {
            option = options[i];
            word = filterWord(option.text);
            x = left;

            if (word !== "\n") {
                for (j = 0; j < word.length; j += 1) {
                    if (word[j] !== " ") {
                        title = "Char" + getCharacterEquivalent(word[j]);
                        character = EightBitter.ObjectMaker.make(title);
                        menu.characters.push(character);

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
        menu.characters.push(character);
        menu.arrow = character;

        EightBitter.addThing(
            character,
            menu.left + 4 * EightBitter.unitsize,
            top + arrowOffset + index * textPaddingY
        );
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
            if (difference + menu.selectedIndex + menu.options.length) {
                difference = menu.options.length - menu.selectedIndex - 1;
            }
        } else {
            if (difference + menu.selectedIndex < 0) {
                difference = menu.selectedIndex;
            }
        }

        if (!difference) {
            return;
        }

        if (difference) {
            EightBitter.shiftVert(menu.arrow, difference * textPaddingY);
        }
    };


    /* Interactivity
    */

    /**
     * 
     */
    self.setActiveMenu = function (name) {
        activeMenu = menus[name];
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


    };

    /**
     * 
     */
    self.registerDown = function () {
        if (!activeMenu) {
            return;
        }


    };

    /**
     * 
     */
    self.registerA = function () {
        if (!activeMenu) {
            return;
        }

        self.continueMenu(activeMenu.name);
    };

    /**
     * 
     */
    self.registerB = function () {
        if (!activeMenu) {
            return;
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