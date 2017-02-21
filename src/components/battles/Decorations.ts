import { IBattleTeam } from "battlemovr/lib/Battles";
import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { IBattleInfo, IBattleThings } from "../Battles";
import { IMenu } from "../Menus";
import { IThing } from "../Things";
import { Health } from "./decorations/Health";

/**
 * Decoration handlers used by FullScreenPokemon instances.
 */
export class Decorations<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
    /**
     * Id for the background Thing.
     */
    private static backgroundId: string = "BattleDecorationBackground";

    /**
     * Decorations for health displays.
     */
    public readonly health: Health<TGameStartr> = new Health(this.gameStarter);

    /**
     * Creates the initial Things displayed in a battle.
     * 
     * @param battleInfo   Info for the current battle.
     */
    public createInitialThings(battleInfo: IBattleInfo): IBattleThings {
        const background: IThing = this.addThingAsText(
            "DirtWhite",
            {
                height: this.gameStarter.mapScreener.height,
                id: Decorations.backgroundId,
                width: this.gameStarter.mapScreener.width
            });
        this.gameStarter.utilities.arrayToBeginning(background, this.gameStarter.groupHolder.getGroup("Text") as IThing[]);

        const menu: IMenu = this.gameStarter.menuGrapher.createMenu("BattleDisplayInitial") as IMenu;

        const opponent: IThing = this.addThingAsText(
            this.getInitialTitle(battleInfo.teams.opponent, "Front"),
            {
                opacity: 0
            });

        const player: IThing = this.addThingAsText(
            this.getInitialTitle(battleInfo.teams.player, "Back"),
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
     * Adds Pokeballs to a menu.
     * 
     * @param menu   Name of the container menu.
     * @param filled   How many balls are filled.
     * @param reverse   Whether to reverse the balls order.
     */
    public addPokeballs(menu: string, filled: number, reverse?: boolean): void {
        const text: string[][] = [];

        for (let i: number = 0; i < filled; i += 1) {
            text.push(["Ball"]);
        }

        for (let i: number = filled; i < 6; i += 1) {
            text.push(["BallEmpty"]);
        }

        if (reverse) {
            text.reverse();
        }

        this.gameStarter.menuGrapher.addMenuDialog(menu, [text]);
    }

    /**
     * Adds a new Thing and moves it to the Text group.
     * 
     * @param title   Title of the Thing to add.
     * @param attributes   Any attributes for the Thing.
     * @returns The newly created Thing.
     */
    public addThingAsText(title: string, attributes: any): IThing {
        const thing: IThing = this.gameStarter.things.add([title, attributes]);

        this.gameStarter.groupHolder.switchMemberGroup(thing, thing.groupType, "Text");

        return thing;
    }

    /**
     * Moves a Thing to behind all text other than the battle background.
     * 
     * @param thing   A placed Thing in the Text group.
     */
    public moveToBeforeBackground(thing: IThing): void {
        const texts: IThing[] = this.gameStarter.groupHolder.getGroup("Text") as IThing[];
        const background: IThing = this.gameStarter.utilities.getThingById(Decorations.backgroundId);
        const backgroundIndex: number = texts.indexOf(background);

        this.gameStarter.utilities.arrayToIndex(thing, texts, backgroundIndex + 1);
    }

    /**
     * Determines which sprite to initially show for a team.
     * 
     * @param team   A new battle team.
     * @param suffix   Direction modifier to add if the sprite is for a Pokemon.
     * @returns The initial sprite for the team.
     */
    private getInitialTitle(team: IBattleTeam, pokemonSuffix: "Back" | "Front"): string {
        return team.leader
            ? team.leader.title.join("")
            : team.selectedActor.title.join("") + pokemonSuffix;
    }
}
