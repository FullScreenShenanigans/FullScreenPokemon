import { IRunnerModuleSettings } from "gamestartr/lib/IGameStartr";

import { FullScreenPokemon } from "../FullScreenPokemon";
import { ICharacter, IThing } from "../IFullScreenPokemon";

export function GenerateRunnerSettings(): IRunnerModuleSettings {
    "use strict";

    return {
        interval: 1000 / 60,
        adjustFramerate: true,
        games: [
            function (this: FullScreenPokemon): void {
                this.PixelDrawer.refillGlobalCanvas();
            },
            function (this: FullScreenPokemon): void {
                this.QuadsKeeper.determineAllQuadrants("Terrain", this.GroupHolder.getGroup("Terrain") as IThing[]);
                this.QuadsKeeper.determineAllQuadrants("Scenery", this.GroupHolder.getGroup("Scenery") as IThing[]);
                this.QuadsKeeper.determineAllQuadrants("Solid", this.GroupHolder.getGroup("Solid") as IThing[]);
            },
            function (this: FullScreenPokemon): void {
                this.maintenance.maintainGeneric(this.GroupHolder.getGroup("Text") as IThing[]);
            },
            function (this: FullScreenPokemon): void {
                this.maintenance.maintainGeneric(this.GroupHolder.getGroup("Terrain") as IThing[]);
            },
            function (this: FullScreenPokemon): void {
                this.maintenance.maintainGeneric(this.GroupHolder.getGroup("Scenery") as IThing[]);
            },
            function (this: FullScreenPokemon): void {
                this.maintenance.maintainGeneric(this.GroupHolder.getGroup("Solid") as IThing[]);
            },
            function (this: FullScreenPokemon): void {
                this.maintenance.maintainCharacters(this.GroupHolder.getGroup("Character") as ICharacter[]);
            },
            function (this: FullScreenPokemon): void {
                this.maintenance.maintainPlayer(this.player);
            },
            function (this: FullScreenPokemon): void {
                this.TimeHandler.handleEvents();
            }
        ]
    };
}
