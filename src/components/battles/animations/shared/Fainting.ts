import { ITeamLeader, Team } from "battlemovr/lib/Teams";
import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../../../../FullScreenPokemon";
import { IBattleInfo, IPokemon } from "../../../Battles";
import { IExperienceGains } from "../../../Experience";
import { IThing } from "../../../Things";

/**
 * Animations for a Pokemon fainting.
 */
export class Fainting<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
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
        const blank: IThing = this.gameStarter.battles.decorations.addThingAsText(
            "WhiteSquare",
            {
                width: thing.width * thing.scale!,
                height: thing.height * thing.scale!
            });

        this.gameStarter.battles.decorations.moveToBeforeBackground(blank);
        this.gameStarter.battles.decorations.moveToBeforeBackground(thing);
        const experienceGained: IExperienceGains[] = this.isThereATrainer(teamName, battleInfo.teams.opponent.leader, pokemon);

        this.gameStarter.physics.setLeft(blank, thing.left);
        this.gameStarter.physics.setTop(blank, thing.top + thing.height * thing.scale!);

        this.gameStarter.actions.sliding.slideVertically(
            thing,
            8,
            this.gameStarter.physics.getMidY(thing) + thing.height * thing.scale!,
            1,
            (): void => {
                const playerName = this.gameStarter.itemsHolder.getItem("name");
                const partyIsWipedText: (string | string[])[][] = [[pokemon.nickname, " fainted!"]];

                this.gameStarter.physics.killNormal(thing);
                this.gameStarter.physics.killNormal(blank);
                this.gameStarter.menuGrapher.createMenu("GeneralText");
                if (this.gameStarter.battles.isPartyWiped()) {
                    partyIsWipedText.push(
                        [playerName, " is out of useable Pokemon!"],
                        [playerName, " blacked out!"]);
                } else if (teamName === "opponent") {
                    for (const pokemonExperience of experienceGained) {
                        partyIsWipedText.push(
                            [pokemonExperience.pokemonName, " gained ",
                             pokemonExperience.experienceGained, " EXP. Points!"]
                        );
                    }
                    this.OpponentFainted();
                }

                this.gameStarter.menuGrapher.addMenuDialog("GeneralText", partyIsWipedText, onComplete);
                this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
            });

        this.gameStarter.modAttacher.fireEvent(this.gameStarter.mods.eventNames.onFaint, pokemon, battleInfo.teams.player.actors);
    }

    /**
     * Sees if battle is against trainer or wild Pokemon.
     *
     * @param teamName    Tells if the Pokemon is the players or the opponents.
     * @param battleInfo    Used to tell if player is fighting a wild Pokemon or trainer.
     * @param pokemon   Information of defeated Pokemon.
     */
    private isThereATrainer(teamName: string, battleInfo: ITeamLeader | undefined , pokemon: IPokemon): IExperienceGains[] {
        if (teamName === "opponent") {
            let trainer: boolean = true;
            if (battleInfo === undefined) {
                trainer = false;
            }
            return this.gameStarter.experience.calculateExperience(pokemon, trainer);
        }

        return [];
    }

    /**
     * Changes current battle participant list to selected Pokemon.
     */
    private OpponentFainted(): void {
        this.gameStarter.itemsHolder.setItem("BattleParticipants",
                                             this.gameStarter.battleMover.getBattleInfo().teams.player.selectedActor);
    }
 }
