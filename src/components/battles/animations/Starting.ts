import { component } from "babyioc";
import { GeneralComponent } from "eightbittr";

import { FullScreenPokemon } from "../../../FullScreenPokemon";
import { IBattleInfo, IBattleThings } from "../../Battles";
import { PokedexListingStatus } from "../../Constants";

import { Transitions } from "./Transitions";

/**
 * Animations for the starts of battles.
 */
export class Starting<TEightBittr extends FullScreenPokemon> extends GeneralComponent<TEightBittr> {
    /**
     * Flashy animation transitions to start battles.
     */
    @component(Transitions)
    public readonly transitions: Transitions<TEightBittr>;

    /**
     * Runs starting battle animations.
     *
     * @param onComplete   Callback for when this is done.
     */
    public run(onComplete: () => void): void {
        const battleInfo: IBattleInfo = this.eightBitter.battleMover.getBattleInfo() as IBattleInfo;

        if (battleInfo.keptThings) {
            this.eightBitter.graphics.moveThingsToText(battleInfo.keptThings);
        }

        // tslint:disable-next-line no-floating-promises
        this.eightBitter.audioPlayer.play(battleInfo.theme, {
            alias: this.eightBitter.audio.aliases.theme,
            loop: true,
        });

        this.transitions.play({
            name: battleInfo.startTransition,
            onComplete: (): void => {
                this.setupThings(battleInfo);
                this.runTeamEntrances(battleInfo, onComplete);
            },
        });
    }

    /**
     * Sets up the initial team Things.
     *
     * @param battleInfo   Info for the current battle.
     */
    private setupThings(battleInfo: IBattleInfo): void {
        this.eightBitter.menuGrapher.createMenu("Battle");
        battleInfo.things = this.eightBitter.battles.decorations.createInitialThings(battleInfo);

        if (battleInfo.keptThings) {
            this.eightBitter.graphics.moveThingsBeforeBackgrounds(battleInfo.keptThings);
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
        const timeout = 70;

        let playerX: number;
        let opponentX: number;
        let playerGoal: number;
        let opponentGoal: number;

        // They should be visible halfway through (2 * (1 / timeout))
        this.eightBitter.actions.animateFadeAttribute(player, "opacity", 2 / timeout, 1, 1);
        this.eightBitter.actions.animateFadeAttribute(opponent, "opacity", 2 / timeout, 1, 1);

        playerX = this.eightBitter.physics.getMidX(player);
        opponentX = this.eightBitter.physics.getMidX(opponent);
        playerGoal = menu.left + player.width / 2;
        opponentGoal = menu.right - opponent.width / 2;

        this.eightBitter.animations.sliding.slideHorizontally(
            player,
            (playerGoal - playerX) / timeout,
            playerGoal,
            1);

        this.eightBitter.animations.sliding.slideHorizontally(
            opponent,
            (opponentGoal - opponentX) / timeout,
            opponentGoal,
            1);

        this.eightBitter.saves.addPokemonToPokedex(battleInfo.teams.opponent.selectedActor.title, PokedexListingStatus.Seen);

        this.eightBitter.menuGrapher.setActiveMenu("GeneralText");
        this.eightBitter.timeHandler.addEvent(
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
            this.eightBitter.menuGrapher.createMenu("BattlePlayerHealth");
            this.eightBitter.menuGrapher.createMenu("BattlePlayerPokeballs");
            this.eightBitter.battles.decorations.addPokeballs(
                "BattlePlayerPokeballs",
                battleInfo.teams.player.actors);
        }

        if (battleInfo.teams.opponent.leader) {
            this.eightBitter.menuGrapher.createMenu("BattleOpponentHealth");
            this.eightBitter.menuGrapher.createMenu("BattleOpponentPokeballs");
            this.eightBitter.battles.decorations.addPokeballs(
                "BattleOpponentPokeballs",
                battleInfo.teams.opponent.actors,
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
        this.eightBitter.menuGrapher.createMenu("GeneralText", {
            finishAutomatically: battleInfo.automaticMenus,
        });
        this.eightBitter.menuGrapher.addMenuDialog(
            "GeneralText",
            battleInfo.texts.start(battleInfo.teams.opponent),
            (): void => {
                this.eightBitter.menuGrapher.deleteMenu("BattlePlayerHealth");
                this.eightBitter.menuGrapher.deleteMenu("BattleOpponentHealth");
                this.eightBitter.menuGrapher.createMenu("GeneralText");
                onComplete();
            });
        this.eightBitter.menuGrapher.setActiveMenu("GeneralText");
    }
}
