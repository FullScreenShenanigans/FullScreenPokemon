/// <reference path="../typings/ObjectMakr.d.ts" />
declare namespace QuadsKeepr {
    /**
     * Any rectangular bounding box.
     */
    interface IBoundingBox {
        /**
         * The top border of the bounding box.
         */
        top: number;
        /**
         * The right border of the bounding box.
         */
        right: number;
        /**
         * The bottom border of the bounding box.
         */
        bottom: number;
        /**
         * The left border of the bounding box.
         */
        left: number;
        /**
         * Whether this has been changed since the last game tick.
         */
        changed: boolean;
    }
    /**
     * A bounding box that can be within quadrants.
     */
    interface IThing extends IBoundingBox {
        /**
         * Which group of Things this belongs to.
         */
        groupType: string;
        /**
         * How many quadrants this is a member of.
         */
        numQuadrants: number;
        /**
         * How far this is visually displaced horizontally.
         */
        offsetX?: number;
        /**
         * How far this is visually displaced vertically.
         */
        offsetY?: number;
        /**
         * Quadrants this is a member of.
         */
        quadrants: IQuadrant<IThing>[];
    }
    /**
     * Some collection of Thing groups, keyed by group name.
     *
     * @type T   The type of Thing.
     */
    interface IThingsCollection<T extends IThing> {
        [i: string]: T[];
    }
    /**
     * For each group name in a Quadrant, how many Things it has of that name.
     *
     * @remarks .numthings[groupName] <= .things[groupName].length, as the .things
     *          Arrays are not resized when Things are remved.
     */
    interface IThingsCounter {
        [i: string]: number;
    }
    /**
     * A single cell in a grid structure containing any number of Things.
     *
     * @type T   The type of Thing.
     */
    interface IQuadrant<T extends IThing> extends IBoundingBox {
        /**
         * Groups of Things known to overlap (be within) the Quadrant, by group.
         */
        things: IThingsCollection<T>;
        /**
         * How many Things are in the Quadrant across all groups.
         */
        numthings: IThingsCounter;
    }
    /**
     * A straight line of Quadrants, border-to-border.
     *
     * @type T   The type of Thing.
     */
    interface IQuadrantCollection<T extends IThing> {
        /**
         * The leftmost border (of the leftmost Quadrant).
         */
        left: number;
        /**
         * The top border (of the top Quadrant).
         */
        top: number;
        /**
         * The Quadrants, in order.
         */
        quadrants: IQuadrant<T>[];
    }
    /**
     * A complete row of Quadrants, border-to-border.
     *
     * @type T   The type of Thing.
     */
    interface IQuadrantRow<T extends IThing> extends IQuadrantCollection<T> {
        /**
         * The Quadrants, in order from left to right.
         */
        quadrants: IQuadrant<T>[];
    }
    /**
     * A complete column of Quadrants, border-to-border.
     *
     * @type T   The type of Thing.
     */
    interface IQuadrantCol<T extends IThing> extends IQuadrantCollection<T> {
        /**
         * The Quadrants, in order from top to bottom.
         */
        quadrants: IQuadrant<T>[];
    }
    /**
     * A callback for a newly added or removed area from the grid.
     *
     * @param direction The direction the changed area is, relative to the existing grid.
     * @param top   The top border of the new area.
     * @param right   The right border of the new area.
     * @param bottom   The bottom border of the new area.
     * @param left  The left border of the new area.
     */
    interface IQuadrantChangeCallback {
        (direction: string, top: number, right: number, bottom: number, left: number): void;
    }
    /**
     * Settings to initialize a new IQuadsKeepr.
     */
    interface IQuadsKeeprSettings {
        /**
         * An ObjectMakr used to create Quadrants.
         */
        ObjectMaker: ObjectMakr.IObjectMakr;
        /**
         * How many QuadrantRows to keep at a time.
         */
        numRows: number;
        /**
         * How many QuadrantCols to keep at a time.
         */
        numCols: number;
        /**
         * How wide each Quadrant should be.
         */
        quadrantWidth: number;
        /**
         * How high each Quadrant should be.
         */
        quadrantHeight: number;
        /**
         * The names of groups Things may be in within Quadrants.
         */
        groupNames: string[];
        /**
         * Whether to factor horizontal visual displacement for bounding boxes.
         */
        checkOffsetX?: boolean;
        /**
         * Whether to factor vertical visual displacement for bounding boxes.
         */
        checkOffsetY?: boolean;
        /**
         * Callback for when Quadrants are added, called on the newly contained area.
         */
        onAdd?: IQuadrantChangeCallback;
        /**
         * Callback for when Quadrants are removed, called on the formerly contained area.
         */
        onRemove?: IQuadrantChangeCallback;
        /**
         * The initial horizontal edge (rounded; by default, 0).
         */
        startLeft?: number;
        /**
         * The initial vertical edge (rounded; by default, 0).
         */
        startTop?: number;
    }
    /**
     * Adjustable quadrant-based collision detection.
     *
     * @type T   The type of Thing contained in the quadrants.
     */
    interface IQuadsKeepr<T extends IThing> {
        /**
         * The top boundary for all quadrants.
         */
        top: number;
        /**
         * The right boundary for all quadrants.
         */
        right: number;
        /**
         * The bottom boundary for all quadrants.
         */
        bottom: number;
        /**
         * The left boundary for all quadrants.
         */
        left: number;
        /**
         * @returns The listing of Quadrants grouped by row.
         */
        getQuadrantRows(): IQuadrantRow<T>[];
        /**
         * @returns The listing of Quadrants grouped by column.
         */
        getQuadrantCols(): IQuadrantCol<T>[];
        /**
         * @returns How many Quadrant rows there are.
         */
        getNumRows(): number;
        /**
         * @returns How many Quadrant columns there are.
         */
        getNumCols(): number;
        /**
         * @returns How wide each Quadrant is.
         */
        getQuadrantWidth(): number;
        /**
         * @returns How high each Quadrant is.
         */
        getQuadrantHeight(): number;
        /**
         * Completely resets all Quadrants. The grid structure of rows and columns
         * is remade with new Quadrants according to startLeft and startTop.
         */
        resetQuadrants(): void;
        /**
         * Shifts each Quadrant horizontally and vertically, along with the row and
         * column containers. Offsets are adjusted to check for row or column
         * deletion and insertion.
         *
         * @param dx   How much to shift horizontally (will be rounded).
         * @param dy   How much to shift vertically (will be rounded).
         */
        shiftQuadrants(dx?: number, dy?: number): void;
        /**
         * Adds a QuadrantRow to the end of the quadrantRows Array.
         *
         * @param callUpdate   Whether this should call the onAdd trigger
         *                     with the new row's bounding box.
         * @returns The newly created QuadrantRow.
         */
        pushQuadrantRow(callUpdate?: boolean): IQuadrantRow<T>;
        /**
         * Adds a QuadrantCol to the end of the quadrantCols Array.
         *
         * @param callUpdate   Whether this should call the onAdd trigger
         *                     with the new col's bounding box.
         * @returns The newly created QuadrantCol.
         */
        pushQuadrantCol(callUpdate?: boolean): IQuadrantCol<T>;
        /**
         * Removes the last QuadrantRow from the end of the quadrantRows Array.
         *
         * @param callUpdate   Whether this should call the onRemove trigger
         *                     with the new row's bounding box.
         * @returns The newly created QuadrantRow.
         */
        popQuadrantRow(callUpdate?: boolean): void;
        /**
         * Removes the last QuadrantCol from the end of the quadrantCols Array.
         *
         * @param callUpdate   Whether this should call the onRemove trigger
         *                     with the new row's bounding box.
         */
        popQuadrantCol(callUpdate?: boolean): void;
        /**
         * Adds a QuadrantRow to the beginning of the quadrantRows Array.
         *
         * @param callUpdate   Whether this should call the onAdd trigger
         *                     with the new row's bounding box.
         * @returns The newly created QuadrantRow.
         */
        unshiftQuadrantRow(callUpdate?: boolean): IQuadrantRow<T>;
        /**
         * Adds a QuadrantCol to the beginning of the quadrantCols Array.
         *
         * @param callUpdate   Whether this should call the onAdd trigger
         *                     with the new row's bounding box.
         * @returns The newly created QuadrantCol.
         */
        unshiftQuadrantCol(callUpdate?: boolean): IQuadrantCol<T>;
        /**
         * Removes a QuadrantRow from the beginning of the quadrantRows Array.
         *
         * @param callUpdate   Whether this should call the onAdd trigger
         *                     with the new row's bounding box.
         */
        shiftQuadrantRow(callUpdate?: boolean): void;
        /**
         * Removes a QuadrantCol from the beginning of the quadrantCols Array.
         *
         * @param callUpdate   Whether this should call the onAdd trigger
         *                     with the new row's bounding box.
         */
        shiftQuadrantCol(callUpdate?: boolean): void;
        /**
         * Determines the Quadrants for an entire Array of Things. This is done by
         * wiping each quadrant's memory of that Array's group type and determining
         * each Thing's quadrants.
         *
         * @param group   The name of the group to have Quadrants determined.
         * @param things   The listing of Things in that group.
         */
        determineAllQuadrants(group: string, things: IThing[]): void;
        /**
         * Determines the Quadrants for a single Thing. The starting row and column
         * indices are calculated so every Quadrant within them should contain the
         * Thing. In the process, its old Quadrants and new Quadrants are marked as
         * changed if it was.
         *
         * @param thing   A Thing whose Quadrants are to be determined.
         */
        determineThingQuadrants(thing: IThing): void;
        /**
         * Sets a Thing to be inside a Quadrant. The two are marked so they can
         * recognize each other's existence later.
         *
         * @param thing   A Thing to be placed in the Quadrant.
         * @param quadrant   A Quadrant that now contains the Thing.
         * @param group   The grouping under which the Quadrant should store the
         *                Thing.
         */
        setThingInQuadrant(thing: IThing, quadrant: IQuadrant<T>, group: string): void;
    }
    /**
     * Adjustable quadrant-based collision detection.
     *
     * @type TThing   The type of Thing contained in the quadrants.
     */
    class QuadsKeepr<TThing extends IThing> implements IQuadsKeepr<TThing> {
        /**
         * The top boundary for all quadrants.
         */
        top: number;
        /**
         * The right boundary for all quadrants.
         */
        right: number;
        /**
         * The bottom boundary for all quadrants.
         */
        bottom: number;
        /**
         * The left boundary for all quadrants.
         */
        left: number;
        /**
         * The ObjectMakr factory used to create Quadrant objects.
         */
        private ObjectMaker;
        /**
         * How many rows of Quadrants there should be initially.
         */
        private numRows;
        /**
         * How many columns of Quadrants there should be initially.
         */
        private numCols;
        /**
         * Horizontal scrolling offset during gameplay.
         */
        private offsetX;
        /**
         * Vertical scrolling offset during gameplay.
         */
        private offsetY;
        /**
         * Whether to factor horizontal visual displacement for bounding boxes.
         */
        private checkOffsetX;
        /**
         * Whether to factor vertical visual displacement for bounding boxes.
         */
        private checkOffsetY;
        /**
         * Starting coordinates for columns.
         */
        private startLeft;
        /**
         * Starting coordinates for rows.
         */
        private startTop;
        /**
         * A QuadrantRow[] that holds each QuadrantRow in order.
         */
        private quadrantRows;
        /**
         * A QuadrantCol[] that holds each QuadrantCol in order.
         */
        private quadrantCols;
        /**
         * How wide Quadrants should be.
         */
        private quadrantWidth;
        /**
         * How tall Quadrants should be.
         */
        private quadrantHeight;
        /**
         * The groups Things may be placed into within Quadrants.
         */
        private groupNames;
        /**
         * Callback for when Quadrants are added, called on the area and direction.
         */
        private onAdd;
        /**
         * Callback for when Quadrants are removed, called on the area and direction.
         */
        private onRemove;
        /**
         * @param {IQuadsKeeprSettings} settings
         */
        constructor(settings: IQuadsKeeprSettings);
        /**
         * @returns The listing of Quadrants grouped by row.
         */
        getQuadrantRows(): IQuadrantRow<TThing>[];
        /**
         * @returns The listing of Quadrants grouped by column.
         */
        getQuadrantCols(): IQuadrantCol<TThing>[];
        /**
         * @returns How many Quadrant rows there are.
         */
        getNumRows(): number;
        /**
         * @returns How many Quadrant columns there are.
         */
        getNumCols(): number;
        /**
         * @returns How wide each Quadrant is.
         */
        getQuadrantWidth(): number;
        /**
         * @returns How high each Quadrant is.
         */
        getQuadrantHeight(): number;
        /**
         * Completely resets all Quadrants. The grid structure of rows and columns
         * is remade with new Quadrants according to startLeft and startTop.
         */
        resetQuadrants(): void;
        /**
         * Shifts each Quadrant horizontally and vertically, along with the row and
         * column containers. Offsets are adjusted to check for row or column
         * deletion and insertion.
         *
         * @param dx   How much to shift horizontally (will be rounded).
         * @param dy   How much to shift vertically (will be rounded).
         */
        shiftQuadrants(dx?: number, dy?: number): void;
        /**
         * Adds a QuadrantRow to the end of the quadrantRows Array.
         *
         * @param callUpdate   Whether this should call the onAdd trigger
         *                     with the new row's bounding box.
         * @returns The newly created QuadrantRow.
         */
        pushQuadrantRow(callUpdate?: boolean): IQuadrantRow<TThing>;
        /**
         * Adds a QuadrantCol to the end of the quadrantCols Array.
         *
         * @param callUpdate   Whether this should call the onAdd trigger
         *                     with the new col's bounding box.
         * @returns The newly created QuadrantCol.
         */
        pushQuadrantCol(callUpdate?: boolean): IQuadrantCol<TThing>;
        /**
         * Removes the last QuadrantRow from the end of the quadrantRows Array.
         *
         * @param callUpdate   Whether this should call the onRemove trigger
         *                     with the new row's bounding box.
         * @returns The newly created QuadrantRow.
         */
        popQuadrantRow(callUpdate?: boolean): void;
        /**
         * Removes the last QuadrantCol from the end of the quadrantCols Array.
         *
         * @param callUpdate   Whether this should call the onRemove trigger
         *                     with the new row's bounding box.
         */
        popQuadrantCol(callUpdate?: boolean): void;
        /**
         * Adds a QuadrantRow to the beginning of the quadrantRows Array.
         *
         * @param callUpdate   Whether this should call the onAdd trigger
         *                     with the new row's bounding box.
         * @returns The newly created QuadrantRow.
         */
        unshiftQuadrantRow(callUpdate?: boolean): IQuadrantRow<TThing>;
        /**
         * Adds a QuadrantCol to the beginning of the quadrantCols Array.
         *
         * @param callUpdate   Whether this should call the onAdd trigger
         *                     with the new row's bounding box.
         * @returns The newly created QuadrantCol.
         */
        unshiftQuadrantCol(callUpdate?: boolean): IQuadrantCol<TThing>;
        /**
         * Removes a QuadrantRow from the beginning of the quadrantRows Array.
         *
         * @param callUpdate   Whether this should call the onAdd trigger
         *                     with the new row's bounding box.
         */
        shiftQuadrantRow(callUpdate?: boolean): void;
        /**
         * Removes a QuadrantCol from the beginning of the quadrantCols Array.
         *
         * @param callUpdate   Whether this should call the onAdd trigger
         *                     with the new row's bounding box.
         */
        shiftQuadrantCol(callUpdate?: boolean): void;
        /**
         * Determines the Quadrants for an entire Array of Things. This is done by
         * wiping each quadrant's memory of that Array's group type and determining
         * each Thing's quadrants.
         *
         * @param group   The name of the group to have Quadrants determined.
         * @param things   The listing of Things in that group.
         */
        determineAllQuadrants(group: string, things: TThing[]): void;
        /**
         * Determines the Quadrants for a single Thing. The starting row and column
         * indices are calculated so every Quadrant within them should contain the
         * Thing. In the process, its old Quadrants and new Quadrants are marked as
         * changed if it was.
         *
         * @param thing   A Thing whose Quadrants are to be determined.
         */
        determineThingQuadrants(thing: TThing): void;
        /**
         * Sets a Thing to be inside a Quadrant. The two are marked so they can
         * recognize each other's existence later.
         *
         * @param thing   A Thing to be placed in the Quadrant.
         * @param quadrant   A Quadrant that now contains the Thing.
         * @param group   The grouping under which the Quadrant should store the
         *                Thing.
         */
        setThingInQuadrant(thing: TThing, quadrant: IQuadrant<TThing>, group: string): void;
        /**
         * Adjusts the offset measurements by checking if rows or columns have gone
         * over the limit, which requires rows or columns be removed and new ones
         * added.
         */
        private adjustOffsets();
        /**
         * Shifts a Quadrant horizontally and vertically.
         *
         * @param dx   How much to shift horizontally.
         * @param dy   How much to shift vertically.
         */
        private shiftQuadrant(quadrant, dx, dy);
        /**
         * Creates a new Quadrant using the internal ObjectMaker and sets its position.
         *
         * @param left   The horizontal displacement of the Quadrant.
         * @param top   The vertical displacement of the Quadrant.
         * @returns The newly created Quadrant.
         */
        private createQuadrant(left, top);
        /**
         * Creates a QuadrantRow, with length determined by numCols.
         *
         * @param left   The initial horizontal displacement of the col.
         * @param top   The vertical displacement of the col.
         * @returns The newly created QuadrantRow.
         */
        private createQuadrantRow(left?, top?);
        /**
         * Creates a QuadrantCol, with length determined by numRows.
         *
         * @param left   The horizontal displacement of the col.
         * @param top   The initial vertical displacement of the col.
         * @returns The newly created QuadrantCol.
         */
        private createQuadrantCol(left, top);
        /**
         * @param thing   A Thing to check the bounding box of.
         * @returns The Thing's top position, accounting for vertical offset
         *          if needed.
         */
        private getTop(thing);
        /**
         * @param thing   A Thing to check the bounding box of.
         * @returns The Thing's right position, accounting for horizontal offset
         *          if needed.
         */
        private getRight(thing);
        /**
         * @param thing   A Thing to check the bounding box of.
         * @returns The Thing's bottom position, accounting for vertical
         *          offset if needed.
         */
        private getBottom(thing);
        /**
         * @param thing   A Thing to check the bounding box of.
         * @returns The Thing's left position, accounting for horizontal offset
         *          if needed.
         */
        private getLeft(thing);
        /**
         * Marks all Quadrants a Thing is contained within as changed.
         */
        private markThingQuadrantsChanged(thing);
        /**
         * @param thing   A Thing to check the bounding box of.
         * @returns The index of the first row the Thing is inside.
         */
        private findQuadrantRowStart(thing);
        /**
         * @param thing   A Thing to check the bounding box of.
         * @returns The index of the last row the Thing is inside.
         */
        private findQuadrantRowEnd(thing);
        /**
         * @param thing   A Thing to check the bounding box of.
         * @returns The index of the first column the Thing is inside.
         */
        private findQuadrantColStart(thing);
        /**
         * @param thing   A Thing to check the bounding box of.
         * @returns The index of the last column the Thing is inside.
         */
        private findQuadrantColEnd(thing);
    }
}
declare var module: any;
