import { EventNames as ModAttachrEventNames } from "modattachr/lib/EventNames";

/**
 * Keys for mod events.
 */
export class EventNames extends ModAttachrEventNames {
    /*
     * Key for the event when a player is added.
     */
    public readonly onAddPlayer = "onAddPlayer";

    /*
     * Key for the event when a PreThing is added.
     */
    public readonly onAddPreThing = "onAddPreThing";

    /*
     * Key for the event when a battle finishes.
     */
    public readonly onBattleComplete = "onBattleComplete";

    /*
     * Key for the event when a battle starts.
     */
    public readonly onBattleStart = "onBattleStart";

    /*
     * Key for the event when a dialog ends.
     */
    public readonly onDialogFinish = "onDialogFinish";

    /*
     * Key for the event when a Pokemon faints.
     */
    public readonly onFaint = "onFaint";

    /**
     * Key for the event when the game starts.
     */
    public readonly onGameStart = "onGameStart";

    /**
     * Key for the event when gameplay starts.
     */
    public readonly onGameStartIntro = "onGameStartIntro";

    /**
     * Key for the event when the game introduction starts.
     */
    public readonly onGameStartPlay = "onGameStartPlay";

    /**
     * Key for the event when the introduction starts to fade in.
     */
    public readonly onIntroFadeIn = "onIntroFadeIn";

    /**
     * Key for the event when the A key is pressed.
     */
    public readonly onKeyDownA = "onKeyDownA";

    /**
     * Key for the event when the A key is pressed.
     */
    public readonly onKeyDownB = "onKeyDownB";

    /**
     * Key for the event when any direction key is pressed.
     */
    public readonly onKeyDownDirectionReal = "onKeyDownDirectionReal";

    /**
     * Key for the event when the down key is pressed.
     */
    public readonly onKeyDownDown = "onKeyDownDown";

    /**
     * Key for the event when the left key is pressed.
     */
    public readonly onKeyDownLeft = "onKeyDownLeft";

    /**
     * Key for the event when the mute key is pressed.
     */
    public readonly onKeyDownMute = "onKeyDownMute";

    /**
     * Key for the event when the pause key is pressed.
     */
    public readonly onKeyDownPause = "onKeyDownPause";

    /**
     * Key for the event when the right key is pressed.
     */
    public readonly onKeyDownRight = "onKeyDownRight";

    /**
     * Key for the event when the select key is pressed.
     */
    public readonly onKeyDownSelect = "onKeyDownSelect";

    /**
     * Key for the event when the up key is pressed.
     */
    public readonly onKeyDownUp = "onKeyDownUp";

    /**
     * Key for the event when the A key is released.
     */
    public readonly onKeyUpA = "onKeyUpA";

    /**
     * Key for the event when the A key is released.
     */
    public readonly onKeyUpB = "onKeyUpB";

    /**
     * Key for the event when the up key is released.
     */
    public readonly onKeyUpDown = "onKeyUpDown";

    /**
     * Key for the event when the mute key is released.
     */
    public readonly onKeyUpMute = "onKeyUpMute";

    /**
     * Key for the event when the pause key is released.
     */
    public readonly onKeyUpPause = "onKeyUpPause";

    /**
     * Key for the event when the left key is released.
     */
    public readonly onKeyUpLeft = "onKeyUpLeft";

    /**
     * Key for the event when the right key is released.
     */
    public readonly onKeyUpRight = "onKeyUpRight";

    /**
     * Key for the event when the up key is released.
     */
    public readonly onKeyUpUp = "onKeyUpUp";

    /**
     * Key for the event when a Thing is deleted.
     */
    public readonly onKillNormal = "onKillNormal";

    /**
     * Key for the event when the right mouse button is pressed.
     */
    public readonly onMouseDownRight = "onMouseDownRight";

    /*
     * Key for the event when the items menu is opened.
     */
    public readonly onOpenItemsMenu = "onOpenItemsMenu";

    /*
     * Key for the event when an item's menu is opened.
     */
    public readonly onOpenItemMenu = "onOpenItemMenu";

    /**
     * Key for the event when a Pokemon is being created.
     */
    public readonly onNewPokemonCreation = "onNewPokemonCreation";

    /**
     * Key for the event before a map's location is set.
     */
    public readonly onPreSetLocation = "onPreSetLocation";

    /**
     * Key for the event before a map's seed is reset.
     */
    public readonly onPreSetMap = "onPreSetMap";

    /*
     * Key for the event when the location is changed.
     */
    public readonly onSetLocation = "onSetLocation";

    /**
     * Key for the event before the map is changed.
     */
    public readonly onSetMap = "onSetMap";

    /**
     * Key for the event when a wild grass Pokemon is chosen.
     */
    public readonly onWildGrassPokemonChosen = "onWildGrassPokemonChosen";
}
