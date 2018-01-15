import { GeneralComponent } from "gamestartr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { IMenuSchema } from "../Menus";

/**
 * Opens and animates displays on the Town Map menu.
 */
export class TownMap<TGameStartr extends FullScreenPokemon> extends GeneralComponent<TGameStartr> {
    /**
     * Locations of known cities on town maps.
     */
    private static readonly townMapLocations: { [i: string]: [number, number ] } = {
        "Pallet Town": [18, 48],
        "Pewter City": [18, 16],
        "Serebii Islands": [18, 64],
        "Viridian City": [18, 36],
    };

    /**
     * Opens the Town Map menu.
     *
     * @param settings   Custom attributes to apply to the menu.
     */
    public readonly open = (settings?: IMenuSchema): void => {
        const playerPosition: number[] = TownMap.townMapLocations["Pallet Town"];
        const playerSize: any = this.gameStarter.objectMaker.getPrototypeOf("Player");

        this.gameStarter.menuGrapher.createMenu("Town Map", settings);
        this.gameStarter.menuGrapher.createMenuThing("Town Map Inside", {
            type: "thing",
            thing: "Player",
            args: {
                nocollide: true,
            },
            position: {
                offset: {
                    left: playerPosition[0] - (playerSize.width / 2),
                    top: playerPosition[1] - (playerSize.height / 2),
                },
            },
        });
        this.gameStarter.menuGrapher.setActiveMenu("Town Map");
    }

    /**
     * Shows allowed flying locations on the Town Map menu.
     */
    public readonly showFlyLocations = (): void => {
        console.warn("Map fly locations not implemented.");
    }

    /**
     * Shows a Pokemon's nest locations on the Town Map menu.
     *
     * @param title   The title of the Pokemon to show nest locations of.
     */
    public readonly showPokemonLocations = (title: string[]): void => {
        const dialog: string[] = [].slice.call(title);

        dialog.push(..."'s NEST".split(""));

        this.gameStarter.menuGrapher.addMenuDialog("Town Map", [dialog]);

        console.warn("Pokemon map locations not implemented.");
    }
}
