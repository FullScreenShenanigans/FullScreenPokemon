module FullScreenPokemon {
    "use strict";

    FullScreenPokemon.settings.mods = {
        storeLocally: true,
        prefix: "FullScreenPokemon::Mods::",
        mods: [
            {
                name: "Running Indoors",
                enabled: false,
                events: {
                    onModEnable: function (mod: ModAttachr.IModAttachrMod): void {
                        let area: IArea = this.AreaSpawner.getArea();
                        if (!area) {
                            return;
                        }

                        (<any>area).allowCyclingOld = area.allowCycling;
                        area.allowCycling = true;
                    },
                    onModDisable: function (mod: ModAttachr.IModAttachrMod): void {
                        let area: IArea = this.AreaSpawner.getArea();
                        if (!area) {
                            return;
                        }

                        area.allowCycling = (<any>area).allowCyclingOld;
                        delete (<any>area).allowCyclingOld;

                        if (!area.allowCycling && this.player.cycling) {
                            this.stopCycling(this.player);
                        }
                    },
                    onSetLocation: function (mod: ModAttachr.IModAttachrMod): void {
                        mod.events.onModEnable.call(this, mod);
                    }
                }
            },
            {
                name: "The Flash",
                enabled: false,
                events: {
                    onModEnable: function (mod: ModAttachr.IModAttachrMod): void {
                        let stats: any = this.ObjectMaker.getFunction("Player").prototype;
                        stats.speed = 10;
                    },
                    onModDisable: function (mod: ModAttachr.IModAttachrMod): void {
                        let stats: any = this.ObjectMaker.getFunction("Player").prototype;
                        stats.speed = this.settings.objects.properties.Player.speed;
                    }
                }
            }]
    };
}
