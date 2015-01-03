FullScreenPokemon.prototype.settings.runner = {
    "upkeepScheduler": setTimeout,
    "upkeepCanceller": clearTimeout,
    "interval": 1000 / 60,
    "adjustFramerate": true,
    "games": [
        function () {
            this.PixelDrawer.refillQuadrantGroups(
                this.QuadsKeeper.getQuadrantRows(),
                this.MapsHandler.getArea().background
            );
        },
        function () {
            this.QuadsKeeper.determineAllQuadrants("Terrain", this.GroupHolder.getTerrainGroup());
            this.QuadsKeeper.determineAllQuadrants("Scenery", this.GroupHolder.getSceneryGroup());
            this.QuadsKeeper.determineAllQuadrants("Solid", this.GroupHolder.getSolidGroup());
        },
        function () {
            this.maintainCharacters(this, this.GroupHolder.getCharacterGroup());
        },
        function () {
            this.TimeHandler.handleEvents();
        }
    ]
}