import * as Phaser from "phaser";

import { WorldMap } from "../common/mapping/map";
import { MyPlayer } from "../entities/player";
import { Inputs } from "../common/inputs";
import { Collectible, Type } from "../common/collectible";
import { Score } from "../ui/score";

const SCENE_CONFIG: Phaser.Types.Scenes.SettingsConfig = {
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

const IMAGE_ASSETS = new Map<string, string>([
  ['ground', 'assets/images/tilesets/terrain.png'],
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

    this.worldMap = new WorldMap(this, 100, 100, 16, 0);
    this.player = new MyPlayer(this, 1, 1, 'tobi') as MyPlayer;

    const collectibles = new Array<MyPlayer>(100).fill(null).map(() => new Collectible(this, 1, 1, 'collectibles', 'orange', Type.FRUIT));

    const enemies = new Array<MyPlayer>(10).fill(null).map(() => {
      const randomX: number = Math.floor(Phaser.Math.Between(0, 100 * 16));
      const randomY: number = Math.floor(Phaser.Math.Between(0, 100 * 16));

      return new MyPlayer(this, randomX, randomY, 'tobi', true);
    })

    enemyGroup.addMultiple(enemies);

    this.physics.add.collider(enemyGroup, this.worldMap.layer);
    this.physics.add.collider(enemyGroup, this.player);
    this.cameras.main.setZoom(5);
    this.cameras.main.roundPixels = true;

    Inputs.setControls(this);

    this.anims.create({
      key: 'water',
      frames: this.anims.generateFrameNumbers('ground', { start: 1, end: 2 }),
      frameRate: 10,
    });

    // PhaserGUIAction(this);aaaaa
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
