import { OnChoice, SwitchAction, TeamId } from "battlemovr";
import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../../../FullScreenPokemon";
import { BattleInfo, Pokemon } from "../../../Battles";
import { FleeAttempt } from "../../animations/shared/actions/FleeAttempt";

/**
 * Menu interface for the player choosing whether to switch Pokemon.
 */
export class Switching extends Section<FullScreenPokemon> {
    /**
     * Offers to switch Pokemon after one is knocked out.
     *
     * @param teamId   Which team is being offered to switch.
     * @param onChoice   Callback for when this is done.
     */
    public offerSwitch(team: TeamId, onComplete: () => void): void {
        const openPokemonMenu: () => void = (): void => {
            this.openPokemonMenu(team, (action: SwitchAction): void => {
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
     * @param teamId   Team opening the menu.
     * @param onChoice   Callback for selecting a new Pokemon.
     * @param onClose   Callback for closing the menu if noactor is chosen.
     */
    public openPokemonMenu(team: TeamId, onChoice: OnChoice, onClose?: () => void): void {
        this.game.menus.pokemon.openPartyMenu({
            backMenu: "BattleOptions",
            container: "Battle",
            onBPress: (): void => {
                if (onClose) {
                    this.game.menuGrapher.deleteMenu("Pokemon");
                    onClose();
                }
            },
            onSwitch: (pokemon: Pokemon): void => {
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
     * @param teamId   Which team is attempting to switch.
     * @param pokemon   Selected Pokemon to try to switch to.
     * @param onSuccess   Callback if the Pokemon can be switched.
     */
    private attemptSwitch(team: TeamId, pokemon: Pokemon, onSuccess: () => void): void {
        const battleInfo: BattleInfo = this.game.battleMover.getBattleInfo() as BattleInfo;

        pokemon === battleInfo.teams[TeamId[team]].selectedActor
            ? this.rejectSwitch(pokemon)
            : onSuccess();
    }

    /**
     * Handler for the trying to switch to the current Pokemon.
     *
     * @param pokemon   The current Pokemon.
     */
    private rejectSwitch(pokemon: Pokemon): void {
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
