import { Component } from "eightbittr/lib/Component";
import { IMod } from "modattachr/lib/IModAttachr";

import { FullScreenPokemon } from "../FullScreenPokemon";
import { BlindTrainersMod } from "./mods/BlindTrainersMod";
import { EventNames } from "./mods/EventNames";
import { InfiniteRepelMod } from "./mods/InfiniteRepelMod";
import { JoeysRattataMod } from "./mods/JoeysRattataMod";
import { Level100Mod } from "./mods/Level100Mod";
import { NuzlockeChallengeMod } from "./mods/NuzlockeChallengeMod";
import { RandomHeldItemsMod } from "./mods/RandomHeldItemsMod";
import { RandomizeWildPokemonMod } from "./mods/RandomizeWildPokemonMod";
import { RepeatTrainersMod } from "./mods/RepeatTrainersMod";
import { RunningIndoorsMod } from "./mods/RunningIndoorsMod";
import { ScalingLevelsMod } from "./mods/ScalingLevelsMod";
import { SpeedrunnerMod } from "./mods/SpeedrunnerMod";
import { WalkThroughWallsMod } from "./mods/WalkThroughWallsMod";

/**
 * Mods used by FullScreenPokemon instances.
 */
export class Mods<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
    /**
     * Keys for mod events.
     */
    public readonly eventNames: EventNames = new EventNames();

    /**
     * General schemas for known mods, including names and events.
     */
    public readonly mods: IMod[] = [
        new BlindTrainersMod(this.gameStarter, this.eventNames),
        new InfiniteRepelMod(this.gameStarter, this.eventNames),
        new JoeysRattataMod(this.gameStarter, this.eventNames),
        new Level100Mod(this.gameStarter, this.eventNames),
        new NuzlockeChallengeMod(this.gameStarter, this.eventNames),
        new RandomHeldItemsMod(this.gameStarter, this.eventNames),          
        new RandomizeWildPokemonMod(this.gameStarter, this.eventNames),
        new RepeatTrainersMod(this.gameStarter, this.eventNames),
        new RunningIndoorsMod(this.gameStarter, this.eventNames),
        new ScalingLevelsMod(this.gameStarter, this.eventNames),
        new SpeedrunnerMod(this.gameStarter, this.eventNames),
        new WalkThroughWallsMod(this.gameStarter, this.eventNames)
    ];
}
