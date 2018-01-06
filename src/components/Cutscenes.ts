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
 * Cutscene functions used by FullScreenPokemon instances.
 */
export class Cutscenes<TGameStartr extends FullScreenPokemon> extends GeneralComponent<TGameStartr> {
    /**
     * DaisyTownMap cutscene functions used by this FullScreenPokemon instance.
     */
    @component(DaisyTownMapCutscene)
    public readonly daisyTownMap: DaisyTownMapCutscene<TGameStartr>;

    /**
     * ElderTraining cutscene functions used by this FullScreenPokemon instance.
     */
    @component(ElderTrainingCutscene)
    public readonly elderTraining: ElderTrainingCutscene<TGameStartr>;

    /**
     * Intro cutscene functions used by this FullScreenPokemon instance.
     */
    @component(IntroCutscene)
    public readonly intro: IntroCutscene<TGameStartr>;

    /**
     * OakIntro cutscene functions used by this FullScreenPokemon instance.
     */
    @component(OakIntroCutscene)
    public readonly oakIntro: OakIntroCutscene<TGameStartr>;

    /**
     * OakIntroPokemonChoice cutscene functions used by this FullScreenPokemon instance.
     */
    @component(OakIntroPokemonChoiceCutscene)
    public readonly oakIntroPokemonChoice: OakIntroPokemonChoiceCutscene<TGameStartr>;

    /**
     * OakIntroRivalBattle cutscene functions used by this FullScreenPokemon instance.
     */
    @component(OakIntroRivalBattleCutscene)
    public readonly oakIntroRivalBattle: OakIntroRivalBattleCutscene<TGameStartr>;

    /**
     * OakIntroRivalLeaves cutscene functions used by this FullScreenPokemon instance.
     */
    @component(OakIntroRivalLeavesCutscene)
    public readonly oakIntroRivalLeaves: OakIntroRivalLeavesCutscene<TGameStartr>;

    /**
     * OakParcelDelivery cutscene functions used by this FullScreenPokemon instance.
     */
    @component(OakParcelDeliveryCutscene)
    public readonly oakParcelDelivery: OakParcelDeliveryCutscene<TGameStartr>;

    /**
     * OakParcelPickup cutscene functions used by this FullScreenPokemon instance.
     */
    @component(OakParcelPickupCutscene)
    public readonly oakParcelPickup: OakParcelPickupCutscene<TGameStartr>;

    /**
     * PokeCenter cutscene functions used by this FullScreenPokemon instance.
     */
    @component(PokeCenterCutscene)
    public readonly pokeCenter: PokeCenterCutscene<TGameStartr>;

    /**
     * PokeMart cutscene functions used by this FullScreenPokemon instance.
     */
    @component(PokeMartCutscene)
    public readonly pokeMart: PokeMartCutscene<TGameStartr>;

    /**
     * RivalRoute22 cutscene functions used by this FullScreenPokemon instance.
     */
    @component(RivalRoute22Cutscene)
    public readonly rivalRoute22: RivalRoute22Cutscene<TGameStartr>;

    /**
     * RivalRoute22Leaves cutscene functions used by this FullScreenPokemon instance.
     */
    @component(RivalRoute22LeavesCutscene)
    public readonly rivalRoute22Leaves: RivalRoute22LeavesCutscene<TGameStartr>;

    /**
     * TrainerSpotted cutscene functions used by this FullScreenPokemon instance.
     */
    @component(TrainerSpottedCutscene)
    public readonly trainerSpotted: TrainerSpottedCutscene<TGameStartr>;
}
