import { GeneralComponent } from "eightbittr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { IWalkingInstructions } from "../actions/Walking";
import { Direction } from "../Constants";
import { ICharacter, IThing } from "../Things";

/**
 * OakIntro cutscene routines.
 */
export class OakIntroCutscene<TEightBittr extends FullScreenPokemon> extends GeneralComponent<TEightBittr> {
    /**
     * Cutscene for walking into the grass before receiving a Pokemon.
     *
     * @param settings   Settings used for the cutscene.
     */
    public async FirstDialog(settings: any): Promise<void> {
        let triggered = false;

        settings.triggerer.alive = false;
        this.eightBitter.stateHolder.addChange(settings.triggerer.id, "alive", false);

        if (this.eightBitter.itemsHolder.getItem(this.eightBitter.storage.names.starter)) {
            this.eightBitter.mapScreener.blockInputs = false;
            return;
        }

        this.eightBitter.actions.animatePlayerDialogFreeze(settings.player);
        this.eightBitter.actions.animateCharacterSetDirection(settings.player, Direction.Bottom);

        await this.eightBitter.audioPlayer.play(
            this.eightBitter.audio.names.professorOak,
            {
                alias: this.eightBitter.audio.aliases.theme,
                loop: true,
            });

        this.eightBitter.menuGrapher.createMenu("GeneralText", {
            finishAutomatically: true,
            finishAutomaticSpeed: 28,
        });
        this.eightBitter.menuGrapher.addMenuDialog(
            "GeneralText",
            "OAK: Hey! Wait! Don't go out!",
            (): void => {
                if (!triggered) {
                    triggered = true;
                    this.eightBitter.scenePlayer.playRoutine("Exclamation");
                }
            });
        this.eightBitter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene showing the exclamation point over the player's head.
     *
     * @param settings   Settings used for the cutscene.
     */
    public Exclamation(settings: any): void {
        const timeout = 49;

        this.eightBitter.actions.animateExclamation(settings.player, timeout);

        this.eightBitter.timeHandler.addEvent(
            (): void => this.eightBitter.menuGrapher.hideMenu("GeneralText"),
            timeout);

        this.eightBitter.timeHandler.addEvent(
            this.eightBitter.scenePlayer.bindRoutine("Catchup"),
            timeout);
    }

    /**
     * Cutscene for animating Oak to walk to the player.
     *
     * @param settings   Settings used for the cutscene.
     */
    public Catchup(settings: any): void {
        const door: IThing = this.eightBitter.utilities.getExistingThingById("Oak's Lab Door");
        const oak: ICharacter = this.eightBitter.objectMaker.make<ICharacter>(this.eightBitter.things.names.oak, {
            outerOk: true,
            nocollide: true,
        });
        const isToLeft: boolean = this.eightBitter.players[0].bordering[Direction.Left] !== undefined;
        const walkingInstructions: IWalkingInstructions = [
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
                });
        }

        walkingInstructions.push(this.eightBitter.scenePlayer.bindRoutine("GrassWarning"));

        settings.oak = oak;
        settings.isToLeft = isToLeft;

        this.eightBitter.things.add(oak, door.left, door.top);
        this.eightBitter.actions.walking.startWalkingOnPath(oak, walkingInstructions);
    }

    /**
     * Cutscene for Oak telling the player to keep out of the grass.
     */
    public GrassWarning(): void {
        this.eightBitter.menuGrapher.createMenu("GeneralText");
        this.eightBitter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "It's unsafe! Wild %POKEMON% live in tall grass!",
                "You need your own %POKEMON% for your protection. \n I know!",
                "Here, come with me.",
            ],
            this.eightBitter.scenePlayer.bindRoutine("FollowToLab"));
        this.eightBitter.menuGrapher.setActiveMenu("GeneralText");
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

        walkingInstructions.push(this.eightBitter.scenePlayer.bindRoutine("EnterLab"));

        this.eightBitter.menuGrapher.deleteMenu("GeneralText");
        this.eightBitter.actions.following.startFollowing(settings.player, settings.oak);
        this.eightBitter.actions.walking.startWalkingOnPath(
            settings.oak,
            walkingInstructions);
    }

    /**
     * Cutscene for entering Oak's lab.
     *
     * @param settings   Settings used for the cutscene.
     */
    public EnterLab(settings: any): void {
        this.eightBitter.players[0].nocollide = true;
        this.eightBitter.stateHolder.addChange("Pallet Town::Oak's Lab::Oak", "alive", true);
        settings.oak.hidden = true;

        this.eightBitter.timeHandler.addEvent(
            (): void => {
                this.eightBitter.actions.walking.startWalkingOnPath(
                    this.eightBitter.players[0],
                    [
                        {
                            blocks: 1,
                            direction: Direction.Top,
                        },
                        (): void => {
                            this.eightBitter.maps.setMap("Pallet Town", "Oak's Lab Floor 1 Door", false);
                            this.eightBitter.players[0].hidden = true;

                            this.eightBitter.scenePlayer.playRoutine("WalkToTable");
                        },
                    ]);
            },
            this.eightBitter.equations.walkingTicksPerBlock(this.eightBitter.players[0]));
    }

    /**
     * Cutscene for Oak offering a Pokemon to the player.
     *
     * @param settings   Settings used for the cutscene.
     */
    public WalkToTable(settings: any): void {
        const oak: ICharacter = this.eightBitter.utilities.getExistingThingById("Oak") as ICharacter;
        const rival: ICharacter = this.eightBitter.utilities.getExistingThingById("Rival") as ICharacter;
        const appearanceDelay: number = this.eightBitter.equations.walkingTicksPerBlock(oak) * 6;

        settings.oak = oak;
        settings.player = this.eightBitter.players[0];

        oak.dialog = "OAK: Now, %PLAYER%, which %POKEMON% do you want?";
        oak.hidden = false;
        oak.nocollide = true;
        this.eightBitter.physics.setMidXObj(oak, settings.player);
        this.eightBitter.physics.setBottom(oak, settings.player.top);

        this.eightBitter.stateHolder.addChange(oak.id, "hidden", false);
        this.eightBitter.stateHolder.addChange(oak.id, "nocollide", false);
        this.eightBitter.stateHolder.addChange(oak.id, "dialog", oak.dialog);

        rival.dialog = [
            "%RIVAL%: Heh, I don't need to be greedy like you!",
            "Go ahead and choose, %PLAYER%!",
        ];
        this.eightBitter.stateHolder.addChange(rival.id, "dialog", rival.dialog);

        this.eightBitter.actions.walking.startWalkingOnPath(oak, [
            {
                blocks: 8,
                direction: Direction.Top,
            },
            {
                blocks: 0,
                direction: Direction.Bottom,
            },
        ]);

        this.eightBitter.timeHandler.addEvent(
            (): void => {
                this.eightBitter.players[0].hidden = false;
            },
            appearanceDelay);

        this.eightBitter.timeHandler.addEvent(
            (): void => {
                this.eightBitter.actions.walking.startWalkingOnPath(
                    settings.player,
                    [
                        {
                            blocks: 8,
                            direction: 0,
                        },
                        this.eightBitter.scenePlayer.bindRoutine("RivalComplain"),
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
        this.eightBitter.stateHolder.addChange(settings.oak.id, "nocollide", false);

        this.eightBitter.menuGrapher.createMenu("GeneralText");
        this.eightBitter.menuGrapher.addMenuDialog(
            "GeneralText",
            "%RIVAL%: Gramps! I'm fed up with waiting!",
            this.eightBitter.scenePlayer.bindRoutine("OakThinksToRival"));
        this.eightBitter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for Oak telling the player to pick a Pokemon.
     */
    public OakThinksToRival(): void {
        this.eightBitter.menuGrapher.createMenu("GeneralText");
        this.eightBitter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "OAK: %RIVAL%? Let me think...",
                "Oh, that's right, I told you to come! Just wait!",
                "Here, %PLAYER%!",
                "There are 3 %POKEMON% here!",
                "Haha!",
                "They are inside the %POKE% BALLs.",
                "When I was young, I was a serious %POKEMON% trainer!",
                "In my old age, I have only 3 left, but you can have one! Choose!",
            ],
            this.eightBitter.scenePlayer.bindRoutine("RivalProtests"));
        this.eightBitter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the rival protesting to Oak.
     */
    public RivalProtests(): void {
        const timeout = 21;

        this.eightBitter.menuGrapher.deleteMenu("GeneralText");

        this.eightBitter.timeHandler.addEvent(
            (): void => {
                this.eightBitter.menuGrapher.createMenu("GeneralText");
            },
            timeout);

        this.eightBitter.timeHandler.addEvent(
            (): void => this.eightBitter.menuGrapher.addMenuDialog(
                "GeneralText",
                [
                    "%RIVAL%: Hey! Gramps! What about me?",
                ],
                this.eightBitter.scenePlayer.bindRoutine("OakRespondsToProtest")),
            timeout);

        this.eightBitter.timeHandler.addEvent(
            (): void => this.eightBitter.menuGrapher.setActiveMenu("GeneralText"),
            timeout);
    }

    /**
     * Cutscene for Oak responding to the rival's protest.
     *
     * @param settings   Settings used for the cutscene.
     */
    public OakRespondsToProtest(settings: any): void {
        const blocker: IThing = this.eightBitter.utilities.getExistingThingById("OakBlocker");
        const timeout = 21;

        settings.player.nocollide = false;
        settings.oak.nocollide = false;

        blocker.nocollide = false;
        this.eightBitter.stateHolder.addChange(blocker.id, "nocollide", false);

        this.eightBitter.mapScreener.blockInputs = false;

        this.eightBitter.menuGrapher.deleteMenu("GeneralText");

        this.eightBitter.timeHandler.addEvent(
            (): void => {
                this.eightBitter.menuGrapher.createMenu(
                    "GeneralText",
                    {
                        deleteOnFinish: true,
                    });
            },
            timeout);

        this.eightBitter.timeHandler.addEvent(
            (): void => this.eightBitter.menuGrapher.addMenuDialog(
                "GeneralText",
                "Oak: Be patient! %RIVAL%, you can have one too!"),
            timeout);

        this.eightBitter.timeHandler.addEvent(
            (): void => this.eightBitter.menuGrapher.setActiveMenu("GeneralText"),
            timeout);
    }
}
