import { FullScreenPokemon } from "./FullScreenPokemon";

const container = document.getElementById("game")!;
const FSP: FullScreenPokemon = new FullScreenPokemon();

FSP.userWrapper.createDisplay(container)
    .then((): void => {
        container.className += " loaded";
    })
    .catch((error: Error): void => {
        console.error("An error happened while trying to instantiate FullScreenPokemon!");
        console.error(error);
    });

(window as any).FSP = FSP;
