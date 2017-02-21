import { Gameplay as GameStartrGameplay } from "gamestartr/lib/components/Gameplay";

import { FullScreenPokemon } from "../FullScreenPokemon";

interface IDataMouseEvent extends MouseEvent {
    dataTransfer: DataTransfer;
}

interface IDataProgressEvent extends ProgressEvent {
    currentTarget: IDataEventTarget;
}

interface IDataEventTarget extends EventTarget {
    result: string;
}

/**
 * Gameplay functions used by FullScreenPokemon instances.
 */
export class Gameplay<TGameStartr extends FullScreenPokemon> extends GameStartrGameplay<TGameStartr> {
    /**
     * Completely restarts the game. The StartOptions menu is shown.
     */
    public gameStart(): void {
        this.startOptions();
        this.gameStarter.modAttacher.fireEvent("onGameStart");
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

        this.gameStarter.saves.checkForOldStorageData();

        if (this.gameStarter.itemsHolder.getItem("gameStarted")) {
            options.unshift({
                text: "CONTINUE",
                callback: (): void => this.startPlay()
            });
        }

        this.gameStarter.maps.setMap("Blank");
        this.gameStarter.menuGrapher.createMenu("StartOptions");
        this.gameStarter.menuGrapher.addMenuList("StartOptions", { options });
        this.gameStarter.menuGrapher.setActiveMenu("StartOptions");
    }

    /**
     * Starts the game in the saved map and location from itemsHolder, and fires the
     * onGameStartPlay mod trigger.
     */
    public startPlay(): void {
        this.gameStarter.maps.setMap(
            this.gameStarter.itemsHolder.getItem("map") || this.gameStarter.moduleSettings.maps.mapDefault,
            this.gameStarter.itemsHolder.getItem("location"),
            true);
        this.gameStarter.maps.entranceResume();

        this.gameStarter.modAttacher.fireEvent("onGameStartPlay");
    }

    /**
     * Starts the game's intro, and fires the onGameStartIntro mod trigger.
     */
    public startIntro(): void {
        this.gameStarter.saves.clearSavedData();
        this.gameStarter.scenePlayer.startCutscene("Intro", {
            disablePauseMenu: true
        });

        this.gameStarter.modAttacher.fireEvent("onGameStartIntro");
    }

    /**
     * Loads a file using a dummy HTMLInputElement, then starts the game with it as
     * game state. The onGameStartIntro mod event is triggered.
     */
    public loadFile(): void {
        const dummy: HTMLInputElement = this.gameStarter.utilities.createElement(
            "input",
            {
                type: "file",
                onchange: (event: IDataMouseEvent): void => {
                    event.preventDefault();
                    event.stopPropagation();

                    const file: File = (dummy.files || event.dataTransfer.files)[0];
                    if (!file) {
                        return;
                    }

                    const reader: FileReader = new FileReader();
                    reader.onloadend = (loadEvent: IDataProgressEvent): void => {
                        this.gameStarter.saves.loadData(loadEvent.currentTarget.result);
                        delete reader.onloadend;
                    };
                    reader.readAsText(file);
                }
            }) as HTMLInputElement;

        dummy.click();

        this.gameStarter.modAttacher.fireEvent("onGameStartIntro");
    }

    /**
     * Checks whether inputs may trigger, which is always true, and prevents the event.
     * 
     * @returns Whether inputs may trigger (true).
     */
    public canInputsTrigger(): boolean {
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
     * Closes the game.
     */
    public onGameClose(): void {
        this.gameStarter.saves.autoSave();
        console.log("Closed.");
    }
}
