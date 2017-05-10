import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../../../FullScreenPokemon";
import { IBattleInfo, IBattleThings } from "../../Battles";
import { PokedexListingStatus } from "../../Constants";
import { Transitions } from "./Transitions";

/**
 * Battle start animations used by FullScreenPokemon instances.
 */
export class Starting<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
    /**
     * Transition animations used by the FullScreenPokemon instance.
     */
    public readonly transitions: Transitions<TGameStartr> = new Transitions(this.gameStarter);

    /**
     * Runs starting battle animations.
     * 
     * @param onComplete   Callback for when this is done.
     */
    public run(onComplete: () => void): void {
        const battleInfo: IBattleInfo = this.gameStarter.battleMover.getBattleInfo() as IBattleInfo;

        this.gameStarter.audioPlayer.playTheme(battleInfo.theme);

        if (battleInfo.keptThings) {
            this.gameStarter.graphics.moveThingsToText(battleInfo.keptThings);
        }

        this.transitions.play({
            onComplete: (): void => {
                this.setupThings(battleInfo);
                this.runTeamEntrances(battleInfo, onComplete);
            }
        });
    }

    /**
     * Sets up the initial team Things.
     * 
     * @param battleInfo   Info for the current battle.
     */
    private setupThings(battleInfo: IBattleInfo): void {
        this.gameStarter.menuGrapher.createMenu("Battle");
        battleInfo.things = this.gameStarter.battles.decorations.createInitialThings(battleInfo);

        if (battleInfo.keptThings) {
            this.gameStarter.graphics.moveThingsBeforeBackgrounds(battleInfo.keptThings);
        }
    }

    /**
     * Animations teams entering the battle.
     * 
     * @param battleInfo   Info for the current battle.
     * @param onComplete   Callback for when this is done.
     */
    private runTeamEntrances(battleInfo: IBattleInfo, onComplete: () => void): void {
        const { menu, opponent, player }: IBattleThings = battleInfo.things;
        const timeout: number = 70;

        let playerX: number;
        let opponentX: number;
        let playerGoal: number;
        let opponentGoal: number;

        // They should be visible halfway through (2 * (1 / timeout))
        this.gameStarter.actions.animateFadeAttribute(player, "opacity", 2 / timeout, 1, 1);
        this.gameStarter.actions.animateFadeAttribute(opponent, "opacity", 2 / timeout, 1, 1);

        playerX = this.gameStarter.physics.getMidX(player);
        opponentX = this.gameStarter.physics.getMidX(opponent);
        playerGoal = menu.left + player.width / 2;
        opponentGoal = menu.right - opponent.width / 2;

        this.gameStarter.actions.sliding.slideHorizontally(
            player,
            (playerGoal - playerX) / timeout,
            playerGoal,
            1);

        this.gameStarter.actions.sliding.slideHorizontally(
            opponent,
            (opponentGoal - opponentX) / timeout,
            opponentGoal,
            1);

        this.gameStarter.saves.addPokemonToPokedex(battleInfo.teams.opponent.selectedActor.title, PokedexListingStatus.Seen);

        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
        this.gameStarter.timeHandler.addEvent(
            (): void => {
                this.showPlayerPokeballs(battleInfo);
                this.runOpeningText(battleInfo, onComplete);
            },
            timeout);
    }

    /**
     * Adds the player's Pokeball display for party size.
     * 
     * @param battleInfo   Info for the current battle.
     */
    private showPlayerPokeballs(battleInfo: IBattleInfo): void {
        if (battleInfo.teams.player.leader) {
            this.gameStarter.menuGrapher.createMenu("BattlePlayerHealth");
            this.gameStarter.menuGrapher.createMenu("BattlePlayerPokeballs");
            this.gameStarter.battles.decorations.addPokeballs(
                "BattlePlayerPokeballs",
                battleInfo.teams.player.actors.length);
        }

        if (battleInfo.teams.opponent.leader) {
            this.gameStarter.menuGrapher.createMenu("BattleOpponentHealth");
            this.gameStarter.menuGrapher.createMenu("BattleOpponentPokeballs");
            this.gameStarter.battles.decorations.addPokeballs(
                "BattleOpponentPokeballs",
                battleInfo.teams.opponent.actors.length,
                true);
        }
    }

    /**
     * Shows the introductory text.
     * 
     * @param battleInfo   Info for the current battle.
     * @param onComplete   Callback for when this is done.
     */
    private runOpeningText(battleInfo: IBattleInfo, onComplete: () => void): void {
        this.gameStarter.menuGrapher.createMenu("GeneralText", {
            finishAutomatically: battleInfo.automaticMenus
        });
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            battleInfo.texts.start(battleInfo.teams.opponent),
            (): void => {
                this.gameStarter.menuGrapher.deleteMenu("BattlePlayerHealth");
                this.gameStarter.menuGrapher.deleteMenu("BattleOpponentHealth");
                this.gameStarter.menuGrapher.createMenu("GeneralText");
                onComplete();
            });
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }
}
