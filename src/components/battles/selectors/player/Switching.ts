import { ISwitchAction } from "battlemovr/lib/Actions";
import { IOnChoice } from "battlemovr/lib/Selectors";
import { Team } from "battlemovr/lib/Teams";
import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../../../../FullScreenPokemon";
import { IBattleInfo, IPokemon } from "../../../Battles";
import { FleeAttempt } from "../../animations/shared/actions/FleeAttempt";

/**
 * Player switching logic used by FullScreenPokemon instances.
 */
export class Switching<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
    /**
     * Offers to switch Pokemon after one is knocked out.
     * 
     * @param team   Which team is being offered to switch.
     * @param onChoice   Callback for when this is done.
     */
    public offerSwitch(team: Team, onComplete: () => void): void {
        const openPokemonMenu: () => void = (): void => {
            this.openBattlePokemonMenu(
                team,
                (action: ISwitchAction): void => {
                    this.gameStarter.battleMover.switchSelectedActor(team, action.newActor);
                    this.gameStarter.menuGrapher.deleteMenu("Pokemon");
                    this.gameStarter.battles.animations.getTeamAnimations(team).switching.enter(onComplete);
                });
        };

        if (!this.gameStarter.battles.canTeamAttemptFlee(team)) {
            openPokemonMenu();
            return;
        }

        this.gameStarter.menuGrapher.createMenu("GeneralText", {
            finishAutomatically: true
        });
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            "Use next %%%%%%%POKEMON%%%%%%%?",
            (): void => {
                this.gameStarter.menuGrapher.createMenu("Yes/No");
                this.gameStarter.menuGrapher.addMenuList("Yes/No", {
                    options: [
                        {
                            text: "YES",
                            callback: openPokemonMenu
                        },
                        {
                            text: "NO",
                            callback: (): void => {
                                new FleeAttempt(this.gameStarter).succeed();
                            }
                        }
                    ]
                });
                this.gameStarter.menuGrapher.setActiveMenu("Yes/No");
            });
    }

    /**
     * Opens the in-battle Pokemon menu.
     * 
     * @param team   Team opening the menu.
     * @param onChoice   Callback for selecting a new Pokemon.
     * @param onClose   Callback for closing the menu if nothing is chosen.
     */
    public openBattlePokemonMenu(team: Team, onChoice: IOnChoice, onClose?: () => void): void {
        this.gameStarter.menus.pokemon.openPartyMenu({
            backMenu: "BattleOptions",
            container: "Battle",
            onBPress: (): void => {
                if (onClose) {
                    this.gameStarter.menuGrapher.deleteMenu("Pokemon");
                    onClose();
                }
            },
            onSwitch: (pokemon: IPokemon): void => {
                this.attemptSwitch(
                    team,
                    pokemon,
                    (): void => {
                        onChoice({
                            newActor: pokemon,
                            type: "switch"
                        });
                    });
            }
        });
    }

    /**
     * Attempts to switch to a Pokemon.
     * 
     * @param team   Which team is attempting to switch.
     * @param pokemon   Selected Pokemon to try to switch to.
     * @param onSuccess   Callback if the Pokemon can be switched.
     */
    private attemptSwitch(team: Team, pokemon: IPokemon, onSuccess: () => void): void {
        const battleInfo: IBattleInfo = this.gameStarter.battleMover.getBattleInfo() as IBattleInfo;

        pokemon === battleInfo.teams[Team[team]].selectedActor
            ? this.rejectSwitch(pokemon)
            : onSuccess();
    }

    /**
     * Handler for the trying to switch to the current Pokemon.
     * 
     * @param pokemon   The current Pokemon.
     */
    private rejectSwitch(pokemon: IPokemon): void {
        this.gameStarter.menuGrapher.createMenu("GeneralText");
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    pokemon.title,
                    " is already out!"
                ]
            ],
            (): void => {
                this.gameStarter.menuGrapher.deleteMenu("GeneralText");
                this.gameStarter.menuGrapher.deleteMenu("PokemonMenuContext");
                this.gameStarter.menuGrapher.setActiveMenu("Pokemon");
            });
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }
}
