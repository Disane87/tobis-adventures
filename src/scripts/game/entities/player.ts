import { Spawnable } from "../common/spawnable";
import { GameScene } from "../scenes/main";

export class MyPlayer extends Spawnable {

  public walkingSpeed = 50;

  // extends Phaser.GameObjects.Sprite
  constructor(
    scene: GameScene,
    x: number,
    y: number,
    textureKey: string,
    enemy: boolean = false
  ) {
    super(scene, x, y, textureKey);
    this.setOrigin(0, 0);

    //  Set some default physics properties
    this.displayHeight = 16;
    this.displayWidth = 16;
    this.setCollideWorldBounds(true);

    this.body.enable = true;

    this.setVelocity(0);

    if (!enemy) {
      scene.cameras.main.startFollow(this);
      scene.physics.add.collider(scene.worldMap.layer, this);
    } else {
      this.tint = 0xff00ff;
    }
  }
}
