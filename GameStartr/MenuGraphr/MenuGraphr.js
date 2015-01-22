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
            menu = EightBitter.ObjectMaker.make("Menu", schema);

        self.deleteMenu(name);

        menus[name] = menu;
        menu.name = name;
        self.positionMenu(menu, schema.size, schema.position);

        menu.textWidth = Math.min(
            menu.textWidth,
            EightBitter.MapScreener.width - menu.textXOffset * 2 * EightBitter.unitsize
        );
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
    self.positionMenu = function (menu, size, position) {
        var width, height,
            top, right, bottom, left;

        if (size) {
            width = size.width * EightBitter.unitsize;
            height = size.height * EightBitter.unitsize;
        }

        if (position) {
            top = position.top;
            right = EightBitter.MapScreener.width - position.right;
            bottom = EightBitter.MapScreener.height - position.bottom;
            left = position.left;
        }

        if (typeof top !== "undefined" && typeof bottom !== "undefined") {
            height = bottom - top;
        }

        if (typeof left !== "undefined" && typeof right !== "undefined") {
            width = right - left;
        }

        EightBitter.setWidth(menu, width / EightBitter.unitsize);
        EightBitter.setHeight(menu, height / EightBitter.unitsize);

        if (typeof left === "undefined") {
            left = right - width;
        }

        if (typeof top === "undefined") {
            top = bottom - height;
        }

        EightBitter.addThing(menu, left, top);
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
            words = words.split(/\s+/);
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
            title, character, j;

        for (j = 0; j < word.length; j += 1) {
            if (word[j] !== " ") {
                title = "Char" + getCharacterEquivalent(word[j]);
                character = EightBitter.ObjectMaker.make(title);
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

        if (i === words.length - 1) {
            menu.progress = {
                "complete": true,
                "onCompletion": onCompletion
            };
            return;
        }

        if (
            x + (filterWord(words[i + 1]).length + 1) * textWidth
            > EightBitter.getMidX(menu) + menu.textWidth / 2
        ) {
            x = EightBitter.getMidX(menu) - menu.textWidth / 2;
            y += textHeight + textProperties.paddingY * EightBitter.unitsize;
        } else {
            x += textWidth;
        }

        if (y >= menu.bottom - menu.textYOffset * EightBitter.unitsize) {
            menu.progress = {
                "words": words,
                "i": i + 1,
                "x": x,
                "y": y - (textHeight + textProperties.paddingY * EightBitter.unitsize),
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
            if (progress.onCompletion) {
                if (progress.onCompletion(EightBitter, menu)) {
                    self.deleteMenu(name);
                }
            } else {
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
                character.paddingY + character.height,
                character,
                menu,
                -1
            );
        }

        EightBitter.TimeHandler.addEvent(
            self.addMenuWord,
            character.paddingY + character.height + 1,
            name,
            progress.words,
            progress.i,
            progress.x,
            progress.y,
            progress.onCompletion
        );
    }


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
        if (character.top < menu.top + menu.textYOffset * EightBitter.unitsize) {
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