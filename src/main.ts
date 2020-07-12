import { createFspInterface } from "./index";

const container = document.getElementById("game")!;

createFspInterface(container).catch((error: Error): void => {
    console.error("An error happened while trying to instantiate FullScreenPokemon!");
    console.error(error);
});
