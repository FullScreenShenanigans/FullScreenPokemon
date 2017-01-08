import { IBattleTeam } from "battlemovr/lib/Battles";
import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../../../FullScreenPokemon";
import { IBattleInfo, IBattleThings } from "../../Battles";
import { PokedexListingStatus } from "../../Constants";
import { IMenu } from "../../Menus";
import { IThing } from "../../Things";
import { Transitions } from "./Transitions";

/**
 * Battle start animations used by FullScreenPokemon instances.
 */
export class Starting<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
    /**
     * Transition animations used by the FullScreenPokemon instance.
     */
    public readonly transitions: Transitions<TGameStartr> = new Transitions(this.gameStarter);

    /**
     * Starts the battle animations.
     * 
     * @param onComplete   Callback for when this is done.
     */
    public start(onComplete: () => void): void {
        const battleInfo: IBattleInfo = this.gameStarter.battleMover.getBattleInfo() as IBattleInfo;

        this.gameStarter.audioPlayer.playTheme(battleInfo.theme);
        this.gameStarter.graphics.moveBattleKeptThingsToText(battleInfo.keptThings);

        this.transitions.play({
            onComplete: (): void => {
                this.setupThings();
                this.runTeamEntrances(onComplete);
            }
        });
    }

    /**
     * Sets up the initial team Things.
     */
    private setupThings(): void {
        const battleInfo: IBattleInfo = this.gameStarter.battleMover.getBattleInfo() as IBattleInfo;

        this.gameStarter.menuGrapher.createMenu("Battle");
        battleInfo.things = this.createInitialThings(battleInfo);
    }

    /**
     * Animations teams entering the battle.
     * 
     * @param onComplete   Callback for when this is done.
     */
    private runTeamEntrances(onComplete: () => void): void {
        const battleInfo: IBattleInfo = this.gameStarter.battleMover.getBattleInfo() as IBattleInfo;
        const { menu, opponent, player }: IBattleThings = battleInfo.things;

        let playerX: number;
        let opponentX: number;
        let playerGoal: number;
        let opponentGoal: number;
        let timeout: number = 70;

        // They should be visible halfway through (2 * (1 / timeout))
        this.gameStarter.actions.animateFadeAttribute(player, "opacity", 2 / timeout, 1, 1);
        this.gameStarter.actions.animateFadeAttribute(opponent, "opacity", 2 / timeout, 1, 1);

        playerX = this.gameStarter.physics.getMidX(player);
        opponentX = this.gameStarter.physics.getMidX(opponent);
        playerGoal = menu.left + player.width / 2;
        opponentGoal = menu.right - opponent.width / 2;

        this.gameStarter.actions.animateSlideHorizontal(
            player,
            (playerGoal - playerX) / timeout,
            playerGoal,
            1);

        this.gameStarter.actions.animateSlideHorizontal(
            opponent,
            (opponentGoal - opponentX) / timeout,
            opponentGoal,
            1);

        this.gameStarter.saves.addPokemonToPokedex(battleInfo.teams.opponent.selectedActor.title, PokedexListingStatus.Seen);

        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
        this.gameStarter.timeHandler.addEvent(
            (): void => this.runOpeningText(onComplete),
            timeout);
    }

    /**
     * Shows the introductory text.
     * 
     * @param onComplete   Callback for when this is done.
     */
    private runOpeningText(onComplete: () => void): void {
        const battleInfo: IBattleInfo = this.gameStarter.battleMover.getBattleInfo() as IBattleInfo;
        const textStart: [string, string] = battleInfo.texts.start || ["", ""];
        const opponentName: string[] = battleInfo.teams.opponent.leader
            ? battleInfo.teams.opponent.leader.nickname
            : battleInfo.teams.opponent.selectedActor.nickname;

        this.gameStarter.menuGrapher.createMenu("GeneralText", {
            finishAutomatically: battleInfo.automaticMenus
        });
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    textStart[0], opponentName, textStart[1]
                ]
            ],
            (): void => {
                this.gameStarter.menuGrapher.createMenu("GeneralText");
                onComplete();
            });
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Creates the initial Things displayed in a battle.
     * 
     * @param cutscene   Settings for the cutscene.
     */
    private createInitialThings(battleInfo: IBattleInfo): IBattleThings {
        const background: IThing = this.addThingAsText(
            "DirtWhite",
            {
                height: this.gameStarter.mapScreener.height,
                width: this.gameStarter.mapScreener.width
            });
        this.gameStarter.utilities.arrayToBeginning(background, this.gameStarter.groupHolder.getGroup("Text") as IThing[]);

        const menu: IMenu = this.gameStarter.menuGrapher.createMenu("BattleDisplayInitial") as IMenu;

        const opponent: IThing = this.addThingAsText(
            this.getInitialTitle(battleInfo.teams.opponent) + "Front",
            {
                opacity: 0
            });

        const player: IThing = this.addThingAsText(
            this.getInitialTitle(battleInfo.teams.player) + "Back",
            {
                opacity: 0
            });
        this.gameStarter.physics.setLeft(player, menu.right + player.width);
        this.gameStarter.physics.setBottom(player, menu.bottom - player.height);

        this.gameStarter.physics.setRight(opponent, menu.left);
        this.gameStarter.physics.setBottom(opponent, menu.bottom - 80);

        return { background, menu, opponent, player };
    }

    /**
     * Determines which sprite to initially show for a team.
     * 
     * @param team   A new battle team.
     * @returns The initial sprite for the team.
     */
    private getInitialTitle(team: IBattleTeam): string {
        return team.leader
            ? team.leader.title.join("")
            : team.selectedActor.title.join("");
    }

    /**
     * Adds a new Thing and moves it to the Text group.
     * 
     * @param title   Title of the Thing to add.
     * @param attributes   Any attributes for the Thing.
     * @returns The newly created Thing.
     */
    private addThingAsText(title: string, attributes: any): IThing {
        const thing: IThing = this.gameStarter.things.add([title, attributes]);

        this.gameStarter.groupHolder.switchMemberGroup(thing, thing.groupType, "Text");

        return thing;
    }
}