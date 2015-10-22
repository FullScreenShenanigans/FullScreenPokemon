var ScenePlayr;
(function (ScenePlayr_1) {
    "use strict";
    var ScenePlayr = (function () {
        /**
         * @param {IScenePlayrSettings} [settings]
         */
        function ScenePlayr(settings) {
            if (settings === void 0) { settings = {}; }
            this.cutscenes = settings.cutscenes || {};
            this.cutsceneArguments = settings.cutsceneArguments || [];
        }
        /* Simple gets
        */
        /**
         * @return {Object} The complete listing of cutscenes that may be played.
         */
        ScenePlayr.prototype.getCutscenes = function () {
            return this.cutscenes;
        };
        /**
         * @return {Object} The currently playing cutscene.
         */
        ScenePlayr.prototype.getCutscene = function () {
            return this.cutscene;
        };
        /**
         * @return {Object} The cutscene referred to by the given name.
         */
        ScenePlayr.prototype.getOtherCutscene = function (name) {
            return this.cutscenes[name];
        };
        /**
         * @return {Function} The currently playing routine.
         */
        ScenePlayr.prototype.getRoutine = function () {
            return this.routine;
        };
        /**
         * @return {Function} The routine within the current cutscene referred to
         *                    by the given name.
         */
        ScenePlayr.prototype.getOtherRoutine = function (name) {
            return this.cutscene.routines[name];
        };
        /**
         * @return {String} The name of the currently playing cutscene.
         */
        ScenePlayr.prototype.getCutsceneName = function () {
            return this.cutsceneName;
        };
        /**
         * @return {Object} The settings used by the current cutscene.
         */
        ScenePlayr.prototype.getCutsceneSettings = function () {
            return this.cutsceneSettings;
        };
        /**
         * Adds a setting to the internal cutscene settings.
         *
         * @param {String} key   The key for the new setting.
         * @param {Mixed} value   The value for the new setting.
         */
        ScenePlayr.prototype.addCutsceneSetting = function (key, value) {
            this.cutsceneSettings[key] = value;
        };
        /* Playback
        */
        /**
         * Starts the cutscene of the given name, keeping the settings Object (if
         * given one). The cutsceneArguments unshift the settings, and if the
         * cutscene specifies a firstRoutine, it's started.
         *
         * @param {String} name   The name of the cutscene to play.
         * @param {Object} [settings]   Additional settings to be kept as a
         *                              persistent Object throughout the cutscene.
         */
        ScenePlayr.prototype.startCutscene = function (name, settings) {
            if (settings === void 0) { settings = {}; }
            if (!name) {
                throw new Error("No name given to ScenePlayr.playScene.");
            }
            if (this.cutsceneName) {
                this.stopCutscene();
            }
            this.cutscene = this.cutscenes[name];
            this.cutsceneName = name;
            this.cutsceneSettings = settings || {};
            this.cutsceneSettings.cutscene = this.cutscene;
            this.cutsceneSettings.cutsceneName = name;
            this.cutsceneArguments.push(this.cutsceneSettings);
            if (this.cutscene.firstRoutine) {
                this.playRoutine(this.cutscene.firstRoutine);
            }
        };
        /**
         * Returns this.startCutscene bound to the given name and settings.
         *
         * @param {String} name   The name of the cutscene to play.
         * @param {Mixed} [...args]   Additional settings to be kept as a
         *                            persistent Object throughout the cutscene.
         */
        ScenePlayr.prototype.bindCutscene = function (name) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return this.startCutscene.bind(self, name, args);
        };
        /**
         * Stops the currently playing cutscene, clearing the internal data.
         */
        ScenePlayr.prototype.stopCutscene = function () {
            this.cutscene = undefined;
            this.cutsceneName = undefined;
            this.cutsceneSettings = undefined;
            this.routine = undefined;
            this.cutsceneArguments.pop();
        };
        /**
         * Plays a particular routine within the current cutscene, passing
         * the given args as cutsceneSettings.routineArguments.
         *
         * @param {String} name   The name of the routine to play.
         * @param {Array} ...args   Any additional arguments to pass to the routine.
         */
        ScenePlayr.prototype.playRoutine = function (name) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (!this.cutscene) {
                throw new Error("No cutscene is currently playing.");
            }
            if (!this.cutscene.routines[name]) {
                throw new Error("The " + this.cutsceneName + " cutscene does not contain a " + name + " routine.");
            }
            this.routine = this.cutscene.routines[name];
            this.cutsceneSettings.routine = this.routine;
            this.cutsceneSettings.routineName = name;
            this.cutsceneSettings.routineArguments = args;
            this.routine.apply(this, this.cutsceneArguments);
        };
        /**
         * Returns this.startCutscene bound to the given name and arguments.
         *
         * @param {String} name   The name of the cutscene to play.
         * @param {Mixed} [...args]   Any additional arguments to pass to the routine.
         */
        ScenePlayr.prototype.bindRoutine = function (name) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return this.playRoutine.bind(this, name, args);
        };
        return ScenePlayr;
    })();
    ScenePlayr_1.ScenePlayr = ScenePlayr;
})(ScenePlayr || (ScenePlayr = {}));
