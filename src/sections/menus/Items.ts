import { Section } from "eightbittr";

import { Pokemon } from "../../sections/Battles";
import { FullScreenPokemon } from "../../FullScreenPokemon";
import { MenuSchema } from "../Menus";

/**
 * A single item's listing in an inventory.
 *
 * @todo When items get their own component(s), move this there.
 */
export interface InventoryListing {
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
export type OnListingSelect = (listing: InventoryListing) => void;

/**
 * Settings to open an individual item's menu.
 */
export interface ItemMenuSettings extends MenuSchema {
    /**
     * Callback for when an item should be tossed.
     */
    onToss?: OnListingSelect;

    /**
     * Callback for when an item should be used.
     */
    onUse?: OnListingSelect;
}

/**
 * Settings to open the items menu.
 */
export interface ItemsMenuSettings extends ItemMenuSettings {
    /**
     * Whether selecting an item should go directly to choosing a target.
     */
    disableTossing?: boolean;

    /**
     * Items to display, if not the player's inventory.
     */
    items?: InventoryListing[];
}

/**
 * Manipulates item menus.
 */
export class Items extends Section<FullScreenPokemon> {
    /**
     * Opens the Items menu for the items in the player's inventory.
     *
     * @param settings   Custom attributes to apply to the menu.
     */
    public open(settings: ItemsMenuSettings): void {
        const listings: InventoryListing[] =
            settings.items || this.game.itemsHolder.getItem(this.game.storage.names.items);
        const options: any[] = listings.map((listing: InventoryListing): any => ({
            text: listing.item,
            callback: (): void => this.openItem(listing, settings),
            textsFloating: [
                {
                    text: [["Times"]],
                    x: 128,
                    y: 18,
                },
                {
                    text: this.game.utilities.makeDigit(listing.amount, 2, " "),
                    x: 146,
                    y: 16,
                },
            ],
        }));

        options.push({
            text: "CANCEL",
            callback: () => this.game.menuGrapher.registerB(),
        });

        this.game.modAttacher.fireEvent(this.game.mods.eventNames.onOpenItemsMenu, listings);

        this.game.menuGrapher.createMenu("Items", settings);
        this.game.menuGrapher.addMenuList("Items", { options });
        this.game.menuGrapher.setActiveMenu("Items");
    }

    /**
     * Opens the Item menu for an item the player selected from the inventory.
     *
     * @param listing   Item listing being displayed.
     * @param settings   Custom attributes to apply to the menu.
     */
    public openItem(listing: InventoryListing, settings: ItemMenuSettings): void {
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

        if (this.game.flagSwapper.flags.heldItems) {
            options.push({
                callback: (): void => {
                    const partyPokemon: Pokemon[] = this.game.itemsHolder.getItem(
                        this.game.storage.names.pokemonInParty
                    );
                    const chosenPokemon = partyPokemon[0];
                    chosenPokemon.item = listing.item.split("");
                    listing.amount = listing.amount - 1;
                    console.log("Someactor visual should happen when an item is given...");
                },
                text: "GIVE",
            });
        }

        this.game.modAttacher.fireEvent(this.game.mods.eventNames.onOpenItemMenu, listing);

        this.game.menuGrapher.createMenu("Item", settings);
        this.game.menuGrapher.addMenuList("Item", { options });
        this.game.menuGrapher.setActiveMenu("Item");
    }
}
