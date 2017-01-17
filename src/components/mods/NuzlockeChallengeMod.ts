import { Component } from "eightbittr/lib/Component";
import { ICallbackRegister, IMod } from "modattachr/lib/IModAttachr";

import { /* IBattleInfo, */ IPokemon } from "../../components/Battles";
// import { IItemSchema } from "../../components/constants/Items";
// import { IArea, IMap } from "../../components/Maps";
// import { IGrass, } from "../../components/Things";
import { FullScreenPokemon } from "../../FullScreenPokemon";

/**
 * Mod to change gameplay to match the Nuzlocke Challenge.
 */
export class NuzlockeChallengeMod<TGameStartr extends FullScreenPokemon> extends Component<TGameStartr> implements IMod {
    /**
     * Name of the mod.
     */
    public readonly name: string = "Nuzlocke Challenge";

    /**
     * Mod events, keyed by name.
     */
    public readonly events: ICallbackRegister = {
        onBattleComplete: (settings: any /* IBattleInfo */): void => {
            console.log("Should react to battleComplete", settings);
            // const grass: IGrass | undefined = this.gameStarter.players[0].grass;
            // if (!grass) {
            //     return;
            // }

            // const grassMap: IMap | undefined = this.gameStarter.areaSpawner.getMap(grass.mapName) as IMap;
            // const grassArea: IArea | undefined = grassMap ? grassMap.areas[grass.areaName] as IArea : undefined;
            // const opponent: String = settings.battlers.opponent.category;

            // if (!grassArea || opponent !== "Wild") {
            //     return;
            // }

            // grassArea.pokemonEncountered = true;
        },
        onOpenItemsMenu: (items: any[]): void => {
            console.log("Should react to items menu", items);
            // const grassMap: IMap | undefined = (
            //     this.gameStarter.players[0].grass
            //     && this.gameStarter.areaSpawner.getMap(this.gameStarter.players[0].grass!.mapName) as IMap);
            // const grassArea: IArea | undefined = grassMap && grassMap.areas[this.gameStarter.players[0].grass!.areaName] as IArea;

            // if (!this.gameStarter.battleMover.getInBattle() || !(grassArea && grassArea.pokemonEncountered)) {
            //     return;
            // }

            // for (let i: number = items.length - 1; i > -1; i -= 1) {
            //     const currentItem: IItemSchema = this.gameStarter.constants.items.byName[items[i].item];

            //     if (currentItem.category === "Pokeball") {
            //         items.splice(i, 1);
            //     }
            // }
        },
        onFaint: (thing: IPokemon, actors: IPokemon[]): void => {
            const partyPokemon: IPokemon[] = this.gameStarter.itemsHolder.getItem("PokemonInParty");
            const pcPokemon: IPokemon[] = this.gameStarter.itemsHolder.getItem("PokemonInPC");

            actors.splice(actors.indexOf(thing), 1);
            partyPokemon.splice(partyPokemon.indexOf(thing), 1);
            pcPokemon.push(thing);
        }
    };
}
