import { Scrolling as EightBittrScrolling } from "eightbittr";

import { FullScreenPokemon } from "../FullScreenPokemon";
import { IArea, IAreaBoundaries } from "./Maps";

/**
 * What direction(s) the screen may scroll from player movement.
 */
export enum Scrollability {
    /**
     * The screen may not scroll in either direction.
     */
    None,

    /**
     * The screen may scroll vertically.
     */
    Vertical,

    /**
     * The screen may scroll horizontally.
     */
    Horizontal,

    /**
     * The screen may scroll vertically and horizontally.
     */
    Both,
}

/**
 * Moves the screen and Things in it.
 */
export class Scrolling<TEightBittr extends FullScreenPokemon> extends EightBittrScrolling<TEightBittr> {
    /**
     * Centers the current view of the Map based on scrollability.
     */
    public centerMapScreen(): void {
        switch (this.eightBitter.mapScreener.variables.scrollability) {
            case Scrollability.None:
                this.centerMapScreenHorizontally();
                this.centerMapScreenVertically();
                return;

            case Scrollability.Vertical:
                this.centerMapScreenHorizontally();
                this.centerMapScreenVerticallyOnPlayer();
                return;

            case Scrollability.Horizontal:
                this.centerMapScreenHorizontallyOnPlayer();
                this.centerMapScreenVertically();
                return;

            case Scrollability.Both:
                this.centerMapScreenHorizontallyOnPlayer();
                this.centerMapScreenVerticallyOnPlayer();
                return;

            default:
                return;
        }
    }

    /**
     * Scrolls the game window horizontally until the Map is centered based on
     * the Area.
     */
    public centerMapScreenHorizontally(): void {
        const boundaries: IAreaBoundaries = this.eightBitter.mapScreener.variables.boundaries;
        const difference: number = this.eightBitter.mapScreener.width - boundaries.width;

        if (difference > 0) {
            this.scrollWindow(difference / -2);
        }
    }

    /**
     * Scrolls the game window vertically until the Map is centered based on
     * the Area.
     */
    public centerMapScreenVertically(): void {
        const boundaries: IAreaBoundaries = this.eightBitter.mapScreener.variables.boundaries;
        const difference: number = this.eightBitter.mapScreener.height - boundaries.height;

        this.scrollWindow(0, difference / -2);
    }

    /**
     * Scrolls the game window horizontally until the Map is centered on the player.
     */
    public centerMapScreenHorizontallyOnPlayer(): void {
        const difference: number = (
            this.eightBitter.physics.getMidX(this.eightBitter.players[0])
            - this.eightBitter.mapScreener.middleX)
            | 0;

        if (Math.abs(difference) > 0) {
            this.scrollWindow(difference);
        }
    }

    /**
     * Scrolls the game window vertically until the Map is centered on the player.
     */
    public centerMapScreenVerticallyOnPlayer(): void {
        const difference: number = (
            this.eightBitter.physics.getMidY(this.eightBitter.players[0])
            - this.eightBitter.mapScreener.middleY)
            | 0;

        if (Math.abs(difference) > 0) {
            this.scrollWindow(0, difference);
        }
    }

    /**
     * Determines the in-game measurements of the boundaries of the current Area.
     *
     * @returns The boundaries of the current Area.
     */
    public getAreaBoundariesReal = (): IAreaBoundaries => {
        const area: IArea = this.eightBitter.areaSpawner.getArea() as IArea;

        if (!area) {
            return {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                width: 0,
                height: 0,
            };
        }

        return {
            top: area.boundaries.top,
            right: area.boundaries.right,
            bottom: area.boundaries.bottom,
            left: area.boundaries.left,
            width: (area.boundaries.right - area.boundaries.left),
            height: (area.boundaries.bottom - area.boundaries.top),
        };
    }

    /**
     * Determines the scrollable directions.
     *
     * @returns The direction(s) that are scrollable.
     */
    public getScreenScrollability = (): Scrollability => {
        const area: IArea = this.eightBitter.areaSpawner.getArea() as IArea;
        if (!area) {
            return Scrollability.None;
        }

        const boundaries: IAreaBoundaries = area.boundaries;
        const width: number = (boundaries.right - boundaries.left);
        const height: number = (boundaries.bottom - boundaries.top);

        if (width > this.eightBitter.mapScreener.width) {
            if (height > this.eightBitter.mapScreener.height) {
                return Scrollability.Both;
            }

            return Scrollability.Horizontal;
        }

        if (height > this.eightBitter.mapScreener.height) {
            return Scrollability.Vertical;
        }

        return Scrollability.None;
    }

    /**
     * Determines how much to scroll horizontally during upkeep based
     * on player xvel and horizontal bordering.
     *
     * @returns How far to scroll horizontally.
     */
    public getHorizontalScrollAmount(): number {
        if (!this.eightBitter.players[0].xvel) {
            return 0;
        }

        if (this.eightBitter.players[0].xvel > 0) {
            return this.eightBitter.players[0].bordering[1] ? 0 : this.eightBitter.players[0].xvel;
        }

        return this.eightBitter.players[0].bordering[3] ? 0 : this.eightBitter.players[0].xvel;
    }

    /**
     * Determines how much to scroll vertically during upkeep based
     * on player yvel and vertical bordering.
     *
     * @returns How far to scroll vertically.
     */
    public getVerticalScrollAmount(): number {
        if (!this.eightBitter.players[0].yvel) {
            return 0;
        }

        if (this.eightBitter.players[0].yvel > 0) {
            return this.eightBitter.players[0].bordering[2] ? 0 : this.eightBitter.players[0].yvel;
        }

        return this.eightBitter.players[0].bordering[0] ? 0 : this.eightBitter.players[0].yvel;
    }

    /**
     * Expands the MapScreener boundaries for a newly added Area.
     *
     * @param _area   The newly added Area.
     * @param _x   The x-location of the expansion.
     * @param _y   The y-location of the expansion.
     * @todo For now, this assumes any Area with an added Area is outdoors (which
     *       hasn't been shown to be incorrect yet).
     */
    public expandMapBoundariesForArea(_area: IArea, _dx: number, _dy: number): void {
        this.eightBitter.mapScreener.variables.scrollability = Scrollability.Both;
    }

    /**
     * A mapping of functions to generate member variables that should be
     * recomputed on screen change, keyed by variable name.
     */
    public readonly variableFunctions = {
        boundaries: this.getAreaBoundariesReal,
        scrollability: this.getScreenScrollability,
    };
}
