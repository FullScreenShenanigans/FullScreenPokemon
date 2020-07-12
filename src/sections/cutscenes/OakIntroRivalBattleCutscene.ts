import { BattleOutcome } from "battlemovr";
import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { IPartialBattleOptions } from "../Battles";
import { Direction } from "../Constants";
import { ICharacter } from "../Things";

/**
 * OakIntroRivalBattle cutscene routines.
 */
export class OakIntroRivalBattleCutscene extends Section<FullScreenPokemon> {
    /**
     * Cutscene for the rival challenging the player to a Pokemon battle.
     *
     * @param settings   Settings used for the cutscene.
     */
    public async Approach(settings: any): Promise<void> {
        const rival: ICharacter = this.game.utilities.getExistingThingById("Rival") as ICharacter;
        const dx: number = Math.abs(settings.triggerer.left - settings.player.left);
        const further: boolean = dx < 4;

        await this.game.audioPlayer.play(this.game.audio.names.rivalAppears, {
            alias: this.game.audio.aliases.theme,
            loop: true,
        });

        settings.rival = rival;
        this.game.actions.animateCharacterSetDirection(rival, Direction.Bottom);
        this.game.actions.animateCharacterSetDirection(settings.player, Direction.Top);

        this.game.menuGrapher.createMenu("GeneralText");
        this.game.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%RIVAL%%%%%%%: Wait, %%%%%%%PLAYER%%%%%%%! Let's check out our %%%%%%%POKEMON%%%%%%%!",
                "Come on, I'll take you on!",
            ],
            this.game.scenePlayer.bindRoutine("Challenge", { further })
        );
        this.game.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the battle between the player and the rival.
     *
     * @param settings   Settings used for the cutscene.
     * @param args   Settings for the routine.
     */
    public Challenge(settings: any, args: any): void {
        const starterRival: string[] = this.game.itemsHolder.getItem(
            this.game.storage.names.starterRival
        );
        const battleInfo: IPartialBattleOptions = {
            onComplete: (): void => {
                this.game.scenePlayer.startCutscene("OakIntroRivalLeaves");
            },
            teams: {
                opponent: {
                    leader: {
                        title: "RivalPortrait".split(""),
                        nickname: this.game.itemsHolder.getItem(
                            this.game.storage.names.nameRival
                        ),
                    },
                    nextCutscene: "OakIntroRivalLeaves",
                    reward: 175,
                    actors: [
                        this.game.equations.newPokemon({
                            level: 5,
                            title: starterRival,
                        }),
                    ],
                },
            },
            texts: {
                start: (): string => "%%%%%%%RIVAL%%%%%%% wants to fight!",
                outcomes: {
                    [BattleOutcome.opponentVictory]: (): string =>
                        "%%%%%%%RIVAL%%%%%%%: Yeah! Am I great or what?",
                    [BattleOutcome.playerVictory]: (): string =>
                        [
                            "%%%%%%%RIVAL%%%%%%%: WHAT?",
                            "Unbelievable!",
                            "I picked the wrong %%%%%%%POKEMON%%%%%%%!",
                        ].join(" "),
                },
            },
            // noBlackout: true,
            keptThings: this.game.graphics.collections.collectBattleKeptThings([
                "player",
                "Rival",
            ]),
        };
        let blocks: number;

        switch (this.game.itemsHolder.getItem(this.game.storage.names.starterRival).join("")) {
            case "SQUIRTLE":
                blocks = 2;
                break;
            case "BULBASAUR":
                blocks = 3;
                break;
            case "CHARMANDER":
                blocks = 1;
                break;
            default:
                throw new Error("Unknown starterRival.");
        }

        if (args.further) {
            blocks += 1;
        }

        this.game.actions.walking.startWalkingOnPath(settings.rival, [
            {
                blocks,
                direction: Direction.Left,
            },
            {
                blocks: 1,
                direction: Direction.Bottom,
            },
            (): void => {
                this.game.battles.startBattle(battleInfo);
            },
        ]);
    }
}
