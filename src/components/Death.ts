import { Death as EightBittrDeath } from "eightbittr";

import { FullScreenPokemon } from "../FullScreenPokemon";

import { IThing } from "./Things";

/**
 * Removes Things from the game.
 */
export class Death<TEightBittr extends FullScreenPokemon> extends EightBittrDeath<TEightBittr> {
    /**
     * Generically kills all Things.
     */
    public killAll() {
        this.eightBitter.groupHolder.callOnAll((thing: IThing) => {
            this.killNormal(thing);
        })
    }
}
