import { Statistic, TeamId } from "battlemovr";
import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../../FullScreenPokemon";
import { BattleInfo, Pokemon } from "../../Battles";
import { Actor } from "../../Actors";

/**
 * Decorations for health displays.
 */
export class Health extends Section<FullScreenPokemon> {
    /**
     * Adds a Pokemon's health display to its appropriate menu.
     *
     * @param battlerName   Which battler to add the display for.
     */
    public addPokemonHealth(pokemon: Pokemon, teamId: TeamId): void {
        const menu = teamId === TeamId.player ? "BattlePlayerHealth" : "BattleOpponentHealth";

        this.game.menuGrapher.createMenu(menu);
        this.game.menuGrapher.createMenu(menu + "Title");
        this.game.menuGrapher.createMenu(menu + "Level");
        this.game.menuGrapher.createMenu(menu + "Amount");

        this.setPokemonHealthBar(teamId, pokemon.statistics.health);

        this.game.menuGrapher.addMenuDialog(menu + "Title", [[pokemon.nickname]]);

        this.game.menuGrapher.addMenuDialog(menu + "Level", String(pokemon.level));
    }

    /**
     * Slides a Pokemon's health bar to reflect changing health amounts.
     *
     * @param teamId   Team whose actor's health is changing.
     * @param from   Original health amount.
     * @param to   New health amount.
     * @param onComplete   Handler for when this is done.
     * @remarks This doesn't change the actor's statistic.
     */
    public animatePokemonHealthBar(
        teamId: TeamId,
        from: number,
        to: number,
        onComplete: () => void
    ): void {
        const battleInfo = this.game.battleMover.getBattleInfo() as BattleInfo;
        const statistic: Statistic =
            battleInfo.teams[TeamId[teamId]].selectedActor.statistics.health;
        const normal = statistic.normal;
        const delta = to - from > 0 ? 1 : -1;
        const repeats = Math.abs(to - from);
        let current = statistic.current;

        this.game.timeHandler.addEventInterval(
            (): void => {
                current += delta;
                this.setPokemonHealthBar(teamId, { current, normal });
            },
            2,
            repeats
        );

        this.game.timeHandler.addEvent(onComplete, repeats * 2 + 35);
    }

    /**
     * Adds a health bar to a battle display, with an appropriate width.
     *
     * @param teamId   Which team to add the display for.
     * @param statistic   Health summary for the team's selected actor.
     */
    private setPokemonHealthBar(teamId: TeamId, health: Statistic): void {
        const nameUpper: string = teamId === TeamId.player ? "Player" : "Opponent";
        const bar: Actor = this.game.utilities.getExistingActorById("HPBarFill" + nameUpper);
        const barWidth: number = this.game.equations.widthHealthBar(100, health);
        const healthDialog: string =
            this.game.utilities.makeDigit(health.current, 3, "\t") +
            "/" +
            this.game.utilities.makeDigit(health.normal, 3, "\t");

        if (teamId === TeamId.player) {
            const menuNumbers: string = "Battle" + nameUpper + "HealthNumbers";
            this.game.menuGrapher.createMenu(menuNumbers);
            this.game.menuGrapher.addMenuDialog(menuNumbers, healthDialog);
        }

        this.game.physics.setWidth(bar, barWidth);
        bar.hidden = barWidth === 0;
    }
}
