import { component } from "babyioc";
import { GeneralComponent } from "gamestartr";

import { FullScreenPokemon } from "../FullScreenPokemon";
import { DaisyTownMapCutscene } from "./cutscenes/DaisyTownMapCutscene";
import { ElderTrainingCutscene } from "./cutscenes/ElderTrainingCutscene";
import { IntroCutscene } from "./cutscenes/IntroCutscene";
import { OakIntroCutscene } from "./cutscenes/OakIntroCutscene";
import { OakIntroPokemonChoiceCutscene } from "./cutscenes/OakIntroPokemonChoiceCutscene";
import { OakIntroRivalBattleCutscene } from "./cutscenes/OakIntroRivalBattleCutscene";
import { OakIntroRivalLeavesCutscene } from "./cutscenes/OakIntroRivalLeavesCutscene";
import { OakParcelDeliveryCutscene } from "./cutscenes/OakParcelDeliveryCutscene";
import { OakParcelPickupCutscene } from "./cutscenes/OakParcelPickupCutscene";
import { PokeCenterCutscene } from "./cutscenes/PokeCenterCutscene";
import { PokeMartCutscene } from "./cutscenes/PokeMartCutscene";
import { RivalRoute22Cutscene } from "./cutscenes/RivalRoute22Cutscene";
import { RivalRoute22LeavesCutscene } from "./cutscenes/RivalRoute22LeavesCutscene";
import { TrainerSpottedCutscene } from "./cutscenes/TrainerSpottedCutscene";

/**
 * ScenePlayr cutscenes, keyed by name.
 */
export class Cutscenes<TGameStartr extends FullScreenPokemon> extends GeneralComponent<TGameStartr> {
    /**
     * DaisyTownMap cutscene routines.
     */
    @component(DaisyTownMapCutscene)
    public readonly daisyTownMap: DaisyTownMapCutscene<TGameStartr>;

    /**
     * ElderTraining cutscene routines.
     */
    @component(ElderTrainingCutscene)
    public readonly elderTraining: ElderTrainingCutscene<TGameStartr>;

    /**
     * Intro cutscene routines.
     */
    @component(IntroCutscene)
    public readonly intro: IntroCutscene<TGameStartr>;

    /**
     * OakIntro cutscene routines.
     */
    @component(OakIntroCutscene)
    public readonly oakIntro: OakIntroCutscene<TGameStartr>;

    /**
     * OakIntroPokemonChoice cutscene routines.
     */
    @component(OakIntroPokemonChoiceCutscene)
    public readonly oakIntroPokemonChoice: OakIntroPokemonChoiceCutscene<TGameStartr>;

    /**
     * OakIntroRivalBattle cutscene routines.
     */
    @component(OakIntroRivalBattleCutscene)
    public readonly oakIntroRivalBattle: OakIntroRivalBattleCutscene<TGameStartr>;

    /**
     * OakIntroRivalLeaves cutscene routines.
     */
    @component(OakIntroRivalLeavesCutscene)
    public readonly oakIntroRivalLeaves: OakIntroRivalLeavesCutscene<TGameStartr>;

    /**
     * OakParcelDelivery cutscene routines.
     */
    @component(OakParcelDeliveryCutscene)
    public readonly oakParcelDelivery: OakParcelDeliveryCutscene<TGameStartr>;

    /**
     * OakParcelPickup cutscene routines.
     */
    @component(OakParcelPickupCutscene)
    public readonly oakParcelPickup: OakParcelPickupCutscene<TGameStartr>;

    /**
     * PokeCenter cutscene routines.
     */
    @component(PokeCenterCutscene)
    public readonly pokeCenter: PokeCenterCutscene<TGameStartr>;

    /**
     * PokeMart cutscene routines.
     */
    @component(PokeMartCutscene)
    public readonly pokeMart: PokeMartCutscene<TGameStartr>;

    /**
     * RivalRoute22 cutscene routines.
     */
    @component(RivalRoute22Cutscene)
    public readonly rivalRoute22: RivalRoute22Cutscene<TGameStartr>;

    /**
     * RivalRoute22Leaves cutscene routines.
     */
    @component(RivalRoute22LeavesCutscene)
    public readonly rivalRoute22Leaves: RivalRoute22LeavesCutscene<TGameStartr>;

    /**
     * TrainerSpotted cutscene routines.
     */
    @component(TrainerSpottedCutscene)
    public readonly trainerSpotted: TrainerSpottedCutscene<TGameStartr>;
}
