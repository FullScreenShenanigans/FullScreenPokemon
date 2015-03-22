/**
 * AudioPlayr.js
 * 
 * An audio library to automate preloading and controlled playback of multiple
 * audio tracks, with support for different browsers' preferred fileTypes.
 * Volume and mute status are stored locally using a StatsHoldr, which in turn
 * requires proliferate and createElement functions (such as those given by the
 * EightBittr prototype).
 * 
 * @example
 * // Creating and using an AudioPlayr to load and play audio files. The 
 * // 'Sounds/Samples/mp3' directory should have Coin.mp3 and Bump.mp3 in it.
 * var AudioPlayer = new AudioPlayr({
 *     "directory": "Sounds",
 *     "fileTypes": ["mp3"],
 *     "statistics": {
 *         "prefix": "MyAudioPlayr",
 *         "proliferate": EightBittr.prototype.proliferate,
 *         "createElement": EightBittr.prototype.createElement,
 *         "values": {
 *             "volume": {
 *                 "valueDefault": 0.5,
 *                 "storeLocally": true
 *             },
 *             "muted": {
 *                 "valueDefault": 0,
 *                 "storeLocally": false
 *             }
 *         }
 *     },
 *     "library": {
 *         "Sounds": [
 *             "Coin",
 *             "Bump"
 *         ]
 *     }
 * });
 * AudioPlayer.play("Coin"); // Returns an <audio> playing Coin.mp3
 * 
 * @example
 * // Creating and using an AudioPlayr to load and play audio files. A theme 
 * // track is kept looping in the background, and the Coin sound is played 
 * // every seven seconds.
 * var AudioPlayer = new AudioPlayr({
 *     "directory": "Sounds",
 *     "fileTypes": ["mp3"],
 *     "statistics": {
 *         "prefix": "MyAudioPlayr",
 *         "proliferate": EightBittr.prototype.proliferate,
 *         "createElement": EightBittr.prototype.createElement,
 *         "values": {
 *             "volume": {
 *                 "valueDefault": 0.5,
 *                 "storeLocally": true
 *             },
 *             "muted": {
 *                 "valueDefault": 0,
 *                 "storeLocally": false
 *             }
 *         }
 *     },
 *     "library": {
 *         "Sounds": [
 *             "Coin"
 *         ],
 *         "Themes": [
 *             "Overworld"
 *         ]
 *     }
 * });
 * AudioPlayer.playTheme("Overworld");
 * setInterval(function () {
 *     AudioPlayer.play("Coin");
 * }, 7000);
 * 
 * @author "Josh Goldberg" <josh@fullscreenmario.com>
 */
function AudioPlayr(settings) {
    "use strict";
    if (!this || this === window) {
        return new AudioPlayr(settings);
    }
    var self = this,

        // A listing of filenames to be turned into <audio> objects.
        library,

        // What file types to add as sources to sounds.
        fileTypes,

        // Currently playing sound objects, keyed by name (no extensions).
        sounds,

        // The currently playing theme.
        theme,

        // Directory from which audio files are AJAXed upon startup.
        directory,

        // The Function or Number used to determine what playLocal's volume is.
        getVolumeLocal,

        // The Function or String used to get a default theme name.
        getThemeDefault,

        // Storage container for settings like volume and muted status.
        StatsHolder;
    
    /**
     * Resets the AudioPlayr.
     * 
     * @constructor
     * @param {Object} library   The names of the audio files to be preloaded so
     *                           they can later be played by the AudioPlayr. The
     *                           library Object stores Objects inside it, 
     *                           representing the paths within each filetype's
     *                           directory.
     * @param {String} directory   The directory in which all directories of 
     *                             audio files are stored.
     * @param {String[]} filetypes   The allowed filetypes for each audio file.
     *                               Each of these should have a directory of
     *                               their name under the main directory, which
     *                               should contain each file of the filetype.
     * @param {Object} statistics   The arguments to be passed to the internal
     *                              StatsHoldr. This must contain values for 
     *                              "volume" and "muted".
     * @param {Mixed} [getThemeDefault]   A Function or String to get the 
     *                                    default theme for playTheme calls.
     *                                    Functions are called for a return
     *                                    value, and Strings are constant
     *                                    (defaults to "Theme").
     * @param {Mixed} [getVolumeLocal]   A Function or Number to get the "local"
     *                                   volume for playLocal calls. Functions
     *                                   are called for a return value, and 
     *                                   Numbers are constant (defaults to 1).
     */
    self.reset = function (settings) {
        library = settings.library;
        directory = settings.directory;
        fileTypes = settings.fileTypes;
        getThemeDefault = settings.getThemeDefault || "Theme";
        getVolumeLocal = typeof settings.getVolumeLocal === "undefined" 
            ? 1 : settings.getVolumeLocal;

        // Sounds should always start blank
        sounds = {};

        // Preload everything!
        libraryLoad();
        
        StatsHolder = new StatsHoldr(settings.statistics);
        
        self.setVolume(StatsHolder.get("volume"));
        self.setMuted(StatsHolder.get("muted"));
    };
    
    
    /* Simple getters
    */
    
    /**
     * @return {Object} The listing of <audio> Elements, keyed by name.
     */
    self.getLibrary = function () {
        return library;
    };
    
    /**
     * @return {String[]} The allowed filetypes for audio files.
     */
    self.getfileTypes = function () {
        return fileTypes;
    };
    
    /**
     * @return {Object} The currently playing <audio> Elements, keyed by name.
     */
    self.getSounds = function () {
        return sounds;
    };
    
    /**
     * @return {HTMLAudioElement} The current playing theme's <audio> Element.
     */
    self.getTheme = function () {
        return theme;
    };
    
    /**
     * @return {String} The directory under which all filetype directories are 
     *                  to be located.
     */
    self.getDirectory = function () {
        return directory;
    };
    
    
    /* Playback modifiers
    */
    
    /**
     * @return {Number} The current volume, which is a Number in [0,1],
     *                  retrieved by the StatsHoldr.
     */
    self.getVolume = function () {
        return StatsHolder.get("volume");
    };
    
    /**
     * Sets the current volume. If not muted, all sounds will have their volume
     * updated.
     * 
     * @param {Number} volume   A Number in [0,1] to set as the current volume.
     */
    self.setVolume = function (volume) {
        if (!self.getMuted()) {
            for (var i in sounds) {
                sounds[i].volume = sounds[i].volumeReal * volume;
            }
        }
        
        StatsHolder.set("volume", volume);
    };
    
    /**
     * @return {Boolean} whether this is currently muted.
     */
    self.getMuted = function () {
        return Boolean(StatsHolder.get("muted"));
    };
    
    /**
     * Calls either setMutedOn or setMutedOff as is appropriate.
     * 
     * @param {Boolean} muted   The new status for muted.
     */
    self.setMuted = function (muted) {
        muted ? self.setMutedOn() : self.setMutedOff();
    }
    
    /**
     * Calls either setMutedOn or setMutedOff to toggle whether this is muted.
     */
    self.toggleMuted = function () {
        self.setMuted(!self.getMuted());
    };
    
    /**
     * Sets volume to 0 in all currently playing sounds and stores the muted
     * status as on in the internal StatsHoldr.
     */
    self.setMutedOn = function () {
        for (var i in sounds) {
            if (sounds.hasOwnProperty(i)) {
                sounds[i].volume = 0;
            }
        }
        StatsHolder.set("muted", 1);
    };
    
    /**
     * Sets sound volumes to their actual volumes and stores the muted status
     * as off in the internal StatsHoldr.
     */
    self.setMutedOff = function () {
        var volume = self.getVolume(),
            sound, i;
        
        for (i in sounds) {
            if (sounds.hasOwnProperty(i)) {
                sound = sounds[i];
                sound.volume = sound.volumeReal * volume;
            }
        }
        
        StatsHolder.set("muted", 0);
    };
    
    
    /* Other modifiers
    */
    
    /**
     * @return {Mixed} The Function or Number used as the volume setter for
     *                 "local" sounds.    
     */
    self.getGetVolumeLocal = function () {
        return getVolumeLocal;
    };
    
    /**
     * @param {Mixed} getVolumeLocal   A new Function or Number to use as the
     *                                 volume setter for "local" sounds.
     */
    self.setGetVolumeLocal = function (getVolumeLocalNew) {
        getVolumeLocal = getVolumeLocalNew;
    };
    
    /**
     * @return {Mixed} The Function or String used to get the default theme for
     *                 playTheme calls.
     */
    self.getGetThemeDefault = function () {
        return getThemeDefault;
    };
    
    /**
     * @param {Mixed} A new Function or String to use as the source for theme
     *                names in default playTheme calls.
     */
    self.setGetThemeDefault = function (getThemeDefaultNew) {
        getThemeDefault = getThemeDefaultNew;
    };
    
    
    /* Playback
    */
    
    /**
     * @param {String} name   The name of the sound to play.
     * 
     * Plays the sound of the given name. Internally, this stops any previously
     * playing sound of that name and starts a new one, with volume set to the
     * current volume and muted status. If the name wasn't previously being 
     * played (and therefore a new Element has been created), an event listener
     * is added to delete it from sounds after.
     * 
     * @return {HTMLAudioElement} The sound's <audio> element, now playing.
     */
    self.play = function (name) {
        var sound;
        
        // If the sound isn't yet being played, see if it's in the library
        if (!sounds.hasOwnProperty(name)) {
            // If the sound also isn't in the library, it's unknown
            if (!library.hasOwnProperty(name)) {
                throw new Error(
                    "Unknown name given to AudioPlayr.play: '" + name + "'."
                ); 
            }
            sounds[name] = sound = library[name];
        } else {
            sound = sounds[name];
        }
        
        soundStop(sound);
        
        if (self.getMuted()) {
            sound.volume = 0;
        } else {
            sound.volumeReal = 1;
            sound.volume = self.getVolume();
        }
        
        sound.play();
        
        // If this is the song's first play, let it know how to stop
        if (!sound.used) {
            sound.used += 1;
            sound.addEventListener("ended", soundFinish.bind(undefined, name));
        }
        
        sound.setAttribute("name", name);
        return sound;
    };
    
    /**
     * Pauses all currently playing sounds.
     */
    self.pauseAll = function () {
        for (var i in sounds) {
            if (sounds.hasOwnProperty(i)) {
                sounds[i].pause();
            }
        }
    };
    
    /**
     * Un-pauses (resumes) all currently paused sounds.
     */
    self.resumeAll = function () {
        for (var i in sounds) {
            if (!sounds.hasOwnProperty(i)) {
                continue;
            }
            sounds[i].play();
        }
    };
    
    /**
     * Pauses the currently playing theme, if there is one.
     */
    self.pauseTheme = function () {
        if (theme) {
            theme.pause();
        }
    };
    
    /**
     * Resumes the theme, if there is one and it's paused.
     */
    self.resumeTheme = function () {
        if (theme) {
            theme.play();
        }
    };
    
    /**
     * Stops all sounds and any theme, and removes all references to them.
     */
    self.clearAll = function () {
        self.pauseAll();
        self.clearTheme();
        sounds = {};
    };
    
    /**
     * Pauses and removes the theme, if there is one.
     */
    self.clearTheme = function () {
        if (!theme) {
            return;
        }
        
        self.pauseTheme();
        delete sounds[theme.getAttribute("name")];
        self.theme = undefined;
    };
    
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
    self.playLocal = function (name, location) {
        var sound = self.play(name);

        switch (getVolumeLocal.constructor) {
            case Function:
                sound.volumeReal = getVolumeLocal(location);
                break;
            case Number:
                sound.volumeReal = getVolumeLocal;
                break;
            default:
                sound.volumeReal = Number(volumeReal) || 1;
                break;
        }
        
        if (self.getMuted()) {
            sound.volume = 0;
        } else {
            sound.volume = sound.volumeReal * self.getVolume();
        }

        return sound;
    };
    
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
    self.playTheme = function (name, loop) {
        self.pauseTheme();
        
        // Loop defaults to true
        loop = typeof loop !== 'undefined' ? loop : true;

        // If name isn't given, use the default getter
        if (typeof(name) === "undefined") {
            switch (getThemeDefault.constructor) {
                case Function:
                    name = getThemeDefault();
                    break
                case String:
                    name = getThemeDefault;
                    break;
            }
        }
        
        // If a theme already exists, kill it
        if (typeof theme !== "undefined" && theme.hasAttribute("name")) {
            delete sounds[theme.getAttribute("name")];
        }
        
        sounds[name] = theme = self.play(name);
        theme.loop = loop;

        // If it's used (no repeat), add the event listener to resume theme
        if (theme.used === 1) {
            theme.addEventListener("ended", self.playTheme);
        }

        return theme;
    };
    
    /**
     * Wrapper around playTheme that plays a sound, then a theme. This is 
     * implemented using an event listener on the sound's ending.
     * 
     * @param {String} [name]   The name of the sound to be used as the theme.
     *                          If not provided, getThemeDefault is used to 
     *                          provide one.
     * @param {Boolean} [loop]   Whether the theme should always loop (by 
     *                           default, false).
     * @return {HTMLAudioElement} The sound's <audio> element, now playing.
     */
    self.playThemePrefixed = function (prefix, name, loop) {
        var sound = self.play(prefix);
        self.pauseTheme();
        
        // If name isn't given, use the default getter
        if (typeof(name) === "undefined") {
            switch (getThemeDefault.constructor) {
                case Function:
                    name = getThemeDefault();
                    break
                case String:
                    name = getThemeDefault;
                    break;
            }
        }
        
        self.addEventListener(
            prefix,
            "ended", 
            self.playTheme.bind(self, prefix + " " + name, loop)
        );
        
        return sound;
    };


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
    self.addEventListener = function(name, event, callback) {
        var sound = library[name];
        
        if (!sound) {
            throw new Error(
                "Unknown name given to addEventListener: '" + name + "'."
            );
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
    };
    
    /**
     * Clears all events added by self.addEventListener to a sound under a given
     * event. 
     * 
     * @param {String} name   The name of the sound.
     * @param {String} event   The name of the event, such as "ended".
     */
    self.removeEventListeners = function (name, event) {
        var sound = library[name],
            events, i;
        
        if (!sound) {
            throw new Error(
                "Unknown name given to removeEventListeners: '" + name + "'."
            );
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
    };  

    /**
     * Adds an event listener to a sound. If the sound doesn't exist or has 
     * finished playing, it's called immediately.
     * 
     * @param {String} name   The name of the sound.
     * @param {String} event   The name of the event, such as "onended".
     * @param {Function} callback   The Function to be called by the event.
     */
    self.addEventImmediate = function(name, event, callback) {
        if (!sounds.hasOwnProperty(name) || sounds[name].paused) {
            callback();
            return;
        }
        
        sounds[name].addEventListener(event, callback);
    };
    

    /* Private utilities
    */

    /**
     * Called when a sound has completed to get it out of sounds.
     */
    function soundFinish(name) {
        if (sounds.hasOwnProperty(name)) {
            delete sounds[name];
        }
    }

    /**
     * Carefully stops a sound. HTMLAudioElement don't natively have a .stop()
     * function, so this is the shim to do that.
     */
    function soundStop(sound) {
        sound.pause();
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
    function libraryLoad() {
        var section, name, sectionName, j;

        // For each given section (e.g. names, themes):
        for (sectionName in library) {
            section = library[sectionName];
            // For each thing in that section:
            for (j in section) {
                name = section[j];
                // Create the sound and store it in the container
                library[name] = createAudio(name, sectionName);
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
    function createAudio(name, sectionName) {
        var sound = document.createElement("audio"),
            type, child, i;

        // Create an audio source for each child
        for (i in fileTypes) {
            type = fileTypes[i];
            child = document.createElement("source");
            child.type = "audio/" + type;
            child.src = directory + "/" + sectionName + "/" + type + "/" + name + "." + type;
            
            sound.appendChild(child);
        }

        // This preloads the sound.
        sound.volume = 0;
        sound.volumeReal = 1;
        sound.used = 0;
        sound.play();
        
        return sound;
    }
     
    
    self.reset(settings || {});
}