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
 * Animations for player battle events.
 */
export class Player extends Section<FullScreenPokemon> implements TeamAnimations {
    /**
     * Shared animations for team actions.
     */
    @member(Actions)
    public readonly actions: Actions;

    /**
     * Shared animations for teams switching Pokemon.
     */
    @factory(
        (container: Player) =>
            new Switching(container.game, {
                enter: {
                    team: TeamId.player,
                    getLeaderSlideToGoal: (battleInfo: BattleInfo): number => {
                        const player: Actor = battleInfo.actors.player;
                        const menu: Menu = container.game.menuGrapher.getMenu(
                            "GeneralText"
                        ) as Menu;

                        return menu.left - player.width / 2;
                    },
                    getSelectedPokemonSprite: (battleInfo: BattleInfo): string =>
                        battleInfo.teams.player.selectedActor.title.join("") + "Back",
                    getSmokeLeft: (battleInfo: BattleInfo): number =>
                        battleInfo.actors.menu.left + 32,
                    getSmokeTop: (battleInfo: BattleInfo): number =>
                        battleInfo.actors.menu.bottom - 32,
                },
            })
    )
    public readonly switching: Switching;

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
