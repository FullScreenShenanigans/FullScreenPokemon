/// <reference path="../typings/EightBittr.d.ts" />

import { FullScreenPokemon } from "./FullScreenPokemon";
import {
    IArea, IItemSchema, IMap, IPlayer, IPokemon, IRod, IWildPokemonSchema
} from "./IFullScreenPokemon";

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
            this.EightBitter.menus.cannotDoThat(player);
            return;
        }

        let rod: IRod = item as IRod;

        this.EightBitter.MenuGrapher.createMenu("GeneralText", {
            "deleteOnFinish": true,
            "ignoreA": true,
            "ignoreB": true
        });
        this.EightBitter.MenuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%PLAYER%%%%%%% used " + rod.title + "!"
            ]);
        this.EightBitter.MenuGrapher.setActiveMenu("GeneralText");

        this.EightBitter.physics.setWidth(player, 7, true, true);
        this.EightBitter.graphics.addClass(player, "fishing");

        this.EightBitter.TimeHandler.addEvent(
            function (): void {
                if (!this.EightBitter.MathDecider.compute("canLandFish", player)) {
                    this.EightBitter.playerFailedLandingFish(player);
                    return;
                }

                this.EightBitter.animateExclamation(player);
                this.EightBitter.playerLandedFish(player, rod);
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
        let currentMap: IMap = <IMap>this.EightBitter.AreaSpawner.getMap(player.mapName),
            currentArea: IArea = <IArea>currentMap.areas[player.bordering[player.direction].areaName],
            options: IWildPokemonSchema[] = (currentArea.wildPokemon.fishing as any)[rod.type],
            chosen: IWildPokemonSchema = this.EightBitter.battles.chooseRandomWildPokemon(options),
            chosenPokemon: IPokemon = this.EightBitter.utilities.createPokemon(chosen);

        this.EightBitter.TimeHandler.addEvent(
            function (): void {
                this.EightBitter.MenuGrapher.createMenu("GeneralText", {
                    "deleteOnFinish": true
                });
                this.EightBitter.MenuGrapher.addMenuDialog(
                    "GeneralText",
                    [
                        "Oh! \n It's a bite!"
                    ],
                    function (): void {
                        this.EightBitter.startBattle({
                            "opponent": {
                                "name": chosenPokemon.title,
                                "actors": [chosenPokemon],
                                "category": "Wild",
                                "sprite": chosenPokemon.title.join("") + "Front"
                            }
                        });
                    });
                this.EightBitter.MenuGrapher.setActiveMenu("GeneralText");
                this.EightBitter.removeClass(player, "fishing");
                this.EightBitter.setWidth(player, 8, true, true);
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
        this.EightBitter.MenuGrapher.deleteActiveMenu();
        this.EightBitter.menus.displayMessage(player, "rekt");
        this.EightBitter.graphics.removeClass(player, "fishing");
        this.EightBitter.physics.setWidth(player, 8, true, true);
    }
}
