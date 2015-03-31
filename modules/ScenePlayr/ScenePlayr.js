/**
 * ScenePlayr.js
 * 
 * 
 * 
 * @author "Josh Goldberg" <josh@fullscreenmario.com>
 */
function ScenePlayr(settings) {
    "use strict";
    if (!this || this === window) {
        return new ScenePlayr(settings);
    }
    var self = this,

        cutscenes,

        cutscene,

        routine,

        cutsceneName,

        cutsceneSettings,

        cutsceneArguments;

    /**
     * 
     */
    self.reset = function (settings) {
        cutscenes = settings.cutscenes || {};
        cutsceneArguments = settings.cutsceneArguments || [];
    };


    /* Simple gets
    */

    /**
     * 
     */
    self.getCutscenes = function () {
        return cutscenes;
    };

    /**
     * 
     */
    self.getCutscene = function () {
        return cutscene;
    };

    /**
     * 
     */
    self.getRoutine = function () {
        return routine;
    };

    /**
     * 
     */
    self.getOtherRoutine = function (name) {
        return cutscene.routines[name];
    };

    /**
     * 
     */
    self.getCutsceneName = function () {
        return cutsceneName;
    };

    /**
     * 
     */
    self.getCutsceneSettings = function () {
        return cutsceneSettings;
    };

    /* Playback
    */

    /**
     * 
     */
    self.startCutscene = function (name, settings) {
        if (!name) {
            throw new Error("No name given to ScenePlayr.playScene.");
        }

        if (cutsceneName) {
            self.stopCutscene();
        }

        cutscene = cutscenes[name];
        cutsceneName = name;
        cutsceneSettings = settings || {};

        cutsceneSettings.cutscene = cutscene;
        cutsceneSettings.cutsceneName = name;

        cutsceneArguments.push(cutsceneSettings);

        if (cutscene.firstRoutine) {
            self.playRoutine(cutscene.firstRoutine);
        }
    };

    /**
     * 
     */
    self.bindCutscene = function (name, settings) {
        return self.startCutscene.bind(self, name, settings);
    };

    /**
     * 
     */
    self.stopCutscene = function () {
        cutscene = undefined;
        cutsceneName = undefined;
        cutsceneSettings = undefined;

        cutsceneArguments.pop();
    };

    /**
     * 
     */
    self.playRoutine = function (name, args) {
        if (!cutscene) {
            throw new Error("No cutscene is currently playing!");
        }

        if (!cutscene.routines[name]) {
            throw new Error("The " + cutsceneName + " cutscene does not contain a " + name + " routine.");
        }

        routine = cutscene.routines[name];

        cutsceneSettings.routine = routine;
        cutsceneSettings.routineName = name;
        cutsceneSettings.routineArguments = args;

        routine.apply(self, cutsceneArguments);
    };

    /**
     * 
     */
    self.bindRoutine = function (name, args) {
        return self.playRoutine.bind(self, name, args);
    };


    self.reset(settings);
}