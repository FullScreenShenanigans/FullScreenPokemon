import { GenerateAudioSettings } from "Settings/Audio";
import { GenerateBattlesSettings } from "Settings/Battles";
import { GenerateCollisionsSettings } from "Settings/Collisions";
import { GenerateDevicesSettings } from "Settings/Devices";
import { GenerateEditorSettings } from "Settings/Editor";
import { GenerateEventsSettings } from "Settings/Events";
import { GenerateGeneratorSettings } from "Settings/Generator";
import { GenerateGroupsSettings } from "Settings/Groups";
import { GenerateInputSettings } from "Settings/Input";
import { GenerateItemsSettings } from "Settings/Items";
import { GenerateMapsSettings } from "Settings/Maps";
import { GenerateMathSettings } from "Settings/Math";
import { GenerateMenusSettings } from "Settings/Menus";
import { GenerateModsSettings } from "Settings/Mods";
import { GenerateObjectsSettings } from "Settings/Objects";
import { GenerateQuadrantsSettings } from "Settings/Quadrants";
import { GenerateRendererSettings } from "Settings/Renderer";
import { GenerateRunnerSettings } from "Settings/Runner";
import { GenerateScenesSettings } from "Settings/Scenes";
import { GenerateSpritesSettings } from "Settings/Sprites";
import { GenerateStateSettings } from "Settings/State";
import { GenerateUiSettings } from "Settings/Ui";

export class SettingsGenerator {
    public generate(): void {
        GenerateAudioSettings();
        GenerateBattlesSettings();
        GenerateCollisionsSettings();
        GenerateDevicesSettings();
        GenerateEditorSettings();
        GenerateEventsSettings();
        GenerateGeneratorSettings();
        GenerateGroupsSettings();
        GenerateInputSettings();
        GenerateItemsSettings();
        GenerateMapsSettings();
        GenerateMathSettings();
        GenerateMenusSettings();
        GenerateModsSettings();
        GenerateObjectsSettings();
        GenerateQuadrantsSettings();
        GenerateRendererSettings();
        GenerateRunnerSettings();
        GenerateScenesSettings();
        GenerateSpritesSettings();
        GenerateStateSettings();
        GenerateUiSettings();
    }
}
