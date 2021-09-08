import { ClassCyclr } from "classcyclr";

import { FullScreenPokemon } from "../FullScreenPokemon";
import { Actor } from "../sections/Actors";

export const createClassCycler = (game: FullScreenPokemon) =>
    new ClassCyclr({
        classAdd: (actor: Actor, className: string) => {
            game.graphics.classes.addClass(actor, className);
        },
        classRemove: (actor: Actor, className: string): void => {
            game.graphics.classes.removeClass(actor, className);
        },
        timeHandler: game.timeHandler,
        ...game.settings.components.classCycler,
    });
