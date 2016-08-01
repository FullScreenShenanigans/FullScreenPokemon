/// <reference path="../typings/ItemsHoldr.d.ts" />
declare namespace AudioPlayr {
    /**
     * An audio playback manager for persistent and on-demand themes and sounds.
     */
    class AudioPlayr implements IAudioPlayr {
        /**
         * HTMLAudioElements keyed by their name.
         */
        private library;
        /**
         * Directories mapping folder names to sound libraries.
         */
        private directories;
        /**
         * What file types to add as sources to sounds.
         */
        private fileTypes;
        /**
         * Currently playing sound objects, keyed by name (excluding extensions).
         */
        private sounds;
        /**
         * The currently playing theme.
         */
        private theme;
        /**
         * The name of the currently playing theme.
         */
        private themeName;
        /**
         * Directory from which audio files are AJAXed upon startup.
         */
        private directory;
        /**
         * The Function or Number used to determine what playLocal's volume is.
         */
        private getVolumeLocal;
        /**
         * The Function or String used to get a default theme name.
         */
        private getThemeDefault;
        /**
         * Storage container for settings like volume and muted status.
         */
        private ItemsHolder;
        /**
         * Initializes a new instance of the AudioPlayr class.
         *
         * @param settings   Settings to use for initialization.
         */
        constructor(settings: IAudioPlayrSettings);
        /**
         * @returns The listing of <audio> Elements, keyed by name.
         */
        getLibrary(): any;
        /**
         * @returns The allowed filetypes for audio files.
         */
        getFileTypes(): string[];
        /**
         * @returns The currently playing <audio> Elements, keyed by name.
         */
        getSounds(): any;
        /**
         * @returns The current playing theme's <audio> Element.
         */
        getTheme(): HTMLAudioElement;
        /**
         * @returns The name of the currently playing theme.
         */
        getThemeName(): string;
        /**
         * @returns The directory under which all filetype directories are to be located.
         */
        getDirectory(): string;
        /**
         * @returns The current volume as a Number in [0,1], retrieved by the ItemsHoldr.
         */
        getVolume(): number;
        /**
         * Sets the current volume. If not muted, all sounds will have their volume
         * updated.
         *
         * @param volume   A Number in [0,1] to set as the current volume.
         */
        setVolume(volume: number): void;
        /**
         * @returns Whether this is currently muted.
         */
        getMuted(): boolean;
        /**
         * Calls either setMutedOn or setMutedOff as is appropriate.
         *
         * @param muted   The new status for muted.
         */
        setMuted(muted: boolean): void;
        /**
         * Calls either setMutedOn or setMutedOff to toggle whether this is muted.
         */
        toggleMuted(): void;
        /**
         * Sets volume to 0 in all currently playing sounds and stores the muted
         * status as on in the internal ItemsHoldr.
         */
        setMutedOn(): void;
        /**
         * Sets sound volumes to their actual volumes and stores the muted status
         * as off in the internal ItemsHoldr.
         */
        setMutedOff(): void;
        /**
         * @returns The Function or Number used as the volume setter for local sounds.
         */
        getGetVolumeLocal(): any;
        /**
         * @param getVolumeLocal   A new Function or Number to use as the volume setter
         *                         for local sounds.
         */
        setGetVolumeLocal(getVolumeLocalNew: any): void;
        /**
         * @returns The Function or String used to get the default theme for playTheme.
         */
        getGetThemeDefault(): any;
        /**
         * @param getThemeDefaultNew A new Function or String to use as the source for
         *                           theme names in default playTheme calls.
         */
        setGetThemeDefault(getThemeDefaultNew: any): void;
        /**
         * Plays the sound of the given name.
         *
         * @param name   The name of the sound to play.
         * @returns The sound's <audio> element, now playing.
         * @remarks Internally, this stops any previously playing sound of that name
         *          and starts a new one, with volume set to the current volume and
         *          muted status. If the name wasn't previously being played (and
         *          therefore a new Element has been created), an event listener is
         *          added to delete it from sounds after.
         */
        play(name: string): HTMLAudioElement;
        /**
         * Pauses all currently playing sounds.
         */
        pauseAll(): void;
        /**
         * Un-pauses (resumes) all currently paused sounds.
         */
        resumeAll(): void;
        /**
         * Pauses the currently playing theme, if there is one.
         */
        pauseTheme(): void;
        /**
         * Resumes the theme, if there is one and it's paused.
         */
        resumeTheme(): void;
        /**
         * Stops all sounds and any theme, and removes all references to them.
         */
        clearAll(): void;
        /**
         * Pauses and removes the theme, if there is one.
         */
        clearTheme(): void;
        /**
         * "Local" version of play that changes the output sound's volume depending
         * on the result of a getVolumeLocal call.
         *
         * @param name   The name of the sound to play.
         * @param location   An argument for getVolumeLocal, if that's a Function.
         * @returns The sound's <audio> element, now playing.
         */
        playLocal(name: string, location?: any): HTMLAudioElement;
        /**
         * Pauses any previously playing theme and starts playback of a new theme.
         *
         * @param name   The name of the sound to be used as the theme. If not
         *               provided, getThemeDefault is used to
         *                          provide one.
         * @param loop   Whether the theme should always loop (by default, true).
         * @returns The theme's <audio> element, now playing.
         * @remarks This is different from normal sounds in that it normally loops
         *          and is controlled by pauseTheme and co. If loop is on and the
         *          sound wasn't already playing, an event listener is added for
         *          when it ends.
         */
        playTheme(name?: string, loop?: boolean): HTMLAudioElement;
        /**
         * Wrapper around playTheme that plays a sound, then a theme. This is
         * implemented using an event listener on the sound's ending.
         *
         * @param prefix    The name of a sound to play before the theme.
         * @param name   The name of the sound to be used as the theme. If not
         *               provided, getThemeDefault is used to
         *                          provide one.
         * @param loop   Whether the theme should always loop (by default, false).
         * @returns The sound's <audio> element, now playing.
         */
        playThemePrefixed(prefix: string, name?: string, loop?: boolean): HTMLAudioElement;
        /**
         * Adds an event listener to a currently playing sound. The sound will keep
         * track of event listeners via an .addedEvents attribute, so they can be
         * cancelled later.
         *
         * @param name   The name of the sound.
         * @param event   The name of the event, such as "ended".
         * @param callback   The Function to be called by the event.
         */
        addEventListener(name: string, event: string, callback: any): void;
        /**
         * Clears all events added by this.addEventListener to a sound under a given
         * event.
         *
         * @param name   The name of the sound.
         * @param event   The name of the event, such as "ended".
         */
        removeEventListeners(name: string, event: string): void;
        /**
         * Adds an event listener to a sound. If the sound doesn't exist or has
         * finished playing, it's called immediately.
         *
         * @param name   The name of the sound.
         * @param event   The name of the event, such as "onended".
         * @param callback   The Function to be called by the event.
         */
        addEventImmediate(name: string, event: string, callback: any): void;
        /**
         * Called when a sound has completed to get it out of sounds.
         *
         * @param name   The name of the sound that just finished.
         */
        private soundFinish(name);
        /**
         * Carefully stops a sound. HTMLAudioElement don't natively have a .stop()
         * function, so this is the shim to do that.
         */
        private soundStop(sound);
        /**
         * Loads every sound defined in the library via AJAX. Sounds are loaded
         * into <audio> elements via createAudio and stored in the library.
         */
        private generateLibraryFromSettings(librarySettings);
        /**
         * Creates an audio element, gives it sources, and starts preloading.
         *
         * @param name   The name of the sound to play.
         * @param sectionName   The name of the directory containing the sound.
         * @returns An <audio> element ocntaining the sound, currently playing.
         */
        private createAudio(name, directory);
        /**
         * Utility to try to play a sound, which may not be possible in headless
         * environments like PhantomJS.
         *
         * @param sound   An <audio> element to play.
         * @returns Whether the sound was able to play.
         */
        private playSound(sound);
        /**
         * Utility to try to pause a sound, which may not be possible in headless
         * environments like PhantomJS.
         *
         * @param sound   An <audio> element to pause.
         * @returns Whether the sound was able to pause.
         */
        private pauseSound(sound);
    }
    /**
     * Lookup for directories to the sounds contained within.
     */
    interface ILibrarySettings {
        [i: string]: string[];
    }
    /**
     * Lookup for HTMLAudioElements keyed by their names.
     */
    interface ISoundsLibrary {
        [i: string]: HTMLAudioElement;
    }
    /**
     * Lookup for directories of sounds to their sound libraries.
     */
    interface IDirectoriesLibrary {
        [i: string]: ISoundsLibrary;
    }
    /**
     * Settings to initialize a new instance of an IAudioPlayr.
     */
    interface IAudioPlayrSettings {
        /**
         * The names of the audio files to be preloaded for on-demand playback.
         */
        library: ILibrarySettings;
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
        getThemeDefault?: string | {
            (...args: any[]): string;
        };
        /**
         * A Number or Function to get the "local" volume for playLocal calls.
         * Functions are called for a return value, and Numbers are constant
         * (defaults to 1).
         *
         */
        getVolumeLocal?: number | {
            (...args: any[]): number;
        };
    }
    /**
     * An audio playback manager for persistent and on-demand themes and sounds.
     */
    interface IAudioPlayr {
        /**
         * @returns The listing of <audio> Elements, keyed by name.
         */
        getLibrary(): any;
        /**
         * @returns The allowed filetypes for audio files.
         */
        getFileTypes(): string[];
        /**
         * @returns The currently playing <audio> Elements, keyed by name.
         */
        getSounds(): any;
        /**
         * @returns The current playing theme's <audio> Element.
         */
        getTheme(): HTMLAudioElement;
        /**
         * @returns The name of the currently playing theme.
         */
        getThemeName(): string;
        /**
         * @returns The directory under which all filetype directories are to be located.
         */
        getDirectory(): string;
        /**
         * @returns The current volume as a Number in [0,1], retrieved by the ItemsHoldr.
         */
        getVolume(): number;
        /**
         * Sets the current volume. If not muted, all sounds will have their volume
         * updated.
         *
         * @param volume   A Number in [0,1] to set as the current volume.
         */
        setVolume(volume: number): void;
        /**
         * @returns Whether this is currently muted.
         */
        getMuted(): boolean;
        /**
         * Calls either setMutedOn or setMutedOff as is appropriate.
         *
         * @param muted   The new status for muted.
         */
        setMuted(muted: boolean): void;
        /**
         * Calls either setMutedOn or setMutedOff to toggle whether this is muted.
         */
        toggleMuted(): void;
        /**
         * Sets volume to 0 in all currently playing sounds and stores the muted
         * status as on in the internal ItemsHoldr.
         */
        setMutedOn(): void;
        /**
         * Sets sound volumes to their actual volumes and stores the muted status
         * as off in the internal ItemsHoldr.
         */
        setMutedOff(): void;
        /**
         * @returns The Function or Number used as the volume setter for local sounds.
         */
        getGetVolumeLocal(): any;
        /**
         * @param getVolumeLocal   A new Function or Number to use as the volume setter
         *                         for local sounds.
         */
        setGetVolumeLocal(getVolumeLocalNew: any): void;
        /**
         * @returns The Function or String used to get the default theme for playTheme.
         */
        getGetThemeDefault(): any;
        /**
         * @param getThemeDefaultNew A new Function or String to use as the source for
         *                           theme names in default playTheme calls.
         */
        setGetThemeDefault(getThemeDefaultNew: any): void;
        /**
         * Plays the sound of the given name.
         *
         * @param name   The name of the sound to play.
         * @returns The sound's <audio> element, now playing.
         * @remarks Internally, this stops any previously playing sound of that name
         *          and starts a new one, with volume set to the current volume and
         *          muted status. If the name wasn't previously being played (and
         *          therefore a new Element has been created), an event listener is
         *          added to delete it from sounds after.
         */
        play(name: string): HTMLAudioElement;
        /**
         * Pauses all currently playing sounds.
         */
        pauseAll(): void;
        /**
         * Un-pauses (resumes) all currently paused sounds.
         */
        resumeAll(): void;
        /**
         * Pauses the currently playing theme, if there is one.
         */
        pauseTheme(): void;
        /**
         * Resumes the theme, if there is one and it's paused.
         */
        resumeTheme(): void;
        /**
         * Stops all sounds and any theme, and removes all references to them.
         */
        clearAll(): void;
        /**
         * Pauses and removes the theme, if there is one.
         */
        clearTheme(): void;
        /**
         * "Local" version of play that changes the output sound's volume depending
         * on the result of a getVolumeLocal call.
         *
         * @param name   The name of the sound to play.
         * @param location   An argument for getVolumeLocal, if that's a Function.
         * @returns The sound's <audio> element, now playing.
         */
        playLocal(name: string, location?: any): HTMLAudioElement;
        /**
         * Pauses any previously playing theme and starts playback of a new theme.
         *
         * @param name   The name of the sound to be used as the theme. If not
         *               provided, getThemeDefault is used to
         *                          provide one.
         * @param loop   Whether the theme should always loop (by default, true).
         * @returns The theme's <audio> element, now playing.
         * @remarks This is different from normal sounds in that it normally loops
         *          and is controlled by pauseTheme and co. If loop is on and the
         *          sound wasn't already playing, an event listener is added for
         *          when it ends.
         */
        playTheme(name?: string, loop?: boolean): HTMLAudioElement;
        /**
         * Wrapper around playTheme that plays a sound, then a theme. This is
         * implemented using an event listener on the sound's ending.
         *
         * @param prefix    The name of a sound to play before the theme.
         * @param name   The name of the sound to be used as the theme. If not
         *               provided, getThemeDefault is used to
         *                          provide one.
         * @param loop   Whether the theme should always loop (by default, false).
         * @returns The sound's <audio> element, now playing.
         */
        playThemePrefixed(prefix?: string, name?: string, loop?: boolean): HTMLAudioElement;
        /**
         * Adds an event listener to a currently playing sound. The sound will keep
         * track of event listeners via an .addedEvents attribute, so they can be
         * cancelled later.
         *
         * @param name   The name of the sound.
         * @param event   The name of the event, such as "ended".
         * @param callback   The Function to be called by the event.
         */
        addEventListener(name: string, event: string, callback: any): void;
        /**
         * Clears all events added by this.addEventListener to a sound under a given
         * event.
         *
         * @param name   The name of the sound.
         * @param event   The name of the event, such as "ended".
         */
        removeEventListeners(name: string, event: string): void;
        /**
         * Adds an event listener to a sound. If the sound doesn't exist or has
         * finished playing, it's called immediately.
         *
         * @param name   The name of the sound.
         * @param event   The name of the event, such as "onended".
         * @param callback   The Function to be called by the event.
         */
        addEventImmediate(name: string, event: string, callback: any): void;
    }
}
declare var module: any;
