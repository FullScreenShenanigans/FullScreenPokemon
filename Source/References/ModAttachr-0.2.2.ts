/// <reference path="ItemsHoldr-0.2.1.ts" />

declare module ModAttachr {
    export interface IModAttachrMod {
        // The user-readable name of the mod.
        name: string;

        // The mapping of events to callback Functions to be evaluated.
        events: { [i: string]: IModEvent };

        // The scope to call event Functions from, if necessary.
        scope?: any;

        // Whether the mod is currently enabled (by default, false).
        enabled?: boolean;
    }

    interface IModEvent {
        (...args: any[]): any;
    }

    export interface IModAttachrSettings {
        /**
         * Mods to be immediately added via addMod.
         */
        mods?: any[];

        /**
         * A ItemsHoldr to store mod status locally.
         */
        ItemsHoldr?: ItemsHoldr.IItemsHoldr;

        /**
         * Whether there should be a ItemsHoldr created if one isn't given.
         */
        storeLocally?: boolean;

        /**
         * A default scope to apply mod events from, if not the ModAttachr.
         */
        scopeDefault?: any;
    }

    export interface IModAttachr {
        getMods(): any;
        getMod(name: string): IModAttachrMod;
        getEvents(): any;
        getEvent(name: string): IModAttachrMod[];
        getItemsHolder(): ItemsHoldr.IItemsHoldr;
        addMod(mod: IModAttachrMod): void;
        addMods(mods: IModAttachrMod[]): void;
        enableMod(name: string): void;
        enableMods(...names: string[]): void;
        disableMod(name: string): void;
        disableMods(...names: string[]): void;
        toggleMod(name: string): void;
        toggleMods(...names: string[]): void;
        fireEvent(event: string, ...extraArgs: any[]): void;
        fireModEvent(eventName: string, modName: string, ...extraArgs: any[]): any;
    }
}


module ModAttachr {
    "use strict";

    /**
     * An addon for for extensible modding functionality. "Mods" register triggers
     * such as "onModEnable" or "onReset" that can be triggered.
     */
    export class ModAttachr implements IModAttachr {
        /**
         * For each event, the listing of mods that attach to that event.
         */
        private events: { [i: string]: IModAttachrMod[] };

        /**
         * All known mods, keyed by name.
         */
        private mods: { [i: string]: IModAttachrMod };

        /**
         * A ItemsHoldr object that may be used to store mod status.
         */
        private ItemsHolder: ItemsHoldr.IItemsHoldr;

        /**
         * A default scope to apply mod events from, if not this ModAttachr.
         */
        private scopeDefault: any;

        /**
         * @param {IModAttachrSettings} [settings]
         */
        constructor(settings?: IModAttachrSettings) {
            this.mods = {};
            this.events = {};

            if (!settings) {
                return;
            }

            this.scopeDefault = settings.scopeDefault;

            // If a ItemsHoldr is provided, use it
            if (settings.ItemsHoldr) {
                this.ItemsHolder = settings.ItemsHoldr;
            } else if (settings.storeLocally) {
                // If one isn't provided by storeLocally is still true, make one
                this.ItemsHolder = new ItemsHoldr.ItemsHoldr();
            }

            if (settings.mods) {
                this.addMods(settings.mods);
            }
        }


        /* Simple gets 
        */

        /**
         * @return {Object} An Object keying each mod by their name.
         */
        getMods(): any {
            return this.mods;
        }

        /**
         * @param {String} name   The name of the mod to return.
         * @return {Object} The mod keyed by the name.
         */
        getMod(name: string): IModAttachrMod {
            return this.mods[name];
        }

        /**
         * @return {Object} An Object keying each event by their name.
         */
        getEvents(): any {
            return this.events;
        }

        /**
         * @return {Object[]} The mods associated with a particular event.
         */
        getEvent(name: string): IModAttachrMod[] {
            return this.events[name];
        }

        /**
         * @return {ItemsHoldr} The ItemsHoldr if storeLocally is true, or undefined
         *                      otherwise.
         */
        getItemsHolder(): ItemsHoldr.IItemsHoldr {
            return this.ItemsHolder;
        }


        /* Alterations 
        */

        /**
         * Adds a mod to the pool of mods, listing it under all the relevant events.
         * If the event is enabled, the "onModEnable" event for it is triggered.
         * 
         * @param {Object} mod   A summary Object for a mod, containing at the very
         *                       least a name and Object of events.
         */
        addMod(mod: IModAttachrMod): void {
            var modEvents: any = mod.events,
                name: string;

            for (name in modEvents) {
                if (!modEvents.hasOwnProperty(name)) {
                    continue;
                }

                if (!this.events.hasOwnProperty(name)) {
                    this.events[name] = [mod];
                } else {
                    this.events[name].push(mod);
                }
            }

            // Mod scope defaults to the ModAttacher's scopeDefault.
            mod.scope = mod.scope || this.scopeDefault;

            // Record the mod in the ModAttachr's mods listing.
            this.mods[mod.name] = mod;

            // If the mod is enabled, trigger its "onModEnable" event
            if (mod.enabled && mod.events.hasOwnProperty("onModEnable")) {
                this.fireModEvent("onModEnable", mod.name, arguments);
            }

            // If there's a ItemsHoldr, record the mod in it
            if (this.ItemsHolder) {
                this.ItemsHolder.addItem(mod.name, {
                    "valueDefault": 0,
                    "storeLocally": true
                });

                // If there was already a (true) value, immediately enable the mod
                if (this.ItemsHolder.getItem(mod.name)) {
                    this.enableMod(mod.name);
                }
            }
        }

        /**
         * Adds each mod in a given Array.
         * 
         * @param {Array} mods
         */
        addMods(mods: IModAttachrMod[]): void {
            for (var i: number = 0; i < mods.length; i += 1) {
                this.addMod(mods[i]);
            }
        }

        /**
         * Enables a mod of the given name, if it exists. The onModEnable event is
         * called for the mod.
         * 
         * @param {String} name   The name of the mod to enable.
         */
        enableMod(name: string): void {
            var mod: IModAttachrMod = this.mods[name],
                args: any[];

            if (!mod) {
                throw new Error("No mod of name: '" + name + "'");
            }

            mod.enabled = true;
            args = Array.prototype.slice.call(arguments);
            args[0] = mod;

            if (this.ItemsHolder) {
                this.ItemsHolder.setItem(name, true);
            }

            if (mod.events.hasOwnProperty("onModEnable")) {
                return this.fireModEvent("onModEnable", mod.name, arguments);
            }
        }

        /**
         * Enables any number of mods, given as any number of Strings or Arrays of
         * Strings.
         * 
         * @param {...String} names
         */
        enableMods(...names: string[]): void {
            names.forEach(this.enableMod.bind(this));
        }

        /**
         * Disables a mod of the given name, if it exists. The onModDisable event is
         * called for the mod.
         * 
         * @param {String} name   The name of the mod to disable.
         */
        disableMod(name: string): void {
            var mod: IModAttachrMod = this.mods[name],
                args: any[];

            if (!this.mods[name]) {
                throw new Error("No mod of name: '" + name + "'");
            }

            this.mods[name].enabled = false;
            args = Array.prototype.slice.call(arguments);
            args[0] = mod;

            if (this.ItemsHolder) {
                this.ItemsHolder.setItem(name, false);
            }

            if (mod.events.hasOwnProperty("onModDisable")) {
                return this.fireModEvent("onModDisable", mod.name, args);
            }
        }

        /**
         * Disables any number of mods, given as any number of Strings or Arrays of
         * Strings.
         * 
         * @param {...String} names 
         */
        disableMods(...names: string[]): void {
            names.forEach(this.disableMod.bind(this));
        }

        /**
         * Toggles a mod via enableMod/disableMod of the given name, if it exists.
         * 
         * @param {String} name   The name of the mod to toggle.
         */
        toggleMod(name: string): void {
            var mod: IModAttachrMod = this.mods[name];

            if (!mod) {
                throw new Error("No mod found under " + name);
            }

            if (mod.enabled) {
                return this.disableMod(name);
            } else {
                return this.enableMod(name);
            }
        }

        /**
         * Toggles any number of mods, given as any number of Strings or Arrays of
         * Strings.
         * 
         * @param {...String} names
         */
        toggleMods(...names: string[]): void {
            names.forEach(this.toggleMod.bind(this));
        }


        /* Actions
        */

        /**
         * Fires an event, which calls all functions listed undder mods for that 
         * event. Any number of arguments may be given.
         * 
         * @param {String} event   The name of the event to fire.
         */
        fireEvent(event: string, ...extraArgs: any[]): void {
            var fires: any[] = this.events[event],
                args: any[] = Array.prototype.splice.call(arguments, 0),
                mod: IModAttachrMod,
                i: number;

            // If no triggers were defined for this event, that's ok: just stop.
            if (!fires) {
                return;
            }

            for (i = 0; i < fires.length; i += 1) {
                mod = fires[i];
                args[0] = mod;
                if (mod.enabled) {
                    mod.events[event].apply(mod.scope, args);
                }
            }
        }

        /**
         * Fires an event specifically for one mod, rather than all mods containing
         * that event.
         * 
         * @param {String} eventName   The name of the event to fire.
         * @param {String} modName   The name of the mod to fire the event.
         */
        fireModEvent(eventName: string, modName: string, ...extraArgs: any[]): any {
            var mod: IModAttachrMod = this.mods[modName],
                args: any[] = Array.prototype.slice.call(arguments, 2),
                fires: IModEvent;

            if (!mod) {
                throw new Error("Unknown mod requested: '" + modName + "'");
            }

            args[0] = mod;
            fires = mod.events[eventName];

            if (!fires) {
                throw new Error("Mod does not contain event: '" + eventName + "'");
            }

            return fires.apply(mod.scope, args);
        }
    }
}
