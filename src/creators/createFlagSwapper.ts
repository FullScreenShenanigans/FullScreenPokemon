import { FlagSwappr } from "flagswappr";

/**
 * Generation-specific flags.
 */
export interface IFlags {
    /**
     * Whether HM moves can be activated by pressing the A key.
     */
    readonly keyActivatedHmMoves: boolean;

    /**
     * Whether Pokemon are able to hold items.
     */
    readonly heldItems: boolean;
}

export const createFlagSwapper = (): FlagSwappr<IFlags> =>
    new FlagSwappr({
        generation: "I",
        generations: {
            I: {
                keyActivatedHmMoves: false,
                heldItems: false,
            },
            II: {
                keyActivatedHmMoves: true,
                heldItems: true,
            },
        },
    });
