import { Team } from "battlemovr";
import { GeneralComponent } from "eightbittr";

import { FullScreenPokemon } from "../../../../FullScreenPokemon";
import { IBattleInfo, IPokemon } from "../../../Battles";
import { IThing } from "../../../Things";

/**
 * Animations for a Pokemon fainting.
 */
export class Fainting<TEightBittr extends FullScreenPokemon> extends GeneralComponent<TEightBittr> {
    /**
     * Runs a fainting animation.
     *
     * @param pokemon   Pokemon fainting.
     * @param team   The Pokemon's team.
     * @param onComplete   Handler for when this is done.
     */
    public run(pokemon: IPokemon, team: Team, onComplete: () => void): void {
        const battleInfo: IBattleInfo = this.eightBitter.battleMover.getBattleInfo() as IBattleInfo;
        const teamName: "player" | "opponent" = Team[team] as "player" | "opponent";
        const thing: IThing = battleInfo.things[teamName];
        const scale = thing.scale === undefined
            ? 1
            : thing.scale;
        const blank: IThing = this.eightBitter.battles.decorations.addThingAsText(
            "WhiteSquare",
            {
                width: thing.width * scale,
                height: thing.height * scale,
            });

        this.eightBitter.battles.decorations.moveToBeforeBackground(blank);
        this.eightBitter.battles.decorations.moveToBeforeBackground(thing);

        this.eightBitter.physics.setLeft(blank, thing.left);
        this.eightBitter.physics.setTop(blank, thing.top + thing.height * scale);

        this.eightBitter.animations.sliding.slideVertically(
            thing,
            8,
            this.eightBitter.physics.getMidY(thing) + thing.height * scale,
            1,
            (): void => {
                const playerName = this.eightBitter.itemsHolder.getItem(this.eightBitter.storage.names.name);
                const partyIsWipedText: (string | string[])[][] = [[pokemon.nickname, " fainted!"]];

                if (teamName === "opponent") {
                    this.processOpponentFainting(partyIsWipedText, onComplete, battleInfo, thing, blank);
                } else {
                    this.processPlayerFainting(partyIsWipedText, onComplete, battleInfo, thing, blank, playerName);
                }
                this.eightBitter.menuGrapher.setActiveMenu("GeneralText");
                this.eightBitter.death.killNormal(thing);
                this.eightBitter.death.killNormal(blank);
            });

        this.eightBitter.modAttacher.fireEvent(this.eightBitter.mods.eventNames.onFaint, pokemon, battleInfo.teams.player.actors);
    }

     /**
      * Helper function to start the process of gaining experience
      */
    private processOpponentFainting(
        partyIsWipedText: (string | string[])[][],
        onComplete: () => void, battleInfo: IBattleInfo,
        thing: IThing, blank: IThing) {
        this.eightBitter.menuGrapher.createMenu("GeneralText");
        this.eightBitter.menuGrapher.addMenuDialog(
            "GeneralText", partyIsWipedText,
            () => this.eightBitter.experience.processBattleExperience(battleInfo, onComplete));
    }

     /**
      * Helper function to start the process of a player's pokemon fainitng
      */
    private processPlayerFainting(
        partyIsWipedText: (string | string[])[][],
        onComplete: () => void, battleInfo: IBattleInfo,
        thing: IThing, blank: IThing, playerName: string[]) {
        this.eightBitter.menuGrapher.createMenu("GeneralText");
        if (this.eightBitter.battles.isPartyWiped()) {
            partyIsWipedText.push(
            [playerName, " is out of useable Pokemon!"],
            [playerName, " blacked out!"]);
        }

        this.eightBitter.menuGrapher.addMenuDialog("GeneralText", partyIsWipedText, onComplete);
    }
}
