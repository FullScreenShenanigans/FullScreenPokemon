import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { Health } from "./decorations/Health";

/**
 * Decoration handlers used by FullScreenPokemon instances.
 */
export class Decorations<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
    /**
     * Decorations for health displays.
     */
    public readonly health: Health<TGameStartr> = new Health(this.gameStarter);

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
}
