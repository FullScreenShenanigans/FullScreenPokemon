/// <reference path="ItemsHoldr-0.2.1.ts" />

declare module AudioPlayr {
    export interface IAudioPlayrSettings {
        /**
         * The names of the audio files to be preloaded for on-demand playback.
         */
        library: {
            [i: string]: {
                [i: string]: string;
            }
        };

        /**
         * The directory in which all sub-directories of audio files are stored.
         */
        directory: string;

        /**
         * The allowed filetypes for each audio file. Each of these should have a
         * directory of their name under the main directory, which should contain
         * each file of the filetype.
         */
        fileTypes: string[];

        /**
         * A storage container to store mute/volume status locally. This can be
         * either a ItemsHoldr or localStorage equivalent.
         */
        ItemsHolder: ItemsHoldr.IItemsHoldr | Storage;

        /**
         * A String or Function to get the default theme for playTheme calls. 
         * Functions are called for a return value, and Strings are constant
         * (defaults to "Theme").
         * 
         */
        getThemeDefault?: string | { (...args: any[]): string };

        /**
         * A Number or Function to get the "local" volume for playLocal calls. 
         * Functions are called for a return value, and Numbers are constant 
         * (defaults to 1).
         * 
         */
        getVolumeLocal?: number | { (...args: any[]): number };
    }

    export interface IAudioPlayr {
        getLibrary(): any;
        getFileTypes(): string[];
        getSounds(): any;
        getTheme(): HTMLAudioElement;
        getThemeName(): string;
        getDirectory(): string;
        getVolume(): number;
        setVolume(volume: number): void;
        getMuted(): boolean;
        setMuted(muted: boolean): void;
        toggleMuted(): void;
        setMutedOn(): void;
        setMutedOff(): void;
        getGetVolumeLocal(): any;
        setGetVolumeLocal(getVolumeLocalNew: any): void;
        getGetThemeDefault(): any;
        setGetThemeDefault(getThemeDefaultNew: any): void;
        play(name: string): HTMLAudioElement;
        pauseAll(): void;
        resumeAll(): void;
        pauseTheme(): void;
        resumeTheme(): void;
        clearAll(): void;
        clearTheme(): void;
        playLocal(name: string, location?: any): HTMLAudioElement;
        playTheme(name?: string, loop?: boolean): HTMLAudioElement;
        playThemePrefixed(prefix?: string, name?: string, loop?: boolean): HTMLAudioElement;
        addEventListener(name: string, event: string, callback: any): void;
        removeEventListeners(name: string, event: string): void;
        addEventImmediate(name: string, event: string, callback: any): void;
    }
}


module AudioPlayr {
    "use strict";

    /**
     * An audio library to automate preloading and controlled playback of multiple
     * audio tracks, with support for different browsers' preferred file types.
     * Volume and mute status are stored locally using a ItemsHoldr.
     */
    export class AudioPlayr implements IAudioPlayr {
        /**
         * A listing of filenames to be turned into <audio> objects.
         */
        private library: any;

        /**
         * What file types to add as sources to sounds.
         */
        private fileTypes: string[];

        /**
         * Currently playing sound objects, keyed by name (excluding extensions).
         */
        private sounds: {
            [i: string]: HTMLAudioElement;
        };

        /**
         * The currently playing theme.
         */
        private theme: HTMLAudioElement;

        /**
         * The name of the currently playing theme.
         */
        private themeName: string;

        /**
         * Directory from which audio files are AJAXED upon startup.
         */
        private directory: string;

        /**
         * The Function or Number used to determine what playLocal's volume is.
         */
        private getVolumeLocal: any;

        /**
         * The Function or String used to get a default theme name.
         */
        private getThemeDefault: any;

        /**
         * Storage container for settings like volume and muted status.
         */
        private ItemsHolder: ItemsHoldr.IItemsHoldr | Storage;

        /**
         * @param {IAudioPlayrSettings} settings
         */
        constructor(settings: IAudioPlayrSettings) {
            var volumeInitial: number;

            if (typeof settings.library === "undefined") {
                throw new Error("No library given to AudioPlayr.");
            }

            if (typeof settings.directory === "undefined") {
                throw new Error("No directory given to AudioPlayr.");
            }

            if (typeof settings.fileTypes === "undefined") {
                throw new Error("No fileTypes given to AudioPlayr.");
            }

            if (!settings.ItemsHolder) {
                throw new Error("No ItemsHoldr given to AudioPlayr.");
            }

            this.ItemsHolder = settings.ItemsHolder;

            this.library = settings.library;
            this.directory = settings.directory;
            this.fileTypes = settings.fileTypes;
            this.getThemeDefault = settings.getThemeDefault || "Theme";
            this.getVolumeLocal = typeof settings.getVolumeLocal === "undefined"
                ? 1 : settings.getVolumeLocal;

            // Sounds should always start blank
            this.sounds = {};

            // Preload everything!
            this.libraryLoad();

            volumeInitial = this.ItemsHolder.getItem("volume");
            if (volumeInitial === undefined) {
                this.setVolume(1);
            } else {
                this.setVolume(this.ItemsHolder.getItem("volume"));
            }

            this.setMuted(this.ItemsHolder.getItem("muted") || false);
        }


        /* Simple getters
        */

        /**
         * @return {Object} The listing of <audio> Elements, keyed by name.
         */
        getLibrary(): any {
            return this.library;
        }

        /**
         * @return {String[]} The allowed filetypes for audio files.
         */
        getFileTypes(): string[] {
            return this.fileTypes;
        }

        /**
         * @return {Object} The currently playing <audio> Elements, keyed by name.
         */
        getSounds(): any {
            return this.sounds;
        }

        /**
         * @return {HTMLAudioElement} The current playing theme's <audio> Element.
         */
        getTheme(): HTMLAudioElement {
            return this.theme;
        }

        /**
         * @return {String} The name of the currently playing theme.
         */
        getThemeName(): string {
            return this.themeName;
        }

        /**
         * @return {String} The directory under which all filetype directories are 
         *                  to be located.
         */
        getDirectory(): string {
            return this.directory;
        }


        /* Playback modifiers
        */

        /**
         * @return {Number} The current volume, which is a Number in [0,1],
         *                  retrieved by the ItemsHoldr.
         */
        getVolume(): number {
            return Number(this.ItemsHolder.getItem("volume") || 0);
        }

        /**
         * Sets the current volume. If not muted, all sounds will have their volume
         * updated.
         * 
         * @param {Number} volume   A Number in [0,1] to set as the current volume.
         */
        setVolume(volume: number): void {
            var i: string;

            if (!this.getMuted()) {
                for (i in this.sounds) {
                    if (this.sounds.hasOwnProperty(i)) {
                        this.sounds[i].volume = Number(this.sounds[i].getAttribute("volumeReal")) * volume;
                    }
                }
            }

            this.ItemsHolder.setItem("volume", volume.toString());
        }

        /**
         * @return {Boolean} whether this is currently muted.
         */
        getMuted(): boolean {
            return Boolean(Number(this.ItemsHolder.getItem("muted")));
        }

        /**
         * Calls either setMutedOn or setMutedOff as is appropriate.
         * 
         * @param {Boolean} muted   The new status for muted.
         */
        setMuted(muted: boolean): void {
            this.getMuted() ? this.setMutedOn() : this.setMutedOff();
        }

        /**
         * Calls either setMutedOn or setMutedOff to toggle whether this is muted.
         */
        toggleMuted(): void {
            this.setMuted(!this.getMuted());
        }

        /**
         * Sets volume to 0 in all currently playing sounds and stores the muted
         * status as on in the internal ItemsHoldr.
         */
        setMutedOn(): void {
            var i: string;

            for (i in this.sounds) {
                if (this.sounds.hasOwnProperty(i)) {
                    this.sounds[i].volume = 0;
                }
            }

            this.ItemsHolder.setItem("muted", "1");
        }

        /**
         * Sets sound volumes to their actual volumes and stores the muted status
         * as off in the internal ItemsHoldr.
         */
        setMutedOff(): void {
            var volume: number = this.getVolume(),
                sound: HTMLAudioElement,
                i: string;

            for (i in this.sounds) {
                if (this.sounds.hasOwnProperty(i)) {
                    sound = this.sounds[i];
                    sound.volume = Number(sound.getAttribute("volumeReal")) * volume;
                }
            }

            this.ItemsHolder.setItem("muted", "0");
        }


        /* Other modifiers
        */

        /**
         * @return {Mixed} The Function or Number used as the volume setter for
         *                 "local" sounds.    
         */
        getGetVolumeLocal(): any {
            return this.getVolumeLocal;
        }

        /**
         * @param {Mixed} getVolumeLocal   A new Function or Number to use as the
         *                                 volume setter for "local" sounds.
         */
        setGetVolumeLocal(getVolumeLocalNew: any): void {
            this.getVolumeLocal = getVolumeLocalNew;
        }

        /**
         * @return {Mixed} The Function or String used to get the default theme for
         *                 playTheme calls.
         */
        getGetThemeDefault(): any {
            return this.getThemeDefault;
        }

        /**
         * @param {Mixed} A new Function or String to use as the source for theme
         *                names in default playTheme calls.
         */
        setGetThemeDefault(getThemeDefaultNew: any): void {
            this.getThemeDefault = getThemeDefaultNew;
        }


        /* Playback
        */

        /**
         * Plays the sound of the given name. Internally, this stops any previously
         * playing sound of that name and starts a new one, with volume set to the
         * current volume and muted status. If the name wasn't previously being 
         * played (and therefore a new Element has been created), an event listener
         * is added to delete it from sounds after.
         * 
         * @param {String} name   The name of the sound to play.
         * @return {HTMLAudioElement} The sound's <audio> element, now playing.
         */
        play(name: string): HTMLAudioElement {
            var sound: HTMLAudioElement,
                used: number;

            // If the sound isn't yet being played, see if it's in the library
            if (!this.sounds.hasOwnProperty(name)) {
                // If the sound also isn't in the library, it's unknown
                if (!this.library.hasOwnProperty(name)) {
                    throw new Error("Unknown name given to AudioPlayr.play: '" + name + "'.");
                }
                sound = this.sounds[name] = this.library[name];
            } else {
                sound = this.sounds[name];
            }

            this.soundStop(sound);

            if (this.getMuted()) {
                sound.volume = 0;
            } else {
                sound.setAttribute("volumeReal", "1");
                sound.volume = this.getVolume();
            }

            this.playSound(sound);
            used = Number(sound.getAttribute("used"));

            // If this is the song's first play, let it know how to stop
            if (!used) {
                sound.setAttribute("used", String(used + 1));
                sound.addEventListener("ended", this.soundFinish.bind(this, name));
            }

            sound.setAttribute("name", name);
            return sound;
        }

        /**
         * Pauses all currently playing sounds.
         */
        pauseAll(): void {
            var i: string;

            for (i in this.sounds) {
                if (this.sounds.hasOwnProperty(i)) {
                    this.pauseSound(this.sounds[i]);
                }
            }
        }

        /**
         * Un-pauses (resumes) all currently paused sounds.
         */
        resumeAll(): void {
            var i: string;

            for (i in this.sounds) {
                if (!this.sounds.hasOwnProperty(i)) {
                    continue;
                }
                this.playSound(this.sounds[i]);
            }
        }

        /**
         * Pauses the currently playing theme, if there is one.
         */
        pauseTheme(): void {
            if (this.theme) {
                this.pauseSound(this.theme);
            }
        }

        /**
         * Resumes the theme, if there is one and it's paused.
         */
        resumeTheme(): void {
            if (this.theme) {
                this.playSound(this.theme);
            }
        }

        /**
         * Stops all sounds and any theme, and removes all references to them.
         */
        clearAll(): void {
            this.pauseAll();
            this.clearTheme();
            this.sounds = {};
        }

        /**
         * Pauses and removes the theme, if there is one.
         */
        clearTheme(): void {
            if (!this.theme) {
                return;
            }

            this.pauseTheme();
            delete this.sounds[this.theme.getAttribute("name")];
            this.theme = undefined;
            this.themeName = undefined;
        }

        /**
         * "Local" version of play that changes the output sound's volume depending
         * on the result of a getVolumeLocal call. This defaults to 1, but may be
         * less. For example, in a video game, sounds further from the viewpoint
         * should have lessened volume.
         * 
         * @param {String} name   The name of the sound to play.
         * @param {Mixed} [location]   An argument for getVolumeLocal, if that's a
         *                             Function.
         * @return {HTMLAudioElement} The sound's <audio> element, now playing.
         */
        playLocal(name: string, location: any = undefined): HTMLAudioElement {
            var sound: HTMLAudioElement = this.play(name),
                volumeReal: number;

            switch (this.getVolumeLocal.constructor) {
                case Function:
                    volumeReal = this.getVolumeLocal(location);
                    break;
                case Number:
                    volumeReal = this.getVolumeLocal;
                    break;
                default:
                    volumeReal = Number(this.getVolumeLocal) || 1;
                    break;
            }

            sound.setAttribute("volumeReal", String(volumeReal));

            if (this.getMuted()) {
                sound.volume = 0;
            } else {
                sound.volume = volumeReal * this.getVolume();
            }

            return sound;
        }

        /**
         * Pauses any previously playing theme and starts playback of a new theme
         * sound. This is different from normal sounds in that it normally loops and
         * is controlled by pauseTheme and co. If loop is on and the sound wasn't
         * already playing, an event listener is added for when it ends.
         * 
         * @param {String} [name]   The name of the sound to be used as the theme.
         *                          If not provided, getThemeDefault is used to 
         *                          provide one.
         * @param {Boolean} [loop]   Whether the theme should always loop (by 
         *                           default, true).
         * @return {HTMLAudioElement} The theme's <audio> element, now playing.
         */
        playTheme(name: string = undefined, loop: boolean = undefined): HTMLAudioElement {
            this.pauseTheme();

            // Loop defaults to true
            loop = typeof loop !== "undefined" ? loop : true;

            // If name isn't given, use the default getter
            if (typeof (name) === "undefined") {
                switch (this.getThemeDefault.constructor) {
                    case Function:
                        name = this.getThemeDefault();
                        break;
                    default:
                        name = this.getThemeDefault;
                        break;
                }
            }

            // If a theme already exists, kill it
            if (typeof this.theme !== "undefined" && this.theme.hasAttribute("name")) {
                delete this.sounds[this.theme.getAttribute("name")];
            }

            this.themeName = name;
            this.theme = this.sounds[name] = this.play(name);
            this.theme.loop = loop;

            // If it's used (no repeat), add the event listener to resume theme
            if (this.theme.getAttribute("used") === "1") {
                this.theme.addEventListener("ended", this.playTheme.bind(this));
            }

            return this.theme;
        }

        /**
         * Wrapper around playTheme that plays a sound, then a theme. This is 
         * implemented using an event listener on the sound's ending.
         * 
         * @param {String} [prefix]    A prefix for the sound? Not sure...
         * @param {String} [name]   The name of the sound to be used as the theme.
         *                          If not provided, getThemeDefault is used to 
         *                          provide one.
         * @param {Boolean} [loop]   Whether the theme should always loop (by 
         *                           default, false).
         * @return {HTMLAudioElement} The sound's <audio> element, now playing.
         */
        playThemePrefixed(prefix: string = undefined, name: string = undefined, loop: boolean = undefined): HTMLAudioElement {
            var sound: HTMLAudioElement = this.play(prefix);

            this.pauseTheme();

            // If name isn't given, use the default getter
            if (typeof (name) === "undefined") {
                switch (this.getThemeDefault.constructor) {
                    case Function:
                        name = this.getThemeDefault();
                        break;
                    default:
                        name = this.getThemeDefault;
                        break;
                }
            }

            this.addEventListener(prefix, "ended", this.playTheme.bind(this, prefix + " " + name, loop));

            return sound;
        }


        /* Public utilities
        */

        /**
         * Adds an event listener to a currently playing sound. The sound will keep
         * track of event listeners via an .addedEvents attribute, so they can be
         * cancelled later.
         * 
         * @param {String} name   The name of the sound.
         * @param {String} event   The name of the event, such as "ended".
         * @param {Function} callback   The Function to be called by the event.
         */
        addEventListener(name: string, event: string, callback: any): void {
            var sound: any = this.library[name];

            if (!sound) {
                throw new Error("Unknown name given to addEventListener: '" + name + "'.");
            }

            if (!sound.addedEvents) {
                sound.addedEvents = {};
            }

            if (!sound.addedEvents[event]) {
                sound.addedEvents[event] = [callback];
            } else {
                sound.addedEvents[event].push(callback);
            }

            sound.addEventListener(event, callback);
        }

        /**
         * Clears all events added by this.addEventListener to a sound under a given
         * event. 
         * 
         * @param {String} name   The name of the sound.
         * @param {String} event   The name of the event, such as "ended".
         */
        removeEventListeners(name: string, event: string): void {
            var sound: any = this.library[name],
                events: any,
                i: number;

            if (!sound) {
                throw new Error("Unknown name given to removeEventListeners: '" + name + "'.");
            }

            if (!sound.addedEvents) {
                return;
            }

            events = sound.addedEvents[event];
            if (!events) {
                return;
            }

            for (i = 0; i < events.length; i += 1) {
                sound.removeEventListener(event, events[i]);
            }

            events.length = 0;
        }

        /**
         * Adds an event listener to a sound. If the sound doesn't exist or has 
         * finished playing, it's called immediately.
         * 
         * @param {String} name   The name of the sound.
         * @param {String} event   The name of the event, such as "onended".
         * @param {Function} callback   The Function to be called by the event.
         */
        addEventImmediate(name: string, event: string, callback: any): void {
            if (!this.sounds.hasOwnProperty(name) || this.sounds[name].paused) {
                callback();
                return;
            }

            this.sounds[name].addEventListener(event, callback);
        }


        /* Private utilities
        */

        /**
         * Called when a sound has completed to get it out of sounds.
         * 
         * @param {String} name   The name of the sound that just finished.
         */
        private soundFinish(name: string): void {
            if (this.sounds.hasOwnProperty(name)) {
                delete this.sounds[name];
            }
        }

        /**
         * Carefully stops a sound. HTMLAudioElement don't natively have a .stop()
         * function, so this is the shim to do that.
         */
        private soundStop(sound: HTMLAudioElement): void {
            this.pauseSound(sound);
            if (sound.readyState) {
                sound.currentTime = 0;
            }
        }


        /* Private loading / resetting
        */

        /**
         * Loads every sound defined in the library via AJAX. Sounds are loaded
         * into <audio> elements via createAudio and stored in the library.
         */
        private libraryLoad(): void {
            var section: any,
                name: string,
                sectionName: string,
                j: string;

            // For each given section (e.g. names, themes):
            for (sectionName in this.library) {
                if (!this.library.hasOwnProperty(sectionName)) {
                    continue;
                }
                section = this.library[sectionName];

                // For each thing in that section:
                for (j in section) {
                    if (!section.hasOwnProperty(j)) {
                        continue;
                    }
                    name = section[j];

                    // Create the sound and store it in the container
                    this.library[name] = this.createAudio(name, sectionName);
                }
            }
        }

        /**
         * Creates an audio element, gives it sources, and starts preloading.
         * 
         * @param {String} name
         * @param {String} sectionName
         * @return {HTMLAudioElement}
         */
        private createAudio(name: string, sectionName: string): HTMLAudioElement {
            var sound: HTMLAudioElement = document.createElement("audio"),
                sourceType: string,
                child: HTMLSourceElement,
                i: number;

            // Create an audio source for each child
            for (i = 0; i < this.fileTypes.length; i += 1) {
                sourceType = this.fileTypes[i];
                child = <HTMLSourceElement>document.createElement("source");

                child.type = "audio/" + sourceType;
                child.src = this.directory + "/" + sectionName + "/" + sourceType + "/" + name + "." + sourceType;

                sound.appendChild(child);
            }

            // This preloads the sound.
            sound.volume = 0;
            sound.setAttribute("volumeReal", "1");
            sound.setAttribute("used", "0");
            this.playSound(sound);

            return sound;
        }

        /**
         * Utility to try to play a sound, which may not be possible in headless
         * environments like PhantomJS.
         * 
         * @param {HTMLAudioElement} sound
         * @return {Boolean} Whether the sound was able to play.
         */
        private playSound(sound: HTMLAudioElement): boolean {
            if (sound && sound.play) {
                sound.play();
                return true;
            }
            return false;
        }

        /**
         * Utility to try to pause a sound, which may not be possible in headless
         * environments like PhantomJS.
         * 
         * @param {HTMLAudioElement} sound
         * @return {Boolean} Whether the sound was able to pause.
         */
        private pauseSound(sound: HTMLAudioElement): boolean {
            if (sound && sound.pause) {
                sound.pause();
                return true;
            }
            return false;
        }
    }
}
