import { GeneralComponent } from "eightbittr";
import { IMenuWordSchema } from "menugraphr";

import { FullScreenPokemon } from "../../FullScreenPokemon";

/**
 * PokeMart cutscene routines.
 */
export class PokeMartCutscene<TEightBittr extends FullScreenPokemon> extends GeneralComponent<TEightBittr> {
    /**
     * Cutscene for speaking to a PokeMart cashier.
     */
    public Greeting(): void {
        this.eightBitter.menuGrapher.createMenu("GeneralText", {
            finishAutomatically: true,
            ignoreA: true,
            ignoreB: true,
        });
        this.eightBitter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Hi there! \n May I help you?",
            ],
            this.eightBitter.scenePlayer.bindRoutine("Options"));
        this.eightBitter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene showing the PokeMart action options.
     */
    public Options(): void {
        this.eightBitter.menuGrapher.createMenu("Money");

        this.eightBitter.menuGrapher.createMenu("Buy/Sell", {
            killOnB: ["Money", "GeneralText"],
            onMenuDelete: this.eightBitter.scenePlayer.bindRoutine("Exit"),
        });
        this.eightBitter.menuGrapher.addMenuList("Buy/Sell", {
            options: [
                {
                    text: "BUY",
                    callback: this.eightBitter.scenePlayer.bindRoutine("BuyMenu"),
                },
                {
                    text: "SELL",
                    callback: undefined,
                },
                {
                    text: "QUIT",
                    callback: this.eightBitter.menuGrapher.registerB,
                },
            ],
        });
        this.eightBitter.menuGrapher.setActiveMenu("Buy/Sell");
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
                    text,
                    textsFloating: [{
                        text: "$" + cost,
                        x: 42 - String(cost).length * 3.5,
                        y: 4,
                    }],
                    callback: this.eightBitter.scenePlayer.bindRoutine(
                        "SelectAmount",
                        {
                            reference,
                            amount: 1,
                            cost,
                        }),
                    reference,
                };
            });

        options.push({
            text: "CANCEL",
            callback: this.eightBitter.menuGrapher.registerB,
        });

        this.eightBitter.menuGrapher.createMenu("GeneralText", {
            finishAutomatically: true,
        });
        this.eightBitter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Take your time.",
            ],
            (): void => {
                this.eightBitter.menuGrapher.createMenu("ShopItems", {
                    backMenu: "Buy/Sell",
                });
                this.eightBitter.menuGrapher.addMenuList("ShopItems", {
                    options,
                });
                this.eightBitter.menuGrapher.setActiveMenu("ShopItems");
            },
        );
        this.eightBitter.menuGrapher.setActiveMenu("GeneralText");
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
        const text: string = this.eightBitter.utilities.makeDigit(amount, 2)
            + this.eightBitter.utilities.makeDigit("$" + costTotal, 8, " ");

        this.eightBitter.menuGrapher.createMenu("ShopItemsAmount", {
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
                } as IMenuWordSchema],
            onUp: this.eightBitter.scenePlayer.bindRoutine(
                "SelectAmount",
                {
                    amount: (amount === 99) ? 1 : amount + 1,
                    cost,
                    reference,
                }),
            onDown: this.eightBitter.scenePlayer.bindRoutine(
                "SelectAmount",
                {
                    amount: (amount === 1) ? 99 : amount - 1,
                    cost,
                    reference,
                }),
            callback: this.eightBitter.scenePlayer.bindRoutine("ConfirmPurchase", args),
        });
        this.eightBitter.menuGrapher.setActiveMenu("ShopItemsAmount");
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

        this.eightBitter.menuGrapher.createMenu("GeneralText", {
            finishAutomatically: true,
        });
        this.eightBitter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                reference.item.toUpperCase() + "? \n That will be $" + costTotal + ". OK?",
            ],
            (): void => {
                this.eightBitter.menuGrapher.createMenu("Yes/No", {
                    position: {
                        horizontal: "right",
                        vertical: "bottom",
                        offset: {
                            top: 0,
                            left: 0,
                        },
                    },
                    onMenuDelete: this.eightBitter.scenePlayer.bindRoutine(
                        "CancelPurchase",
                    ),
                    container: "ShopItemsAmount",
                });
                this.eightBitter.menuGrapher.addMenuList("Yes/No", {
                    options: [
                        {
                            text: "YES",
                            callback: this.eightBitter.scenePlayer.bindRoutine(
                                "TryPurchase", args),
                        },
                        {
                            text: "NO",
                            callback: this.eightBitter.scenePlayer.bindRoutine(
                                "CancelPurchase"),
                        },
                    ],
                });
                this.eightBitter.menuGrapher.setActiveMenu("Yes/No");
            });
        this.eightBitter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for canceling a PokeMart purchase.
     *
     * @param settings   Settings used for the cutscene.
     */
    public CancelPurchase(): void {
        this.eightBitter.scenePlayer.playRoutine("BuyMenu");
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

        if (this.eightBitter.itemsHolder.getItem(this.eightBitter.storage.names.money) < costTotal) {
            this.eightBitter.scenePlayer.playRoutine("FailPurchase", args);
            return;
        }

        this.eightBitter.itemsHolder.decrease(this.eightBitter.storage.names.money, args.costTotal);
        this.eightBitter.menuGrapher.createMenu("Money");
        this.eightBitter.itemsHolder.getItem(this.eightBitter.storage.names.items).push({
            item: args.reference.item,
            amount: args.amount,
        });

        this.eightBitter.menuGrapher.createMenu("GeneralText");
        this.eightBitter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Here you are! \n Thank you!",
            ],
            this.eightBitter.scenePlayer.bindRoutine("ContinueShopping"));

        this.eightBitter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for when the player does not have enough money for the
     * PokeMart purchase.
     */
    public FailPurchase(): void {
        this.eightBitter.menuGrapher.createMenu("GeneralText");
        this.eightBitter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "You don't have enough money.",
            ],
            this.eightBitter.scenePlayer.bindRoutine("ContinueShopping"),
        );
        this.eightBitter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for asking if the player wants to continue shopping.
     */
    public ContinueShopping(): void {
        if (this.eightBitter.menuGrapher.getMenu("Yes/No")) {
            delete this.eightBitter.menuGrapher.getMenu("Yes/No").onMenuDelete;
        }

        this.eightBitter.menuGrapher.deleteMenu("ShopItems");
        this.eightBitter.menuGrapher.deleteMenu("ShopItemsAmount");
        this.eightBitter.menuGrapher.deleteMenu("Yes/No");

        this.eightBitter.menuGrapher.createMenu("GeneralText");
        this.eightBitter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Is there anything else I can do?",
            ]);

        this.eightBitter.menuGrapher.setActiveMenu("Buy/Sell");

        this.eightBitter.saves.autoSaveIfEnabled();
    }

    /**
     * Cutscene for the player choosing to stop shopping.
     */
    public Exit(): void {
        this.eightBitter.scenePlayer.stopCutscene();

        this.eightBitter.menuGrapher.deleteMenu("Buy/Sell");
        this.eightBitter.menuGrapher.deleteMenu("Money");

        this.eightBitter.menuGrapher.createMenu("GeneralText");
        this.eightBitter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Thank you!",
            ],
            this.eightBitter.menuGrapher.deleteActiveMenu,
        );
        this.eightBitter.menuGrapher.setActiveMenu("GeneralText");
    }
}
