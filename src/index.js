import 'phaser';
import PlayerPlugin from './plugins/player-plugin';
import GameScene from './scenes/game-scene';
import StartScene from './scenes/StartGame';
import EndScene from './scenes/Endgame';
// This is the entry point of your game.

const width = 800;
const height = 600;

const config = {
  width,
  height,
  type: Phaser.AUTO,
  plugins: {
    global: [
      { key: 'PlayerPlugin', plugin: PlayerPlugin, start: true }
    ]
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity:
        { y: 200 }
    }
  },
  scene: [StartScene, GameScene, EndScene],
};

const game = new Phaser.Game(config);

