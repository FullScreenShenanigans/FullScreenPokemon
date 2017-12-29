import { IBattleMovrSettings } from "battlemovr";
import { IFlagSwapprSettings } from "flagswappr";
import { IModuleSettings as IGameStartrModuleSettings } from "gamestartr";
import { IMenuGraphrSettings } from "menugraphr";
import { IStateHoldrSettings } from "stateholdr";

import { FullScreenPokemon } from "../FullScreenPokemon";
import { GenerateAudioSettings } from "./Audio";
import { GenerateBattlesSettings } from "./Battles";
import { GenerateCollisionsSettings } from "./Collisions";
import { GenerateEventsSettings } from "./Events";
import { GenerateFlagsSettings, IFlags } from "./Flags";
import { GenerateGroupsSettings } from "./Groups";
import { GenerateInputSettings } from "./Input";
import { GenerateItemsSettings } from "./Items";
import { GenerateMapsSettings, IMapsModuleSettings } from "./Maps";
import { GenerateMenusSettings } from "./Menus";
import { GenerateModsSettings } from "./Mods";
import { GenerateObjectsSettings } from "./Objects";
import { GenerateQuadrantsSettings } from "./Quadrants";
import { GenerateRendererSettings } from "./Renderer";
import { GenerateRunnerSettings } from "./Runner";
import { GenerateScenesSettings } from "./Scenes";
import { GenerateSpritesSettings } from "./Sprites";
import { GenerateStateSettings } from "./State";

/**
 * Stored settings to generate modules.
 */
export interface IModuleSettings extends IGameStartrModuleSettings {
    /**
     * Settings regarding in-game battles, particularly for an IBattleMovr.
     */
    battles: IBattleMovrSettings;

    /**
     * Settings regarding generation-specific flags, particularly for an IFlagSwappr.
     */
    flags: IFlagSwapprSettings<IFlags>;

    /**
     * Settings regarding maps, particularly for an IAreaSpawnr, an
     * IMapsCreatr, and an IMapScreenr.
     */
    maps: IMapsModuleSettings;

    /**
     * Settings regarding a menu system, particularly for an IMenuGraphr.
     */
    menus: Partial<IMenuGraphrSettings>;

    /**
     * Settings regarding large-scale state storage, particularly for an IStateHoldr.
     */
    state: Partial<IStateHoldrSettings>;
}

/**
 * Generator for FullScreenPokemon settings.
 */
export class ModuleSettingsGenerator {
    /**
     * @param fsp   A generating FullScreenPokemon instance.
     * @returns Settings for the FullScreenPokemon instance.
     */
    public generate(fsp: FullScreenPokemon): IModuleSettings {
        return {
            audio: GenerateAudioSettings(),
            battles: GenerateBattlesSettings(fsp),
            collisions: GenerateCollisionsSettings(fsp),
            devices: {},
            events: GenerateEventsSettings(),
            flags: GenerateFlagsSettings(),
            groups: GenerateGroupsSettings(),
            input: GenerateInputSettings(fsp),
            items: GenerateItemsSettings(),
            maps: GenerateMapsSettings(fsp),
            menus: GenerateMenusSettings(fsp),
            mods: GenerateModsSettings(fsp),
            objects: GenerateObjectsSettings(fsp),
            quadrants: GenerateQuadrantsSettings(),
            renderer: GenerateRendererSettings(fsp),
            runner: GenerateRunnerSettings(fsp),
            scenes: GenerateScenesSettings(fsp),
            sprites: GenerateSpritesSettings(),
            state: GenerateStateSettings(),
            touch: {},
        };
    }
}
