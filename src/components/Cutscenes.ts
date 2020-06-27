import { member } from "babyioc";
import { Section } from "eightbittr";

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
export class Cutscenes extends Section<FullScreenPokemon> {
    /**
     * Computer cutscene routines.
     */
    @member(ComputerCutscene)
    public readonly computer: ComputerCutscene;

    /**
     * DaisyTownMap cutscene routines.
     */
    @member(DaisyTownMapCutscene)
    public readonly daisyTownMap: DaisyTownMapCutscene;

    /**
     * ElderTraining cutscene routines.
     */
    @member(ElderTrainingCutscene)
    public readonly elderTraining: ElderTrainingCutscene;

    /**
     * Intro cutscene routines.
     */
    @member(IntroCutscene)
    public readonly intro: IntroCutscene;

    /**
     * OakIntro cutscene routines.
     */
    @member(OakIntroCutscene)
    public readonly oakIntro: OakIntroCutscene;

    /**
     * OakIntroPokemonChoice cutscene routines.
     */
    @member(OakIntroPokemonChoiceCutscene)
    public readonly oakIntroPokemonChoice: OakIntroPokemonChoiceCutscene;

    /**
     * OakIntroRivalBattle cutscene routines.
     */
    @member(OakIntroRivalBattleCutscene)
    public readonly oakIntroRivalBattle: OakIntroRivalBattleCutscene;

    /**
     * OakIntroRivalLeaves cutscene routines.
     */
    @member(OakIntroRivalLeavesCutscene)
    public readonly oakIntroRivalLeaves: OakIntroRivalLeavesCutscene;

    /**
     * OakParcelDelivery cutscene routines.
     */
    @member(OakParcelDeliveryCutscene)
    public readonly oakParcelDelivery: OakParcelDeliveryCutscene;

    /**
     * OakParcelPickup cutscene routines.
     */
    @member(OakParcelPickupCutscene)
    public readonly oakParcelPickup: OakParcelPickupCutscene;

    /**
     * PokeCenter cutscene routines.
     */
    @member(PokeCenterCutscene)
    public readonly pokeCenter: PokeCenterCutscene;

    /**
     * PokeMart cutscene routines.
     */
    @member(PokeMartCutscene)
    public readonly pokeMart: PokeMartCutscene;

    /**
     * RivalRoute22 cutscene routines.
     */
    @member(RivalRoute22Cutscene)
    public readonly rivalRoute22: RivalRoute22Cutscene;

    /**
     * RivalRoute22Leaves cutscene routines.
     */
    @member(RivalRoute22LeavesCutscene)
    public readonly rivalRoute22Leaves: RivalRoute22LeavesCutscene;

    /**
     * TrainerSpotted cutscene routines.
     */
    @member(TrainerSpottedCutscene)
    public readonly trainerSpotted: TrainerSpottedCutscene;
}
