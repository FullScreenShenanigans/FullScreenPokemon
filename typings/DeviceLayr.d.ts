/// <reference path="../typings/InputWritr.d.ts" />
declare namespace DeviceLayr {
    /**
     * Status possibilities for an axis. Neutral is the default; positive is above
     * its threshold; negative is below the threshold / -1.
     */
    enum AxisStatus {
        /**
         * Low axis status (lower than the negative of the threshold).
         */
        negative = 0,
        /**
         * Default axis status (absolutely closer to 0 than the threshold).
         */
        neutral = 1,
        /**
         * High axis status (higher than the threshold).
         */
        positive = 2,
    }
    /**
     * GamePad API bindings for InputWritr pipes.
     */
    class DeviceLayr implements IDeviceLayr {
        /**
         * Known mapping schemas for standard controllers. These are referenced
         * by added gamepads via the gamepads' .name attribute.
         */
        private static controllerMappings;
        /**
         * The InputWritr being piped button and joystick triggers commands.
         */
        private InputWritr;
        /**
         * Mapping of which device controls should cause what triggers, along
         * with their current statuses.
         */
        private triggers;
        /**
         * For "on" and "off" activations, the equivalent event keys to pass to
         * the internal InputWritr.
         */
        private aliases;
        /**
         * Any added gamepads (devices), in order of activation.
         */
        private gamepads;
        /**
         * Initializes a new instance of the DeviceLayr class.
         *
         * @param settings   Settings to use for initialization.
         */
        constructor(settings: IDeviceLayrSettings);
        /**
         * @returns The InputWritr being piped button and joystick triggers.
         */
        getInputWritr(): InputWritr.IInputWritr;
        /**
         * @returns Mapping of which device controls should cause what triggers,
         *          along with their current statuses.
         */
        getTriggers(): ITriggers;
        /**
         * @returns For "on" and "off" activations, the equivalent event keys
         *          to pass to the internal InputWritr.
         */
        getAliases(): IAliases;
        /**
         * @returns Any added gamepads (devices), in order of activation.
         */
        getGamepads(): IGamepad[];
        /**
         * If possible, checks the navigator for new gamepads, and adds them if found.
         *
         * @returns How many gamepads were added.
         */
        checkNavigatorGamepads(): number;
        /**
         * Registers a new gamepad.
         *
         * @param gamepad   The gamepad to register.
         */
        registerGamepad(gamepad: IGamepad): void;
        /**
         * Checks the trigger statuses of all known gamepads.
         */
        activateAllGamepadTriggers(): void;
        /**
         * Checks the trigger status of a gamepad, calling the equivalent InputWritr
         * events if any triggers have occurred.
         *
         * @param gamepad   The gamepad whose status is to be checked.
         */
        activateGamepadTriggers(gamepad: IGamepad): void;
        /**
         * Checks for triggered changes to an axis, and calls the equivalent InputWritr
         * event if one is found.
         *
         * @param gamepad   The gamepad whose triggers are to be checked.
         * @param name   The name of the axis, typically "x" or "y".
         * @param magnitude   The current value of the axis, in [1, -1].
         * @returns Whether the trigger was activated.
         */
        activateAxisTrigger(gamepad: IGamepad, name: string, axis: string, magnitude: number): boolean;
        /**
         * Checks for triggered changes to a button, and calls the equivalent InputWritr
         * event if one is found.
         *
         * @param gamepad   The gamepad whose triggers are to be checked.
         * @param name   The name of the button, such as "a" or "left".
         * @param status   Whether the button is activated (pressed).
         * @returns Whether the trigger was activated.
         */
        activateButtonTrigger(gamepad: IGamepad, name: string, status: boolean): boolean;
        /**
         * Clears the statuses of all axes and buttons on all known gamepads.
         */
        clearAllGamepadTriggers(): void;
        /**
         * Clears the status of all axes and buttons on a gamepad.
         *
         * @param gamepad   The gamepad whose triggers are to be cleared.
         */
        clearGamepadTriggers(gamepad: IGamepad): void;
        /**
         * Sets the status of an axis to neutral.
         *
         * @param gamepad   The gamepad whose axis is to be cleared.
         * @param name   The name of the axis, typically "x" or "y".
         */
        clearAxisTrigger(gamepad: IGamepad, name: string, axis: string): void;
        /**
         * Sets the status of a button to off.
         *
         * @param gamepad   The gamepad whose button is to be checked.
         * @param name   The name of the button, such as "a" or "left".
         */
        clearButtonTrigger(gamepad: IGamepad, name: string): void;
        /**
         * Puts the default values for all buttons and joystick axes that don't already
         * have statuses. This is useful so activation checks don't glitch out.
         *
         * @param gamepad   The gamepad whose triggers are to be defaulted.
         * @param triggers   The triggers to default, as listings keyed by name.
         */
        private setDefaultTriggerStatuses(gamepad, triggers);
        /**
         * @param gamepad   The gamepad whose axis is being looked up.
         * @param magnitude   The direction an axis is measured at, in [-1, 1].
         * @returns What direction a magnitude is relative to 0.
         */
        private getAxisStatus(gamepad, magnitude);
    }
    /**
     * A representation of a gamepad, directly taken from navigator.getGamepads.
     */
    interface IGamepad {
        axes: number[];
        buttons: IGamepadButton[];
        mapping: string;
    }
    /**
     * A single button in an IGamepad.
     */
    interface IGamepadButton {
        value: number;
        pressed: boolean;
    }
    /**
     * A mapping from button names to their equivalent InputWritr pipes.
     */
    interface ITriggers {
        [i: string]: IButtonListing | IJoystickListing;
    }
    /**
     * Representation of a single button's status.
     */
    interface IButtonListing {
        /**
         * A sourceEvent name to pass to InputWritr.
         */
        trigger: string;
        /**
         * Whether the button is currently pressed.
         */
        status?: boolean;
    }
    /**
     * Representation of a single joystick's axis' statuses.
     */
    interface IJoystickListing {
        [i: string]: IJoystickTriggerAxis;
    }
    /**
     * A single joystick axis status.
     */
    interface IJoystickTriggerAxis {
        /**
         * The current status of the axis.
         */
        status?: number;
    }
    /**
     * Equivalent event keys from "on" and "off" activations to pass to the InputWritr.
     */
    interface IAliases {
        /**
         * The name of the event key for "on" activations.
         */
        on: string;
        /**
         * The name of the event key for "off" activations.
         */
        off: string;
    }
    /**
     * A listing of controller mappings, keyed by their configuration name.
     */
    interface IControllerMappings {
        [i: string]: IControllerMapping;
    }
    /**
     * A description of what a controller looks like.
     */
    interface IControllerMapping {
        /**
         * Known axis descriptions for the controller.
         */
        axes: IAxisSchema[];
        /**
         * Names of the controller's buttons.
         */
        buttons: string[];
        /**
         * The threshold for passing from a neutral status to a positive or negative.
         */
        joystickThreshold: number;
    }
    /**
     * A description of a controller's axis.
     */
    interface IAxisSchema {
        /**
         * The name of the axis, such as "x" or "y".
         */
        axis: string;
        /**
         * The number the joystick is within the gamepad.
         */
        joystick: number;
        /**
         * The common name of the axis.
         */
        name: string;
    }
    /**
     * Settings to initialize a new IDeviceLayr instance.
     */
    interface IDeviceLayrSettings {
        /**
         * The IInputWritr to pipe button and joystick trigger commands.
         */
        InputWriter: InputWritr.IInputWritr;
        /**
         * Which device controls should cause what triggers.
         */
        triggers?: ITriggers;
        /**
         * For "on" and "off" activations, equivalent event keys to pass
         * to the IInputWritr.
         */
        aliases?: IAliases;
    }
    /**
     * A layer on InputWritr to map GamePad API device actions to InputWritr pipes.
     */
    interface IDeviceLayr {
        /**
         * @returns The InputWritr being piped button and joystick triggers.
         */
        getInputWritr(): InputWritr.IInputWritr;
        /**
         * @returns Mapping of which device controls should cause what triggers,
         *          along with their current statuses.
         */
        getTriggers(): ITriggers;
        /**
         * @returns For "on" and "off" activations, the equivalent event keys
         *          to pass to the internal InputWritr.
         */
        getAliases(): IAliases;
        /**
         * @returns Any added gamepads (devices), in order of activation.
         */
        getGamepads(): IGamepad[];
        /**
         * If possible, checks the navigator for new gamepads, and adds them if found.
         *
         * @returns How many gamepads were added.
         */
        checkNavigatorGamepads(): number;
        /**
         * Registers a new gamepad.
         *
         * @param gamepad   The gamepad to register.
         */
        registerGamepad(gamepad: IGamepad): void;
        /**
         * Checks the trigger statuses of all known gamepads.
         */
        activateAllGamepadTriggers(): void;
        /**
         * Checks the trigger status of a gamepad, calling the equivalent InputWritr
         * events if any triggers have occurred.
         *
         * @param gamepad   The gamepad whose status is to be checked.
         */
        activateGamepadTriggers(gamepad: IGamepad): void;
        /**
         * Checks for triggered changes to an axis, and calls the equivalent InputWritr
         * event if one is found.
         *
         * @param gamepad   The gamepad whose triggers are to be checked.
         * @param name   The name of the axis, typically "x" or "y".
         * @param magnitude   The current value of the axis, in [1, -1].
         * @returns Whether the trigger was activated.
         */
        activateAxisTrigger(gamepad: IGamepad, name: string, axis: string, magnitude: number): boolean;
        /**
         * Checks for triggered changes to a button, and calls the equivalent InputWritr
         * event if one is found.
         *
         * @param gamepad   The gamepad whose triggers are to be checked.
         * @param name   The name of the button, such as "a" or "left".
         * @param status   Whether the button is activated (pressed).
         * @returns Whether the trigger was activated.
         */
        activateButtonTrigger(gamepad: IGamepad, name: string, status: boolean): boolean;
        /**
         * Clears the statuses of all axes and buttons on all known gamepads.
         */
        clearAllGamepadTriggers(): void;
        /**
         * Clears the status of all axes and buttons on a gamepad.
         *
         * @param gamepad   The gamepad whose triggers are to be cleared.
         */
        clearGamepadTriggers(gamepad: IGamepad): void;
        /**
         * Sets the status of an axis to neutral.
         *
         * @param gamepad   The gamepad whose axis is to be cleared.
         * @param name   The name of the axis, typically "x" or "y".
         */
        clearAxisTrigger(gamepad: IGamepad, name: string, axis: string): void;
        /**
         * Sets the status of a button to off.
         *
         * @param gamepad   The gamepad whose button is to be checked.
         * @param name   The name of the button, such as "a" or "left".
         */
        clearButtonTrigger(gamepad: IGamepad, name: string): void;
    }
}
declare var module: any;
