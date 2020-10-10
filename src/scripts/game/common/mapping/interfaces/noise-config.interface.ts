export interface NoiseConfig {
    seed: number;
    scale: number;
    octaves: number;
    persistance: number;
    lacunarity: number;
    offset: Phaser.Math.Vector2;
}
