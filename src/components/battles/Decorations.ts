import { IStatistic } from "battlemovr/lib/Actors";
import { Team } from "battlemovr/lib/Teams";
import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { IPokemon } from "../Battles";
import { IThing } from "../Things";

/**
 * Decoration handlers used by FullScreenPokemon instances.
 */
export class Decorations<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
    /**
     * Adds Pokeballs to a menu.
     * 
     * @param menu   Name of the container menu.
     * @param filled   How many balls are filled.
     * @param reverse   Whether to reverse the balls order.
     */
    public addPokeballs(menu: string, filled: number, reverse?: boolean): void {
        const text: string[][] = [];

        for (let i: number = 0; i < filled; i += 1) {
            text.push(["Ball"]);
        }

        for (let i: number = filled; i < 6; i += 1) {
            text.push(["BallEmpty"]);
        }

        if (reverse) {
            text.reverse();
        }

        this.gameStarter.menuGrapher.addMenuDialog(menu, [text]);
    }

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
     * Adds a health bar to a battle display, with an appropriate width.
     * 
     * @param team   Which team to add the display for.
     * @param statistic   Health summary for the team's selected actor.
     */
    private setPokemonHealthBar(team: Team, health: IStatistic): void {
        const nameUpper: string = team === Team.player ? "Player" : "Opponent";
        const menuNumbers: string = "Battle" + nameUpper + "HealthNumbers";
        const bar: IThing = this.gameStarter.utilities.getThingById("HPBarFill" + nameUpper);
        const barWidth: number = this.gameStarter.equations.widthHealthBar(100, health);
        const healthDialog: string = this.gameStarter.utilities.makeDigit(health.current, 3, "\t")
            + "/"
            + this.gameStarter.utilities.makeDigit(health.normal, 3, "\t");

        if (this.gameStarter.menuGrapher.getMenu(menuNumbers)) {
            for (const menu of this.gameStarter.menuGrapher.getMenu(menuNumbers).children) {
                this.gameStarter.physics.killNormal(menu as IThing);
            }

            this.gameStarter.menuGrapher.addMenuDialog(menuNumbers, healthDialog);
        }

        this.gameStarter.physics.setWidth(bar, barWidth);
        bar.hidden = barWidth === 0;
    }
}
