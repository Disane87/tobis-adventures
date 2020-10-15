import { NoiseGenerator } from "./noise";
import { NoiseConfig } from "./interfaces/noise-config.interface";
import { TileMapping } from "./tilemapping";
import { SCENE_CONFIG } from "../../scenes/main";

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
      key: this._mapName,
    } as Phaser.Types.Tilemaps.TilemapConfig;

    const tileMap = this._scene.make.tilemap(tileMapConfig);
    this.layer = tileMap.createStaticLayer(0, tileMap.addTilesetImage("ground", "ground", this._tileSize, this._tileSize, 1, 2));
    this.layer.setCollision(TileMapping.getCollisionTiles());
    this._scene.physics.world.setBounds(0, 0, this._mapWidth * this._tileSize, this._mapHeight * this._tileSize);

    if (SCENE_CONFIG.physics.arcade.debug) {
      this.drawDebug(tileMap);
    }

    const edgeTiles = this.calculateEdgeTiles(tileMap);


    return tileMap;
  }

  private calculateEdgeTiles(tileMap: Phaser.Tilemaps.Tilemap) {
    const tileMapData = tileMap.layers[0].data;
    const borderPositions = []

    tileMapData.forEach((row, rowIndex) => {
      row.forEach((tile, columnIndex) => {
        if (tile.index == TileMapping.getIndex("WATER")) {
          // if (1 == 0) {
          const nb = this.getAllNeigborsRowsAndColumns(tile, rowIndex, columnIndex, tileMapData);
          let borderIndex = null;
          const tileIndex = tile.index;


          // console.log(nb);

          // if (nb.ne) borderIndex = tileIndex + 2
          // if (nb.se) borderIndex = tileIndex + 2 + 10 + 10
          // if (nb.nw) borderIndex = tileIndex
          // if (nb.sw) borderIndex = tileIndex + 10 + 10
          // if (nb.s) borderIndex = tileIndex + 1 + 10 + 10
          // if (nb.n) borderIndex = tileIndex + 1
          // if (nb.w) borderIndex = tileIndex + 10
          // if (nb.e) borderIndex = tileIndex - 1
          // if (nb.w && nb.n) borderIndex = 8
          // if (nb.s && nb.e) borderIndex = 9
          // if (nb.n && nb.e) borderIndex = 10
          // if (nb.s && nb.w) borderIndex = 11

          if (typeof borderIndex === 'number') {
            borderPositions.push({ row: rowIndex, column: columnIndex, fill: borderIndex, current: tile.index })
          }
          // }

        }

      })
    })
    console.log(borderPositions);
    borderPositions.forEach(({ row, column, fill }) => {
      // console.log("Replacing index", tileMapData[row][column].index, "with", fill)
      tileMapData[row][column].index = fill
    })
  }

  getAllNeigborsRowsAndColumns(currentTile: Phaser.Tilemaps.Tile, row: number, column: number, areaData: Phaser.Tilemaps.Tile[][]) {
    debugger;
    const rowsAndColumns = {
      n: areaData[row - 1] && areaData[row - 1][column],
      s: areaData[row + 1] && areaData[row + 1][column],
      w: areaData[row] && areaData[row][column - 1],
      e: areaData[row] && areaData[row][column + 1],
      nw: areaData[row - 1] && areaData[row - 1][column - 1],
      ne: areaData[row - 1] && areaData[row - 1][column + 1],
      se: areaData[row + 1] && areaData[row + 1][column + 1],
      sw: areaData[row + 1] && areaData[row + 1][column - 1]
    }
    return rowsAndColumns
  }

  private drawDebug(tileMap: Phaser.Tilemaps.Tilemap) {
    const debugGraphics = this._scene.add.graphics();

    tileMap.renderDebug(debugGraphics, {
      tileColor: null,//new Phaser.Display.Color(0, 0, 255, 128), // Non-colliding tiles
      collidingTileColor: new Phaser.Display.Color(211, 36, 255, 128), // Colliding tiles
      faceColor: new Phaser.Display.Color(211, 36, 255, 255) // Colliding face edges
    });

    // tileMap.forEachTile(tile => {
    //   this._scene.add.text(tile.x, tile.y, tile.index.toString(), { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif', })
    // })

    const grid = this._scene.add.grid(0, 0, this._mapWidth * this._tileSize, this._mapHeight * this._tileSize, this._tileSize, this._tileSize);
    grid.setOrigin(0, 0);
    grid.showCells = false;
    grid.strokeColor = Phaser.Display.Color.GetColor(255, 0, 0)
    grid.strokeAlpha = 0;
  }

  private transformNoiseToTileIndex(noise: Array<Array<number>>): Array<Array<number>> {
    const tileMapData: Array<Array<number>> = noise.map(x => {
      return x.map(y => {
        return TileMapping.getTileForValue(y);
      });
    });

    return tileMapData;
  }

  public setCollision(object: Phaser.GameObjects.GameObject | Phaser.GameObjects.GameObject[] | Phaser.GameObjects.Group | Phaser.GameObjects.Group[]) {
    this._scene.physics.add.collider(object, this.layer);
  }

  public getRandomNonColliderVector(): [number, number] {
    const nonCollidableTiles = this.tileMap.filterTiles(tile => !tile.canCollide);
    const randomTile = nonCollidableTiles[Math.floor(Math.random() * nonCollidableTiles.length)]
    return [randomTile.x * this._tileSize, randomTile.y * this._tileSize]
  }
}


