import { GameScene } from "../scenes/main";

export class Spawnable extends Phaser.Physics.Arcade.Sprite {
constructor(
    scene: GameScene,
    x: number,
    y: number,
    textureKey: string
  ) {
    super(scene, x, y, textureKey);
    this.setOrigin(0, 0);

    const spawnTile = scene.worldMap.tileMap.getTileAt(x,y);
    if(spawnTile && spawnTile.canCollide){
      [this.x, this.y] = scene.worldMap.getRandomNonColliderVector();
    }

    scene.add.existing(this);
    scene.physics.add.existing(this);
  
  }

}