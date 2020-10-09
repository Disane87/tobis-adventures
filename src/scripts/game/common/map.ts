import { NoiseGenerator } from "./noise";

export class WorldMap {
  private _scene: Phaser.Scene;
  private _mapHeight: number;
  private _mapWidth: number;
  private _tileSize: number;

  private _mapName: string;
  public tileMap: Phaser.Tilemaps.Tilemap;
  public layer: Phaser.Tilemaps.StaticTilemapLayer;

  private _noiseConfig: NoiseConfig = {
    seed: 0,
    scale: 1,
    octaves: 5,
    persistance: 2,
    lacunarity: 2,
    offset: new Phaser.Math.Vector2(5, 5)
  };

  private _noiseData: Array<Array<number>>;

  constructor(
    scene: Phaser.Scene,
    mapWidth: number,
    mapHeight: number,
    tileSize: number,
    seed: number,
    mapName: string = "main"
  ) {
    this._scene = scene;
    this._mapWidth = mapWidth;
    this._mapHeight = mapHeight;
    this._tileSize = tileSize;
    this._mapName = mapName;

    this._noiseData = this.generateNoise();

    this.tileMap = this.generateTilemap(this._noiseData);
  }

  private generateNoise(): Array<Array<number>> {
    return NoiseGenerator.generateNoiseMap(
      this._mapWidth,
      this._mapHeight,
      this._noiseConfig.seed,
      this._noiseConfig.scale,
      this._noiseConfig.octaves,
      this._noiseConfig.persistance,
      this._noiseConfig.lacunarity,
      this._noiseConfig.offset
    );
  }

  private generateTilemap(noise: Array<Array<number>>): Phaser.Tilemaps.Tilemap {
    const tileMapConfig: Phaser.Types.Tilemaps.TilemapConfig = {
      data: this.transformNoiseToTileIndex(noise),
      width: this._mapWidth,
      height: this._mapHeight,
      tileHeight: this._tileSize,
      tileWidth: this._tileSize,
      key: this._mapName
    };

    const tileMap = this._scene.make.tilemap(tileMapConfig);
    this.layer = tileMap.createStaticLayer(0,tileMap.addTilesetImage("ground", "ground"));
    this.layer.setCollision(TileMapping.getCollisionTiles());

    this._scene.physics.world.setBounds(0, 0, this._mapWidth * this._tileSize, this._mapHeight * this._tileSize);

    this.drawDebug(tileMap);

    return tileMap;
  }

  private drawDebug(tileMap: Phaser.Tilemaps.Tilemap) {
    const debugGraphics = this._scene.add.graphics();

    // tileMap.renderDebug(debugGraphics, {
    //   tileColor: null,//new Phaser.Display.Color(0, 0, 255, 128), // Non-colliding tiles
    //   collidingTileColor: new Phaser.Display.Color(211, 36, 255, 128), // Colliding tiles
    //   faceColor: new Phaser.Display.Color(211, 36, 255, 255) // Colliding face edges
    // });

    // tileMap.forEachTile(tile => {
    //  this._scene.add.text(tile.x, tile.y, tile.index.toString(), { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',  })
    // })
  }

  private transformNoiseToTileIndex(noise: Array<Array<number>>): Array<Array<number>> {
    const tileMapData: Array<Array<number>> = noise.map(x => {
      return x.map(y => {
        return this.mapNoiseValueToTile(y);
      });
    });

    return tileMapData;
  }

  private mapNoiseValueToTile(value: number): number {
    if (value <= 0.3) {
      return TileMapping.getIndex("WATER");
    } else if (value > 0.3 && value < 0.4) {
      return TileMapping.getIndex("SAND");
    } else if (value >= 0.4) {
      return TileMapping.getIndex("GRASS");
    }
  }

  public setCollision(object: Phaser.GameObjects.GameObject | Phaser.GameObjects.GameObject[] | Phaser.GameObjects.Group | Phaser.GameObjects.Group[]){
    this._scene.physics.add.collider(object, this.layer);
  }

  public getRandomNonColliderVector(): [number, number] {
    const nonCollidableTiles = this.tileMap.filterTiles(tile => !tile.canCollide);
    const randomTile = nonCollidableTiles[Math.floor(Math.random() * nonCollidableTiles.length)]
    return [randomTile.x * this._tileSize, randomTile.y * this._tileSize]
  }
}

export interface NoiseConfig {
  seed: number;
  scale: number;
  octaves: number;
  persistance: number;
  lacunarity: number;
  offset: Phaser.Math.Vector2;
}

export interface MapConfig extends MapDimensions {
  tileSize: number;
}

export interface MapDimensions {
  width: number;
  height: number;
}

export interface TileDefinition {
  index: number;
  collision: boolean;
}

export interface MapTiles {
  WATER;
  SAND;
  GRASS;
}

abstract class TileMapping {
  private static tiles = new Map<keyof MapTiles, TileDefinition>([
    ["WATER", { index: 109, collision: true }],
    ["SAND", { index: 20, collision: false }],
    ["GRASS", { index: 1, collision: false }]
  ]);

  static getCollisionTiles(): number[] {
    return Array.from(this.tiles.entries())
      .map(([key, value]) => (value.collision ? value.index : null))
      .filter(Boolean);
  }

  static getIndex(key: keyof MapTiles): number {
    return this.tiles.get(key).index;
  }
}
