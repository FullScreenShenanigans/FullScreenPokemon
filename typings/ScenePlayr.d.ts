declare namespace ScenePlayr {
    /**
     * Cutscenes that may be played, keyed by name.
     */
    interface ICutscenes {
        [i: string]: ICutscene;
    }
    /**
     * A cutscene, which is a collection of routines.
     */
    interface ICutscene {
        /**
         * The routines available to the cutscene, keyed by name.
         */
        routines: IRoutines;
        /**
         * An optional routine name to play immediately upon starting the cutscene.
         */
        firstRoutine?: string;
    }
    /**
     * Routines available to a cutscene, keyed by name.
     */
    interface IRoutines {
        [i: string]: IRoutine;
    }
    /**
     * A routine that may be played within a cutscene.
     *
     * @param settings   Persistent settings from the parent cutscene.
     * @param args   Any other arguments passed via through playRoutine or bindRoutine.
     */
    interface IRoutine {
        (settings: ICutsceneSettings, ...args: any[]): void;
    }
    /**
     * Persistent settings kept throughout a cutscene.
     */
    interface ICutsceneSettings {
        /**
         * A reference to the parent cutscene.
         */
        cutscene: ICutscene;
        /**
         * The name of the parent cutscene.
         */
        cutsceneName: string;
        /**
         * The currently playing routine.
         */
        routine: IRoutine;
        /**
         * THe name of the current playing routine.
         */
        routineName: string;
        /**
         * Arguments passed to the currents playing routines.
         */
        routineArguments: any[];
        /**
         * Miscellaneous settings for the cutscene.
         */
        [i: string]: any;
    }
    /**
     * Settings to initialize a new IScenePlayr.
     */
    interface IScenePlayrSettings {
        /**
         * Cutscenes that may be played, keyed by names.
         */
        cutscenes?: ICutscenes;
        /**
         * Arguments to pass to each routine within the cutscenes.
         */
        cutsceneArguments?: any[];
    }
    /**
     * A cutscene runner for jumping between scenes and their routines.
     */
    interface IScenePlayr {
        /**
         * @returns The complete listing of cutscenes that may be played.
         */
        getCutscenes(): ICutscenes;
        /**
         * @returns The currently playing cutscene.
         */
        getCutscene(): ICutscene;
        /**
         * @returns The cutscene referred to by the given name.
         */
        getOtherCutscene(name: string): ICutscene;
        /**
         * @returns The currently playing routine.
         */
        getRoutine(): IRoutine;
        /**
         * @param name   The name of a routine to return.
         * @returns The routine within the current cutscene referred to
         *          by the given name.
         */
        getOtherRoutine(name: string): IRoutine;
        /**
         * @returns The name of the currently playing cutscene.
         */
        getCutsceneName(): string;
        /**
         * @returns The settings used by the current cutscene.
         */
        getCutsceneSettings(): any;
        /**
         * Adds a setting to the internal cutscene settings.
         *
         * @param key   The key for the new setting.
         * @param value   The value for the new setting.
         */
        addCutsceneSetting(key: string, value: any): void;
        /**
         * Starts the cutscene of the given name, keeping the settings Object (if
         * given one). The cutsceneArguments unshift the settings, and if the
         * cutscene specifies a firstRoutine, it's started.
         *
         * @param name   The name of the cutscene to play.
         * @param [settings]   Additional settings to be kept persistently
         *                     throughout the cutscene.
         */
        startCutscene(name: string, settings?: any): void;
        /**
         * Returns this.startCutscene bound to the given name and settings.
         *
         * @param name   The name of the cutscene to play.
         * @param args   Additional settings to be kept as a persistent
         *               Array throughout the cutscene.
         */
        bindCutscene(name: string, settings?: any): () => void;
        /**
         * Stops the currently playing cutscene and clears the internal data.
         */
        stopCutscene(): void;
        /**
         * Plays a particular routine within the current cutscene, passing
         * the given args as cutsceneSettings.routineArguments.
         *
         * @param name   The name of the routine to play.
         * @param args   Any additional arguments to pass to the routine.
         */
        playRoutine(name: string, ...args: any[]): void;
        /**
         * Returns this.startCutscene bound to the given name and arguments.
         *
         * @param name   The name of the cutscene to play.
         * @param args   Any additional arguments to pass to the routine.
         */
        bindRoutine(name: string, ...args: any[]): () => void;
    }
    /**
     * A stateful cutscene runner for jumping between scenes and their routines.
     */
    class ScenePlayr implements IScenePlayr {
        /**
         * The complete listing of cutscenes that may be played, keyed by name.
         */
        private cutscenes;
        /**
         * The currently playing cutscene.
         */
        private cutscene;
        /**
         * The currently playing routine within the current cutscene.
         */
        private routine;
        /**
         * The name of the current cutscene.
         */
        private cutsceneName;
        /**
         * Persistent settings for the current cutscene, passed to each routine.
         */
        private cutsceneSettings;
        /**
         * Any additional arguments to pass to routines.
         */
        private cutsceneArguments;
        /**
         * Initializes a new instance of the ScenePlayr class.
         *
         * @param [settings]   Settings to be used for initialization.
         */
        constructor(settings?: IScenePlayrSettings);
        /**
         * @returns The complete listing of cutscenes that may be played.
         */
        getCutscenes(): ICutscenes;
        /**
         * @returns The currently playing cutscene.
         */
        getCutscene(): ICutscene;
        /**
         * @returns The cutscene referred to by the given name.
         */
        getOtherCutscene(name: string): ICutscene;
        /**
         * @returns The currently playing routine.
         */
        getRoutine(): IRoutine;
        /**
         * @param name   The name of a routine to return.
         * @returns The routine within the current cutscene referred to
         *          by the given name.
         */
        getOtherRoutine(name: string): IRoutine;
        /**
         * @returns The name of the currently playing cutscene.
         */
        getCutsceneName(): string;
        /**
         * @returns The settings used by the current cutscene.
         */
        getCutsceneSettings(): ICutsceneSettings;
        /**
         * Adds a setting to the internal cutscene settings.
         *
         * @param key   The key for the new setting.
         * @param value   The value for the new setting.
         */
        addCutsceneSetting(key: string, value: any): void;
        /**
         * Starts the cutscene of the given name, keeping the settings Object (if
         * given one). The cutsceneArguments unshift the settings, and if the
         * cutscene specifies a firstRoutine, it's started.
         *
         * @param name   The name of the cutscene to play.
         * @param [settings]   Additional settings to be kept persistently
         *                     throughout the cutscene.
         */
        startCutscene(name: string, settings?: any, args?: any): void;
        /**
         * Returns this.startCutscene bound to the given name and settings.
         *
         * @param name   The name of the cutscene to play.
         * @param settings   Additional settings to be kept as a persistent Object
         *                   throughout the cutscene.
         * @param args   Arguments for the firstRoutine, if it exists.
         */
        bindCutscene(name: string, settings?: any, args?: any): () => void;
        /**
         * Stops the currently playing cutscene and clears the internal data.
         */
        stopCutscene(): void;
        /**
         * Plays a particular routine within the current cutscene, passing
         * the given args as cutsceneSettings.routineArguments.
         *
         * @param name   The name of the routine to play.
         * @param args   Any additional arguments to pass to the routine.
         */
        playRoutine(name: string, ...args: any[]): void;
        /**
         * Returns this.startCutscene bound to the given name and arguments.
         *
         * @param name   The name of the cutscene to play.
         * @param args   Any additional arguments to pass to the routine.
         */
        bindRoutine(name: string, ...args: any[]): () => void;
    }
}
declare var module: any;
