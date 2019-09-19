import { component, factory } from "babyioc";
import { ITeamAnimations, Team } from "battlemovr";
import { GeneralComponent } from "eightbittr";

import { FullScreenPokemon } from "../../../FullScreenPokemon";
import { IBattleInfo } from "../../Battles";
import { IMenu } from "../../Menus";
import { IThing } from "../../Things";

import { Actions } from "./shared/Actions";
import { Switching } from "./shared/Switching";

/**
 * Animations for player battle events.
 */
export class Player<TEightBittr extends FullScreenPokemon> extends GeneralComponent<TEightBittr> implements ITeamAnimations {
    /**
     * Shared animations for team actions.
     */
    @component(Actions)
    public readonly actions: Actions<TEightBittr>;

    /**
     * Shared animations for teams switching Pokemon.
     */
    @factory((container: Player<TEightBittr>) => new Switching<TEightBittr>(container.eightBitter, {
        enter: {
            team: Team.player,
            getLeaderSlideToGoal: (battleInfo: IBattleInfo): number => {
                const player: IThing = battleInfo.things.player;
                const menu: IMenu = container.eightBitter.menuGrapher.getMenu("GeneralText") as IMenu;

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
    public readonly switching: Switching<TEightBittr>;

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
