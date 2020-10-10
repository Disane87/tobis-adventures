import { inverseLerp } from '@gamestdio/mathf';
import { makeNoise2D } from "open-simplex-noise";
import Prando from 'prando';


export class  NoiseGenerator {
    
    public static generateNoiseMap(mapWidth: number, mapHeight: number, seed: number, scale: number, octaves: number, persistance: number, lacunarity: number, offset: Phaser.Math.Vector2): Array<number[]> {
        let noiseMap: Array<number[]> = Array.from(Array(mapWidth), () => new Array(mapHeight));

        let prng = new Prando(seed);

        let octaveOffsets: Phaser.Math.Vector2[] = new Array(octaves);
        for (let i: number = 0; (i < octaves); i++) {
            let offsetX: number = (prng.next(-100000, 100000) + offset.x);
            let offsetY: number = (prng.next(-100000, 100000) + offset.y);
            octaveOffsets[i] = new Phaser.Math.Vector2(offsetX, offsetY);
        }
        
        if ((scale <= 0)) {
            scale = 0.0001;
        }
        
        let maxNoiseHeight: number = Number.MIN_VALUE;
        let minNoiseHeight: number = Number.MAX_VALUE;

        let halfWidth: number = (mapWidth / 2);
        let halfHeight: number = (mapHeight / 2);

        for (let y: number = 0; (y < mapHeight); y++) {
            for (let x: number = 0; (x < mapWidth); x++) {
                let amplitude: number = 1;
                let frequency: number = 1;
                let noiseHeight: number = 0;
                for (let i: number = 0; (i < octaves); i++) {
                    let sampleX: number = (((x - halfWidth) 
                                / (scale * frequency)) 
                                + octaveOffsets[i].x);
                    let sampleY: number = (((y - halfHeight) 
                                / (scale * frequency)) 
                                + octaveOffsets[i].y);


                    let perlinValue: number = (makeNoise2D(seed)(sampleX, sampleY) * 2) - 1;
                    noiseHeight = (noiseHeight 
                                + (perlinValue * amplitude));
                    amplitude = (amplitude * persistance);
                    frequency = (frequency * lacunarity);
                }
                
                if ((noiseHeight > maxNoiseHeight)) {
                    maxNoiseHeight = noiseHeight;
                }
                else if ((noiseHeight < minNoiseHeight)) {
                    minNoiseHeight = noiseHeight;
                }
                
                noiseMap[x][y] = noiseHeight;
            }
            
        }
        
        for (let y: number = 0; (y < mapHeight); y++) {
            for (let x: number = 0; (x < mapWidth); x++) {
                noiseMap[x][y] = inverseLerp(minNoiseHeight, maxNoiseHeight, noiseMap[x][y]);
            }
            
        }
        
        return noiseMap;
    }
}