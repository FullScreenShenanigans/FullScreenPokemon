import { Component } from "eightbittr/lib/Component";
import { IMenuWordSchema } from "menugraphr/lib/IMenuGraphr";

import { FullScreenPokemon } from "../../FullScreenPokemon";

/**
 * PokeMart cutscene functions used by FullScreenPokemon instances.
 */
export class PokeMartCutscene<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
    /**
     * Cutscene for speaking to a PokeMart cashier.
     */
    public Greeting(): void {
        this.gameStarter.menuGrapher.createMenu("GeneralText", {
            finishAutomatically: true,
            ignoreA: true,
            ignoreB: true
        });
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Hi there! \n May I help you?"
            ],
            this.gameStarter.scenePlayer.bindRoutine("Options"));
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene showing the PokeMart action options.
     */
    public Options(): void {
        this.gameStarter.menuGrapher.createMenu("Money");

        this.gameStarter.menuGrapher.createMenu("Buy/Sell", {
            killOnB: ["Money", "GeneralText"],
            onMenuDelete: this.gameStarter.scenePlayer.bindRoutine("Exit")
        });
        this.gameStarter.menuGrapher.addMenuList("Buy/Sell", {
            options: [{
                text: "BUY",
                callback: this.gameStarter.scenePlayer.bindRoutine("BuyMenu")
            }, {
                    text: "SELL",
                    callback: undefined
                }, {
                    text: "QUIT",
                    callback: this.gameStarter.menuGrapher.registerB
                }]
        });
        this.gameStarter.menuGrapher.setActiveMenu("Buy/Sell");
    }

    /**
     * Cutscene for the PokeMart item menu.
     *
     * @param settings   Settings used for the cutscene.
     * 
     * @todo Add constants for all items, for display names
     */
    public BuyMenu(settings: any): void {
        const options: any[] = settings.triggerer.items.map(
            (reference: any): any => {
                const text: string = reference.item.toUpperCase();
                const cost: number = reference.cost;

                return {
                    text: text,
                    textsFloating: [{
                        text: "$" + cost,
                        x: 42 - String(cost).length * 3.5,
                        y: 4
                    }],
                    callback: this.gameStarter.scenePlayer.bindRoutine(
                        "SelectAmount",
                        {
                            reference: reference,
                            amount: 1,
                            cost: cost
                        }),
                    reference: reference
                };
            });

        options.push({
            text: "CANCEL",
            callback: this.gameStarter.menuGrapher.registerB
        });

        this.gameStarter.menuGrapher.createMenu("GeneralText", {
            finishAutomatically: true
        });
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Take your time."
            ],
            (): void => {
                this.gameStarter.menuGrapher.createMenu("ShopItems", {
                    backMenu: "Buy/Sell"
                });
                this.gameStarter.menuGrapher.addMenuList("ShopItems", {
                    options: options
                });
                this.gameStarter.menuGrapher.setActiveMenu("ShopItems");
            }
        );
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
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
        const text: string = this.gameStarter.utilities.makeDigit(amount, 2)
            + this.gameStarter.utilities.makeDigit("$" + costTotal, 8, " ");

        this.gameStarter.menuGrapher.createMenu("ShopItemsAmount", {
            childrenSchemas: [
                {
                    type: "text",
                    words: ["Times"],
                    position: {
                        offset: {
                            left: 4,
                            top: 4.25
                        }
                    }
                } as IMenuWordSchema,
                {
                    type: "text",
                    words: [text],
                    position: {
                        offset: {
                            left: 8,
                            top: 3.75
                        }
                    }
                } as IMenuWordSchema],
            onUp: this.gameStarter.scenePlayer.bindRoutine(
                "SelectAmount",
                {
                    amount: (amount === 99) ? 1 : amount + 1,
                    cost: cost,
                    reference: reference
                }),
            onDown: this.gameStarter.scenePlayer.bindRoutine(
                "SelectAmount",
                {
                    amount: (amount === 1) ? 99 : amount - 1,
                    cost: cost,
                    reference: reference
                }),
            callback: this.gameStarter.scenePlayer.bindRoutine("ConfirmPurchase", args)
        });
        this.gameStarter.menuGrapher.setActiveMenu("ShopItemsAmount");
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
        const costTotal: number = args.costTotal = cost * amount;

        this.gameStarter.menuGrapher.createMenu("GeneralText", {
            finishAutomatically: true
        });
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                reference.item.toUpperCase() + "? \n That will be $" + costTotal + ". OK?"
            ],
            (): void => {
                this.gameStarter.menuGrapher.createMenu("Yes/No", {
                    position: {
                        horizontal: "right",
                        vertical: "bottom",
                        offset: {
                            top: 0,
                            left: 0
                        }
                    },
                    onMenuDelete: this.gameStarter.scenePlayer.bindRoutine(
                        "CancelPurchase"
                    ),
                    container: "ShopItemsAmount"
                });
                this.gameStarter.menuGrapher.addMenuList("Yes/No", {
                    options: [
                        {
                            text: "YES",
                            callback: this.gameStarter.scenePlayer.bindRoutine(
                                "TryPurchase", args)
                        }, {
                            text: "NO",
                            callback: this.gameStarter.scenePlayer.bindRoutine(
                                "CancelPurchase")
                        }]
                });
                this.gameStarter.menuGrapher.setActiveMenu("Yes/No");
            });
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for canceling a PokeMart purchase.
     *
     * @param settings   Settings used for the cutscene.
     */
    public CancelPurchase(): void {
        this.gameStarter.scenePlayer.playRoutine("BuyMenu");
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

        if (this.gameStarter.itemsHolder.getItem("money") < costTotal) {
            this.gameStarter.scenePlayer.playRoutine("FailPurchase", args);
            return;
        }

        this.gameStarter.itemsHolder.decrease("money", args.costTotal);
        this.gameStarter.menuGrapher.createMenu("Money");
        this.gameStarter.itemsHolder.getItem("items").push({
            item: args.reference.item,
            amount: args.amount
        });

        this.gameStarter.menuGrapher.createMenu("GeneralText");
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Here you are! \n Thank you!"
            ],
            this.gameStarter.scenePlayer.bindRoutine("ContinueShopping"));

        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for when the player does not have enough money for the 
     * PokeMart purchase.
     */
    public FailPurchase(): void {
        this.gameStarter.menuGrapher.createMenu("GeneralText");
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "You don't have enough money."
            ],
            this.gameStarter.scenePlayer.bindRoutine("ContinueShopping")
        );
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for asking if the player wants to continue shopping.
     */
    public ContinueShopping(): void {
        if (this.gameStarter.menuGrapher.getMenu("Yes/No")) {
            delete this.gameStarter.menuGrapher.getMenu("Yes/No").onMenuDelete;
        }

        this.gameStarter.menuGrapher.deleteMenu("ShopItems");
        this.gameStarter.menuGrapher.deleteMenu("ShopItemsAmount");
        this.gameStarter.menuGrapher.deleteMenu("Yes/No");

        this.gameStarter.menuGrapher.createMenu("GeneralText");
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Is there anything else I can do?"
            ]);

        this.gameStarter.menuGrapher.setActiveMenu("Buy/Sell");

        this.gameStarter.saves.autoSave();
    }

    /**
     * Cutscene for the player choosing to stop shopping.
     */
    public Exit(): void {
        this.gameStarter.scenePlayer.stopCutscene();

        this.gameStarter.menuGrapher.deleteMenu("Buy/Sell");
        this.gameStarter.menuGrapher.deleteMenu("Money");

        this.gameStarter.menuGrapher.createMenu("GeneralText");
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Thank you!"
            ],
            this.gameStarter.menuGrapher.deleteActiveMenu
        );
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }
}
