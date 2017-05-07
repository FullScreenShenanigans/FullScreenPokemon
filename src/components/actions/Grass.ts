import { Component } from "eightbittr/lib/Component";

import { FullScreenPokemon } from "../../FullScreenPokemon";
import { IBattleTeam, IPokemon } from "../Battles";
import { IArea, IMap, IWildPokemonSchema } from "../Maps";
import { ICharacter, IGrass, IPlayer, IThing } from "../Things";

/**
 * Grass functions used by FullScreenPokemon instances.
 */
export class Grass<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
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
            id: thing.id + " shadow"
        });

        if (thing.shadow.className !== thing.className) {
            this.gameStarter.graphics.setClass(thing.shadow, thing.className);
        }

        this.gameStarter.things.add(thing.shadow, thing.left, thing.top);
        this.gameStarter.groupHolder.switchMemberGroup(thing.shadow, thing.shadow.groupType, "Terrain");
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
     */
    public exitGrassVisually(thing: ICharacter): void {
        this.gameStarter.physics.killNormal(thing.shadow!);
        this.gameStarter.saves.popStateHistory(thing, "height");

        thing.shadow = undefined;
        thing.grass = undefined;
    }

    /**
     * Starts grass battle if a Player is in grass, using the doesGrassEncounterHappen
     * equation.
     * 
     * @param thing   An in-game Player.
     * @returns Whether a battle was started.
     */
    public checkPlayerGrassBattle(thing: IPlayer): boolean {
        if (!thing.grass || this.gameStarter.menuGrapher.getActiveMenu()) {
            return false;
        }

        if (!this.gameStarter.thingHitter.checkHitForThings(thing, thing.grass)) {
            thing.grass = undefined;
            return false;
        }

        if (!this.gameStarter.equations.doesGrassEncounterHappen(thing.grass)) {
            return false;
        }

        thing.keys = thing.getKeys();
        this.animateGrassBattleStart(thing, thing.grass);

        return true;
    }

    /**
     * Freezes a Character in grass and calls startBattle.
     * 
     * @param thing   A Character about to start a battle.
     * @param grass   Grass the Character is walking in.
     */
    public animateGrassBattleStart(thing: ICharacter, grass: IThing): void {
        const wildPokemon: IPokemon = this.chooseWildPokemonForBattle(grass);
        this.gameStarter.graphics.removeClass(thing, "walking");
        if (thing.shadow) {
            this.gameStarter.graphics.removeClass(thing.shadow, "walking");
        }

        this.gameStarter.actions.walking.animateCharacterPreventWalking(thing);

        this.gameStarter.battles.startBattle({
            teams: {
                opponent: {
                    actors: [wildPokemon]
                }
            },
            texts: {
                start: (team: IBattleTeam): string => {
                    return `Wild ${team.selectedActor.nickname.join("")} appeared!`;
                }
            }
        });
    }

    /**
     * Chooses a wild Pokemon to start a battle with.
     * 
     * @param grass   Grass Scenery the player is in.
     * @returns A wild Pokemon to start a battle with.
     */
    protected chooseWildPokemonForBattle(grass: IThing): IPokemon {
        const grassMap: IMap = this.gameStarter.areaSpawner.getMap(grass.mapName) as IMap;
        const grassArea: IArea = grassMap.areas[grass.areaName];
        const options: IWildPokemonSchema[] | undefined = grassArea.wildPokemon.grass;
        if (!options) {
            throw new Error("Grass doesn't have any wild Pokemon options defined.");
        }

        const chosen: IWildPokemonSchema = this.gameStarter.equations.chooseRandomWildPokemon(options);

        return this.gameStarter.utilities.createPokemon(chosen);
    }
}
