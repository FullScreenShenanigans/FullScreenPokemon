import { EventNames } from "modattachr/lib/EventNames";

/**
 * Holds keys for mod events.
 */
export class FSPEventNames extends EventNames {
    /*
     * Key for event when a mod is enabled.
     */
    public readonly onModEnable: string = "onModEnable";

    /*
     * Key for event when a mod is disabled.
     */
    public readonly onModDisable: string = "onModDisable";

    /*
     * Key for event when a battle begins.
     */
    public readonly onBattleReady: string = "onBattleReady";

    /*
     * Key for event when a battle finishes.
     */
    public readonly onBattleComplete: string = "onBattleComplete";

    /*
     * Key for event when a Pokemon faints.
     */
    public readonly onFaint: string = "onFaint";

    /*
     * Key for event when a dialog ends.
     */
    public readonly onDialogFinish: string = "onDialogFinish";

    /*
     * Key for event when the item menu is opened.
     */
    public readonly onOpenItemsMenu: string = "onOpenItemsMenu";

    /*
     * Key for event when the location is changed.
     */
    public readonly onSetLocation: string = "onSetLocation";
}
