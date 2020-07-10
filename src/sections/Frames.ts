import { Frames as EightBittrFrames } from "eightbittr";

import { FullScreenPokemon } from "../FullScreenPokemon";
import { ICharacter, IThing } from "./Things";

export interface IFrames {
    Character: ICharacter;
    Scenery: IThing;
    Solid: IThing;
    Terrain: IThing;
    Text: IThing;
    [i: string]: IThing;
}

/**
 * Collection settings for IThing group names.
 */
export class Frames<TEightBittr extends FullScreenPokemon> extends EightBittrFrames<TEightBittr> {
    // 2. Groups are updated for velocities and pruned.
    public maintain() {
        super.maintain();
        this.game.players.forEach(this.game.maintenance.maintainPlayer);
    }
}
