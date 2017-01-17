import { ITeamAnimations } from "battlemovr/lib/Animations";
import { Team } from "battlemovr/lib/Teams";
import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../../../FullScreenPokemon";
import { IBattleInfo } from "../../Battles";
import { IMenu } from "../../Menus";
import { IThing } from "../../Things";
import { Actions } from "./shared/Actions";
import { Switching } from "./shared/Switching";

/**
 * Player animations used by FullScreenPokemon instances.
 */
export class Player<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> implements ITeamAnimations {
    /**
     * Player action animations used by the FullScreenPokemon instance.
     */
    public readonly actions: Actions<TGameStartr> = new Actions<TGameStartr>(this.gameStarter);

    /**
     * Player switching animations used by the FullScreenPokemon instance.
     */
    public readonly switching: Switching<TGameStartr> = new Switching<TGameStartr>(this.gameStarter, {
        enter: {
            team: Team.player,
            getLeaderSlideToGoal: (battleInfo: IBattleInfo): number => {
                const player: IThing = battleInfo.things.player;
                const menu: IMenu = this.gameStarter.menuGrapher.getMenu("GeneralText") as IMenu;
                return menu.left - player.width / 2;
            },
            getSelectedPokemonSprite: (battleInfo: IBattleInfo): string => {
                return battleInfo.teams.player.selectedActor.title.join("") + "Back";
            },
            getSmokeLeft: (battleInfo: IBattleInfo): number => {
                return battleInfo.things.menu.left + 32;
            },
            getSmokeTop: (battleInfo: IBattleInfo): number => {
                return battleInfo.things.menu.bottom - 32;
            }
        }
    });

    /**
     * Animation for when the player's actor's health changes.
     * 
     * @param health   New value for the actor's health.
     * @param onComplete   Callback for when this is done.
     */
    public healthChange(_health: number, onComplete: () => void): void {
        onComplete();
    }

    /**
     * Animation for the player introducing themselves.
     * 
     * @param health   New value for the actor's health.
     * @param onComplete   Callback for when this is done.
     */
    public introduction(onComplete: () => void): void {
        onComplete();
    }
}
