import { MapTiles } from "./interfaces/map-tiles.interface";
import { TileDefinition } from "./interfaces/tile-definition.interface";
import { TileValueRange } from "./tile-value-range";

export abstract class TileMapping {
    private static tiles = new Map<keyof MapTiles, TileDefinition>([
        ["WATER", { index: 16, collision: true, range: new TileValueRange(null, 0.3) }],
        ["SAND", { index: 4, collision: false, range: new TileValueRange(0.3, 0.4) }],
        ["GRASS", { index: 3, collision: false, range: new TileValueRange(0.4, 0.6) }],
        ["DIRT", { index: 33, collision: false, range: new TileValueRange(0.6) }]
    ]);

    static getCollisionTiles(): number[] {
        return Array.from(this.tiles.entries())
            .map(([, value]) => (value.collision ? value.index : null))
            .filter(val => val != null);
    }

    static getTileForValue(rangeValue: number) {
        const [, tileValue] = Array.from(this.tiles.entries())
            .find(([, value]) => value.range.valueBetweenRange(rangeValue)) || [, { index: 0 }];

        // console.log("test", tileKey, tileValue);
        return tileValue.index;
    }

    static getIndex(key: keyof MapTiles): number {
        return this.tiles.get(key).index;
    }
}
