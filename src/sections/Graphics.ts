import { member } from "babyioc";
import { Graphics as EightBittrGraphics } from "eightbittr";
import { IPalette } from "pixelrendr";

import { FullScreenPokemon } from "../FullScreenPokemon";

import { Collections } from "./graphics/Collections";
import { Flipping } from "./graphics/Flipping";
import { graphicsLibrary } from "./graphics/GraphicsLibrary";

/**
 * Changes the visual appearance of Things.
 */
export class Graphics<TEightBittr extends FullScreenPokemon> extends EightBittrGraphics<TEightBittr> {
    /**
     * What class name should indicate a Thing is to be flipped verticallu.
     */
    public readonly flipHoriz = "flipped";

    /**
     * What class name should indicate a Thing is to be flipped horizontally.
     */
    public readonly flipVert = "flip-vert";

    /**
     * A nested library of sprites to process.
     */
    public readonly library = graphicsLibrary;

    /**
     * The default palette of colors to use for sprites.
     */
    public readonly paletteDefault: IPalette = [
        [0, 0, 0, 0],
        [255, 255, 255, 255],
        [0, 0, 0, 255],
        [199, 199, 192, 255],
        [128, 128, 128, 255],
    ];

    /**
     * Amount to expand sprites by when processing.
     */
    public readonly scale = 2;

    /**
     * What key in attributions should contain sprite heights.
     */
    public readonly spriteHeight = "spriteheight";

    /**
     * What key in attributions should contain sprite widths.
     */
    public readonly spriteWidth = "spritewidth";

    /**
     * Maximum size of a SpriteMultiple to pre-render.
     */
    public readonly spriteCacheCutoff = 2048;

    /**
     * Collects Things to change visuals en masse.
     */
    @member(Collections)
    public readonly collections: Collections;

    /**
     * Collects Things to change visuals en masse.
     */
    @member(Flipping)
    public readonly flipping: Flipping;
}
