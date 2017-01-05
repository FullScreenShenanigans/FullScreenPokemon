import { Component } from "eightbittr/lib/Component";
import { ICutsceneSettings } from "sceneplayr/lib/IScenePlayr";

import { IBattleInfo } from "../../components/Battles";
import { FullScreenPokemon } from "../../FullScreenPokemon";

/**
 * Settings for a Battle cutscene.
 */
export interface IBattleCutsceneSettings extends ICutsceneSettings {
    /**
     * Information on the current battle.
     */
    battleInfo: IBattleInfo;
}

/**
 * Battle cutscene functions used by FullScreenPokemon instances.
 */
export class BattleCutscene<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
    /**
     * Routine for starting a battle.
     * 
     * @param cutscene   Settings for the cutscene.
     */
    public start(cutscene: IBattleCutsceneSettings): void {
        this.gameStarter.audioPlayer.playTheme(cutscene.battleInfo.theme);
        this.gameStarter.graphics.moveBattleKeptThingsToText(cutscene.battleInfo.keptThings);
    }
}
