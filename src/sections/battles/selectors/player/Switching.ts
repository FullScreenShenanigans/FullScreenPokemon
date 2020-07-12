import { IOnChoice, ISwitchAction, Team } from "battlemovr";
import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../../../FullScreenPokemon";
import { IBattleInfo, IPokemon } from "../../../Battles";
import { FleeAttempt } from "../../animations/shared/actions/FleeAttempt";

/**
 * Menu interface for the player choosing whether to switch Pokemon.
 */
export class Switching extends Section<FullScreenPokemon> {
    /**
     * Offers to switch Pokemon after one is knocked out.
     *
     * @param team   Which team is being offered to switch.
     * @param onChoice   Callback for when this is done.
     */
    public offerSwitch(team: Team, onComplete: () => void): void {
        const openPokemonMenu: () => void = (): void => {
            this.openBattlePokemonMenu(team, (action: ISwitchAction): void => {
                this.game.battleMover.switchSelectedActor(team, action.newActor);
                this.game.menuGrapher.deleteMenu("Pokemon");
                this.game.battles.animations.getTeamAnimations(team).switching.enter(onComplete);
            });
        };

        if (!this.game.battles.canTeamAttemptFlee(team)) {
            openPokemonMenu();
            return;
        }

        this.game.menuGrapher.createMenu("GeneralText", {
            finishAutomatically: true,
        });
        this.game.menuGrapher.addMenuDialog(
            "GeneralText",
            "Use next %%%%%%%POKEMON%%%%%%%?",
            (): void => {
                this.game.menuGrapher.createMenu("Yes/No");
                this.game.menuGrapher.addMenuList("Yes/No", {
                    options: [
                        {
                            text: "YES",
                            callback: openPokemonMenu,
                        },
                        {
                            text: "NO",
                            callback: (): void => {
                                new FleeAttempt(this.game).succeed();
                            },
                        },
                    ],
                });
                this.game.menuGrapher.setActiveMenu("Yes/No");
            }
        );
    }

    /**
     * Opens the in-battle Pokemon menu.
     *
     * @param team   Team opening the menu.
     * @param onChoice   Callback for selecting a new Pokemon.
     * @param onClose   Callback for closing the menu if nothing is chosen.
     */
    public openBattlePokemonMenu(team: Team, onChoice: IOnChoice, onClose?: () => void): void {
        this.game.menus.pokemon.openPartyMenu({
            backMenu: "BattleOptions",
            container: "Battle",
            onBPress: (): void => {
                if (onClose) {
                    this.game.menuGrapher.deleteMenu("Pokemon");
                    onClose();
                }
            },
            onSwitch: (pokemon: IPokemon): void => {
                this.attemptSwitch(team, pokemon, (): void => {
                    onChoice({
                        newActor: pokemon,
                        type: "switch",
                    });
                });
            },
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
        const battleInfo: IBattleInfo = this.game.battleMover.getBattleInfo() as IBattleInfo;

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
        this.game.menuGrapher.createMenu("GeneralText");
        this.game.menuGrapher.addMenuDialog(
            "GeneralText",
            [[pokemon.title, " is already out!"]],
            (): void => {
                this.game.menuGrapher.deleteMenu("GeneralText");
                this.game.menuGrapher.deleteMenu("PokemonMenuContext");
                this.game.menuGrapher.setActiveMenu("Pokemon");
            }
        );
        this.game.menuGrapher.setActiveMenu("GeneralText");
    }
}
