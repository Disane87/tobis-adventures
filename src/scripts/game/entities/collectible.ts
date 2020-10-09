import { GameScene } from "../scenes/main";
import { Spawnable } from "../common/spawnable";


export class Collectible extends Spawnable {

  private value: number;

  constructor(scene: GameScene, x: number, y: number, textureKey: string, name: string) {
    super(scene, x, y, textureKey);

    this.name = name;
    // this.value = value;
  }
}

enum Type {
  FRUIT = 1
}