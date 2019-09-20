import { GeneralComponent } from "eightbittr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { IThing } from "../Things";

/**
 * Collects Things to change visuals en masse.
 */
export class Collections<TEightBittr extends FullScreenPokemon> extends GeneralComponent<TEightBittr> {
    /**
     * Collects all unique Things that should be kept on top of battle intro animations.
     *
     * @param thingsRaw   Titles of and/or references to Things that should be kept.
     * @returns The unique Things that will be kept.
     */
    public collectBattleKeptThings(thingsRaw: (string | IThing)[]): IThing[] {
        const things: IThing[] = [this.eightBitter.players[0]];
        const used: { [i: string]: IThing } = {
            [this.eightBitter.players[0].title]: this.eightBitter.players[0],
        };

        for (const thingRaw of thingsRaw) {
            const thing: IThing = thingRaw.constructor === String
                ? this.eightBitter.utilities.getExistingThingById(thingRaw as string)
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
            this.eightBitter.groupHolder.switchGroup(thing, thing.groupType, this.eightBitter.groups.names.text);
        }
    }

    /**
     * Moves kept Things
     *
     * @remarks This is necessary because animations may put backgrounds
     *          as the first Text Thing after keptThings were added.
     */
    public moveThingsBeforeBackgrounds(things: IThing[]): void {
        const texts: IThing[] = this.eightBitter.groupHolder.getGroup(this.eightBitter.groups.names.text);

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
            this.eightBitter.groupHolder.switchGroup(keptThing, this.eightBitter.groups.names.text, keptThing.groupType);
        }
    }
}
