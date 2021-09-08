import { factory, member } from "babyioc";
import { TeamAnimations, TeamId } from "battlemovr";
import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../../FullScreenPokemon";
import { BattleInfo } from "../../Battles";
import { Menu } from "../../Menus";
import { Actor } from "../../Actors";

import { Actions } from "./shared/Actions";
import { Switching } from "./shared/Switching";

/**
 * Animations for opponent battle events.
 */
export class Opponent extends Section<FullScreenPokemon> implements TeamAnimations {
    /**
     * Shared animations for team actions.
     */
    @member(Actions)
    public readonly actions: Actions;

    /**
     * Shared animations for teams switching Pokemon.
     */
    @factory(
        (container: Opponent) =>
            new Switching(container, {
                enter: {
                    team: TeamId.opponent,
                    getLeaderSlideToGoal: (battleInfo: BattleInfo): number => {
                        const opponent: Actor = battleInfo.actors.opponent;
                        const menu: Menu = container.game.menuGrapher.getMenu(
                            "GeneralText"
                        ) as Menu;

                        return menu.right + opponent.width / 2;
                    },
                    getSelectedPokemonSprite: (battleInfo: BattleInfo): string =>
                        battleInfo.teams.opponent.selectedActor.title.join("") + "Front",
                    getSmokeLeft: (battleInfo: BattleInfo): number =>
                        battleInfo.actors.menu.right - 32,
                    getSmokeTop: (battleInfo: BattleInfo): number =>
                        battleInfo.actors.menu.top + 32,
                },
            })
    )
    public readonly switching: Switching;

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
