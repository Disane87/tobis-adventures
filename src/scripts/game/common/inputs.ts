import { GameScene } from "../scenes/main";

export  class Inputs {
  private static keyUp: Phaser.Input.Keyboard.Key;
  private static keyDown: Phaser.Input.Keyboard.Key;
  private static keyLeft: Phaser.Input.Keyboard.Key;
  private static keyRight: Phaser.Input.Keyboard.Key;

  static setControls(scene: Phaser.Scene){
    this.keyUp = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyDown = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyLeft = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyRight = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    scene.input.on("wheel", (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
      const currentZoom = scene.cameras.main.zoom;
      let newZoom = currentZoom;
      if (currentZoom >= 0) {
        if (Math.sign(deltaY) == -1) {
          newZoom += 1;
        }

        if (Math.sign(deltaY) == 1) {
          newZoom -= 1;
        }

        if (newZoom >= 1 && newZoom <= 6) {
          scene.cameras.main.setZoom(newZoom);
        } else {
          scene.cameras.main.setZoom(1);
        }
      }
    });
  }

  static updateControls(gameScene: GameScene){
    const playerSpeed = gameScene.player.walkingSpeed;
     gameScene.player.setVelocityY(0);
     gameScene.player.setVelocityX(0);
    if (this.keyUp.isDown) {
      gameScene.player.setVelocityY(-playerSpeed);
    }
    if (this.keyDown.isDown) {
      gameScene.player.setVelocityY(playerSpeed);
    }
    if (this.keyLeft.isDown) {
      gameScene.player.setVelocityX(-playerSpeed);
    }
    if (this.keyRight.isDown) {
      gameScene.player.setVelocityX(playerSpeed);
    }
  }
}