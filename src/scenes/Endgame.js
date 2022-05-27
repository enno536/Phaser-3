import sky from 'assets/sky.png'

export default class EndScene extends Phaser.Scene {

    constructor() {
        super({ key: "End" })
    }

    preload() {
        this.load.image('sky', sky);
    }



    create() {
        this.add.image(400, 300, 'sky');
        var text = this.add.text(245, 250, 'Game Over', { fontSize: '64px Courier', fill: '#000' });

        var textx = this.add.text(310, 400, 'Play Again', { fontSize: '32px Courier', fill: '#000' }).setInteractive();;


        textx.on('pointerdown', () => {
            this.scene.start('Start')
        });

        textx.on('pointerup', function () {
        });
    };
}
