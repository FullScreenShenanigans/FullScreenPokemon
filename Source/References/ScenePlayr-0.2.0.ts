declare module ScenePlayr {
    export interface ICutscenes {
        [i: string]: ICutscene;
    }

    export interface ICutscene {
        firstRoutine?: string;
        routines: IRoutines;
    }

    export interface IRoutines {
        [i: string]: IRoutine;
    }

    export interface IRoutine {
        (settings: ICutsceneSettings, ...args: any[]): void;
    }

    export interface ICutsceneSettings {
        cutscene: ICutscene;
        cutsceneName: string;
        routine: IRoutine;
        routineName: string;
        routineArguments: any[];
    }

    export interface IScenePlayrSettings {
        cutscenes?: ICutscenes;
        cutsceneArguments?: any[];
    }

    export interface IScenePlayr {
        getCutscenes(): ICutscenes;
        getCutscene(): ICutscene;
        getOtherCutscene(name: string): ICutscene;
        getRoutine(): IRoutine;
        getOtherRoutine(name: string): IRoutine;
        getCutsceneName(): string;
        getCutsceneSettings(): any;
        addCutsceneSetting(key: string, value: any): void;
        startCutscene(name: string, settings?: any): void;
        bindCutscene(name: string, settings?: any): () => void;
        stopCutscene(): void;
        playRoutine(name: string, ...args: any[]): void;
        bindRoutine(name: string, ...args: any[]): () => void;
    }
}


module ScenePlayr {
    "use strict";

    /**
     *
     */
    export class ScenePlayr implements IScenePlayr {
        /**
         * The complete listing of cutscenes that may be played, keyed by name.
         */
        private cutscenes: ICutscenes;

        /**
         * The currently playing cutscene.
         */
        private cutscene: ICutscene;

        /**
         * The name of the current cutscene.
         */
        private cutsceneName: string;

        /**
         * The currently playing routine within the current cutscene.
         */
        private routine: IRoutine;

        /**
         * Persistent settings for the current cutscene, passed to each routine.
         */
        private cutsceneSettings: ICutsceneSettings;

        /**
         * Any additional arguments to pass to routines.
         */
        private cutsceneArguments: any[];

        /**
         * @param {IScenePlayrSettings} [settings]
         */
        constructor(settings: IScenePlayrSettings = {}) {
            this.cutscenes = settings.cutscenes || {};
            this.cutsceneArguments = settings.cutsceneArguments || [];
        }


        /* Simple gets
        */

        /**
         * @returns The complete listing of cutscenes that may be played.
         */
        getCutscenes(): ICutscenes {
            return this.cutscenes;
        }

        /**
         * @returns The currently playing cutscene.
         */
        getCutscene(): ICutscene {
            return this.cutscene;
        }

        /**
         * @returns {String} The name of the currently playing cutscene.
         */
        getCutsceneName(): string {
            return this.cutsceneName;
        }

        /**
         * @returns The cutscene referred to by the given name.
         */
        getOtherCutscene(name: string): ICutscene {
            return this.cutscenes[name];
        }

        /**
         * @returns The currently playing routine.
         */
        getRoutine(): IRoutine {
            return this.routine;
        }

        /**
         * @returns The routine within the current cutscene referred to 
         *          by the given name.
         */
        getOtherRoutine(name: string): IRoutine {
            return this.cutscene.routines[name];
        }

        /**
         * @returns The settings used by the current cutscene.
         */
        getCutsceneSettings(): ICutsceneSettings {
            return this.cutsceneSettings;
        }

        /**
         * Adds a setting to the internal cutscene settings.
         * 
         * @param key   The key for the new setting.
         * @param value   The value for the new setting.
         */
        addCutsceneSetting(key: string, value: any): void {
            this.cutsceneSettings[key] = value;
        }


        /* Playback
        */

        /**
         * Starts the cutscene of the given name, keeping the settings Object (if
         * given one). The cutsceneArguments unshift the settings, and if the
         * cutscene specifies a firstRoutine, it's started.
         * 
         * @param name   The name of the cutscene to play.
         * @param settings   Additional settings to be kept as a persistent Object
         *                   throughout the cutscene.
         * @param args   Arguments for the firstRoutine, if it exists.
         */
        startCutscene(name: string, settings: any = {}, args?: any): void {
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
                this.playRoutine(this.cutscene.firstRoutine, ...args);
            }
        }

        /**
         * Returns this.startCutscene bound to the given name and settings.
         * 
         * @param name   The name of the cutscene to play.
         * @param settings   Additional settings to be kept as a persistent Object
         *                   throughout the cutscene.
         * @param args   Arguments for the firstRoutine, if it exists.
         */
        bindCutscene(name: string, settings: any = {}, args?: any): () => void {
            return this.startCutscene.bind(this, name, args);
        }

        /**
         * Stops the currently playing cutscene and clears the internal data.
         */
        stopCutscene(): void {
            this.cutscene = undefined;
            this.cutsceneName = undefined;
            this.cutsceneSettings = undefined;
            this.cutsceneArguments.pop();
            this.routine = undefined;
        }

        /**
         * Plays a particular routine within the current cutscene, passing
         * the given args as cutsceneSettings.routineArguments.
         * 
         * @param name   The name of the routine to play.
         * @param args   Any additional arguments to pass to the routine.
         */
        playRoutine(name: string, ...args: any[]): void {
            if (!this.cutscene) {
                throw new Error("No cutscene is currently playing.");
            }

            if (!this.cutscene.routines[name]) {
                throw new Error("The " + this.cutsceneName + " cutscene does not contain a " + name + " routine.");
            }

            // Copy the given ...args to a new Array from this.cutsceneArguments
            // This is better than args.unshift to not modify args, if they're given directly
            var routineArgs: any[] = this.cutsceneArguments.slice();
            routineArgs.push(...args);

            this.routine = this.cutscene.routines[name];

            this.cutsceneSettings.routine = this.routine;
            this.cutsceneSettings.routineName = name;
            this.cutsceneSettings.routineArguments = args;

            this.routine.apply(this, routineArgs);
        }

        /**
         * Returns this.startCutscene bound to the given name and arguments.
         * 
         * @param {String} name   The name of the cutscene to play.
         * @param {Mixed} [...args]   Any additional arguments to pass to the routine.
         */
        bindRoutine(name: string, ...args: any[]): () => void {
            return this.playRoutine.bind(this, name, ...args);
        }
    }
}
