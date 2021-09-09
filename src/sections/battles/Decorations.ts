import { member } from "babyioc";
import { BattleTeam } from "battlemovr";
import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { BattleInfo, BattleActors, Pokemon } from "../Battles";
import { Menu } from "../Menus";
import { Actor } from "../Actors";

import { Health } from "./decorations/Health";
/**
 * Decoration handlers used by FullScreenPokemon instances.
 */
export class Decorations extends Section<FullScreenPokemon> {
    /**
     * Id for the background Actor.
     */
    private static readonly backgroundId = "BattleDecorationBackground";

    /**
     * Decorations for health displays.
     */
    @member(Health)
    public readonly health: Health;

    /**
     * Creates the initial Actors displayed in a battle.
     *
     * @param battleInfo   Info for the current battle.
     */
    public createInitialActors(battleInfo: BattleInfo): BattleActors {
        const background: Actor = this.addActorAsText("DirtWhite", {
            height: this.game.mapScreener.height,
            id: Decorations.backgroundId,
            width: this.game.mapScreener.width,
        });
        this.game.utilities.arrayToBeginning(background, this.game.groupHolder.getGroup("Text"));

        const menu: Menu = this.game.menuGrapher.createMenu("BattleDisplayInitial") as Menu;

        const opponent: Actor = this.addActorAsText(
            this.getInitialTitle(battleInfo.teams.opponent, "Front"),
            {
                opacity: 0,
            }
        );

        const player: Actor = this.addActorAsText(
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
    public addPokeballs(menu: string, team: Pokemon[], reverse?: boolean): void {
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
     * Adds a new Actor and moves it to the Text group.
     *
     * @param title   Title of the Actor to add.
     * @param attributes   Any attributes for the Actor.
     * @returns The newly created Actor.
     */
    public addActorAsText(title: string, attributes: any): Actor {
        const actor: Actor = this.game.actors.add([title, attributes]);

        this.game.groupHolder.switchGroup(actor, actor.groupType, "Text");

        return actor;
    }

    /**
     * Moves An Actor to behind all text other than the battle background.
     *
     * @param actor   A placed Actor in the Text group.
     */
    public moveToBeforeBackground(actor: Actor): void {
        const texts: Actor[] = this.game.groupHolder.getGroup("Text");
        const background: Actor = this.game.utilities.getExistingActorById(
            Decorations.backgroundId
        );
        const backgroundIndex: number = texts.indexOf(background);

        this.game.utilities.arrayToIndex(actor, texts, backgroundIndex + 1);
    }

    /**
     * Determines which sprite to initially show for a team.
     *
     * @param team   A new battle team.
     * @param suffix   Direction modifier to add if the sprite is for a Pokemon.
     * @returns The initial sprite for the team.
     */
    private getInitialTitle(team: BattleTeam, pokemonSuffix: "Back" | "Front"): string {
        return team.leader
            ? team.leader.title.join("")
            : team.selectedActor.title.join("") + pokemonSuffix;
    }
}
