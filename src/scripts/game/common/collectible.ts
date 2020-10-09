import { MyPlayer } from "../entities/player";
import { GameScene } from "../scenes/main";
import { Spawnable } from "./spawnable";
import { timer } from 'rxjs';
import { startWith } from 'rxjs/operators';

export class Collectible extends Spawnable {

  private value: number;
  
  constructor(scene: GameScene, x: number, y: number, textureKey: string, name: string, type: Type){
    super(scene, x, y, textureKey);

    this.name = name;
    this.value = type;

    this.displayHeight = 8;
    this.displayWidth = 8;

    scene.physics.add.overlap(scene.player, this, this.collect, null, this);
  }

  private collect(player: MyPlayer, collectible: Collectible){

    // (this.scene as GameScene).score.updateScore(collectible.value);
    this.scene.events.emit('addScore', collectible.value);
    // this.scene.cache.audio.get('eat').play();

    const blinkTimeout = 100;
    collectible.disableBody(true, true);
    timer(blinkTimeout).pipe(
      startWith(blinkTimeout)
    ).subscribe(value => {
      if(value == blinkTimeout){
        player.setTint(0x00ff00);
      } else {
        player.clearTint();
      }
    })
  }
  
}

export enum Type {
  FRUIT = 1,
}