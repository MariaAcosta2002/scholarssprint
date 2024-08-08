import { Player2 } from './Player2.js';
import { Player3 } from './Player3.js';
import { Player } from './Player.js';
import { Plataformas3 } from './Plataforma3.js';
import { Items } from './Items.js';

export class Level3 extends Phaser.Scene {
    constructor() {
        super({ key: 'level3' });
        this.isPaused = false;
        this.player2 = new Player2(this);
        this.player3 = new Player3(this);
        this.player = new Player(this);
        this.plataformas3 = new Plataformas3(this);
        this.items = new Items(this);
        this.score = 0;
        this.backgroundMusic = null;
    }

    preload() {
        // Load assets
        this.load.image('LNI', 'assets/img/LNI.jfif');
        this.load.image('btnRestart', 'assets/img/reinicia.png');
        this.load.image('btnMenu', 'assets/img/regresar.png');
        this.load.image('btnPause', 'assets/img/pausar.png');
        this.load.image('btnResume', 'assets/img/renudar.png');
        this.load.image('paused', 'assets/img/paused.png');
        this.load.audio('backgroundMusic9', 'assets/audio/stranger-things-124008.mp3');

        // Preload player and platforms assets
        this.player2.preload();
        this.player3.preload();
        this.player.preload();
        this.plataformas3.preload();
    }

    create() {
        const { width, height } = this.sys.game.config;

        // Background
        this.background = this.add.image(width / 2, height / 2, 'LNI').setOrigin(0.5);
        this.background.displayWidth = width;
        this.background.displayHeight = height;

        // Buttons
        this.botonRestart = this.add.image(width / 2 - 80, 40, 'btnRestart').setInteractive().setDepth(10);
        this.botonMenu = this.add.image(width / 2, 40, 'btnMenu').setInteractive().setDepth(10);
        this.botonPauseResume = this.add.image(width / 2 + 80, 40, 'btnPause').setInteractive().setDepth(10);
        this.pausedImage = this.add.image(width / 2, height / 2, 'paused').setOrigin(0.5).setVisible(false).setDepth(10);

        // Button events
        this.botonRestart.on('pointerdown', () => {
            this.stopBackgroundMusic();
            this.scene.restart();
        });
        this.botonMenu.on('pointerdown', () => {
            this.stopBackgroundMusic();
            this.scene.start('niveles');
        });
        this.botonPauseResume.on('pointerdown', () => this.togglePause());

        // Score text
        this.scoreText = this.add.text(width - 120, 16, 'Puntaje: 0', { fontSize: '32px', fill: '#FFFFFF' }).setOrigin(1, 0).setDepth(10);

        // Map and items
        this.plataformas3.create();
        this.player2.create();
        this.player3.create();
        this.player.create();

        // Start background music
        this.backgroundMusic = this.sound.add('backgroundMusic9', { loop: true, volume: 0.5 });
        this.backgroundMusic.play();

        // Adjust map position
        this.moveMapDown(80);

        // Collisions and overlaps
        this.physics.add.collider(this.player.Player, this.plataformas3.layer1);
        this.physics.add.overlap(this.player.Player, this.plataformas3.coins, this.collectCoin, null, this);
        this.physics.add.overlap(this.player.Player, this.plataformas3.coinsF, this.collectSpecialCoin, null, this);
        this.physics.add.collider(this.player.Player, this.plataformas3.layerLava, this.showGameOverCard, null, this);
        this.physics.add.overlap(this.player.Player, this.player2.bombs, this.showGameOverCard, null, this);
        this.physics.add.overlap(this.player.Player, this.player3.bombs, this.showGameOverCard, null, this);

        // Resize handling
        this.scale.on('resize', this.resize, this);
    }

    update(time, delta) {
        if (this.isPaused) {
            return;
        }
        this.player2.update();
        this.player3.update();
        this.player.update();
    }

    togglePause() {
        this.isPaused = !this.isPaused;

        if (this.isPaused) {
            this.botonPauseResume.setTexture('btnResume');
            this.pausedImage.setVisible(true);

            // Detener la física y las animaciones
            this.stopAllMovements();

            // Pausar el tiempo
            this.time.paused = true;

        } else {
            this.botonPauseResume.setTexture('btnPause');
            this.pausedImage.setVisible(false);

            // Reanudar la física y las animaciones
            this.resumeAllMovements();

            // Reanudar el tiempo
            this.time.paused = false;
        }
    }

    stopAllMovements() {
        this.player.Player.body.setVelocity(0);
        this.player2.Player.body.setVelocity(0);
        this.player3.Player.body.setVelocity(0);
        this.player.Player.anims.pause();
        this.player2.Player.anims.pause();
        this.player3.Player.anims.pause();
        this.player.Player.input.enabled = false;
        this.player2.Player.input.enabled = false;
        this.player3.Player.input.enabled = false;
    }

    resumeAllMovements() {
        this.player.Player.anims.resume();
        this.player2.Player.anims.resume();
        this.player3.Player.anims.resume();
        this.player.Player.input.enabled = true;
        this.player2.Player.input.enabled = true;
        this.player3.Player.input.enabled = true;
    }

    collectCoin(player, coin) {
        coin.disableBody(true, true);
        this.items.recolectaMonedas(coin);
        this.updateScore(250);
    }

    collectSpecialCoin(player, coinF) {
        coinF.disableBody(true, true);
        this.items.recolectaMonedaF(coinF);
        this.showVictory();
    }

    updateScore(points) {
        this.score += points;
        this.scoreText.setText(`Puntaje: ${this.score}`);
    }

    moveMapDown(offset) {
        if (this.plataformas3.layer1) {
            this.plataformas3.layer1.setPosition(0, offset);
        } else {
            console.error('layer1 is not initialized');
        }
        if (this.plataformas3.layerLava) {
            this.plataformas3.layerLava.setPosition(0, offset);
        } else {
            console.error('layerLava is not initialized');
        }
    }

    resize(gameSize) {
        const { width, height } = gameSize;
        this.background.displayWidth = width;
        this.background.displayHeight = height;
        this.botonRestart.setPosition(width / 2 - 80, 40);
        this.botonMenu.setPosition(width / 2, 40);
        this.botonPauseResume.setPosition(width / 2 + 80, 40);
        this.pausedImage.setPosition(width / 2, height / 2);
    }

    showGameOverCard() {
        this.stopBackgroundMusic();
        this.scene.start('GameOverScene');
    }

    showVictory() {
        this.stopBackgroundMusic();
        this.scene.start('VictoryScene'); // Agrega la escena de Victoria
    }

    // Stop the music when the scene is shut down
    shutdown() {
        this.stopBackgroundMusic();
    }

    stopBackgroundMusic() {
        if (this.backgroundMusic && this.backgroundMusic.isPlaying) {
            this.backgroundMusic.stop();
        }
    }
}
