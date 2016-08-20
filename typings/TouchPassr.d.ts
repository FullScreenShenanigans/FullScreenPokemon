/// <reference path="../typings/InputWritr.d.ts" />
/// <reference path="../typings/ItemsHoldr.d.ts" />
declare namespace TouchPassr {
    /**
     * Abstract class for on-screen controls. Element creation for .element
     * and .elementInner within the constrained position is provided.
     */
    class Control<T extends IControlSchema> {
        /**
         * The parent TouchPassr's InputWritr. Pipe events are sent through here.
         */
        protected InputWriter: InputWritr.IInputWritr;
        /**
         * The governing schema for this control. It should be overriden as a more
         * specific shema in child classes.
         */
        protected schema: T;
        /**
         * The outer container element. It should have width and height of 0, so
         * it can be positioned using the schema's .position.
         */
        protected element: HTMLElement;
        /**
         * The inner container element, directly inside the outer container. It
         * should be positioned absolutely so its center is the outer container.
         */
        protected elementInner: HTMLElement;
        /**
         * Resets the control by setting member variables and calling resetElement.
         *
         * @param InputWriter   The parent TouchPassr's InputWritr.
         * @param schema   The governing schema for this control.
         * @param styles   Any styles to add to the element.
         */
        constructor(InputWriter: InputWritr.IInputWritr, schema: T, styles: IRootControlStyles);
        /**
         * @returns The outer container element.
         */
        getElement(): HTMLElement;
        /**
         * @returns The inner container element.
         */
        getElementInner(): HTMLElement;
        /**
         * Creates and returns an HTMLElement of the specified type. Any additional
         * settings Objects may be given to be proliferated onto the Element via
         * proliferateElement.
         *
         * @param type   The tag of the Element to be created.
         * @param settings   Additional settings for the Element, such as className
         *                   or style.
         * @returns A newly created HTMLElement of the specified type.
         */
        createElement(tag: string, ...args: any[]): HTMLElement;
        /**
         * Identical to proliferate, but tailored for HTML elements because many
         * element attributes don't play nicely with JavaScript Array standards.
         * Looking at you, HTMLCollection!
         *
         * @param recipient   An HTMLElement to receive properties from the donor.
         * @param donor   An object do donoate properties to the recipient.
         * @param noOverride   Whether pre-existing properties of the recipient should
         *                     be skipped (defaults to false).
         * @returns recipient
         */
        proliferateElement(recipient: HTMLElement, donor: any, noOverride?: boolean): HTMLElement;
        /**
         * Resets the container elements. In any inherited resetElement, this should
         * still be called, as it implements the schema's position.
         *
         * @param styles   Container styles for the contained elements.
         */
        protected resetElement(styles: IRootControlStyles, customType?: string): void;
        /**
         * Converts a String or Number into a CSS-ready String measurement.
         *
         * @param raw   A raw measurement, such as 7 or "7px" or "7em".
         * @returns The raw measurement as a CSS measurement.
         */
        protected createPixelMeasurement(raw: string | number): string;
        /**
         * Determines a "half"-measurement that would center an element based on the
         * specified units.
         *
         * @param element   The element whose half-size should be computed.
         * @param styleTag   The initial CSS measurement to check for, as "width" or
         *                   "height".
         * @param attributeBackup   A measurement to check for if the CSS size is falsy,
         *                          as "offsetWidth" or "offsetHeight".
         * @returns A measurement equal to half the sytleTag/attributeBackup, such as
         *          "3.5em" or "10px".
         */
        protected createHalfSizeMeasurement(element: HTMLElement, styleTag: string, attributeBackup: string): string;
        /**
         * Passes a style schema to .element and .elementInner.
         *
         * @param styles   A container for styles to apply.
         */
        protected passElementStyles(styles: IControlStyles): void;
        /**
         * Sets the rotation of an HTML element via CSS.
         *
         * @param element   An HTML element to rotate.
         * @param rotation   How many degrees to rotate the element.
         */
        protected setRotation(element: HTMLElement, rotation: number): void;
        /**
         * Finds the position offset of an element relative to the page, factoring in
         * its parent elements' offsets recursively.
         *
         * @param element   An HTML element.
         * @returns The [left, top] offset of the element, in px.
         */
        protected getOffsets(element: HTMLElement): [number, number];
    }
    /**
     * Control schema for a simple button. Pipes are activated on press and on release.
     */
    interface IButtonSchema extends IControlSchema {
        /**
         * Pipe descriptions for what should be sent to the InputWritr.
         */
        pipes?: IPipes;
    }
    /**
     * Styles schema for a button control.
     */
    interface IButtonStyles extends IControlStyles {
    }
    /**
     * Simple button control. It activates its triggers when the user presses
     * it or releases it, and contains a simple label.
     */
    class ButtonControl extends Control<IButtonSchema> {
        /**
         * Resets the elements by adding listeners for mouse and touch
         * activation and deactivation events.
         *
         * @param styles   Container styles for the contained elements.
         */
        protected resetElement(styles: IRootControlStyles): void;
        /**
         * Reaction callback for a triggered event.
         *
         * @param which   The pipe being activated, such as "activated"
         *                or "deactivated".
         * @param event   The triggered event.
         */
        protected onEvent(which: string, event: Event): void;
    }
    /**
     * Control schema for a joystick. It may have any number of directions that it
     * will snap to, each of which will have its own pipes.
     */
    interface IJoystickSchema extends IControlSchema {
        /**
         * Direction ticks to display on the control.
         */
        directions: IJoystickDirection[];
    }
    /**
     * Schema for a single direction for a joystick. It will be represented as a tick
     * on the joystick that the control will snap its direction to.
     */
    interface IJoystickDirection {
        /**
         * The unique name of this direction, such as "Up".
         */
        name: string;
        /**
         * What degree measurement to place the tick at.
         */
        degrees: number;
        /**
         * Pipe descriptions for what should be sent to the InputWritr.
         */
        pipes?: IPipes;
    }
    /**
     * Styles schema for a joystick control, adding its ticks and indicator elements.
     */
    interface IJoystickStyles extends IControlStyles {
        /**
         * Styles for the round circle elements.
         */
        circle?: IControlStyles;
        /**
         * Styles for the individual "tick" elements.
         */
        tick?: IControlStyles;
        /**
         * Styles for the dragging line element.
         */
        dragLine?: IControlStyles;
        /**
         * Styles for the outer shadow element.
         */
        dragShadow?: IControlStyles;
    }
    /**
     * Joystick control. An inner circle can be dragged to one of a number
     * of directions to trigger pipes on and off.
     */
    class JoystickControl extends Control<IJoystickSchema> {
        /**
         * The large inner circle that visually surrounds the ticks and other
         * inner elements.
         */
        protected elementCircle: HTMLDivElement;
        /**
         * The normally hidden tick to display a snapped direction.
         */
        protected elementDragLine: HTMLDivElement;
        /**
         * The normally hidden circle that emulates the outer part of a joystick.
         */
        protected elementDragShadow: HTMLDivElement;
        /**
         * Whether dragging is currently enabled, generally by the user starting
         * an interation event with touch or a mouse.
         */
        protected dragEnabled: boolean;
        /**
         * The currently snaped direction, if dragEnabled is true.
         */
        protected currentDirection: IJoystickDirection;
        /**
         * Resets the element by creating a tick for each direction, along with
         * the multiple circular elements with their triggers.
         *
         * @param styles   Container styles for the contained elements.
         */
        protected resetElement(styles: IRootControlStyles): void;
        /**
         * Enables dragging, showing the elementDragLine.
         */
        protected positionDraggerEnable(): void;
        /**
         * Disables dragging, hiding the drag line and re-centering the
         * inner circle shadow.
         */
        protected positionDraggerDisable(): void;
        /**
         * Triggers a movement point for the joystick, and snaps the stick to
         * the nearest direction (based on the angle from the center to the point).
         *
         * @param event   A user-triggered event.
         */
        protected triggerDragger(event: DragEvent | MouseEvent): void;
        /**
         * Finds the raw coordinates of an event, whether it's a drag (touch)
         * or mouse event.
         *
         * @returns The x- and y- coordinates of the event.
         */
        protected getEventCoordinates(event: DragEvent | MouseEvent): number[];
        /**
         * Finds the angle from a joystick center to an x and y. This assumes
         * straight up is 0, to the right is 90, down is 180, and left is 270.
         *
         * @returns The degrees to the given point.
         */
        protected getThetaRaw(dxRaw: number, dyRaw: number): number;
        /**
         * Converts an angle to its relative dx and dy coordinates.
         *
         * @param thetaRaw   The raw degrees of an anle.
         * @returns The x- and y- parts of an angle.
         */
        protected getThetaComponents(thetaRaw: number): [number, number];
        /**
         * Finds the index of the closest direction to an angle.
         *
         * @param degrees   The degrees of an angle.
         * @returns The index of the closest known direction to the degrees.a
         */
        protected findClosestDirection(degrees: number): number;
        /**
         * Sets the current direction of the joystick, calling the relevant
         * InputWriter pipes if necessary.
         *
         * @param direction   A new direction to face.
         * @param event   A user-triggered event.
         */
        protected setCurrentDirection(direction: IJoystickDirection, event?: Event): void;
        /**
         * Trigger for calling pipes when a new direction is set. All children
         * of the pipe has each of its keys triggered.
         *
         * @param pipes   Pipes to trigger.
         * @param event   A user-triggered event.
         */
        protected onEvent(pipes: IPipes, event?: Event): void;
    }
    /**
     * Schema for where a control should lay on the screen.
     */
    interface IPosition {
        /**
         * Vertical position, as "top", "bottom", or "center".
         */
        vertical: string;
        /**
         * Horizontal position, as "top", "right", "center".
         */
        horizontal: string;
        /**
         * Offset measurements to shift from the vertical and horizontal position.
         */
        offset?: IPositionOffset;
    }
    /**
     * Offset measurements for a schema's position.
     */
    interface IPositionOffset {
        /**
         * How much to shift horizontally, as a number or CSS-ready String measurement.
         */
        left?: number | string;
        /**
         * How much to shift vertically, as a number or CSS-ready String measurement.
         */
        top?: number | string;
    }
    /**
     * Global declaration of styles for all controls, typically passed from a
     * TouchPassr to its generated controls.
     */
    interface IRootControlStyles {
        /**
         * Styles that apply to all controls.
         */
        global?: IControlStyles;
        /**
         * Specific controls, such as "Button", have styles keyed by control name.
         */
        [i: string]: IControlStyles;
    }
    /**
     * Container for control classes, keyed by name.
     */
    interface IControlClassesContainer {
        [i: string]: Control<any>;
    }
    /**
     * Container for controls, keyed by name.
     */
    interface IControlsContainer {
        [i: string]: Control<IControlSchema>;
    }
    /**
     * Container for control schemas, keyed by name.
     */
    interface IControlSchemasContainer {
        [i: string]: IControlSchema;
    }
    /**
     * General container for element styles of a control. It should be extended
     * for more specific controls.
     */
    interface IControlStyles {
        /**
         * Styles to apply to the primary (outer) control element.
         */
        element?: CSSRuleList;
        /**
         * Styles to apply to the inner control element.
         */
        elementInner?: CSSRuleList;
    }
    /**
     * Root schema to be followed for all controls. More specific schema versions
     * will extend this.
     */
    interface IControlSchema {
        /**
         * What name this will be keyed under in the parent TouchPassr.
         */
        name: string;
        /**
         * The type of control this should create, such as "Button".
         */
        control: string;
        /**
         * Where the generated code should be on the screen.
         */
        position: IPosition;
        /**
         * A label to display in the control.
         */
        label?: string;
        /**
         * Additional styles to pass to the control.
         */
        styles?: IControlStyles;
    }
    /**
     * Schema for how a control should interact with its InputWriter. Each member key
     * is the control action, which is linked to any number of InputWriter events, each
     * of which contains any number of key codes to send.
     */
    interface IPipes {
        /**
         * Event triggers to pass when a control is activated.
         */
        activated?: {
            [i: string]: (string | number)[];
        };
        /**
         * Event triggers to pass when a control is deactivated.
         */
        deactivated?: {
            [i: string]: (string | number)[];
        };
    }
    /**
     * Settings to initialize a new ITouchPassr.
     */
    interface ITouchPassrSettings {
        /**
         * An InputWritr for controls to pipe event triggers to.
         */
        InputWriter: InputWritr.IInputWritr;
        /**
         * An HTMLElement all controls are placed within.
         */
        container?: HTMLElement;
        /**
         * Root container for styles to be added to control elements.
         */
        styles?: IRootControlStyles;
        /**
         * Container for generated controls, keyed by their name.
         */
        controls?: IControlSchemasContainer;
        /**
         * Whether this is currently enabled and visually on the screen.
         */
        enabled?: boolean;
    }
    /**
     * A GUI layer on top of InputWritr for touch events.
     */
    interface ITouchPassr {
        /**
         * @returns The InputWritr for controls to pipe event triggers to.
         */
        getInputWriter(): InputWritr.IInputWritr;
        /**
         * @returns Whether this is currently enabled and visually on the screen.
         */
        getEnabled(): boolean;
        /**
         * @returns The root container for styles to be added to control elements.
         */
        getStyles(): IRootControlStyles;
        /**
         * @returns The container for generated controls, keyed by their name.
         */
        getControls(): IControlsContainer;
        /**
         * @returns The HTMLElement all controls are placed within.
         */
        getContainer(): HTMLElement;
        /**
         * @returns The HTMLElement containing the controls container.
         */
        getParentContainer(): HTMLElement;
        /**
         * Enables the TouchPassr by showing the container.
         */
        enable(): void;
        /**
         * Disables the TouchPassr by hiding the container.
         */
        disable(): void;
        /**
         * Sets the parent container surrounding the controls container.
         *
         * @param parentElement   A new parent container.
         */
        setParentContainer(parentElement: HTMLElement): void;
        /**
         * Adds any number of controls to the internal listing and HTML container.
         *
         * @param schemas   Schemas for new controls to be made, keyed by name.
         */
        addControls(schemas: IControlSchemasContainer): void;
        /**
         * Adds a control to the internal listing and HTML container.
         *
         * @param schema   The schema for the new control to be made.
         */
        addControl(schema: IControlSchema): void;
    }
    /**
     * A GUI layer on top of InputWritr for touch events.
     */
    class TouchPassr implements ITouchPassr {
        /**
         * Known, allowed control classes, keyed by name.
         */
        private static controlClasses;
        /**
         * An InputWritr for controls to pipe event triggers to.
         */
        private InputWriter;
        /**
         * Whether this is currently enabled and visually on the screen.
         */
        private enabled;
        /**
         * Root container for styles to be added to control elements.
         */
        private styles;
        /**
         * Container for generated controls, keyed by their name.
         */
        private controls;
        /**
         * An HTMLElement all controls are placed within.
         */
        private container;
        /**
         * HTMLElement containing the controls container.
         */
        private parentContainer;
        /**
         * Initializes a new instance of the TouchPassr class.
         *
         * @param settings   Settings to be used for initialization.
         */
        constructor(settings: ITouchPassrSettings);
        /**
         * @returns The InputWritr for controls to pipe event triggers to.
         */
        getInputWriter(): InputWritr.IInputWritr;
        /**
         * @returns Whether this is currently enabled and visually on the screen.
         */
        getEnabled(): boolean;
        /**
         * @returns The root container for styles to be added to control elements.
         */
        getStyles(): IRootControlStyles;
        /**
         * @returns The container for generated controls, keyed by their name.
         */
        getControls(): IControlsContainer;
        /**
         * @returns The HTMLElement all controls are placed within.
         */
        getContainer(): HTMLElement;
        /**
         * @returns The HTMLElement containing the controls container.
         */
        getParentContainer(): HTMLElement;
        /**
         * Enables the TouchPassr by showing the container.
         */
        enable(): void;
        /**
         * Disables the TouchPassr by hiding the container.
         */
        disable(): void;
        /**
         * Sets the parent container surrounding the controls container.
         *
         * @param parentElement   A new parent container.
         */
        setParentContainer(parentElement: HTMLElement): void;
        /**
         * Adds any number of controls to the internal listing and HTML container.
         *
         * @param schemas   Schemas for new controls to be made, keyed by name.
         */
        addControls(schemas: IControlSchemasContainer): void;
        /**
         * Adds a control to the internal listing and HTML container.
         *
         * @param schema   The schema for the new control to be made.
         */
        addControl<T extends IControlSchema>(schema: T): void;
        /**
         * Resets the base controls container. If a parent element is provided,
         * the container is added to it.
         *
         * @param parentContainer   A container element, such as from GameStartr.
         */
        private resetContainer(parentContainer?);
    }
}
declare var module: any;
