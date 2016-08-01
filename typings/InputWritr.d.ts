declare namespace InputWritr {
    /**
     * A configurable wrapper, recorder, and playback manager around user inputs.
     */
    class InputWritr implements IInputWritr {
        /**
         * A mapping of events to their key codes, to their callbacks.
         */
        private triggers;
        /**
         * Known, allowed aliases for triggers.
         */
        private aliases;
        /**
         * Recording of every action that has happened, with a timestamp.
         */
        private currentHistory;
        /**
         * A listing of all histories, with indices set by this.saveHistory.
         */
        private histories;
        /**
         * Function to generate a current timestamp, commonly performance.now.
         */
        private getTimestamp;
        /**
         * A starting time used for calculating playback delays in playHistory.
         */
        private startingTime;
        /**
         * An Object to be passed to event calls, commonly with key information
         * such as { "down": 0 }.
         */
        private eventInformation;
        /**
         * An optional Boolean callback to disable or enable input triggers.
         */
        private canTrigger;
        /**
         * Whether to record events into history.
         */
        private isRecording;
        /**
         * A quick lookup table of key aliases to their character codes.
         */
        private keyAliasesToCodes;
        /**
         * A quick lookup table of character codes to their key aliases.
         */
        private keyCodesToAliases;
        /**
         * Initializes a new instance of the InputWritr class.
         *
         * @param settings   Settings to be used for initialization.
         */
        constructor(settings: IInputWritrSettings);
        /**
         * @returns The stored mapping of aliases to values.
         */
        getAliases(): IAliases;
        /**
         * @returns The stored mapping of aliases to values, with values
         *          mapped to their equivalent key Strings.
         */
        getAliasesAsKeyStrings(): IAliasKeys;
        /**
         * Determines the allowed key strings for a given alias.
         *
         * @param alias   An alias allowed to be passed in, typically a
         *                character code.
         * @returns The mapped key Strings corresponding to that alias,
         *          typically the human-readable Strings representing
         *          input names, such as "a" or "left".
         */
        getAliasAsKeyStrings(alias: string): string[];
        /**
         * @param alias   The alias of an input, typically a character code.
         * @returns The human-readable String representing the input name,
         *          such as "a" or "left".
         */
        convertAliasToKeyString(alias: any): string;
        /**
         * @param key   The number code of an input.
         * @returns The machine-usable character code of the input.
         */
        convertKeyStringToAlias(key: number | string): number | string;
        /**
         * Getter for the currently recording history.
         *
         * @returns The currently recording history of inputs in JSON-friendly form.
         */
        getCurrentHistory(): IHistory;
        /**
         * Getter for a single saved history.
         *
         * @param name   The identifier for the old history to return.
         * @returns A history of inputs in JSON-friendly form.
         */
        getHistory(name: string): IHistory;
        /**
         * @returns All previously stored histories.
         */
        getHistories(): IHistories;
        /**
         * @returns Whether this is currently allowing inputs.
         */
        getCanTrigger(): IBooleanGetter;
        /**
         * @returns Whether this is currently recording allowed inputs.
         */
        getIsRecording(): IBooleanGetter;
        /**
         * Sets whether this is to allow inputs.
         *
         * @param canTriggerNew   Whether this is now allowing inputs. This
         *                        may be either a Function (to be evaluated
         *                        on each input) or a general Boolean.
         */
        setCanTrigger(canTriggerNew: boolean | IBooleanGetter): void;
        /**
         * Sets whether this is recording.
         *
         * @param isRecordingNew   Whether this is now recording inputs.
         */
        setIsRecording(isRecordingNew: boolean | IBooleanGetter): void;
        /**
         * Sets the first argument for event callbacks.
         *
         * @param eventInformationNew   A new first argument for event callbacks.
         */
        setEventInformation(eventInformationNew: any): void;
        /**
         * Adds a list of values by which an event may be triggered.
         *
         * @param name   The name of the event that is being given aliases,
         *               such as "left".
         * @param values   An array of aliases by which the event will also
         *                 be callable.
         */
        addAliasValues(name: any, values: any[]): void;
        /**
         * Removes a list of values by which an event may be triggered.
         *
         * @param name   The name of the event that is having aliases removed,
         *               such as "left".
         * @param values   Aliases by which the event will no longer be callable.
         */
        removeAliasValues(name: string, values: any[]): void;
        /**
         * Shortcut to remove old alias values and add new ones in.
         *
         * @param name   The name of the event that is having aliases
         *               added and removed, such as "left".
         * @param valuesOld   An array of aliases by which the event will no
         *                    longer be callable.
         * @param valuesNew   An array of aliases by which the event will
         *                    now be callable.
         */
        switchAliasValues(name: string, valuesOld: any[], valuesNew: any[]): void;
        /**
         * Adds a set of alises from an Object containing "name" => [values] pairs.
         *
         * @param aliasesRaw   Aliases to be added via this.addAliasvalues.
         */
        addAliases(aliasesRaw: any): void;
        /**
         * Adds a triggerable event by marking a new callback under the trigger's
         * triggers. Any aliases for the label are also given the callback.
         *
         * @param trigger   The name of the triggered event.
         * @param label   The code within the trigger to call within,
         *                typically either a character code or an alias.
         * @param callback   The callback Function to be triggered.
         */
        addEvent(trigger: string, label: any, callback: ITriggerCallback): void;
        /**
         * Removes a triggerable event by deleting any callbacks under the trigger's
         * triggers. Any aliases for the label are also given the callback.
         *
         * @param trigger   The name of the triggered event.
         * @param label   The code within the trigger to call within,
         *                typically either a character code or an alias.
         */
        removeEvent(trigger: string, label: any): void;
        /**
         * Stores the current history in the histories listing. this.restartHistory
         * is typically called directly after.
         *
         * @param name   A key to store the history under (by default, one greater than
         *               the length of Object.keys(this.histories)).
         */
        saveHistory(name?: string): void;
        /**
         * Clears the currently tracked inputs history and resets the starting time,
         * and (optionally) saves the current history.
         *
         * @param keepHistory   Whether the currently tracked history of inputs should
         *                      be added to the master listing (by default, true).
         */
        restartHistory(keepHistory?: boolean): void;
        /**
         * "Plays" back a history of event information by simulating each keystroke
         * in a new call, timed by setTimeout.
         *
         * @param history   The events history to play back.
         * @remarks This will execute the same actions in the same order as before,
         *          but the arguments object may be different.
         * @remarks Events will be added to history again, as duplicates.
         */
        playHistory(history: IHistory): void;
        /**
         * Primary driver function to run an event. The event is chosen from the
         * triggers object, and called with eventInformation as the input.
         *
         * @param event   The event Function (or String alias thereof) to call.
         * @param [keyCode]   The alias of the event Function under triggers[event],
         *                    if event is a String.
         * @param [sourceEvent]   The raw event that caused the calling Pipe
         *                        to be triggered, such as a MouseEvent.
         * @returns The result of calling the triggered event.
         */
        callEvent(event: Function | string, keyCode?: number | string, sourceEvent?: Event): any;
        /**
         * Creates and returns a Function to run a trigger.
         *
         * @param trigger   The label for the Array of functions that the
         *                  pipe function should choose from.
         * @param codeLabel   A mapping String for the alias to get the
         *                    alias from the event.
         * @param [preventDefaults]   Whether the input to the pipe Function
         *                            will be an DOM-style event, where
         *                            .preventDefault() should be called.
         * @returns A Function that, when called on an event, runs this.callEvent
         *          on the appropriate trigger event.
         */
        makePipe(trigger: string, codeLabel: string, preventDefaults?: boolean): Function;
        /**
         * Curry utility to create a closure that runs callEvent when called.
         *
         * @param info   An array containing [trigger, alias].
         * @returns A closure that activates a trigger when called.
         */
        private makeEventCall(info);
        /**
         * Records event information in this.currentHistory.
         *
         * @param info   Information on the event, as [trigger, alias].
         */
        private saveEventInformation(info);
    }
    /**
     * A callback for when a piped event is triggered.
     *
     * @param eventInformation   Some argument passed to the event by the
     *                           parent InputWritr.
     * @param event   The source Event causing the trigger.
     */
    interface ITriggerCallback {
        (eventInformation: any, event: Event): void;
    }
    /**
     * A mapping of events to their key codes, to their callbacks.
     */
    interface ITriggerContainer {
        [i: string]: {
            [i: string]: ITriggerCallback;
            [i: number]: ITriggerCallback;
        };
    }
    /**
     * Function to determine whether some functionality is available.
     */
    interface IBooleanGetter {
        (...args: any[]): boolean;
    }
    /**
     * Known, allowed aliases for triggers.
     */
    interface IAliases {
        [i: string]: any[];
    }
    /**
     * A mapping from alias Strings to character code Numbers.
     */
    interface IAliasesToCodes {
        [i: string]: number;
    }
    /**
     * A mapping from character code Numbers to alias Strings.
     */
    interface ICodesToAliases {
        [i: number]: string;
    }
    /**
     * Aliases mapped to their allowed key strings.
     */
    interface IAliasKeys {
        [i: string]: string[];
    }
    /**
     * A JSON-friendly recording of events that have occured, as [trigger, alias].
     */
    interface IHistory {
        [i: number]: [string, any];
    }
    /**
     * Stored histories, keyed by name.
     */
    interface IHistories {
        [i: string]: IHistory;
    }
    /**
     * Settings to initialize a new IInputWritr.
     */
    interface IInputWritrSettings {
        /**
         * The mapping of events to their key codes, to their callbacks.
         */
        triggers: ITriggerContainer;
        /**
         * The first argument to be passed to event callbacks.
         */
        eventInformation?: any;
        /**
         * Function to generate a current timestamp, commonly performance.now.
         */
        getTimestamp?: () => number;
        /**
         * Known, allowed aliases for triggers.
         */
        aliases?: {
            [i: string]: any[];
        };
        /**
         * A quick lookup table of key aliases to their character codes.
         */
        keyAliasesToCodes?: {
            [i: string]: number;
        };
        /**
         * A quick lookup table of character codes to their key aliases.
         */
        keyCodesToAliases?: {
            [i: number]: string;
        };
        /**
         * Whether events are initially allowed to trigger (by default, true).
         */
        canTrigger?: boolean | IBooleanGetter;
        /**
         * Whether triggered inputs are initially allowed to be written to history
         * (by default, true).
         */
        isRecording?: boolean | IBooleanGetter;
    }
    /**
     * A configurable wrapper, recorder, and playback manager around user inputs.
     */
    interface IInputWritr {
        /**
         * @returns The stored mapping of aliases to values.
         */
        getAliases(): any;
        /**
         * @returns The stored mapping of aliases to values, with values
         *          mapped to their equivalent key Strings.
         */
        getAliasesAsKeyStrings(): IAliasKeys;
        /**
         * Determines the allowed key strings for a given alias.
         *
         * @param alias   An alias allowed to be passed in, typically a
         *                character code.
         * @returns The mapped key Strings corresponding to that alias,
         *          typically the human-readable Strings representing
         *          input names, such as "a" or "left".
         */
        getAliasAsKeyStrings(alias: any): string[];
        /**
         * @param alias   The alias of an input, typically a character code.
         * @returns The human-readable String representing the input name,
         *          such as "a" or "left".
         */
        convertAliasToKeyString(alias: any): string;
        /**
         * @param key   The number code of an input.
         * @returns The machine-usable character code of the input.
         */
        convertKeyStringToAlias(key: number | string): number | string;
        /**
         * Getter for the currently recording history.
         *
         * @returns The currently recording history of inputs in JSON-friendly form.
         */
        getHistory(name?: string): any;
        /**
         * Getter for a single saved history.
         *
         * @param name   The identifier for the old history to return.
         * @returns A history of inputs in JSON-friendly form.
         */
        getHistories(): any;
        /**
         * @returns All previously stored histories.
         */
        getCanTrigger(): IBooleanGetter;
        /**
         * @returns Whether this is currently allowing inputs.
         */
        getIsRecording(): IBooleanGetter;
        /**
         * Sets whether this is to allow inputs.
         *
         * @param canTriggerNew   Whether this is now allowing inputs. This
         *                        may be either a Function (to be evaluated
         *                        on each input) or a general Boolean.
         */
        setCanTrigger(canTriggerNew: boolean | IBooleanGetter): void;
        /**
         * Sets whether this is recording.
         *
         * @param isRecordingNew   Whether this is now recording inputs.
         */
        setIsRecording(isRecordingNew: boolean | IBooleanGetter): void;
        /**
         * Sets the first argument for event callbacks.
         *
         * @param eventInformationNew   A new first argument for event callbacks.
         */
        setEventInformation(eventInformationNew: any): void;
        /**
         * Adds a list of values by which an event may be triggered.
         *
         * @param name   The name of the event that is being given aliases,
         *               such as "left".
         * @param values   An array of aliases by which the event will also
         *                 be callable.
         */
        addAliasValues(name: any, values: any[]): void;
        /**
         * Removes a list of values by which an event may be triggered.
         *
         * @param name   The name of the event that is having aliases removed,
         *               such as "left".
         * @param values   Aliases by which the event will no longer be callable.
         */
        removeAliasValues(name: string, values: any[]): void;
        /**
         * Shortcut to remove old alias values and add new ones in.
         *
         *
         * @param name   The name of the event that is having aliases
         *               added and removed, such as "left".
         * @param valuesOld   An array of aliases by which the event will no
         *                    longer be callable.
         * @param valuesNew   An array of aliases by which the event will
         *                    now be callable.
         */
        switchAliasValues(name: string, valuesOld: any[], valuesNew: any[]): void;
        /**
         * Adds a set of alises from an Object containing "name" => [values] pairs.
         *
         * @param aliasesRaw   Aliases to be added via this.addAliasvalues.
         */
        addAliases(aliasesRaw: any): void;
        /**
         * Adds a triggerable event by marking a new callback under the trigger's
         * triggers. Any aliases for the label are also given the callback.
         *
         * @param trigger   The name of the triggered event.
         * @param label   The code within the trigger to call within,
         *                typically either a character code or an alias.
         * @param callback   The callback Function to be triggered.
         */
        addEvent(trigger: string, label: any, callback: ITriggerCallback): void;
        /**
         * Removes a triggerable event by deleting any callbacks under the trigger's
         * triggers. Any aliases for the label are also given the callback.
         *
         * @param trigger   The name of the triggered event.
         * @param label   The code within the trigger to call within,
         *                typically either a character code or an alias.
         */
        removeEvent(trigger: string, label: any): void;
        /**
         * Stores the current history in the histories listing. this.restartHistory
         * is typically called directly after.
         *
         * @param name   A key to store the history under (by default, one greater than
         *               the length of Object.keys(this.histories)).
         */
        saveHistory(name?: string): void;
        /**
         * Clears the currently tracked inputs history and resets the starting time,
         * and (optionally) saves the current history.
         *
         * @param keepHistory   Whether the currently tracked history of inputs should
         *                      be added to the master listing (by default, true).
         */
        restartHistory(keepHistory?: boolean): void;
        /**
         * "Plays" back a history of event information by simulating each keystroke
         * in a new call, timed by setTimeout.
         *
         * @param history   The events history to play back.
         * @remarks This will execute the same actions in the same order as before,
         *          but the arguments object may be different.
         * @remarks Events will be added to history again, as duplicates.
         */
        playHistory(history: IHistory): void;
        /**
         * Primary driver function to run an event. The event is chosen from the
         * triggers object, and called with eventInformation as the input.
         *
         * @param event   The event Function (or String alias thereof) to call.
         * @param [keyCode]   The alias of the event Function under triggers[event],
         *                    if event is a String.
         * @param [sourceEvent]   The raw event that caused the calling Pipe
         *                        to be triggered, such as a MouseEvent.
         * @returns The result of calling the triggered event.
         */
        callEvent(event: Function | string, keyCode?: number | string, sourceEvent?: Event): any;
        /**
         * Creates and returns a Function to run a trigger.
         *
         * @param trigger   The label for the Array of functions that the
         *                  pipe function should choose from.
         * @param codeLabel   A mapping String for the alias to get the
         *                    alias from the event.
         * @param [preventDefaults]   Whether the input to the pipe Function
         *                            will be an DOM-style event, where
         *                            .preventDefault() should be called.
         * @returns A Function that, when called on an event, runs this.callEvent
         *          on the appropriate trigger event.
         */
        makePipe(trigger: string, codeLabel: string, preventDefaults?: boolean): Function;
    }
}
declare var module: any;
