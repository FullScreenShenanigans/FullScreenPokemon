import { member } from "babyioc";
import { IBattleTeam } from "battlemovr";
import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { IBattleInfo, IBattleThings, IPokemon } from "../Battles";
import { IMenu } from "../Menus";
import { IThing } from "../Things";

import { Health } from "./decorations/Health";
/**
 * Decoration handlers used by FullScreenPokemon instances.
 */
export class Decorations extends Section<FullScreenPokemon> {
    /**
     * Id for the background Thing.
     */
    private static readonly backgroundId = "BattleDecorationBackground";

    /**
     * Decorations for health displays.
     */
    @member(Health)
    public readonly health: Health;

    /**
     * Creates the initial Things displayed in a battle.
     *
     * @param battleInfo   Info for the current battle.
     */
    public createInitialThings(battleInfo: IBattleInfo): IBattleThings {
        const background: IThing = this.addThingAsText("DirtWhite", {
            height: this.game.mapScreener.height,
            id: Decorations.backgroundId,
            width: this.game.mapScreener.width,
        });
        this.game.utilities.arrayToBeginning(background, this.game.groupHolder.getGroup("Text"));

        const menu: IMenu = this.game.menuGrapher.createMenu("BattleDisplayInitial") as IMenu;

        const opponent: IThing = this.addThingAsText(
            this.getInitialTitle(battleInfo.teams.opponent, "Front"),
            {
                opacity: 0,
            }
        );

        const player: IThing = this.addThingAsText(
            this.getInitialTitle(battleInfo.teams.player, "Back"),
            {
                opacity: 0,
            }
        );
        this.game.physics.setLeft(player, menu.right + player.width);
        this.game.physics.setBottom(player, menu.bottom - player.height);

        this.game.physics.setRight(opponent, menu.left);
        this.game.physics.setBottom(opponent, menu.bottom - 80);

        return { background, menu, opponent, player };
    }

    /**
     * Adds Pokeballs to a menu.
     *
     * @param menu   Name of the container menu.
     * @param filled   How many balls are filled.
     * @param reverse   Whether to reverse the balls order.
     */
    public addPokeballs(menu: string, team: IPokemon[], reverse?: boolean): void {
        const text: string[][] = [];
        const filled = team.length;
        for (let i = 0; i < filled; i += 1) {
            if (team[i].statistics.health.current === 0) {
                text.push(["BallFaint"]);
            } else if (team[i].status !== undefined) {
                text.push(["BallStatus"]);
            } else {
                text.push(["Ball"]);
            }
        }

        for (let i: number = filled; i < 6; i += 1) {
            text.push(["BallEmpty"]);
        }

        if (reverse) {
            text.reverse();
        }

        this.game.menuGrapher.addMenuDialog(menu, [text]);
    }

    /**
     * Adds a new Thing and moves it to the Text group.
     *
     * @param title   Title of the Thing to add.
     * @param attributes   Any attributes for the Thing.
     * @returns The newly created Thing.
     */
    public addThingAsText(title: string, attributes: any): IThing {
        const thing: IThing = this.game.things.add([title, attributes]);

        this.game.groupHolder.switchGroup(thing, thing.groupType, "Text");

        return thing;
    }

    /**
     * Moves a Thing to behind all text other than the battle background.
     *
     * @param thing   A placed Thing in the Text group.
     */
    public moveToBeforeBackground(thing: IThing): void {
        const texts: IThing[] = this.game.groupHolder.getGroup("Text");
        const background: IThing = this.game.utilities.getExistingThingById(
            Decorations.backgroundId
        );
        const backgroundIndex: number = texts.indexOf(background);

        this.game.utilities.arrayToIndex(thing, texts, backgroundIndex + 1);
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
