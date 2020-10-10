import { Spawnable } from "../../common/spawnable";
import { GameScene } from "../../scenes/main";
import { MyPlayer } from "../player";

export class BadTobi extends Spawnable {

    public walkingSpeed = 50;
    public damageFactor = 10;

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
        this.tint = 0xff00ff;

        this.scene.time.addEvent({
            delay: 1000,
            callback: this.move,
            callbackScope: this,
            loop: true
        })

        this.body.onCollide = true;
        this.body.onOverlap = true;

        // scene.physics.moveToObject(this, scene.player);sa

        scene.addCollideWithPlayer(this, this.damage);
    }

    damage(player: MyPlayer, enemy: BadTobi) {
        player.decreaseHealth(this.damageFactor);
        console.log("Player health: ", player.health);
    }

    move() {
        const randNumber = Math.floor((Math.random() * 4) + 1);

        switch (randNumber) {
            case 1:
                this.setVelocityX(this.walkingSpeed);
                break;
            case 2:
                this.setVelocityX(-this.walkingSpeed);
                break;
            case 3:
                this.setVelocityY(this.walkingSpeed);
                break;
            case 4:
                this.setVelocityY(-this.walkingSpeed);
                break;
            default:
                this.setVelocityX(this.walkingSpeed);
        }

        setTimeout(() => {
            this.setVelocityX(0);
            this.setVelocityY(0);
        }, 500);
    }
}

