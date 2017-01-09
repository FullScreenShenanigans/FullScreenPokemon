import { IOnChoice } from "battlemovr/lib/Selectors";
import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../../../../FullScreenPokemon";
import { IBattleInfo, IPokemon } from "../../../Battles";

/**
 * Player switching logic used by FullScreenPokemon instances.
 */
export class Switching<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
    /**
     * Opens the in-battle Pokemon menu.
     * 
     * @param battleInfo   State for an ongoing battle.
     * @param onChoice   Callback for closing the menu if nothing is chosen.
     */
    public openBattlePokemonMenu(onChoice: IOnChoice, onClose: () => void): void {
        this.gameStarter.menus.pokemon.openPartyMenu({
            backMenu: "BattleOptions",
            container: "Battle",
            onBPress: (): void => {
                this.gameStarter.menuGrapher.deleteMenu("Pokemon");
                onClose();
            },
            onSwitch: (pokemon: IPokemon): void => {
                this.attemptSwitch(
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
     * @param pokemon   Selected Pokemon to try to switch to.
     * @param onSuccess   Callback if the Pokemon can be switched.
     */
    private attemptSwitch(pokemon: IPokemon, onSuccess: () => void): void {
        const battleInfo: IBattleInfo = this.gameStarter.battleMover.getBattleInfo() as IBattleInfo;

        pokemon === battleInfo.teams.player.selectedActor
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
