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
     * Runs starting battle animations.
     * 
     * @param onComplete   Callback for when this is done.
     */
    public run(onComplete: () => void): void {
        const battleInfo: IBattleInfo = this.gameStarter.battleMover.getBattleInfo() as IBattleInfo;

        this.gameStarter.audioPlayer.playTheme(battleInfo.theme);
        this.gameStarter.graphics.moveBattleKeptThingsToText(battleInfo.keptThings);

        this.transitions.play({
            onComplete: (): void => {
                this.setupThings(battleInfo);
                this.runTeamEntrances(battleInfo, onComplete);
            }
        });
    }

    /**
     * Sets up the initial team Things.
     * 
     * @param battleInfo   Info for the current battle.
     */
    private setupThings(battleInfo: IBattleInfo): void {
        this.gameStarter.menuGrapher.createMenu("Battle");
        battleInfo.things = this.createInitialThings(battleInfo);
    }

    /**
     * Animations teams entering the battle.
     * 
     * @param battleInfo   Info for the current battle.
     * @param onComplete   Callback for when this is done.
     */
    private runTeamEntrances(battleInfo: IBattleInfo, onComplete: () => void): void {
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
            (): void => {
                this.showPlayerPokeballs(battleInfo);
                this.runOpeningText(battleInfo, onComplete);
            },
            timeout);
    }

    /**
     * Adds the player's Pokeball display for party size.
     * 
     * @param battleInfo   Info for the current battle.
     */
    private showPlayerPokeballs(battleInfo: IBattleInfo): void {
        if (battleInfo.teams.player.leader) {
            this.gameStarter.menuGrapher.createMenu("BattlePlayerHealth");
            this.gameStarter.menuGrapher.createMenu("BattlePlayerPokeballs");
            this.gameStarter.battles.decorations.addPokeballs(
                "BattlePlayerPokeballs",
                battleInfo.teams.player.actors.length);
        }

        if (battleInfo.teams.opponent.leader) {
            this.gameStarter.menuGrapher.createMenu("BattleOpponentHealth");
            this.gameStarter.menuGrapher.createMenu("BattleOpponentPokeballs");
            this.gameStarter.battles.decorations.addPokeballs(
                "BattleOpponentPokeballs",
                battleInfo.teams.opponent.actors.length,
                true);
        }
    }

    /**
     * Shows the introductory text.
     * 
     * @param battleInfo   Info for the current battle.
     * @param onComplete   Callback for when this is done.
     */
    private runOpeningText(battleInfo: IBattleInfo, onComplete: () => void): void {
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
                this.gameStarter.menuGrapher.deleteMenu("BattlePlayerHealth");
                this.gameStarter.menuGrapher.deleteMenu("BattleOpponentHealth");
                this.gameStarter.menuGrapher.createMenu("GeneralText");
                onComplete();
            });
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Creates the initial Things displayed in a battle.
     * 
     * @param battleInfo   Info for the current battle.
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
