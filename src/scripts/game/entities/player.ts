import { Spawnable } from "../common/spawnable";
import { GameScene } from "../scenes/main";

export class MyPlayer extends Spawnable {

  public walkingSpeed = 50;
  public health = 100;

  // extends Phaser.GameObjects.Sprite
  constructor(
    scene: GameScene,
    x: number,
    y: number
  ) {
    super(scene, x, y, 'tobi');
    this.setOrigin(0, 0);

    //  Set some default physics properties
    this.displayHeight = 16;
    this.displayWidth = 16;
    this.setCollideWorldBounds(true);

    this.body.enable = true;

    this.body.onCollide = true;
    this.body.onOverlap = true;

    this.setVelocity(0);

    scene.cameras.main.startFollow(this);
    scene.physics.add.collider(scene.worldMap.layer, this);

  }

  decreaseHealth(factor: number) {
    this.health -= factor;
  }
}
