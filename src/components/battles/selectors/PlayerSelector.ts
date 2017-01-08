import { IMove } from "battlemovr/lib/Actors";
import { IOnChoice, ISelector } from "battlemovr/lib/Selectors";
import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../../../FullScreenPokemon";
import { IBattleInfo, IPokemon } from "../../Battles";
import { IInventoryListing } from "../../menus/Items";

/**
 * Selector for a player's actions.
 */
export class PlayerSelector<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> implements ISelector {
    /**
     * Determines the next action to take.
     * 
     * @param battleInfo   State for an ongoing battle.
     * @param onChoice   Callback for when an action is chosen.
     */
    public nextAction(battleInfo: IBattleInfo, onChoice: IOnChoice): void {
        this.gameStarter.menuGrapher.createMenu("BattleOptions");
        this.gameStarter.menuGrapher.addMenuList("BattleOptions", {
            options: [
                {
                    text: "FIGHT",
                    callback: (): void => this.openBattleMovesMenu(battleInfo, onChoice)
                },
                {
                    text: "ITEM",
                    callback: (): void => this.openBattleItemsMenu(onChoice)
                },
                {
                    text: ["Poke", "Mon"],
                    callback: (): void => this.openBattlePokemonMenu(onChoice)
                },
                {
                    text: "RUN",
                    callback: (): void => this.attemptToFlee(onChoice)
                }
            ]
        });
        this.gameStarter.menuGrapher.setActiveMenu("BattleOptions");
    }

    /**
     * Opens the in-battle moves menu.
     * 
     * @param battleInfo   State for an ongoing battle.
     * @param onChoice   Callback for when an action is chosen.
     */
    protected openBattleMovesMenu(battleInfo: IBattleInfo, onChoice: IOnChoice): void {
        const moves: IMove[] = battleInfo.teams.player.selectedActor.moves;
        const options: any[] = moves.map((move: IMove): any => {
            return {
                text: move.title.toUpperCase(),
                callback: (): void => {
                    onChoice({
                        move: move.title,
                        type: "move"
                    });
                }
            };
        });

        for (let i: number = moves.length; i < 4; i += 1) {
            options.push({
                text: "-"
            });
        }

        this.gameStarter.menuGrapher.createMenu("BattleFightList");
        this.gameStarter.menuGrapher.addMenuList("BattleFightList", { options });
        this.gameStarter.menuGrapher.setActiveMenu("BattleFightList");
    }

    /**
     * Opens the in-battle items menu.
     * 
     * @param battleInfo   State for an ongoing battle.
     * @param onChoice   Callback for when an action is chosen.
     */
    protected openBattleItemsMenu(onChoice: IOnChoice): void {
        this.gameStarter.menus.items.openItemsMenu({
            backMenu: "BattleOptions",
            container: "Battle",
            disableTossing: true,
            onUse: (listing: IInventoryListing): void => {
                onChoice({
                    item: listing.item,
                    type: "item"
                });
            }
        });
    }

    /**
     * Opens the in-battle Pokemon menu.
     * 
     * @param battleInfo   State for an ongoing battle.
     * @param onChoice   Callback for when an action is chosen.
     */
    protected openBattlePokemonMenu(onChoice: IOnChoice): void {
        this.gameStarter.menus.pokemon.openPartyMenu({
            backMenu: "BattleOptions",
            container: "Battle",
            onSwitch: (pokemon: IPokemon): void => {
                onChoice({
                    newActor: pokemon,
                    type: "switch"
                });
            }
        });
    }

    /**
     * Chooses to attempt to flee the battle.
     */
    protected attemptToFlee(onChoice: IOnChoice): void {
        onChoice({
            type: "flee"
        });
    }
}
