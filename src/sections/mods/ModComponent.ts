import { Section } from "eightbittr";
import { CallbackRegister, Mod } from "modattachr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { ModComponentClass } from "../Mods";
import { ModEventNames } from "./EventNames";

/**
 * EightBittr component for a mod.
 */
export abstract class ModComponent extends Section<FullScreenPokemon> implements Mod {
    /**
     * Name of the mod.
     */
    public get name(): string {
        return (this.constructor as ModComponentClass).modName;
    }

    /**
     * Mod events, keyed by name.
     */
    public abstract readonly events: CallbackRegister;

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
