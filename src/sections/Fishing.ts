import { Section } from "eightbittr";

import { FullScreenPokemon } from "../FullScreenPokemon";

import { IPokemon } from "./Battles";
import { IItemSchema, IRod } from "./constants/Items";
import { IArea, IMap, IWildPokemonSchema } from "./Maps";
import { IPlayer } from "./Things";

/**
 * Runs the player trying to fish for Pokemon.
 */
export class Fishing extends Section<FullScreenPokemon> {
    /**
     * Starts the Player fishing.
     *
     * @param player   A Player to start fishing.
     * @param rod   The rod that will be used to fish.
     */
    public startFishing(player: IPlayer, item: IItemSchema): void {
        if (
            player.bordering[player.direction] === undefined ||
            player.bordering[player.direction]!.title.indexOf("WaterEdge") === -1
        ) {
            this.game.menus.cannotDoThat();
            return;
        }

        const rod: IRod = item as IRod;

        this.game.menuGrapher.createMenu("GeneralText", {
            deleteOnFinish: true,
            ignoreA: true,
            ignoreB: true,
        });
        this.game.menuGrapher.addMenuDialog("GeneralText", [
            "%%%%%%%PLAYER%%%%%%% used " + rod.title + "!",
        ]);
        this.game.menuGrapher.setActiveMenu("GeneralText");

        this.game.physics.setWidth(player, 7, true);
        this.game.graphics.classes.addClass(player, "fishing");

        this.game.timeHandler.addEvent((): void => {
            if (!this.canLandFish()) {
                this.game.fishing.playerFailedLandingFish(player);
                return;
            }

            this.game.actions.animateExclamation(player);
            this.game.fishing.playerLandedFish(player, rod);
        }, 180);
    }

    /**
     * Displays message and starts battle when player lands a fish.
     *
     * @param player   A Player who landed the fish.
     * @param rod   The rod that will be used to fish.
     */
    private playerLandedFish(player: IPlayer, rod: IRod): void {
        const currentMap: IMap = this.game.areaSpawner.getMap(player.mapName) as IMap;
        const currentArea: IArea = currentMap.areas[player.bordering[player.direction]!.areaName];
        const options: IWildPokemonSchema[] = currentArea.wildPokemon!.fishing![rod.type]!;
        const chosen: IWildPokemonSchema = this.game.equations.chooseRandomWildPokemon(options);
        const chosenPokemon: IPokemon = this.game.equations.createPokemon(chosen);

        this.game.timeHandler.addEvent((): void => {
            this.game.menuGrapher.createMenu("GeneralText", {
                deleteOnFinish: true,
            });
            this.game.menuGrapher.addMenuDialog(
                "GeneralText",
                ["Oh! \n It's a bite!"],
                (): void => {
                    console.log("Should start battle with", chosenPokemon);
                    // this.game.battles.startBattle({
                    //     battlers: {
                    //         opponent: {
                    //             name: chosenPokemon.title,
                    //             actors: [chosenPokemon],
                    //             category: "Wild",
                    //             sprite: chosenPokemon.title.join("") + "Front"
                    //         }
                    //     }
                    // });
                }
            );
            this.game.menuGrapher.setActiveMenu("GeneralText");
            this.game.graphics.classes.removeClass(player, "fishing");
            this.game.physics.setWidth(player, 8, true);
        }, 140);
    }

    /**
     * Displays message when a Player does not land a fish.
     *
     * @param player   A Player who does not land a fish.
     */
    public playerFailedLandingFish(player: IPlayer): void {
        this.game.menuGrapher.deleteActiveMenu();
        this.game.menus.displayMessage("rekt");
        this.game.graphics.classes.removeClass(player, "fishing");
        this.game.physics.setWidth(player, 8, true);
    }

    /**
     * @todo Add functionality.
     */
    public canLandFish(): boolean {
        return true;
    }
}
