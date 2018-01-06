import { component } from "babyioc";
import { ITeamAnimations, Team } from "battlemovr";
import { GeneralComponent } from "gamestartr";

import { FullScreenPokemon } from "../../../FullScreenPokemon";
import { IBattleInfo } from "../../Battles";
import { IMenu } from "../../Menus";
import { IThing } from "../../Things";
import { Actions } from "./shared/Actions";
import { Switching } from "./shared/Switching";

/**
 * Player animations used by FullScreenPokemon instances.
 */
export class Player<TGameStartr extends FullScreenPokemon> extends GeneralComponent<TGameStartr> implements ITeamAnimations {
    /**
     * Player action animations used by the FullScreenPokemon instance.
     */
    @component(Actions)
    public readonly actions: Actions<TGameStartr>;

    /**
     * Player switching animations used by the FullScreenPokemon instance.
     */
    @component((container: Player<TGameStartr>) => new Switching<TGameStartr>(container.gameStarter, {
        enter: {
            team: Team.player,
            getLeaderSlideToGoal: (battleInfo: IBattleInfo): number => {
                const player: IThing = battleInfo.things.player;
                const menu: IMenu = container.gameStarter.menuGrapher.getMenu("GeneralText") as IMenu;

                return menu.left - player.width / 2;
            },
            getSelectedPokemonSprite: (battleInfo: IBattleInfo): string =>
                battleInfo.teams.player.selectedActor.title.join("") + "Back",
            getSmokeLeft: (battleInfo: IBattleInfo): number =>
                battleInfo.things.menu.left + 32,
            getSmokeTop: (battleInfo: IBattleInfo): number =>
                battleInfo.things.menu.bottom - 32,
        },
    }))
    public readonly switching: Switching<TGameStartr>;

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
