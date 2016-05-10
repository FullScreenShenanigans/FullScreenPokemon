declare module FullScreenPokemon {
    /**
     * Directions mapped to their String aliases.
     */
    export interface IDirectionsToAliases {
        [i: number]: string;
    }

    /**
     * String aliases of directions mapped to those directions.
     */
    export interface IDirectionAliases {
        [i: string]: Direction;
    }

    /**
     * Direction aliases mapped to their opposites, such as "left" to "right".
     */
    export interface IDirectionOpposites {
        [i: string]: string;
    }

    /**
     * A simple container for Map attributes given by switching to an Area within 
     * that map. A bounding box of the current viewport is kept, along with a bag
     * of assorted variable values.
     */
    export interface IMapScreenr extends MapScreenr.IMapScreenr {
        /**
         * Whether user inputs should be ignored.
         */
        blockInputs: boolean;

        /**
         * The current size of the area Things are placed in.
         */
        boundaries: IAreaBoundaries;

        /**
         * The currently playing cutscene, if any.
         */
        cutscene?: string;

        /**
         * What direction the player is currently facing.
         */
        playerDirection: Direction;

        /**
         * What form of scrolling is currently capable on the screen.
         */
        scrollability: Scrollability;

        /**
         * What theme is currently playing.
         */
        theme?: string;

        /**
         * All Things in the game, keyed by their ids.
         */
        thingsById: IThingsById;
    }

    /**
     * Things keyed by their ids.
     */
    export interface IThingsById {
        [i: string]: IThing;
    }

    /**
     * Settings regarding in-game battles, particularly for an IBattleMovr.
     */
    export interface IBattleMovrCustoms extends GameStartr.IGameStartrSettingsObject {
        /**
         * The parent IGameStartr controlling Things.
         */
        GameStarter: GameStartr.IGameStartr;

        /**
         * The IMenuGraphr handling menu creation.
         */
        MenuGrapher: MenuGraphr.IMenuGraphr;
    }

    /**
     * Settings regarding computations, particularly for an IMathDecidr.
     */
    export interface IMathDecidrCustoms extends GameStartr.IMathDecidrCustoms {
        /**
         * Constants the IMathDecidr may use in equations.
         */
        constants: IMathConstants;

        /**
         * Calculation Functions, keyed by name.
         */
        equations: IMathEquations;
    }

    /**
     * Constants for an IMathDecidr, including all static Pokemon information.
     */
    export interface IMathConstants {
        /**
         * An INumberMakr for random number generation.
         */
        NumberMaker?: NumberMakr.INumberMakr;

        /**
         * Names of all statistics Pokemon have.
         */
        statisticNames?: string[];

        /**
         * Names of Pokemon statistics to display in statistics menus.
         */
        statisticNamesDisplayed?: string[];

        /**
         * Information on Pokemon status effects.
         */
        statuses: {
            /**
             * Names of all statuses Pokemon may have.
             */
            names: string[];

            /**
             * Statuses that will enable a Pokemon to be caught in the canCatchPokemon
             * equation if a random generated N is < 25.
             */
            probability25: {
                [i: string]: boolean;
            };

            /**
             * Statuses that will enable a Pokemon to be caught in the canCatchPokemon
             * equation if a random generated N is < 21.
             */
            probability12: {
                [i: string]: boolean;
            };

            /**
             * Bonus probability points awarded for statuses in the canCatchPokemon equation
             * against the random generated N.
             */
            levels: {
                [i: string]: number;
            };

            /**
             * Additional shake points (s) in the numBallShakes equation for each status.
             */
            shaking: {
                [i: string]: number;
            }
        };

        /**
         * [X, Y] coordinates for spots on the Town Map to display Thing icons.
         */
        townMapLocations: {
            [i: string]: [number, number];
        };

        /**
         * Information on Pokemon types.
         */
        types: {
            /**
             * Names of types Pokemon may be.
             */
            names: string[];

            /**
             * Type names mapped to their location in the type effectiveness table.
             */
            indices: {
                [i: string]: number;
            };

            /**
             * The type effectiveness table, mapping each [attacker, defender] type
             * effectiveness multiplier.
             */
            table: number[][];
        };

        /**
         * All known Pokemon, keyed by concatenated name.
         */
        pokemon: {
            [i: string]: IPokemonListing;
        };

        /**
         * All known Pokemon moves, keyed by concatenated name.
         */
        moves: {
            [i: string]: IMoveSchema;
        };

        /**
         * All known items, keyed by concatenated name.
         */
        items: {
            [i: string]: IItemSchema;
        };

        /**
         * Battle modifications used in the opponentMove equation.
         */
        battleModifications: {
            [i: string]: IBattleModification;
        };
    }

    /**
     * Calculation Functions for an IMathDecidr, keyed by name.
     */
    export interface IMathEquations extends MathDecidr.IEquationContainer {
        /**
         * Generates a new Pokemon with the given traits.
         * 
         * @param constants   Constants from the calculating IMathDecidr.
         * @param equations   Other calculation Functions from the IMathDecidr.
         * @param title   The type of Pokemon to create.
         * @param level   The level of the new Pokemon (by default, 1).
         * @param moves   What moves the Pokemon has (by default, generated from its type
         *                and level).
         * @param iv   What IV points the Pokemon should start with (by default, generated 
         *             from the newPokemonIVs equation.
         * @param ev   What EV points the Pokemon should start with (by default, generated
         *             from the newPokemonEVs equation).
         * @returns A newly created Pokemon.
         */
        newPokemon: (
            constants: IMathConstants,
            equations: IMathEquations,
            title: string[],
            level?: number,
            moves?: BattleMovr.IMove[],
            iv?: number,
            ev?: number) => IPokemon;

        /**
         * Computes the default new moves for a Pokemon based on its type and level.
         * 
         * @param constants   Constants from the calculating IMathDecidr.
         * @param equations   Other calculation Functions from the IMathDecidr.
         * @param title   The type of Pokemon.
         * @param level   The level of the Pokemon.
         * @returns The default moves of the Pokemon.
         */
        newPokemonMoves: (constants: IMathConstants, equations: IMathEquations, title: string[], level: number) => BattleMovr.IMove[];

        /**
         * Computes a random set of IV points for a new Pokemon.
         * 
         * @param constants   Constants from the calculating IMathDecidr.
         * @param equations   Other calculation Functions from the IMathDecidr.
         * @returns A random set of IV points.
         */
        newPokemonIVs: (constants: IMathConstants, equations: IMathEquations) => { [i: string]: number };

        /**
         * Computes a blank set of EV points for a new Pokemon.
         * 
         * @param constants   Constants from the calculating IMathDecidr.
         * @param equations   Other calculation Functions from the IMathDecidr.
         * @returns A blank set of EV points.
         */
        newPokemonEVs: (constants: IMathConstants, equations: IMathEquations) => { [i: string]: number };

        /**
         * Computes how much experience a new Pokemon should start with, based on its
         * type and level.
         * 
         * @param constants   Constants from the calculating IMathDecidr.
         * @param equations   Other calculation Functions from the IMathDecidr.
         * @param title   The type of Pokemon.
         * @param level   The level of the Pokemon.
         * @returns How much experience the Pokemon should start with.
         */
        newPokemonExperience: (constants: IMathConstants, equations: IMathEquations, title: string[], level: number) => IExperience;

        /**
         * Computes a Pokemon's new statistic based on its IVs and EVs.
         * 
         * @param constants   Constants from the calculating IMathDecidr.
         * @param equations   Other calculation Functions from the IMathDecidr.
         * @param statistic   Which statistic to compute.
         * @returns A new value for the statistic.
         */
        pokemonStatistic: (constants: IMathConstants, equations: IMathEquations, pokemon: IPokemon, statistic: string) => number;

        /**
         * Determines whether a wild encounter should occur when walking through grass.
         * 
         * @param constants   Constants from the calculating IMathDecidr.
         * @param equations   Other calculation Functions from the IMathDecidr.
         * @param grass   The grass Thing being walked through.
         * @returns Whether a wild encounter should occur.
         */
        doesGrassEncounterHappen: (constants: IMathConstants, equations: IMathEquations, grass: IGrass) => boolean;

        /**
         * Determines whether a Pokemon may be caught by a ball.
         * 
         * @param constants   Constants from the calculating IMathDecidr.
         * @param equations   Other calculation Functions from the IMathDecidr.
         * @param pokemon   The Pokemon the ball is attempting to catch.
         * @param ball   The ball attempting to catch the Pokemon.
         * @returns Whether the Pokemon may be caught.
         */
        canCatchPokemon: (constants: IMathConstants, equations: IMathEquations, pokemon: IPokemon, ball: IBattleBall) => boolean;

        /**
         * Determines whether the player may flee a wild Pokemon encounter.
         * 
         * @param constants   Constants from the calculating IMathDecidr.
         * @param equations   Other calculation Functions from the IMathDecidr.
         * @param pokemon   The player's current Pokemon.
         * @param enemy   The wild Pokemon.
         * @param battleInfo   Information on the current battle.
         * @returns Whether the player may flee.
         */
        canEscapePokemon: (
            constants: IMathConstants,
            equations: IMathEquations,
            pokemon: IPokemon,
            enemy: IPokemon,
            battleInfo: IBattleInfo) => boolean;

        /**
         * Calculates how many times a failed Pokeball should shake.
         * 
         * @param constants   Constants from the calculating IMathDecidr.
         * @param equations   Other calculation Functions from the IMathDecidr.
         * @param pokemon   The wild Pokemon the ball is failing to catch.
         * @param ball   The Pokeball attempting to catch the wild Pokemon.
         * @returns How many times the balls hould shake.
         */
        numBallShakes: (constants: IMathConstants, equations: IMathEquations, pokemon: IPokemon, ball: IBattleBall) => number;

        /**
         * Determines what move an opponent should take in battle.
         * 
         * @param constants   Constants from the calculating IMathDecidr.
         * @param equations   Other calculation Functions from the IMathDecidr.
         * @param player   The in-battle player.
         * @param opponent   The in-battle opponent.
         * @returns The contatenated name of the move the opponent will choose.
         */
        opponentMove: (
            constants: IMathConstants,
            equations: IMathEquations,
            player: IBattleThingInfo,
            opponent: IBattleThingInfo) => string;

        /**
         * Checks whether a Pokemon contains any of the given types.
         * 
         * @param constants   Constants from the calculating IMathDecidr.
         * @param equations   Other calculation Functions from the IMathDecidr.
         * @param pokemon   A Pokemon.
         * @param types   The types to check.
         * @returns Whether the Pokemon's types includes any of the given types.
         */
        pokemonMatchesTypes: (constants: IMathConstants, equations: IMathEquations, pokemon: IPokemon, types: string[]) => boolean;

        /**
         * Checks whether a move only has a status effect (does no damage, or nothing).
         * 
         * @param constants   Constants from the calculating IMathDecidr.
         * @param equations   Other calculation Functions from the IMathDecidr.
         * @param move   The move.
         * @returns Whether the moves has only a status effect.
         */
        moveOnlyStatuses: (constants: IMathConstants, equations: IMathEquations, move: IMoveSchema) => boolean;

        /**
         * Modifies a move possibility's priority based on battle state.
         * 
         * @param constants   Constants from the calculating IMathDecidr.
         * @param equations   Other calculation Functions from the IMathDecidr.
         * @param possibility   A move possibility.
         * @param modification   A modification summary for a part of the battle state.
         * @param target   The Pokemon being targeted.
         * @param amount   How much to modify the move's priority.
         */
        applyMoveEffectPriority: (
            constants: IMathConstants,
            equations: IMathEquations,
            possibility: IMovePossibility,
            modification: IBattleModification,
            target: IPokemon,
            amount: number) => void;

        /**
         * Determines whether a player's Pokemon should move before the opponent's.
         * 
         * @param constants   Constants from the calculating IMathDecidr.
         * @param equations   Other calculation Functions from the IMathDecidr.
         * @param player   The in-battle player.
         * @param choicePlayer   The concatenated name of the move the player chose.
         * @param opponent   The in-battle opponent.
         * @param choiesOpponent   The concatenated name of the move the opponent chose.
         * @returns Whether the player will move before the opponent.
         */
        playerMovesFirst: (
            constants: IMathConstants,
            equations: IMathEquations,
            player: IBattleThingInfo,
            choicePlayer: string,
            opponent: IBattleThingInfo,
            choiceOpponent: string) => boolean;

        /**
         * Computes how much damage a move should do to a Pokemon.
         * 
         * @param constants   Constants from the calculating IMathDecidr.
         * @param equations   Other calculation Functions from the IMathDecidr.
         * @param move   The concatenated name of the move.
         * @param attacker   The attacking pokemon.
         * @param defender   The defending Pokemon.
         * @returns How much damage should be dealt.
         */
        damage: (constants: IMathConstants, equations: IMathEquations, move: string, attacker: IPokemon, defender: IPokemon) => number;

        /**
         * Determines the damage modifier against a defending Pokemon.
         * 
         * @param constants   Constants from the calculating IMathDecidr.
         * @param equations   Other calculation Functions from the IMathDecidr.
         * @param move   The attacking Pokemon's move.
         * @param critical   Whether the move is a critical hit.
         * @param attacker   The attacking Pokemon.
         * @param defender   The defending Pokemon.
         * @returns The damage modifier, as a multiplication constant.
         */
        damageModifier: (
            constants: IMathConstants,
            equations: IMathEquations,
            move: IMoveSchema,
            critical: boolean,
            attacker: IPokemon,
            defender: IPokemon) => number;

        /**
         * Determines whether a move should be a critical hit.
         * 
         * @param constants   Constants from the calculating IMathDecidr.
         * @param equations   Other calculation Functions from the IMathDecidr.
         * @param move   The concatenated name of the move.
         * @param attacker   The attacking Pokemon.
         * @returns Whether the move should be a critical hit.
         */
        criticalHit: (constants: IMathConstants, equations: IMathEquations, move: string, attacker: IPokemon) => boolean;

        /**
         * Determines the type effectiveness of a move on a defending Pokemon.
         * 
         * @param constants   Constants from the calculating IMathDecidr.
         * @param equations   Other calculation Functions from the IMathDecidr.
         * @param move   The concatenated name of the move.
         * @param defender   The defending Pokemon.
         * @returns A damage modifier, as a multiplication constant.
         */
        typeEffectiveness: (constants: IMathConstants, equations: IMathEquations, move: string, defender: IPokemon) => number;

        /**
         * Computes how much experience a new Pokemon should start with.
         * 
         * @param constants   Constants from the calculating IMathDecidr.
         * @param equations   Other calculation Functions from the IMathDecidr.
         * @param title   The name of the Pokemon.
         * @param level   The level of the Pokemon.
         * @returns An amount of experience.
         */
        experienceStarting: (IMathConstants: IMathConstants, equations: IMathEquations, title: string[], level: number) => number;

        /**
         * Computes how much experience should be gained from defeating a Pokemon.
         * 
         * @param constants   Constants from the calculating IMathDecidr.
         * @param equations   Other calculation Functions from the IMathDecidr.
         * @param player   The in-game player, whose selected actor has been victorious.
         * @param opponent   The in-game opponent, whose selected actor has been defeated.
         * @returns How much experience is to be gained.
         * @remarks This will need to be changed to accomodate rewarding multiple Pokemon.
         */
        experienceGained: (
            constants: IMathConstants,
            equations: IMathEquations,
            player: IBattleThingInfo,
            opponent: IBattleThingInfo) => number;

        /**
         * Computes how wide a health bar should be.
         * 
         * @param constants   Constants from the calculating IMathDecidr.
         * @param equations   Other calculation Functions from the IMathDecidr.
         * @param widthFullBar   The maximum possible width.
         * @param hp   How much HP a Pokemon currently has.
         * @param hpNormal   The maximum HP the Pokemon may have.
         * @returns How wide the health bar should be.
         */
        widthHealthBar: (
            constants: IMathConstants,
            equations: IMathEquations,
            widthFullBar: number,
            hp: number,
            hpNormal: number) => number;
    }

    /**
     * Settings regarding a menu system, particularly for an IMenuGraphr.
     */
    export interface IMenuGraphrCustoms extends GameStartr.IGameStartrSettingsObject {
        /**
         * The controlling IGameStartr.
         */
        GameStarter?: GameStartr.IGameStartr;

        /**
         * Known menu schemas, keyed by name.
         */
        schemas?: MenuGraphr.IMenuSchemas;

        /**
         * Alternate titles for texts, such as " " to "space".
         */
        aliases?: MenuGraphr.IAliases;

        /**
         * Programmatic replacements for deliniated words.
         */
        replacements?: MenuGraphr.IReplacements;
    }

    /**
     * Settings regarding large-scale state storage, particularly for an IStateHoldr.
     */
    export interface IStateHoldrCustoms extends GameStartr.IGameStartrSettingsObject {
        ItemsHolder: ItemsHoldr.IItemsHoldr;
    }

    /**
     * Stored settings to be stored separately and kept within an IFullScreenPokemon.
     */
    export interface IFullScreenPokemonStoredSettings extends GameStartr.IGameStartrStoredSettings {
        /**
         * Settings regarding in-game battles, particularly for an IBattleMovr.
         */
        battles: IBattleMovrCustoms;

        /**
         * Settings regarding computations, particularly for an IMathDecidr.
         */
        math: IMathDecidrCustoms;

        /**
         * Settings regarding a menu system, particularly for an IMenuGraphr.
         */
        menus: IMenuGraphrCustoms;

        /**
         * Settings regarding large-scale state storage, particularly for an IStateHoldr.
         */
        states: IStateHoldrCustoms;
    }

    /**
     * Static information about a known Pokemon.
     */
    export interface IPokemonListing {
        /**
         * The height of the Pokemon, as ["feet", "inches"].
         */
        height: [string, string];

        /**
         * A short label for the Pokemon, such as "Psi" for Abra.
         */
        label: string;

        /**
         * What number the Pokemon is in the Pokedex.
         */
        number: number;

        /**
         * The type of sprite used in-game for this Pokemon, such as "Water".
         */
        sprite: string;

        /**
         * Lines of text describing the Pokemon.
         */
        info: string[];

        /**
         * The name of the Pokemon this evolves into. This will be refactored eventually.
         */
        evolvesInto?: string;

        /**
         * How this Pokemon evolves. This will be refactored eventually.
         */
        evolvesVia?: string;

        /**
         * How quickly this gains experience, as "slow", "mediumSlow", "mediumFast", or "fast".
         */
        experienceType?: string; // Todo: once all are known, make non-optional

        /**
         * How much this weighs.
         */
        weight: number;

        /**
         * This Pokemons 1 or 2 types.
         */
        types: string[];

        /**
         * The rate of HP statistic growth.
         */
        HP: number;

        /**
         * The rate of Attack statistic growth.
         */
        Attack: number;

        /**
         * The rate of Defense statistic growth.
         */
        Defense: number;

        /**
         * The rate of Special statistic growth.
         */
        Special: number;

        /**
         * The rate of HP statistic growth.
         */
        Speed: number;

        /**
         * Known moves this Pokemon may learn.
         */
        moves: IPokemonMovesListing;
    }

    /**
     * A description of a Pokemon in a player's Pokedex.
     * @todo It's not clear how this is different from IPokedexInformation.
     */
    export interface IPokedexListing extends IPokemonListing {
        /**
         * Whether the Pokemon has been caught.
         */
        caught?: boolean;

        /**
         * Whether the Pokemon has been seen.
         */
        seen?: boolean;

        /**
         * The concatenated title of the Pokemon.
         */
        title: string;
    }

    /**
     * A description of a Pokemon in a player's Pokedex.
     * @todo It's not clear how this is different from IPokedexListing.
     */
    export interface IPokedexInformation {
        /**
         * Whether the Pokemon has been caught.
         */
        caught?: boolean;

        /**
         * Whether the Pokemon has been seen.
         */
        seen?: boolean;

        /**
         * The title of the Pokemon.
         */
        title: string[];
    }

    /**
     * A player's Pokedex, as a summary of seen Pokemon keyed by name.
     */
    export interface IPokedex {
        [i: string]: IPokedexInformation;
    }

    /**
     * Moves able to be learned by a Pokemon via different methods.
     */
    export interface IPokemonMovesListing {
        /**
         * Moves a Pokemon may learn by leveling up.
         */
        natural: IPokemonMoveListing[];

        /**
         * Moves a Pokemon may learn by HM.
         */
        hm: IPokemonMoveListing[];

        /**
         * Moves a Pokemon may learn by TM.
         */
        tm: IPokemonMoveListing[];
    }

    /**
     * A description of a move a Pokemon may learn.
     */
    export interface IPokemonMoveListing {
        /**
         * The concatenated title of the move.
         */
        move: string;

        /**
         * What level the move may be learned, if by leveling up.
         */
        level?: number;
    }

    /**
     * A general description of a save file.
     */
    export interface ISaveFile {
        [i: string]: any;
    }

    /**
     * A Map parsed from its raw JSON-friendly description.
     */
    export interface IMap extends MapsCreatr.IMapsCreatrMap {
        /**
         * A listing of areas in the Map, keyed by name.
         */
        areas: {
            [i: string]: IArea;
            [i: number]: IArea;
        };

        /**
         * The default location for the Map.
         */
        locationDefault?: string;

        /**
         * A starting seed to initialize random number generation.
         */
        seed?: number | number[];

        /**
         * What theme to play by default, such as "Pallet Town".
         */
        theme?: string;

        /**
         * The name of the Map, such as "Pallet Town".
         */
        name: string;
    }

    /**
     * An Area parsed from a raw JSON-friendly Map description.
     */
    export interface IArea extends MapsCreatr.IMapsCreatrArea {
        /**
         * Whether the Area allows bicycling.
         */
        allowCycling: boolean;

        /**
         * Any additional attributes that should add extra properties to this Area.
         */
        attributes?: {
            [i: string]: any;
        };

        /**
         * What background to display behind all Things.
         */
        background: string;

        /**
         * In-game boundaries of all placed Things.
         */
        boundaries: IAreaBoundaries;

        /**
         * How tall the area is.
         * @todo It's not clear if this is different from boundaries.height.
         */
        height: number;

        /**
         * The Map this Area is within.
         */
        map: IMap;

        /**
         * Whether this Area has been spawned.
         */
        spawned: boolean;

        /**
         * Which Map spawned this Area and when.
         */
        spawnedBy: IAreaSpawnedBy;

        /**
         * A default theme to override the parent Map's.
         */
        theme?: string;

        /**
         * How wide the area is.
         * @todo It's not clear if this is different from boundaries.width.
         */
        width: number;

        /**
         * Wild Pokemon that may appear in this Area.
         */
        wildPokemon: IAreaWildPokemonOptionGroups;

        /**
         * Whether the Player has encountered a Pokemon in this area's grass.
         */
        pokemonEncountered?: boolean;
    }

    /**
     * A description of how an Area has been stretched by its placed Things.
     */
    export interface IAreaBoundaries {
        /**
         * How wide the Area is.
         */
        width: number;

        /**
         * How tall the Area is.
         */
        height: number;

        /**
         * The top border of the boundaries' bounding box.
         */
        top: number;

        /**
         * The right border of the boundaries' bounding box.
         */
        right: number;

        /**
         * The bottom border of the boundaries' bounding box.
         */
        bottom: number;

        /**
         * The left border of the boundaries' bounding box.
         */
        left: number;
    }

    /**
     * A description of which Map spawned an Area and when.
     */
    export interface IAreaSpawnedBy {
        /**
         * The name of the Map that spawned the Area.
         */
        name: string;

        /**
         * When the spawning occurred.
         */
        timestamp: number;
    }

    /**
     * Types of Pokemon that may appear in an Area, keyed by terrain type, such as "grass".
     */
    export interface IAreaWildPokemonOptionGroups {
        /**
         * Types of Pokemon that may appear in grass.
         */
        grass?: IWildPokemonSchema[];

        fishing?: IFishing;
    }

    /**
     * A description of a type of Pokemon that may appear in an Area.
     */
    export interface IWildPokemonSchema {
        /**
         * The type of Pokemon.
         */
        title: string[];

        /**
         * What level the Pokemon may be, if only one.
         */
        level?: number;

        /**
         * What levels the Pokemon may be, if multiple.
         */
        levels?: number[];

        /**
         * Concatenated names of moves the Pokemon should have.
         */
        moves?: string[];

        /**
         * The rate of appearance for this type of Pokemon, in [0, 1].
         */
        rate?: number;
    }

    /**
     * A Location parsed from a raw JSON-friendly Map description.
     */
    export interface ILocation extends MapsCreatr.IMapsCreatrLocation {
        /**
         * The Area this Location is a part of.
         */
        area: IArea;

        /**
         * A cutscene to immediately start upon entering.
         */
        cutscene?: string;

        /**
         * A direction to immediately face the player towards.
         */
        direction?: Direction;

        /**
         * Whether the player should immediately walk forward.
         */
        push?: boolean;

        /**
         * A cutscene routine to immediately start upon entering.
         */
        routine?: string;

        /**
         * A theme to immediately play upon entering.
         */
        theme?: string;

        /**
         * The x-location in the parent Area.
         */
        xloc?: number;

        /**
         * The y-location in the parent Area.
         */
        yloc?: number;
    }

    /**
     * Information on a move's metadata and effects.
     */
    export interface IMoveSchema {
        /**
         * The type of move, such as "Water".
         */
        type: string;

        /**
         * What type of damage this does, as "Physical", "Special", or "Non-Damaging".
         */
        damage: string;

        /**
         * What type of alternate effect the move does, such as "Status" or "Raise".
         */
        effect?: string;

        /**
         * The power of the move, as a damage Number or "-".
         */
        power: string | number;

        /**
         * The accuracy of the move, as "<number>%" (such as "70%") or "-".
         */
        accuracy: string;

        /**
         * The maximum PP for the move.
         */
        PP: number;

        /**
         * A friendly description of the move's effects.
         */
        description: string;

        /**
         * How much of an alternate effect the move has for changing statistics.
         */
        amount?: number;

        /**
         * Whether the move has a higher chance of being a critical hit.
         */
        criticalRaised?: boolean;

        /**
         * What status to lower, if applicable.
         */
        lower?: string;

        /**
         * What speed priority this move has.
         */
        priority?: number;

        /**
         * What status to raise, if applicable.
         */
        raise?: string;

        /**
         * Which status to give, such as "Sleep", if applicable.
         */
        status?: string;
    }

    /**
     * An HM move or move that interacts with the environment.
     */
    export interface IHMMoveSchema extends IMoveSchema {
        /**
         * Activates a Function to perform an HM move outside of battle.
         */
        partyActivate?: (player: IPlayer, pokemon: IPokemon) => void;

        /**
         * The HMCharacter that the move affects.
         */
        characterName?: string;

        /**
         * The badge needed to use the HM move.
         */
        requiredBadge?: string;
    }

    /**
     * A static description of an in-game item.
     * @todo Refactor this when items are implemented.
     */
    export interface IItemSchema {
        /**
         * A short description of what the item does, such as "Cures Poison".
         */
        effect: string;

        /**
         * What category of items this falls under, such as "Main", "Pokeball", or "Key".
         */
        category: string;

        /**
         * How much the item costs in a store.
         */
        price?: number;

        /**
         * An error message displayed when you try to use an item at a time when you're not allowed.
         */
        error?: string;

        /**
         * A Function to be called when the item is used.
         */
        bagActivate?: Function;
    }

    /**
     * The types of Pokemon that can be caught with different rods.
     */
    export interface IFishing extends IItemSchema {
        /**
         * The Pokemon that can be caught using an Old Rod.
         */
        old?: IWildPokemonSchema[];

        /**
         * The Pokemon that can be caught using a Good Rod.
         */
        good?: IWildPokemonSchema[];

        /**
         * The Pokemon that can be caught using a Super Rod.
         */
        super?: IWildPokemonSchema[];
    }

    /**
     * The type of rod that is being used.
     */
    export interface IRod extends IItemSchema {
        /**
         * The type of rod used. Can be old, good, or super.
         * @todo Make type explicitly "old" | "good" | "super".
         */
        type: string;

        /**
         * The name of the rod used.
         */
        title: string;
    }

    /**
     * A possible move to be chosen, with its probability.
     */
    export interface IMovePossibility {
        /**
         * The concatenated name of the move.
         */
        move: string;

        /**
         * What priority the move has, for the applyMoveEffectPriority equation.
         */
        priority: number;
    }

    /**
     * An in-game Pokeball item.
     */
    export interface IBattleBall extends IItemSchema {
        /**
         * A maximum probability N for the canCatchPokemon equation.
         */
        probabilityMax: number;

        /**
         * A multiplier for the opponent Pokemon's HP in canCatchPokemon.
         */
        rate: number;

        /**
         * The type of ball, such as "Great" or "Master".
         */
        type: string;
    }

    /**
     * A modifier for battle behavior in the opponentMove equation.
     */
    export interface IBattleModification {
        /**
         * What type of opponents this applies to.
         */
        opponentType: string[];

        /**
         * Move type preferences, as the type of change, the target, and optionally
         * a Number amount if relevant.
         */
        preferences: ([string, string, number] | [string, string])[];
    }

    /**
     * In-game state and settings for an ongoing battle.
     */
    export interface IBattleInfo extends BattleMovr.IBattleInfo {
        /**
         * Allowed starting battle animations to choose between.
         */
        animations?: string[];

        /**
         * Whether the battle should advance its menus automatically.
         */
        automaticMenus?: boolean;

        /**
         * A badge to award the player upon victory.
         */
        badge?: string;

        /**
         * How many times the player has attempted to flee.
         */
        currentEscapeAttempts?: number;

        /**
         * A gift to give the player upon victory.
         */
        giftAfterBattle?: string;

        /**
         * How much of the gift to give (by default, 1).
         */
        giftAfterBattleAmount?: number;

        /**
         * Things that should be visible above the starting animation.
         */
        keptThings?: IThing[];

        /**
         * Whether losing skip the player blacking out and respawning elsewhere.
         */
        noBlackout?: boolean;

        /**
         * A callback for after showing the player menu.
         */
        onShowPlayerMenu?: (FSP: FullScreenPokemon) => void;

        /**
         * The opponent, including its actors (Pokemon) and settings.
         */
        opponent?: IBattleThingInfo;

        /**
         * The player, including its actors (Pokemon) and settings.
         */
        player?: IBattleThingInfo;

        /**
         * Text to display after a battle victory when in the real world again.
         */
        textAfterBattle?: MenuGraphr.IMenuDialogRaw;

        /**
         * Text to display upon defeat.
         */
        textDefeat?: MenuGraphr.IMenuDialogRaw;

        /**
         * Text for when the opponent sends out a Pokemon. The opponent's name and the
         * Pokemon's nickname are between the Strings.
         */
        textOpponentSendOut?: [string, string, string];

        /**
         * Text for when the player sends out a Pokemon. The Pokemon's name is between the 
         * Strings.
         */
        textPlayerSendOut?: [string, string];

        /**
         * Text for when the battle starts. The opponent's name is between the Strings.
         */
        textStart?: [string, string];

        /**
         * Text to display upon victory.
         */
        textVictory?: MenuGraphr.IMenuDialogRaw;

        /**
         * An audio theme to play during the battle.
         */
        theme?: string;
    }

    /**
     * A trainer in battle, namely either the player or opponent.
     */
    export interface IBattleThingInfo extends BattleMovr.IBattleThingsInfo {
        /**
         * The trainer's available Pokemon.
         */
        actors: IPokemon[];

        /**
         * Whether this opponent doesn't understand status effects, for the opponentMove equation.
         */
        dumb?: boolean;

        /**
         * The amount of money given for defeating this opponent.
         */
        reward?: number;

        /**
         * The trainer's currently selected Pokemon.
         */
        selectedActor?: IPokemon;
    }

    /**
     * A Pokemon, stored in the player's party and/or as an in-battle actor.
     */
    export interface IPokemon extends BattleMovr.IActor {
        /**
         * How difficult this is to catch, for the canCatchPokemon equation.
         */
        catchRate?: number;

        /**
         * How likely a critical hit is from this Pokemon, for the criticalHit equation.
         */
        criticalHitProbability?: boolean;

        /**
         * Whether the Pokemon was traded from another trainer.
         */
        traded?: boolean;

        /**
         * The level the Pokemon was before enabling the Level 100 mod.
         */
        previousLevel?: number;
    }

    /**
     * A Pokemon's level of experience.
     */
    export interface IExperience {
        /**
         * How much experience the Pokemon currently has.
         */
        current: number;

        /**
         * The amount of experience required for the next level.
         */
        next: number;

        /**
         * How much experience until the next level, as next - current.
         */
        remaining: number;
    }

    /**
     * A description of a simple general text dialog to start.
     */
    export interface IDialog {
        /**
         * An optional cutscene to start after the dialog.
         */
        cutscene?: string;

        /**
         * Options for a yes or no dialog menu with callbacks after the dialog.
         */
        options?: IDialogOptions;

        /**
         * The actual text to display in the dialog.
         */
        words: MenuGraphr.IMenuDialogRaw;
    }

    /**
     * Dialog settings for a yes or no menu after a dialog.
     */
    export interface IDialogOptions {
        /**
         * What to display after the "Yes" option is activated.
         */
        Yes: string | IDialog;

        /**
         * What to display after the "No" option is activated.
         */
        No: string | IDialog;
    }

    /**
     * A position holder around an in-game Thing.
     */
    export interface IPreThing extends MapsCreatr.IPreThing {
        /**
         * A starting direction to face (by default, up).
         */
        direction?: Direction;

        /**
         * The in-game Thing.
         */
        thing: IThing;

        /**
         * The raw x-location from the Area's creation command.
         */
        x: number;

        /**
         * The raw y-location from the Area's creation command.
         */
        y: number;

        /**
         * How wide the Thing should be.
         */
        width?: number;

        /**
         * How tall the Thing should be.
         */
        height: number;
    }

    /**
     * An in-game Thing with size, velocity, position, and other information.
     */
    export interface IThing extends GameStartr.IThing {
        /**
         * The parent IFullScreenPokemon controlling this Thing.
         */
        FSP: FullScreenPokemon;

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
        bordering: IThing[];

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
         * Animation cycles set by the FSP's ITimeHandlr.
         */
        cycles?: TimeHandlr.ITimeCycles;

        /**
         * Whether this has been killed.
         */
        dead?: boolean;

        /**
         * What cardinal direction this is facing.
         */
        direction: Direction;

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
        offsetX?: number;

        /**
         * A vertical visual offset to shift by.
         */
        offsetY?: number;

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
         * The x- or y- position this will finish walking to, if applicable.
         */
        destination: number;

        /**
         * A dialog to start when activating this Character. If dialogDirections is true,
         * it will be interpreted as a separate dialog for each direction of interaction.
         */
        dialog?: MenuGraphr.IMenuDialogRaw | MenuGraphr.IMenuDialogRaw[];

        /**
         * Whether dialog should definitely be treated as an Array of one Dialog each direction.
         */
        dialogDirections?: Direction[];

        /**
         * A single set of dialog (or dialog directions) to play after the primary dialog
         * is complete.
         */
        dialogNext?: MenuGraphr.IMenuDialogRaw | MenuGraphr.IMenuDialogRaw[];

        /**
         * A dialog to place after the primary dialog as a yes or no menu.
         * @todo If the need arises, this could be changed to any type of menu.
         */
        dialogOptions?: IDialog;

        /**
         * A direction to always face after a dialog completes.
         */
        directionPreferred?: Direction;

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
         * The time cycle keeping this behind the Character it's following. 
         */
        followingLoop?: TimeHandlr.ITimeEvent;

        /**
         * An item to give after a dialog is first initiated.
         */
        gift?: string;

        /**
         * A grass Scenery partially covering this while walking through a grass area.
         */
        grass?: IGrass;

        /**
         * How high the grass Scenery should be.
         */
        heightGrass?: number;

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
         * A callback for when this starts a single walking step.
         * 
         * @param character   This character that has started walking.
         * @param direction   The direction the Character is facing.
         */
        onWalkingStart: (character: ICharacter, direction: Direction) => void;

        /**
         * A callback for when this stops a single walking step, commonly to keep walking.
         * 
         * @param character   A Character mid-step.
         * @param onStop   Commands to run as a walking continuation.
         */
        onWalkingStop: (character: ICharacter, onStop: IWalkingOnStop) => void;

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
         * What direction to push the Player back after a dialog, if any.
         */
        pushDirection?: Direction;

        /**
         * Steps for the Player to take after being pushed back.
         */
        pushSteps?: IWalkingOnStop;

        /**
         * Whether this is sporadically
         */
        roaming?: boolean;

        /**
         * Directions this is allowed to roam.
         */
        roamingDirections?: Direction[];

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
         * Whether this intends to walk when its current walking step is complete.
         */
        shouldWalk: boolean;

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
        turning?: Direction;

        /**
         * Whether this is currently walking.
         */
        walking?: boolean;

        /**
         * A queue of walking commands in waiting, used by its follower.
         */
        walkingCommands?: Direction[];

        /**
         * The class cycle for flipping back and forth while walking.
         */
        walkingFlipping?: TimeHandlr.ITimeEvent;
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
        textDefeat?: MenuGraphr.IMenuDialogRaw;

        /**
         * Dialog to display after the battle is over.
         */
        textAfterBattle?: MenuGraphr.IMenuDialogRaw;

        /**
         * Text display upon victory.
         */
        textVictory?: MenuGraphr.IMenuDialogRaw;
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
         * Whether this is allowed to start walking via user input.
         */
        canKeyWalking: boolean;

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

        /**
         * A next direction to turn to after the current walking step.
         */
        nextDirection?: Direction;
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
        dialog?: MenuGraphr.IMenuDialogRaw;

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
         * The name of the Map to retrieve the Area within.
         */
        map: string;

        /**
         * The Area to add into the game.
         */
        area: string;
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
        menuAttributes?: MenuGraphr.IMenuSchema;

        /**
         * What direction to push the activating Player back after a dialog, if any.
         */
        pushDirection?: Direction;

        /**
         * Steps for the activating Player to take after being pushed back.
         */
        pushSteps?: IWalkingOnStop;
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
    export type ITransportSchema = {
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
        dialog?: MenuGraphr.IMenuDialogRaw;

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
     * General attributes for all menus.
     */
    export interface IMenuBase extends MenuGraphr.IMenuBase {
        /**
         * Whether this has the dirty visual background.
         */
        dirty?: boolean;

        /**
         * Whether this has the light visual background.
         */
        light?: boolean;

        /**
         * Whether this has the lined visual background.
         */
        lined?: boolean;

        /**
         * Whether this has the plain white visual background.
         */
        plain?: boolean;

        /**
         * Whether this has the water visual background.
         */
        watery?: boolean;
    }

    /**
     * A schema to specify creating a menu.
     */
    export interface IMenuSchema extends MenuGraphr.IMenuSchema {
        /**
         * Whether the menu should be hidden.
         */
        hidden?: boolean;
    }

    /**
     * A Menu Thing.
     */
    export interface IMenu extends IMenuBase, IThing {
        /**
         * Children Things attached to the Menu.
         */
        children: IThing[];

        /**
         * How tall this is.
         */
        height: number;

        /**
         * Any settings to attach to this Menu.
         */
        settings?: any;

        /**
         * How wide this is.
         */
        width: number;
    }

    /**
     * A ListMenu Thing.
     */
    export interface IListMenu extends IMenu, MenuGraphr.IListMenuBase { }

    /**
     * A Menu to display the results of a KeyboardKeys Menu. A set of "blank" spaces
     * are available, and filled with Text Things as keyboard characters are chosen.
     */
    export interface IKeyboardResultsMenu extends IMenu {
        /**
         * The blinking hypen Thing.
         */
        blinker: IThing;

        /**
         * The complete accumulated values of text characters added, in order.
         */
        completeValue: string[];

        /**
         * The displayed value on the screen.
         */
        displayedValue: string[];

        /**
         * Which blank space is currently available.
         */
        selectedChild: number;
    }

    /**
     * Steps to take after a Character's current walking step. These should be alternating
     * directions and numbers of steps to take; Function commands are allowed as well.
     */
    export type IWalkingOnStop = IWalkingOnStopCommand[];

    /**
     * A single command within an IWalkingOnStop. This can be a number (how many steps to keep
     * taking in the current direction), a String (direction to face), Direction (direction to
     * face), or callback Function to evaluate.
     */
    export type IWalkingOnStopCommand = number | string | Direction | IWalkingOnStopCommandFunction;

    /**
     * A callback to run on a Character mid-step. This may return true to indicate to the
     * managing TimeHandlr to stop the walking cycle.
     * 
     * @param thing   The Character mid-step.
     * @returns Either nothing or whether the walking cycle should stop.
     */
    export interface IWalkingOnStopCommandFunction {
        (thing: ICharacter): void | boolean;
    }

    /**
     * Settings for a color fade animation.
     */
    export interface IColorFadeSettings {
        /**
         * What color to fade to/from (by default, "White").
         */
        color?: string;

        /**
         * How much to change the color's opacity each tick (by default, .33).
         */
        change?: number;

        /**
         * How many game upkeeps are between each tick (by default, 4).
         */
        speed?: number;

        /**
         * A callback for when the animation completes.
         */
        callback?: (FSP: FullScreenPokemon) => void;
    }

    /**
     * Settings to open the LevelUpStats menu for a Pokemon.
     */
    export interface ILevelUpStatsMenuSettings {
        /**
         * The Pokemon to display the statistics for.
         */
        pokemon: IPokemon;

        /**
         * A menu container for LevelUpStats.
         */
        container?: string;

        /**
         * A callback for when the menu is deleted.
         */
        onMenuDelete?: (FSP: FullScreenPokemon) => void;

        /**
         * How to position the menu within its container.
         */
        position?: MenuGraphr.IMenuSchemaPosition;

        /**
         * How to size the menu.
         */
        size?: MenuGraphr.IMenuSchemaSize;

        /**
         * A horizontal offset for the menu.
         */
        textXOffset?: number;
    }

    /**
     * Settings to open the Items menu.
     * 
     * @todo Refactor this interface's usage to contain IMenuSchema instead of inheritance.
     */
    export interface IItemsMenuSettings extends MenuGraphr.IMenuSchema {
        /**
         * Items to override the player's inventory.
         */
        items?: IItemSchema[];
    }

    /**
     * Settings to open a keyboard menu.
     */
    export interface IKeyboardMenuSettings {
        /**
         * A callback to replace key presses.
         */
        callback?: (...args: any[]) => void;

        /**
         * An initial complete value for the result (by default, []).
         */
        completeValue?: string[];

        /**
         * Whether the menu should start in lowercase (by default, false).
         */
        lowercase?: boolean;

        /**
         * Which blank space should initially be available (by default, 0).
         */
        selectedChild?: number;

        /**
         * The initial selected index (by default, [0, 0]).
         */
        selectedIndex?: [number, number];

        /**
         * A starting result value (by default, "").
         */
        title?: string;

        /**
         * A starting value to replace the initial underscores.
         */
        value?: string[];
    }

    /**
     * Things used in battle, stored by id.
     */
    export interface IBattleThingsById extends IThingsById {
        /**
         * A container menu for a current battler, if applicable.
         */
        menu: IMenu;

        /**
         * The player's Character.
         */
        player: IPlayer;

        /**
         * The opponent's Character.
         */
        opponent: ICharacter;
    }

    /**
     * A free HTML5 remake of Nintendo's original Pokemon, expanded for the modern web. 
     */
    export interface IFullScreenPokemon extends GameStartr.IGameStartr {
        /**
         * Overriden MapScreenr refers to the IMapScreenr defined in FullScreenPokemon.d.ts.
         */
        MapScreener: IMapScreenr;

        /**
         * Stored settings to be stored separately and kept within a GameStartr.
         */
        settings: IFullScreenPokemonStoredSettings;

        /**
         * The game's player, which (when defined) will always be a Player Thing.
         */
        player: IPlayer;
    }
}
