import { Action, TeamAndAction, UnderEachTeam, TeamId } from "battlemovr";
import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { BattleInfo, Pokemon } from "../Battles";
import { MoveSchema } from "../constants/Moves";

/**
 * Filters an action for whether it should go before another.
 *
 * @param a   A team's action.
 * @param b   The opposing team's action.
 * @returns Whether the action should go first.
 */
export type OrderFilter = (a: TeamAndAction<any>, b: TeamAndAction<any>) => boolean;

/**
 * Each battler's team and action.
 */
type TeamAndActionPair = [TeamAndAction<any>, TeamAndAction<any>];

/**
 * Orders chosen actions by priority and/or speed.
 */
export class ActionsOrderer extends Section<FullScreenPokemon> {
    /**
     * Orders teams' chosen actions.
     *
     * @param actions   Actions chosen by each team.
     * @param battleInfo   Info on the current battle.
     * @returns Team actions ordered for battle.
     * @see http://bulbapedia.bulbagarden.net/wiki/Priority
     * @see https://www.dragonflycave.com/mechanics/battle#turnorder
     * @todo Account for items, statuses, etc.
     */
    public order(actions: UnderEachTeam<Action>, battleInfo: BattleInfo): TeamAndAction<any>[] {
        const unorderedActions: [TeamAndAction<any>, TeamAndAction<any>] = [
            {
                action: actions.opponent,
                source: {
                    actor: battleInfo.teams.opponent.selectedActor,
                    team: TeamId.opponent,
                },
                target: {
                    actor: battleInfo.teams.player.selectedActor,
                    team: TeamId.player,
                },
            },
            {
                action: actions.player,
                source: {
                    actor: battleInfo.teams.player.selectedActor,
                    team: TeamId.player,
                },
                target: {
                    actor: battleInfo.teams.opponent.selectedActor,
                    team: TeamId.opponent,
                },
            },
        ];

        return this.runFilters(
            unorderedActions,
            this.filterForPlayerFleeing,
            this.filterForSwitch,
            this.filterForItem,
            this.filterForPriority,
            this.filterForSpeed,
            this.filterForMove
        );
    }

    /**
     * Orders actions by putting the first filter-matching one first.
     *
     * @param unorderedActions   Actions to be ordered.
     * @param filters   Filters to apply, in order.
     * @returns Actions ordered by the filters.
     */
    private runFilters(
        unorderedActions: TeamAndActionPair,
        ...filters: OrderFilter[]
    ): TeamAndActionPair {
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
    private readonly filterForPlayerFleeing: OrderFilter = (a: TeamAndAction<any>): boolean =>
        a.source.team === TeamId.player && a.action.type === "flee";

    /**
     * Filters an action for being a switch.
     *
     * @param a   A team's action.
     * @returns Whether the action should go first.
     */
    private readonly filterForSwitch: OrderFilter = (a: TeamAndAction<any>): boolean =>
        a.action.type === "switch";

    /**
     * Filters an action for being a switch.
     *
     * @param a   A team's action.
     * @returns Whether the action should go first.
     */
    private readonly filterForItem: OrderFilter = (a: TeamAndAction<any>): boolean =>
        a.action.type === "item";

    /**
     * Filters an action for having a higher priority.
     *
     * @param a   A team's action.
     * @param b   The opposing team's action.
     * @returns Whether the action should go first.
     */
    private readonly filterForPriority: OrderFilter = (
        a: TeamAndAction<any>,
        b: TeamAndAction<any>
    ): boolean => {
        if (a.action.type !== "move" || b.action.type !== "move") {
            return false;
        }

        const aMove: MoveSchema = this.game.constants.moves.byName[a.action.move];
        const bMove: MoveSchema = this.game.constants.moves.byName[b.action.move];

        return aMove.priority! > bMove.priority!;
    };

    /**
     * Filters an action for having a higher Pokemon speed.
     *
     * @param a   A team's action.
     * @param b   The opposing team's action.
     * @returns Whether the action should go first.
     */
    private readonly filterForSpeed: OrderFilter = (
        a: TeamAndAction<any>,
        b: TeamAndAction<any>
    ): boolean => {
        if (a.action.type !== "move" || b.action.type !== "move") {
            return false;
        }

        const battleInfo: BattleInfo = this.game.battleMover.getBattleInfo() as BattleInfo;
        let aPokemon: Pokemon;
        let bPokemon: Pokemon;

        if (a.source.team === TeamId.opponent) {
            aPokemon = battleInfo.teams.opponent.selectedActor;
            bPokemon = battleInfo.teams.player.selectedActor;
        } else {
            aPokemon = battleInfo.teams.player.selectedActor;
            bPokemon = battleInfo.teams.opponent.selectedActor;
        }

        return aPokemon.statistics.speed.current > bPokemon.statistics.speed.current;
    };

    /**
     * Filters an action for being a move.
     *
     * @param a   A team's action.
     * @returns Whether the action should go first.
     * @remarks This is added last so player moves go before wild Pokemon fleeing.
     */
    private readonly filterForMove: OrderFilter = (a: TeamAndAction<any>): boolean =>
        a.action.type === "move";
}
