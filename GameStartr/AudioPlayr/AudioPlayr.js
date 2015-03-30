/**
 * AudioPlayr.js
 * 
 * An audio library to automate loading and controlled playback of Gameboy audio
 * tracks via the ASM module. 
 * Volume and mute status are stored locally using a StatsHoldr, which in turn
 * requires proliferate and createElement Functions (such as those given by the
 * EightBittr prototype).
 * 
 * @author "Joe Pringle" <explodingp@gmail.com>
 * @author "Josh Goldberg" <josh@fullscreenmario.com>
 */


// TO REMOVE

//library - store a listing of GBS files. Looks like we'll need at least 2. One for the themes, one for 
//           various pokemon sounds and other misc sound effects.

//           In audio.js the gbs data will be stored as a base64 encoded string. Later on, however, we'll
//           decode that and ascii-fy each character to play nicely with the player. 

//           then, audioPlayr can interpret 

//                   play("ThemeViridianCity") 

//           as something like

//                   play_music_data(decodedPayload, 10);

//           which our music player understands!

//           Of course, since there will be multiple sound files, we'll need....



//directory - our master lookup table, keyed by song/theme name. Each key will look like (at least, probably
//           going to have to add more stuff later)

//           "Theme_00_Name" : {
//                               "gbs_source" : "blue"
//                               "track_num"  : 0
//                               }

//           Unfortunately, to save space, I don't think the theme names are included in the .gbs file, so
//           I'll scrape them from somewhere online and include them in audio.js.


function AudioPlayr(settings) {
    "use strict";
    if (!this || this === window) {
        return new AudioPlayr(settings);
    }
    var self = this,

        // A listing of GBS sources.
        library,

        // Master lookup table, keyed by trackName.
        directory,

        // The currently playing theme, as a string.
        theme,

        // The actual node playing audio.
        themeNode,

        // Storage container for settings like volume and muted status.
        StatsHolder;

    /**
     * Resets the AudioPlayr.
     * 
     * @constructor
     * @param {Object} library   Tracklists and encoded contents of any sound 
     *                           files, keyed by file.
     * @param {Object} statistics   The arguments to be passed to the internal
     *                              StatsHoldr. This must contain values for 
     *                              "volume" and "muted".
     */
    self.reset = function (settings) {
        if (typeof settings.library === "undefined") {
            throw new Error("No library given to AudioPlayr.");
        }

        if (typeof settings.statistics === "undefined") {
            throw new Error("No statistics given to AudioPlayr.");
        }

        library = settings.library;
        StatsHolder = new StatsHoldr(settings.statistics);

        // Initially, the directory is empty, and nothing is playing.
        directory = {};

        theme = null;
        themeNode = null;
        // Decode and ascii-fy all "gbs" library entries.
        decodeAll();

        // Create paths between trackName and actual playback information.
        populateDirectory();
    };


    /* 
    Decode all "gbs" entries in library.

    Replace each entry with an array of integers 0-255 representing the 
    decoded ascii contents.
     */

    function decodeAll() {
        for (var i in library) {
            library[i].gbs = window.atob(library[i].gbs).split('').map(
                function (c) {
                    return c.charCodeAt(0);
                }
            );
        }
    }

    /*
    Once all "gbs" entries have been decoded, scan through the library and 
    store relevant playback information in the directory, keyed by trackName.
    */
    function populateDirectory() {
        var i, track;

        for (i in library) {
            for (track in library[i].tracks) {
                directory[track] = {
                    "gbs_source": i,
                    "track_num": library[i].tracks[track]
                };
            }
        }
    };


    /* Simple gets
    */

    /**
     * 
     */
    self.getLibrary = function () {
        return library;
    };

    /**
     * 
     */
    self.getDirectory = function () {
        return directory;
    };

    /**
     * 
     */
    self.getTheme = function () {
        return theme;
    };

    /**
     * 
     */
    self.getVolume = function () {
        return StatsHolder.get("volume");
    };

    /**
     * 
     */
    self.getMuted = function () {

    };

    /**
     * Plays a sound or theme, keyed by track name.
     * 
     * @example AudioPlayer.play("openingTheme");
     */
    self.play = function (track) {

        // @TODO proper stop function
        if (themeNode) {
            themeNode.disconnect();
            themeNode = null;
        }
        var payload = library[directory[track].gbs_source].gbs,
            subtune = directory[track].track_num,
            // Required for libgme.js
            ref = Module.allocate(1, "i32", Module.ALLOC_STATIC),
            ctx = new AudioContext(),
            emu, node;

        if (Module.ccall(
            "gme_open_data",
            "number",
            ["array", "number", "number", "number"],
            [payload, payload.length, ref, ctx.sampleRate]
        )) {
            throw new Error("AudioPlayr could not call gme_open_data.");
        }

        // Determine the type of emulator to use to play this payload.
        emu = Module.getValue(ref, "i32");

        if (Module.ccall("gme_start_track", "number",
            ["number", "number"], [emu, subtune]) != 0)
            console.log("could not load track");

        // Actually play the track.
        theme = track;
        node = play_song(ctx, emu);
        window.savedReferences = [ctx, node];

    }

    /** 
     * Private function that ACTUALLY plays the song, in user's current context.
     */
    function play_song(ctx, emu) {
        var bufferSize = 1024 * 16,
            buffer = Module.allocate(
                bufferSize * 2, "i32", Module.ALLOC_STATIC
            ),
            INT16_MAX = Math.pow(2, 32) - 1,
            inputs = 2,
            outputs = 2,
            node, channels, error, temp, i, n;

        if (ctx.createJavaScriptNode) {
            node = ctx.createJavaScriptNode(bufferSize, inputs, outputs);
        } else if (!node && ctx.createScriptProcessor) {
            node = ctx.createScriptProcessor(bufferSize, inputs, outputs);
        }

        themeNode = node;

        node.onaudioprocess = function (e) {
            if (
                Module.ccall(
                    "gme_track_ended", "number", ["number"], [emu]
                ) == 1
            ) {
                // Can put any 'end-of-song' event handlers here, once 
                // AudioPlayr is more fleshed out.
                node.disconnect();
                theme = null;
                return;
            }

            channels = [
                e.outputBuffer.getChannelData(0),
                e.outputBuffer.getChannelData(1)
            ];

            error = Module.ccall(
                "gme_play",
                "number",
                ["number", "number", "number"],
                [emu, bufferSize * 2, buffer]
            );

            if (error) {
                console.log("error with Module.gme_play");
            }

            for (i = 0; i < bufferSize; i++) {
                for (n = 0; n < e.outputBuffer.numberOfChannels; n++) {
                    temp = (
                        buffer
                        + (i * e.outputBuffer.numberOfChannels * 2)
                        + (n * 4)
                    );
                    channels[n][i] = Module.getValue(temp, "i32") / INT16_MAX;
                }
            }
        }

        node.connect(ctx.destination)
        return node;
    }

    
    /**
     * 
     */

    self.stop = function () {

        if (themeNode) {
                themeNode.disconnect();
                themeNode = null;
            }
    }   
    

    /**
     * 
     */
    self.clearAll = function () {

    };

    /**
     * 
     */
    self.setMutedOn = function () {

    };

    /**
     * 
     */
    self.setMutedOff = function () {

    };


    self.reset(settings || {});
}