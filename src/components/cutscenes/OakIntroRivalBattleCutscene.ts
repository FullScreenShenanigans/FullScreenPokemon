import { BattleOutcome } from "battlemovr";
import { GeneralComponent } from "eightbittr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { IPartialBattleOptions } from "../Battles";
import { Direction } from "../Constants";
import { ICharacter } from "../Things";

/**
 * OakIntroRivalBattle cutscene routines.
 */
export class OakIntroRivalBattleCutscene<TEightBittr extends FullScreenPokemon> extends GeneralComponent<TEightBittr> {
    /**
     * Cutscene for the rival challenging the player to a Pokemon battle.
     *
     * @param settings   Settings used for the cutscene.
     */
    public async Approach(settings: any): Promise<void> {
        const rival: ICharacter = this.eightBitter.utilities.getExistingThingById("Rival") as ICharacter;
        const dx: number = Math.abs(settings.triggerer.left - settings.player.left);
        const further: boolean = dx < 4;

        await this.eightBitter.audioPlayer.play(
            this.eightBitter.audio.names.rivalAppears,
            {
                alias: this.eightBitter.audio.aliases.theme,
                loop: true,
            });

        settings.rival = rival;
        this.eightBitter.actions.animateCharacterSetDirection(rival, Direction.Bottom);
        this.eightBitter.actions.animateCharacterSetDirection(settings.player, Direction.Top);

        this.eightBitter.menuGrapher.createMenu("GeneralText");
        this.eightBitter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%RIVAL%%%%%%%: Wait, %%%%%%%PLAYER%%%%%%%! Let's check out our %%%%%%%POKEMON%%%%%%%!",
                "Come on, I'll take you on!",
            ],
            this.eightBitter.scenePlayer.bindRoutine("Challenge", { further }));
        this.eightBitter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the battle between the player and the rival.
     *
     * @param settings   Settings used for the cutscene.
     * @param args   Settings for the routine.
     */
    public Challenge(settings: any, args: any): void {
        const starterRival: string[] = this.eightBitter.itemsHolder.getItem(this.eightBitter.storage.names.starterRival);
        const battleInfo: IPartialBattleOptions = {
            onComplete: (): void => {
                this.eightBitter.scenePlayer.startCutscene("OakIntroRivalLeaves");
            },
            teams: {
                opponent: {
                    leader: {
                        title: "RivalPortrait".split(""),
                        nickname: this.eightBitter.itemsHolder.getItem(this.eightBitter.storage.names.nameRival),
                    },
                    nextCutscene: "OakIntroRivalLeaves",
                    reward: 175,
                    actors: [
                        this.eightBitter.equations.newPokemon({
                            level: 5,
                            title: starterRival,
                        }),
                    ],
                },
            },
            texts: {
                start: (): string => "%%%%%%%RIVAL%%%%%%% wants to fight!",
                outcomes: {
                    [BattleOutcome.opponentVictory]: (): string => "%%%%%%%RIVAL%%%%%%%: Yeah! Am I great or what?",
                    [BattleOutcome.playerVictory]: (): string => [
                        "%%%%%%%RIVAL%%%%%%%: WHAT?",
                        "Unbelievable!",
                        "I picked the wrong %%%%%%%POKEMON%%%%%%%!",
                    ].join(" "),
                },
            },
            // noBlackout: true,
            keptThings: this.eightBitter.graphics.collectBattleKeptThings(["player", "Rival"]),
        };
        let blocks: number;

        switch (this.eightBitter.itemsHolder.getItem(this.eightBitter.storage.names.starterRival).join("")) {
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

        this.eightBitter.actions.walking.startWalkingOnPath(
            settings.rival,
            [
                {
                    blocks,
                    direction: Direction.Left,
                },
                {
                    blocks: 1,
                    direction: Direction.Bottom,
                },
                (): void => {
                    this.eightBitter.battles.startBattle(battleInfo);
                },
            ]);
    }
}
