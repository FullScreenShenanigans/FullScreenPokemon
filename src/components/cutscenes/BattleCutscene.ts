import { Component } from "eightbittr/lib/Component";
import { ICutsceneSettings } from "sceneplayr/lib/IScenePlayr";

import { IBattleInfo } from "../../components/Battles";
import { PokedexListingStatus } from "../../components/Constants";
import { FullScreenPokemon } from "../../FullScreenPokemon";
import { IBattleThings, Things } from "./battles/Things";

/**
 * Settings for a Battle cutscene.
 */
export interface IBattleCutsceneSettings extends ICutsceneSettings {
    /**
     * Information on the current battle.
     */
    battleInfo: IBattleInfo;

    /**
     * Things displayed in the battle.
     */
    things: IBattleThings;
}

/**
 * Battle cutscene functions used by FullScreenPokemon instances.
 */
export class BattleCutscene<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
    /**
     * Thing handlers for battle cutscene functions used by FullScreenPokemon instances.
     */
    private readonly things: Things<TGameStartr> = new Things(this.gameStarter);

    /**
     * Routine for starting a battle.
     * 
     * @param cutscene   Settings for the cutscene.
     */
    public start(cutscene: IBattleCutsceneSettings): void {
        this.gameStarter.audioPlayer.playTheme(cutscene.battleInfo.theme);
        this.gameStarter.graphics.moveBattleKeptThingsToText(cutscene.battleInfo.keptThings);

        this.things.setup(cutscene);
    }

    /**
     * Routine for showing each team entering.
     * 
     * @param cutscene   Settings for the cutscene.
     */
    public entrance(cutscene: IBattleCutsceneSettings): void {
        const { menu, opponent, player }: IBattleThings = cutscene.things;

        let playerX: number;
        let opponentX: number;
        let playerGoal: number;
        let opponentGoal: number;
        let timeout: number = 70;

        // They should be visible halfway through (2 * (1 / timeout))
        this.gameStarter.actions.animateFadeAttribute(player, "opacity", 2 / timeout, 1, 1);
        this.gameStarter.actions.animateFadeAttribute(opponent, "opacity", 2 / timeout, 1, 1);

        playerX = this.gameStarter.physics.getMidX(player);
        opponentX = this.gameStarter.physics.getMidX(opponent);
        playerGoal = menu.left + player.width / 2;
        opponentGoal = menu.right - opponent.width / 2;

        this.gameStarter.actions.animateSlideHorizontal(
            player,
            (playerGoal - playerX) / timeout,
            playerGoal,
            1);

        this.gameStarter.actions.animateSlideHorizontal(
            opponent,
            (opponentGoal - opponentX) / timeout,
            opponentGoal,
            1);

        this.gameStarter.saves.addPokemonToPokedex(cutscene.battleInfo.teams.opponent.selectedActor.title, PokedexListingStatus.Seen);

        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }
}
