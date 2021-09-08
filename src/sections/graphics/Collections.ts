import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { Actor } from "../Actors";

/**
 * Collects Actors to change visuals en masse.
 */
export class Collections extends Section<FullScreenPokemon> {
    /**
     * Collects all unique Actors that should be kept on top of battle intro animations.
     *
     * @param actorsRaw   Titles of and/or references to Actors that should be kept.
     * @returns The unique Actors that will be kept.
     */
    public collectBattleKeptActors(actorsRaw: (string | Actor)[]): Actor[] {
        const actors: Actor[] = [this.game.players[0]];
        const used: { [i: string]: Actor } = {
            [this.game.players[0].title]: this.game.players[0],
        };

        for (const actorRaw of actorsRaw) {
            const actor: Actor =
                actorRaw.constructor === String
                    ? this.game.utilities.getExistingActorById(actorRaw)
                    : (actorRaw as Actor);

            if (!used[actor.title]) {
                used[actor.title] = actor;
                actors.push(actor);
            }
        }

        return actors;
    }

    /**
     * Moves all kept Actors in a battle to the Text group for animations.
     *
     * @param keptActors    Actors that should be visible above text animations.
     */
    public moveActorsToText(actors: Actor[]): void {
        for (const actor of actors) {
            this.game.groupHolder.switchGroup(actor, actor.groupType, "Text");
        }
    }

    /**
     * Moves kept Actors
     *
     * @remarks This is necessary because animations may put backgrounds
     *          as the first Text Actor after keptActors were added.
     */
    public moveActorsBeforeBackgrounds(actors: Actor[]): void {
        const texts: Actor[] = this.game.groupHolder.getGroup("Text");

        for (const actor of actors) {
            texts.splice(texts.indexOf(actor), 1);
            texts.splice(0, 0, actor);
        }
    }

    /**
     * Moves all kept Actors in a battle back to their original groups.
     *
     * @param keptActors    Actors that should be visible above text animations.
     */
    public moveActorsFromText(actors: Actor[]): void {
        for (const keptActor of actors) {
            this.game.groupHolder.switchGroup(keptActor, "Text", keptActor.groupType);
        }
    }
}
