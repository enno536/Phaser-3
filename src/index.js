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
let score = 0;
let scoreText;
let highscore = score
let highscoretext;
let bombs
let gameOver
let wasd;
function create() {
  cursors = this.input.keyboard.createCursorKeys();
  wasd = this.input.keyboard.addKeys("W,S,A,D");
  console.log(wasd);


  const centerX = width / 2;
  const centerY = height / 2;
  this.add.image(400, 300, 'sky');

  platforms = this.physics.add.staticGroup();

  platforms.create(400, 568, 'ground').setScale(2).refreshBody();

  platforms.create(600, 400, 'ground');
  platforms.create(50, 250, 'ground');
  platforms.create(750, 220, 'ground');

  player = this.physics.add.sprite(100, 450, 'dude');
  //player2 = this.physics.add.sprite(100, 100, 'dude')

  player.setBounce(0.2);
  player.setCollideWorldBounds(true);
  //player2.setBounce(0.2);
  //player2.setCollideWorldBounds(true);
  scoreText = this.add.text(50, 50, 'score: 0', { fontSize: '32px', fill: '#000' });
  highscoretext = this.add.text(400, 50, 'highscore: 0', { fontSize: '32px', fill: '#000' });

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








  this.physics.add.collider(player, platforms);
  //this.physics.add.collider(player2, platforms);
  stars = this.physics.add.group({
    key: 'star',
    repeat: 11,
    setXY: { x: 12, y: 0, stepX: 70 }


  });
  this.physics.add.collider(stars, platforms);
  this.physics.add.overlap(player, stars, collectStar, null, this);
  //this.physics.add.overlap(player2, stars, collectStar, null, this);

  stars.children.iterate(function (child) {

    child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.4));


  });
  bombs = this.physics.add.group();

  this.physics.add.collider(bombs, platforms);

  this.physics.add.collider(player, bombs, hitBomb, null, this);
  //this.physics.add.collider(player2, bombs, hitBomb, null, this);
}

function update() {

  if (cursors.left.isDown) {
    player.setVelocityX(-160);
    if (wasd.A.isDown) {
      //  player2.setVelocityX(-160);
    }


    player.anims.play('left', true);
    //player2.anims.play('left', true);

  }
  if (cursors.right.isDown) {
    player.setVelocityX(160);
  }
  //else if (wasd.D.isDown) {
  //player2.setVelocityX(160);


  player.anims.play('right', true);
  //player2.anims.play('right', true);

  {
    player.setVelocityX(0);
    //player2.setVelocityX(0);

    player.anims.play('turn');
    //player2.anims.play('turn');
  }

  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-330);
  }
  if (wasd.W.isDown && player.body.touching.down) {
    //player2.setVelocityY(-330);
  }
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

function collectStar(player, star) {
  star.disableBody(true, true);

  score += 10;
  scoreText.setText('Score: ' + score);
  if (score > highscore);
  //highscoretext.setText('Highscore: ' = score);
  //if (score > highscore)


  // Wenn score > highscore, highscore = score

  var bomb = bombs.create(x, 16, 'bomb');
  bomb.setBounce(1);
  bomb.setCollideWorldBounds(true);
  bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

  if (stars.countActive(true) === 0) {
    stars.children.iterate(function (child) {

      child.enableBody(true, child.x, 0, true, true);

    });

    var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
    //var x = (player2.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
  }
}
