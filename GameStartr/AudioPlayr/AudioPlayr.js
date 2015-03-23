/*
    ROUGHLY WHAT WE NEED
 
 library - store a listing of GBS files. Looks like we'll need at least 2. One for the themes, one for 
            various pokemon sounds and other misc sound effects.
 
            In audio.js the gbs data will be stored as a base64 encoded string. Later on, however, we'll
            decode that and ascii-fy each character to play nicely with the player. 
 
            (TODO CORRECT JS SYNTAX LOL)
 
            something like:
                    var payload = window.atob(settings.library["blueThemes"]["gbs"]).split('').map(
                        function(c) {return c.charCodeAt(0);}) ;
 
            then, audioPlayr can interpret 
 
                    play("ThemeViridianCity") 
 
            as something like
 
                    play_music_data(payload, 10);
            
            which our music player understands!
 
            Of course, since there will be multiple sound files, we'll need....
 
 
 
 directory - our master lookup table, keyed by song/theme name. Each key will look like (at least, probably
            going to have to add more stuff later)
            
            "Theme_00_Name" : {
                                "gbs_source" : "blue"
                                "track_num"  : 0
                                }
 
            Unfortunately, to save space, I don't think the theme names are included in the .gbs file, so
            I'll scrape them from somewhere online and include them in audio.js
 
 
 
 */

function AudioPlayr(settings) {
    "use strict";
    if (!this || this === window) {
        return new AudioPlayr(settings);
    }
    var self = this,

        // A listing of GBS sources
        library,

        // Master lookup table, keyed by trackName
        directory,

        // What file types to add as sources to sounds.
        fileTypes,

        // The currently playing theme.
        theme,

        // Storage container for settings like volume and muted status.
        StatsHolder;
    
    /**
     * Resets the AudioPlayr.

     */
    self.reset = function (settings) {
        library = settings.library;
        fileTypes = settings.fileTypes;
    
        StatsHolder = new StatsHoldr(settings.statistics);

        directory = {};

        decodeAll();
        populateDirectory();
    };


    /* 
    Decode all "gbs" entries in library.

    Replace each entry with an array of integers 0-255 representing the 
    decoded ascii contents.
     */
    
    function decodeAll() {

        for (var i in library){
            library[i]["gbs"] = window.atob(library[i]["gbs"]).split('').map(
                function(c) {
                    return c.charCodeAt(0);
                    }
                );
        }

    }

    /*
    Once all "gbs" entries have been decoded, scan through the library and store
    relevant playback information in the directory, keyed by trackName 
    */
    function populateDirectory() {

        for (var i in library) {
            for (var track in library[i]["tracks"]) {
                directory[track] = {
                    "gbs_source" : i,
                    "track_num"  : library[i]["tracks"][track]
                }
            }
        }

    }

    self.getLibrary = function () {
        return library;
    }

    self.getDirectory = function () {
        return directory;
    }

    /* 
    Play a sound or theme, keyed by track name. 
    FSP.AudioPlayer.play("openingTheme")
    */
    self.play = function(track) {
        var payload = library[directory[track]["gbs_source"]]["gbs"];
        var subtune   = directory[track]["track_num"];
        playMusicData(payload, subtune);

    }

    /* For now, stop() will just stop all sound */
    self.stop = function (){
        if (node) {
            node.disconnect();
            node = null; 
        }

}   
    
    
    self.clearAll = function () {

    }
    
    self.getVolume = function() {
        return StatsHolder.get("volume");
    }
    
    self.getMuted = function () {
        
    }
    
    self.setMutedOn = function() {
        
    }
    
    self.setMutedOff = function() {
        
    }
    self.reset(settings || {});
}