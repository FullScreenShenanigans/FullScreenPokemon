import { component } from "babyioc";
import { IBattleTeam } from "battlemovr";
import { GeneralComponent } from "eightbittr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { IBattleInfo, IBattleThings, IPokemon } from "../Battles";
import { IMenu } from "../Menus";
import { IThing } from "../Things";
import { Health } from "./decorations/Health";
/**
 * Decoration handlers used by FullScreenPokemon instances.
 */
export class Decorations<TEightBittr extends FullScreenPokemon> extends GeneralComponent<TEightBittr> {
    /**
     * Id for the background Thing.
     */
    private static readonly backgroundId = "BattleDecorationBackground";

    /**
     * Decorations for health displays.
     */
    @component(Health)
    public readonly health: Health<TEightBittr>;

    /**
     * Creates the initial Things displayed in a battle.
     *
     * @param battleInfo   Info for the current battle.
     */
    public createInitialThings(battleInfo: IBattleInfo): IBattleThings {
        const background: IThing = this.addThingAsText(
            "DirtWhite",
            {
                height: this.eightBitter.mapScreener.height,
                id: Decorations.backgroundId,
                width: this.eightBitter.mapScreener.width,
            });
        this.eightBitter.utilities.arrayToBeginning(background, this.eightBitter.groupHolder.getGroup("Text") as IThing[]);

        const menu: IMenu = this.eightBitter.menuGrapher.createMenu("BattleDisplayInitial") as IMenu;

        const opponent: IThing = this.addThingAsText(
            this.getInitialTitle(battleInfo.teams.opponent, "Front"),
            {
                opacity: 0,
            });

        const player: IThing = this.addThingAsText(
            this.getInitialTitle(battleInfo.teams.player, "Back"),
            {
                opacity: 0,
            });
        this.eightBitter.physics.setLeft(player, menu.right + player.width);
        this.eightBitter.physics.setBottom(player, menu.bottom - player.height);

        this.eightBitter.physics.setRight(opponent, menu.left);
        this.eightBitter.physics.setBottom(opponent, menu.bottom - 80);

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

        this.eightBitter.menuGrapher.addMenuDialog(menu, [text]);
    }

    /**
     * Adds a new Thing and moves it to the Text group.
     *
     * @param title   Title of the Thing to add.
     * @param attributes   Any attributes for the Thing.
     * @returns The newly created Thing.
     */
    public addThingAsText(title: string, attributes: any): IThing {
        const thing: IThing = this.eightBitter.things.add([title, attributes]);

        this.eightBitter.groupHolder.switchGroup(thing, thing.groupType, "Text");

        return thing;
    }

    /**
     * Moves a Thing to behind all text other than the battle background.
     *
     * @param thing   A placed Thing in the Text group.
     */
    public moveToBeforeBackground(thing: IThing): void {
        const texts: IThing[] = this.eightBitter.groupHolder.getGroup("Text") as IThing[];
        const background: IThing = this.eightBitter.utilities.getExistingThingById(Decorations.backgroundId);
        const backgroundIndex: number = texts.indexOf(background);

        this.eightBitter.utilities.arrayToIndex(thing, texts, backgroundIndex + 1);
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
