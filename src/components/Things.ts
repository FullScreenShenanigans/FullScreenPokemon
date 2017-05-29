import { Things as GameStartrThings } from "gamestartr/lib/components/Things";
import * as igamestartr from "gamestartr/lib/IGameStartr";
import * as imenugraphr from "menugraphr/lib/IMenuGraphr";
import * as itimehandlr from "timehandlr/lib/ITimeHandlr";

import { FullScreenPokemon } from "../FullScreenPokemon";
import { IWalkingInstructions } from "./actions/Walking";
import { IPokemon } from "./Battles";
import { Direction } from "./Constants";
import { IWildPokemonSchema } from "./Maps";
import { IDialog, IMenuSchema } from "./Menus";
import { IStateSaveable } from "./Saves";
import { Names } from "./things/names";
/**
 * Things keyed by their ids.
 */
export interface IThingsById {
    [i: string]: IThing;
}

/**
 * An in-game Thing with size, velocity, position, and other information.
 */
export interface IThing extends igamestartr.IThing, IStateSaveable {
    /**
     * What to do when a Character, commonly a Player, activates this Thing.
     * 
     * @param activator   The Character activating this.
     * @param activated   The Thing being activated.
     */
    activate?: (activator: ICharacter, activated?: IThing) => void;

    /**
     * The area this was spawned by.
     */
    areaName: string;

    /**
     * Things this is touching in each cardinal direction.
     */
    bordering: [IThing | undefined, IThing | undefined, IThing | undefined, IThing | undefined];

    /**
     * Whether this should be chosen over other Things if it is one of multiple
     * potential Thing borders.
     */
    borderPrimary?: boolean;

    /**
     * What to do when a Character collides with this Thing.
     * 
     * @param thing   The Character colliding with this Thing.
     * @param other   This thing being collided by the Character.
     */
    collide: (thing: ICharacter, other: IThing) => boolean;

    /**
     * Animation cycles set by the ITimeHandlr.
     */
    cycles: itimehandlr.ITimeCycles;

    /**
     * Whether this has been killed.
     */
    dead?: boolean;

    /**
     * What cardinal direction this is facing.
     */
    direction: number;

    /**
     * Whether this is undergoing a "flicker" effect by toggling .hidden on an interval.
     */
    flickering?: boolean;

    /**
     * The globally identifiable, potentially unique id of this Thing.
     */
    id: string;

    /**
     * The name of the map that spawned this.
     */
    mapName: string;

    /**
     * Whether this is barred from colliding with other Things.
     */
    nocollide?: boolean;

    /**
     * How many quadrants this is contained within.
     */
    numquads: number;

    /**
     * A horizontal visual offset to shift by.
     */
    offsetX: number;

    /**
     * A vertical visual offset to shift by.
     */
    offsetY: number;

    /**
     * Whether to shift this to the "beginning" or "end" of its Things group.
     */
    position: string;

    /**
     * Whether this has been spawned into the game.
     */
    spawned: boolean;

    /**
     * Bottom vertical tolerance for not colliding with another Thing.
     */
    tolBottom: number;

    /**
     * Left vertical tolerance for not colliding with another Thing.
     */
    tolLeft: number;

    /**
     * Right horizontal tolerance for not colliding with another Thing.
     */
    tolRight: number;

    /**
     * Top vertical tolerance for not colliding with another Thing.
     */
    tolTop: number;

    /**
     * Keying by a Direction gives the corresponding bounding box edge.
     */
    [direction: number]: number;
}

/**
 * A Character Thing.
 * @todo This should be separated into its sub-classes the way FSM's ICharacter is.
 */
export interface ICharacter extends IThing {
    /**
     * For custom triggerable Characters, whether this may be used.
     */
    active?: boolean;

    /**
     * A Thing that activated this character.
     */
    collidedTrigger?: IDetector;

    /**
     * A cutscene to activate when interacting with this Character.
     */
    cutscene?: string;

    /**
     * A dialog to start when activating this Character. If dialogDirections is true,
     * it will be interpreted as a separate dialog for each direction of interaction.
     */
    dialog?: imenugraphr.IMenuDialogRaw | imenugraphr.IMenuDialogRaw[];

    /**
     * Whether dialog should definitely be treated as an Array of one Dialog each direction.
     */
    dialogDirections?: number[];

    /**
     * A single set of dialog (or dialog directions) to play after the primary dialog
     * is complete.
     */
    dialogNext?: imenugraphr.IMenuDialogRaw | imenugraphr.IMenuDialogRaw[];

    /**
     * A dialog to place after the primary dialog as a yes or no menu.
     * @todo If the need arises, this could be changed to any type of menu.
     */
    dialogOptions?: IDialog;

    /**
     * A direction to always face after a dialog completes.
     */
    directionPreferred?: number;

    /**
     * How far this will travel while walking, such as hopping over a ledge. 
     */
    distance: number;

    /**
     * A Character walking directly behind this as a follower.
     */
    follower?: ICharacter;

    /**
     * A Character this is walking directly behind as a follower.
     */
    following?: ICharacter;

    /**
     * An item to give after a dialog is first initiated.
     */
    gift?: string;

    /**
     * A grass Scenery partially covering this while walking through a grass area.
     */
    grass?: IGrass;

    /**
     * A scratch variable for height, such as when behind grass.
     */
    heightOld?: number;

    /**
     * Whether this is currently moving, generally from walking.
     */
    isMoving: boolean;

    /**
     * A ledge this is hopping over.
     */
    ledge?: IThing;

    /**
     * A direction to turn to when the current walking step is done.
     */
    nextDirection?: Direction;

    /**
     * Whether this is allowed to be outside the QuadsKeepr quadrants area, or not
     * have a true .alive, without dieing.
     */
    outerOk?: boolean;

    /**
     * Whether this is a Player.
     */
    player?: boolean;

    /**
     * Path to push the Player back on after a dialog, if any.
     */
    pushSteps?: IWalkingInstructions;

    /**
     * Whether this is sporadically
     */
    roaming?: boolean;

    /**
     * Directions this is allowed to roam.
     */
    roamingDirections?: number[];

    /**
     * How far this can "see" a Player to walk forward and trigger a dialog.
     */
    sight?: number;

    /**
     * The Detector stretching in front of this Thing as its sight.
     */
    sightDetector?: ISightDetector;

    /**
     * A shadow Thing for when this is hopping a ledge.
     */
    shadow?: IThing;

    /**
     * How fast this moves.
     */
    speed: number;

    /**
     * A scratch variable for speed.
     */
    speedOld?: number;

    /**
     * Whether the player is currently surfing.
     */
    surfing?: boolean;

    /**
     * Whether this should turn towards an activating Character when a dialog is triggered.
     */
    switchDirectionOnDialog?: boolean;

    /**
     * Whether this is currently engaging in its activated dialog.
     */
    talking?: boolean;

    /**
     * Whether this is a Pokemon trainer, to start a battle after its dialog.
     */
    trainer?: boolean;

    /**
     * Whether this should transport an activating Character.
     */
    transport?: string | ITransportSchema;

    /**
     * Where this will turn to when its current walking step is complete.
     */
    turning?: number;

    /**
     * Whether this is currently walking.
     */
    walking?: boolean;

    /**
     * The class cycle for flipping back and forth while walking.
     */
    walkingFlipping?: itimehandlr.ITimeEvent;

    /**
     * A direction to turn to when the current walking step is done.
     */
    wantsToWalk?: boolean;
}

/**
 * An Enemy Thing such as a trainer or wild Pokemon.
 */
export interface IEnemy extends ICharacter {
    /**
     * Actors this trainer will use in battle.
     */
    actors: IWildPokemonSchema[];

    /**
     * Whether this trainer has already battled and shouldn't again.
     */
    alreadyBattled?: boolean;

    /**
     * A badge to gift when this Enemy is defeated.
     */
    badge?: string;

    /**
     * The name this will have in battle.
     */
    battleName?: string;

    /**
     * The sprite this will display as in battle, if not its battleName.
     */
    battleSprite?: string;

    /**
     * A gift to give after defeated in battle.
     */
    giftAfterBattle?: string;

    /**
     * A cutscene to trigger after defeated in battle.
     */
    nextCutscene?: string;

    /**
     * The title of the trainer before enabling the Joey's Rattata mod.
     */
    previousTitle?: string;

    /**
     * A monetary reward to give after defeated in battle.
     */
    reward: number;

    /**
     * Dialog to display after defeated in battle.
     */
    textDefeat?: imenugraphr.IMenuDialogRaw;

    /**
     * Dialog to display after the battle is over.
     */
    textAfterBattle?: imenugraphr.IMenuDialogRaw;

    /**
     * Text display upon victory.
     */
    textVictory?: imenugraphr.IMenuDialogRaw;
}

/**
 * A Player Character.
 */
export interface IPlayer extends ICharacter {
    /**
     * Whether Detectors this collides with should consider walking to be an indication
     * of activation. This is useful for when the Player is following but needs to trigger
     * a Detector anyway.
     */
    allowDirectionAsKeys?: boolean;

    /**
     * Whether the player is currently bicycling.
     */
    cycling: boolean;

    /**
     * @returns A new descriptor container for key statuses.
     */
    getKeys: () => IPlayerKeys;

    /**
     * A descriptor for a user's keys' statuses.
     */
    keys: IPlayerKeys;
}

/**
 * A descriptor for a user's keys' statuses.
 */
export interface IPlayerKeys {
    /**
     * Whether the user is currently indicating a selection.
     */
    a: boolean;

    /**
     * Whether the user is currently indicating a deselection.
     */
    b: boolean;

    /**
     * Whether the user is currently indicating to go up.
     */
    0: boolean;

    /**
     * Whether the user is currently indicating to go to the right.
     */
    1: boolean;

    /**
     * Whether the user is currently indicating to go down.
     */
    2: boolean;

    /**
     * Whether the user is currently indicating to go to the left.
     */
    3: boolean;
}

/**
 * A Grass Thing.
 */
export interface IGrass extends IThing {
    /**
     * How likely this is to trigger a grass encounter in the doesGrassEncounterHappen
     * equation, as a Number in [0, 187.5].
     */
    rarity: number;
}

/**
 * A Detector Thing. These are typically Solids.
 */
export interface IDetector extends IThing {
    /**
     * Whether this is currently allowed to activate.
     */
    active?: boolean;

    /**
     * A callback for when a Player activates this.
     * 
     * @param thing   The Player activating other, or other if a self-activation.
     * @param other   The Detector being activated by thing.
     */
    activate?: (thing: IPlayer | IDetector, other?: IDetector) => void;

    /**
     * A cutscene to start when this is activated.
     */
    cutscene?: string;

    /**
     * A dialog to start when activating this Character. If an Array, it will be interpreted
     * as a separate dialog for each cardinal direction of interaction.
     */
    dialog?: imenugraphr.IMenuDialogRaw;

    /**
     * Whether this shouldn't be killed after activation (by default, false).
     */
    keepAlive?: boolean;

    /**
     * Whether this requires a direction to be activated.
     */
    requireDirection?: number;

    /**
     * Whether a Player needs to be fully within this Detector to trigger it.
     */
    requireOverlap?: boolean;

    /**
     * A cutscene routine to start when this is activated.
     */
    routine?: string;

    /**
     * Whether this should deactivate itself after a first use (by default, false).
     */
    singleUse?: boolean;
}

/**
 * A Solid with a partyActivate callback Function.
 */
export interface IHMCharacter extends ICharacter {
    /**
     * The name of the move needed to interact with this HMCharacter.
     */
    moveName: string;

    /**
     * The partyActivate Function used to interact with this HMCharacter.
     */
    moveCallback: (player: IPlayer, pokemon: IPokemon) => void;

    /**
     * The badge needed to activate this HMCharacter.
     */
    requiredBadge: string;
}

/**
 * A WaterEdge object.
 */
export interface IWaterEdge extends IHMCharacter {
    /**
     * The direction the Player must go to leave the water.
     */
    exitDirection: number;
}

/**
 * A Detector that adds an Area into the game.
 */
export interface IAreaSpawner extends IDetector {
    /**
     * The Area to add into the game.
     */
    area: string;

    /**
     * The name of the Map to retrieve the Area within.
     */
    map: string;
}

/**
 * A Detector that marks a player as spawning in a different Area.
 */
export interface IAreaGate extends IDetector {
    /**
     * The Area to now spawn within.
     */
    area: string;

    /**
     * The Map to now spawn within.
     */
    map: string;
}

/**
 * A gym statue.
 */
export interface IGymDetector extends IDetector {
    /**
     * The name of the gym.
     */
    gym: string;

    /**
     * The name of the gym's leader.
     */
    leader: string;
}

/**
 * A Detector that activates a menu dialog.
 */
export interface IMenuTriggerer extends IDetector {
    /**
     * The name of the menu, if not "GeneralText".
     */
    menu?: string;

    /**
     * Custom attributes to apply to the menu.
     */
    menuAttributes?: IMenuSchema;

    /**
     * Path to push the Player back on after a dialog, if any.
     */
    pushSteps?: IWalkingInstructions;
}

/**
 * An Character's sight Detector.
 */
export interface ISightDetector extends IDetector {
    /**
     * The Character using this Detector as its sight.
     */
    viewer: ICharacter;
}

/**
 * A Detector to play an audio theme.
 */
export interface IThemeDetector extends IDetector {
    /**
     * The audio theme to play.
     */
    theme: string;
}

/**
 * A detector to transport to a new area.
 */
export interface ITransporter extends IDetector {
    transport: string | ITransportSchema;
}

/**
 * A description of where to transport.
 */
export interface ITransportSchema {
    /**
     * The name of the Map to transport to.
     */
    map: string;

    /**
     * The name of the Location to transport to.
     */
    location: string;
}

/**
 * A Pokeball containing some item or trigger.
 */
export interface IPokeball extends IDetector {
    /**
     * The activation action, as "item", "cutscene", "pokedex", "dialog", or "yes/no". 
     */
    action: string;

    /**
     * How many of an item to give, if action is "item".
     */
    amount?: number;

    /**
     * What dialog to say, if action is "dialog".
     */
    dialog?: imenugraphr.IMenuDialogRaw;

    /**
     * What item to give, if action is "item".
     */
    item?: string;

    /**
     * The title of the Pokemon to display, if action is "Pokedex".
     */
    pokemon?: string[];

    /**
     * What routine to play, if action is "cutscene".
     */
    routine?: string;
}

/**
 * Thing manipulation functions used by FullScreenPokemon instances.
 */
export class Things<TGameStartr extends FullScreenPokemon> extends GameStartrThings<TGameStartr> {
    /**
     * Slight addition to the parent thingProcess Function. The Thing's hit
     * check type is cached immediately, and a default id is assigned if an id
     * isn't already present.
     * 
     * @param thing   The Thing being processed.
     * @param title   What type Thing this is (the name of the class).
     * @param settings   Additional settings to be given to the Thing.
     * @param defaults   The default settings for the Thing's class.
     * @remarks This is generally called as the onMake call in an ObjectMakr.
     */

    /**
     * The name of the item
     */
    public readonly names = new Names();

    public process(thing: IThing, title: string, settings: any, defaults: any): void {
        super.process(thing, title, settings, defaults);

        // ThingHittr becomes very non-performant if functions aren't generated
        // for each Thing constructor (optimization does not respect prototypal 
        // inheritance, sadly).
        this.gameStarter.thingHitter.cacheChecksForType(thing.title, thing.groupType);

        thing.bordering = [undefined, undefined, undefined, undefined];

        if (typeof thing.id === "undefined") {
            thing.id = [
                this.gameStarter.areaSpawner.getMapName(),
                this.gameStarter.areaSpawner.getAreaName(),
                thing.title,
                (thing.name || "Anonymous")
            ].join("::");
        }
    }

    /**
     * Overriden Function to adds a new Thing to the game at a given position,
     * relative to the top left corner of the screen. The Thing is also 
     * added to the Thing groupHolder.group container.
     * 
     * @param thingRaw   What type of Thing to add. This may be a String of
     *                   the class title, an Array containing the String
     *                   and an Object of settings, or an actual Thing.
     * @param left   The horizontal point to place the Thing's left at (by
     *               default, 0).
     * @param top   The vertical point to place the Thing's top at (by default, 0).
     * @param useSavedInfo   Whether an Area's saved info in StateHolder should be 
     *                       applied to the Thing's position (by default, false).
     */
    public add(thingRaw: string | IThing | [string, any], left: number = 0, top: number = 0, useSavedInfo?: boolean): IThing {
        const thing: IThing = super.add(thingRaw, left, top) as IThing;

        if (useSavedInfo) {
            this.applySavedPosition(thing);
        }

        if (thing.id) {
            this.gameStarter.stateHolder.applyChanges(thing.id, thing);
            (this.gameStarter.groupHolder.getGroup("Thing") as any)[thing.id] = thing;
        }

        if (typeof thing.direction !== "undefined") {
            this.gameStarter.actions.animateCharacterSetDirection(thing, thing.direction);
        }

        return thing;
    }

    /**
     * Applies a thing's stored xloc and yloc to its position.
     * 
     * @param thing   A Thing being placed in the game.
     */
    public applySavedPosition(thing: IThing): void {
        const savedInfo: any = this.gameStarter.stateHolder.getChanges(thing.id);
        if (!savedInfo) {
            return;
        }

        if (savedInfo.xloc) {
            this.gameStarter.physics.setLeft(
                thing,
                this.gameStarter.mapScreener.left + savedInfo.xloc);
        }
        if (savedInfo.yloc) {
            this.gameStarter.physics.setTop(
                thing,
                this.gameStarter.mapScreener.top + savedInfo.yloc);
        }
    }
}
