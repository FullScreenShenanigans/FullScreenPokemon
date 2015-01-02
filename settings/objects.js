(function () {
    FullScreenPokemon.prototype.settings.objects = {
        "onMake": "onMake",
        "indexMap": ["width", "height"],
        "doPropertiesFull": true,
        "inheritance": {
            "Quadrant": {},
            "Map": {},
            "Area": {},
            "Location": {},
            "Thing": {
                "character": {},
                "solid": {},
                "scenery": {},
                "Text": {}
            }
        },
        "properties": {
            "Quadrant": {
                "tolx": 0,
                "toly": 0
            },
            "Map": {},
            "Area": {},
            "Location": {},
            "Thing": {}
        }
    };
})();