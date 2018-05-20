import { GeneralComponent } from "eightbittr";
import { ICallbackRegister, IMod } from "modattachr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { IModComponentClass } from "../Mods";
import { ModEventNames } from "./EventNames";

/**
 * EightBittr component for a mod.
 */
export abstract class ModComponent<TEightBittr extends FullScreenPokemon> extends GeneralComponent<TEightBittr> implements IMod {
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
    public constructor(source: TEightBittr | GeneralComponent<TEightBittr>, eventNames: ModEventNames) {
        super(source);

        this.eventNames = eventNames;
    }
}
