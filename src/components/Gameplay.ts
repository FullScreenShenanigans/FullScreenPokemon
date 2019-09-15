import { Gameplay as EightBittrGameplay } from "eightbittr";

import { FullScreenPokemon } from "../FullScreenPokemon";

interface IDataMouseEvent extends MouseEvent {
    dataTransfer: DataTransfer;
}

/**
 * Event hooks for major gameplay state changes.
 */
export class Gameplay<TEightBittr extends FullScreenPokemon> extends EightBittrGameplay<TEightBittr> {
    /**
     * Sets the map to Blank and displays the StartOptions menu.
     */
    public startOptions(): void {
        const options: any[] = [
            {
                text: "NEW GAME",
                callback: (): void => this.startIntro(),
            },
            {
                text: "LOAD FILE",
                callback: (): void => this.loadFile(),
            }];

        this.eightBitter.saves.checkForOldStorageData();

        if (this.eightBitter.itemsHolder.getItem(this.eightBitter.storage.names.gameStarted)) {
            options.unshift({
                text: "CONTINUE",
                callback: (): void => this.startPlay(),
            });
        }

        this.eightBitter.maps.setMap("Blank");
        this.eightBitter.menuGrapher.createMenu("StartOptions");
        this.eightBitter.menuGrapher.addMenuList("StartOptions", { options });
        this.eightBitter.menuGrapher.setActiveMenu("StartOptions");

        this.eightBitter.modAttacher.fireEvent(this.eightBitter.mods.eventNames.onGameStartOptions);
    }

    /**
     * Starts the game in the saved map and location from itemsHolder, and fires the
     * onGameStartPlay mod trigger.
     */
    public startPlay(): void {
        this.eightBitter.maps.setMap(
            this.eightBitter.itemsHolder.getItem(this.eightBitter.storage.names.map) || "Blank",
            this.eightBitter.itemsHolder.getItem(this.eightBitter.storage.names.location),
            true);
        this.eightBitter.maps.entranceAnimations.resume();

        this.eightBitter.modAttacher.fireEvent(this.eightBitter.mods.eventNames.onGameStartPlay);
    }

    /**
     * Starts the game's intro, and fires the onGameStartIntro mod trigger.
     */
    public startIntro(): void {
        this.eightBitter.saves.clearSavedData();
        this.eightBitter.scenePlayer.startCutscene("Intro", {
            disablePauseMenu: true,
        });

        this.eightBitter.modAttacher.fireEvent(this.eightBitter.mods.eventNames.onGameStartIntro);
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
                    reader.onloadend = (loadEvent): void => {
                        const currentTarget = loadEvent.currentTarget as FileReader | null;
                        if (!currentTarget || typeof currentTarget.result !== "string") {
                            return;
                        }

                        this.eightBitter.saves.loadRawData(currentTarget.result);
                        delete reader.onloadend;
                    };
                    reader.readAsText(file);
                },
            });

        dummy.click();

        this.eightBitter.modAttacher.fireEvent(this.eightBitter.mods.eventNames.onGameStartIntro);
    }

    /**
     * Checks whether inputs may trigger, which is always true, and prevents the event.
     *
     * @returns Whether inputs may trigger (true).
     */
    public canInputsTrigger(event?: Event): boolean {
        if (event !== undefined) {
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
        this.eightBitter.saves.autoSaveIfEnabled();
        console.log("Closed.");
    }
}
