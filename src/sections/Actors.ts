import { member } from "babyioc";
import { TimeCycles, Actor as ClassCyclrActor } from "classcyclr";
import { Actor as EightBittrActor, Actors as EightBittrActors } from "eightbittr";
import * as menugraphr from "menugraphr";
import * as timehandlr from "timehandlr";

import { FullScreenPokemon } from "../FullScreenPokemon";

import { WalkingInstructions } from "./actions/Walking";
import { Pokemon } from "./Battles";
import { Direction } from "./Constants";
import { WildPokemonSchema } from "./Maps";
import { Dialog, MenuSchema } from "./Menus";
import { StateSaveable } from "./Saves";
import { ActorNames } from "./actors/ActorNames";

/**
 * Actors keyed by their ids.
 */
export interface ActorsById {
    [i: string]: Actor;
}

/**
 * An in-game Actor with size, velocity, position, and other information.
 */
export interface Actor
    extends EightBittrActor,
        Omit<ClassCyclrActor, "onActorAdded">,
        StateSaveable {
    spriteCycleSynched: any;
    spriteCycle: any;
    flipHoriz?: boolean;
    flipVert?: boolean;

    /**
     * What to do when a Character, commonly a Player, activates this Actor.
     *
     * @param activator   The Character activating this.
     * @param activated   The Actor being activated.
     */
    activate?(activator: Character, activated?: Actor): void;

    /**
     * The area this was spawned by.
     */
    areaName: string;

    /**
     * Actors this is touching in each cardinal direction.
     */
    bordering: [Actor | undefined, Actor | undefined, Actor | undefined, Actor | undefined];

    /**
     * Whether this should be chosen over other Actors if it is one of multiple
     * potential Actor borders.
     */
    borderPrimary?: boolean;

    /**
     * What to do when a Character collides with this Actor.
     *
     * @param actor   The Character colliding with this Actor.
     * @param other   This actor being collided by the Character.
     */
    collide(actor: Character, other: Actor): boolean;

    /**
     * Animation cycles set by the ClassCyclr.
     */
    cycles: TimeCycles;

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
     * The globally identifiable, potentially unique id of this Actor.
     */
    id: string;

    /**
     * The name of the map that spawned this.
     */
    mapName: string;

    /**
     * Whether this is barred from colliding with other Actors.
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
     * Whether to shift this to the "beginning" or "end" of its Actors group.
     */
    position: string;

    /**
     * Whether this has been spawned into the game.
     */
    spawned: boolean;

    /**
     * Bottom vertical tolerance for not colliding with another Actor.
     */
    tolBottom: number;

    /**
     * Left vertical tolerance for not colliding with another Actor.
     */
    tolLeft: number;

    /**
     * Right horizontal tolerance for not colliding with another Actor.
     */
    tolRight: number;

    /**
     * Top vertical tolerance for not colliding with another Actor.
     */
    tolTop: number;

    /**
     * Keying by a Direction gives the corresponding bounding box edge.
     */
    [direction: number]: number;
}

/**
 * A Character Actor.
 * @todo This should be separated into its sub-classes the way FSM's Character is.
 */
export interface Character extends Actor {
    /**
     * For custom triggerable Characters, whether this may be used.
     */
    active?: boolean;

    /**
     * An Actor that activated this character.
     */
    collidedTrigger?: Detector;

    /**
     * A cutscene to activate when interacting with this Character.
     */
    cutscene?: string;

    /**
     * A dialog to start when activating this Character. If dialogDirections is true,
     * it will be interpreted as a separate dialog for each direction of interaction.
     */
    dialog?: menugraphr.MenuDialogRaw | menugraphr.MenuDialogRaw[];

    /**
     * Whether dialog should definitely be treated as an Array of one Dialog each direction.
     */
    dialogDirections?: number[];

    /**
     * A single set of dialog (or dialog directions) to play after the primary dialog
     * is complete.
     */
    dialogNext?: menugraphr.MenuDialogRaw | menugraphr.MenuDialogRaw[];

    /**
     * A dialog to place after the primary dialog as a yes or no menu.
     * @todo If the need arises, this could be changed to any type of menu.
     */
    dialogOptions?: Dialog;

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
    follower?: Character;

    /**
     * A Character this is walking directly behind as a follower.
     */
    following?: Character;

    /**
     * An item to give after a dialog is first initiated.
     */
    gift?: string;

    /**
     * A grass Scenery partially covering this while walking through a grass area.
     */
    grass?: Grass;

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
    ledge?: Actor;

    /**
     * A direction to turn to when the current walking step is done.
     */
    nextDirection?: Direction;

    /**
     * Whether this is allowed to be outside the QuadsKeepr quadrants area without getting pruned.
     */
    outerOk?: boolean;

    /**
     * Whether this is a Player.
     */
    player?: boolean;

    /**
     * Path to push the Player back on after a dialog, if any.
     */
    pushSteps?: WalkingInstructions;

    /**
     * Whether this is sporadically walking in random directions.
     */
    roaming?: boolean;

    /**
     * How far this can "see" a Player to walk forward and trigger a dialog.
     */
    sight?: number;

    /**
     * The Detector stretching in front of this Actor as its sight.
     */
    sightDetector?: SightDetector;

    /**
     * A shadow Actor for when this is hopping a ledge.
     */
    shadow?: Actor;

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
    transport?: string | TransportSchema;

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
    walkingFlipping?: timehandlr.TimeEvent;

    /**
     * A direction to turn to when the current walking step is done.
     */
    wantsToWalk?: boolean;
}

/**
 * A Character able to roam in random directions.
 */
export interface RoamingCharacter extends Character {
    /**
     * Whether this is roaming (always true in this type).
     */
    roaming: true;

    /**
     * Directions this is allowed to roam.
     */
    roamingDirections: number[];

    /**
     * Distances this has roamed horizontally and vertically.
     */
    roamingDistances: {
        horizontal: number;
        vertical: number;
    };
}

/**
 * An Enemy Actor such as a trainer or wild Pokemon.
 */
export interface Enemy extends Character {
    /**
     * Actors this trainer will use in battle.
     */
    actors: WildPokemonSchema[];

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
    textDefeat?: menugraphr.MenuDialogRaw;

    /**
     * Dialog to display after the battle is over.
     */
    textAfterBattle?: menugraphr.MenuDialogRaw;

    /**
     * Text display upon victory.
     */
    textVictory?: menugraphr.MenuDialogRaw;
}

/**
 * A Player Character.
 */
export interface Player extends Character {
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
    getKeys(): PlayerKeys;

    /**
     * A descriptor for a user's keys' statuses.
     */
    keys: PlayerKeys;
}

/**
 * A descriptor for a user's keys' statuses.
 */
export interface PlayerKeys {
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
 * A Grass Actor.
 */
export interface Grass extends Actor {
    /**
     * How likely this is to trigger a grass encounter in the doesGrassEncounterHappen
     * equation, as a Number in [0, 187.5].
     */
    rarity: number;
}

/**
 * A Detector Actor. These are typically Solids.
 */
export interface Detector extends Actor {
    /**
     * Whether this is currently allowed to activate.
     */
    active?: boolean;

    /**
     * A callback for when a Player activates this.
     *
     * @param actor   The Player activating other, or other if a self-activation.
     * @param other   The Detector being activated by actor.
     */
    activate?(actor: Player | Detector, other?: Detector): void;

    /**
     * A cutscene to start when this is activated.
     */
    cutscene?: string;

    /**
     * A dialog to start when activating this Character. If an Array, it will be interpreted
     * as a separate dialog for each cardinal direction of interaction.
     */
    dialog?: menugraphr.MenuDialogRaw;

    /**
     * Whether this shouldn't be killed after activation (by default, false).
     */
    keepAlive?: boolean;

    /**
     * Whether this requires a direction to be activated.
     */
    requireDirection?: Direction;

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
export interface HMCharacter extends Character {
    /**
     * The name of the move needed to interact with this HMCharacter.
     */
    moveName: string;

    /**
     * The partyActivate Function used to interact with this HMCharacter.
     */
    moveCallback(player: Player, pokemon: Pokemon): void;

    /**
     * The badge needed to activate this HMCharacter.
     */
    requiredBadge: string;
}

/**
 * A WaterEdge object.
 */
export interface WaterEdge extends HMCharacter {
    /**
     * The direction the Player must go to leave the water.
     */
    exitDirection: number;
}

/**
 * A Detector that adds an Area into the game.
 */
export interface AreaSpawner extends Detector {
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
export interface AreaGate extends Detector {
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
export interface GymDetector extends Detector {
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
export interface MenuTriggerer extends Detector {
    /**
     * The name of the menu, if not "GeneralText".
     */
    menu?: string;

    /**
     * Custom attributes to apply to the menu.
     */
    menuAttributes?: MenuSchema;

    /**
     * Path to push the Player back on after a dialog, if any.
     */
    pushSteps?: WalkingInstructions;
}

/**
 * An Character's sight Detector.
 */
export interface SightDetector extends Detector {
    /**
     * The Character using this Detector as its sight.
     */
    viewer: Character;
}

/**
 * A Detector to play an audio theme.
 */
export interface ThemeDetector extends Detector {
    /**
     * The audio theme to play.
     */
    theme: string;
}

/**
 * A detector to transport to a new area.
 */
export interface Transporter extends Detector {
    transport: string | TransportSchema;
}

/**
 * A description of where to transport.
 */
export interface TransportSchema {
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
export interface Pokeball extends Detector {
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
    dialog?: menugraphr.MenuDialogRaw;

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
 * Adds and processes new Actors into the game.
 */
export class Actors<Game extends FullScreenPokemon> extends EightBittrActors<Game> {
    /**
     * Stores known names of Actors.
     */
    @member(ActorNames)
    public readonly names: ActorNames;

    /**
     * Overriden Function to adds a new Actor to the game at a given position,
     * relative to the top left corner of the screen.
     *
     * @param actorRaw   What type of Actor to add. This may be a String of
     *                   the class title, an Array containing the String
     *                   and an Object of settings, or an actual Actor.
     * @param left   The horizontal point to place the Actor's left at (by
     *               default, 0).
     * @param top   The vertical point to place the Actor's top at (by default, 0).
     * @param useSavedInfo   Whether an Area's saved info in StateHolder should be
     *                       applied to the Actor's position (by default, false).
     */
    public add<TActor extends Actor = Actor>(
        actorRaw: string | Actor | [string, any],
        left = 0,
        top = 0,
        useSavedInfo?: boolean
    ): TActor {
        const actor: TActor = super.add(actorRaw, left, top) as TActor;

        if (useSavedInfo) {
            this.applySavedPosition(actor);
        }

        if (actor.id) {
            this.game.stateHolder.applyChanges(actor.id, actor);
        }

        if (typeof actor.direction !== "undefined") {
            this.game.actions.animateCharacterSetDirection(actor, actor.direction);
        }

        return actor;
    }

    /**
     * Slight addition to the parent actorProcess Function. The Actor's hit
     * check type is cached immediately, and a default id is assigned if an id
     * isn't already present.
     *
     * @param actor   The Actor being processed.
     * @param title   What type Actor this is (the name of the class).
     * @remarks This is generally called as the onMake call in an ObjectMakr.
     */
    public process(actor: Actor, title: string): void {
        super.process(actor, title);

        // Sprite cycles
        let cycle: any;
        if ((cycle = actor.spriteCycle)) {
            this.game.classCycler.addClassCycle(
                actor,
                cycle[0],
                cycle[1] || undefined,
                cycle[2] || undefined
            );
        }
        if ((cycle = actor.spriteCycleSynched)) {
            this.game.classCycler.addClassCycleSynched(
                actor,
                cycle[0],
                cycle[1] || undefined,
                cycle[2] || undefined
            );
        }

        // Terrain and Scenery groups will never have collisions checked
        if (actor.groupType !== "Terrain" && actor.groupType !== "Scenery") {
            actor.bordering = [undefined, undefined, undefined, undefined];
        }

        if (typeof actor.id === "undefined") {
            actor.id = [
                this.game.areaSpawner.getMapName(),
                this.game.areaSpawner.getAreaName(),
                actor.title,
                actor.name || "Anonymous",
            ].join("::");
        }
    }

    /**
     * Applies An Actor's stored xloc and yloc to its position.
     *
     * @param actor   An Actor being placed in the game.
     */
    public applySavedPosition(actor: Actor): void {
        const savedInfo: any = this.game.stateHolder.getChanges(actor.id);
        if (!savedInfo) {
            return;
        }

        if (savedInfo.xloc) {
            this.game.physics.setLeft(actor, this.game.mapScreener.left + savedInfo.xloc);
        }
        if (savedInfo.yloc) {
            this.game.physics.setTop(actor, this.game.mapScreener.top + savedInfo.yloc);
        }
    }
}
