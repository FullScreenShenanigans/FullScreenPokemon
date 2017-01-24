import * as igamestartr from "gamestartr/lib/IGameStartr";

import { FullScreenPokemon } from "../FullScreenPokemon";
import { GenerateAudioSettings } from "./Audio";
import { GenerateBattlesSettings, IBattlesModuleSettings } from "./Battles";
import { GenerateCollisionsSettings } from "./Collisions";
import { GenerateEventsSettings } from "./Events";
import { GenerateGeneratorSettings } from "./Generator";
import { GenerateGroupsSettings } from "./Groups";
import { GenerateInputSettings } from "./Input";
import { GenerateItemsSettings } from "./Items";
import { GenerateMapsSettings, IMapsModuleSettings } from "./Maps";
import { GenerateMenusSettings, IMenusModuleSettings } from "./Menus";
import { GenerateModsSettings } from "./Mods";
import { GenerateObjectsSettings } from "./Objects";
import { GenerateQuadrantsSettings } from "./Quadrants";
import { GenerateRendererSettings } from "./Renderer";
import { GenerateRunnerSettings } from "./Runner";
import { GenerateScenesSettings } from "./Scenes";
import { GenerateSpritesSettings } from "./Sprites";
import { GenerateStateSettings, IStateModuleSettings } from "./State";
import { GenerateUISettings, IUserWrapprSettings } from "./Ui";

/**
 * Stored settings to generate modules.
 */
export interface IModuleSettings extends igamestartr.IModuleSettings {
    /**
     * Settings regarding in-game battles, particularly for an IBattleMovr.
     */
    battles: IBattlesModuleSettings;

    /**
     * Settings regarding maps, particularly for an IAreaSpawnr, an
     * IMapScreenr, and an IMapsCreatr.
     */
    maps: IMapsModuleSettings;

    /**
     * Settings regarding a menu system, particularly for an IMenuGraphr.
     */
    menus: IMenusModuleSettings;

    /**
     * Settings regarding large-scale state storage, particularly for an IStateHoldr.
     */
    state: IStateModuleSettings;

    /**
     * Settings regarding front-facing UI.
     */
    ui: IUserWrapprSettings;
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
        const settings: Partial<IModuleSettings> = {
            audio: GenerateAudioSettings(fsp),
            collisions: GenerateCollisionsSettings(fsp),
            devices: {},
            events: GenerateEventsSettings(fsp),
            generator: GenerateGeneratorSettings(fsp),
            groups: GenerateGroupsSettings(fsp),
            input: GenerateInputSettings(fsp),
            items: GenerateItemsSettings(fsp),
            maps: GenerateMapsSettings(fsp),
            menus: GenerateMenusSettings(fsp),
            mods: GenerateModsSettings(fsp),
            objects: GenerateObjectsSettings(fsp),
            quadrants: GenerateQuadrantsSettings(fsp),
            renderer: GenerateRendererSettings(fsp),
            runner: GenerateRunnerSettings(fsp),
            sprites: GenerateSpritesSettings(fsp),
            state: GenerateStateSettings(fsp),
            touch: {},
            ui: GenerateUISettings(fsp)
        };

        this.registerLazy(settings, "battles", () => GenerateBattlesSettings(fsp));
        this.registerLazy(settings, "scenes", () => GenerateScenesSettings(fsp));

        return settings as IModuleSettings;
    }

    /**
     * Registers a lazily instantiated module setting.
     * 
     * @type TValue   Type of the module setting.
     * @type TKey   Key of the module setting under this.
     * @param key   Key of the module setting under this.
     * @param generator   Generates the module setting when required.
     */
    protected registerLazy<TSettings, TValue, TKey extends keyof TSettings>(settings: TSettings, key: TKey, generator: () => TValue): void {
        let value: TValue;

        Object.defineProperty(settings, key, {
            get: (): TValue => {
                if (!value) {
                    value = generator();
                }

                return value;
            }
        });
    }
}
