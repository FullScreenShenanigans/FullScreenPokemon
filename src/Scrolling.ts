/// <reference path="../typings/GameStartr.d.ts" />

import { Scrollability } from "./Constants";
import { FullScreenPokemon } from "./FullScreenPokemon";
import { IArea, IAreaBoundaries } from "./IFullScreenPokemon";

/**
 * Scrolling functions used by FullScreenPokemon instances.
 */
export class Scrolling<TEightBittr extends FullScreenPokemon> extends GameStartr.Scrolling<TEightBittr> {
    /**
     * Centers the current view of the Map based on scrollability.
     */
    public centerMapScreen(): void {
        switch (this.EightBitter.MapScreener.variables.scrollability) {
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
        const boundaries: IAreaBoundaries = this.EightBitter.MapScreener.variables.boundaries;
        const difference: number = this.EightBitter.MapScreener.width - boundaries.width;

        if (difference > 0) {
            this.scrollWindow(difference / -2);
        }
    }

    /**
     * Scrolls the game window vertically until the Map is centered based on
     * the Area.
     */
    public centerMapScreenVertically(): void {
        const boundaries: IAreaBoundaries = this.EightBitter.MapScreener.variables.boundaries;
        const difference: number = this.EightBitter.MapScreener.height - boundaries.height;

        this.scrollWindow(0, difference / -2);
    }

    /**
     * Scrolls the game window horizontally until the Map is centered on the player.
     */
    public centerMapScreenHorizontallyOnPlayer(): void {
        const difference: number = (
            this.EightBitter.physics.getMidX(this.EightBitter.player)
            - this.EightBitter.MapScreener.middleX)
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
            this.EightBitter.physics.getMidY(this.EightBitter.player)
            - this.EightBitter.MapScreener.middleY)
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
        const area: IArea = this.EightBitter.AreaSpawner.getArea() as IArea;

        if (!area) {
            return {
                "top": 0,
                "right": 0,
                "bottom": 0,
                "left": 0,
                "width": 0,
                "height": 0
            };
        }

        return {
            "top": area.boundaries.top * this.EightBitter.unitsize,
            "right": area.boundaries.right * this.EightBitter.unitsize,
            "bottom": area.boundaries.bottom * this.EightBitter.unitsize,
            "left": area.boundaries.left * this.EightBitter.unitsize,
            "width": (area.boundaries.right - area.boundaries.left) * this.EightBitter.unitsize,
            "height": (area.boundaries.bottom - area.boundaries.top) * this.EightBitter.unitsize
        };
    }

    /**
     * Determines the scrollable directions.
     * 
     * @returns The direction(s) that are scrollable.
     */
    public getScreenScrollability(): Scrollability {
        const area: IArea = this.EightBitter.AreaSpawner.getArea() as IArea;
        if (!area) {
            return Scrollability.None;
        }

        const boundaries: IAreaBoundaries = area.boundaries;
        const width: number = (boundaries.right - boundaries.left) * this.EightBitter.unitsize;
        const height: number = (boundaries.bottom - boundaries.top) * this.EightBitter.unitsize;

        if (width > this.EightBitter.MapScreener.width) {
            if (height > this.EightBitter.MapScreener.height) {
                return Scrollability.Both;
            }

            return Scrollability.Horizontal;
        }

        if (height > this.EightBitter.MapScreener.height) {
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
        if (!this.EightBitter.player.xvel) {
            return 0;
        }

        if (this.EightBitter.player.xvel > 0) {
            return this.EightBitter.player.bordering[1] ? 0 : this.EightBitter.player.xvel;
        } else {
            return this.EightBitter.player.bordering[3] ? 0 : this.EightBitter.player.xvel;
        }
    }

    /**
     * Determines how much to scroll vertically during upkeep based
     * on player yvel and vertical bordering.
     *
     * @returns How far to scroll vertically.
     */
    public getVerticalScrollAmount(): number {
        if (!this.EightBitter.player.yvel) {
            return 0;
        }

        if (this.EightBitter.player.yvel > 0) {
            return this.EightBitter.player.bordering[2] ? 0 : this.EightBitter.player.yvel;
        } else {
            return this.EightBitter.player.bordering[0] ? 0 : this.EightBitter.player.yvel;
        }
    }

    /**
     * Expands the MapScreener boundaries for a newly added Area.
     * 
     * @param area   The newly added Area.
     * @param x   The x-location of the expansion.
     * @param y   The y-location of the expansion.
     * @todo For now, this assumes any Area with an added Area is outdoors (which
     *       hasn't been shown to be incorrect yet).
     */
    public expandMapBoundariesForArea(area: IArea, dx: number, dy: number): void {
        this.EightBitter.MapScreener.variables.scrollability = Scrollability.Both;
    }
}
