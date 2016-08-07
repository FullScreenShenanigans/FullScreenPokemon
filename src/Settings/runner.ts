import { FullScreenPokemon } from "../FullScreenPokemon";

export function GenerateRunnerSettings(): void {
    "use strict";

    FullScreenPokemon.prototype.settings.runner = {
        interval: 1000 / 60,
        adjustFramerate: true,
        games: [
            function (): void {
                this.PixelDrawer.refillGlobalCanvas(
                    this.AreaSpawner.getArea().background
                );
            },
            function (): void {
                this.QuadsKeeper.determineAllQuadrants("Terrain", this.GroupHolder.getGroup("Terrain"));
                this.QuadsKeeper.determineAllQuadrants("Scenery", this.GroupHolder.getGroup("Scenery"));
                this.QuadsKeeper.determineAllQuadrants("Solid", this.GroupHolder.getGroup("Solid"));
            },
            function (): void {
                this.maintenance.maintainGeneric(this.GroupHolder.getGroup("Text"));
            },
            function (): void {
                this.maintenance.maintainGeneric(this.GroupHolder.getGroup("Terrain"));
            },
            function (): void {
                this.maintenance.maintainGeneric(this.GroupHolder.getGroup("Scenery"));
            },
            function (): void {
                this.maintenance.maintainGeneric(this.GroupHolder.getGroup("Solid"));
            },
            function (): void {
                this.maintenance.maintainCharacters(this.GroupHolder.getGroup("Character"));
            },
            function (): void {
                this.maintenance.maintainPlayer(this.player);
            },
            function (): void {
                this.TimeHandler.handleEvents();
            }
        ]
    };
};
