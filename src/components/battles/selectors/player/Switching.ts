import { IOnChoice, ISwitchAction, Team } from "battlemovr";
import { GeneralComponent } from "eightbittr";

import { FullScreenPokemon } from "../../../../FullScreenPokemon";
import { IBattleInfo, IPokemon } from "../../../Battles";
import { FleeAttempt } from "../../animations/shared/actions/FleeAttempt";

/**
 * Menu interface for the player choosing whether to switch Pokemon.
 */
export class Switching<TEightBittr extends FullScreenPokemon> extends GeneralComponent<TEightBittr> {
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
                    this.eightBitter.battleMover.switchSelectedActor(team, action.newActor);
                    this.eightBitter.menuGrapher.deleteMenu("Pokemon");
                    this.eightBitter.battles.animations.getTeamAnimations(team).switching.enter(onComplete);
                });
        };

        if (!this.eightBitter.battles.canTeamAttemptFlee(team)) {
            openPokemonMenu();
            return;
        }

        this.eightBitter.menuGrapher.createMenu("GeneralText", {
            finishAutomatically: true,
        });
        this.eightBitter.menuGrapher.addMenuDialog(
            "GeneralText",
            "Use next %%%%%%%POKEMON%%%%%%%?",
            (): void => {
                this.eightBitter.menuGrapher.createMenu("Yes/No");
                this.eightBitter.menuGrapher.addMenuList("Yes/No", {
                    options: [
                        {
                            text: "YES",
                            callback: openPokemonMenu,
                        },
                        {
                            text: "NO",
                            callback: (): void => {
                                new FleeAttempt(this.eightBitter).succeed();
                            },
                        },
                    ],
                });
                this.eightBitter.menuGrapher.setActiveMenu("Yes/No");
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
        this.eightBitter.menus.pokemon.openPartyMenu({
            backMenu: "BattleOptions",
            container: "Battle",
            onBPress: (): void => {
                if (onClose) {
                    this.eightBitter.menuGrapher.deleteMenu("Pokemon");
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
        const battleInfo: IBattleInfo = this.eightBitter.battleMover.getBattleInfo() as IBattleInfo;

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
        this.eightBitter.menuGrapher.createMenu("GeneralText");
        this.eightBitter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    pokemon.title,
                    " is already out!",
                ],
            ],
            (): void => {
                this.eightBitter.menuGrapher.deleteMenu("GeneralText");
                this.eightBitter.menuGrapher.deleteMenu("PokemonMenuContext");
                this.eightBitter.menuGrapher.setActiveMenu("Pokemon");
            });
        this.eightBitter.menuGrapher.setActiveMenu("GeneralText");
    }
}
