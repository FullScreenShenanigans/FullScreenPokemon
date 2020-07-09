import { BattleOutcome } from "battlemovr";
import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { IWalkingInstructions } from "../actions/Walking";
import { IPartialBattleOptions } from "../Battles";
import { Direction } from "../Constants";
import { ICharacter, IPlayer } from "../Things";

/**
 * RivalRoute22 cutscene routines.
 */
export class RivalRoute22Cutscene extends Section<FullScreenPokemon> {
    /**
     * Cutscene for encountering the rival on Route 22.
     *
     * @param settings   Settings used for the cutscene.
     */
    public RivalEmerges(settings: any): void {
        const player: IPlayer = settings.player;
        const triggerer: ICharacter = settings.triggerer;
        const playerUpper: number = Number(Math.abs(player.top - triggerer.top) < 4);
        const rival: ICharacter = this.game.objectMaker.make<ICharacter>(this.game.things.names.rival, {
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
            walkingInstructions.push(() => this.game.actions.animateCharacterSetDirection(rival, 0));
        }

        settings.rival = rival;

        walkingInstructions.push(this.game.scenePlayer.bindRoutine("RivalTalks"));

        this.game.animations.fading.animateFadeAttribute(rival, "opacity", 0.2, 1, 3);
        this.game.things.add(rival, triggerer.left - 112, triggerer.top + 96);
        this.game.actions.walking.startWalkingOnPath(rival, walkingInstructions);
    }

    /**
     * Cutscene for the rival talking to the player before the battle.
     *
     * @param settings   Settings used for the cutscene.
     */
    public RivalTalks(settings: any): void {
        this.game.actions.animateCharacterSetDirection(
            settings.player,
            // tslint:disable-next-line no-unnecessary-type-assertion
            this.game.physics.getDirectionBordering(settings.player, settings.rival)!);

        this.game.menuGrapher.createMenu("GeneralText");
        this.game.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%RIVAL%%%%%%%: Hey! %%%%%%%PLAYER%%%%%%%!",
                "You're going to %%%%%%%POKEMON%%%%%%% LEAGUE?",
                "Forget it! You probably don't have any BADGES!",
                "The guard won't let you through!",
                "By the way did your %%%%%%%POKEMON%%%%%%% get any stronger?",
            ],
            this.game.scenePlayer.bindRoutine("Challenge"));
        this.game.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the battle between the player and the rival.
     *
     * @param settings  Settings used for the cutscene.
     */
    public Challenge(): void {
        const starterRival: string[] = this.game.itemsHolder.getItem(this.game.storage.names.starterRival);
        const battleInfo: IPartialBattleOptions = {
            onComplete: (): void => {
                this.game.scenePlayer.startCutscene("RivalRoute22Leaves");
            },
            teams: {
                opponent: {
                    leader: {
                        title: "RivalPortrait".split(""),
                        nickname: this.game.itemsHolder.getItem(this.game.storage.names.nameRival),
                    },
                    nextCutscene: "RivalRoute22Leaves",
                    reward: 280,
                    actors: [
                        this.game.equations.newPokemon({
                            level: 8,
                            title: starterRival,
                        }),
                        this.game.equations.newPokemon({
                            level: 9,
                            title: "PIDGEY".split(""),
                        }),
                    ],
                },
            },
            texts: {
                start: (): string => "%%%%%%%RIVAL%%%%%%% wants to fight!",
                outcomes: {
                    [BattleOutcome.opponentVictory]: (): string => "%%%%%%%RIVAL%%%%%%%: Yeah! Am I great or what?",
                    [BattleOutcome.playerVictory]: (): string => "Aww! You just lucked out!",
                },
            },
            keptThings: this.game.graphics.collections.collectBattleKeptThings(["player", "Rival"]),
        };

        this.game.battles.startBattle(battleInfo);
    }
}
