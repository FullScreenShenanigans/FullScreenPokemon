/// <reference path="InputWritr-0.2.0.ts" />

declare module DeviceLayr {
    /**
     * 
     */
    export interface IGamepad {
        axes: number[];
        buttons: IGamepadButton[];
        mapping: string;
    }

    /**
     * 
     */
    export interface IGamepadButton {
        value: number;
        pressed: boolean;
    }

    /**
     * 
     */
    export interface ITriggers {
        [i: string]: IButtonListing | IJoystickListing;
    }

    /**
     * 
     */
    export interface IButtonListing {
        status?: boolean;
        trigger: string;
    }

    /**
     * 
     */
    export interface IJoystickListing {
        [i: string]: IJoystickTriggerAxis;
    }

    /**
     * 
     */
    export interface IJoystickTriggerAxis {
        negative: string;
        positive: string;
        status?: AxisStatus;
    }

    /**
     * 
     */
    export interface IAliases {
        on: string;
        off: string;
    }

    /**
     * 
     */
    export interface IControllerMappings {
        [i: string]: IControllerMapping;
    }

    /**
     * 
     */
    export interface IControllerMapping {
        axes: IAxisSchema[];
        buttons: string[];
        joystickThreshold: number;
    }

    /**
     * 
     */
    export interface IAxisSchema {
        axis: string;
        joystick: number;
        name: string;
    }

    export interface IDeviceLayerSettings {
        InputWriter: InputWritr.IInputWritr;
        triggers?: ITriggers;
        aliases?: IAliases;
    }

    export interface IDeviceLayr {
        getInputWritr(): InputWritr.IInputWritr;
        getTriggers(): ITriggers;
        getAliases(): IAliases;
        getGamepads(): IGamepad[];
        checkNavigatorGamepads(): number;
        registerGamepad(gamepad: IGamepad): void;
        activateAllGamepadTriggers(): void;
        activateGamepadTriggers(gamepad: IGamepad): void;
        activateAxisTrigger(gamepad: IGamepad, name: string, axis: string, magnitude: number): boolean;
        activateButtonTrigger(gamepad: IGamepad, name: string, status: boolean);
        clearAllGamepadTriggers(): void;
        clearGamepadTriggers(gamepad: IGamepad): void;
        clearAxisTrigger(gamepad: IGamepad, name: string, axis: string): void;
        clearButtonTrigger(gamepad: IGamepad, name: string): void;
    }
}


module DeviceLayr {
    "use strict";

    /**
     * Status possibilities for an axis. Neutral is the default; positive is above
     * its threshold; negative is below the threshold / -1.
     */
    export enum AxisStatus {
        /**
         * Low axis status (lower than the negative of the threshold).
         */
        negative,

        /**
         * Default axis status (absolutely closer to 0 than the threshold).
         */
        neutral,

        /**
         * High axis status (higher than the threshold).
         */
        positive
    }

    /**
     * 
     */
    export class DeviceLayr implements IDeviceLayr {
        /**
         * Known mapping schemas for standard controllers. These are referenced
         * by added gamepads via the gamepads' .name attribute.
         */
        private static controllerMappings: IControllerMappings = {
            /**
             * Controller mapping for a typical Xbox style controller.
             */
            "standard": {
                "axes": [
                    {
                        "axis": "x",
                        "joystick": 0,
                        "name": "leftJoystick"
                    },
                    {
                        "axis": "y",
                        "joystick": 0,
                        "name": "leftJoystick"
                    },
                    {
                        "axis": "x",
                        "joystick": 1,
                        "name": "rightJoystick"
                    },
                    {
                        "axis": "y",
                        "joystick": 1,
                        "name": "rightJoystick"
                    }
                ],
                "buttons": [
                    "a",
                    "b",
                    "x",
                    "y",
                    "leftTop",
                    "rightTop",
                    "leftTrigger",
                    "rightTrigger",
                    "select",
                    "start",
                    "leftStick",
                    "rightStick",
                    "dpadUp",
                    "dpadDown",
                    "dpadLeft",
                    "dpadRight"
                ],
                "joystickThreshold": .49
            }
        };

        /**
         * Internal InputWritr button and joystick triggers are piped to.
         */
        private InputWritr: InputWritr.IInputWritr;

        /**
         * Mapping of which device controls should cause what triggers, along
         * with their current statuses.
         */
        private triggers: ITriggers;

        /**
         * For "on" and "off" activations, the equivalent event keys to pass to
         * the internal InputWritr.
         */
        private aliases: IAliases;

        /**
         * Any added gamepads (devices), in order of activation.
         */
        private gamepads: IGamepad[];

        /**
         * @param {IDeviceLayerSettings} settings
         */
        constructor(settings: IDeviceLayerSettings) {
            if (typeof settings === "undefined") {
                throw new Error("No settings object given to DeviceLayr.");
            }
            if (typeof settings.InputWriter === "undefined") {
                throw new Error("No InputWriter given to DeviceLayr.");
            }

            this.InputWritr = settings.InputWriter;
            this.triggers = settings.triggers || {};
            this.aliases = settings.aliases || {
                "on": "on",
                "off": "off"
            };

            this.gamepads = [];
        }


        /* Simple gets
        */

        /**
         * @return {InputWritr} The internal InputWritr button and joystick triggers 
         *                      are piped to.
         */
        getInputWritr(): InputWritr.IInputWritr {
            return this.InputWritr;
        }

        /**
         * @return {Object} Mapping of which device controls should cause what triggers,
         *                  along with their current statuses.
         */
        getTriggers(): ITriggers {
            return this.triggers;
        }

        /**
         * @return {Object} For "on" and "off" activations, the equivalent event keys
         *                  to pass to the internal InputWritr.
         */
        getAliases(): IAliases {
            return this.aliases;
        }

        /**
         * @return {Gamepad[]} Any added gamepads (devices), in order of activation.
         */
        getGamepads(): IGamepad[] {
            return this.gamepads;
        }


        /* Registration
        */

        /**
         * If possible, checks the navigator for new gamepads, and adds them if found.
         * 
         * @return {Number} How many gamepads were added.
         */
        checkNavigatorGamepads(): number {
            if (typeof (<any>navigator).getGamepads === "undefined" || !(<any>navigator).getGamepads()[this.gamepads.length]) {
                return 0;
            }

            this.registerGamepad((<any>navigator).getGamepads()[this.gamepads.length]);

            return this.checkNavigatorGamepads() + 1;
        }

        /**
         * Registers a new gamepad.
         * 
         * @param {Gamepad} gamepad
         */
        registerGamepad(gamepad: IGamepad): void {
            this.gamepads.push(gamepad);
            this.setDefaultTriggerStatuses(gamepad, this.triggers);
        }


        /* Triggers
        */

        /**
         * Checks the trigger statuses of all known gamepads.
         */
        activateAllGamepadTriggers(): void {
            for (var i: number = 0; i < this.gamepads.length; i += 1) {
                this.activateGamepadTriggers(this.gamepads[i]);
            }
        }

        /**
         * Checks the trigger status of a gamepad, calling the equivalent InputWritr
         * events if any triggers have occurred.
         * 
         * @param {Gamepad} gamepad
         */
        activateGamepadTriggers(gamepad: IGamepad): void {
            var mapping: IControllerMapping = DeviceLayr.controllerMappings[gamepad.mapping || "standard"],
                i: number;

            for (i = Math.min(mapping.axes.length, gamepad.axes.length) - 1; i >= 0; i -= 1) {
                this.activateAxisTrigger(gamepad, mapping.axes[i].name, mapping.axes[i].axis, gamepad.axes[i]);
            }

            for (i = Math.min(mapping.buttons.length, gamepad.buttons.length) - 1; i >= 0; i -= 1) {
                this.activateButtonTrigger(gamepad, mapping.buttons[i], gamepad.buttons[i].pressed);
            }
        }

        /**
         * Checks for triggered changes to an axis, and calls the equivalent InputWritr
         * event if one is found.
         * 
         * @param {Gamepad} gamepad
         * @param {String} name   The name of the axis, typically "x" or "y".
         * @param {Number} magnitude   The current value of the axis, in [1, -1].
         * @return {Boolean} Whether the trigger was activated.
         */
        activateAxisTrigger(gamepad: IGamepad, name: string, axis: string, magnitude: number): boolean {
            var listing: IJoystickTriggerAxis = (<IJoystickListing>this.triggers[name])[axis],
                status: AxisStatus;

            if (!listing) {
                return;
            }

            // If the axis' current status matches the new one, don't do anything
            status = this.getAxisStatus(gamepad, magnitude);
            if (listing.status === status) {
                return false;
            }

            // If it exists, release the old axis via the InputWritr using the off alias
            if (listing.status !== undefined && listing[AxisStatus[listing.status]] !== undefined) {
                this.InputWritr.callEvent(this.aliases.off, listing[AxisStatus[listing.status]]);
            }

            // Mark the new status in the listing
            listing.status = status;

            // Trigger the new status via the InputWritr using the on alias
            if (listing[AxisStatus[status]] !== undefined) {
                this.InputWritr.callEvent(this.aliases.on, listing[AxisStatus[status]]);
            }

            return true;
        }

        /**
         * Checks for triggered changes to a button, and calls the equivalent InputWritr
         * event if one is found.
         * 
         * @param {Gamepad} gamepad
         * @param {String} name   The name of the button, such as "a" or "left".
         * @param {Boolean} status   Whether the button is activated (pressed).
         * @return {Boolean} Whether the trigger was activated.
         */
        activateButtonTrigger(gamepad: IGamepad, name: string, status: boolean): boolean {
            var listing: IButtonListing = <IButtonListing>this.triggers[name];

            // If the button's current status matches the new one, don't do anything
            if (!listing || listing.status === status) {
                return false;
            }

            listing.status = status;

            // Trigger the new status via the InputWritr using the new alias
            this.InputWritr.callEvent(status ? this.aliases.on : this.aliases.off, listing.trigger);

            return true;
        }

        /**
         * Clears the statuses of all axes and buttons on all known gamepads.
         */
        clearAllGamepadTriggers(): void {
            for (var i: number = 0; i < this.gamepads.length; i += 1) {
                this.clearGamepadTriggers(this.gamepads[i]);
            }
        }

        /**
         * Clears the status of all axes and buttons on a gamepad.
         * 
         * @param {Gamepad} gamepad
         */
        clearGamepadTriggers(gamepad: IGamepad): void {
            var mapping: IControllerMapping = DeviceLayr.controllerMappings[gamepad.mapping || "standard"],
                i: number;

            for (i = 0; i < mapping.axes.length; i += 1) {
                this.clearAxisTrigger(gamepad, mapping.axes[i].name, mapping.axes[i].axis);
            }

            for (i = 0; i < mapping.buttons.length; i += 1) {
                this.clearButtonTrigger(gamepad, mapping.buttons[i]);
            }
        }

        /**
         * Sets the status of an axis to neutral.
         * 
         * @param {Gamepad} gamepad
         * @param {String} name   The name of the axis, typically "x" or "y".
         */
        clearAxisTrigger(gamepad: IGamepad, name: string, axis: string): void {
            var listing: IJoystickTriggerAxis = (<IJoystickListing>this.triggers[name])[axis];

            listing.status = AxisStatus.neutral;
        }

        /**
         * Sets the status of a button to off.
         * 
         * @param {Gamepad} gamepad
         * @param {String} name   The name of the button, such as "a" or "left".
         */
        clearButtonTrigger(gamepad: IGamepad, name: string): void {
            var listing: IButtonListing = <IButtonListing>this.triggers[name];

            listing.status = false;
        }


        /* Private utilities
        */

        /**
         * Puts the default values for all buttons and joystick axes that don't already
         * have statuses. This is useful so activation checks don't glitch out.
         * 
         * @param {Gamepad} gamepad
         * @param {Object} [triggers]
         */
        private setDefaultTriggerStatuses(gamepad: IGamepad, triggers: ITriggers = this.triggers): void {
            var mapping: IControllerMapping = DeviceLayr.controllerMappings[gamepad.mapping || "standard"],
                button: IButtonListing,
                joystick: IJoystickListing,
                i: number,
                j: string;

            for (i = 0; i < mapping.buttons.length; i += 1) {
                button = <IButtonListing>triggers[mapping.buttons[i]];

                if (button && button.status === undefined) {
                    button.status = false;
                }
            }

            for (i = 0; i < mapping.axes.length; i += 1) {
                joystick = <IJoystickListing>triggers[mapping.axes[i].name];

                for (j in joystick) {
                    if (!joystick.hasOwnProperty(j)) {
                        continue;
                    }

                    if (joystick[j].status === undefined) {
                        joystick[j].status = AxisStatus.neutral;
                    }
                }
            }
        }

        /**
         * @param {Gamepad} gamepad
         * @param {Number} magnitude   The direction an axis is measured at, in [-1, 1].
         * @return {AxisStatus} What direction a magnitude is relative to 0 (namely
         *                      positive, negative, or neutral).
         */
        private getAxisStatus(gamepad: IGamepad, magnitude: number): AxisStatus {
            var joystickThreshold: number = DeviceLayr.controllerMappings[gamepad.mapping || "standard"].joystickThreshold;

            if (magnitude > joystickThreshold) {
                return AxisStatus.positive;
            }

            if (magnitude < -joystickThreshold) {
                return AxisStatus.negative;
            }

            return AxisStatus.neutral;
        }
    }
}
