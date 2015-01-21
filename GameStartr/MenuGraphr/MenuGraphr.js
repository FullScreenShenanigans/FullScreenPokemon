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

        schemas;


    /**
     * 
     */
    self.reset = function (settings) {
        EightBitter = settings.EightBitter;
        schemas = settings.schemas || {};

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

        menus[name] = menu;
        positionMenu(menu, schema.size, schema.position);
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


    self.reset(settings || {});
}