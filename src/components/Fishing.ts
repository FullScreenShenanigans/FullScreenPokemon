import {
    IArea, IItemSchema, IMap, IPlayer, IPokemon, IRod, IWildPokemonSchema
} from "./IFullScreenPokemon";

/**
 * Fishing functions used by FullScreenPokemon instances.
 */
export class Fishing {
    /**
     * Starts the Player fishing.
     *
     * @param player   A Player to start fishing.
     * @param rod   The rod that will be used to fish.
     */
    public startFishing(player: IPlayer, item: IItemSchema): void {
        if (player.bordering[player.direction] === undefined ||
            player.bordering[player.direction]!.title.indexOf("WaterEdge") === -1) {
            this.menus.cannotDoThat(player);
            return;
        }

        const rod: IRod = item as IRod;

        this.menuGrapher.createMenu("GeneralText", {
            deleteOnFinish: true,
            ignoreA: true,
            ignoreB: true
        });
        this.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%PLAYER%%%%%%% used " + rod.title + "!"
            ]);
        this.menuGrapher.setActiveMenu("GeneralText");

        this.physics.setWidth(player, 7, true, true);
        this.graphics.addClass(player, "fishing");

        this.timeHandler.addEvent(
            (): void => {
                if (!this.mathDecider.compute("canLandFish", player)) {
                    this.fishing.playerFailedLandingFish(player);
                    return;
                }

                this.animations.animateExclamation(player);
                this.fishing.playerLandedFish(player, rod);
            },
            180
        );
    }

    /**
     * Displays message and starts battle when player lands a fish.
     *
     * @param player   A Player who landed the fish.
     * @param rod   The rod that will be used to fish.
     */
    public playerLandedFish(player: IPlayer, rod: IRod): void {
        const currentMap: IMap = this.areaSpawner.getMap(player.mapName) as IMap;
        const currentArea: IArea = currentMap.areas[player.bordering[player.direction]!.areaName] as IArea;
        const options: IWildPokemonSchema[] = (currentArea.wildPokemon.fishing as any)[rod.type];
        const chosen: IWildPokemonSchema = this.battles.chooseRandomWildPokemon(options);
        const chosenPokemon: IPokemon = this.utilities.createPokemon(chosen);

        this.timeHandler.addEvent(
            (): void => {
                this.menuGrapher.createMenu("GeneralText", {
                    deleteOnFinish: true
                });
                this.menuGrapher.addMenuDialog(
                    "GeneralText",
                    [
                        "Oh! \n It's a bite!"
                    ],
                    (): void => {
                        this.battles.startBattle({
                            battlers: {
                                opponent: {
                                    name: chosenPokemon.title,
                                    actors: [chosenPokemon],
                                    category: "Wild",
                                    sprite: chosenPokemon.title.join("") + "Front"
                                }
                            }
                        });
                    });
                this.menuGrapher.setActiveMenu("GeneralText");
                this.graphics.removeClass(player, "fishing");
                this.physics.setWidth(player, 8, true, true);
            },
            140
        );
    }

    /**
     * Displays message when a Player does not land a fish.
     *
     * @param player   A Player who does not land a fish.
     */
    public playerFailedLandingFish(player: IPlayer): void {
        this.menuGrapher.deleteActiveMenu();
        this.menus.displayMessage(player, "rekt");
        this.graphics.removeClass(player, "fishing");
        this.physics.setWidth(player, 8, true, true);
    }
}
