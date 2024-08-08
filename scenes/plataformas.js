export class Plataformas {
    constructor(scene) {
        this.myScene = scene;
        this.layer1 = null;
        this.layerLava = null;
        this.coins = null;
        this.coinsF = null;
    }

    preload() {
        // Carga de imágenes y JSON
        this.myScene.load.image('tiles', '../assets/img/tilesets/world_tileset.png');
        this.myScene.load.image('tiles2', '../assets/img/tilesets/nature-paltformer-tileset-16x16.png');
        this.myScene.load.tilemapTiledJSON('tilemapJSON', '../json/Level1.json');

        // Carga de spritesheets para las monedas
        this.myScene.load.spritesheet('coin', '../assets/img/items/MonedaR.png', { frameWidth: 16, frameHeight: 16 });
        this.myScene.load.spritesheet('coinF', '../assets/img/items/MonedaD.png', { frameWidth: 16, frameHeight: 16 });
    }

    create() {
        // Creación de animaciones para las monedas
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

        // Creación del mapa y las capas
        this.map = this.myScene.make.tilemap({ key: 'tilemapJSON' });
        this.tileset = this.map.addTilesetImage('patron1', 'tiles');
        this.tileset2 = this.map.addTilesetImage('patron2', 'tiles2');

        // Crear la capa de plataformas usando el diseño del JSON
        this.layer1 = this.map.createLayer("Plataformas", this.tileset);
        this.layerLava = this.map.createLayer("Lava", this.tileset);

        // Crear la capa de cielo
        this.layer2 = this.map.createLayer("Cielo", this.tileset2);

        // Check if layers exist
        if (!this.layer1 || !this.layerLava) {
            console.error('One or more layers are not defined.');
            return;
        }

        // Set collision for layers
        this.layer1.setCollisionByProperty({ collision: true });
        this.layerLava.setCollisionByProperty({ collision: true });

        // Obtener objetos de las capas de monedas
        this.coinsObj = this.map.getObjectLayer("Monedas").objects;
        this.coinFObj = this.map.getObjectLayer("MonedaF").objects;

        // Crear grupos físicos para las monedas
        this.coins = this.myScene.physics.add.group({ allowGravity: false, immovable: true });
        this.coinsF = this.myScene.physics.add.group({ allowGravity: false, immovable: true });

        // Crear las monedas normales (MonedaR)
        this.coinsObj.forEach(element => {
            const coin = this.coins.create(element.x, element.y - element.height, 'coin');
            coin.setOrigin(0, 0);
            coin.play('spin');
        });

        // Crear la moneda especial (MonedaF)
        this.coinFObj.forEach(element => {
            const coinF = this.coinsF.create(element.x, element.y - element.height, 'coinF');
            coinF.setOrigin(0, 0);
            coinF.play('spinF');
        });

        // Configurar las colisiones del jugador con la lava
        this.myScene.physics.add.collider(this.myScene.player, this.layerLava, () => {
            console.log('Jugador tocó la lava');
            this.loseLevel();
        });

        // Configurar la superposición del jugador con la moneda especial (MonedaF)
        this.myScene.physics.add.overlap(this.myScene.player, this.coinsF, (player, coinF) => {
            // Eliminar la moneda especial del juego
            coinF.destroy();

            // Avanzar al siguiente nivel
            this.myScene.scene.start('Level2');
        });

        // Añadir colisiones entre el jugador y la capa de plataformas
        this.myScene.physics.add.collider(this.myScene.player, this.layer1);
    }

    loseLevel() {
        // Mostrar mensaje de Game Over y reiniciar el nivel
        this.myScene.scene.start('GameOverScene');
    }
}
