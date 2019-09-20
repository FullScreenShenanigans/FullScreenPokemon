import { GeneralComponent } from "eightbittr";

import { FullScreenPokemon } from "../../../FullScreenPokemon";
import { IPokemon } from "../../Battles";

/**
 * Opens and closes the switch dialog in the Pokemon menu.
 */
export class Switch<TEightBittr extends FullScreenPokemon> extends GeneralComponent<TEightBittr> {
    /**
     * Opens the Switch dialog in the Pokemon menu.
     */
    public readonly open = (
        pokemon: IPokemon[],
        selectedIndex: number,
        onSelect: (newIndex: number) => void,
    ): void => {
        // The original games just refreshed the menu if they only had one Pokemon
        if (pokemon.length === 0) {
            this.refreshMenu();
            return;
        }

        this.eightBitter.menus.pokemon.openPartyMenu({
            onSelect,
            pokemon,
            selectedIndex,
        });

        this.eightBitter.menuGrapher.createMenu("PokemonDialog", {
            childrenSchemas: [{
                type: "text",
                words: [
                    "Move %%%%%%%POKEMON%%%%%%%\nwhere?",
                ],
            }],
        });
    }

    private refreshMenu(): void {
        this.eightBitter.menuGrapher.createMenu("PokemonBlank");
        this.eightBitter.menuGrapher.setActiveMenu("PokemonBlank");
        this.eightBitter.menuGrapher.deleteMenu("PokemonMenuContext");

        this.eightBitter.timeHandler.addEvent(
            () => {
                this.eightBitter.menuGrapher.deleteMenu("PokemonBlank");
                this.eightBitter.menuGrapher.setActiveMenu("Pokemon");
            },
            24,
        );
    }
}
