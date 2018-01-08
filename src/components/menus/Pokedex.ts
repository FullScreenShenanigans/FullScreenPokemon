import { GeneralComponent } from "gamestartr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { IPokedexInformation, IPokemonListing } from "../constants/Pokemon";

/**
 * Opens the Pokedex and its individual listings.
 */
export class Pokedex<TGameStartr extends FullScreenPokemon> extends GeneralComponent<TGameStartr> {
    /**
     * Opens the Pokedex menu.
     */
    public readonly open = (): void => {
        const listings: (IPokedexInformation | undefined)[] = this.gameStarter.saves.getPokedexListingsOrdered();
        let currentListing: IPokedexInformation;

        this.gameStarter.menuGrapher.createMenu("Pokedex");
        this.gameStarter.menuGrapher.addMenuList("Pokedex", {
            options: listings.map((listing: IPokedexInformation, i: number): any => {
                const characters: any[] = this.gameStarter.utilities.makeDigit(i + 1, 3, 0).split("");
                const output: any = {
                    text: characters,
                    callback: (): void => {
                        currentListing = listing;
                        this.gameStarter.menuGrapher.setActiveMenu("PokedexOptions");
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
        this.gameStarter.menuGrapher.setActiveMenu("Pokedex");

        this.gameStarter.menuGrapher.createMenu("PokedexOptions");
        this.gameStarter.menuGrapher.addMenuList("PokedexOptions", {
            options: [
                {
                    callback: (): void => {
                        this.openPokedexListing(
                            currentListing.title,
                            (): void => {
                                this.gameStarter.menuGrapher.setActiveMenu("PokedexOptions");
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
                        this.gameStarter.menus.townMap.open({
                            backMenu: "PokedexOptions",
                        });
                        this.gameStarter.menus.townMap.showPokemonLocations(currentListing.title);
                    },
                    text: "AREA",
                },
                {
                    callback: this.gameStarter.menuGrapher.registerB,
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
        const pokemon: IPokemonListing = this.gameStarter.constants.pokemon.byName[title.join("")];
        const height: string[] = pokemon.height;
        const feet: string = [].slice.call(height[0]).reverse().join("");
        const inches: string = [].slice.call(height[1]).reverse().join("");
        const onCompletion: () => any = (): void => {
            this.gameStarter.menuGrapher.deleteMenu("PokedexListing");
            if (callback) {
                callback();
            }
        };

        this.gameStarter.menuGrapher.createMenu("PokedexListing", menuSettings);
        this.gameStarter.menuGrapher.createMenuThing("PokedexListingSprite", {
            thing: title.join("") + "Front",
            type: "thing",
            args: {
                flipHoriz: true,
            },
        });
        this.gameStarter.menuGrapher.addMenuDialog("PokedexListingName", [[title]]);
        this.gameStarter.menuGrapher.addMenuDialog("PokedexListingLabel", pokemon.label);
        this.gameStarter.menuGrapher.addMenuDialog("PokedexListingHeightFeet", feet);
        this.gameStarter.menuGrapher.addMenuDialog("PokedexListingHeightInches", inches);
        this.gameStarter.menuGrapher.addMenuDialog("PokedexListingWeight", pokemon.weight.toString());
        this.gameStarter.menuGrapher.addMenuDialog(
            "PokedexListingNumber",
            this.gameStarter.utilities.makeDigit(pokemon.number, 3, "0"));

        this.gameStarter.menuGrapher.addMenuDialog(
            "PokedexListingInfo",
            pokemon.info[0],
            (): void => {
                if (pokemon.info.length < 2) {
                    onCompletion();
                    return;
                }

                this.gameStarter.menuGrapher.createMenu("PokedexListingInfo");
                this.gameStarter.menuGrapher.addMenuDialog("PokedexListingInfo", pokemon.info[1], onCompletion);
                this.gameStarter.menuGrapher.setActiveMenu("PokedexListingInfo");
            });

        this.gameStarter.menuGrapher.setActiveMenu("PokedexListingInfo");
    }
}
