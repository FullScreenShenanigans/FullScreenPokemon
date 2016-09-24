import { FullScreenPokemon } from "../../src/FullScreenPokemon";

export const mocks = {
    mockFullScreenPokemon: (): FullScreenPokemon => {
        return new FullScreenPokemon({
            width: 400,
            height: 400
        })
    }
};
