import { Scrolling as GameStartrScrolling } from "gamestartr/lib/Scrolling";

import { Scrollability } from "./Constants";
import { FullScreenPokemon } from "./FullScreenPokemon";
import { IArea, IAreaBoundaries } from "./IFullScreenPokemon";

/**
 * Scrolling functions used by FullScreenPokemon instances.
 */
export class Scrolling<TEightBittr extends FullScreenPokemon> extends GameStartrScrolling<TEightBittr> {
    /**
     * Centers the current view of the Map based on scrollability.
     */
    public centerMapScreen(): void {
        switch (this.eightBitter.MapScreener.variables.scrollability) {
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
        const boundaries: IAreaBoundaries = this.eightBitter.MapScreener.variables.boundaries;
        const difference: number = this.eightBitter.MapScreener.width - boundaries.width;

        if (difference > 0) {
            this.scrollWindow(difference / -2);
        }
    }

    /**
     * Scrolls the game window vertically until the Map is centered based on
     * the Area.
     */
    public centerMapScreenVertically(): void {
        const boundaries: IAreaBoundaries = this.eightBitter.MapScreener.variables.boundaries;
        const difference: number = this.eightBitter.MapScreener.height - boundaries.height;

        this.scrollWindow(0, difference / -2);
    }

    /**
     * Scrolls the game window horizontally until the Map is centered on the player.
     */
    public centerMapScreenHorizontallyOnPlayer(): void {
        const difference: number = (
            this.eightBitter.physics.getMidX(this.eightBitter.player)
            - this.eightBitter.MapScreener.middleX)
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
            this.eightBitter.physics.getMidY(this.eightBitter.player)
            - this.eightBitter.MapScreener.middleY)
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
    public getAreaBoundariesReal(): IAreaBoundaries {
        const area: IArea = this.eightBitter.areaSpawner.getArea() as IArea;

        if (!area) {
            return {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                width: 0,
                height: 0
            };
        }

        return {
            top: area.boundaries.top * this.eightBitter.unitsize,
            right: area.boundaries.right * this.eightBitter.unitsize,
            bottom: area.boundaries.bottom * this.eightBitter.unitsize,
            left: area.boundaries.left * this.eightBitter.unitsize,
            width: (area.boundaries.right - area.boundaries.left) * this.eightBitter.unitsize,
            height: (area.boundaries.bottom - area.boundaries.top) * this.eightBitter.unitsize
        };
    }

    /**
     * Determines the scrollable directions.
     * 
     * @returns The direction(s) that are scrollable.
     */
    public getScreenScrollability(): Scrollability {
        const area: IArea = this.eightBitter.areaSpawner.getArea() as IArea;
        if (!area) {
            return Scrollability.None;
        }

        const boundaries: IAreaBoundaries = area.boundaries;
        const width: number = (boundaries.right - boundaries.left) * this.eightBitter.unitsize;
        const height: number = (boundaries.bottom - boundaries.top) * this.eightBitter.unitsize;

        if (width > this.eightBitter.MapScreener.width) {
            if (height > this.eightBitter.MapScreener.height) {
                return Scrollability.Both;
            }

            return Scrollability.Horizontal;
        }

        if (height > this.eightBitter.MapScreener.height) {
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
        if (!this.eightBitter.player.xvel) {
            return 0;
        }

        if (this.eightBitter.player.xvel > 0) {
            return this.eightBitter.player.bordering[1] ? 0 : this.eightBitter.player.xvel;
        } else {
            return this.eightBitter.player.bordering[3] ? 0 : this.eightBitter.player.xvel;
        }
    }

    /**
     * Determines how much to scroll vertically during upkeep based
     * on player yvel and vertical bordering.
     *
     * @returns How far to scroll vertically.
     */
    public getVerticalScrollAmount(): number {
        if (!this.eightBitter.player.yvel) {
            return 0;
        }

        if (this.eightBitter.player.yvel > 0) {
            return this.eightBitter.player.bordering[2] ? 0 : this.eightBitter.player.yvel;
        } else {
            return this.eightBitter.player.bordering[0] ? 0 : this.eightBitter.player.yvel;
        }
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
        this.eightBitter.MapScreener.variables.scrollability = Scrollability.Both;
    }
}
