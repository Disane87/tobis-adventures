import { MapDimensions } from "./map-dimensions.interface";


export interface MapConfig extends MapDimensions {
    tileSize: number;
}
