require("gulp-shenanigans").initialize({
    dependencies: [
        "AreaSpawnr",
        "AudioPlayr",
        "BattleMovr",
        "DeviceLayr",
        "EightBittr",
        "FPSAnalyzr",
        "GamesRunnr",
        "GameStartr",
        "GroupHoldr",
        "InputWritr",
        "ItemsHoldr",
        "LevelEditr",
        "MapsCreatr",
        "MathDecidr",
        "ModAttachr",
        "MenuGraphr",
        "NumberMakr",
        "ObjectMakr",
        "PixelDrawr",
        "PixelRendr",
        "QuadsKeepr",
        "ScenePlayr",
        "StateHoldr",
        "ThingHittr",
        "TimeHandlr",
        "TouchPassr",
        "UserWrappr",
        "WorldSeedr"
    ],
    externals: [
        {
            file: "node_modules/js-beautify/js/bin/js-beautify",
            typing: "js-beautify"
        }
    ],
    gulp: require("gulp"),
    packageName: "FullScreenPokemon"
});
