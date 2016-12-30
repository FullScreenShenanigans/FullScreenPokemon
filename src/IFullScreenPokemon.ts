import * as igamestartr from "gamestartr/lib/IGameStartr";
import { IModuleSettings } from "./settings/ModuleSettings";

/**
 * Settings to initialize a new instance of the FullScreenPokemon class.
 */
export interface ISettings extends igamestartr.ISizeSettings {
    /**
     * Module settings passed to individual create* members.
     */
    moduleSettings?: Partial<IModuleSettings>;
}

/**
 * FullScreenPokemon initialization settings with filled out, finite sizes.
 */
export interface IProcessedSettings extends igamestartr.IProcessedSizeSettings {
    /**
     * Module settings passed to individual create* members.
     */
    moduleSettings?: Partial<IModuleSettings>;
}
