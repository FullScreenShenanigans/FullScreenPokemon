import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { WalkingInstructions } from "../actions/Walking";
import { Direction } from "../Constants";
import { Character, Actor } from "../Actors";

/**
 * OakIntro cutscene routines.
 */
export class OakIntroCutscene extends Section<FullScreenPokemon> {
    /**
     * Cutscene for walking into the grass before receiving a Pokemon.
     *
     * @param settings   Settings used for the cutscene.
     */
    public async FirstDialog(settings: any): Promise<void> {
        let triggered = false;

        settings.triggerer.removed = true;
        this.game.stateHolder.addChange(settings.triggerer.id, "removed", true);

        if (this.game.itemsHolder.getItem(this.game.storage.names.starter)) {
            this.game.mapScreener.blockInputs = false;
            return;
        }

        this.game.actions.animatePlayerDialogFreeze(settings.player);
        this.game.actions.animateCharacterSetDirection(settings.player, Direction.Bottom);

        await this.game.audioPlayer.play(this.game.audio.names.professorOak, {
            alias: this.game.audio.aliases.theme,
            loop: true,
        });

        this.game.menuGrapher.createMenu("GeneralText", {
            finishAutomatically: true,
            finishAutomaticSpeed: 28,
        });
        this.game.menuGrapher.addMenuDialog(
            "GeneralText",
            "OAK: Hey! Wait! Don't go out!",
            (): void => {
                if (!triggered) {
                    triggered = true;
                    this.game.scenePlayer.playRoutine("Exclamation");
                }
            }
        );
        this.game.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene showing the exclamation point over the player's head.
     *
     * @param settings   Settings used for the cutscene.
     */
    public Exclamation(settings: any): void {
        const timeout = 49;

        this.game.actions.animateExclamation(settings.player, timeout);

        this.game.timeHandler.addEvent(
            (): void => this.game.menuGrapher.hideMenu("GeneralText"),
            timeout
        );

        this.game.timeHandler.addEvent(this.game.scenePlayer.bindRoutine("Catchup"), timeout);
    }

    /**
     * Cutscene for animating Oak to walk to the player.
     *
     * @param settings   Settings used for the cutscene.
     */
    public Catchup(settings: any): void {
        const door: Actor = this.game.utilities.getExistingActorById("Oak's Lab Door");
        const oak: Character = this.game.objectMaker.make<Character>(this.game.actors.names.oak, {
            outerOk: true,
            nocollide: true,
        });
        const isToLeft: boolean = this.game.players[0].bordering[Direction.Left] !== undefined;
        const walkingInstructions: WalkingInstructions = [
            {
                blocks: 1,
                direction: Direction.Bottom,
            },
            {
                blocks: 4,
                direction: Direction.Left,
            },
            {
                blocks: 8,
                direction: Direction.Top,
            },
            {
                blocks: 1,
                direction: Direction.Right,
            },
            {
                blocks: 1,
                direction: Direction.Top,
            },
            {
                blocks: 1,
                direction: Direction.Right,
            },
            {
                blocks: 1,
                direction: Direction.Top,
            },
        ];

        if (!isToLeft) {
            walkingInstructions.push(
                {
                    blocks: 1,
                    direction: Direction.Right,
                },
                {
                    blocks: 0,
                    direction: Direction.Top,
                }
            );
        }

        walkingInstructions.push(this.game.scenePlayer.bindRoutine("GrassWarning"));

        settings.oak = oak;
        settings.isToLeft = isToLeft;

        this.game.actors.add(oak, door.left, door.top);
        this.game.actions.walking.startWalkingOnPath(oak, walkingInstructions);
    }

    /**
     * Cutscene for Oak telling the player to keep out of the grass.
     */
    public GrassWarning(): void {
        this.game.menuGrapher.createMenu("GeneralText");
        this.game.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "It's unsafe! Wild %%%%%%%POKEMON%%%%%%% live in tall grass!",
                "You need your own %%%%%%%POKEMON%%%%%%% for your protection. \n I know!",
                "Here, come with me.",
            ],
            this.game.scenePlayer.bindRoutine("FollowToLab")
        );
        this.game.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the player following Oak to the Professor's lab.
     *
     * @param settings   Settings used for the cutscene.
     */
    public FollowToLab(settings: any): void {
        const walkingInstructions: WalkingInstructions = [
            {
                blocks: 5,
                direction: Direction.Bottom,
            },
            {
                blocks: 1,
                direction: Direction.Left,
            },
            {
                blocks: 5,
                direction: Direction.Bottom,
            },
            {
                blocks: 3,
                direction: Direction.Right,
            },
            {
                blocks: 1,
                direction: Direction.Top,
            },
        ];

        if (!settings.isToLeft) {
            walkingInstructions.unshift({
                blocks: 1,
                direction: Direction.Left,
            });
        }

        walkingInstructions.push(this.game.scenePlayer.bindRoutine("EnterLab"));

        this.game.menuGrapher.deleteMenu("GeneralText");
        this.game.actions.following.startFollowing(settings.player, settings.oak);
        this.game.actions.walking.startWalkingOnPath(settings.oak, walkingInstructions);
    }

    /**
     * Cutscene for entering Oak's lab.
     *
     * @param settings   Settings used for the cutscene.
     */
    public EnterLab(settings: any): void {
        this.game.players[0].nocollide = true;
        this.game.stateHolder.addChange("Pallet Town::Oak's Lab::Oak", "alive", true);
        settings.oak.hidden = true;

        this.game.timeHandler.addEvent((): void => {
            this.game.actions.walking.startWalkingOnPath(this.game.players[0], [
                {
                    blocks: 1,
                    direction: Direction.Top,
                },
                (): void => {
                    this.game.maps.setMap("Pallet Town", "Oak's Lab Floor 1 Door", false);
                    this.game.players[0].hidden = true;

                    this.game.scenePlayer.playRoutine("WalkToTable");
                },
            ]);
        }, this.game.equations.walkingTicksPerBlock(this.game.players[0]));
    }

    /**
     * Cutscene for Oak offering a Pokemon to the player.
     *
     * @param settings   Settings used for the cutscene.
     */
    public WalkToTable(settings: any): void {
        const oak: Character = this.game.utilities.getExistingActorById("Oak");
        const rival: Character = this.game.utilities.getExistingActorById("Rival");
        const appearanceDelay: number = this.game.equations.walkingTicksPerBlock(oak) * 6;

        settings.oak = oak;
        settings.player = this.game.players[0];

        oak.dialog = "OAK: Now, %%%%%%%PLAYER%%%%%%%, which %%%%%%%POKEMON%%%%%%% do you want?";
        oak.hidden = false;
        oak.nocollide = true;
        this.game.physics.setMidXObj(oak, settings.player);
        this.game.physics.setBottom(oak, settings.player.top);

        this.game.stateHolder.addChange(oak.id, "hidden", false);
        this.game.stateHolder.addChange(oak.id, "nocollide", false);
        this.game.stateHolder.addChange(oak.id, "dialog", oak.dialog);

        rival.dialog = [
            "%%%%%%%RIVAL%%%%%%%: Heh, I don't need to be greedy like you!",
            "Go ahead and choose, %%%%%%%PLAYER%%%%%%%!",
        ];
        this.game.stateHolder.addChange(rival.id, "dialog", rival.dialog);

        this.game.actions.walking.startWalkingOnPath(oak, [
            {
                blocks: 8,
                direction: Direction.Top,
            },
            {
                blocks: 0,
                direction: Direction.Bottom,
            },
        ]);

        this.game.timeHandler.addEvent((): void => {
            this.game.players[0].hidden = false;
        }, appearanceDelay);

        this.game.timeHandler.addEvent((): void => {
            this.game.actions.walking.startWalkingOnPath(settings.player, [
                {
                    blocks: 8,
                    direction: 0,
                },
                this.game.scenePlayer.bindRoutine("RivalComplain"),
            ]);
        }, appearanceDelay);
    }

    /**
     * Cutscene for the rival complaining to Oak.
     *
     * @param settings   Settings used for the cutscene.
     */
    public RivalComplain(settings: any): void {
        settings.oak.nocollide = false;
        settings.player.nocollide = false;
        this.game.stateHolder.addChange(settings.oak.id, "nocollide", false);

        this.game.menuGrapher.createMenu("GeneralText");
        this.game.menuGrapher.addMenuDialog(
            "GeneralText",
            "%%%%%%%RIVAL%%%%%%%: Gramps! I'm fed up with waiting!",
            this.game.scenePlayer.bindRoutine("OakThinksToRival")
        );
        this.game.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for Oak telling the player to pick a Pokemon.
     */
    public OakThinksToRival(): void {
        this.game.menuGrapher.createMenu("GeneralText");
        this.game.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "OAK: %%%%%%%RIVAL%%%%%%%? Let me think...",
                "Oh, that's right, I told you to come! Just wait!",
                "Here, %%%%%%%PLAYER%%%%%%%!",
                "There are 3 %%%%%%%POKEMON%%%%%%% here!",
                "Haha!",
                "They are inside the %%%%%%%POKE%%%%%%% BALLs.",
                "When I was young, I was a serious %%%%%%%POKEMON%%%%%%% trainer!",
                "In my old age, I have only 3 left, but you can have one! Choose!",
            ],
            this.game.scenePlayer.bindRoutine("RivalProtests")
        );
        this.game.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the rival protesting to Oak.
     */
    public RivalProtests(): void {
        const timeout = 21;

        this.game.menuGrapher.deleteMenu("GeneralText");

        this.game.timeHandler.addEvent((): void => {
            this.game.menuGrapher.createMenu("GeneralText");
        }, timeout);

        this.game.timeHandler.addEvent(
            (): void =>
                this.game.menuGrapher.addMenuDialog(
                    "GeneralText",
                    ["%%%%%%%RIVAL%%%%%%%: Hey! Gramps! What about me?"],
                    this.game.scenePlayer.bindRoutine("OakRespondsToProtest")
                ),
            timeout
        );

        this.game.timeHandler.addEvent(
            (): void => this.game.menuGrapher.setActiveMenu("GeneralText"),
            timeout
        );
    }

    /**
     * Cutscene for Oak responding to the rival's protest.
     *
     * @param settings   Settings used for the cutscene.
     */
    public OakRespondsToProtest(settings: any): void {
        const blocker: Actor = this.game.utilities.getExistingActorById("OakBlocker");
        const timeout = 21;

        settings.player.nocollide = false;
        settings.oak.nocollide = false;

        blocker.nocollide = false;
        this.game.stateHolder.addChange(blocker.id, "nocollide", false);

        this.game.mapScreener.blockInputs = false;

        this.game.menuGrapher.deleteMenu("GeneralText");

        this.game.timeHandler.addEvent((): void => {
            this.game.menuGrapher.createMenu("GeneralText", {
                deleteOnFinish: true,
            });
        }, timeout);

        this.game.timeHandler.addEvent(
            (): void =>
                this.game.menuGrapher.addMenuDialog(
                    "GeneralText",
                    "Oak: Be patient! %%%%%%%RIVAL%%%%%%%, you can have one too!"
                ),
            timeout
        );

        this.game.timeHandler.addEvent(
            (): void => this.game.menuGrapher.setActiveMenu("GeneralText"),
            timeout
        );
    }
}
