import { UserWrappr } from "userwrappr";

import { InterfaceSettingsFactory } from "./InterfaceSettings";

/**
 * Creates a UserWrappr interface around an FSP game.
 *
 * @param container   HTML element to create within.
 * @returns A Promise for creating the game interface.
 */
export const createFspInterface = (container: HTMLElement): Promise<void> =>
    new UserWrappr(new InterfaceSettingsFactory().createUserWrapprSettings())
        .createDisplay(container);
