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
                this.pixelDrawer.refillGlobalCanvas();
            },
            function (this: FullScreenPokemon): void {
                this.quadsKeeper.determineAllQuadrants("Terrain", this.groupHolder.getGroup("Terrain") as IThing[]);
                this.quadsKeeper.determineAllQuadrants("Scenery", this.groupHolder.getGroup("Scenery") as IThing[]);
                this.quadsKeeper.determineAllQuadrants("Solid", this.groupHolder.getGroup("Solid") as IThing[]);
            },
            function (this: FullScreenPokemon): void {
                this.maintenance.maintainGeneric(this.groupHolder.getGroup("Text") as IThing[]);
            },
            function (this: FullScreenPokemon): void {
                this.maintenance.maintainGeneric(this.groupHolder.getGroup("Terrain") as IThing[]);
            },
            function (this: FullScreenPokemon): void {
                this.maintenance.maintainGeneric(this.groupHolder.getGroup("Scenery") as IThing[]);
            },
            function (this: FullScreenPokemon): void {
                this.maintenance.maintainGeneric(this.groupHolder.getGroup("Solid") as IThing[]);
            },
            function (this: FullScreenPokemon): void {
                this.maintenance.maintainCharacters(this.groupHolder.getGroup("Character") as ICharacter[]);
            },
            function (this: FullScreenPokemon): void {
                this.maintenance.maintainPlayer(this.players[0]);
            },
            function (this: FullScreenPokemon): void {
                this.timeHandler.handleEvents();
            }
        ]
    };
}
