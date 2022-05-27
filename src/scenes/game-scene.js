import 'phaser';
import sky from 'assets/sky.png'
import ground from 'assets/platform.png'
import star from 'assets/star.png'
import bomb from 'assets/bomb.png'
import sprittesheet from 'assets/dude.png'

let test = 0;

export default class GameScene extends Phaser.Scene {

    platforms
    player
    stars
    score1 = 0;
    scoreText1;
    highscore1 = 0
    highscoretext1;
    bombs
    Ansage
    players = [];

    constructor() {
        super({ key: "Game" })
    }


    preload() {
        this.load.image('sky', sky);
        this.load.image('ground', ground);
        this.load.image('star', star);
        this.load.image('bomb', bomb);
        this.load.spritesheet('dude',
            sprittesheet,
            { frameWidth: 32, frameHeight: 48 }
        );
    }

    create() {
        this.add.image(400, 300, 'sky');
        this.highscore1 = localStorage.getItem("hallo")
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        this.platforms.create(600, 400, 'ground');
        this.platforms.create(50, 250, 'ground');
        this.platforms.create(750, 220, 'ground');
        this.score1 = 0

        this.scoreText1 = this.add.text(50, 50, 'Score:' + this.score1, { fontSize: '16px Courier', fill: '#000' });
        this.highscoretext1 = this.add.text(663, 50, 'Highscore:' + this.highscore1, { fontSize: '16px Courier', fill: '#000' });

        this.player = this.add.player(100, 400, this.input.keyboard.createCursorKeys());
        this.add.existing(this.player);

        this.players = [this.player];
        this.bombs = this.physics.add.group();

        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }

        });


        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [{ key: 'dude', frame: 4 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });


        this.stars.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.4));
        });

        this.physics.add.collider(this.stars, this.platforms);
        this.physics.add.collider(this.bombs, this.platforms);
        this.players.forEach(player => {

            player.setBounce(0.2);
            player.setCollideWorldBounds(true);
            this.physics.add.collider(this.player, this.bombs, this.hitBomb.bind(this), null, this);
            this.physics.add.overlap(player, this.stars, this.collectStar, null, this);
            this.physics.add.collider(player, this.platforms);

        })


    }

    update() {
        this.players.forEach(player => {
            const controls = Object.values(player.controls)
            const up = controls[0]
            const left = controls[2]
            const right = controls[3]
            if (left.isDown) {
                player.setVelocityX(-160);
                player.anims.play('left', true);
            }

            else if (right.isDown) {
                player.setVelocityX(160);
                player.anims.play('right', true);
            }
            else {
                player.setVelocityX(0);
                player.anims.play('turn');
            }

            if (up.isDown && player.body.touching.down) {
                player.setVelocityY(-330);
            }

        })
    }



    collectStar(collidingPlayer, star) {
        star.disableBody(true, true)

        this.score1 += 10;
        this.scoreText1.setText('Score: ' + this.score1)
        if (this.score1 > this.highscore1) {
            this.highscore1 = this.score1
            this.highscoretext1.setText('Highscore: ' + this.highscore1)
            localStorage.setItem("hallo", this.highscore1)
        }
        var x = (collidingPlayer.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
        var bomb = this.bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

        if (this.stars.countActive(true) === 0) {
            this.stars.children.iterate(function (child) {
                child.enableBody(true, child.x, 0, true, true);
            });
        }
    }

    hitBomb(player, bomb) {
        this.physics.pause();

        this.player.setTint(0xff0000);

        this.player.anims.play('turn');

        this.gameOver = true;
        this.scene.start('End');
    }

}


