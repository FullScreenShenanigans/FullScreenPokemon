import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { IWalkingInstructions } from "../actions/Walking";
import { Direction } from "../Constants";
import { ICharacter, IThing } from "../Things";

/**
 * OakIntro cutscene functions used by FullScreenPokemon instances.
 */
export class OakIntroCutscene<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
    /**
     * Cutscene for walking into the grass before receiving a Pokemon.
     *
     * @param settings   Settings used for the cutscene.
     */
    public FirstDialog(settings: any): void {
        let triggered: boolean = false;

        settings.triggerer.alive = false;
        this.gameStarter.stateHolder.addChange(settings.triggerer.id, "alive", false);

        if (this.gameStarter.itemsHolder.getItem("starter")) {
            this.gameStarter.mapScreener.blockInputs = false;
            return;
        }

        this.gameStarter.actions.animatePlayerDialogFreeze(settings.player);
        this.gameStarter.actions.animateCharacterSetDirection(settings.player, Direction.Bottom);

        this.gameStarter.audioPlayer.playTheme("Professor Oak");

        this.gameStarter.menuGrapher.createMenu("GeneralText", {
            finishAutomatically: true,
            finishAutomaticSpeed: 28
        });
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            "OAK: Hey! Wait! Don't go out!",
            (): void => {
                if (!triggered) {
                    triggered = true;
                    this.gameStarter.scenePlayer.playRoutine("Exclamation");
                }
            });
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene showing the exclamation point over the player's head.
     *
     * @param settings   Settings used for the cutscene.
     */
    public Exclamation(settings: any): void {
        const timeout: number = 49;

        this.gameStarter.actions.animateExclamation(settings.player, timeout);

        this.gameStarter.timeHandler.addEvent(
            (): void => this.gameStarter.menuGrapher.hideMenu("GeneralText"),
            timeout);

        this.gameStarter.timeHandler.addEvent(
            this.gameStarter.scenePlayer.bindRoutine("Catchup"),
            timeout);
    }

    /**
     * Cutscene for animating Oak to walk to the player.
     *
     * @param settings   Settings used for the cutscene.
     */
    public Catchup(settings: any): void {
        const door: IThing = this.gameStarter.utilities.getThingById("Oak's Lab Door");
        const oak: ICharacter = this.gameStarter.objectMaker.make<ICharacter>(this.gameStarter.things.names.Oak, {
            outerOk: true,
            nocollide: true
        });
        const isToLeft: boolean = this.gameStarter.players[0].bordering[Direction.Left] !== undefined;
        const walkingInstructions: IWalkingInstructions = [
            {
                blocks: 1,
                direction: Direction.Bottom
            },
            {
                blocks: 4,
                direction: Direction.Left
            },
            {
                blocks: 8,
                direction: Direction.Top
            },
            {
                blocks: 1,
                direction: Direction.Right
            },
            {
                blocks: 1,
                direction: Direction.Top
            },
            {
                blocks: 1,
                direction: Direction.Right
            },
            {
                blocks: 1,
                direction: Direction.Top
            }
        ];

        if (!isToLeft) {
            walkingInstructions.push(
                {
                    blocks: 1,
                    direction: Direction.Right
                },
                {
                    blocks: 0,
                    direction: Direction.Top
                });
        }

        walkingInstructions.push(this.gameStarter.scenePlayer.bindRoutine("GrassWarning"));

        settings.oak = oak;
        settings.isToLeft = isToLeft;

        this.gameStarter.things.add(oak, door.left, door.top);
        this.gameStarter.actions.walking.startWalkingOnPath(oak, walkingInstructions);
    }

    /**
     * Cutscene for Oak telling the player to keep out of the grass.
     */
    public GrassWarning(): void {
        this.gameStarter.menuGrapher.createMenu("GeneralText");
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "It's unsafe! Wild %%%%%%%POKEMON%%%%%%% live in tall grass!",
                "You need your own %%%%%%%POKEMON%%%%%%% for your protection. \n I know!",
                "Here, come with me."
            ],
            this.gameStarter.scenePlayer.bindRoutine("FollowToLab"));
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the player following Oak to the Professor's lab.
     *
     * @param settings   Settings used for the cutscene.
     */
    public FollowToLab(settings: any): void {
        const walkingInstructions: IWalkingInstructions = [
            {
                blocks: 5,
                direction: Direction.Bottom
            },
            {
                blocks: 1,
                direction: Direction.Left
            },
            {
                blocks: 5,
                direction: Direction.Bottom
            },
            {
                blocks: 3,
                direction: Direction.Right
            },
            {
                blocks: 1,
                direction: Direction.Top
            }
        ];

        if (!settings.isToLeft) {
            walkingInstructions.unshift({
                blocks: 1,
                direction: Direction.Left
            });
        }

        walkingInstructions.push(this.gameStarter.scenePlayer.bindRoutine("EnterLab"));

        this.gameStarter.menuGrapher.deleteMenu("GeneralText");
        this.gameStarter.actions.following.startFollowing(settings.player, settings.oak);
        this.gameStarter.actions.walking.startWalkingOnPath(
            settings.oak,
            walkingInstructions);
    }

    /**
     * Cutscene for entering Oak's lab.
     *
     * @param settings   Settings used for the cutscene.
     */
    public EnterLab(settings: any): void {
        this.gameStarter.players[0].nocollide = true;
        this.gameStarter.stateHolder.addChange("Pallet Town::Oak's Lab::Oak", "alive", true);
        settings.oak.hidden = true;

        this.gameStarter.timeHandler.addEvent(
            (): void => {
                this.gameStarter.actions.walking.startWalkingOnPath(
                    this.gameStarter.players[0],
                    [
                        {
                            blocks: 1,
                            direction: Direction.Top
                        },
                        (): void => {
                            this.gameStarter.maps.setMap("Pallet Town", "Oak's Lab Floor 1 Door", false);
                            this.gameStarter.players[0].hidden = true;

                            this.gameStarter.scenePlayer.playRoutine("WalkToTable");
                        }
                    ]);
            },
            this.gameStarter.equations.walkingTicksPerBlock(this.gameStarter.players[0]));
    }

    /**
     * Cutscene for Oak offering a Pokemon to the player.
     *
     * @param settings   Settings used for the cutscene.
     */
    public WalkToTable(settings: any): void {
        const oak: ICharacter = this.gameStarter.utilities.getThingById("Oak") as ICharacter;
        const rival: ICharacter = this.gameStarter.utilities.getThingById("Rival") as ICharacter;
        const appearanceDelay: number = this.gameStarter.equations.walkingTicksPerBlock(oak) * 6;

        settings.oak = oak;
        settings.player = this.gameStarter.players[0];

        oak.dialog = "OAK: Now, %%%%%%%PLAYER%%%%%%%, which %%%%%%%POKEMON%%%%%%% do you want?";
        oak.hidden = false;
        oak.nocollide = true;
        this.gameStarter.physics.setMidXObj(oak, settings.player);
        this.gameStarter.physics.setBottom(oak, settings.player.top);

        this.gameStarter.stateHolder.addChange(oak.id, "hidden", false);
        this.gameStarter.stateHolder.addChange(oak.id, "nocollide", false);
        this.gameStarter.stateHolder.addChange(oak.id, "dialog", oak.dialog);

        rival.dialog = [
            "%%%%%%%RIVAL%%%%%%%: Heh, I don't need to be greedy like you!",
            "Go ahead and choose, %%%%%%%PLAYER%%%%%%%!"
        ];
        this.gameStarter.stateHolder.addChange(rival.id, "dialog", rival.dialog);

        this.gameStarter.actions.walking.startWalkingOnPath(oak, [
            {
                blocks: 8,
                direction: Direction.Top
            },
            {
                blocks: 0,
                direction: Direction.Bottom
            }
        ]);

        this.gameStarter.timeHandler.addEvent(
            (): void => {
                this.gameStarter.players[0].hidden = false;
            },
            appearanceDelay);

        this.gameStarter.timeHandler.addEvent(
            (): void => {
                this.gameStarter.actions.walking.startWalkingOnPath(
                    settings.player,
                    [
                        {
                            blocks: 8,
                            direction: 0
                        },
                        this.gameStarter.scenePlayer.bindRoutine("RivalComplain")
                    ]);
            },
            appearanceDelay);
    }

    /**
     * Cutscene for the rival complaining to Oak.
     *
     * @param settings   Settings used for the cutscene.
     */
    public RivalComplain(settings: any): void {
        settings.oak.nocollide = false;
        settings.player.nocollide = false;
        this.gameStarter.stateHolder.addChange(settings.oak.id, "nocollide", false);

        this.gameStarter.menuGrapher.createMenu("GeneralText");
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            "%%%%%%%RIVAL%%%%%%%: Gramps! I'm fed up with waiting!",
            this.gameStarter.scenePlayer.bindRoutine("OakThinksToRival"));
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for Oak telling the player to pick a Pokemon.
     */
    public OakThinksToRival(): void {
        this.gameStarter.menuGrapher.createMenu("GeneralText");
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "OAK: %%%%%%%RIVAL%%%%%%%? Let me think...",
                "Oh, that's right, I told you to come! Just wait!",
                "Here, %%%%%%%PLAYER%%%%%%%!",
                "There are 3 %%%%%%%POKEMON%%%%%%% here!",
                "Haha!",
                "They are inside the %%%%%%%POKE%%%%%%% BALLs.",
                "When I was young, I was a serious %%%%%%%POKEMON%%%%%%% trainer!",
                "In my old age, I have only 3 left, but you can have one! Choose!"
            ],
            this.gameStarter.scenePlayer.bindRoutine("RivalProtests"));
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the rival protesting to Oak.
     */
    public RivalProtests(): void {
        const timeout: number = 21;

        this.gameStarter.menuGrapher.deleteMenu("GeneralText");

        this.gameStarter.timeHandler.addEvent(
            (): void => {
                this.gameStarter.menuGrapher.createMenu("GeneralText");
            },
            timeout);

        this.gameStarter.timeHandler.addEvent(
            (): void => this.gameStarter.menuGrapher.addMenuDialog(
                "GeneralText",
                [
                    "%%%%%%%RIVAL%%%%%%%: Hey! Gramps! What about me?"
                ],
                this.gameStarter.scenePlayer.bindRoutine("OakRespondsToProtest")),
            timeout);

        this.gameStarter.timeHandler.addEvent(
            (): void => this.gameStarter.menuGrapher.setActiveMenu("GeneralText"),
            timeout);
    }

    /**
     * Cutscene for Oak responding to the rival's protest.
     *
     * @param settings   Settings used for the cutscene.
     */
    public OakRespondsToProtest(settings: any): void {
        const blocker: IThing = this.gameStarter.utilities.getThingById("OakBlocker");
        const timeout: number = 21;

        settings.player.nocollide = false;
        settings.oak.nocollide = false;

        blocker.nocollide = false;
        this.gameStarter.stateHolder.addChange(blocker.id, "nocollide", false);

        this.gameStarter.mapScreener.blockInputs = false;

        this.gameStarter.menuGrapher.deleteMenu("GeneralText");

        this.gameStarter.timeHandler.addEvent(
            (): void => {
                this.gameStarter.menuGrapher.createMenu(
                    "GeneralText",
                    {
                        deleteOnFinish: true
                    });
            },
            timeout);

        this.gameStarter.timeHandler.addEvent(
            (): void => this.gameStarter.menuGrapher.addMenuDialog(
                "GeneralText",
                "Oak: Be patient! %%%%%%%RIVAL%%%%%%%, you can have one too!"),
            timeout);

        this.gameStarter.timeHandler.addEvent(
            (): void => this.gameStarter.menuGrapher.setActiveMenu("GeneralText"),
            timeout);
    }
}
