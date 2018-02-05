import { BattleOutcome } from "battlemovr";
import { GeneralComponent } from "gamestartr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { IPartialBattleOptions } from "../Battles";
import { Direction } from "../Constants";
import { ICharacter } from "../Things";

/**
 * OakIntroRivalBattle cutscene routines.
 */
export class OakIntroRivalBattleCutscene<TGameStartr extends FullScreenPokemon> extends GeneralComponent<TGameStartr> {
    /**
     * Cutscene for the rival challenging the player to a Pokemon battle.
     *
     * @param settings   Settings used for the cutscene.
     */
    public async Approach(settings: any): Promise<void> {
        const rival: ICharacter = this.gameStarter.utilities.getExistingThingById("Rival") as ICharacter;
        const dx: number = Math.abs(settings.triggerer.left - settings.player.left);
        const further: boolean = dx < 4;

        await this.gameStarter.audioPlayer.play(
            this.gameStarter.audio.names.rivalAppears,
            {
                alias: this.gameStarter.audio.aliases.theme,
                loop: true,
            });

        settings.rival = rival;
        this.gameStarter.actions.animateCharacterSetDirection(rival, Direction.Bottom);
        this.gameStarter.actions.animateCharacterSetDirection(settings.player, Direction.Top);

        this.gameStarter.menuGrapher.createMenu("GeneralText");
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%RIVAL%%%%%%%: Wait, %%%%%%%PLAYER%%%%%%%! Let's check out our %%%%%%%POKEMON%%%%%%%!",
                "Come on, I'll take you on!",
            ],
            this.gameStarter.scenePlayer.bindRoutine("Challenge", { further }));
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the battle between the player and the rival.
     *
     * @param settings   Settings used for the cutscene.
     * @param args   Settings for the routine.
     */
    public Challenge(settings: any, args: any): void {
        const starterRival: string[] = this.gameStarter.itemsHolder.getItem(this.gameStarter.storage.names.starterRival);
        const battleInfo: IPartialBattleOptions = {
            onComplete: (): void => {
                this.gameStarter.scenePlayer.startCutscene("OakIntroRivalLeaves");
            },
            teams: {
                opponent: {
                    leader: {
                        title: "RivalPortrait".split(""),
                        nickname: this.gameStarter.itemsHolder.getItem(this.gameStarter.storage.names.nameRival),
                    },
                    nextCutscene: "OakIntroRivalLeaves",
                    reward: 175,
                    actors: [
                        this.gameStarter.equations.newPokemon({
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
            keptThings: this.gameStarter.graphics.collectBattleKeptThings(["player", "Rival"]),
        };
        let blocks: number;

        switch (this.gameStarter.itemsHolder.getItem(this.gameStarter.storage.names.starterRival).join("")) {
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

        this.gameStarter.actions.walking.startWalkingOnPath(
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
                    this.gameStarter.battles.startBattle(battleInfo);
                },
            ]);
    }
}
