import { IModuleSettings } from "./IFullScreenPokemon";
import { GenerateAudioSettings } from "./settings/Audio";
import { GenerateBattlesSettings } from "./settings/Battles";
import { GenerateCollisionsSettings } from "./settings/Collisions";
import { GenerateDevicesSettings } from "./settings/Devices";
import { GenerateEventsSettings } from "./settings/Events";
import { GenerateGeneratorSettings } from "./settings/Generator";
import { GenerateGroupsSettings } from "./settings/Groups";
import { GenerateInputSettings } from "./settings/Input";
import { GenerateItemsSettings } from "./settings/Items";
import { GenerateMapsSettings } from "./settings/Maps";
import { GenerateMathSettings } from "./settings/Math";
import { GenerateMenusSettings } from "./settings/Menus";
import { GenerateModsSettings } from "./settings/Mods";
import { GenerateObjectsSettings } from "./settings/Objects";
import { GenerateQuadrantsSettings } from "./settings/Quadrants";
import { GenerateRendererSettings } from "./settings/Renderer";
import { GenerateRunnerSettings } from "./settings/Runner";
import { GenerateScenesSettings } from "./settings/Scenes";
import { GenerateSpritesSettings } from "./settings/Sprites";
import { GenerateStateSettings } from "./settings/State";
import { GenerateUISettings } from "./settings/Ui";

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
            math: GenerateMathSettings(),
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
