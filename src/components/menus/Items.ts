import { Component } from "eightbittr/lib/Component";

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
export interface IOnListingSelect {
    (listing: IInventoryListing): void;
}

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
    items?: IItemSchema[];
}

/**
 * Items menu functions used by FullScreenPokemon instances.
 */
export class Items<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
    /**
     * Opens the Items menu for the items in the player's inventory.
     * 
     * @param settings   Custom attributes to apply to the menu.
     */
    public openItemsMenu(settings: IItemsMenuSettings = {}): void {
        const listings: IInventoryListing[] = settings.items || this.gameStarter.itemsHolder.getItem("items").slice();
        const options: any[] = listings.map((listing: IInventoryListing): any => {
            return {
                text: listing.item,
                callback: (): void => this.openItemMenu(listing, settings),
                textsFloating: [
                    {
                        text: [["Times"]],
                        x: 32,
                        y: 4.5
                    }, {
                        text: this.gameStarter.utilities.makeDigit(listing.amount, 2, " "),
                        x: 36.5,
                        y: 4
                    }
                ]
            };
        });

        options.push({
            text: "CANCEL",
            callback: () => this.gameStarter.menuGrapher.registerB()
        });

        this.gameStarter.modAttacher.fireEvent("onOpenItemsMenu", listings);

        this.gameStarter.menuGrapher.createMenu("Items", settings);
        this.gameStarter.menuGrapher.addMenuList("Items", { options });
        this.gameStarter.menuGrapher.setActiveMenu("Items");

        console.warn("Once item info is better implemented, react to non-stackable items...");
    }

    /**
     * Opens the Item menu for the item the player selected from the inventory.
     * 
     * @param listing   Item listing being displayed.
     * @param settings   Custom attributes to apply to the menu.
     */
    public openItemMenu(listing: IInventoryListing, settings: IItemMenuSettings): void {
        const options: any[] = [
            {
                callback: (): void => {
                    if (!settings.onUse) {
                        throw new Error("No onUse defined for items.");
                    }

                    settings.onUse(listing);
                },
                text: "USE"
            }, {
                callback: (): void => {
                    if (!settings.onToss) {
                        throw new Error("No onToss defined for items.");
                    }

                    settings.onToss(listing);
                },
                text: "TOSS"
            }
        ];

        this.gameStarter.modAttacher.fireEvent("onOpenItemMenu", listing);

        this.gameStarter.menuGrapher.createMenu("Item", settings);
        this.gameStarter.menuGrapher.addMenuList("Item", { options });
        this.gameStarter.menuGrapher.setActiveMenu("Item");
    }
}
