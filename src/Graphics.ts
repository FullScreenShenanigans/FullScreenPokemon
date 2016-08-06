/// <reference path="../typings/GameStartr.d.ts" />

import { FullScreenPokemon } from "./FullScreenPokemon";
import { IBattleInfo, IThing } from "./IFullScreenPokemon";

/**
 * Graphics functions used by FullScreenPokemon instances.
 */
export class Graphics<TEightBittr extends FullScreenPokemon> extends GameStartr.Graphics<TEightBittr> {
    /**
     * Collects all unique Things that should be kept on top of battle intro animations.
     * 
     * @param thingsRaw   Titles of and/or references to Things that should be kept.
     * @returns The unique Things that will be kept.
     */
    public collectBattleKeptThings(thingsRaw: (string | IThing)[]): IThing[] {
        const things: IThing[] = [this.EightBitter.player];
        const used: { [i: string]: IThing } = {
            [this.EightBitter.player.title]: this.EightBitter.player
        };

        for (const thingRaw of thingsRaw) {
            const thing: IThing = thingRaw.constructor === String
                ? this.EightBitter.utilities.getThingById(<string>thingRaw)
                : <IThing>thingRaw;

            if (!used[thing.title]) {
                used[thing.title] = thing;
                things.push(thing);
            }
        }

        return things;
    }

    /**
     * Moves all kept Things in a battle to the Text group for animations.
     * 
     * @param batleInfo    In-game state and settings for an ongoing battle.
     */
    public moveBattleKeptThingsToText(battleInfo: IBattleInfo): void {
        let keptThings: IThing[] = battleInfo.keptThings;

        if (!keptThings) {
            return;
        }

        for (const keptThing of keptThings) {
            this.EightBitter.GroupHolder.switchMemberGroup(keptThing, keptThing.groupType, "Text");
        }
    }

    /**
     * Moves all kept Things in a battle back to their original groups.
     * 
     * @param batleInfo    In-game state and settings for an ongoing battle.
     */
    public moveBattleKeptThingsBack(battleInfo: IBattleInfo): void {
        let keptThings: IThing[] = battleInfo.keptThings;

        if (!keptThings) {
            return;
        }

        for (const keptThing of keptThings) {
            this.EightBitter.GroupHolder.switchMemberGroup(keptThing, "Text", keptThing.groupType);
        }
    }
}
