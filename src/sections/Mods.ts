import { Section } from "eightbittr";
import { IMod } from "modattachr";

import { FullScreenPokemon } from "../FullScreenPokemon";

import { BlindTrainersMod } from "./mods/BlindTrainersMod";
import { ModEventNames } from "./mods/EventNames";
import { InfiniteRepelMod } from "./mods/InfiniteRepelMod";
import { JoeysRattataMod } from "./mods/JoeysRattataMod";
import { Level100Mod } from "./mods/Level100Mod";
import { ModComponent } from "./mods/ModComponent";
import { NuzlockeChallengeMod } from "./mods/NuzlockeChallengeMod";
import { RandomHeldItemsMod } from "./mods/RandomHeldItemsMod";
import { RandomizeWildPokemonMod } from "./mods/RandomizeWildPokemonMod";
import { RepeatTrainersMod } from "./mods/RepeatTrainersMod";
import { RunningIndoorsMod } from "./mods/RunningIndoorsMod";
import { ScalingLevelsMod } from "./mods/ScalingLevelsMod";
import { SpeedRunningMod } from "./mods/SpeedRunningMod";
import { WalkThroughWallsMod } from "./mods/WalkThroughWallsMod";

/**
 * Class for a mod component.
 */
export interface IModComponentClass {
    /**
     * Name of the mod.
     */
    modName: string;

    new(eightBitter: FullScreenPokemon, eventNames: ModEventNames): ModComponent;
}

/**
 * Stores mod classes to create a ModAttachr.
 */
export class Mods<TEightBittr extends FullScreenPokemon> extends Section<TEightBittr> {
    /**
     * Classes for known mods.
     */
    public static readonly modClasses: IModComponentClass[] = [
        BlindTrainersMod,
        InfiniteRepelMod,
        JoeysRattataMod,
        Level100Mod,
        NuzlockeChallengeMod,
        RandomHeldItemsMod,
        RandomizeWildPokemonMod,
        RepeatTrainersMod,
        RunningIndoorsMod,
        ScalingLevelsMod,
        SpeedRunningMod,
        WalkThroughWallsMod,
    ];

    /**
     * Keys for mod events.
     */
    public readonly eventNames = new ModEventNames();

    /**
     * Known mods, keyed by mod name.
     */
    public readonly modsByName: Record<string, IMod> = {};

    /**
     * General schemas for known mods, including names and events.
     */
    public readonly mods: IMod[] = Mods.modClasses.map(
        (modClass) => this.modsByName[modClass.modName] = new modClass(this.game, this.eventNames));
}
