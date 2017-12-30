import { UserWrappr } from "userwrappr";

import { InterfaceFactory } from "./InterfaceFactory";

const container = document.getElementById("game")!;
const interfaceFactory = new InterfaceFactory();
const userWrapper = new UserWrappr(interfaceFactory.generateUserWrapprSettings());

userWrapper.createDisplay(container)
    .then((): void => {
        container.className += " loaded";
    })
    .catch((error: Error): void => {
        console.error("An error happened while trying to instantiate FullScreenPokemon!");
        console.error(error);
    });
