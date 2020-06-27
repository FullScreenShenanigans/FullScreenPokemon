import { IMod } from "modattachr";

import { ICharacter, IEnemy } from "../../components/Things";
import { ModComponent } from "./ModComponent";

/**
 * Mod to make all enemy trainers Joey and all Pokemon his Rattata.
 */
export class JoeysRattataMod extends ModComponent implements IMod {
    /**
     * Name of the mod.
     */
    public static readonly modName: string = "Joey's Rattata";

    /**
     * Mod events, keyed by name.
     */
    public readonly events = {
        [this.eventNames.onModEnable]: (): void => {
            (this.eightBitter.groupHolder.getGroup("Character") as ICharacter[])
                .filter((character: ICharacter): boolean => !!character.trainer)
                .forEach((character: IEnemy): void => {
                    character.previousTitle = character.title;
                    character.title = (character as any).thing = "BugCatcher";
                    this.eightBitter.thingHitter.cacheChecksForType(character.title, "Character");
                    this.eightBitter.graphics.classes.setClass(character, character.className);
                });
        },
        [this.eventNames.onModDisable]: (): void => {
            (this.eightBitter.groupHolder.getGroup("Character") as ICharacter[])
                .filter((character: ICharacter): boolean => !!character.trainer)
                .forEach((character: IEnemy): void => {
                    character.title = (character as any).thing = character.previousTitle!;
                    this.eightBitter.thingHitter.cacheChecksForType(character.title, "Character");
                    this.eightBitter.graphics.classes.setClass(character, character.className);
                });
        },
        [this.eventNames.onBattleStart]: (battleInfo: any): void => {
            console.log("Should modify battle start info", battleInfo);
            // const opponent: IBattler = battleInfo.battlers.opponent;

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
