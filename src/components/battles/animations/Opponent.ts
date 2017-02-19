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
 * Opponent animations used by FullScreenPokemon instances.
 */
export class Opponent<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> implements ITeamAnimations {
    /**
     * Opponent action animations used by the FullScreenPokemon instance.
     */
    public readonly actions: Actions<TGameStartr> = new Actions<TGameStartr>(this.gameStarter);

    /**
     * Opponent switching animations used by the FullScreenPokemon instance.
     */
    public readonly switching: Switching<TGameStartr> = new Switching<TGameStartr>(this.gameStarter, {
        enter: {
            team: Team.opponent,
            getLeaderSlideToGoal: (battleInfo: IBattleInfo): number => {
                const opponent: IThing = battleInfo.things.opponent;
                const menu: IMenu = this.gameStarter.menuGrapher.getMenu("GeneralText") as IMenu;
                return menu.right + opponent.width / 2;
            },
            getSelectedPokemonSprite: (battleInfo: IBattleInfo): string => {
                return battleInfo.teams.opponent.selectedActor.title.join("") + "Front";
            },
            getSmokeLeft: (battleInfo: IBattleInfo): number => {
                return battleInfo.things.menu.right - 32;
            },
            getSmokeTop: (battleInfo: IBattleInfo): number => {
                return battleInfo.things.menu.top + 32;
            }
        }
    });

    /**
     * Animation for when the opponent's actor's health changes.
     * 
     * @param health   New value for the actor's health.
     * @param onComplete   Callback for when this is done.
     */
    public healthChange(_health: number, onComplete: () => void): void {
        onComplete();
    }

    /**
     * Animation for when the opponent introducing themselves.
     * 
     * @param health   New value for the actor's health.
     * @param onComplete   Callback for when this is done.
     */
    public introduction(onComplete: () => void): void {
        onComplete();
    }
}
