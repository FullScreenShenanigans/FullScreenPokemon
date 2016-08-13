require("gulp-shenanigans").initialize({
    dependencies: [
        "ChangeLinr",
        "StringFilr",
        "MapScreenr",
        "ItemsHoldr",
        "BattleMovr",
        "DeviceLayr",
        "EightBittr",
        "AudioPlayr",
        "FPSAnalyzr",
        "GamesRunnr",
        "GroupHoldr",
        "InputWritr",
        "LevelEditr",
        "MapsCreatr",
        "MathDecidr",
        "ModAttachr",
        "NumberMakr",
        "ObjectMakr",
        "QuadsKeepr",
        "AreaSpawnr",
        "PixelDrawr",
        "PixelRendr",
        "ScenePlayr",
        "StateHoldr",
        "ThingHittr",
        "TimeHandlr",
        "TouchPassr",
        "WorldSeedr",
        "GameStartr",
        "MenuGraphr",
        "UserWrappr",
    ],
    externals: [
        {
            file: "node_modules/js-beautify/js/lib/beautify",
            typing: "js-beautify"
        }
    ],
    gulp: require("gulp"),
    packageName: "FullScreenPokemon",
    taskGroups: {
        lib: true,
        src: true,
        test: true,
        web: true
    }
});
