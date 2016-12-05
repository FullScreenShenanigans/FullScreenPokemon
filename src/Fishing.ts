import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "./FullScreenPokemon";
import {
    IArea, IItemSchema, IMap, IPlayer, IPokemon, IRod, IWildPokemonSchema
} from "./IFullScreenPokemon";

/**
 * Fishing functions used by FullScreenPokemon instances.
 */
export class Fishing<TEightBittr extends FullScreenPokemon> extends Component<TEightBittr> {
    /**
     * Starts the Player fishing.
     *
     * @param player   A Player to start fishing.
     * @param rod   The rod that will be used to fish.
     */
    public startFishing(player: IPlayer, item: IItemSchema): void {
        if (player.bordering[player.direction] === undefined ||
            player.bordering[player.direction]!.title.indexOf("WaterEdge") === -1) {
            this.eightBitter.menus.cannotDoThat(player);
            return;
        }

        const rod: IRod = item as IRod;

        this.eightBitter.MenuGrapher.createMenu("GeneralText", {
            deleteOnFinish: true,
            ignoreA: true,
            ignoreB: true
        });
        this.eightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%PLAYER%%%%%%% used " + rod.title + "!"
            ]);
        this.eightBitter.MenuGrapher.setActiveMenu("GeneralText");

        this.eightBitter.physics.setWidth(player, 7, true, true);
        this.eightBitter.graphics.addClass(player, "fishing");

        this.eightBitter.timeHandler.addEvent(
            (): void => {
                if (!this.eightBitter.mathDecider.compute("canLandFish", player)) {
                    this.eightBitter.fishing.playerFailedLandingFish(player);
                    return;
                }

                this.eightBitter.animations.animateExclamation(player);
                this.eightBitter.fishing.playerLandedFish(player, rod);
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
        const currentMap: IMap = this.eightBitter.areaSpawner.getMap(player.mapName) as IMap;
        const currentArea: IArea = currentMap.areas[player.bordering[player.direction]!.areaName] as IArea;
        const options: IWildPokemonSchema[] = (currentArea.wildPokemon.fishing as any)[rod.type];
        const chosen: IWildPokemonSchema = this.eightBitter.battles.chooseRandomWildPokemon(options);
        const chosenPokemon: IPokemon = this.eightBitter.utilities.createPokemon(chosen);

        this.eightBitter.timeHandler.addEvent(
            (): void => {
                this.eightBitter.MenuGrapher.createMenu("GeneralText", {
                    deleteOnFinish: true
                });
                this.eightBitter.MenuGrapher.addMenuDialog(
                    "GeneralText",
                    [
                        "Oh! \n It's a bite!"
                    ],
                    (): void => {
                        this.eightBitter.battles.startBattle({
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
                this.eightBitter.MenuGrapher.setActiveMenu("GeneralText");
                this.eightBitter.graphics.removeClass(player, "fishing");
                this.eightBitter.physics.setWidth(player, 8, true, true);
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
        this.eightBitter.MenuGrapher.deleteActiveMenu();
        this.eightBitter.menus.displayMessage(player, "rekt");
        this.eightBitter.graphics.removeClass(player, "fishing");
        this.eightBitter.physics.setWidth(player, 8, true, true);
    }
}
