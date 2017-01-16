import { IStatistic } from "battlemovr/lib/Actors";
import { Team } from "battlemovr/lib/Teams";
import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../../../FullScreenPokemon";
import { IBattleInfo, IPokemon } from "../../Battles";
import { IThing } from "../../Things";

/**
 * Decorations for health displays.
 */
export class Health<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {

    /**
     * Adds a Pokemon's health display to its appropriate menu.
     * 
     * @param battlerName   Which battler to add the display for.
     */
    public addPokemonHealth(pokemon: IPokemon, team: Team): void {
        const menu: string = team === Team.player
            ? "BattlePlayerHealth"
            : "BattleOpponentHealth";

        this.gameStarter.menuGrapher.createMenu(menu);
        this.gameStarter.menuGrapher.createMenu(menu + "Title");
        this.gameStarter.menuGrapher.createMenu(menu + "Level");
        this.gameStarter.menuGrapher.createMenu(menu + "Amount");

        this.setPokemonHealthBar(team, pokemon.statistics.health);

        this.gameStarter.menuGrapher.addMenuDialog(menu + "Title", [[pokemon.nickname]]);

        this.gameStarter.menuGrapher.addMenuDialog(menu + "Level", String(pokemon.level));
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
        const battleInfo: IBattleInfo = this.gameStarter.battleMover.getBattleInfo() as IBattleInfo;
        const statistic: IStatistic = battleInfo.teams[Team[team]].selectedActor.statistics.health;
        const normal: number = statistic.normal;
        const delta: number = (to - from) > 0 ? 1 : -1;
        const repeats: number = Math.abs(to - from);
        let current: number = statistic.current;

        this.gameStarter.timeHandler.addEventInterval(
            (): void => {
                current += delta;
                this.setPokemonHealthBar(team, { current, normal });
            },
            2,
            repeats);

        this.gameStarter.timeHandler.addEvent(onComplete, (repeats * 2) + 35);
    }

    /**
     * Adds a health bar to a battle display, with an appropriate width.
     * 
     * @param team   Which team to add the display for.
     * @param statistic   Health summary for the team's selected actor.
     */
    private setPokemonHealthBar(team: Team, health: IStatistic): void {
        const nameUpper: string = team === Team.player ? "Player" : "Opponent";
        const bar: IThing = this.gameStarter.utilities.getThingById("HPBarFill" + nameUpper);
        const barWidth: number = this.gameStarter.equations.widthHealthBar(100, health);
        const healthDialog: string = this.gameStarter.utilities.makeDigit(health.current, 3, "\t")
            + "/"
            + this.gameStarter.utilities.makeDigit(health.normal, 3, "\t");

        if (team === Team.player) {
            const menuNumbers: string = "Battle" + nameUpper + "HealthNumbers";
            this.gameStarter.menuGrapher.createMenu(menuNumbers);
            this.gameStarter.menuGrapher.addMenuDialog(menuNumbers, healthDialog);
        }

        this.gameStarter.physics.setWidth(bar, barWidth);
        bar.hidden = barWidth === 0;
    }
}
