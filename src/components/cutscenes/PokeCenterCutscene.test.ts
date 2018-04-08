import { expect } from "chai";
import { Clock } from "lolex";

import { IListMenuProgress } from "menugraphr";
import { FullScreenPokemon } from "../..";
import { stubBlankGame } from "../../fakes.test";
import { IPokemon, IPokemonStatistics } from "../Battles";
import { Direction } from "../Constants";
import { IMenu } from "../Menus";
import { ICharacter, IPlayer, IThing } from "../Things";

const stubBlankGameWithNurseAndMachine = () => {
    const { fsp, player, ...extras } = stubBlankGame({
        width: 512,
        height: 512,
    });
    const pokemonInParty: IPokemon[] = [
        fsp.equations.createPokemon({
            level: 77,
            title: "METAPOD".split(""),
        }),
        fsp.equations.createPokemon({
            level: 77,
            title: "METAPOD".split(""),
        }),
    ];
    const nurse = fsp.objectMaker.make<ICharacter>("Nurse", {
        id: "Nurse",
    });
    const machine = fsp.objectMaker.make<IThing>("HealingMachine", {
        id: "HealingMachine",
    });

    fsp.things.add(machine, nurse.right, nurse.top);
    fsp.things.add(nurse, player.right, player.top);

    fsp.itemsHolder.setItem(fsp.storage.names.pokemonInParty, pokemonInParty);
    fsp.objectMaker.getPrototypeOf<IMenu>("Menu").textSpeed = 0;

    return { fsp, player, pokemonInParty, ...extras };
};

const skipDialogLine = (clock: Clock, fsp: FullScreenPokemon, player: IPlayer): void => {
    fsp.inputs.keyDownA(player);
    clock.tick(250);
};

const skipWelcomeDialog = (clock: Clock, fsp: FullScreenPokemon, player: IPlayer) => {
    // The continued dialogs are, in order:
    // "Welcome to our POKEMON CENTER!"
    // "We heal your POKEMON back to"
    // "perfect health!"
    // "Shall we heal your POKEMON?"
    // (and an extra A press to view HEAL/CANCEL)
    for (let _ = 0; _ < 5; _ += 1) {
        skipDialogLine(clock, fsp, player);
    }
};

const skipHealDialogs = (clock: Clock, fsp: FullScreenPokemon, player: IPlayer, pokemonInParty: IPokemon[]): void => {
    // "HEAL"
    skipDialogLine(clock, fsp, player);

    // "Ok. We'll need your POKEMON."
    skipDialogLine(clock, fsp, player);

    // Balls slowly appearing
    clock.tick(pokemonInParty.length * fsp.cutscenes.pokeCenter.ballAppearanceRate * fsp.gamesRunner.getInterval());
};

const skipHealing = (clock: Clock, fsp: FullScreenPokemon, player: IPlayer, pokemonInParty: IPokemon[]): void => {
    // Balls flickering
    clock.tick((pokemonInParty.length + 1) * fsp.cutscenes.pokeCenter.ballFlickerRate * fsp.gamesRunner.getInterval());

    // Balls dissapearing after 8 flashes + a double-long pause
    clock.tick(fsp.cutscenes.pokeCenter.ballFlickerRate * fsp.gamesRunner.getInterval() * 10);
};

describe("PokeCenterCutscene", () => {
    it("welcomes the player when activated", () => {
        // Arrange
        const { fsp, player } = stubBlankGameWithNurseAndMachine();

        // Act
        fsp.cutscenes.pokeCenter.Welcome();

        // Assert
        expect((fsp.menuGrapher.getActiveMenu()!.progress as IListMenuProgress).words).to.be.deep.equal([
            ["W", "e", "l", "c", "o", "m", "e"],
            [" "],
            ["t", "o"],
            [" "],
            ["o", "u", "r"],
            [" "],
            ["P", "O", "K", "�", "M", "O", "N"],
            [" "],
            ["C", "E", "N", "T", "E", "R", "!"],
        ]);
    });

    it("creates a ball per player Pokemon when HEAL is chosen", () => {
        // Arrange
        const { clock, fsp, player, pokemonInParty } = stubBlankGameWithNurseAndMachine();

        fsp.cutscenes.pokeCenter.Welcome();
        skipWelcomeDialog(clock, fsp, player);

        // Act
        skipHealDialogs(clock, fsp, player, pokemonInParty);

        // Assert
        const healingMachineBalls = fsp.groupHolder.getGroup("Solid")
            .filter((solid: IThing) => solid.title === fsp.things.names.healingMachineBall);

        expect(healingMachineBalls).to.have.length(pokemonInParty.length);
    });

    it("fully heals the player's Pokemon when the HEAL dialog finishes", () => {
        // Arrange
        const { clock, fsp, player, pokemonInParty } = stubBlankGameWithNurseAndMachine();

        for (const pokemon of pokemonInParty) {
            pokemon.status = "frozen";

            for (const statistic of ["attack", "defense", "special", "speed"] as (keyof IPokemonStatistics)[]) {
                pokemon.statistics[statistic].current /= 2;
            }
        }

        fsp.cutscenes.pokeCenter.Welcome();
        skipWelcomeDialog(clock, fsp, player);

        // Act
        skipHealDialogs(clock, fsp, player, pokemonInParty);
        skipHealing(clock, fsp, player, pokemonInParty);

        // Assert
        for (const pokemon of pokemonInParty) {
            expect(pokemon.status).to.be.equal(undefined);

            for (const statistic of ["attack", "defense", "special", "speed"] as (keyof IPokemonStatistics)[]) {
                expect(pokemon.statistics[statistic].current).to.be.equal(pokemon.statistics[statistic].normal);
            }
        }
    });
});
