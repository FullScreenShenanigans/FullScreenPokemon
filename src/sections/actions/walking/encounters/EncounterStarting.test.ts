import { expect } from "chai";

import { stubBlankGame } from "../../../../fakes.test";

describe("EncounterStarting", () => {
    describe("startWildEncounterBattle", () => {
        const stubBlankGameForEncounter = () => {
            const wildPokemonOptions = [
                {
                    title: "RATTATA".split(""),
                    levels: [100],
                    rate: 1,
                },
            ];

            const { fsp, ...rest } = stubBlankGame();

            const charmander = fsp.equations.newPokemon({
                level: 99,
                title: "CHARMANDER".split(""),
                moves: [
                    {
                        remaining: 10,
                        title: "Scratch",
                        uses: 10,
                    },
                ],
            });

            fsp.itemsHolder.setItem(fsp.storage.names.pokemonInParty, [charmander]);

            return { fsp, wildPokemonOptions, ...rest };
        };

        it("starts a battle with a chosen Pokemon schema", () => {
            // Arrange
            const { fsp, player, wildPokemonOptions } = stubBlankGameForEncounter();

            // Act
            fsp.actions.walking.encounters.starting.startWildEncounterBattle(player, wildPokemonOptions);

            // Assert
            const opponentActors = fsp.battleMover.getBattleInfo().teams.opponent.actors;
            expect(opponentActors[0].title).to.be.deep.equal(wildPokemonOptions[0].title);
        });

        it("blocks inputs when a battle has started", () => {
            // Arrange
            const { fsp, player, wildPokemonOptions } = stubBlankGameForEncounter();

            // Act
            fsp.actions.walking.encounters.starting.startWildEncounterBattle(player, wildPokemonOptions);

            // Assert
            expect(fsp.mapScreener.blockInputs).to.be.equal(true);
        });
    });
});
