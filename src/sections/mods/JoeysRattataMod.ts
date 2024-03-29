import { Mod } from "modattachr";

import { Character, Enemy } from "../../sections/Actors";
import { ModComponent } from "./ModComponent";

/**
 * Mod to make all enemy trainers Joey and all Pokemon his Rattata.
 */
export class JoeysRattataMod extends ModComponent implements Mod {
    /**
     * Name of the mod.
     */
    public static readonly modName: string = "Joey's Rattata";

    /**
     * Mod events, keyed by name.
     */
    public readonly events = {
        [this.eventNames.onModEnable]: (): void => {
            this.game.groupHolder
                .getGroup("Character")
                .filter((character: Character): boolean => !!character.trainer)
                .forEach((character: Enemy): void => {
                    character.previousTitle = character.title;
                    character.title = (character as any).actor = "BugCatcher";
                    this.game.actorHitter.cacheChecksForType(character.title, "Character");
                    this.game.graphics.classes.setClass(character, character.className);
                });
        },
        [this.eventNames.onModDisable]: (): void => {
            this.game.groupHolder
                .getGroup("Character")
                .filter((character: Character): boolean => !!character.trainer)
                .forEach((character: Enemy): void => {
                    character.title = (character as any).actor = character.previousTitle!;
                    this.game.actorHitter.cacheChecksForType(character.title, "Character");
                    this.game.graphics.classes.setClass(character, character.className);
                });
        },
        [this.eventNames.onBattleStart]: (battleInfo: any): void => {
            console.log("Should modify battle start info", battleInfo);
            // const opponent: Battler = battleInfo.battlers.opponent;

            // opponent.sprite = "BugCatcherFront";
            // opponent.name = "YOUNGSTER JOEY".split("");

            // for (const actor of opponent.actors) {
            //     actor.title = actor.nickname = "RATTATA".split("");
            // }
        },
        [this.eventNames.onSetLocation]: (): void => {
            this.events.onModEnable();
        },
    };
}
