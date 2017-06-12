import { IFlagSwapprSettings } from "flagswappr/lib/IFlagSwappr";

import { FullScreenPokemon } from "../FullScreenPokemon";

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
 * @param _fsp   A generating FullScreenPokemon instance.
 * @returns Flag settings for the FullScreenPokemon instance.
 */
export function GenerateFlagsSettings(_fsp: FullScreenPokemon): IFlagsModuleSettings {
    "use strict";

    return {
        generations: {
            I: {
                keyActivatedHmMoves: false,
                heldItems: false
            },
            II: {
                keyActivatedHmMoves: true,
                heldItems: true
            }
        },
        generation: "I"
    };
}
