import { IAction } from "battlemovr/lib/Actions";
import { ITeamAction, IUnderEachTeam, Team } from "battlemovr/lib/Teams";
import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { IBattleInfo, IPokemon } from "../Battles";
import { IMoveSchema } from "../constants/Moves";

/**
 * Filters an action for whether it should go before another.
 * 
 * @param a   A team's action.
 * @param b   The opposing team's action.
 * @returns Whether the action should go first.
 */
export interface ITeamActionFilter {
    (a: ITeamAction, b: ITeamAction): boolean;
}

/**
 * Battle functions used by FullScreenPokemon instances.
 */
export class ActionsOrderer<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
    /**
     * Orders teams' chosen actions.
     * 
     * @param actions   Actions chosen by each team.
     * @returns Team actions ordered for battle.
     * @see http://bulbapedia.bulbagarden.net/wiki/Priority
     * @see https://www.dragonflycave.com/mechanics/battle#turnorder
     * @todo Account for items, statuses, etc.
     */
    public order(actions: IUnderEachTeam<IAction>): ITeamAction[] {
        const unorderedActions: [ITeamAction, ITeamAction] = [
            {
                team: Team.opponent,
                action: actions.opponent
            },
            {
                team: Team.player,
                action: actions.player
            }
        ];

        return this.orderActions(
            unorderedActions,
            this.filterForPlayerFleeing,
            this.filterForSwitch,
            this.filterForItem,
            this.filterForPriority,
            this.filterForSpeed,
            this.filterForMove);
    }

    /**
     * Orders actions by putting the first filter-matching one first.
     * 
     * @param unorderedActions   Actions to be ordered.
     * @param filters   Filters to apply, in order.
     * @returns Actions ordered by the filters.
     */
    private orderActions(unorderedActions: [ITeamAction, ITeamAction], ...filters: ITeamActionFilter[]): [ITeamAction, ITeamAction] {
        for (const filter of filters) {
            if (filter(unorderedActions[0], unorderedActions[1])) {
                return unorderedActions;
            }

            if (filter(unorderedActions[1], unorderedActions[0])) {
                return [unorderedActions[1], unorderedActions[0]];
            }
        }

        return unorderedActions;
    }

    /**
     * Filters an action for being the player fleeing.
     * 
     * @param a   A team's action.
     * @returns Whether the action should go first.
     */
    private filterForPlayerFleeing: ITeamActionFilter = (a: ITeamAction): boolean => {
        return a.team === Team.player && a.action.type === "flee";
    }

    /**
     * Filters an action for being a switch.
     * 
     * @param a   A team's action.
     * @returns Whether the action should go first.
     */
    private filterForSwitch: ITeamActionFilter = (a: ITeamAction): boolean => {
        return a.action.type === "switch";
    }

    /**
     * Filters an action for being a switch.
     * 
     * @param a   A team's action.
     * @returns Whether the action should go first.
     */
    private filterForItem: ITeamActionFilter = (a: ITeamAction): boolean => {
        return a.action.type === "item";
    }

    /**
     * Filters an action for having a higher priority.
     * 
     * @param a   A team's action.
     * @param b   The opposing team's action.
     * @returns Whether the action should go first.
     */
    private filterForPriority: ITeamActionFilter = (a: ITeamAction, b: ITeamAction): boolean => {
        if (a.action.type !== "move" || b.action.type !== "move") {
            return false;
        }

        const aMove: IMoveSchema = this.gameStarter.constants.moves.byName[a.action.move];
        const bMove: IMoveSchema = this.gameStarter.constants.moves.byName[b.action.move];

        return aMove.priority > bMove.priority;
    }

    /**
     * Filters an action for having a higher Pokemon speed.
     * 
     * @param a   A team's action.
     * @param b   The opposing team's action.
     * @returns Whether the action should go first.
     */
    private filterForSpeed: ITeamActionFilter = (a: ITeamAction, b: ITeamAction): boolean => {
        if (a.action.type !== "move" || b.action.type !== "move") {
            return false;
        }

        const battleInfo: IBattleInfo = this.gameStarter.battleMover.getBattleInfo() as IBattleInfo;
        let aPokemon: IPokemon;
        let bPokemon: IPokemon;

        if (a.team === Team.opponent) {
            aPokemon = battleInfo.teams.opponent.selectedActor;
            bPokemon = battleInfo.teams.player.selectedActor;
        } else {
            aPokemon = battleInfo.teams.player.selectedActor;
            bPokemon = battleInfo.teams.opponent.selectedActor;
        }

        return aPokemon.statistics.speed.current > bPokemon.statistics.speed.current;
    }

    /**
     * Filters an action for being a move.
     * 
     * @param a   A team's action.
     * @returns Whether the action should go first.
     * @remarks This is added last so player moves go before wild Pokemon fleeing.
     */
    private filterForMove: ITeamActionFilter = (a: ITeamAction): boolean => {
        return a.action.type === "move";
    }
}
