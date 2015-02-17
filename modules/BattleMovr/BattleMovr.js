/**
 * BattleMovr.js
 * 
 * 
 * 
 * @author "Josh Goldberg" <josh@fullscreenmario.com>
 */
function BattleMovr(settings) {
    "use strict";
    if (this === window) {
        return new BattleMovr(settings);
    }
    var self = this,

        EightBitter,

        actors,

        battleMenuName,

        battleMenuOptions,

        defaults,

        positions;

    /**
     * 
     */
    self.reset = function (settings) {
        EightBitter = settings.EightBitter;
        if (typeof EightBitter === "undefined") {
            throw new Error("No EightBitter given to BattleMovr.");
        }

        battleMenuName = settings.battleMenuName;
        if (typeof battleMenuName === "undefined") {
            throw new Error("No battleMenuName given to BattleMovr.");
        }

        battleMenuOptions = settings.battleMenuOptions;
        if (typeof battleMenuOptions === "undefined") {
            throw new Error("No battleMenuOptions given to BattleMovr.");
        }

        defaults = settings.defaults || {};

        positions = settings.positions;

        actors = {};
    };


    /* Simple gets
    */

    /**
     * 
     */
    self.getEightBitter = function () {
        return EightBitter;
    };

    /**
     * 
     */
    self.getActors = function () {
        return actors;
    };

    /**
     * 
     */
    self.getActor = function (name) {
        return actors[name];
    };


    /* Actor manipulations
    */

    /**
     * 
     */
    self.startBattle = function (settings) {
        var textStart = settings.textStart || defaults.textStart || ["", ""];

        EightBitter.setMap("Blank", "White");

        EightBitter.MenuGrapher.createMenu("Battle");
        EightBitter.MenuGrapher.createMenu("BattleDisplayInitial");

        EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            textStart[0] + settings.opponent.title + textStart[1],
            self.startBattleMenu
        );
        EightBitter.MenuGrapher.setActiveMenu("GeneralText");

        self.setActor("opponent", settings.opponent.title + "Front");
    };

    /**
     * 
     */
    self.startBattleMenu = function () {
        EightBitter.MenuGrapher.createMenu("GeneralText");
        EightBitter.MenuGrapher.createMenu("BattleOptions");
        EightBitter.MenuGrapher.addMenuList("BattleOptions", {
            "options": battleMenuOptions
        });
        EightBitter.MenuGrapher.setActiveMenu("BattleOptions");

        // for MenuGrapher.addMenuDialog
        return false;
    };

    /**
     * 
     */
    self.setActor = function (name, type, settings) {
        var position = positions[name] || {},
            battleMenu = EightBitter.MenuGrapher.getMenu(battleMenuName),
            thing = actors[name];

        if (thing) {
            EightBitter.killNormal(thing);
        }

        thing = actors[name] = EightBitter.ObjectMaker.make(type, settings);

        EightBitter.addThing(
            thing,
            battleMenu.left + (position.left || 0) * EightBitter.unitsize,
            battleMenu.top + (position.top || 0) * EightBitter.unitsize
        );

        EightBitter.GroupHolder.switchObjectGroup(
            thing,
            thing.groupType,
            "Text"
        );
    };


    self.reset(settings || {});
}