import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { IPokemon } from "../Battles";
import { Direction, PokedexListingStatus } from "../Constants";
import { IKeyboardResultsMenu } from "../menus/Keyboards";
import { ICharacter, IPokeball, IThing } from "../Things";

/**
 * OakIntroPokemonChoice cutscene functions used by FullScreenPokemon instances.
 */
export class OakIntroPokemonChoiceCutscene<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
    /**
     * Cutscene for the player checking a Pokeball.
     *
     * @param settings   Settings used for the cutscene.
     */
    public PlayerChecksPokeball(settings: any): void {
        // If Oak is hidden, this cutscene shouldn't be starting (too early)
        if (this.gameStarter.utilities.getThingById("Oak").hidden) {
            this.gameStarter.scenePlayer.stopCutscene();

            this.gameStarter.menuGrapher.createMenu("GeneralText");
            this.gameStarter.menuGrapher.addMenuDialog(
                "GeneralText",
                [
                    "Those are %%%%%%%POKE%%%%%%% Balls. They contain %%%%%%%POKEMON%%%%%%%!"
                ]);
            this.gameStarter.menuGrapher.setActiveMenu("GeneralText");

            return;
        }

        // If there's already a starter, ignore this sad last ball...
        if (this.gameStarter.itemsHolder.getItem("starter")) {
            return;
        }

        const pokeball: IPokeball = settings.triggerer;
        settings.chosen = pokeball.pokemon;

        this.gameStarter.menus.openPokedexListing(
            pokeball.pokemon!,
            this.gameStarter.scenePlayer.bindRoutine("PlayerDecidesPokemon"),
            {
                position: {
                    vertical: "center",
                    offset: {
                        left: 0
                    }
                }
            });
    }

    /**
     * Cutscene for confirming the player wants to keep the chosen Pokemon.
     *
     * @param settings   Settings used for the cutscene.
     */
    public PlayerDecidesPokemon(settings: any): void {
        this.gameStarter.menuGrapher.createMenu("GeneralText");
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    "So! You want the " + settings.triggerer.description + " %%%%%%%POKEMON%%%%%%%, ", settings.chosen, "?"
                ]
            ],
            (): void => {
                this.gameStarter.menuGrapher.createMenu("Yes/No", {
                    killOnB: ["GeneralText"]
                });
                this.gameStarter.menuGrapher.addMenuList("Yes/No", {
                    options: [
                        {
                            text: "YES",
                            callback: this.gameStarter.scenePlayer.bindRoutine("PlayerTakesPokemon")
                        }, {
                            text: "NO",
                            callback: this.gameStarter.menuGrapher.registerB
                        }]
                });
                this.gameStarter.menuGrapher.setActiveMenu("Yes/No");
            });
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the player receiving his Pokemon.
     *
     * @param settings   Settings used for the cutscene.
     */
    public PlayerTakesPokemon(settings: any): void {
        const oak: ICharacter = this.gameStarter.utilities.getThingById("Oak") as ICharacter;
        const rival: ICharacter = this.gameStarter.utilities.getThingById("Rival") as ICharacter;
        const dialogOak: string = "Oak: If a wild %%%%%%%POKEMON%%%%%%% appears, your %%%%%%%POKEMON%%%%%%% can fight against it!";
        const dialogRival: string = "%%%%%%%RIVAL%%%%%%%: My %%%%%%%POKEMON%%%%%%% looks a lot stronger.";

        settings.oak = oak;
        oak.dialog = dialogOak;
        this.gameStarter.stateHolder.addChange(oak.id, "dialog", dialogOak);

        settings.rival = rival;
        rival.dialog = dialogRival;
        this.gameStarter.stateHolder.addChange(rival.id, "dialog", dialogRival);

        this.gameStarter.itemsHolder.setItem("starter", settings.chosen.join(""));
        settings.triggerer.hidden = true;
        this.gameStarter.stateHolder.addChange(settings.triggerer.id, "hidden", true);
        this.gameStarter.stateHolder.addChange(settings.triggerer.id, "nocollide", true);
        this.gameStarter.physics.killNormal(settings.triggerer);

        this.gameStarter.menuGrapher.deleteMenu("Yes/No");
        this.gameStarter.menuGrapher.createMenu("GeneralText");
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    "%%%%%%%PLAYER%%%%%%% received a ", settings.chosen, "!"
                ],
                "This %%%%%%%POKEMON%%%%%%% is really energetic!",
                [
                    "Do you want to give a nickname to ", settings.chosen, "?"
                ]
            ],
            this.gameStarter.scenePlayer.bindRoutine("PlayerChoosesNickname"));
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");

        this.gameStarter.itemsHolder.setItem("starter", settings.chosen);
        this.gameStarter.itemsHolder.setItem("PokemonInParty", [
            this.gameStarter.equations.newPokemon(settings.chosen, 5)
        ]);
        this.gameStarter.saves.addPokemonToPokedex(settings.chosen, PokedexListingStatus.Caught);
    }

    /**
     * Cutscene for allowing the player to choose his Pokemon's nickname. 
     *
     * @param settings   Settings used for the cutscene.
     */
    public PlayerChoosesNickname(settings: any): void {
        this.gameStarter.menuGrapher.createMenu("Yes/No", {
            ignoreB: true,
            killOnB: ["GeneralText"]
        });
        this.gameStarter.menuGrapher.addMenuList("Yes/No", {
            options: [
                {
                    text: "YES",
                    callback: (): void => this.gameStarter.menus.keyboards.openKeyboardMenu({
                        title: settings.chosen,
                        callback: this.gameStarter.scenePlayer.bindRoutine("PlayerSetsNickname")
                    })
                }, {
                    text: "NO",
                    callback: this.gameStarter.scenePlayer.bindRoutine("RivalWalksToPokemon")
                }]
        });
        this.gameStarter.menuGrapher.setActiveMenu("Yes/No");
    }

    /**
     * Cutscene for the player finishing the naming process.
     */
    public PlayerSetsNickname(): void {
        const party: IPokemon[] = this.gameStarter.itemsHolder.getItem("PokemonInParty");
        const menu: IKeyboardResultsMenu = this.gameStarter.menuGrapher.getMenu("KeyboardResult") as IKeyboardResultsMenu;
        const result: string[] = menu.completeValue;

        party[0].nickname = result;

        this.gameStarter.scenePlayer.playRoutine("RivalWalksToPokemon");
    }

    /**
     * Cutscene for the rival selecting his Pokemon.
     *
     * @param settings   Settings used for the cutscene.
     */
    public RivalWalksToPokemon(settings: any): void {
        const rival: ICharacter = this.gameStarter.utilities.getThingById("Rival") as ICharacter;
        let starterRival: string[];
        let steps: number;

        this.gameStarter.menus.keyboards.closeKeyboardMenu();
        this.gameStarter.menuGrapher.deleteMenu("GeneralText");
        this.gameStarter.menuGrapher.deleteMenu("Yes/No");
        this.gameStarter.mapScreener.blockInputs = true;

        switch (settings.chosen.join("")) {
            case "SQUIRTLE":
                starterRival = "BULBASAUR".split("");
                steps = 4;
                break;
            case "CHARMANDER":
                starterRival = "SQUIRTLE".split("");
                steps = 3;
                break;
            case "BULBASAUR":
                starterRival = "CHARMANDER".split("");
                steps = 2;
                break;
            default:
                throw new Error("Unknown first Pokemon.");
        }

        settings.rivalPokemon = starterRival;
        settings.rivalSteps = steps;
        this.gameStarter.itemsHolder.setItem("starterRival", starterRival);
        this.gameStarter.saves.addPokemonToPokedex(starterRival, PokedexListingStatus.Caught);

        const pokeball: IPokeball = this.gameStarter.utilities.getThingById("Pokeball" + starterRival.join("")) as IPokeball;
        settings.rivalPokeball = pokeball;

        this.gameStarter.actions.walking.startWalkingOnPath(
            rival,
            [
                {
                    blocks: 2,
                    direction: Direction.Bottom
                },
                {
                    blocks: steps,
                    direction: Direction.Right
                },
                {
                    blocks: 1,
                    direction: Direction.Top
                },
                this.gameStarter.scenePlayer.bindRoutine("RivalTakesPokemon")
            ]);
    }

    /**
     * Cutscene for the rival receiving his Pokemon.
     *
     * @param settings   Settings used for the cutscene.
     */
    public RivalTakesPokemon(settings: any): void {
        const oakblocker: IThing = this.gameStarter.utilities.getThingById("OakBlocker");
        const rivalblocker: IThing = this.gameStarter.utilities.getThingById("RivalBlocker");

        this.gameStarter.menuGrapher.deleteMenu("Yes/No");

        oakblocker.nocollide = true;
        this.gameStarter.stateHolder.addChange(oakblocker.id, "nocollide", true);

        rivalblocker.nocollide = false;
        this.gameStarter.stateHolder.addChange(rivalblocker.id, "nocollide", false);

        this.gameStarter.menuGrapher.createMenu("GeneralText");
        this.gameStarter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%RIVAL%%%%%%%: I'll take this one, then!",
                [
                    "%%%%%%%RIVAL%%%%%%% received a ", settings.rivalPokemon, "!"
                ]
            ],
            (): void => {
                settings.rivalPokeball.hidden = true;
                this.gameStarter.stateHolder.addChange(settings.rivalPokeball.id, "hidden", true);
                this.gameStarter.menuGrapher.deleteActiveMenu();
                this.gameStarter.mapScreener.blockInputs = false;
            });
        this.gameStarter.menuGrapher.setActiveMenu("GeneralText");
    }
}
