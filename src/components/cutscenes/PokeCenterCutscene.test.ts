import { expect } from "chai";
import { Clock } from "lolex";

import { IListMenuProgress } from "menugraphr";
import { FullScreenPokemon } from "../..";
import { stubBlankGame } from "../../fakes.test";
import { IPokemon, IPokemonStatistics } from "../Battles";
import { Direction } from "../Constants";
import { IMenu } from "../Menus";
import { ICharacter, IPlayer, IThing } from "../Things";

/**
 * Sets up a game in PokeCenter with the player being asked to heal their Pokemon.
 */
const stubBlankGameWithNurseAndMachineAfterWelcome = () => {
    const { fsp, player, ...extras } = stubBlankGame({
        automaticallyAdvanceMenus: true,
    });
    const firstPokemonInParty: IPokemon = fsp.equations.createPokemon({
        level: 77,
        title: "METAPOD".split(""),
    });
    const nurse = fsp.objectMaker.make<ICharacter>("Nurse", {
        id: "Nurse",
    });
    const machine = fsp.objectMaker.make<IThing>("HealingMachine", {
        id: "HealingMachine",
    });

    fsp.things.add(machine, nurse.right, nurse.top);
    fsp.things.add(nurse, player.right, player.top);

    fsp.itemsHolder.setItem(fsp.storage.names.pokemonInParty, [firstPokemonInParty]);

    fsp.cutscenes.pokeCenter.Welcome();
    fsp.inputs.keyDownA(player);
    fsp.inputs.keyDownA(player);

    return { firstPokemonInParty, fsp, player, ...extras };
};

const skipBallsFlickering = (clock: Clock, fsp: FullScreenPokemon): void => {
    // Balls slowly appearing
    clock.tick(fsp.cutscenes.pokeCenter.ballAppearanceRate * fsp.gamesRunner.getInterval());

    // Balls flickering
    clock.tick(fsp.cutscenes.pokeCenter.ballFlickerRate * fsp.gamesRunner.getInterval() * 2);

    // Balls dissapearing after 8 flashes + a double-long pause
    clock.tick(fsp.cutscenes.pokeCenter.ballFlickerRate * fsp.gamesRunner.getInterval() * 10);

};

describe("PokeCenterCutscene", () => {
    it("heals the player's Pokemon when the HEAL dialog has YES chosen", () => {
        // Arrange
        const { clock, fsp, player, firstPokemonInParty } = stubBlankGameWithNurseAndMachineAfterWelcome();

        firstPokemonInParty.status = "frozen";

        // Act
        fsp.inputs.keyDownA(player);
        skipBallsFlickering(clock, fsp);

        // Assert
        expect(firstPokemonInParty.status).to.be.equal(undefined);
    });

    it("doesn't heal the player's Pokemon when the HEAL dialog has NO chosen", () => {
        // Arrange
        const { clock, fsp, player, firstPokemonInParty } = stubBlankGameWithNurseAndMachineAfterWelcome();

        firstPokemonInParty.status = "frozen";

        // Act
        fsp.inputs.keyDownDown(player);
        fsp.inputs.keyDownA(player);

        // Assert
        expect(firstPokemonInParty.status).to.be.equal("frozen");
    });
});
