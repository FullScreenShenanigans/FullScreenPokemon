import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { IPokedexInformation, IPokemonListing } from "../constants/Pokemon";

/**
 * Opens the Pokedex and its individual listings.
 */
export class Pokedex extends Section<FullScreenPokemon> {
    /**
     * Opens the Pokedex menu.
     */
    public readonly open = (): void => {
        const listings: (IPokedexInformation | undefined)[] = this.game.saves.getPokedexListingsOrdered();
        let currentListing: IPokedexInformation;

        this.game.menuGrapher.createMenu("Pokedex");
        this.game.menuGrapher.addMenuList("Pokedex", {
            options: listings.map((listing: IPokedexInformation, i: number): any => {
                const characters: any[] = this.game.utilities.makeDigit(i + 1, 3, 0).split("");
                const output: any = {
                    text: characters,
                    callback: (): void => {
                        currentListing = listing;
                        this.game.menuGrapher.setActiveMenu("PokedexOptions");
                    },
                };

                characters.push({
                    command: true,
                    y: 4,
                });

                if (listing) {
                    if (listing.caught) {
                        characters.push({
                            command: true,
                            x: -4,
                            y: 1,
                        });
                        characters.push("Ball");
                        characters.push({
                            command: true,
                            y: -1,
                        });
                    }

                    characters.push(...listing.title);
                } else {
                    characters.push(..."----------".split(""));
                }

                characters.push({
                    command: true,
                    y: -4,
                });

                return output;
            }),
        });
        this.game.menuGrapher.setActiveMenu("Pokedex");

        this.game.menuGrapher.createMenu("PokedexOptions");
        this.game.menuGrapher.addMenuList("PokedexOptions", {
            options: [
                {
                    callback: (): void => {
                        this.openPokedexListing(
                            currentListing.title,
                            (): void => {
                                this.game.menuGrapher.setActiveMenu("PokedexOptions");
                            });
                    },
                    text: "DATA",
                },
                {
                    callback: (): void => {
                        console.log("Moo.");
                    },
                    text: "CRY",
                },
                {
                    callback: (): void => {
                        this.game.menus.townMap.open({
                            backMenu: "PokedexOptions",
                        });
                        this.game.menus.townMap.showPokemonLocations(currentListing.title);
                    },
                    text: "AREA",
                },
                {
                    callback: this.game.menuGrapher.registerB,
                    text: "QUIT",
                },
            ],
        });
    }

    /**
     * Opens a Pokedex listing for a Pokemon.
     *
     * @param title   The title of the Pokemon to open the listing for.
     * @param callback   A callback for when the menu is closed.
     */
    public openPokedexListing(title: string[], callback?: (...args: any[]) => void, menuSettings?: any): void {
        const pokemon: IPokemonListing = this.game.constants.pokemon.byName[title.join("")];
        const height: string[] = pokemon.height;
        const feet: string = [].slice.call(height[0]).reverse().join("");
        const inches: string = [].slice.call(height[1]).reverse().join("");
        const onCompletion: () => any = (): void => {
            this.game.menuGrapher.deleteMenu("PokedexListing");
            if (callback) {
                callback();
            }
        };

        this.game.menuGrapher.createMenu("PokedexListing", menuSettings);
        this.game.menuGrapher.createMenuThing("PokedexListingSprite", {
            thing: title.join("") + "Front",
            type: "thing",
            args: {
                flipHoriz: true,
            },
        });
        this.game.menuGrapher.addMenuDialog("PokedexListingName", [[title]]);
        this.game.menuGrapher.addMenuDialog("PokedexListingLabel", pokemon.label);
        this.game.menuGrapher.addMenuDialog("PokedexListingHeightFeet", feet);
        this.game.menuGrapher.addMenuDialog("PokedexListingHeightInches", inches);
        this.game.menuGrapher.addMenuDialog("PokedexListingWeight", pokemon.weight.toString());
        this.game.menuGrapher.addMenuDialog(
            "PokedexListingNumber",
            this.game.utilities.makeDigit(pokemon.number, 3, "0"));

        this.game.menuGrapher.addMenuDialog(
            "PokedexListingInfo",
            pokemon.info[0],
            (): void => {
                if (pokemon.info.length < 2) {
                    onCompletion();
                    return;
                }

                this.game.menuGrapher.createMenu("PokedexListingInfo");
                this.game.menuGrapher.addMenuDialog("PokedexListingInfo", pokemon.info[1], onCompletion);
                this.game.menuGrapher.setActiveMenu("PokedexListingInfo");
            });

        this.game.menuGrapher.setActiveMenu("PokedexListingInfo");
    }
}
