import { GeneralComponent } from "gamestartr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { IPokemon } from "../Battles";
import { IMap } from "../Maps";
import { ICharacter, IThing } from "../Things";

/**
 * PokeCenter cutscene routines.
 */
export class PokeCenterCutscene<TGameStartr extends FullScreenPokemon> extends GeneralComponent<TGameStartr> {
    /**
     * Rate at which balls appear.
     */
    public readonly ballAppearanceRate = 35;

    /**
     * Rate at which balls flicker.
     */
    public readonly ballFlickerRate = 21;

    /**
     * Cutscene for a nurse's welcome at the Pokemon Center.
     *
     */
    public readonly Welcome = (): void => {
        const nurse = this.gameStarter.utilities.getExistingThingById<ICharacter>("Nurse");
        const machine = this.gameStarter.utilities.getExistingThingById("HealingMachine");

        this.gameStarter.menuGrapher.createMenu("GeneralText");
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Welcome to our %%%%%%%POKEMON%%%%%%% CENTER!",
                "We heal your %%%%%%%POKEMON%%%%%%% back to perfect health!",
                "Shall we heal your %%%%%%%POKEMON%%%%%%%?",
            ],
            (): void => this.choose(machine, nurse),
        );
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for choosing whether or not to heal Pokemon.
     */
    private choose(machine: IThing, nurse: ICharacter): void {
        this.gameStarter.menuGrapher.createMenu("Heal/Cancel", {
            killOnB: ["GeneralText"],
        });
        this.gameStarter.menuGrapher.addMenuList(
            "Heal/Cancel",
            {
                options: [
                    {
                        callback: (): void => this.chooseHeal(machine, nurse),
                        text: "HEAL",
                    },
                    {
                        callback: this.chooseCancel,
                        text: "CANCEL",
                    },
                ],
            },
        );
        this.gameStarter.menuGrapher.setActiveMenu("Heal/Cancel");
    }

    /**
     * Cutscene for choosing to heal Pokemon.
     */
    private chooseHeal(machine: IThing, nurse: ICharacter): void {
        this.gameStarter.menuGrapher.deleteMenu("Heal/Cancel");

        this.gameStarter.menuGrapher.createMenu("GeneralText", {
            ignoreA: true,
            finishAutomatically: true,
        });
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Ok. We'll need your %%%%%%%POKEMON%%%%%%%.",
            ],
            (): void => this.healing(machine, nurse),
        );
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for placing Pokeballs into the healing machine.
     *
     */
    private healing(machine: IThing, nurse: ICharacter): void {
        const party: IPokemon[] = this.gameStarter.itemsHolder.getItem(this.gameStarter.storage.names.pokemonInParty);
        const balls: IThing[] = [];
        const dt = 35;
        const left: number = machine.left + 20;
        const top: number = machine.top + 28;
        let i = 0;

        this.gameStarter.actions.animateCharacterSetDirection(nurse, 3);

        this.gameStarter.timeHandler.addEventInterval(
            (): void => {
                balls.push(
                    this.gameStarter.things.add(
                        this.gameStarter.things.names.healingMachineBall,
                        left + (i % 2) * 12,
                        top + Math.floor(i / 2) * 10),
                );
                i += 1;
            },
            dt,
            party.length);

        this.gameStarter.timeHandler.addEvent(
            (): void => this.healingAction(machine, nurse, balls),
            dt * (party.length + 1));
    }

    /**
     * Cutscene for Pokemon being healed in the healing machine.
     *
     */
    private healingAction(machine: IThing, nurse: ICharacter, balls: IThing[]): void {
        const numFlashes = 8;
        let i = 0;

        this.gameStarter.timeHandler.addEventInterval(
            (): void => {
                const changer = i % 2 === 0
                    ? (thing: IThing, className: string): void => this.gameStarter.graphics.addClass(thing, className)
                    : (thing: IThing, className: string): void => this.gameStarter.graphics.removeClass(thing, className);

                for (const ball of balls) {
                    changer(ball, "lit");
                }

                changer(machine, "lit");

                i += 1;
            },
            this.ballFlickerRate,
            numFlashes);

        this.gameStarter.timeHandler.addEvent(
            (): void => this.healingComplete(nurse, balls),
            (numFlashes + 2) * this.ballFlickerRate);
    }

    /**
     * Cutscene for when the Pokemon have finished healing.
     *
     * @param settings   Settings used for the cutscene.
     * @param args Settings for the routine.
     */
    private healingComplete(nurse: ICharacter, balls: IThing[]): void {
        const party: IPokemon[] = this.gameStarter.itemsHolder.getItem(this.gameStarter.storage.names.pokemonInParty);

        for (const ball of balls) {
            this.gameStarter.physics.killNormal(ball);
        }

        for (const pokemon of party) {
            this.gameStarter.battles.healPokemon(pokemon);
        }

        this.gameStarter.actions.animateCharacterSetDirection(nurse, 2);

        this.gameStarter.menuGrapher.createMenu("GeneralText");
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Thank you! \n Your %%%%%%%POKEMON%%%%%%% are fighting fit!",
                "We hope to see you again!",
            ],
            (): void => {
                this.gameStarter.menuGrapher.deleteMenu("GeneralText");
                this.gameStarter.scenePlayer.stopCutscene();
            });
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");

        const map: string = this.gameStarter.itemsHolder.getItem(this.gameStarter.storage.names.map);
        const mapInfo: IMap = this.gameStarter.areaSpawner.getMap() as IMap;
        const location: string | undefined = mapInfo.locationDefault;

        this.gameStarter.itemsHolder.setItem(
            this.gameStarter.storage.names.lastPokecenter,
            { map, location });
    }

    /**
     * Cutscene for choosing not to heal Pokemon.
     */
    private readonly chooseCancel = (): void => {
        this.gameStarter.menuGrapher.deleteMenu("Heal/Cancel");

        this.gameStarter.menuGrapher.createMenu("GeneralText");
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "We hope to see you again!",
            ],
            (): void => {
                this.gameStarter.menuGrapher.deleteMenu("GeneralText");
                this.gameStarter.scenePlayer.stopCutscene();
            });
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }
}
