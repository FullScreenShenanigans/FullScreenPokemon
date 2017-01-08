import { Component } from "eightbittr/lib/Component";

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
import { TrainerSpottedCutscene } from "./cutscenes/TrainerSpottedCutscene";

/**
 * Cutscene functions used by FullScreenPokemon instances.
 */
export class Cutscenes<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> {
    /**
     * DaisyTownMap cutscene functions used by this FullScreenPokemon instance.
     */
    public readonly daisyTownMap: DaisyTownMapCutscene<TGameStartr> = new DaisyTownMapCutscene(this.gameStarter);

    /**
     * ElderTraining cutscene functions used by this FullScreenPokemon instance.
     */
    public readonly elderTraining: ElderTrainingCutscene<TGameStartr> = new ElderTrainingCutscene(this.gameStarter);

    /**
     * Intro cutscene functions used by this FullScreenPokemon instance.
     */
    public readonly intro: IntroCutscene<TGameStartr> = new IntroCutscene(this.gameStarter);

    /**
     * OakIntro cutscene functions used by this FullScreenPokemon instance.
     */
    public readonly oakIntro: OakIntroCutscene<TGameStartr> = new OakIntroCutscene(this.gameStarter);

    /**
     * OakIntroPokemonChoice cutscene functions used by this FullScreenPokemon instance.
     */
    public readonly oakIntroPokemonChoice: OakIntroPokemonChoiceCutscene<TGameStartr> = new OakIntroPokemonChoiceCutscene(this.gameStarter);

    /**
     * OakIntroRivalBattle cutscene functions used by this FullScreenPokemon instance.
     */
    public readonly oakIntroRivalBattle: OakIntroRivalBattleCutscene<TGameStartr> = new OakIntroRivalBattleCutscene(this.gameStarter);

    /**
     * OakIntroRivalLeaves cutscene functions used by this FullScreenPokemon instance.
     */
    public readonly oakIntroRivalLeaves: OakIntroRivalLeavesCutscene<TGameStartr> = new OakIntroRivalLeavesCutscene(this.gameStarter);

    /**
     * OakParcelDelivery cutscene functions used by this FullScreenPokemon instance.
     */
    public readonly oakParcelDelivery: OakParcelDeliveryCutscene<TGameStartr> = new OakParcelDeliveryCutscene(this.gameStarter);

    /**
     * OakParcelPickup cutscene functions used by this FullScreenPokemon instance.
     */
    public readonly oakParcelPickup: OakParcelPickupCutscene<TGameStartr> = new OakParcelPickupCutscene(this.gameStarter);

    /**
     * PokeCenter cutscene functions used by this FullScreenPokemon instance.
     */
    public readonly pokeCenter: PokeCenterCutscene<TGameStartr> = new PokeCenterCutscene(this.gameStarter);

    /**
     * PokeMart cutscene functions used by this FullScreenPokemon instance.
     */
    public readonly pokeMart: PokeMartCutscene<TGameStartr> = new PokeMartCutscene(this.gameStarter);

    /**
     * RivalRoute22 cutscene functions used by this FullScreenPokemon instance.
     */
    public readonly rivalRoute22: RivalRoute22Cutscene<TGameStartr> = new RivalRoute22Cutscene(this.gameStarter);

    /**
     * TrainerSpotted cutscene functions used by this FullScreenPokemon instance.
     */
    public readonly trainerSpotted: TrainerSpottedCutscene<TGameStartr> = new TrainerSpottedCutscene(this.gameStarter);
}
