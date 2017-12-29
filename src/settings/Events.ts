import { ITimeHandlrSettings } from "timehandlr";

/**
 * @returns Event settings for the FullScreenPokemon instance.
 */
export const GenerateEventsSettings = (): Partial<ITimeHandlrSettings> => ({
    keyCycleCheckValidity: "alive",
    timingDefault: 9,
});
