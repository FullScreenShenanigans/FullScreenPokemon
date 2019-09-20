import { GeneralComponent } from "eightbittr";

import { FullScreenPokemon } from "../../../FullScreenPokemon";
import { IPokemon } from "../../Battles";

/**
 * Opens and runs the Pause menu of Pokemon.
 */
export class PausedParty<TEightBittr extends FullScreenPokemon> extends GeneralComponent<TEightBittr> {
    /**
     * Opens the Pause menu of Pokemon.
     */
    public readonly open = (): void => {
        this.eightBitter.menus.pokemon.openPartyMenu({
            onSwitch: (pokemon: IPokemon[], selectedIndex: number) => {
                this.eightBitter.menus.pokemon.switch.open(
                    pokemon,
                    selectedIndex,
                    (newSelectedIndex: number) => {
                        this.eightBitter.utilities.swapArrayMembers(
                            pokemon,
                            selectedIndex,
                            newSelectedIndex,
                        );

                        this.eightBitter.itemsHolder.setItem(
                            this.eightBitter.storage.names.pokemonInParty,
                            pokemon,
                        );

                        this.open();
                    },
                );
            },
        });
    }
}
