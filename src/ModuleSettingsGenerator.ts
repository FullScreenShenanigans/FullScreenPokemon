import { IModuleSettings } from "./IFullScreenPokemon";
import { GenerateAudioSettings } from "./Settings/Audio";
import { GenerateBattlesSettings } from "./Settings/Battles";
import { GenerateCollisionsSettings } from "./Settings/Collisions";
import { GenerateDevicesSettings } from "./Settings/Devices";
import { GenerateEditorSettings } from "./Settings/Editor";
import { GenerateEventsSettings } from "./Settings/Events";
import { GenerateGeneratorSettings } from "./Settings/Generator";
import { GenerateGroupsSettings } from "./Settings/Groups";
import { GenerateInputSettings } from "./Settings/Input";
import { GenerateItemsSettings } from "./Settings/Items";
import { GenerateMapsSettings } from "./Settings/Maps";
import { GenerateMathSettings } from "./Settings/Math";
import { GenerateMenusSettings } from "./Settings/Menus";
import { GenerateModsSettings } from "./Settings/Mods";
import { GenerateObjectsSettings } from "./Settings/Objects";
import { GenerateQuadrantsSettings } from "./Settings/Quadrants";
import { GenerateRendererSettings } from "./Settings/Renderer";
import { GenerateRunnerSettings } from "./Settings/Runner";
import { GenerateScenesSettings } from "./Settings/Scenes";
import { GenerateSpritesSettings } from "./Settings/Sprites";
import { GenerateStateSettings } from "./Settings/State";
import { GenerateUISettings } from "./Settings/Ui";

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
            editor: GenerateEditorSettings(),
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
