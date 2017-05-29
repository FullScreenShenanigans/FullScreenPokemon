import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { IPokemon } from "../Battles";
import { IThing } from "../Things";

/**
 * PokeCenter cutscene functions used by FullScreenPokemon instances.
 */
export class PokeCenterCutscene<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
    /**
     * Cutscene for a nurse's welcome at the Pokemon Center.
     *
     * @param settings   Settings used for the cutscene. 
     */
    public Welcome(settings: any): void {
        settings.nurse = this.gameStarter.utilities.getThingById(settings.nurseId || "Nurse");
        settings.machine = this.gameStarter.utilities.getThingById(settings.machineId || "HealingMachine");

        this.gameStarter.menuGrapher.createMenu("GeneralText");
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Welcome to our %%%%%%%POKEMON%%%%%%% CENTER!",
                "We heal your %%%%%%%POKEMON%%%%%%% back to perfect health!",
                "Shall we heal your %%%%%%%POKEMON%%%%%%%?"
            ],
            this.gameStarter.scenePlayer.bindRoutine("Choose")
        );
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for choosing whether or not to heal Pokemon.
     */
    public Choose(): void {
        this.gameStarter.menuGrapher.createMenu("Heal/Cancel");
        this.gameStarter.menuGrapher.addMenuList(
            "Heal/Cancel",
            {
                options: [
                    {
                        text: "HEAL",
                        callback: this.gameStarter.scenePlayer.bindRoutine("ChooseHeal")
                    },
                    {
                        text: "CANCEL",
                        callback: this.gameStarter.scenePlayer.bindRoutine("ChooseCancel")
                    }
                ]
            }
        );
        this.gameStarter.menuGrapher.setActiveMenu("Heal/Cancel");
    }

    /**
     * Cutscene for choosing to heal Pokemon.
     */
    public ChooseHeal(): void {
        this.gameStarter.menuGrapher.deleteMenu("Heal/Cancel");

        this.gameStarter.menuGrapher.createMenu("GeneralText", {
            ignoreA: true,
            finishAutomatically: true
        });
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Ok. We'll need your %%%%%%%POKEMON%%%%%%%."
            ],
            this.gameStarter.scenePlayer.bindRoutine("Healing")
        );
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for placing Pokeballs into the healing machine.
     *
     * @param settings   Settings used for the cutscene. 
     */
    public Healing(settings: any): void {
        const party: IPokemon[] = this.gameStarter.itemsHolder.getItem("PokemonInParty");
        const balls: IThing[] = [];
        const dt: number = 35;
        const left: number = settings.machine.left + 20;
        const top: number = settings.machine.top + 28;
        let i: number = 0;

        settings.balls = balls;
        this.gameStarter.actions.animateCharacterSetDirection(settings.nurse, 3);

        this.gameStarter.timeHandler.addEventInterval(
            (): void => {
                balls.push(
                    this.gameStarter.things.add(
                        this.gameStarter.things.names.HealingMachineBall,
                        left + (i % 2) * 12,
                        top + Math.floor(i / 2) * 10)
                );
                i += 1;
            },
            dt,
            party.length);

        this.gameStarter.timeHandler.addEvent(
            (): void => this.gameStarter.scenePlayer.playRoutine(
                "HealingAction",
                {
                    balls: balls
                }),
            dt * (party.length + 1));
    }

    /**
     * Cutscene for Pokemon being healed in the healing machine.
     *
     * @param settings   Settings used for the cutscene.
     * @param args   Settings for the routine.
     */
    public HealingAction(settings: any, args: any): void {
        const balls: IThing[] = args.balls;
        const numFlashes: number = 8;
        let i: number = 0;
        let changer: Function;

        this.gameStarter.timeHandler.addEventInterval(
            (): void => {
                changer = i % 2 === 0
                    ? (thing: IThing, className: string): void => this.gameStarter.graphics.addClass(thing, className)
                    : (thing: IThing, className: string): void => this.gameStarter.graphics.removeClass(thing, className);

                for (const ball of balls) {
                    changer(ball, "lit");
                }

                changer(settings.machine, "lit");

                i += 1;
            },
            21,
            numFlashes);

        this.gameStarter.timeHandler.addEvent(
            (): void => this.gameStarter.scenePlayer.playRoutine("HealingComplete", { balls }),
            (numFlashes + 2) * 21);
    }

    /**
     * Cutscene for when the Pokemon have finished healing.
     *
     * @param settings   Settings used for the cutscene.
     * @param args Settings for the routine.
     */
    public HealingComplete(settings: any, args: any): void {
        const balls: IThing[] = args.balls;
        const party: IPokemon[] = this.gameStarter.itemsHolder.getItem("PokemonInParty");

        for (const ball of balls) {
            this.gameStarter.physics.killNormal(ball);
        }

        for (const pokemon of party) {
            this.gameStarter.battles.healPokemon(pokemon);
        }

        this.gameStarter.actions.animateCharacterSetDirection(settings.nurse, 2);

        this.gameStarter.menuGrapher.createMenu("GeneralText");
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "Thank you! \n Your %%%%%%%POKEMON%%%%%%% are fighting fit!",
                "We hope to see you again!"
            ],
            (): void => {
                this.gameStarter.menuGrapher.deleteMenu("GeneralText");
                this.gameStarter.scenePlayer.stopCutscene();
            });
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for choosing not to heal Pokemon.
     */
    public ChooseCancel(): void {
        this.gameStarter.menuGrapher.deleteMenu("Heal/Cancel");

        this.gameStarter.menuGrapher.createMenu("GeneralText");
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "We hope to see you again!"
            ],
            (): void => {
                this.gameStarter.menuGrapher.deleteMenu("GeneralText");
                this.gameStarter.scenePlayer.stopCutscene();
            });
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }
}
