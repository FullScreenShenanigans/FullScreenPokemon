import { Section } from "eightbittr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { IPokemon } from "../Battles";
import { Direction, PokedexListingStatus } from "../Constants";
import { IKeyboardResultsMenu } from "../menus/Keyboards";
import { ICharacter, IPokeball, IThing } from "../Things";

/**
 * OakIntroPokemonChoice cutscene routines.
 */
export class OakIntroPokemonChoiceCutscene extends Section<FullScreenPokemon> {
    /**
     * Cutscene for the player checking a Pokeball.
     *
     * @param settings   Settings used for the cutscene.
     */
    public PlayerChecksPokeball(settings: any): void {
        // If Oak is hidden, this cutscene shouldn't be starting (too early)
        if (this.game.utilities.getExistingThingById("Oak").hidden) {
            this.game.scenePlayer.stopCutscene();

            this.game.menuGrapher.createMenu("GeneralText", {
                deleteOnFinish: true,
            });
            this.game.menuGrapher.addMenuDialog("GeneralText", [
                "Those are %%%%%%%POKE%%%%%%% Balls. They contain %%%%%%%POKEMON%%%%%%%!",
            ]);
            this.game.menuGrapher.setActiveMenu("GeneralText");

            return;
        }

        // If there's already a starter, ignore this sad last ball...
        if (this.game.itemsHolder.getItem(this.game.storage.names.starter)) {
            return;
        }

        const pokeball: IPokeball = settings.triggerer;
        settings.chosen = pokeball.pokemon;

        this.game.menus.pokedex.openPokedexListing(
            pokeball.pokemon!,
            this.game.scenePlayer.bindRoutine("PlayerDecidesPokemon"),
            {
                position: {
                    vertical: "center",
                    offset: {
                        left: 0,
                    },
                },
            }
        );
    }

    /**
     * Cutscene for confirming the player wants to keep the chosen Pokemon.
     *
     * @param settings   Settings used for the cutscene.
     */
    public PlayerDecidesPokemon(settings: any): void {
        this.game.menuGrapher.createMenu("GeneralText");
        this.game.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                [
                    "So! You want the " +
                        settings.triggerer.description +
                        " %%%%%%%POKEMON%%%%%%%, ",
                    settings.chosen,
                    "?",
                ],
            ],
            (): void => {
                this.game.menuGrapher.createMenu("Yes/No", {
                    killOnB: ["GeneralText"],
                });
                this.game.menuGrapher.addMenuList("Yes/No", {
                    options: [
                        {
                            text: "YES",
                            callback: this.game.scenePlayer.bindRoutine("PlayerTakesPokemon"),
                        },
                        {
                            text: "NO",
                            callback: this.game.menuGrapher.registerB,
                        },
                    ],
                });
                this.game.menuGrapher.setActiveMenu("Yes/No");
            }
        );
        this.game.menuGrapher.setActiveMenu("GeneralText");
    }

    /**
     * Cutscene for the player receiving his Pokemon.
     *
     * @param settings   Settings used for the cutscene.
     */
    public PlayerTakesPokemon(settings: any): void {
        const oak: ICharacter = this.game.utilities.getExistingThingById("Oak") as ICharacter;
        const rival: ICharacter = this.game.utilities.getExistingThingById("Rival") as ICharacter;
        const dialogOak =
            "Oak: If a wild %%%%%%%POKEMON%%%%%%% appears, your %%%%%%%POKEMON%%%%%%% can fight against it!";
        const dialogRival = "%%%%%%%RIVAL%%%%%%%: My %%%%%%%POKEMON%%%%%%% looks a lot stronger.";

        settings.oak = oak;
        oak.dialog = dialogOak;
        this.game.stateHolder.addChange(oak.id, "dialog", dialogOak);

        settings.rival = rival;
        rival.dialog = dialogRival;
        this.game.stateHolder.addChange(rival.id, "dialog", dialogRival);

        this.game.itemsHolder.setItem(this.game.storage.names.starter, settings.chosen.join(""));
        settings.triggerer.hidden = true;
        this.game.stateHolder.addChange(settings.triggerer.id, "hidden", true);
        this.game.stateHolder.addChange(settings.triggerer.id, "nocollide", true);
        this.game.death.kill(settings.triggerer);

        this.game.menuGrapher.deleteMenu("Yes/No");
        this.game.menuGrapher.createMenu("GeneralText");
        this.game.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                ["%%%%%%%PLAYER%%%%%%% received a ", settings.chosen, "!"],
                "This %%%%%%%POKEMON%%%%%%% is really energetic!",
                ["Do you want to give a nickname to ", settings.chosen, "?"],
            ],
            this.game.scenePlayer.bindRoutine("PlayerChoosesNickname")
        );
        this.game.menuGrapher.setActiveMenu("GeneralText");

        this.game.itemsHolder.setItem(this.game.storage.names.starter, settings.chosen);
        this.game.itemsHolder.setItem(this.game.storage.names.pokemonInParty, [
            this.game.equations.newPokemon({
                level: 5,
                title: settings.chosen,
            }),
        ]);
        this.game.saves.addPokemonToPokedex(settings.chosen, PokedexListingStatus.Caught);
    }

    /**
     * Cutscene for allowing the player to choose his Pokemon's nickname.
     *
     * @param settings   Settings used for the cutscene.
     */
    public PlayerChoosesNickname(settings: any): void {
        this.game.menuGrapher.createMenu("Yes/No", {
            ignoreB: true,
            killOnB: ["GeneralText"],
        });
        this.game.menuGrapher.addMenuList("Yes/No", {
            options: [
                {
                    text: "YES",
                    callback: (): void =>
                        this.game.menus.keyboards.openKeyboardMenu({
                            title: settings.chosen,
                            callback: this.game.scenePlayer.bindRoutine("PlayerSetsNickname"),
                        }),
                },
                {
                    text: "NO",
                    callback: this.game.scenePlayer.bindRoutine("RivalWalksToPokemon"),
                },
            ],
        });
        this.game.menuGrapher.setActiveMenu("Yes/No");
    }

    /**
     * Cutscene for the player finishing the naming process.
     */
    public PlayerSetsNickname(): void {
        const party: IPokemon[] = this.game.itemsHolder.getItem(
            this.game.storage.names.pokemonInParty
        );
        const menu: IKeyboardResultsMenu = this.game.menuGrapher.getMenu(
            "KeyboardResult"
        ) as IKeyboardResultsMenu;
        const result: string[] = menu.completeValue;

        party[0].nickname = result;

        this.game.scenePlayer.playRoutine("RivalWalksToPokemon");
    }

    /**
     * Cutscene for the rival selecting his Pokemon.
     *
     * @param settings   Settings used for the cutscene.
     */
    public RivalWalksToPokemon(settings: any): void {
        const rival: ICharacter = this.game.utilities.getExistingThingById("Rival") as ICharacter;
        let starterRival: string[];
        let steps: number;

        this.game.menus.keyboards.closeKeyboardMenu();
        this.game.menuGrapher.deleteMenu("GeneralText");
        this.game.menuGrapher.deleteMenu("Yes/No");
        this.game.mapScreener.blockInputs = true;

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
        this.game.itemsHolder.setItem(this.game.storage.names.starterRival, starterRival);
        this.game.saves.addPokemonToPokedex(starterRival, PokedexListingStatus.Caught);

        const pokeball: IPokeball = this.game.utilities.getExistingThingById(
            "Pokeball" + starterRival.join("")
        ) as IPokeball;
        settings.rivalPokeball = pokeball;

        this.game.actions.walking.startWalkingOnPath(rival, [
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
            this.game.scenePlayer.bindRoutine("RivalTakesPokemon"),
        ]);
    }

    /**
     * Cutscene for the rival receiving his Pokemon.
     *
     * @param settings   Settings used for the cutscene.
     */
    public RivalTakesPokemon(settings: any): void {
        const oakblocker: IThing = this.game.utilities.getExistingThingById("OakBlocker");
        const rivalblocker: IThing = this.game.utilities.getExistingThingById("RivalBlocker");

        this.game.menuGrapher.deleteMenu("Yes/No");

        oakblocker.nocollide = true;
        this.game.stateHolder.addChange(oakblocker.id, "nocollide", true);

        rivalblocker.nocollide = false;
        this.game.stateHolder.addChange(rivalblocker.id, "nocollide", false);

        this.game.menuGrapher.createMenu("GeneralText");
        this.game.menuGrapher.addMenuDialog(
            "GeneralText",
            [
                "%%%%%%%RIVAL%%%%%%%: I'll take this one, then!",
                ["%%%%%%%RIVAL%%%%%%% received a ", settings.rivalPokemon, "!"],
            ],
            (): void => {
                settings.rivalPokeball.hidden = true;
                this.game.stateHolder.addChange(settings.rivalPokeball.id, "hidden", true);
                this.game.menuGrapher.deleteActiveMenu();
                this.game.mapScreener.blockInputs = false;
            }
        );
        this.game.menuGrapher.setActiveMenu("GeneralText");
    }
}
