FullScreenPokemon.FullScreenPokemon.settings.runner = {
    "interval": 1000 / 60,
    "adjustFramerate": true,
    "games": [
        function () {
            this.PixelDrawer.refillGlobalCanvas(
                this.AreaSpawner.getArea().background
            );
        },
        function () {
            this.QuadsKeeper.determineAllQuadrants("Terrain", this.GroupHolder.getTerrainGroup());
            this.QuadsKeeper.determineAllQuadrants("Scenery", this.GroupHolder.getSceneryGroup());
            this.QuadsKeeper.determineAllQuadrants("Solid", this.GroupHolder.getSolidGroup());
        },
        function () {
            this.maintainGeneric(this.GroupHolder.getTextGroup());
        },
        function () {
            this.maintainGeneric(this.GroupHolder.getTerrainGroup());
        },
        function () {
            this.maintainGeneric(this.GroupHolder.getSceneryGroup());
        },
        function () {
            this.maintainGeneric(this.GroupHolder.getSolidGroup());
        },
        function () {
            this.maintainCharacters(this.GroupHolder.getCharacterGroup());
        },
        function () {
            this.maintainPlayer(this.player)
        },
        function () {
            this.TimeHandler.handleEvents();
        }
    ]
}