import { Gameplay as GameStartrGameplay } from "gamestartr/lib/components/Gameplay";

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
export class Gameplay extends GameStartrGameplay {
    /**
     * Completely restarts the game. The StartOptions menu is shown.
     */
    public gameStart(): void {
        this.startOptions();
        this.modAttacher.fireEvent("onGameStart");
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

        this.storage.checkForOldStorageData();

        if (this.itemsHolder.getItem("gameStarted")) {
            options.unshift({
                text: "CONTINUE",
                callback: (): void => this.startPlay()
            });
        }

        this.maps.setMap("Blank");
        this.menuGrapher.createMenu("StartOptions");
        this.menuGrapher.addMenuList("StartOptions", {
            options: options
        });
        this.menuGrapher.setActiveMenu("StartOptions");
    }

    /**
     * Starts the game in the saved map and location from itemsHolder, and fires the
     * onGameStartPlay mod trigger.
     */
    public startPlay(): void {
        this.maps.setMap(
            this.itemsHolder.getItem("map") || this.moduleSettings.maps.mapDefault,
            this.itemsHolder.getItem("location"),
            true);
        this.maps.entranceResume();

        this.modAttacher.fireEvent("onGameStartPlay");
    }

    /**
     * Starts the game's intro, and fires the onGameStartIntro mod trigger.
     */
    public startIntro(): void {
        this.storage.clearSavedData();
        this.scenePlayer.startCutscene("Intro", {
            disablePauseMenu: true
        });

        this.modAttacher.fireEvent("onGameStartIntro");
    }

    /**
     * Loads a file using a dummy HTMLInputElement, then starts the game with it as
     * game state. The onGameStartIntro mod event is triggered.
     */
    public loadFile(): void {
        const dummy: HTMLInputElement = this.utilities.createElement(
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
                        this.storage.loadData(loadEvent.currentTarget.result);
                        delete reader.onloadend;
                    };
                    reader.readAsText(file);
                }
            }) as HTMLInputElement;

        dummy.click();

        this.modAttacher.fireEvent("onGameStartIntro");
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
        this.storage.autoSave();
        console.log("Closed.");
    }
}
