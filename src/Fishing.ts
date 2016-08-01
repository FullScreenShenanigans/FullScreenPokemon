/// <reference path="../typings/EightBittr.d.ts" />

import { FullScreenPokemon } from "./FullScreenPokemon";
import { IItemSchema, IRod, IPlayer, IThing } from "./IFullScreenPokemon";

/**
 * Fishing functions used by FullScreenPokemon instances.
 */
export class Fishing<TEightBittr extends FullScreenPokemon> extends EightBittr.Component<TEightBittr> {
    /**
     * Starts the Player fishing.
     *
     * @param player   A Player to start fishing.
     * @param rod   The rod that will be used to fish.
     */
    startFishing(player: IPlayer, item: IItemSchema): void {
        if (player.bordering[player.direction] === undefined ||
            player.bordering[player.direction].title.indexOf("WaterEdge") === -1) {
            player.FSP.cannotDoThat(player);
            return;
        }

        let rod: IRod = <IRod>item;

        player.FSP.MenuGrapher.createMenu("GeneralText", {
            "deleteOnFinish": true,
            "ignoreA": true,
            "ignoreB": true
        });
        player.FSP.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%PLAYER%%%%%%% used " + rod.title + "!"
            ]);
        player.FSP.MenuGrapher.setActiveMenu("GeneralText");

        player.FSP.setWidth(player, 7, true, true);
        player.FSP.addClass(player, "fishing");

        player.FSP.TimeHandler.addEvent(
            function (): void {
                if (!player.FSP.MathDecider.compute("canLandFish", player)) {
                    player.FSP.playerFailedLandingFish(player);
                    return;
                }

                player.FSP.animateExclamation(player);
                player.FSP.playerLandedFish(player, rod);
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
    playerLandedFish(player: IPlayer, rod: IRod): void {
        let currentMap: IMap = <IMap>player.FSP.AreaSpawner.getMap(player.mapName),
            currentArea: IArea = <IArea>currentMap.areas[player.bordering[player.direction].areaName],
            options: IWildPokemonSchema[] = currentArea.wildPokemon.fishing[rod.type],
            chosen: IWildPokemonSchema = player.FSP.chooseRandomWildPokemon(options),
            chosenPokemon: IPokemon = player.FSP.createPokemon(chosen);

        player.FSP.TimeHandler.addEvent(
            function (): void {
                player.FSP.MenuGrapher.createMenu("GeneralText", {
                    "deleteOnFinish": true
                });
                player.FSP.MenuGrapher.addMenuDialog(
                    "GeneralText",
                    [
                        "Oh! \n It's a bite!"
                    ],
                    function (): void {
                        player.FSP.startBattle({
                            "opponent": {
                                "name": chosenPokemon.title,
                                "actors": [chosenPokemon],
                                "category": "Wild",
                                "sprite": chosenPokemon.title.join("") + "Front"
                            }
                        });
                    });
                player.FSP.MenuGrapher.setActiveMenu("GeneralText");
                player.FSP.removeClass(player, "fishing");
                player.FSP.setWidth(player, 8, true, true);
            },
            140
        );
    }

    /**
     * Displays message when a Player does not land a fish.
     *
     * @param player   A Player who does not land a fish.
     */
    playerFailedLandingFish(player: IPlayer): void {
        player.FSP.MenuGrapher.deleteActiveMenu();
        this.displayMessage(player, "rekt");
        this.removeClass(player, "fishing");
        this.setWidth(player, 8, true, true);
    }
}
