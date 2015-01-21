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

        schemas,

        aliases,
            
        textSpeed;


    /**
     * 
     */
    self.reset = function (settings) {
        EightBitter = settings.EightBitter;
        schemas = settings.schemas || {};
        aliases = settings.aliases || {};
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
        positionMenu(menu, schema.size, schema.position);

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

        EightBitter.killNormal(menu);
        if (menu.characters) {
            menu.characters.forEach(EightBitter.killNormal);
        }

        delete menus[name];
    };

    /**
     * 
     */
    function positionMenu(menu, size, position) {
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
    self.addMenuText = function (name, text, onCompletion) {
        var menu = menus[name],
            x = EightBitter.getMidX(menu) - menu.textWidth / 2,
            y = menu.top + menu.textYOffset * EightBitter.unitsize;

        if (text.constructor === String) {
            text = text.split(/\s+/);
        }

        menu.characters = [];

        self.addMenuWord(name, text, text, 0, x, y, onCompletion);
    };

    /**
     * 
     */
    self.addMenuWord = function (name, text, words, i, x, y, onCompletion) {
        var menu = menus[name],
            word = words[i],
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

                x += textWidth;
            }
        }

        if (i === words.length - 1) {
            delete menu.progress;
            if (onCompletion) {
                onCompletion(menu);
            }
            return;
        }

        if (
            x + (words[i + 1].length + 1) * textWidth
            > EightBitter.getMidX(menu) + menu.textWidth / 2
        ) {
            x = EightBitter.getMidX(menu) - menu.textWidth / 2;
            y += textHeight + textProperties.paddingY * EightBitter.unitsize;
        } else {
            x += textWidth;
        }

        if (y >= menu.bottom - menu.textYOffset * EightBitter.unitsize) {
            menu.progress = {
                "text": text,
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
            text,
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

        if (!progress) {
            return;
        }

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
            progress.text,
            progress.words,
            progress.i,
            progress.x,
            progress.y,
            progress.onCompletion
        );
    }

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


    self.reset(settings || {});
}