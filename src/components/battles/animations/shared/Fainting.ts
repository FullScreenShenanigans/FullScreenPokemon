import { Team } from "battlemovr";
import { GeneralComponent } from "gamestartr";

import { FullScreenPokemon } from "../../../../FullScreenPokemon";
import { IBattleInfo, IPokemon } from "../../../Battles";
import { IThing } from "../../../Things";

/**
 * Animations for a Pokemon fainting.
 */
export class Fainting<TGameStartr extends FullScreenPokemon> extends GeneralComponent<TGameStartr> {
    /**
     * Runs a fainting animation.
     *
     * @param pokemon   Pokemon fainting.
     * @param team   The Pokemon's team.
     * @param onComplete   Handler for when this is done.
     */
    public run(pokemon: IPokemon, team: Team, onComplete: () => void): void {
        const battleInfo: IBattleInfo = this.gameStarter.battleMover.getBattleInfo() as IBattleInfo;
        const teamName: "player" | "opponent" = Team[team] as "player" | "opponent";
        const thing: IThing = battleInfo.things[teamName];
        const scale = thing.scale === undefined
            ? 1
            : thing.scale;
        const blank: IThing = this.gameStarter.battles.decorations.addThingAsText(
            "WhiteSquare",
            {
                width: thing.width * scale,
                height: thing.height * scale,
            });

        this.gameStarter.battles.decorations.moveToBeforeBackground(blank);
        this.gameStarter.battles.decorations.moveToBeforeBackground(thing);

        this.gameStarter.physics.setLeft(blank, thing.left);
        this.gameStarter.physics.setTop(blank, thing.top + thing.height * scale);

        this.gameStarter.animations.sliding.slideVertically(
            thing,
            8,
            this.gameStarter.physics.getMidY(thing) + thing.height * scale,
            1,
            (): void => {
                const playerName = this.gameStarter.itemsHolder.getItem(this.gameStarter.storage.names.name);
                const partyIsWipedText: (string | string[])[][] = [[pokemon.nickname, " fainted!"]];

                if (teamName === "opponent") {
                    this.processOpponentFainting(partyIsWipedText, onComplete, battleInfo, thing, blank);
                } else {
                    this.processPlayerFainting(partyIsWipedText, onComplete, battleInfo, thing, blank, playerName);
                }
                this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
                this.gameStarter.physics.killNormal(thing);
                this.gameStarter.physics.killNormal(blank);
            });

        this.gameStarter.modAttacher.fireEvent(this.gameStarter.mods.eventNames.onFaint, pokemon, battleInfo.teams.player.actors);
    }

     /**
      * Helper function to start the process of gaining experience
      */
    private processOpponentFainting(
        partyIsWipedText: (string | string[])[][],
        onComplete: () => void, battleInfo: IBattleInfo,
        thing: IThing, blank: IThing) {
        this.gameStarter.menuGrapher.createMenu("GeneralText");
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText", partyIsWipedText,
            () => this.gameStarter.experience.processBattleExperience(battleInfo, onComplete));
    }

     /**
      * Helper function to start the process of a player's pokemon fainitng
      */
    private processPlayerFainting(
        partyIsWipedText: (string | string[])[][],
        onComplete: () => void, battleInfo: IBattleInfo,
        thing: IThing, blank: IThing, playerName: string[]) {
        this.gameStarter.menuGrapher.createMenu("GeneralText");
        if (this.gameStarter.battles.isPartyWiped()) {
            partyIsWipedText.push(
            [playerName, " is out of useable Pokemon!"],
            [playerName, " blacked out!"]);
        }

        this.gameStarter.menuGrapher.addMenuDialog("GeneralText", partyIsWipedText, onComplete);
    }
}
