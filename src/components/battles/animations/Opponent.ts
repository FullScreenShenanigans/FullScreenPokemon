import { component } from "babyioc";
import { ITeamAnimations, Team } from "battlemovr";
import { GeneralComponent } from "eightbittr";

import { FullScreenPokemon } from "../../../FullScreenPokemon";
import { IBattleInfo } from "../../Battles";
import { IMenu } from "../../Menus";
import { IThing } from "../../Things";
import { Actions } from "./shared/Actions";
import { Switching } from "./shared/Switching";

/**
 * Animations for opponent battle events.
 */
export class Opponent<TEightBittr extends FullScreenPokemon> extends GeneralComponent<TEightBittr> implements ITeamAnimations {
    /**
     * Shared animations for team actions.
     */
    @component(Actions)
    public readonly actions: Actions<TEightBittr>;

    /**
     * Shared animations for teams switching Pokemon.
     */
    @component((container: Opponent<TEightBittr>) =>
        new Switching(container, {
            enter: {
                team: Team.opponent,
                getLeaderSlideToGoal: (battleInfo: IBattleInfo): number => {
                    const opponent: IThing = battleInfo.things.opponent;
                    const menu: IMenu = container.eightBitter.menuGrapher.getMenu("GeneralText") as IMenu;

                    return menu.right + opponent.width / 2;
                },
                getSelectedPokemonSprite: (battleInfo: IBattleInfo): string =>
                    battleInfo.teams.opponent.selectedActor.title.join("") + "Front",
                getSmokeLeft: (battleInfo: IBattleInfo): number =>
                    battleInfo.things.menu.right - 32,
                getSmokeTop: (battleInfo: IBattleInfo): number =>
                    battleInfo.things.menu.top + 32,
            },
        }))
    public readonly switching: Switching<TEightBittr>;

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
