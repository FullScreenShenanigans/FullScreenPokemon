import { FullScreenPokemon } from "../FullScreenPokemon";

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
            this.QuadsKeeper.determineAllQuadrants("Terrain", this.GroupHolder.getTerrainGroup());
            this.QuadsKeeper.determineAllQuadrants("Scenery", this.GroupHolder.getSceneryGroup());
            this.QuadsKeeper.determineAllQuadrants("Solid", this.GroupHolder.getSolidGroup());
        },
        function (): void {
            this.maintainGeneric(this.GroupHolder.getTextGroup());
        },
        function (): void {
            this.maintainGeneric(this.GroupHolder.getTerrainGroup());
        },
        function (): void {
            this.maintainGeneric(this.GroupHolder.getSceneryGroup());
        },
        function (): void {
            this.maintainGeneric(this.GroupHolder.getSolidGroup());
        },
        function (): void {
            this.maintainCharacters(this.GroupHolder.getCharacterGroup());
        },
        function (): void {
            this.maintainPlayer(this.player);
        },
        function (): void {
            this.TimeHandler.handleEvents();
        }
    ]
};
