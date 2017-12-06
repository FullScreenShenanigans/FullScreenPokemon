import { BattleOutcome } from "battlemovr/lib/Animations";
import { Component } from "eightbittr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { IWalkingInstructions } from "../actions/Walking";
import { IPartialBattleOptions } from "../Battles";
import { Direction } from "../Constants";
import { ICharacter, IPlayer } from "../Things";

/**
 * RivalRoute22 cutscene functions used by FullScreenPokemon instances.
 */
export class RivalRoute22Cutscene<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
    /**
     * Cutscene for encountering the rival on Route 22.
     *
     * @param settings   Settings used for the cutscene.
     */
    public RivalEmerges(settings: any): void {
        const player: IPlayer = settings.player;
        const triggerer: ICharacter = settings.triggerer;
        const playerUpper: number = Number(Math.abs(player.top - triggerer.top) < 4);
        const rival: ICharacter = this.gameStarter.objectMaker.make<ICharacter>(this.gameStarter.things.names.rival, {
            direction: 0,
            nocollide: true,
            opacity: 0
        });
        const walkingInstructions: IWalkingInstructions = [
            {
                blocks: 2,
                direction: Direction.Top
            },
            {
                blocks: playerUpper + 3,
                direction: Direction.Right
            }
        ];

        if (playerUpper) {
                walkingInstructions.push(() => this.gameStarter.actions.animateCharacterSetDirection(rival, 0));
        }

        settings.rival = rival;

        walkingInstructions.push(this.gameStarter.scenePlayer.bindRoutine("RivalTalks"));

        this.gameStarter.actions.animateFadeAttribute(rival, "opacity", .2, 1, 3);
        this.gameStarter.things.add(rival, triggerer.left - 112, triggerer.top + 96);
        this.gameStarter.actions.walking.startWalkingOnPath(rival, walkingInstructions);
    }

    /**
     * Cutscene for the rival talking to the player before the battle.
     *
     * @param settings   Settings used for the cutscene.
     */
    public RivalTalks(settings: any): void {
        this.gameStarter.actions.animateCharacterSetDirection(
            settings.player,
            this.gameStarter.physics.getDirectionBordering(settings.player, settings.rival)!);

        this.gameStarter.menuGrapher.createMenu("GeneralText");
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%RIVAL%%%%%%%: Hey! %%%%%%%PLAYER%%%%%%%!",
                "You're going to %%%%%%%POKEMON%%%%%%% LEAGUE?",
                "Forget it! You probably don't have any BADGES!",
                "The guard won't let you through!",
                "By the way did your %%%%%%%POKEMON%%%%%%% get any stronger?"
            ],
            this.gameStarter.scenePlayer.bindRoutine("Challenge"));
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the battle between the player and the rival.
     *
     * @param settings  Settings used for the cutscene.
     */
    public Challenge(): void {
        const starterRival: string[] = this.gameStarter.itemsHolder.getItem("starterRival");
        const battleInfo: IPartialBattleOptions = {
            onComplete: (): void => {
                this.gameStarter.scenePlayer.startCutscene("RivalRoute22Leaves");
            },
            teams: {
                opponent: {
                    leader: {
                        title: "RivalPortrait".split(""),
                        nickname: this.gameStarter.itemsHolder.getItem("nameRival"),
                    },
                    nextCutscene: "RivalRoute22Leaves",
                    reward: 280,
                    actors: [
                        this.gameStarter.equations.newPokemon({
                            level: 8,
                            title: starterRival
                        }),
                        this.gameStarter.equations.newPokemon({
                            level: 9,
                            title: "PIDGEY".split("")
                        })
                    ]
                }
            },
            texts: {
                start: (): string => "%%%%%%%RIVAL%%%%%%% wants to fight!",
                outcomes: {
                    [BattleOutcome.opponentVictory]: (): string => "%%%%%%%RIVAL%%%%%%%: Yeah! Am I great or what?",
                    [BattleOutcome.playerVictory]: (): string => "Aww! You just lucked out!"
                }
            },
            keptThings: this.gameStarter.graphics.collectBattleKeptThings(["player", "Rival"])
        };

        this.gameStarter.battles.startBattle(battleInfo);
      }
}
