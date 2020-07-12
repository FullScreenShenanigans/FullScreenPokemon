import { Section } from "eightbittr";
import { ICallbackRegister, IMod } from "modattachr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { IModComponentClass } from "../Mods";
import { ModEventNames } from "./EventNames";

/**
 * EightBittr component for a mod.
 */
export abstract class ModComponent extends Section<FullScreenPokemon> implements IMod {
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
     * @param source   EightBittr instance to wrap around, or one of its components.
     */
    public constructor(
        source: FullScreenPokemon | Section<FullScreenPokemon>,
        eventNames: ModEventNames
    ) {
        super(source);

        this.eventNames = eventNames;
    }
}
