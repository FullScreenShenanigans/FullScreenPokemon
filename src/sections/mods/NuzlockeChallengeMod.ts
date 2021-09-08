import { CallbackRegister, Mod } from "modattachr";

import { /* BattleInfo, */ Pokemon } from "../../sections/Battles";
// import {ItemSchema } from "../../sections/constants/Items";
// import {Area, Map } from "../../sections/Maps";
// import {Grass, } from "../../sections/Actors";
import { ModComponent } from "./ModComponent";

/**
 * Mod to change gameplay to match the Nuzlocke Challenge.
 */
export class NuzlockeChallengeMod extends ModComponent implements Mod {
    /**
     * Name of the mod.
     */
    public static readonly modName: string = "Nuzlocke Challenge";

    /**
     * Mod events, keyed by name.
     */
    public readonly events: CallbackRegister = {
        [this.eventNames.onBattleComplete]: (settings: any /* BattleInfo */): void => {
            console.log("Should react to battleComplete", settings);
            // const grass: Grass | undefined = this.game.players[0].grass;
            // if (!grass) {
            //     return;
            // }

            // const grassMap: Map | undefined = this.game.areaSpawner.getMap(grass.mapName) as Map;
            // const grassArea: Area | undefined = grassMap ? grassMap.areas[grass.areaName] as Area : undefined;
            // const opponent: String = settings.battlers.opponent.category;

            // if (!grassArea || opponent !== "Wild") {
            //     return;
            // }

            // grassArea.pokemonEncountered = true;
        },
        [this.eventNames.onOpenItemsMenu]: (items: any[]): void => {
            console.log("Should react to items menu", items);
            // const grassMap: Map | undefined = (
            //     this.game.players[0].grass
            //     && this.game.areaSpawner.getMap(this.game.players[0].grass!.mapName) as Map);
            // const grassArea: Area | undefined = grassMap && grassMap.areas[this.game.players[0].grass!.areaName] as Area;

            // if (!this.game.battleMover.getInBattle() || !(grassArea && grassArea.pokemonEncountered)) {
            //     return;
            // }

            // for (let i: number = items.length - 1; i > -1; i -= 1) {
            //     const currentItem: ItemSchema = this.game.constants.items.byName[items[i].item];

            //     if (currentItem.category === "Pokeball") {
            //         items.splice(i, 1);
            //     }
            // }
        },
        [this.eventNames.onFaint]: (actor: Pokemon, actors: Pokemon[]): void => {
            const partyPokemon: Pokemon[] = this.game.itemsHolder.getItem(
                this.game.storage.names.pokemonInParty
            );
            const pcPokemon: Pokemon[] = this.game.itemsHolder.getItem(
                this.game.storage.names.pokemonInPC
            );

            actors.splice(actors.indexOf(actor), 1);
            partyPokemon.splice(partyPokemon.indexOf(actor), 1);
            pcPokemon.push(actor);
        },
    };
}
