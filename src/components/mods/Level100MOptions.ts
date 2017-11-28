import { Level100Mod } from "./Level100Mod";
import { MOptions } from "./MOptions";

export class Level100MOptions extends MOptions {
    public constructor (name: string) {
        super(name);
    }
    public readIn(): void {
        const mod = Level100Mod.arguments;
        if (mod.readBoolean) {
            this.readBoolean();
        }
        if (mod.readString) {
            this.readString();
        }
        if (mod.selectString) {
            this.selectString();
        }
    }
}
