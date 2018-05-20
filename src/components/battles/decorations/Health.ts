import { IStatistic, Team } from "battlemovr";
import { GeneralComponent } from "eightbittr";

import { FullScreenPokemon } from "../../../FullScreenPokemon";
import { IBattleInfo, IPokemon } from "../../Battles";
import { IThing } from "../../Things";

/**
 * Decorations for health displays.
 */
export class Health<TEightBittr extends FullScreenPokemon> extends GeneralComponent<TEightBittr> {
    /**
     * Adds a Pokemon's health display to its appropriate menu.
     *
     * @param battlerName   Which battler to add the display for.
     */
    public addPokemonHealth(pokemon: IPokemon, team: Team): void {
        const menu: string = team === Team.player
            ? "BattlePlayerHealth"
            : "BattleOpponentHealth";

        this.eightBitter.menuGrapher.createMenu(menu);
        this.eightBitter.menuGrapher.createMenu(menu + "Title");
        this.eightBitter.menuGrapher.createMenu(menu + "Level");
        this.eightBitter.menuGrapher.createMenu(menu + "Amount");

        this.setPokemonHealthBar(team, pokemon.statistics.health);

        this.eightBitter.menuGrapher.addMenuDialog(menu + "Title", [[pokemon.nickname]]);

        this.eightBitter.menuGrapher.addMenuDialog(menu + "Level", String(pokemon.level));
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
        const battleInfo: IBattleInfo = this.eightBitter.battleMover.getBattleInfo() as IBattleInfo;
        const statistic: IStatistic = battleInfo.teams[Team[team]].selectedActor.statistics.health;
        const normal: number = statistic.normal;
        const delta: number = (to - from) > 0 ? 1 : -1;
        const repeats: number = Math.abs(to - from);
        let current: number = statistic.current;

        this.eightBitter.timeHandler.addEventInterval(
            (): void => {
                current += delta;
                this.setPokemonHealthBar(team, { current, normal });
            },
            2,
            repeats);

        this.eightBitter.timeHandler.addEvent(onComplete, (repeats * 2) + 35);
    }

    /**
     * Adds a health bar to a battle display, with an appropriate width.
     *
     * @param team   Which team to add the display for.
     * @param statistic   Health summary for the team's selected actor.
     */
    private setPokemonHealthBar(team: Team, health: IStatistic): void {
        const nameUpper: string = team === Team.player ? "Player" : "Opponent";
        const bar: IThing = this.eightBitter.utilities.getExistingThingById("HPBarFill" + nameUpper);
        const barWidth: number = this.eightBitter.equations.widthHealthBar(100, health);
        const healthDialog: string = this.eightBitter.utilities.makeDigit(health.current, 3, "\t")
            + "/"
            + this.eightBitter.utilities.makeDigit(health.normal, 3, "\t");

        if (team === Team.player) {
            const menuNumbers: string = "Battle" + nameUpper + "HealthNumbers";
            this.eightBitter.menuGrapher.createMenu(menuNumbers);
            this.eightBitter.menuGrapher.addMenuDialog(menuNumbers, healthDialog);
        }

        this.eightBitter.physics.setWidth(bar, barWidth);
        bar.hidden = barWidth === 0;
    }
}
