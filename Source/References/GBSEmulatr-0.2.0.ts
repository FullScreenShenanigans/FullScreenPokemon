/// <reference path="ItemsHoldr-0.2.1.ts" />

declare module GBSEmulatr {
    export interface ILibrary {
        [i: string]: ILibraryObject;
    }

    export interface ILibraryObject {
        gbs: string;
        gbsDecoded: number[];
        tracks: {
            [i: string]: number;
        };
    }

    export interface IDirectory {
        [i: string]: IDirectoryObject;
    }

    export interface IDirectoryObject {
        gbsSource: string;
        trackNum: number;
    }

    /**
     * Incomplete listing of ASM Module functionality. If there is a definition available
     * online, that would be nice.
     */
    export interface IModule {
        ALLOC_STATIC;
        allocate(slab: number, types: string, allocator: number, ptr?: any): number;
        ccall;
        getValue(ptr: number, type: string, noSafe?: boolean): number;
    }

    export interface IGBSEmulatrSettings {
        ItemsHolder: ItemsHoldr.IItemsHoldr;
        Module: IModule;
        library: ILibrary;
        context?: AudioContext;
    }

    export interface IGBSEmulatr {
        getLibrary(): ILibrary;
        getDirection(): IDirectory;
        getTheme(): string;
        getThemeNode(): ScriptProcessorNode;
        getContext(): AudioContext;
        getItemsHolder(): ItemsHoldr.IItemsHoldr;
        getModule(): IModule;
        getBufferSize(): number;
        getInt16Max(): number;
        getVolume(): number;
        getMuted(): number;
        stop(): void;
        clearAll(): void;
        setMutedOn(): void;
        setMutedOff(): void;
        toggleMuted(): void;
        play(track: string): void;
    }
}



// Explanations by Joe!

// library - store a listing of GBS files. Looks like we'll need at least 2. One for the themes, one for 
//           various pokemon sounds and other misc sound effects.

//           In audio.js the gbs data will be stored as a base64 encoded string. Later on, however, we'll
//           decode that and ascii-fy each character to play nicely with the player. 

//           then, GBSEmulatr can interpret 

//                   play("ThemeViridianCity") 

//           as something like

//                   play_music_data(decodedPayload, 10);

//           which our music player understands!

//           Of course, since there will be multiple sound files, we'll need....

// directory - our master lookup table, keyed by song/theme name. Each key will look like (at least, probably
//           going to have to add more stuff later)

//           "Theme_00_Name" : {
//                               "gbsSource" : "blue"
//                               "trackNum"  : 0
//                               }

//           Unfortunately, to save space, I don't think the theme names are included in the .gbs file, so
//           I'll scrape them from somewhere online and include them in audio.js.
module GBSEmulatr {
    "use strict";

    /**
     * An audio library to automate loading and controlled playback of Gameboy audio
     * tracks via the ASM module. 
     * 
     * @author "Joe Pringle" <explodingp@gmail.com>
     * @author "Josh Goldberg" <josh@fullscreenmario.com>
     */
    export class GBSEmulatr implements IGBSEmulatr {
        /**
         * General buffer size for audio node buffers.
         */
        private static bufferSize: number = 1024 * 16;

        /**
         * Maximum value for an integer, used in channel i32 ccals.
         */
        private static int16Max: number = Math.pow(2, 32) - 1;

        /**
         * Tracklists and encoded contents of any sound files, keyed by file.
         */
        library: ILibrary;

        /**
         * Master lookup table, keyed by trackName.
         */
        directory: IDirectory;

        /**
         * The name of the currently playing theme.
         */
        theme: string;

        /**
         * The currently playing theme node.
         */
        themeNode: ScriptProcessorNode;

        /**
         * The AudioContext governing audio output.
         */
        context: AudioContext;

        /**
         * Storage container for settings like volume and muted status.
         */
        ItemsHolder: ItemsHoldr.IItemsHoldr;

        /**
         * The ASM generated module for calling C code.
         */
        Module: IModule;

        /**
         * @param {IGBSEmulatrSettings} settings
         */
        constructor(settings: IGBSEmulatrSettings) {
            if (typeof settings.ItemsHolder === "undefined") {
                throw new Error("No ItemsHolder given to GBSEmulatr.");
            }
            if (typeof settings.Module === "undefined") {
                throw new Error("No Module given to GBSEmulatr.");
            }
            if (typeof settings.library === "undefined") {
                throw new Error("No library given to GBSEmulatr.");
            }

            this.ItemsHolder = settings.ItemsHolder;
            this.Module = settings.Module;
            this.library = settings.library;

            this.context = settings.context || new AudioContext();

            // Initially, the directory is empty, and nothing is playing.
            this.directory = {};

            // Decode and ascii-fy all "gbs" library entries.
            this.decodeAll();
        }


        /* Simple gets
        */

        /**
         * 
         */
        getLibrary(): ILibrary {
            return this.library;
        }

        /**
         * 
         */
        getDirectory(): IDirectory {
            return this.directory;
        }

        /**
         * 
         */
        getTheme(): string {
            return this.theme;
        }

        /**
         * 
         */
        getThemeNode(): ScriptProcessorNode {
            return this.themeNode;
        }

        /**
         * 
         */
        getContext(): AudioContext {
            return this.context;
        }

        /**
         * 
         */
        getItemsHolder(): ItemsHoldr.IItemsHoldr {
            return this.ItemsHolder;
        }

        /**
         * 
         */
        getModule(): IModule {
            return this.Module;
        }

        /**
         * 
         */
        getBufferSize(): number {
            return GBSEmulatr.bufferSize;
        }

        /**
         * 
         */
        getInt16Max(): number {
            return GBSEmulatr.int16Max;
        }

        /**
         * 
         */
        getVolume(): number {
            return this.ItemsHolder.getItem("volume");
        }

        /**
         * 
         */
        getMuted(): number {
            return this.ItemsHolder.getItem("muted");
        }


        /* Audio functionality
        */

        /**
         * 
         */
        stop(): void {
            if (!this.themeNode) {
                return;
            }

            this.themeNode.disconnect();
            this.themeNode = undefined;
            this.theme = undefined;
        }

        /**
         * 
         */
        clearAll(): void {
            throw new Error("Not implemented.");
        }

        /**
         * 
         */
        setMutedOn(): void {
            throw new Error("Not implemented.");
        }

        /**
         * 
         */
        setMutedOff(): void {
            throw new Error("Not implemented.");
        }

        /**
         * 
         */
        toggleMuted(): void {
            throw new Error("Not implemented.");
        }

        /**
         * Plays a sound or theme, keyed by track name.
         * 
         * @example GBSEmulator.play("openingTheme");
         */
        play(track: string): void {
            if (this.themeNode) {
                this.stop();
            }

            var folder: string = this.directory[track].gbsSource,
                payload: number[] = this.library[folder].gbsDecoded,
                subtune: number = this.directory[track].trackNum,
                // Required for libgme.js
                ref: number = this.Module.allocate(1, "i32", this.Module.ALLOC_STATIC),
                emu: number;

            if (this.Module.ccall(
                "gme_open_data",
                "number",
                ["array", "number", "number", "number"],
                [payload, payload.length, ref, this.context.sampleRate])) {
                throw new Error("Could not call gme_open_data.");
            }

            // Determine the type of emulator to use to play this payload.
            emu = this.Module.getValue(ref, "i32");

            if (this.Module.ccall("gme_start_track", "number", ["number", "number"], [emu, subtune])) {
                throw new Error("Could not call gme_start_track.");
            }

            // Actually play the track.
            this.theme = track;

            this.themeNode = this.playSong(emu);
        }


        /* Internal playing
        */

        /** 
         * Private function that ACTUALLY plays the song, in user's current context.
         */
        private playSong(emu: number): ScriptProcessorNode {
            var node: ScriptProcessorNode = this.context.createScriptProcessor(GBSEmulatr.bufferSize, 2, 2);

            node.onaudioprocess = this.onNodeAudioProcess.bind(this, node, emu);
            node.connect(this.context.destination);

            return node;
        }

        private onNodeAudioProcess(node: ScriptProcessorNode, emu: number, event: AudioProcessingEvent): void {
            var buffer: number = this.Module.allocate(GBSEmulatr.bufferSize * 2, "i32", this.Module.ALLOC_STATIC),
                channels: Float32Array[],
                error: Error,
                temp: number,
                i: number,
                n: number;

            if (this.Module.ccall("gme_track_ended", "number", ["number"], [emu]) === 1) {
                // Can put any 'end-of-song' event handlers here, once GBSEmulatr is more fleshed out.
                node.disconnect();
                this.theme = null;
                return;
            }

            channels = [
                event.outputBuffer.getChannelData(0),
                event.outputBuffer.getChannelData(1)
            ];

            error = this.Module.ccall("gme_play", "number", ["number", "number", "number"], [emu, GBSEmulatr.bufferSize * 2, buffer]);

            if (error) {
                throw new Error("Could not call gme_play.");
            }

            for (i = 0; i < GBSEmulatr.bufferSize; i += 1) {
                for (n = 0; n < event.outputBuffer.numberOfChannels; n++) {
                    temp = (
                        buffer
                        + (i * event.outputBuffer.numberOfChannels * 2)
                        + (n * 4));
                    channels[n][i] = this.Module.getValue(temp, "i32") / GBSEmulatr.int16Max;
                }
            }
        }


        /* Base loading
        */

        /**
         * Decodes all "gbs" entries in a library. Each entry is replaced with an
         * array of Integers 0-255 representing the decoded ASCII contents. Those
         * are referenced by track name in the main GBSEmulatr directory.
         */
        private decodeAll(): void {
            var tracks: { [i: string]: number },
                i: string,
                j: string;

            for (i in this.library) {
                if (!this.library.hasOwnProperty(i)) {
                    continue;
                }

                this.library[i].gbsDecoded = atob(this.library[i].gbs)
                    .split("")
                    .map(this.getFirstCharacterCode);

                tracks = this.library[i].tracks;

                for (j in tracks) {
                    if (tracks.hasOwnProperty(j)) {
                        this.directory[j] = {
                            "gbsSource": i,
                            "trackNum": tracks[j]
                        };
                    }
                }
            }
        }

        /**
         * Helper utility to return a String's first character's code.
         */
        private getFirstCharacterCode(str: string): number {
            return str.charCodeAt(0);
        }
    }
}
