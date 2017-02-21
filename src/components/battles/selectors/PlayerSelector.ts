import { IMove } from "battlemovr/lib/Actors";
import { BattleOutcome } from "battlemovr/lib/Animations";
import { IOnChoice, ISelector } from "battlemovr/lib/Selectors";
import { Team } from "battlemovr/lib/Teams";
import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../../../FullScreenPokemon";
import { IBattleInfo, IPokemon } from "../../Battles";
import { IInventoryListing } from "../../menus/Items";
import { Switching } from "./player/Switching";

/**
 * Selector for a player's actions used by FullScreenPokemon instances.
 */
export class PlayerSelector<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> implements ISelector {
    /**
     * Switching logic used by this instance.
     */
    private readonly switching: Switching<TGameStartr> = new Switching(this.gameStarter);

    /**
     * Reacts to an actor getting knocked out.
     * 
     * @param battleInfo   State for an ongoing battle.
     * @param team   Which team is selecting an action.
     * @param onChoice   Callback for when this is done.
     */
    public afterKnockout(battleInfo: IBattleInfo, team: Team, onComplete: () => void): void {
        const remaining: boolean = battleInfo.teams[Team[team]].actors
            .filter((actor: IPokemon): boolean => {
                return actor.statistics.health.current !== 0;
            })
            .length > 0;

        if (remaining) {
            this.switching.offerSwitch(team, onComplete);
        } else {
            this.gameStarter.battleMover.stopBattle(
                team === Team.opponent
                    ? BattleOutcome.playerVictory
                    : BattleOutcome.opponentVictory);
        }
    }

    /**
     * Determines the next action to take.
     * 
     * @param battleInfo   State for an ongoing battle.
     * @param team   Which team is taking action.
     * @param onChoice   Callback for when an action is chosen.
     */
    public nextAction(battleInfo: IBattleInfo, team: Team, onChoice: IOnChoice): void {
        this.resetGui(battleInfo, team, onChoice);
    }

    /**
     * Resets the battle options menus.
     * 
     * @param battleInfo   State for an ongoing battle.
     * @param onChoice   Callback for when an action is chosen.
     */
    private resetGui(battleInfo: IBattleInfo, team: Team, onChoice: IOnChoice): void {
        this.gameStarter.menuGrapher.createMenu("GeneralText");
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
                    callback: (): void => this.switching.openBattlePokemonMenu(
                        team,
                        onChoice,
                        (): void => this.resetGui(battleInfo, team, onChoice))
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
    private openBattleMovesMenu(battleInfo: IBattleInfo, onChoice: IOnChoice): void {
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
    private openBattleItemsMenu(onChoice: IOnChoice): void {
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
     * Chooses to attempt to flee the battle.
     */
    private attemptToFlee(onChoice: IOnChoice): void {
        onChoice({
            type: "flee"
        });
    }
}
