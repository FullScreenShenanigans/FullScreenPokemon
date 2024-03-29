import { member } from "babyioc";
import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../../FullScreenPokemon";
import { BattleInfo, BattleActors } from "../../Battles";
import { PokedexListingStatus } from "../../Constants";

import { Transitions } from "./Transitions";

/**
 * Animations for the starts of battles.
 */
export class Starting extends Section<FullScreenPokemon> {
    /**
     * Flashy animation transitions to start battles.
     */
    @member(Transitions)
    public readonly transitions: Transitions;

    /**
     * Runs starting battle animations.
     *
     * @param onComplete   Callback for when this is done.
     */
    public run(onComplete: () => void): void {
        const battleInfo: BattleInfo = this.game.battleMover.getBattleInfo() as BattleInfo;

        if (battleInfo.keptActors) {
            this.game.graphics.collections.moveActorsToText(battleInfo.keptActors);
        }

        this.game.audioPlayer.play(battleInfo.theme, {
            alias: this.game.audio.aliases.theme,
            loop: true,
        });

        this.transitions.play({
            name: battleInfo.startTransition,
            onComplete: (): void => {
                this.setupActors(battleInfo);
                this.runTeamEntrances(battleInfo, onComplete);
            },
        });
    }

    /**
     * Sets up the initial team Actors.
     *
     * @param battleInfo   Info for the current battle.
     */
    private setupActors(battleInfo: BattleInfo): void {
        this.game.menuGrapher.createMenu("Battle");
        battleInfo.actors = this.game.battles.decorations.createInitialActors(battleInfo);

        if (battleInfo.keptActors) {
            this.game.graphics.collections.moveActorsBeforeBackgrounds(battleInfo.keptActors);
        }
    }

    /**
     * Animations teams entering the battle.
     *
     * @param battleInfo   Info for the current battle.
     * @param onComplete   Callback for when this is done.
     */
    private runTeamEntrances(battleInfo: BattleInfo, onComplete: () => void): void {
        const { menu, opponent, player }: BattleActors = battleInfo.actors;
        const timeout = 70;

        // They should be visible halfway through (2 * (1 / timeout))
        this.game.animations.fading.animateFadeAttribute(player, "opacity", 2 / timeout, 1, 1);
        this.game.animations.fading.animateFadeAttribute(opponent, "opacity", 2 / timeout, 1, 1);

        const playerX = this.game.physics.getMidX(player);
        const opponentX = this.game.physics.getMidX(opponent);
        const playerGoal = menu.left + player.width / 2;
        const opponentGoal = menu.right - opponent.width / 2;

        this.game.animations.sliding.slideHorizontally(
            player,
            (playerGoal - playerX) / timeout,
            playerGoal,
            1
        );

        this.game.animations.sliding.slideHorizontally(
            opponent,
            (opponentGoal - opponentX) / timeout,
            opponentGoal,
            1
        );

        this.game.saves.addPokemonToPokedex(
            battleInfo.teams.opponent.selectedActor.title,
            PokedexListingStatus.Seen
        );

        this.game.menuGrapher.setActiveMenu("GeneralText");
        this.game.timeHandler.addEvent((): void => {
            this.showPlayerPokeballs(battleInfo);
            this.runOpeningText(battleInfo, onComplete);
        }, timeout);
    }

    /**
     * Adds the player's Pokeball display for party size.
     *
     * @param battleInfo   Info for the current battle.
     */
    private showPlayerPokeballs(battleInfo: BattleInfo): void {
        if (battleInfo.teams.player.leader) {
            this.game.menuGrapher.createMenu("BattlePlayerHealth");
            this.game.menuGrapher.createMenu("BattlePlayerPokeballs");
            this.game.battles.decorations.addPokeballs(
                "BattlePlayerPokeballs",
                battleInfo.teams.player.actors
            );
        }

        if (battleInfo.teams.opponent.leader) {
            this.game.menuGrapher.createMenu("BattleOpponentHealth");
            this.game.menuGrapher.createMenu("BattleOpponentPokeballs");
            this.game.battles.decorations.addPokeballs(
                "BattleOpponentPokeballs",
                battleInfo.teams.opponent.actors,
                true
            );
        }
    }

    /**
     * Shows the introductory text.
     *
     * @param battleInfo   Info for the current battle.
     * @param onComplete   Callback for when this is done.
     */
    private runOpeningText(battleInfo: BattleInfo, onComplete: () => void): void {
        this.game.menuGrapher.createMenu("GeneralText", {
            finishAutomatically: battleInfo.automaticMenus,
        });
        this.game.menuGrapher.addMenuDialog(
            "GeneralText",
            battleInfo.texts.start(battleInfo.teams.opponent),
            (): void => {
                this.game.menuGrapher.deleteMenu("BattlePlayerHealth");
                this.game.menuGrapher.deleteMenu("BattleOpponentHealth");
                this.game.menuGrapher.createMenu("GeneralText");
                onComplete();
            }
        );
        this.game.menuGrapher.setActiveMenu("GeneralText");
    }
}
