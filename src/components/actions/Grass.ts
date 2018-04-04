import { GeneralComponent } from "gamestartr";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { IBattleTeam, IPokemon } from "../Battles";
import { IArea, IMap, IWildPokemonSchema } from "../Maps";
import { ICharacter, IGrass, IPlayer, IThing } from "../Things";

/**
 * Visual and battle updates for walking in tall grass.
 */
export class Grass<TGameStartr extends FullScreenPokemon> extends GeneralComponent<TGameStartr> {
    /**
     * Marks a Character as being visually within grass.
     *
     * @param thing   A Character in grass.
     * @param other   Grass that thing is in.
     */
    public enterGrassVisually(thing: ICharacter, other: IGrass): void {
        thing.grass = other;

        this.gameStarter.saves.addStateHistory(thing, "height", thing.height);

        thing.shadow = this.gameStarter.objectMaker.make<IThing>(thing.title, {
            nocollide: true,
            id: thing.id + " shadow",
        });

        if (thing.shadow.className !== thing.className) {
            this.gameStarter.graphics.setClass(thing.shadow, thing.className);
        }

        this.gameStarter.things.add(thing.shadow, thing.left, thing.top);
        this.gameStarter.groupHolder.switchGroup(thing.shadow, thing.shadow.groupType, "Terrain");
    }

    /**
     * Maintenance for a Character visually in grass.
     *
     * @param thing   A Character in grass.
     * @param other   Grass that thing is in.
     */
    public maintainGrassVisuals(thing: ICharacter, other: IGrass): void {
        // If thing is no longer in grass, delete the shadow and stop
        if (!this.gameStarter.physics.isThingWithinGrass(thing, other)) {
            this.exitGrassVisually(thing);
            return;
        }

        // Keep the shadow in sync with thing in position and visuals.
        this.gameStarter.physics.setLeft(thing.shadow!, thing.left);
        this.gameStarter.physics.setTop(thing.shadow!, thing.top);

        if (thing.shadow!.className !== thing.className) {
            this.gameStarter.graphics.setClass(thing.shadow!, thing.className);
        }
    }

    /**
     * Marks a Character as no longer being visually within grass.
     *
     * @param thing   Character no longer in grass.
     */
    public exitGrassVisually(thing: ICharacter): void {
        this.gameStarter.physics.killNormal(thing.shadow!);
        this.gameStarter.saves.popStateHistory(thing, "height");

        thing.shadow = undefined;
        thing.grass = undefined;
    }
}
