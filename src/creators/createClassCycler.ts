import { ClassCyclr } from "classcyclr";

import { FullScreenPokemon } from "../FullScreenPokemon";
import { IThing } from "../sections/Things";

export const createClassCycler = (game: FullScreenPokemon) =>
    new ClassCyclr({
        classAdd: (thing: IThing, className: string) => {
            game.graphics.classes.addClass(thing, className);
        },
        classRemove: (thing: IThing, className: string): void => {
            game.graphics.classes.removeClass(thing, className);
        },
        timeHandler: game.timeHandler,
        ...game.settings.components.classCycler,
    });	