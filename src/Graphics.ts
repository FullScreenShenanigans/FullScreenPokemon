/// <reference path="../typings/GameStartr.d.ts" />

import { FullScreenPokemon } from "./FullScreenPokemon";
import { IArea, IAreaBoundaries, IMap, IPreThing } from "./IFullScreenPokemon";
import { Direction } from "./Constants";

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
        let things: IThing[] = [this.player],
            used: { [i: string]: IThing } = {
                [this.player.title]: this.player
            };

        for (let thingRaw of thingsRaw) {
            let thing: IThing = thingRaw.constructor === String
                ? this.getThingById(<string>thingRaw)
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

        for (let keptThing of keptThings) {
            this.GroupHolder.switchMemberGroup(keptThing, keptThing.groupType, "Text");
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

        for (let keptThing of keptThings) {
            this.GroupHolder.switchMemberGroup(keptThing, "Text", keptThing.groupType);
        }
    }
}
