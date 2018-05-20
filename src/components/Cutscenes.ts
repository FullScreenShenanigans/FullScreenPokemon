import { component } from "babyioc";
import { GeneralComponent } from "eightbittr";

import { FullScreenPokemon } from "../FullScreenPokemon";
import { ComputerCutscene } from "./cutscenes/ComputerCutscene";
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
export class Cutscenes<TEightBittr extends FullScreenPokemon> extends GeneralComponent<TEightBittr> {
    /**
     * Computer cutscene routines.
     */
    @component(ComputerCutscene)
    public readonly computer: ComputerCutscene<TEightBittr>;

    /**
     * DaisyTownMap cutscene routines.
     */
    @component(DaisyTownMapCutscene)
    public readonly daisyTownMap: DaisyTownMapCutscene<TEightBittr>;

    /**
     * ElderTraining cutscene routines.
     */
    @component(ElderTrainingCutscene)
    public readonly elderTraining: ElderTrainingCutscene<TEightBittr>;

    /**
     * Intro cutscene routines.
     */
    @component(IntroCutscene)
    public readonly intro: IntroCutscene<TEightBittr>;

    /**
     * OakIntro cutscene routines.
     */
    @component(OakIntroCutscene)
    public readonly oakIntro: OakIntroCutscene<TEightBittr>;

    /**
     * OakIntroPokemonChoice cutscene routines.
     */
    @component(OakIntroPokemonChoiceCutscene)
    public readonly oakIntroPokemonChoice: OakIntroPokemonChoiceCutscene<TEightBittr>;

    /**
     * OakIntroRivalBattle cutscene routines.
     */
    @component(OakIntroRivalBattleCutscene)
    public readonly oakIntroRivalBattle: OakIntroRivalBattleCutscene<TEightBittr>;

    /**
     * OakIntroRivalLeaves cutscene routines.
     */
    @component(OakIntroRivalLeavesCutscene)
    public readonly oakIntroRivalLeaves: OakIntroRivalLeavesCutscene<TEightBittr>;

    /**
     * OakParcelDelivery cutscene routines.
     */
    @component(OakParcelDeliveryCutscene)
    public readonly oakParcelDelivery: OakParcelDeliveryCutscene<TEightBittr>;

    /**
     * OakParcelPickup cutscene routines.
     */
    @component(OakParcelPickupCutscene)
    public readonly oakParcelPickup: OakParcelPickupCutscene<TEightBittr>;

    /**
     * PokeCenter cutscene routines.
     */
    @component(PokeCenterCutscene)
    public readonly pokeCenter: PokeCenterCutscene<TEightBittr>;

    /**
     * PokeMart cutscene routines.
     */
    @component(PokeMartCutscene)
    public readonly pokeMart: PokeMartCutscene<TEightBittr>;

    /**
     * RivalRoute22 cutscene routines.
     */
    @component(RivalRoute22Cutscene)
    public readonly rivalRoute22: RivalRoute22Cutscene<TEightBittr>;

    /**
     * RivalRoute22Leaves cutscene routines.
     */
    @component(RivalRoute22LeavesCutscene)
    public readonly rivalRoute22Leaves: RivalRoute22LeavesCutscene<TEightBittr>;

    /**
     * TrainerSpotted cutscene routines.
     */
    @component(TrainerSpottedCutscene)
    public readonly trainerSpotted: TrainerSpottedCutscene<TEightBittr>;
}
