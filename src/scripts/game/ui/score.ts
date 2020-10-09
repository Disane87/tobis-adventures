import { GameScene } from "../scenes/main";

export class Score extends Phaser.GameObjects.Text {
  private score = 0;
  constructor(scene: Phaser.Scene){
    super(scene, 16, 16, `Score: 0`, { fontSize: '36px', stroke: '#000000', strokeThickness: 6 });

    this.setOrigin(0,0);
    this.setScrollFactor(0);

    scene.add.existing(this);

  }

  updateScore(value: number){
    this.score += value;
    this.text = `Score: ${this.score}`;
  }
}