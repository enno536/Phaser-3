import Player from '../player';

export default class PlayerPlugin extends Phaser.Plugins.BasePlugin {

    constructor(pluginManager) {
        super(pluginManager);


        pluginManager.registerGameObject('player', this.createPlayer);
    }

    createPlayer(x, y, controls) {
        const player = new Player(this.scene, x, y, controls);
        return this.scene.physics.add.existing(player)
    }

}