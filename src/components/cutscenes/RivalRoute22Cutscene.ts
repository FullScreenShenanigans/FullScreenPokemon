import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { IWalkingInstructions } from "../actions/Walking";
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
        const rival: ICharacter = this.gameStarter.objectMaker.make<ICharacter>(this.gameStarter.things.names.Rival, {
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
                blocks: 3 + playerUpper,
                direction: Direction.Right
            }
        ];

        if (playerUpper) {
            walkingInstructions.push({
                blocks: 0,
                direction: Direction.Top
            });
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
        // const rivalTitle: string[] = this.gameStarter.itemsHolder.getItem("starterRival");

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
            (): void => {
                console.log("Should start battle...");
                // this.gameStarter.battles.startBattle({
                //     battlers: {
                //         opponent: {
                //             sprite: "RivalPortrait",
                //             name: this.gameStarter.itemsHolder.getItem("nameRival"),
                //             category: "Trainer",
                //             hasActors: true,
                //             reward: 280,
                //             actors: [
                //                 this.gameStarter.equations.newPokemon(rivalTitle, 8),
                //                 this.gameStarter.equations.newPokemon("PIDGEY".split(""), 9)
                //             ]
                //         }
                //     },
                //     textStart: [
                //         "",
                //         " wants to fight!"
                //     ],
                //     textDefeat: [
                //         "Yeah! Am I great or what?".split("")
                //     ],
                //     textVictory: [
                //         "Awww! You just lucked out!".split("")
                //     ],
                //     keptThings: this.gameStarter.graphics.collectBattleKeptThings(["player", "Rival"])
                // });
            });
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }
}
