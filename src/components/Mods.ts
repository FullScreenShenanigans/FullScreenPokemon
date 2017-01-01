import { Component } from "eightbittr/lib/Component";
import { IMod } from "modattachr/lib/IModAttachr";

import { FullScreenPokemon } from "../FullScreenPokemon";
import { BlindTrainersMod } from "./mods/BlindTrainersMod";
import { InfiniteRepelMod } from "./mods/InfiniteRepelMod";
import { JoeysRattataMod } from "./mods/JoeysRattataMod";
import { Level100Mod } from "./mods/Level100Mod";
import { NuzlockeChallengeMod } from "./mods/NuzlockeChallengeMod";
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
     * General schemas for known mods, including names and events.
     */
    public readonly mods: IMod[] = [
        new BlindTrainersMod(this.gameStarter),
        new InfiniteRepelMod(this.gameStarter),
        new JoeysRattataMod(this.gameStarter),
        new Level100Mod(this.gameStarter),
        new NuzlockeChallengeMod(this.gameStarter),
        new RepeatTrainersMod(this.gameStarter),
        new RunningIndoorsMod(this.gameStarter),
        new ScalingLevelsMod(this.gameStarter),
        new SpeedrunnerMod(this.gameStarter),
        new WalkThroughWallsMod(this.gameStarter)
    ];
}
