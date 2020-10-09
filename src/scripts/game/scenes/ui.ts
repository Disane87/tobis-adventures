import { Score } from "../ui/score";

export class UiScene extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'UIScene', active: true });
    }

    create ()
    {
        //  Our Text object to display the Score
        let score = new Score(this);

        //  Grab a reference to the Game Scene
        let ourGame = this.scene.get('main');

        //  Listen for events from it
        ourGame.events.on('addScore',  (value) => {
          score.updateScore(value)

        }, this);
    }
}