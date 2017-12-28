import { IFlagSwapprSettings } from "flagswappr";

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

/**
 * Settings regarding generation-specific flags, particularly for an IFlagSwappr.
 */
export type IFlagsModuleSettings = IFlagSwapprSettings<IFlags>;

/**
 * @returns Flag settings for the FullScreenPokemon instance.
 */
export const GenerateFlagsSettings = (): IFlagsModuleSettings => ({
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
