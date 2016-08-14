/// <reference path="../typings/GameStartr.d.ts" />

import { FullScreenPokemon } from "./FullScreenPokemon";
import { IPlayer } from "./IFullScreenPokemon";

/**
 * Gameplay functions used by IGameStartr instances.
 */
export class Gameplay<TEightBittr extends FullScreenPokemon> extends GameStartr.Gameplay<TEightBittr> {
    /**
     * Completely restarts the game. The StartOptions menu is shown.
     */
    public gameStart(): void {
        this.startOptions();
        this.EightBitter.ModAttacher.fireEvent("onGameStart");
    }

    /**
     * Sets the map to Blank and displays the StartOptions menu.
     */
    public startOptions(): void {
        const options: any[] = [
            {
                text: "NEW GAME",
                callback: (): void => this.startIntro()
            }, {
                text: "LOAD FILE",
                callback: (): void => this.loadFile()
            }];

        this.EightBitter.storage.checkForOldStorageData();

        if (this.EightBitter.ItemsHolder.getItem("gameStarted")) {
            options.unshift({
                text: "CONTINUE",
                callback: (): void => this.startPlay()
            });
        }

        this.EightBitter.maps.setMap("Blank");
        this.EightBitter.MenuGrapher.createMenu("StartOptions");
        this.EightBitter.MenuGrapher.addMenuList("StartOptions", {
            options: options
        });
        this.EightBitter.MenuGrapher.setActiveMenu("StartOptions");
    }

    /**
     * Starts the game in the saved map and location from ItemsHolder, and fires the
     * onGameStartPlay mod trigger.
     */
    public startPlay(): void {
        this.EightBitter.maps.setMap(
            this.EightBitter.ItemsHolder.getItem("map") || this.EightBitter.settings.maps.mapDefault,
            this.EightBitter.ItemsHolder.getItem("location"),
            true);
        this.EightBitter.maps.entranceResume();

        this.EightBitter.ModAttacher.fireEvent("onGameStartPlay");
    }

    /**
     * Starts the game's intro, and fires the onGameStartIntro mod trigger.
     */
    public startIntro(): void {
        this.EightBitter.storage.clearSavedData();
        this.EightBitter.ScenePlayer.startCutscene("Intro", {
            disablePauseMenu: true
        });

        this.EightBitter.ModAttacher.fireEvent("onGameStartIntro");
    }

    /**
     * Loads a file using a dummy HTMLInputElement, then starts the game with it as
     * game state. The onGameStartIntro mod event is triggered.
     */
    public loadFile(): void {
        const dummy: HTMLInputElement = this.EightBitter.utilities.createElement(
            "input",
            {
                type: "file",
                onchange: (event: LevelEditr.IDataMouseEvent): void => {
                    event.preventDefault();
                    event.stopPropagation();

                    const file: File = (dummy.files || event.dataTransfer.files)[0];
                    if (!file) {
                        return;
                    }

                    const reader: FileReader = new FileReader();
                    reader.onloadend = (loadEvent: LevelEditr.IDataProgressEvent): void => {
                        this.EightBitter.storage.loadData(loadEvent.currentTarget.result);
                        delete reader.onloadend;
                    };
                    reader.readAsText(file);
                }
            }) as HTMLInputElement;

        dummy.click();

        this.EightBitter.ModAttacher.fireEvent("onGameStartIntro");
    }

    /**
     * Checks whether inputs may trigger, which is always true, and prevents the event.
     * 
     * @param player   FSP's current user-controlled Player.
     * @param code   An key/mouse code from the event.
     * @param event   The original user-caused Event.
     * @returns Whether inputs may trigger (true).
     */
    public canInputsTrigger(player?: IPlayer, code?: any, event?: Event): boolean {
        if (event) {
            event.preventDefault();
        }

        return true;
    }

    /**
     * Starts the game (currently a no-op).
     */
    public onGamePlay(): void {
        console.log("Playing!");
    }

    /**
     * Pauses the game (currently a no-op).
     */
    public onGamePause(): void {
        console.log("Paused.");
    }

    /**
     * Closes the game (currently a no-op).
     */
    public onGameClose(): void {
        this.EightBitter.storage.autoSave();
        console.log("Closed.");
    }
}
