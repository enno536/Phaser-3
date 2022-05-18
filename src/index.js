import 'phaser';
import pkg from 'phaser/package.json';
import introImage from 'img/study.png';
import sky from 'assets/sky.png'
import ground from 'assets/platform.png'
import star from 'assets/star.png'
import bomb from 'assets/bomb.png'
import sprittesheet from 'assets/dude.png'
// This is the entry point of your game.

const width = 800;
const height = 600;

const config = {
  width,
  height,
  type: Phaser.AUTO,
  physics: {
    default: "arcade",
    arcade: {
      gravity:
        { y: 200 }
    }
  },
  scene: { preload, create, update },
};

const game = new Phaser.Game(config);

function preload() {
  this.load.image('study', introImage);
  this.load.image('sky', sky);
  this.load.image('ground', ground);
  this.load.image('star', star);
  this.load.image('bomb', bomb);
  this.load.spritesheet('dude',
    sprittesheet,
    { frameWidth: 32, frameHeight: 48 }
  );
}
let platforms
let player
let player2
let cursors
let stars
let score1 = 0;
let scoreText1;
let score2 = 0;
let scoreText2;
let highscore1 = 0
let highscoretext1;
let highscore2 = 0
let highscoretext2;
let bombs
let gameOver
let wasd;

/**
 * @type {Player[]}
 */
let players = [];

class Player {
  playerSprite
  controls
  score
  scoreText
  highscore
  highscoreText

  constructor(scene, keys, startPosition) {
    this.controls = keys;
    this.playerSprite = scene.physics.add.sprite(startPosition.x, startPosition.y, 'dude');
    this.playerSprite.setBounce(0.2);
    this.playerSprite.setCollideWorldBounds(true);
    console.log("creating player", this.playerSprite);
  }
}

function create() {

  this.add.image(400, 300, 'sky');
  platforms = this.physics.add.staticGroup();
  platforms.create(400, 568, 'ground').setScale(2).refreshBody();
  platforms.create(600, 400, 'ground');
  platforms.create(50, 250, 'ground');
  platforms.create(750, 220, 'ground');

  const playerOne = new Player(this, this.input.keyboard.createCursorKeys(), { x: 100, y: 400 });
  const playerTwo = new Player(this, this.input.keyboard.addKeys("W,S,A,D"), { x: 120, y: 400 });
  players.push(playerOne);
  players.push(playerTwo);

  scoreText1 = this.add.text(50, 50, 'score1: 0', { fontSize: '16px', fill: '#000' });
  scoreText2 = this.add.text(620, 50, 'score2: 0', { fontSize: '16px', fill: '#000' });

  highscoretext1 = this.add.text(50, 100, 'highscore1: 0', { fontSize: '16px', fill: '#000' });
  highscoretext2 = this.add.text(620, 100, 'highscore2: 0', { fontSize: '16px', fill: '#000' });

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

  this.physics.add.collider(playerOne.playerSprite, platforms);
  this.physics.add.collider(playerTwo.playerSprite, platforms);
  stars = this.physics.add.group({
    key: 'star',
    repeat: 11,
    setXY: { x: 12, y: 0, stepX: 70 }
  });

  this.physics.add.collider(stars, platforms);
  this.physics.add.overlap(playerOne.playerSprite, stars, collectStar, null, this);
  this.physics.add.overlap(playerTwo.playerSprite, stars, collectStar, null, this);

  stars.children.iterate(function (child) {

    child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.4));

  });
  bombs = this.physics.add.group();

  this.physics.add.collider(bombs, platforms);

  this.physics.add.collider(playerOne.playerSprite, bombs, hitBomb, null, this);
  this.physics.add.collider(playerTwo.playerSprite, bombs, hitBomb, null, this);
}

function update() {
  //"W,S,A,D"
  players.forEach((player) => {
    const controls = Object.values(player.controls);
    const up = controls[0]
    const left = controls[2];
    const right = controls[3];

    const playerSprite = player.playerSprite;

    if (left.isDown) {
      playerSprite.setVelocityX(-160);
      playerSprite.anims.play('left', true);
    }

    else if (right.isDown) {
      playerSprite.setVelocityX(160);
      playerSprite.anims.play('right', true);
    }
    else {
      playerSprite.setVelocityX(0);
      playerSprite.anims.play('turn');
    }

    if (up.isDown && playerSprite.body.touching.down) {
      playerSprite.setVelocityY(-330);
    }
  })
}

function hitBomb(player, bomb) {
  this.physics.pause();

  player.setTint(0xff0000);

  player.anims.play('turn');
  //player2.setTint(0xff0000);

  // player2.anims.play('turn');

  gameOver = true;

  this.scene.restart();
}

function collectStar(collidingPlayer, star) {
  star.disableBody(true, true);
  let activeHighscoreText = collidingPlayer === player ? highscoretext1 : highscoretext2;
  let activeScore = collidingPlayer === player ? score1 : score2;

  let activeHighscore = collidingPlayer === player ? highscore1 : highscore2//dassselbe wie oben für den score text
  let activeScoreText = collidingPlayer === player ? scoreText1 : scoreText2;// dasselbe wie oben für den highscore

  activeScore += 10;
  activeScoreText.setText('Score: ' + activeScore);
  if (activeScore > activeHighscore) { // ersetze mit score + highscore
    activeHighscoreText.setText('Hgihscore: ' + activeScore)



    var bomb = bombs.create(x, 16, 'bomb');
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

    if (stars.countActive(true) === 0) {
      stars.children.iterate(function (child) {

        child.enableBody(true, child.x, 0, true, true);

      });

      var x = (collidingPlayer.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

    }
  }

}