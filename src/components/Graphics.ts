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
     * @param keptThings    Things that should be visible above text animations.
     */
    public moveThingsToText(things: IThing[]): void {
        for (const thing of things) {
            this.gameStarter.groupHolder.switchMemberGroup(thing, thing.groupType, "Text");
        }
    }

    /**
     * Moves kept Things 
     * 
     * @remarks This is necessary because animations may put backgrounds
     *          as the first Text Thing after keptThings were added.
     */
    public moveThingsBeforeBackgrounds(things: IThing[]): void {
        const texts: IThing[] = this.gameStarter.groupHolder.getGroup("Text") as IThing[];

        for (const thing of things) {
            texts.splice(texts.indexOf(thing), 1);
            texts.splice(0, 0, thing);
        }
    }

    /**
     * Moves all kept Things in a battle back to their original groups.
     * 
     * @param keptThings    Things that should be visible above text animations.
     */
    public moveThingsFromText(things: IThing[]): void {
        for (const keptThing of things) {
            this.gameStarter.groupHolder.switchMemberGroup(keptThing, "Text", keptThing.groupType);
        }
    }
}
