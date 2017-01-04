import { Component } from "eightbittr/lib/Component";
import { ICallbackRegister, IMod } from "modattachr/lib/IModAttachr";

import { ICharacter, IEnemy, } from "../../components/Things";
import { FullScreenPokemon } from "../../FullScreenPokemon";

/**
 * Mod to make all enemy trainers Joey and all Pokemon his Rattata.
 */
export class JoeysRattataMod<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> implements IMod {
    /**
     * Name of the mod.
     */
    public readonly name: string = "Joey's Rattata";

    /**
     * Mod events, keyed by name.
     */
    public readonly events: ICallbackRegister = {
        onModEnable: (): void => {
            (this.gameStarter.groupHolder.getGroup("Character") as ICharacter[])
                .filter((character: ICharacter): boolean => !!character.trainer)
                .forEach((character: IEnemy): void => {
                    character.previousTitle = character.title;
                    character.title = (character as any).thing = "BugCatcher";
                    this.gameStarter.thingHitter.cacheChecksForType(character.title, "Character");
                    this.gameStarter.graphics.setClass(character, character.className);
                });
        },
        onModDisable: (): void => {
            (this.gameStarter.groupHolder.getGroup("Character") as ICharacter[])
                .filter((character: ICharacter): boolean => !!character.trainer)
                .forEach((character: IEnemy): void => {
                    character.title = (character as any).thing = character.previousTitle!;
                    this.gameStarter.thingHitter.cacheChecksForType(character.title, "Character");
                    this.gameStarter.graphics.setClass(character, character.className);
                });
        },
        onBattleStart: (battleInfo: any): void => {
            console.log("Should modify battle start info", battleInfo);
            // const opponent: IBattler = battleInfo.battlers.opponent;

            // opponent.sprite = "BugCatcherFront";
            // opponent.name = "YOUNGSTER JOEY".split("");

            // for (const actor of opponent.actors) {
            //     actor.title = actor.nickname = "RATTATA".split("");
            // }
        },
        onSetLocation: (): void => {
            this.events.onModEnable!();
        }
    };
}
