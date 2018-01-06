import { GeneralComponent } from "gamestartr";

import { IPokemon } from "../../components/Battles";
import { FullScreenPokemon } from "../../FullScreenPokemon";
import { IItemSchema } from "../constants/Items";
import { IMenuSchema } from "../Menus";

/**
 * A single item's listing in an inventory.
 *
 * @todo When items get their own component(s), move this there.
 */
export interface IInventoryListing {
    /**
     * Quantity the item.
     */
    amount: number;

    /**
     * Name of the item.
     */
    item: string;
}

/**
 * Callback for peforming an action with an item's listing.
 *
 * @param listing   A selected item listing.
 */
export type IOnListingSelect = (listing: IInventoryListing) => void;

/**
 * Settings to open an individual item's menu.
 */
export interface IItemMenuSettings extends IMenuSchema {
    /**
     * Callback for when an item should be tossed.
     */
    onToss?: IOnListingSelect;

    /**
     * Callback for when an item should be used.
     */
    onUse?: IOnListingSelect;
}

/**
 * Settings to open the items menu.
 */
export interface IItemsMenuSettings extends IItemMenuSettings {
    /**
     * Whether selecting an item should go directly to choosing a target.
     */
    disableTossing?: boolean;

    /**
     * Items to display, if not the player's inventory.
     */
    items?: IInventoryListing[];
}

/**
 * Manipulates item menus.
 */
export class Items<TGameStartr extends FullScreenPokemon> extends GeneralComponent<TGameStartr> {
    /**
     * Opens the Items menu for the items in the player's inventory.
     *
     * @param settings   Custom attributes to apply to the menu.
     */
    public open(settings: IItemsMenuSettings): void {
        const listings: IInventoryListing[] = settings.items || this.gameStarter.itemsHolder.getItem("items").slice();
        const options: any[] = listings.map((listing: IInventoryListing): any =>
            ({
                text: listing.item,
                callback: (): void => this.openItem(listing, settings),
                textsFloating: [
                    {
                        text: [["Times"]],
                        x: 128,
                        y: 18,
                    },
                    {
                        text: this.gameStarter.utilities.makeDigit(listing.amount, 2, " "),
                        x: 146,
                        y: 16,
                    },
                ],
            }));

        options.push({
            text: "CANCEL",
            callback: () => this.gameStarter.menuGrapher.registerB(),
        });

        this.gameStarter.modAttacher.fireEvent(this.gameStarter.mods.eventNames.onOpenItemsMenu, listings);

        this.gameStarter.menuGrapher.createMenu("Items", settings);
        this.gameStarter.menuGrapher.addMenuList("Items", { options });
        this.gameStarter.menuGrapher.setActiveMenu("Items");

        console.warn("Once item info is better implemented, react to non-stackable items...");
    }

    /**
     * Opens the Item menu for an item the player selected from the inventory.
     *
     * @param listing   Item listing being displayed.
     * @param settings   Custom attributes to apply to the menu.
     */
    public openItem(listing: IInventoryListing, settings: IItemMenuSettings): void {
        const options = [
            {
                callback: (): void => {
                    if (!settings.onUse) {
                        throw new Error("No onUse defined for items.");
                    }

                    settings.onUse(listing);
                },
                text: "USE",
            },
            {
                callback: (): void => {
                    if (!settings.onToss) {
                        throw new Error("No onToss defined for items.");
                    }

                    settings.onToss(listing);
                },
                text: "TOSS",
            },
        ];

        if (this.gameStarter.flagSwapper.flags.heldItems) {
            options.push({
                callback: (): void => {
                    const partyPokemon: IPokemon[] = this.gameStarter.itemsHolder.getItem("PokemonInParty");
                    const chosenPokemon = partyPokemon[0];
                    chosenPokemon.item = listing.item.split("");
                    listing.amount = listing.amount - 1;
                    console.log("Something visual should happen when an item is given...");
                },
                text: "GIVE",
            });
        }

        this.gameStarter.modAttacher.fireEvent(this.gameStarter.mods.eventNames.onOpenItemMenu, listing);

        this.gameStarter.menuGrapher.createMenu("Item", settings);
        this.gameStarter.menuGrapher.addMenuList("Item", { options });
        this.gameStarter.menuGrapher.setActiveMenu("Item");
    }
}
