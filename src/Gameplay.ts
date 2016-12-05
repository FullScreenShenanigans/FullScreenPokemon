import { Gameplay as GameStartrGameplay } from "gamestartr/lib/Gameplay";

import { FullScreenPokemon } from "./FullScreenPokemon";

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
 * Gameplay functions used by IGameStartr instances.
 */
export class Gameplay<TEightBittr extends FullScreenPokemon> extends GameStartrGameplay<TEightBittr> {
    /**
     * Completely restarts the game. The StartOptions menu is shown.
     */
    public gameStart(): void {
        this.startOptions();
        this.eightBitter.modAttacher.fireEvent("onGameStart");
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

        this.eightBitter.storage.checkForOldStorageData();

        if (this.eightBitter.itemsHolder.getItem("gameStarted")) {
            options.unshift({
                text: "CONTINUE",
                callback: (): void => this.startPlay()
            });
        }

        this.eightBitter.maps.setMap("Blank");
        this.eightBitter.MenuGrapher.createMenu("StartOptions");
        this.eightBitter.MenuGrapher.addMenuList("StartOptions", {
            options: options
        });
        this.eightBitter.MenuGrapher.setActiveMenu("StartOptions");
    }

    /**
     * Starts the game in the saved map and location from itemsHolder, and fires the
     * onGameStartPlay mod trigger.
     */
    public startPlay(): void {
        this.eightBitter.maps.setMap(
            this.eightBitter.itemsHolder.getItem("map") || this.eightBitter.moduleSettings.maps.mapDefault,
            this.eightBitter.itemsHolder.getItem("location"),
            true);
        this.eightBitter.maps.entranceResume();

        this.eightBitter.modAttacher.fireEvent("onGameStartPlay");
    }

    /**
     * Starts the game's intro, and fires the onGameStartIntro mod trigger.
     */
    public startIntro(): void {
        this.eightBitter.storage.clearSavedData();
        this.eightBitter.scenePlayer.startCutscene("Intro", {
            disablePauseMenu: true
        });

        this.eightBitter.modAttacher.fireEvent("onGameStartIntro");
    }

    /**
     * Loads a file using a dummy HTMLInputElement, then starts the game with it as
     * game state. The onGameStartIntro mod event is triggered.
     */
    public loadFile(): void {
        const dummy: HTMLInputElement = this.eightBitter.utilities.createElement(
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
                        this.eightBitter.storage.loadData(loadEvent.currentTarget.result);
                        delete reader.onloadend;
                    };
                    reader.readAsText(file);
                }
            }) as HTMLInputElement;

        dummy.click();

        this.eightBitter.modAttacher.fireEvent("onGameStartIntro");
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
     * Closes the game (currently a no-op).
     */
    public onGameClose(): void {
        this.eightBitter.storage.autoSave();
        console.log("Closed.");
    }
}
