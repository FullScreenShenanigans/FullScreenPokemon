var FSP, Uint8ClampedArray;

/**
 * A shim for non ES5 supporting browsers, like PhantomJS. Lovingly inspired by:
 * http://www.angrycoding.com/2011/09/to-bind-or-not-to-bind-that-is-in.html
 * (copied from grunt-mocha-phantomjs)
 */
if (!("bind" in Function.prototype)) {
    Function.prototype.bind = function () {
        var funcObj = this,
            extraArgs = Array.prototype.slice.call(arguments),
            thisObj = extraArgs.shift();

        return function () {
            return funcObj.apply(thisObj, extraArgs.concat(Array.prototype.slice.call(arguments)));
        };
    };
}

describe("constructor", function () {
    it("runs with a small screen size", function () {
        FSP = new FullScreenPokemon.FullScreenPokemon({
            "width": 512,
            "height": 464
        });

        Uint8ClampedArray = FSP.PixelRender.Uint8ClampedArray;
    });

    it("runs with a large screen size", function () {
        FSP = new FullScreenPokemon.FullScreenPokemon({
            "width": 2048,
            "height": 1152
        });

        if (typeof Uint8ClampedArray === "undefined") {
            Uint8ClampedArray = FSP.PixelRender.Uint8ClampedArray;
        }
    });

    it("runs with a tiny screen size", function () {
        FSP = new FullScreenPokemon.FullScreenPokemon({
            "width": 320,
            "height": 288
        });
    });
});

describe("maps", function () {
    var maps = FullScreenPokemon.FullScreenPokemon.settings.maps.library,
        map, i, j;

    for (i in maps) {
        map = maps[i];

        describe(map.name, function (map) {
            for (j in map.locations) {
                it("location " + j, function (j) {
                    FSP.setMap(map.name, j);
                }.bind(this, j));
            }
        }.bind(this, map));
    }
});

describe("mods", function () {
    var mods = FullScreenPokemon.FullScreenPokemon.settings.mods.mods,
        mod, i;

    describe("enable", function () {
        for (i = 0; i < mods.length; i += 1) {
            mod = mods[i];

            it(mod.name, function (name) {
                FSP.ModAttacher.enableMod(name);
            }.bind(this, mod.name));
        }
    });

    describe("disable", function () {
        for (i = 0; i < mods.length; i += 1) {
            mod = mods[i];

            it(mod.name, function (name) {
                FSP.ModAttacher.disableMod(name);
            }.bind(this, mod.name));
        }
    });
});
