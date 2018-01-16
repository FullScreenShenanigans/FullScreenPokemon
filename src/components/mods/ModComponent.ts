import { GeneralComponent } from "gamestartr";
import { ICallbackRegister, IMod } from "modattachr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { IModComponentClass } from "../Mods";
import { ModEventNames } from "./EventNames";

/**
 * GameStartr component for a mod.
 */
export abstract class ModComponent<TGameStartr extends FullScreenPokemon> extends GeneralComponent<TGameStartr> implements IMod {
    /**
     * Name of the mod.
     */
    public get name(): string {
        return (this.constructor as IModComponentClass).modName;
    }

    /**
     * Mod events, keyed by name.
     */
    public abstract readonly events: ICallbackRegister;

    /**
     * Keys for mod events.
     */
    protected readonly eventNames: ModEventNames;

    /**
     * Initializes a new instance of the ModComponent class.
     *
     * @param source   GameStartr instance to wrap around, or one of its components.
     */
    public constructor(source: TGameStartr | GeneralComponent<TGameStartr>, eventNames: ModEventNames) {
        super(source);

        this.eventNames = eventNames;
    }
}
