import { Section } from "eightbittr";
import { IMenuWordSchema } from "menugraphr";

import { FullScreenPokemon } from "../../FullScreenPokemon";

/**
 * PokeMart cutscene routines.
 */
export class PokeMartCutscene extends Section<FullScreenPokemon> {
    /**
     * Cutscene for speaking to a PokeMart cashier.
     */
    public Greeting(): void {
        this.game.menuGrapher.createMenu("GeneralText", {
            finishAutomatically: true,
            ignoreA: true,
            ignoreB: true,
        });
        this.game.menuGrapher.addMenuDialog(
            "GeneralText",
            ["Hi there! \n May I help you?"],
            this.game.scenePlayer.bindRoutine("Options")
        );
        this.game.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene showing the PokeMart action options.
     */
    public Options(): void {
        this.game.menuGrapher.createMenu("Money");

        this.game.menuGrapher.createMenu("Buy/Sell", {
            killOnB: ["Money", "GeneralText"],
            onMenuDelete: this.game.scenePlayer.bindRoutine("Exit"),
        });
        this.game.menuGrapher.addMenuList("Buy/Sell", {
            options: [
                {
                    text: "BUY",
                    callback: this.game.scenePlayer.bindRoutine("BuyMenu"),
                },
                {
                    text: "SELL",
                    callback: undefined,
                },
                {
                    text: "QUIT",
                    callback: this.game.menuGrapher.registerB,
                },
            ],
        });
        this.game.menuGrapher.setActiveMenu("Buy/Sell");
    }

    /**
     * Cutscene for the PokeMart item menu.
     *
     * @param settings   Settings used for the cutscene.
     *
     * @todo Add constants for all items, for display names
     */
    public BuyMenu(settings: any): void {
        const options: any[] = settings.triggerer.items.map((reference: any): any => {
            const text: string = reference.item.toUpperCase();
            const cost: number = reference.cost;

            return {
                text,
                textsFloating: [
                    {
                        text: "$" + cost,
                        x: 42 - String(cost).length * 3.5,
                        y: 4,
                    },
                ],
                callback: this.game.scenePlayer.bindRoutine("SelectAmount", {
                    reference,
                    amount: 1,
                    cost,
                }),
                reference,
            };
        });

        options.push({
            text: "CANCEL",
            callback: this.game.menuGrapher.registerB,
        });

        this.game.menuGrapher.createMenu("GeneralText", {
            finishAutomatically: true,
        });
        this.game.menuGrapher.addMenuDialog("GeneralText", ["Take your time."], (): void => {
            this.game.menuGrapher.createMenu("ShopItems", {
                backMenu: "Buy/Sell",
            });
            this.game.menuGrapher.addMenuList("ShopItems", {
                options,
            });
            this.game.menuGrapher.setActiveMenu("ShopItems");
        });
        this.game.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for selecting the amount of an item the player wishes to buy.
     *
     * @param _settings   Settings used for the cutscene.
     * @param args   Settings for the routine.
     */
    public SelectAmount(_settings: any, args: any): void {
        const reference: any = args.reference;
        const amount: number = args.amount;
        const cost: number = args.cost;
        const costTotal: number = cost * amount;
        const text: string =
            this.game.utilities.makeDigit(amount, 2) +
            this.game.utilities.makeDigit("$" + costTotal, 8, " ");

        this.game.menuGrapher.createMenu("ShopItemsAmount", {
            childrenSchemas: [
                {
                    type: "text",
                    words: ["Times"],
                    position: {
                        offset: {
                            left: 4,
                            top: 4.25,
                        },
                    },
                } as IMenuWordSchema,
                {
                    type: "text",
                    words: [text],
                    position: {
                        offset: {
                            left: 8,
                            top: 3.75,
                        },
                    },
                } as IMenuWordSchema,
            ],
            onUp: this.game.scenePlayer.bindRoutine("SelectAmount", {
                amount: amount === 99 ? 1 : amount + 1,
                cost,
                reference,
            }),
            onDown: this.game.scenePlayer.bindRoutine("SelectAmount", {
                amount: amount === 1 ? 99 : amount - 1,
                cost,
                reference,
            }),
            callback: this.game.scenePlayer.bindRoutine("ConfirmPurchase", args),
        });
        this.game.menuGrapher.setActiveMenu("ShopItemsAmount");
    }

    /**
     * Cutscene for confirming a PokeMart purchase.
     *
     * @param _settings   Settings used for the cutscene.
     * @param args   Settings for the routine.
     */
    public ConfirmPurchase(_settings: any, args: any): void {
        const reference: any = args.reference;
        const cost: number = args.cost;
        const amount: number = args.amount;
        const costTotal: number = (args.costTotal = cost * amount);

        this.game.menuGrapher.createMenu("GeneralText", {
            finishAutomatically: true,
        });
        this.game.menuGrapher.addMenuDialog(
            "GeneralText",
            [reference.item.toUpperCase() + "? \n That will be $" + costTotal + ". OK?"],
            (): void => {
                this.game.menuGrapher.createMenu("Yes/No", {
                    position: {
                        horizontal: "right",
                        vertical: "bottom",
                        offset: {
                            top: 0,
                            left: 0,
                        },
                    },
                    onMenuDelete: this.game.scenePlayer.bindRoutine("CancelPurchase"),
                    container: "ShopItemsAmount",
                });
                this.game.menuGrapher.addMenuList("Yes/No", {
                    options: [
                        {
                            text: "YES",
                            callback: this.game.scenePlayer.bindRoutine("TryPurchase", args),
                        },
                        {
                            text: "NO",
                            callback: this.game.scenePlayer.bindRoutine("CancelPurchase"),
                        },
                    ],
                });
                this.game.menuGrapher.setActiveMenu("Yes/No");
            }
        );
        this.game.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for canceling a PokeMart purchase.
     *
     * @param settings   Settings used for the cutscene.
     */
    public CancelPurchase(): void {
        this.game.scenePlayer.playRoutine("BuyMenu");
    }

    /**
     * Cutscene for carrying out a PokeMart transaction. Can either confirm or deny
     * the purchase based on the player's total money.
     *
     * @param _settings   Settings used for the cutscene.
     * @param args  Settings for the routine.
     */
    public TryPurchase(_settings: any, args: any): void {
        const costTotal: number = args.costTotal;

        if (this.game.itemsHolder.getItem(this.game.storage.names.money) < costTotal) {
            this.game.scenePlayer.playRoutine("FailPurchase", args);
            return;
        }

        this.game.itemsHolder.decrease(this.game.storage.names.money, args.costTotal);
        this.game.menuGrapher.createMenu("Money");
        this.game.itemsHolder.getItem(this.game.storage.names.items).push({
            item: args.reference.item,
            amount: args.amount,
        });

        this.game.menuGrapher.createMenu("GeneralText");
        this.game.menuGrapher.addMenuDialog(
            "GeneralText",
            ["Here you are! \n Thank you!"],
            this.game.scenePlayer.bindRoutine("ContinueShopping")
        );

        this.game.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for when the player does not have enough money for the
     * PokeMart purchase.
     */
    public FailPurchase(): void {
        this.game.menuGrapher.createMenu("GeneralText");
        this.game.menuGrapher.addMenuDialog(
            "GeneralText",
            ["You don't have enough money."],
            this.game.scenePlayer.bindRoutine("ContinueShopping")
        );
        this.game.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for asking if the player wants to continue shopping.
     */
    public ContinueShopping(): void {
        if (this.game.menuGrapher.getMenu("Yes/No")) {
            delete this.game.menuGrapher.getMenu("Yes/No").onMenuDelete;
        }

        this.game.menuGrapher.deleteMenu("ShopItems");
        this.game.menuGrapher.deleteMenu("ShopItemsAmount");
        this.game.menuGrapher.deleteMenu("Yes/No");

        this.game.menuGrapher.createMenu("GeneralText");
        this.game.menuGrapher.addMenuDialog("GeneralText", ["Is there anything else I can do?"]);

        this.game.menuGrapher.setActiveMenu("Buy/Sell");

        this.game.saves.autoSaveIfEnabled();
    }

    /**
     * Cutscene for the player choosing to stop shopping.
     */
    public Exit(): void {
        this.game.scenePlayer.stopCutscene();

        this.game.menuGrapher.deleteMenu("Buy/Sell");
        this.game.menuGrapher.deleteMenu("Money");

        this.game.menuGrapher.createMenu("GeneralText");
        this.game.menuGrapher.addMenuDialog(
            "GeneralText",
            ["Thank you!"],
            this.game.menuGrapher.deleteActiveMenu
        );
        this.game.menuGrapher.setActiveMenu("GeneralText");
    }
}
