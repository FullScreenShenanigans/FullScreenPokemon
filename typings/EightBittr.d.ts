declare namespace EightBittr {
    /**
     * A section of EightBittr functionality.
     */
    abstract class Component<TEightBittr extends EightBittr> {
        /**
         * A container EightBitter to work within.
         */
        protected EightBitter: TEightBittr;
        /**
         * Initializes a new instance of the EightBittr class.
         *
         * @param EightBitter   A container EightBitter to work within.
         */
        constructor(EightBitter: TEightBittr);
    }
    /**
     * An abstract class used exclusively as the parent of GameStartr.
     */
    abstract class EightBittr {
        /**
         * Physics functions used by this instance.
         */
        physics: Physics<EightBittr>;
        /**
         * Utility functions used by this instance.
         */
        utilities: Utilities<EightBittr>;
        /**
         * How much to expand each pixel from raw sizing measurements to in-game.
         */
        unitsize: number;
        /**
         * Initializes a new instance of the EightBittr class. Constants are copied
         * onto the EightBittr from the designated source.
         *
         * @param settings   Any optional custom settings.
         */
        constructor(settings?: IEightBittrSettings);
        /**
         * Sets the system components.
         */
        protected abstract resetComponents(): void;
    }
    /**
     * Settings to initialize a new instance of the IEightBittr interface.
     */
    interface IEightBittrSettings {
        /**
         * How much to expand each pixel from raw sizing measurements to in-game.
         */
        unitsize?: number;
    }
    /**
     * A basic representation of an in-game Thing. Size, velocity, and position
     * are stored, as well as a reference to the parent IEightBittr.
     */
    interface IThing {
        /**
         * The top border of this Thing's bounding box.
         */
        top: number;
        /**
         * The top border of this Thing's bounding box.
         */
        right: number;
        /**
         * The top border of this Thing's bounding box.
         */
        bottom: number;
        /**
         * The top border of this Thing's bounding box.
         */
        left: number;
        /**
         * How wide this Thing is.
         */
        width: number;
        /**
         * How tall this Thing is.
         */
        height: number;
        /**
         * How rapidly this is moving horizontally.
         */
        xvel: number;
        /**
         * How rapidly this is moving vertically.
         */
        yvel: number;
    }
    /**
     * Physics functions used by EightBittr instances.
     */
    class Physics<TEightBittr extends EightBittr> extends Component<TEightBittr> {
        /**
         * Shifts a Thing vertically by changing its top and bottom attributes.
         *
         * @param thing   The Thing to shift vertically.
         * @param dy   How far to shift the Thing.
         */
        shiftVert(thing: IThing, dy: number): void;
        /**
         * Shifts a Thing horizontally by changing its top and bottom attributes.
         *
         * @param thing   The Thing to shift horizontally.
         * @param dy   How far to shift the Thing.
         */
        shiftHoriz(thing: IThing, dx: number): void;
        /**
         * Sets the top of a Thing to a set number, changing the bottom based on its
         * height and the EightBittr's unisize.
         *
         * @param thing   The Thing to shift vertically.
         * @param top   Where the Thing's top should be.
         */
        setTop(thing: IThing, top: number): void;
        /**
         * Sets the right of a Thing to a set number, changing the left based on its
         * width and the EightBittr's unisize.
         *
         * @param thing   The Thing to shift horizontally.
         * @param top   Where the Thing's right should be.
         */
        setRight(thing: IThing, right: number): void;
        /**
         * Sets the bottom of a Thing to a set number, changing the top based on its
         * height and the EightBittr's unisize.
         *
         * @param thing   The Thing to shift vertically.
         * @param top   Where the Thing's bottom should be.
         */
        setBottom(thing: IThing, bottom: number): void;
        /**
         * Sets the left of a Thing to a set number, changing the right based on its
         * width and the EightBittr's unisize.
         *
         * @param thing   The Thing to shift horizontally.
         * @param top   Where the Thing's left should be.
         */
        setLeft(thing: IThing, left: number): void;
        /**
         * Shifts a Thing so that it is horizontally centered on the given x.
         *
         * @param thing   The Thing to shift horizontally.
         * @param x   Where the Thing's horizontal midpoint should be.
         */
        setMidX(thing: IThing, x: number): void;
        /**
         * Shifts a Thing so that it is vertically centered on the given y.
         *
         * @param thing   The Thing to shift vertically.
         * @param y   Where the Thing's vertical midpoint should be.
         */
        setMidY(thing: IThing, y: number): void;
        /**
         * Shifts a Thing so that it is centered on the given x and y.
         *
         * @param thing   The Thing to shift vertically and horizontally.
         * @param x   Where the Thing's horizontal midpoint should be.
         * @param y   Where the Thing's vertical midpoint should be.
         */
        setMid(thing: IThing, x: number, y: number): void;
        /**
         * @param thing
         * @returns The horizontal midpoint of the Thing.
         */
        getMidX(thing: IThing): number;
        /**
         * @param thing
         * @returns The vertical midpoint of the Thing.
         */
        getMidY(thing: IThing): number;
        /**
         * Shifts a Thing so that its midpoint is centered on the midpoint of the
         * other Thing.
         *
         * @param thing   The Thing to be shifted.
         * @param other   The Thing whose midpoint is referenced.
         */
        setMidObj(thing: IThing, other: IThing): void;
        /**
         * Shifts a Thing so that its horizontal midpoint is centered on the
         * midpoint of the other Thing.
         *
         * @param thing   The Thing to be shifted horizontally.
         * @param other   The Thing whose horizontal midpoint is referenced.
         */
        setMidXObj(thing: IThing, other: IThing): void;
        /**
         * Shifts a Thing so that its vertical midpoint is centered on the
         * midpoint of the other Thing.
         *
         * @param thing   The Thing to be shifted vertically.
         * @param other   The Thing whose vertical midpoint is referenced.
         */
        setMidYObj(thing: IThing, other: IThing): void;
        /**
         * @param thing
         * @param other
         * @returns Whether the first Thing's vertical midpoint is to the left
         *          of the other's.
         */
        thingAbove(thing: IThing, other: IThing): boolean;
        /**
         * @param thing
         * @param other
         * @returns Whether the first Thing's horizontal midpoint is to the left
         *          of the other's.
         */
        thingToLeft(thing: IThing, other: IThing): boolean;
        /**
         * Shifts a Thing's top up, then sets the bottom (similar to a shiftVert and
         * a setTop combined).
         *
         * @param thing   The Thing to be shifted vertically.
         * @param dy   How far to shift the Thing vertically (by default, 0).
         */
        updateTop(thing: IThing, dy?: number): void;
        /**
         * Shifts a Thing's right, then sets the left (similar to a shiftHoriz and a
         * setRight combined).
         *
         * @param thing   The Thing to be shifted horizontally.
         * @param dx   How far to shift the Thing horizontally (by default, 0).
         */
        updateRight(thing: IThing, dx?: number): void;
        /**
         * Shifts a Thing's bottom down, then sets the bottom (similar to a
         * shiftVert and a setBottom combined).
         *
         * @param thing   The Thing to be shifted vertically.
         * @param dy   How far to shift the Thing vertically (by default, 0).
         */
        updateBottom(thing: IThing, dy?: number): void;
        /**
         * Shifts a Thing's left, then sets the right (similar to a shiftHoriz and a
         * setLeft combined).
         *
         * @param thing   The Thing to be shifted horizontally.
         * @param dx   How far to shift the Thing horizontally (by default, 0).
         */
        updateLeft(thing: IThing, dx?: number): void;
        /**
         * Shifts a Thing toward a target x, but limits the total distance allowed.
         * Distance is computed as from the Thing's horizontal midpoint.
         *
         * @param thing   The Thing to be shifted horizontally.
         * @param dx   How far to shift the Thing horizontally.
         * @param maxDistance   The maximum distance the Thing can be shifted (by
         *                      default, Infinity for no maximum).
         */
        slideToX(thing: IThing, dx: number, maxDistance?: number): void;
        /**
         * Shifts a Thing toward a target y, but limits the total distance allowed.
         * Distance is computed as from the Thing's vertical midpoint.
         *
         * @param thing   The Thing to be shifted vertically.
         * @param dy   How far to shift the Thing vertically.
         * @param maxDistance   The maximum distance the Thing can be shifted (by
         *                      default, Infinity, for no maximum).
         */
        slideToY(thing: IThing, dy: number, maxDistance?: number): void;
    }
    /**
     * Miscellaneous utilities used by EightBittr instances.
     */
    class Utilities<TEightBittr extends EightBittr> extends Component<TEightBittr> {
        /**
         * "Proliferates" all properties of a donor onto a recipient by copying each
         * of them and recursing onto child Objects. This is a deep copy.
         *
         * @param recipient   An object to receive properties from the donor.
         * @param donor   An object do donoate properties to the recipient.
         * @param noOverride   Whether pre-existing properties of the recipient should
         *                     be skipped (defaults to false).
         * @returns recipient
         */
        proliferate(recipient: any, donor: any, noOverride?: boolean): any;
        /**
         * Identical to proliferate, but instead of checking whether the recipient
         * hasOwnProperty on properties, it just checks if they're truthy.
         *
         * @param recipient   An object to receive properties from the donor.
         * @param donor   An object do donoate properties to the recipient.
         * @param noOverride   Whether pre-existing properties of the recipient should
         *                     be skipped (defaults to false).
         * @returns recipient
         */
        proliferateHard(recipient: any, donor: any, noOverride?: boolean): any;
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
         * Creates and returns an HTMLElement of the specified type. Any additional
         * settings Objects may be given to be proliferated onto the Element via
         * proliferateElement.
         *
         * @param type   The tag of the Element to be created.
         * @param settings   Additional settings to proliferated onto the Element.
         * @returns {HTMLElement}
         */
        createElement(tag?: string, ...args: any[]): HTMLElement;
        /**
         * Creates and returns a new HTML <canvas> element with no image smoothing.
         *
         * @param width   How wide the canvas should be.
         * @param height   How tall the canvas should be.
         * @returns A canvas of the given width and height height.
         */
        createCanvas(width: number, height: number): HTMLCanvasElement;
        /**
         * Follows a path inside an Object recursively, based on a given path.
         *
         * @param object   A container to follow a path inside.
         * @param path   The ordered names of attributes to descend into.
         * @param num   The starting index in path (by default, 0).
         * @returns The discovered property within object, or undefined if the
         *          full path doesn't exist.
         */
        followPathHard(object: any, path: string[], index?: number): any;
        /**
         * Switches an object from one Array to another using splice and push.
         *
         * @param object    The object to move between Arrays.
         * @param arrayOld   The Array to take the object out of.
         * @param arrayNew   The Array to move the object into.
         */
        arraySwitch(object: any, arrayOld: any[], arrayNew: any[]): void;
        /**
         * Sets a Thing's position within an Array to the front by splicing and then
         * unshifting it.
         *
         * @param object   The object to move within the Array.
         * @param array   An Array currently containing the object.
         */
        arrayToBeginning(object: any, array: any[]): void;
        /**
         * Sets a Thing's position within an Array to the front by splicing and then
         * pushing it.
         *
         * @param object   The object to move within the Array.
         * @param array   An Array currently containing the object.
         */
        arrayToEnd(object: IThing, array: any[]): void;
        /**
         * Sets a Thing's position within an Array to a specific index by splicing
         * it out, then back in.
         *
         * @param object   The object to move within the Array.
         * @param array   An Array currently containing the object.
         * @param index   Where the object should be moved to in the Array.
         */
        arrayToIndex(object: IThing, array: any[], index: number): void;
    }
}
declare var module: any;
