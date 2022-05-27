import sky from 'assets/sky.png'
import Pfeiltasten from 'assets/Pfeiltasten.png'

export default class StartScene extends Phaser.Scene {

    constructor() {
        super({ key: "Start" })
    }

    preload() {
        this.load.image('sky', sky);
        this.load.image('Pfeiltasten', Pfeiltasten)
    }

    create() {
        this.add.image(400, 300, 'sky');
        this.add.image(400, 430, 'Pfeiltasten')
        var text = this.add.text(40, 40, 'Made by Enno', { fontSize: '16px Courier', fill: '#000' });
        var text = this.add.text(320, 530, 'Lenke mit den Pfeiltasten', { fontSize: '16px Courier', fill: '#000' });
        var textx = this.add.text(253, 200, 'Start Game', { fontSize: '64px Courier', fill: '#000' }).setInteractive();;


        //this.registry.set('points', 30)

        //this.registry.get('points')

        textx.on('pointerdown', () => {
            this.scene.start('Game')
        });

        textx.on('pointerup', function () {
        });
    }
}