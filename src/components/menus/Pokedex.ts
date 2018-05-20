import { GeneralComponent } from "eightbittr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { IPokedexInformation, IPokemonListing } from "../constants/Pokemon";

/**
 * Opens the Pokedex and its individual listings.
 */
export class Pokedex<TEightBittr extends FullScreenPokemon> extends GeneralComponent<TEightBittr> {
    /**
     * Opens the Pokedex menu.
     */
    public readonly open = (): void => {
        const listings: (IPokedexInformation | undefined)[] = this.eightBitter.saves.getPokedexListingsOrdered();
        let currentListing: IPokedexInformation;

        this.eightBitter.menuGrapher.createMenu("Pokedex");
        this.eightBitter.menuGrapher.addMenuList("Pokedex", {
            options: listings.map((listing: IPokedexInformation, i: number): any => {
                const characters: any[] = this.eightBitter.utilities.makeDigit(i + 1, 3, 0).split("");
                const output: any = {
                    text: characters,
                    callback: (): void => {
                        currentListing = listing;
                        this.eightBitter.menuGrapher.setActiveMenu("PokedexOptions");
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
        this.eightBitter.menuGrapher.setActiveMenu("Pokedex");

        this.eightBitter.menuGrapher.createMenu("PokedexOptions");
        this.eightBitter.menuGrapher.addMenuList("PokedexOptions", {
            options: [
                {
                    callback: (): void => {
                        this.openPokedexListing(
                            currentListing.title,
                            (): void => {
                                this.eightBitter.menuGrapher.setActiveMenu("PokedexOptions");
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
                        this.eightBitter.menus.townMap.open({
                            backMenu: "PokedexOptions",
                        });
                        this.eightBitter.menus.townMap.showPokemonLocations(currentListing.title);
                    },
                    text: "AREA",
                },
                {
                    callback: this.eightBitter.menuGrapher.registerB,
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
        const pokemon: IPokemonListing = this.eightBitter.constants.pokemon.byName[title.join("")];
        const height: string[] = pokemon.height;
        const feet: string = [].slice.call(height[0]).reverse().join("");
        const inches: string = [].slice.call(height[1]).reverse().join("");
        const onCompletion: () => any = (): void => {
            this.eightBitter.menuGrapher.deleteMenu("PokedexListing");
            if (callback) {
                callback();
            }
        };

        this.eightBitter.menuGrapher.createMenu("PokedexListing", menuSettings);
        this.eightBitter.menuGrapher.createMenuThing("PokedexListingSprite", {
            thing: title.join("") + "Front",
            type: "thing",
            args: {
                flipHoriz: true,
            },
        });
        this.eightBitter.menuGrapher.addMenuDialog("PokedexListingName", [[title]]);
        this.eightBitter.menuGrapher.addMenuDialog("PokedexListingLabel", pokemon.label);
        this.eightBitter.menuGrapher.addMenuDialog("PokedexListingHeightFeet", feet);
        this.eightBitter.menuGrapher.addMenuDialog("PokedexListingHeightInches", inches);
        this.eightBitter.menuGrapher.addMenuDialog("PokedexListingWeight", pokemon.weight.toString());
        this.eightBitter.menuGrapher.addMenuDialog(
            "PokedexListingNumber",
            this.eightBitter.utilities.makeDigit(pokemon.number, 3, "0"));

        this.eightBitter.menuGrapher.addMenuDialog(
            "PokedexListingInfo",
            pokemon.info[0],
            (): void => {
                if (pokemon.info.length < 2) {
                    onCompletion();
                    return;
                }

                this.eightBitter.menuGrapher.createMenu("PokedexListingInfo");
                this.eightBitter.menuGrapher.addMenuDialog("PokedexListingInfo", pokemon.info[1], onCompletion);
                this.eightBitter.menuGrapher.setActiveMenu("PokedexListingInfo");
            });

        this.eightBitter.menuGrapher.setActiveMenu("PokedexListingInfo");
    }
}
