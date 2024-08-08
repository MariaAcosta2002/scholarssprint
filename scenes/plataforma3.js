export class Plataformas3 {
    constructor(scene) {
        this.myScene = scene;
    }

    preload() {
        // Load images and JSON
        this.myScene.load.image('tiles', '../assets/img/tilesets/world_tileset.png');
        this.myScene.load.image('tiles2', '../assets/img/tilesets/nature-paltformer-tileset-16x16.png');
        this.myScene.load.tilemapTiledJSON('tilemapJSON', '../json/Level3.json');

        // Load spritesheets for coins
        this.myScene.load.spritesheet('coin', '../assets/img/items/MonedaR.png', { frameWidth: 16, frameHeight: 16 });
        this.myScene.load.spritesheet('coinF', '../assets/img/items/MonedaD.png', { frameWidth: 16, frameHeight: 16 });
    }

    create() {
        // Create animations for coins
        this.myScene.anims.create({
            key: 'spin',
            frames: this.myScene.anims.generateFrameNumbers('coin', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        });

        this.myScene.anims.create({
            key: 'spinF',
            frames: this.myScene.anims.generateFrameNumbers('coinF', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        });

        // Create map and layers
        this.map = this.myScene.make.tilemap({ key: 'tilemapJSON' });
        this.tileset = this.map.addTilesetImage('patron1', 'tiles');
        this.tileset2 = this.map.addTilesetImage('patron2', 'tiles2');

        // Create layers from the tilemap
        this.layer1 = this.map.createLayer('Plataformas3', this.tileset);
        this.layerLava = this.map.createLayer('lava', this.tileset);
        this.layer2 = this.map.createLayer('Cielo', this.tileset2);

        // Set collision properties for layers
        if (this.layer1) {
            this.layer1.setCollisionByProperty({ collision: true });
        } else {
            console.error('Layer "Plataformas3" is not defined.');
        }

        if (this.layerLava) {
            this.layerLava.setCollisionByProperty({ collision: true });
        } else {
            console.error('Layer "lava" is not defined.');
        }

        // Get object layers for coins
        this.coinsObj = this.map.getObjectLayer('Monedas3')?.objects || [];
        this.coinFObj = this.map.getObjectLayer('MonedaF3')?.objects || [];

        // Create physics groups for coins
        this.coins = this.myScene.physics.add.group({ allowGravity: false, immovable: true });
        this.coinsF = this.myScene.physics.add.group({ allowGravity: false, immovable: true });

        // Create normal coins
        this.coinsObj.forEach(element => {
            const coin = this.coins.create(element.x, element.y - element.height, 'coin');
            coin.setOrigin(0, 0);
            coin.play('spin');
        });

        // Create special coins
        this.coinFObj.forEach(element => {
            const coinF = this.coinsF.create(element.x, element.y - element.height, 'coinF');
            coinF.setOrigin(0, 0);
            coinF.play('spinF');
        });

        // Set up collisions and overlaps
        if (this.layerLava) {
            this.myScene.physics.add.collider(this.myScene.player, this.layerLava, () => {
                console.log('Player touched the lava');
                this.loseLevel();
            });
        }

        this.myScene.physics.add.overlap(this.myScene.player, this.coinsF, (player, coinF) => {
            coinF.destroy();
            this.myScene.scene.start('Level4'); // Move to next level
        });

        if (this.layer1) {
            this.myScene.physics.add.collider(this.myScene.player, this.layer1);
        }
    }

    loseLevel() {
        console.log('Lost the level');
        this.myScene.scene.start('GameOverScene');
    }
}
