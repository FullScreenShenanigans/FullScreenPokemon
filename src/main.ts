import { FullScreenPokemon } from "./FullScreenPokemon";

const FSP: FullScreenPokemon = new FullScreenPokemon();

document.getElementById("game")!.appendChild(FSP.container);

(window as any).FSP = FSP;
