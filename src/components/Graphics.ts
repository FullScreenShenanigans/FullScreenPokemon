import { Graphics as GameStartrGraphics } from "gamestartr/lib/components/Graphics";

import { FullScreenPokemon } from "../FullScreenPokemon";
import { IThing } from "./Things";

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
        const things: IThing[] = [this.gameStarter.players[0]];
        const used: { [i: string]: IThing } = {
            [this.gameStarter.players[0].title]: this.gameStarter.players[0]
        };

        for (const thingRaw of thingsRaw) {
            const thing: IThing = thingRaw.constructor === String
                ? this.gameStarter.utilities.getThingById(thingRaw as string)
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
     * @param batleInfo    Things that should be visible above the starting animation.
     */
    public moveBattleKeptThingsToText(keptThings?: IThing[]): void {
        if (!keptThings) {
            return;
        }

        for (const keptThing of keptThings) {
            this.gameStarter.groupHolder.switchMemberGroup(keptThing, keptThing.groupType, "Text");
        }
    }

    /**
     * Moves all kept Things in a battle back to their original groups.
     * 
     * @param batleInfo    Things that should be visible above the starting animation.
     */
    public moveBattleKeptThingsBack(keptThings: IThing[] | undefined): void {
        if (!keptThings) {
            return;
        }

        for (const keptThing of keptThings) {
            this.gameStarter.groupHolder.switchMemberGroup(keptThing, "Text", keptThing.groupType);
        }
    }
}
