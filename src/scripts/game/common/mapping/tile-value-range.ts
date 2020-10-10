import { inRange } from "lodash";

export class TileValueRange {
    min?: number;
    max?: number;

    constructor(min: number, max?: number) {
        this.min = !min ? 0 : min;
        this.max = !max ? 1 : max;
    }

    public valueBetweenRange(value: number) {
        return inRange(value, this.min, this.max);
    }
}

