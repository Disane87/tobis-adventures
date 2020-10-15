import * as Phaser from "phaser";

import { WorldMap } from "../common/mapping/map";
import { MyPlayer } from "../entities/player";
import { Inputs } from "../common/inputs";
import { Collectible, Type } from "../common/collectible";
import { Score } from "../ui/score";
import { BadTobi } from "../entities/enemies/bad-tobi";

export const SCENE_CONFIG: Phaser.Types.Scenes.SettingsConfig = {
  active: true,
  visible: true,
  key: "main",
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
    }
  },
};

const ENEMY_AND_COLLECTIBLES = false;
const ENEMY_COUNT = 10;
const COLLECTIBLE_COUNT = 100;

const IMAGE_ASSETS = new Map<string, string>([
  ['ground', 'assets/images/tilesets/terrain-extruded.png'],
  ['tobi', 'assets/images/tobi.png'],
  ['collectibles', 'assets/images/collectables.png']
])

const SOUND_ASSETS = new Map<string, string>([
  ['eat', 'assets/sounds/eat.mp3']
])

export class GameScene extends Phaser.Scene {
  constructor() {
    super(SCENE_CONFIG);
  }

  public player: MyPlayer;
  public score: Score;
  public cameraSpeed = 1;
  public worldMap: WorldMap;

  public create() {
    const enemyGroup = this.add.group();

    this.worldMap = new WorldMap(this, 5, 5, 16, 0);
    this.player = new MyPlayer(this, 1, 1);

    if (ENEMY_AND_COLLECTIBLES) {
      const collectibles = new Array<MyPlayer>(COLLECTIBLE_COUNT).fill(null).map(() => new Collectible(this, 1, 1, 'collectibles', 'orange', Type.FRUIT));

      const enemies = new Array<MyPlayer>(ENEMY_COUNT).fill(null).map(() => {
        const randomX: number = Math.floor(Phaser.Math.Between(0, 100 * 16));
        const randomY: number = Math.floor(Phaser.Math.Between(0, 100 * 16));

        return new BadTobi(this, randomX, randomY);
      })

      enemyGroup.addMultiple(enemies);

      this.physics.add.collider(enemyGroup, this.worldMap.layer);
      this.physics.add.collider(enemyGroup, this.player);
      this.physics.add.collider(enemyGroup, enemyGroup);
    }

    this.cameras.main.setZoom(5);
    this.cameras.main.roundPixels = true;

    Inputs.setControls(this);

    // PhaserGUIAction(this);
  }

  addCollideWithPlayer(gameObject: Phaser.GameObjects.GameObject, callback: ArcadePhysicsCallback) {
    this.physics.add.collider(this.player, gameObject, callback)
  }

  preload() {
    IMAGE_ASSETS.forEach((value, key) => {
      this.load.image(key, value);
    })

    SOUND_ASSETS.forEach((value, key) => {
      this.load.audio(key, value);

    })
  }

  update() {
    Inputs.updateControls(this);
    const cameraBounds = this.cameras.main.getBounds();

  }
}
