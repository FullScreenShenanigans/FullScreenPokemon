import { IFeatureBoxrSettings } from "featureboxr/lib/IFeatureBoxr";

import { FullScreenPokemon } from "../FullScreenPokemon";

/**
 * Generation-specific features.
 */
export interface IFeatures {
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
 * Settings regarding generation-specific features, particularly for an IFeatureBoxr.
 */
export type IFeaturesModuleSettings = IFeatureBoxrSettings<IFeatures>;

/**
 * @param _fsp   A generating FullScreenPokemon instance.
 * @returns Feature settings for the FullScreenPokemon instance.
 */
export function GenerateFeaturesSettings(_fsp: FullScreenPokemon): IFeaturesModuleSettings {
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
