import { factory, member } from "babyioc";
import { ITeamAnimations, Team } from "battlemovr";
import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../../FullScreenPokemon";
import { IBattleInfo } from "../../Battles";
import { IMenu } from "../../Menus";
import { IThing } from "../../Things";

import { Actions } from "./shared/Actions";
import { Switching } from "./shared/Switching";

/**
 * Animations for player battle events.
 */
export class Player extends Section<FullScreenPokemon> implements ITeamAnimations {
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
                    team: Team.player,
                    getLeaderSlideToGoal: (battleInfo: IBattleInfo): number => {
                        const player: IThing = battleInfo.things.player;
                        const menu: IMenu = container.game.menuGrapher.getMenu(
                            "GeneralText"
                        ) as IMenu;

                        return menu.left - player.width / 2;
                    },
                    getSelectedPokemonSprite: (battleInfo: IBattleInfo): string =>
                        battleInfo.teams.player.selectedActor.title.join("") + "Back",
                    getSmokeLeft: (battleInfo: IBattleInfo): number =>
                        battleInfo.things.menu.left + 32,
                    getSmokeTop: (battleInfo: IBattleInfo): number =>
                        battleInfo.things.menu.bottom - 32,
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
