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
        if (typeof battleMenuName === undefined) {
            throw new Error("No battleMenuName given to BattleMovr.");
        }

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