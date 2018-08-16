import { expect } from "chai";

import { stubBlankGame } from "../../../../fakes.test";
import { IWildPokemonSchema } from "../../../Maps";

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

            return { ...stubBlankGame(), wildPokemonOptions };
        };

        it("starts a battle with a chosen Pokemon schema", () => {
            // Arrange
            const { fsp, player, wildPokemonOptions } = stubBlankGameForEncounter();

            fsp.equations.chooseRandomWildPokemon = (options: IWildPokemonSchema[]) => options[0];

            // Act
            fsp.actions.walking.encounters.starting.startWildEncounterBattle(player, wildPokemonOptions);

            // Assert
            const opponentActors = fsp.battleMover.getBattleInfo().teams.opponent.actors;
            expect(opponentActors[0].title).to.be.deep.equal(wildPokemonOptions[0].title);
        });

        it("blocks inputs when a battle has started", () => {
            // Arrange
            const { fsp, player, wildPokemonOptions } = stubBlankGameForEncounter();

            fsp.equations.chooseRandomWildPokemon = (options: IWildPokemonSchema[]) => options[0];

            // Act
            fsp.actions.walking.encounters.starting.startWildEncounterBattle(player, wildPokemonOptions);

            // Assert
            expect(fsp.mapScreener.blockInputs).to.be.equal(true);
        });
    });
});
