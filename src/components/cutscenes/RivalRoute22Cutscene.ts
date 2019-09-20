import { BattleOutcome } from "battlemovr";
import { GeneralComponent } from "eightbittr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { IWalkingInstructions } from "../actions/Walking";
import { IPartialBattleOptions } from "../Battles";
import { Direction } from "../Constants";
import { ICharacter, IPlayer } from "../Things";

/**
 * RivalRoute22 cutscene routines.
 */
export class RivalRoute22Cutscene<TEightBittr extends FullScreenPokemon> extends GeneralComponent<TEightBittr> {
    /**
     * Cutscene for encountering the rival on Route 22.
     *
     * @param settings   Settings used for the cutscene.
     */
    public RivalEmerges(settings: any): void {
        const player: IPlayer = settings.player;
        const triggerer: ICharacter = settings.triggerer;
        const playerUpper: number = Number(Math.abs(player.top - triggerer.top) < 4);
        const rival: ICharacter = this.eightBitter.objectMaker.make<ICharacter>(this.eightBitter.things.names.rival, {
            direction: 0,
            nocollide: true,
            opacity: 0,
        });
        const walkingInstructions: IWalkingInstructions = [
            {
                blocks: 2,
                direction: Direction.Top,
            },
            {
                blocks: playerUpper + 3,
                direction: Direction.Right,
            },
        ];

        if (playerUpper) {
                walkingInstructions.push(() => this.eightBitter.actions.animateCharacterSetDirection(rival, 0));
        }

        settings.rival = rival;

        walkingInstructions.push(this.eightBitter.scenePlayer.bindRoutine("RivalTalks"));

        this.eightBitter.animations.fading.animateFadeAttribute(rival, "opacity", 0.2, 1, 3);
        this.eightBitter.things.add(rival, triggerer.left - 112, triggerer.top + 96);
        this.eightBitter.actions.walking.startWalkingOnPath(rival, walkingInstructions);
    }

    /**
     * Cutscene for the rival talking to the player before the battle.
     *
     * @param settings   Settings used for the cutscene.
     */
    public RivalTalks(settings: any): void {
        this.eightBitter.actions.animateCharacterSetDirection(
            settings.player,
            // tslint:disable-next-line no-unnecessary-type-assertion
            this.eightBitter.physics.getDirectionBordering(settings.player, settings.rival)!);

        this.eightBitter.menuGrapher.createMenu("GeneralText");
        this.eightBitter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%RIVAL%: Hey! %PLAYER%!",
                "You're going to %POKEMON% LEAGUE?",
                "Forget it! You probably don't have any BADGES!",
                "The guard won't let you through!",
                "By the way did your %POKEMON% get any stronger?",
            ],
            this.eightBitter.scenePlayer.bindRoutine("Challenge"));
        this.eightBitter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the battle between the player and the rival.
     *
     * @param settings  Settings used for the cutscene.
     */
    public Challenge(): void {
        const starterRival: string[] = this.eightBitter.itemsHolder.getItem(this.eightBitter.storage.names.starterRival);
        const battleInfo: IPartialBattleOptions = {
            onComplete: (): void => {
                this.eightBitter.scenePlayer.startCutscene("RivalRoute22Leaves");
            },
            teams: {
                opponent: {
                    leader: {
                        title: "RivalPortrait".split(""),
                        nickname: this.eightBitter.itemsHolder.getItem(this.eightBitter.storage.names.nameRival),
                    },
                    nextCutscene: "RivalRoute22Leaves",
                    reward: 280,
                    actors: [
                        this.eightBitter.equations.newPokemon({
                            level: 8,
                            title: starterRival,
                        }),
                        this.eightBitter.equations.newPokemon({
                            level: 9,
                            title: "PIDGEY".split(""),
                        }),
                    ],
                },
            },
            texts: {
                start: (): string => "%RIVAL% wants to fight!",
                outcomes: {
                    [BattleOutcome.opponentVictory]: (): string => "%RIVAL%: Yeah! Am I great or what?",
                    [BattleOutcome.playerVictory]: (): string => "Aww! You just lucked out!",
                },
            },
            keptThings: this.eightBitter.graphics.collections.collectBattleKeptThings(["player", "Rival"]),
        };

        this.eightBitter.battles.startBattle(battleInfo);
      }
}
