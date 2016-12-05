import { FullScreenPokemon } from "./FullScreenPokemon";

const FSP: FullScreenPokemon = new FullScreenPokemon({
    size: FullScreenPokemon.prototype.moduleSettings.ui.sizeDefault
});

document.getElementById("game")!.appendChild(FSP.container);

(window as any).FSP = FSP;
