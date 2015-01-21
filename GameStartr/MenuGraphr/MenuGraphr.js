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
        EightBitter.killNormal(menus[name]);
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

        addMenuWord(menu, text, text, 0, x, y, onCompletion);
    };

    /**
     * 
     */
    function addMenuWord(menu, text, words, i, x, y, onCompletion) {
        var word = words[i],
            textProperties = EightBitter.ObjectMaker.getPropertiesOf("Text"),
            textWidth = textProperties.width * EightBitter.unitsize,
            textHeight = textProperties.height * EightBitter.unitsize,
            title, character, j;

        for (j = 0; j < word.length; j += 1) {
            if (word[j] !== " ") {
                title = "Char" + getCharacterEquivalent(word[j]);
                character = EightBitter.ObjectMaker.make(title);

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

        EightBitter.TimeHandler.addEvent(
            addMenuWord,
            (j + 1) * textSpeed,
            menu,
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
    function getCharacterEquivalent(character) {
        if (aliases.hasOwnProperty(character)) {
            return aliases[character];
        }
        return character;
    }


    self.reset(settings || {});
}