
/**
 * Settings regarding large-scale state storage, particularly for an IStateHoldr.
 */
export interface IStateModuleSettings {
    /**
     * A prefix to prepend keys for the itemsHolder.
     */
    prefix?: string;
}

/**
 * @returns State settings for a FullScreenPokemon instance.
 */
export const GenerateStateSettings = (): IStateModuleSettings => ({
    prefix: "StateHolder::",
});
