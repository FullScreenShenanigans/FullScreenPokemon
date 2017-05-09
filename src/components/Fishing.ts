import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../FullScreenPokemon";
import { IPokemon } from "./Battles";
import { IItemSchema, IRod } from "./constants/Items";
import { IArea, IMap, IWildPokemonSchema } from "./Maps";
import { IPlayer } from "./Things";

/**
 * Fishing functions used by FullScreenPokemon instances.
 */
export class Fishing<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
    /**
     * Starts the Player fishing.
     *
     * @param player   A Player to start fishing.
     * @param rod   The rod that will be used to fish.
     */
    public startFishing(player: IPlayer, item: IItemSchema): void {
        if (player.bordering[player.direction] === undefined ||
            player.bordering[player.direction]!.title.indexOf("WaterEdge") === -1) {
            this.gameStarter.menus.cannotDoThat();
            return;
        }

        const rod: IRod = item as IRod;

        this.gameStarter.menuGrapher.createMenu("GeneralText", {
            deleteOnFinish: true,
            ignoreA: true,
            ignoreB: true
        });
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%PLAYER%%%%%%% used " + rod.title + "!"
            ]);
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");

        this.gameStarter.physics.setWidth(player, 7, true);
        this.gameStarter.graphics.addClass(player, "fishing");

        this.gameStarter.timeHandler.addEvent(
            (): void => {
                if (!this.canLandFish()) {
                    this.gameStarter.fishing.playerFailedLandingFish(player);
                    return;
                }

                this.gameStarter.actions.animateExclamation(player);
                this.gameStarter.fishing.playerLandedFish(player, rod);
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
        const currentMap: IMap = this.gameStarter.areaSpawner.getMap(player.mapName) as IMap;
        const currentArea: IArea = currentMap.areas[player.bordering[player.direction]!.areaName];
        const options: IWildPokemonSchema[] = (currentArea.wildPokemon.fishing as any)[rod.type];
        const chosen: IWildPokemonSchema = this.gameStarter.equations.chooseRandomWildPokemon(options);
        const chosenPokemon: IPokemon = this.gameStarter.utilities.createPokemon(chosen);

        this.gameStarter.timeHandler.addEvent(
            (): void => {
                this.gameStarter.menuGrapher.createMenu("GeneralText", {
                    deleteOnFinish: true
                });
                this.gameStarter.menuGrapher.addMenuDialog(
                    "GeneralText",
                    [
                        "Oh! \n It's a bite!"
                    ],
                    (): void => {
                        console.log("Should start battle with", chosenPokemon);
                        // this.gameStarter.battles.startBattle({
                        //     battlers: {
                        //         opponent: {
                        //             name: chosenPokemon.title,
                        //             actors: [chosenPokemon],
                        //             category: "Wild",
                        //             sprite: chosenPokemon.title.join("") + "Front"
                        //         }
                        //     }
                        // });
                    });
                this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
                this.gameStarter.graphics.removeClass(player, "fishing");
                this.gameStarter.physics.setWidth(player, 8, true);
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
        this.gameStarter.menuGrapher.deleteActiveMenu();
        this.gameStarter.menus.displayMessage("rekt");
        this.gameStarter.graphics.removeClass(player, "fishing");
        this.gameStarter.physics.setWidth(player, 8, true);
    }

    /**
     * @todo Add functionality.
     */
    public canLandFish(): boolean {
        return true;
    }
}
