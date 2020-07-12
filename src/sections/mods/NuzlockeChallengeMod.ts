import { ICallbackRegister, IMod } from "modattachr";

import { /* IBattleInfo, */ IPokemon } from "../../sections/Battles";
// import { IItemSchema } from "../../sections/constants/Items";
// import { IArea, IMap } from "../../sections/Maps";
// import { IGrass, } from "../../sections/Things";
import { ModComponent } from "./ModComponent";

/**
 * Mod to change gameplay to match the Nuzlocke Challenge.
 */
export class NuzlockeChallengeMod extends ModComponent implements IMod {
    /**
     * Name of the mod.
     */
    public static readonly modName: string = "Nuzlocke Challenge";

    /**
     * Mod events, keyed by name.
     */
    public readonly events: ICallbackRegister = {
        [this.eventNames.onBattleComplete]: (settings: any /* IBattleInfo */): void => {
            console.log("Should react to battleComplete", settings);
            // const grass: IGrass | undefined = this.game.players[0].grass;
            // if (!grass) {
            //     return;
            // }

            // const grassMap: IMap | undefined = this.game.areaSpawner.getMap(grass.mapName) as IMap;
            // const grassArea: IArea | undefined = grassMap ? grassMap.areas[grass.areaName] as IArea : undefined;
            // const opponent: String = settings.battlers.opponent.category;

            // if (!grassArea || opponent !== "Wild") {
            //     return;
            // }

            // grassArea.pokemonEncountered = true;
        },
        [this.eventNames.onOpenItemsMenu]: (items: any[]): void => {
            console.log("Should react to items menu", items);
            // const grassMap: IMap | undefined = (
            //     this.game.players[0].grass
            //     && this.game.areaSpawner.getMap(this.game.players[0].grass!.mapName) as IMap);
            // const grassArea: IArea | undefined = grassMap && grassMap.areas[this.game.players[0].grass!.areaName] as IArea;

            // if (!this.game.battleMover.getInBattle() || !(grassArea && grassArea.pokemonEncountered)) {
            //     return;
            // }

            // for (let i: number = items.length - 1; i > -1; i -= 1) {
            //     const currentItem: IItemSchema = this.game.constants.items.byName[items[i].item];

            //     if (currentItem.category === "Pokeball") {
            //         items.splice(i, 1);
            //     }
            // }
        },
        [this.eventNames.onFaint]: (thing: IPokemon, actors: IPokemon[]): void => {
            const partyPokemon: IPokemon[] = this.game.itemsHolder.getItem(
                this.game.storage.names.pokemonInParty
            );
            const pcPokemon: IPokemon[] = this.game.itemsHolder.getItem(
                this.game.storage.names.pokemonInPC
            );

            actors.splice(actors.indexOf(thing), 1);
            partyPokemon.splice(partyPokemon.indexOf(thing), 1);
            pcPokemon.push(thing);
        },
    };
}
