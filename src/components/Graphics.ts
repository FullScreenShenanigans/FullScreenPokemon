import { Graphics as GameStartrGraphics } from "gamestartr/lib/components/Graphics";

import { FullScreenPokemon } from "../FullScreenPokemon";
import { IBattleInfo, IThing } from "../IFullScreenPokemon";

/**
 * Graphics functions used by FullScreenPokemon instances.
 */
export class Graphics<TGameStartr extends FullScreenPokemon> extends GameStartrGraphics<TGameStartr> {
    /**
     * Collects all unique Things that should be kept on top of battle intro animations.
     * 
     * @param thingsRaw   Titles of and/or references to Things that should be kept.
     * @returns The unique Things that will be kept.
     */
    public collectBattleKeptThings(thingsRaw: (string | IThing)[]): IThing[] {
        const things: IThing[] = [this.gameStarter.player];
        const used: { [i: string]: IThing } = {
            [this.gameStarter.player.title]: this.gameStarter.player
        };

        for (const thingRaw of thingsRaw) {
            const thing: IThing = thingRaw.constructor === String
                ? this.utilities.getThingById(thingRaw as string)
                : thingRaw as IThing;

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
        const keptThings: IThing[] | undefined = battleInfo.keptThings;
        if (!keptThings) {
            return;
        }

        for (const keptThing of keptThings) {
            this.groupHolder.switchMemberGroup(keptThing, keptThing.groupType, "Text");
        }
    }

    /**
     * Moves all kept Things in a battle back to their original groups.
     * 
     * @param batleInfo    In-game state and settings for an ongoing battle.
     */
    public moveBattleKeptThingsBack(battleInfo: IBattleInfo): void {
        const keptThings: IThing[] | undefined = battleInfo.keptThings;
        if (!keptThings) {
            return;
        }

        for (const keptThing of keptThings) {
            this.groupHolder.switchMemberGroup(keptThing, "Text", keptThing.groupType);
        }
    }
}
