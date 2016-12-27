import { IModuleSettings } from "../IFullScreenPokemon";
import { GenerateAudioSettings } from "./Audio";
import { GenerateBattlesSettings } from "./Battles";
import { GenerateCollisionsSettings } from "./Collisions";
import { GenerateDevicesSettings } from "./Devices";
import { GenerateEventsSettings } from "./Events";
import { GenerateGeneratorSettings } from "./Generator";
import { GenerateGroupsSettings } from "./Groups";
import { GenerateInputSettings } from "./Input";
import { GenerateItemsSettings } from "./Items";
import { GenerateMapsSettings } from "./Maps";
import { GenerateMenusSettings } from "./Menus";
import { GenerateModsSettings } from "./Mods";
import { GenerateObjectsSettings } from "./Objects";
import { GenerateQuadrantsSettings } from "./Quadrants";
import { GenerateRendererSettings } from "./Renderer";
import { GenerateRunnerSettings } from "./Runner";
import { GenerateScenesSettings } from "./Scenes";
import { GenerateSpritesSettings } from "./Sprites";
import { GenerateStateSettings } from "./State";
import { GenerateUISettings } from "./Ui";

/**
 * Generator for FullScreenPokemon settings.
 */
export class ModuleSettingsGenerator {
    /**
     * @returns FullScreenPokemon settings.
     */
    public generate(): IModuleSettings {
        return {
            audio: GenerateAudioSettings(),
            battles: GenerateBattlesSettings(),
            collisions: GenerateCollisionsSettings(),
            devices: GenerateDevicesSettings(),
            events: GenerateEventsSettings(),
            generator: GenerateGeneratorSettings(),
            groups: GenerateGroupsSettings(),
            input: GenerateInputSettings(),
            items: GenerateItemsSettings(),
            maps: GenerateMapsSettings(),
            menus: GenerateMenusSettings(),
            mods: GenerateModsSettings(),
            objects: GenerateObjectsSettings(),
            quadrants: GenerateQuadrantsSettings(),
            renderer: GenerateRendererSettings(),
            runner: GenerateRunnerSettings(),
            scenes: GenerateScenesSettings(),
            sprites: GenerateSpritesSettings(),
            state: GenerateStateSettings(),
            touch: {},
            ui: GenerateUISettings()
        };
    }
}
