import { expect } from "chai";

import { stubBlankGame } from "../../../../fakes.test";
import { Direction } from "../../../Constants";
import { IGrass } from "../../../Things";

describe("EncounterChoices", () => {
    describe("getWildEncounterPokemonOptions", () => {
        it("chooses from wild grass Pokemon if the player is in grass", () => {
            // Arrange
            const { fsp, player } = stubBlankGame();
            const wildGrassPokemon = [
                {
                    title: "RATTATA".split(""),
                    levels: [100],
                    rate: 1,
                },
            ];

            player.grass = fsp.things.add<IGrass>(fsp.things.names.grass);
            fsp.equations.doesGrassEncounterHappen = () => true;
            fsp.mapScreener.activeArea.wildPokemon = {
                grass: wildGrassPokemon,
            };

            // Act
            const options = fsp.actions.walking.encounters.choices.getWildEncounterPokemonOptions(
                player
            );

            // Assert
            expect(options).to.be.equal(wildGrassPokemon);
        });

        it("chooses from surfing Pokemon if the player is surfing", () => {
            // Arrange
            const { fsp, player } = stubBlankGame();
            const wildSurfingPokemon = [
                {
                    title: "MAGIKARP".split(""),
                    levels: [100],
                    rate: 1,
                },
            ];

            player.surfing = true;
            fsp.equations.doesWalkingEncounterHappen = () => true;
            fsp.mapScreener.activeArea.wildPokemon = {
                surfing: wildSurfingPokemon,
            };

            // Act
            const options = fsp.actions.walking.encounters.choices.getWildEncounterPokemonOptions(
                player
            );

            // Assert
            expect(options).to.be.equal(wildSurfingPokemon);
        });

        it("chooses from walking Pokemon if the player is walking", () => {
            // Arrange
            const { fsp, player } = stubBlankGame();
            const wildWalkingPokemon = [
                {
                    title: "RATTATA".split(""),
                    levels: [100],
                    rate: 1,
                },
            ];

            fsp.actions.walking.startWalking(player, Direction.Top);
            fsp.equations.doesWalkingEncounterHappen = () => true;
            fsp.mapScreener.activeArea.wildPokemon = {
                walking: wildWalkingPokemon,
            };

            // Act
            const options = fsp.actions.walking.encounters.choices.getWildEncounterPokemonOptions(
                player
            );

            // Assert
            expect(options).to.be.equal(wildWalkingPokemon);
        });
    });
});
