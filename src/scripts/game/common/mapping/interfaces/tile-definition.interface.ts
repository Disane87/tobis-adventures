import { TileValueRange } from "../tile-value-range";

export interface TileDefinition {
    index: number;
    collision: boolean;
    range: TileValueRange;
}
