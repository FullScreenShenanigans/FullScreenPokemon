import { member } from "babyioc";
import { BattleOutcome, Move, OnChoice, Selector, TeamId } from "battlemovr";
import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../../FullScreenPokemon";
import { BattleInfo, Pokemon } from "../../Battles";
import { InventoryListing } from "../../menus/Items";

import { Switching } from "./player/Switching";

/**
 * Selector for a player's battle actions.
 */
export class PlayerSelector extends Section<FullScreenPokemon> implements Selector {
    /**
     * Menu interface for the player choosing whether to switch Pokemon.
     */
    @member(Switching)
    private readonly switching: Switching;

    /**
     * Reacts to an actor getting knocked out.
     *
     * @param battleInfo   State for an ongoing battle.
     * @param teamId   Which team is selecting an action.
     * @param onChoice   Callback for when this is done.
     */
    public afterKnockout(battleInfo: BattleInfo, team: TeamId, onComplete: () => void): void {
        const remaining: boolean =
            battleInfo.teams[TeamId[team]].actors.filter(
                (actor: Pokemon): boolean => actor.statistics.health.current !== 0
            ).length > 0;

        if (remaining) {
            this.switching.offerSwitch(team, onComplete);
        } else {
            this.game.battleMover.stopBattle(
                team === TeamId.opponent
                    ? BattleOutcome.playerVictory
                    : BattleOutcome.opponentVictory
            );
        }
    }

    /**
     * Determines the next action to take.
     *
     * @param battleInfo   State for an ongoing battle.
     * @param teamId   Which team is taking action.
     * @param onChoice   Callback for when an action is chosen.
     */
    public nextAction(battleInfo: BattleInfo, team: TeamId, onChoice: OnChoice): void {
        this.resetGui(battleInfo, team, onChoice);
    }

    /**
     * Resets the battle options menus.
     *
     * @param battleInfo   State for an ongoing battle.
     * @param onChoice   Callback for when an action is chosen.
     */
    private resetGui(battleInfo: BattleInfo, team: TeamId, onChoice: OnChoice): void {
        this.game.menuGrapher.createMenu("GeneralText");
        this.game.menuGrapher.createMenu("BattleOptions");
        this.game.menuGrapher.addMenuList("BattleOptions", {
            options: [
                {
                    text: "FIGHT",
                    callback: (): void => this.openBattleMovesMenu(battleInfo, onChoice),
                },
                {
                    text: "ITEM",
                    callback: (): void => this.openBattleItemsMenu(onChoice),
                },
                {
                    text: ["Poke", "Mon"],
                    callback: (): void =>
                        this.switching.openPokemonMenu(team, onChoice, (): void =>
                            this.resetGui(battleInfo, team, onChoice)
                        ),
                },
                {
                    text: "RUN",
                    callback: (): void => this.attemptToFlee(onChoice),
                },
            ],
        });
        this.game.menuGrapher.setActiveMenu("BattleOptions");
    }

    /**
     * Opens the in-battle moves menu.
     *
     * @param battleInfo   State for an ongoing battle.
     * @param onChoice   Callback for when an action is chosen.
     */
    private openBattleMovesMenu(battleInfo: BattleInfo, onChoice: OnChoice): void {
        const moves: Move[] = battleInfo.teams.player.selectedActor.moves;
        const options: any[] = moves.map((move: Move): any => ({
            text: move.title.toUpperCase(),
            callback: (): void => {
                onChoice({
                    move: move.title,
                    type: "move",
                });
            },
        }));

        for (let i: number = moves.length; i < 4; i += 1) {
            options.push({
                text: "-",
            });
        }

        this.game.menuGrapher.createMenu("BattleFightList");
        this.game.menuGrapher.addMenuList("BattleFightList", { options });
        this.game.menuGrapher.setActiveMenu("BattleFightList");
    }

    /**
     * Opens the in-battle items menu.
     *
     * @param battleInfo   State for an ongoing battle.
     * @param onChoice   Callback for when an action is chosen.
     */
    private openBattleItemsMenu(onChoice: OnChoice): void {
        this.game.menus.items.open({
            backMenu: "BattleOptions",
            container: "Battle",
            disableTossing: true,
            onUse: (listing: InventoryListing): void => {
                onChoice({
                    item: listing.item,
                    type: "item",
                });
            },
        });
    }

    /**
     * Chooses to attempt to flee the battle.
     */
    private attemptToFlee(onChoice: OnChoice): void {
        onChoice({
            type: "flee",
        });
    }
}
