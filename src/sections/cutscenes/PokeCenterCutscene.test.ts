import { Clock } from "@sinonjs/fake-timers";
import { expect } from "chai";

import { FullScreenPokemon } from "../..";
import { stubBlankGame } from "../../fakes.test";
import { Pokemon } from "../Battles";
import { Character, Actor } from "../Actors";

/**
 * Sets up a game in PokeCenter with the player being asked to heal their Pokemon.
 */
const stubBlankGameWithNurseAndMachineAfterWelcome = () => {
    const { fsp, player, ...extras } = stubBlankGame({
        automaticallyAdvanceMenus: true,
    });
    const firstPokemonInParty: Pokemon = fsp.equations.createPokemon({
        level: 77,
        title: "METAPOD".split(""),
    });
    const nurse = fsp.objectMaker.make<Character>("Nurse", {
        id: "Nurse",
    });
    const machine = fsp.objectMaker.make<Actor>("HealingMachine", {
        id: "HealingMachine",
    });

    fsp.actors.add(machine, nurse.right, nurse.top);
    fsp.actors.add(nurse, player.right, player.top);

    fsp.itemsHolder.setItem(fsp.storage.names.pokemonInParty, [firstPokemonInParty]);

    fsp.cutscenes.pokeCenter.Welcome();
    fsp.inputs.keyDownA(player);
    fsp.inputs.keyDownA(player);

    return { firstPokemonInParty, fsp, player, ...extras };
};

const skipBallsFlickering = (clock: Clock, fsp: FullScreenPokemon): void => {
    // Balls slowly appearing
    clock.tick(fsp.cutscenes.pokeCenter.ballAppearanceRate * fsp.frameTicker.getInterval());

    // Balls flickering
    clock.tick(fsp.cutscenes.pokeCenter.ballFlickerRate * fsp.frameTicker.getInterval() * 2);

    // Balls dissapearing after 8 flashes + a double-long pause
    clock.tick(fsp.cutscenes.pokeCenter.ballFlickerRate * fsp.frameTicker.getInterval() * 10);
};

describe("PokeCenterCutscene", () => {
    it("heals the player's Pokemon when the HEAL dialog has YES chosen", () => {
        // Arrange
        const {
            clock,
            fsp,
            player,
            firstPokemonInParty,
        } = stubBlankGameWithNurseAndMachineAfterWelcome();

        firstPokemonInParty.status = "frozen";

        // Act
        fsp.inputs.keyDownA(player);
        skipBallsFlickering(clock, fsp);

        // Assert
        expect(firstPokemonInParty.status).to.be.equal(undefined);
    });

    it("doesn't heal the player's Pokemon when the HEAL dialog has NO chosen", () => {
        // Arrange
        const {
            fsp,
            player,
            firstPokemonInParty,
        } = stubBlankGameWithNurseAndMachineAfterWelcome();

        firstPokemonInParty.status = "frozen";

        // Act
        fsp.inputs.keyDownDown(player);
        fsp.inputs.keyDownA(player);

        // Assert
        expect(firstPokemonInParty.status).to.be.equal("frozen");
    });
});
