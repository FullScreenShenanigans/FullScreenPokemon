import { Section } from "eightbittr";

import { FullScreenPokemon } from "../FullScreenPokemon";

interface DataMouseEvent extends MouseEvent {
    dataTransfer: DataTransfer;
}

/**
 * Event hooks for major gameplay state changes.
 */
export class Gameplay extends Section<FullScreenPokemon> {
    /**
     * Sets the map to Blank and displays the StartOptions menu.
     */
    public startOptions(): void {
        const options = [
            {
                text: "NEW GAME",
                callback: (): void => this.startIntro(),
            },
            {
                text: "LOAD FILE",
                callback: (): void => this.loadFile(),
            },
        ];

        this.game.saves.checkForOldStorageData();

        if (this.game.itemsHolder.getItem(this.game.storage.names.gameStarted)) {
            options.unshift({
                text: "CONTINUE",
                callback: (): void => this.startPlay(),
            });
        }

        this.game.maps.setMap("Blank");
        this.game.menuGrapher.createMenu("StartOptions");
        this.game.menuGrapher.addMenuList("StartOptions", { options });
        this.game.menuGrapher.setActiveMenu("StartOptions");

        this.game.modAttacher.fireEvent(this.game.mods.eventNames.onGameStartOptions);
    }

    /**
     * Starts the game in the saved map and location from itemsHolder, and fires the
     * onGameStartPlay mod trigger.
     */
    public startPlay(): void {
        this.game.maps.setMap(
            this.game.itemsHolder.getItem(this.game.storage.names.map) || "Blank",
            this.game.itemsHolder.getItem(this.game.storage.names.location),
            true
        );
        this.game.maps.entranceAnimations.resume();

        this.game.modAttacher.fireEvent(this.game.mods.eventNames.onGameStartPlay);
    }

    /**
     * Starts the game's intro, and fires the onGameStartIntro mod trigger.
     */
    public startIntro(): void {
        this.game.saves.clearSavedData();
        this.game.scenePlayer.startCutscene("Intro", {
            disablePauseMenu: true,
        });

        this.game.modAttacher.fireEvent(this.game.mods.eventNames.onGameStartIntro);
    }

    /**
     * Loads a file using a dummy HTMLInputElement, then starts the game with it as
     * game state. The onGameStartIntro mod event is triggered.
     */
    public loadFile(): void {
        const dummy: HTMLInputElement = this.game.utilities.createElement("input", {
            type: "file",
            onchange: (event: DataMouseEvent): void => {
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

                    this.game.saves.loadRawData(currentTarget.result);
                    delete (reader as any).onloadend;
                };
                reader.readAsText(file);
            },
        });

        dummy.click();

        this.game.modAttacher.fireEvent(this.game.mods.eventNames.onGameStartIntro);
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
        this.game.saves.autoSaveIfEnabled();
        console.log("Closed.");
    }
}
