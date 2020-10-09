import { GameScene } from "../scenes/main";
import { UiScene } from "../scenes/ui";

const CONFIG = {
  title: "Sample",
  mode: Phaser.Scale.CENTER_BOTH,
  autoCenter: Phaser.Scale.CENTER_BOTH,
  type: Phaser.AUTO,

  scale: {
    width: window.innerWidth,
    height: window.innerHeight
  },

  scene: [GameScene, UiScene],
  pixelArt: true,
  parent: "game"
};

export class MainGame extends Phaser.Game {
  constructor() {
    super(CONFIG);
  }

}
