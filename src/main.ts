import { FullScreenPokemon } from "./FullScreenPokemon";

const container = document.getElementById("game")!;
const FSP: FullScreenPokemon = new FullScreenPokemon();

FSP.userWrapper.createDisplay(container)
    .then((): void => {
        container.className += " loaded";
    });

(window as any).FSP = FSP;
