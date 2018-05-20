import { GeneralComponent } from "eightbittr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { IPokemon } from "../Battles";
import { Direction, PokedexListingStatus } from "../Constants";
import { IKeyboardResultsMenu } from "../menus/Keyboards";
import { ICharacter, IPokeball, IThing } from "../Things";

/**
 * OakIntroPokemonChoice cutscene routines.
 */
export class OakIntroPokemonChoiceCutscene<TEightBittr extends FullScreenPokemon> extends GeneralComponent<TEightBittr> {
    /**
     * Cutscene for the player checking a Pokeball.
     *
     * @param settings   Settings used for the cutscene.
     */
    public PlayerChecksPokeball(settings: any): void {
        // If Oak is hidden, this cutscene shouldn't be starting (too early)
        if (this.eightBitter.utilities.getExistingThingById("Oak").hidden) {
            this.eightBitter.scenePlayer.stopCutscene();

            this.eightBitter.menuGrapher.createMenu("GeneralText", {
                deleteOnFinish: true,
            });
            this.eightBitter.menuGrapher.addMenuDialog(
                "GeneralText",
                [
                    "Those are %%%%%%%POKE%%%%%%% Balls. They contain %%%%%%%POKEMON%%%%%%%!",
                ]);
            this.eightBitter.menuGrapher.setActiveMenu("GeneralText");

            return;
        }

        // If there's already a starter, ignore this sad last ball...
        if (this.eightBitter.itemsHolder.getItem(this.eightBitter.storage.names.starter)) {
            return;
        }

        const pokeball: IPokeball = settings.triggerer;
        settings.chosen = pokeball.pokemon;

        this.eightBitter.menus.pokedex.openPokedexListing(
            pokeball.pokemon!,
            this.eightBitter.scenePlayer.bindRoutine("PlayerDecidesPokemon"),
            {
                position: {
                    vertical: "center",
                    offset: {
                        left: 0,
                    },
                },
            });
    }

    /**
     * Cutscene for confirming the player wants to keep the chosen Pokemon.
     *
     * @param settings   Settings used for the cutscene.
     */
    public PlayerDecidesPokemon(settings: any): void {
        this.eightBitter.menuGrapher.createMenu("GeneralText");
        this.eightBitter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    "So! You want the " + settings.triggerer.description + " %%%%%%%POKEMON%%%%%%%, ", settings.chosen, "?",
                ],
            ],
            (): void => {
                this.eightBitter.menuGrapher.createMenu("Yes/No", {
                    killOnB: ["GeneralText"],
                });
                this.eightBitter.menuGrapher.addMenuList("Yes/No", {
                    options: [
                        {
                            text: "YES",
                            callback: this.eightBitter.scenePlayer.bindRoutine("PlayerTakesPokemon"),
                        },
                        {
                            text: "NO",
                            callback: this.eightBitter.menuGrapher.registerB,
                        }],
                });
                this.eightBitter.menuGrapher.setActiveMenu("Yes/No");
            });
        this.eightBitter.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the player receiving his Pokemon.
     *
     * @param settings   Settings used for the cutscene.
     */
    public PlayerTakesPokemon(settings: any): void {
        const oak: ICharacter = this.eightBitter.utilities.getExistingThingById("Oak") as ICharacter;
        const rival: ICharacter = this.eightBitter.utilities.getExistingThingById("Rival") as ICharacter;
        const dialogOak = "Oak: If a wild %%%%%%%POKEMON%%%%%%% appears, your %%%%%%%POKEMON%%%%%%% can fight against it!";
        const dialogRival = "%%%%%%%RIVAL%%%%%%%: My %%%%%%%POKEMON%%%%%%% looks a lot stronger.";

        settings.oak = oak;
        oak.dialog = dialogOak;
        this.eightBitter.stateHolder.addChange(oak.id, "dialog", dialogOak);

        settings.rival = rival;
        rival.dialog = dialogRival;
        this.eightBitter.stateHolder.addChange(rival.id, "dialog", dialogRival);

        this.eightBitter.itemsHolder.setItem(this.eightBitter.storage.names.starter, settings.chosen.join(""));
        settings.triggerer.hidden = true;
        this.eightBitter.stateHolder.addChange(settings.triggerer.id, "hidden", true);
        this.eightBitter.stateHolder.addChange(settings.triggerer.id, "nocollide", true);
        this.eightBitter.death.killNormal(settings.triggerer);

        this.eightBitter.menuGrapher.deleteMenu("Yes/No");
        this.eightBitter.menuGrapher.createMenu("GeneralText");
        this.eightBitter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    "%%%%%%%PLAYER%%%%%%% received a ", settings.chosen, "!",
                ],
                "This %%%%%%%POKEMON%%%%%%% is really energetic!",
                [
                    "Do you want to give a nickname to ", settings.chosen, "?",
                ],
            ],
            this.eightBitter.scenePlayer.bindRoutine("PlayerChoosesNickname"));
        this.eightBitter.menuGrapher.setActiveMenu("GeneralText");

        this.eightBitter.itemsHolder.setItem(this.eightBitter.storage.names.starter, settings.chosen);
        this.eightBitter.itemsHolder.setItem(this.eightBitter.storage.names.pokemonInParty, [
            this.eightBitter.equations.newPokemon({
                level: 5,
                title: settings.chosen,
            }),
        ]);
        this.eightBitter.saves.addPokemonToPokedex(settings.chosen, PokedexListingStatus.Caught);
    }

    /**
     * Cutscene for allowing the player to choose his Pokemon's nickname.
     *
     * @param settings   Settings used for the cutscene.
     */
    public PlayerChoosesNickname(settings: any): void {
        this.eightBitter.menuGrapher.createMenu("Yes/No", {
            ignoreB: true,
            killOnB: ["GeneralText"],
        });
        this.eightBitter.menuGrapher.addMenuList("Yes/No", {
            options: [
                {
                    text: "YES",
                    callback: (): void => this.eightBitter.menus.keyboards.openKeyboardMenu({
                        title: settings.chosen,
                        callback: this.eightBitter.scenePlayer.bindRoutine("PlayerSetsNickname"),
                    }),
                },
                {
                    text: "NO",
                    callback: this.eightBitter.scenePlayer.bindRoutine("RivalWalksToPokemon"),
                }],
        });
        this.eightBitter.menuGrapher.setActiveMenu("Yes/No");
    }

    /**
     * Cutscene for the player finishing the naming process.
     */
    public PlayerSetsNickname(): void {
        const party: IPokemon[] = this.eightBitter.itemsHolder.getItem(this.eightBitter.storage.names.pokemonInParty);
        const menu: IKeyboardResultsMenu = this.eightBitter.menuGrapher.getMenu("KeyboardResult") as IKeyboardResultsMenu;
        const result: string[] = menu.completeValue;

        party[0].nickname = result;

        this.eightBitter.scenePlayer.playRoutine("RivalWalksToPokemon");
    }

    /**
     * Cutscene for the rival selecting his Pokemon.
     *
     * @param settings   Settings used for the cutscene.
     */
    public RivalWalksToPokemon(settings: any): void {
        const rival: ICharacter = this.eightBitter.utilities.getExistingThingById("Rival") as ICharacter;
        let starterRival: string[];
        let steps: number;

        this.eightBitter.menus.keyboards.closeKeyboardMenu();
        this.eightBitter.menuGrapher.deleteMenu("GeneralText");
        this.eightBitter.menuGrapher.deleteMenu("Yes/No");
        this.eightBitter.mapScreener.blockInputs = true;

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
        this.eightBitter.itemsHolder.setItem(this.eightBitter.storage.names.starterRival, starterRival);
        this.eightBitter.saves.addPokemonToPokedex(starterRival, PokedexListingStatus.Caught);

        const pokeball: IPokeball = this.eightBitter.utilities.getExistingThingById("Pokeball" + starterRival.join("")) as IPokeball;
        settings.rivalPokeball = pokeball;

        this.eightBitter.actions.walking.startWalkingOnPath(
            rival,
            [
                {
                    blocks: 2,
                    direction: Direction.Bottom,
                },
                {
                    blocks: steps,
                    direction: Direction.Right,
                },
                {
                    blocks: 1,
                    direction: Direction.Top,
                },
                this.eightBitter.scenePlayer.bindRoutine("RivalTakesPokemon"),
            ]);
    }

    /**
     * Cutscene for the rival receiving his Pokemon.
     *
     * @param settings   Settings used for the cutscene.
     */
    public RivalTakesPokemon(settings: any): void {
        const oakblocker: IThing = this.eightBitter.utilities.getExistingThingById("OakBlocker");
        const rivalblocker: IThing = this.eightBitter.utilities.getExistingThingById("RivalBlocker");

        this.eightBitter.menuGrapher.deleteMenu("Yes/No");

        oakblocker.nocollide = true;
        this.eightBitter.stateHolder.addChange(oakblocker.id, "nocollide", true);

        rivalblocker.nocollide = false;
        this.eightBitter.stateHolder.addChange(rivalblocker.id, "nocollide", false);

        this.eightBitter.menuGrapher.createMenu("GeneralText");
        this.eightBitter.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%RIVAL%%%%%%%: I'll take this one, then!",
                [
                    "%%%%%%%RIVAL%%%%%%% received a ", settings.rivalPokemon, "!",
                ],
            ],
            (): void => {
                settings.rivalPokeball.hidden = true;
                this.eightBitter.stateHolder.addChange(settings.rivalPokeball.id, "hidden", true);
                this.eightBitter.menuGrapher.deleteActiveMenu();
                this.eightBitter.mapScreener.blockInputs = false;
            });
        this.eightBitter.menuGrapher.setActiveMenu("GeneralText");
    }
}
