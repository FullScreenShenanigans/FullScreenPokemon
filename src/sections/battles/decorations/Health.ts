import { IStatistic, Team } from "battlemovr";
import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../../FullScreenPokemon";
import { IBattleInfo, IPokemon } from "../../Battles";
import { IThing } from "../../Things";

/**
 * Decorations for health displays.
 */
export class Health extends Section<FullScreenPokemon> {
    /**
     * Adds a Pokemon's health display to its appropriate menu.
     *
     * @param battlerName   Which battler to add the display for.
     */
    public addPokemonHealth(pokemon: IPokemon, team: Team): void {
        const menu: string = team === Team.player
            ? "BattlePlayerHealth"
            : "BattleOpponentHealth";

        this.game.menuGrapher.createMenu(menu);
        this.game.menuGrapher.createMenu(menu + "Title");
        this.game.menuGrapher.createMenu(menu + "Level");
        this.game.menuGrapher.createMenu(menu + "Amount");

        this.setPokemonHealthBar(team, pokemon.statistics.health);

        this.game.menuGrapher.addMenuDialog(menu + "Title", [[pokemon.nickname]]);

        this.game.menuGrapher.addMenuDialog(menu + "Level", String(pokemon.level));
    }

    /**
     * Slides a Pokemon's health bar to reflect changing health amounts.
     *
     * @param team   Team whose actor's health is changing.
     * @param from   Original health amount.
     * @param to   New health amount.
     * @param onComplete   Handler for when this is done.
     * @remarks This doesn't change the actor's statistic.
     */
    public animatePokemonHealthBar(team: Team, from: number, to: number, onComplete: () => void): void {
        const battleInfo: IBattleInfo = this.game.battleMover.getBattleInfo() as IBattleInfo;
        const statistic: IStatistic = battleInfo.teams[Team[team]].selectedActor.statistics.health;
        const normal: number = statistic.normal;
        const delta: number = (to - from) > 0 ? 1 : -1;
        const repeats: number = Math.abs(to - from);
        let current: number = statistic.current;

        this.game.timeHandler.addEventInterval(
            (): void => {
                current += delta;
                this.setPokemonHealthBar(team, { current, normal });
            },
            2,
            repeats);

        this.game.timeHandler.addEvent(onComplete, (repeats * 2) + 35);
    }

    /**
     * Adds a health bar to a battle display, with an appropriate width.
     *
     * @param team   Which team to add the display for.
     * @param statistic   Health summary for the team's selected actor.
     */
    private setPokemonHealthBar(team: Team, health: IStatistic): void {
        const nameUpper: string = team === Team.player ? "Player" : "Opponent";
        const bar: IThing = this.game.utilities.getExistingThingById("HPBarFill" + nameUpper);
        const barWidth: number = this.game.equations.widthHealthBar(100, health);
        const healthDialog: string = this.game.utilities.makeDigit(health.current, 3, "\t")
            + "/"
            + this.game.utilities.makeDigit(health.normal, 3, "\t");

        if (team === Team.player) {
            const menuNumbers: string = "Battle" + nameUpper + "HealthNumbers";
            this.game.menuGrapher.createMenu(menuNumbers);
            this.game.menuGrapher.addMenuDialog(menuNumbers, healthDialog);
        }

        this.game.physics.setWidth(bar, barWidth);
        bar.hidden = barWidth === 0;
    }
}
