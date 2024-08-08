import { Player } from "./player.js";
import { Plataformas } from "./plataformas.js";
import { Items } from "./items.js";
import { Player2 } from "./player2.js"; // Importa Player2

export class Level1 extends Phaser.Scene {
    constructor() {
        super({ key: 'level1' });
        this.isPaused = false;
        this.plataformas = new Plataformas(this);
        this.items = new Items(this);
        this.player = new Player(this);
        this.player2 = new Player2(this); // Instancia Player2
        this.score = 0;
        this.backgroundMusic = null;
    }

    preload() {
        this.load.image('Computo', 'assets/img/Laboratoriocomputo.jpg');
        this.load.image('btnRestart', 'assets/img/reinicia.png');
        this.load.image('btnMenu', 'assets/img/regresar.png');
        this.load.image('btnPause', 'assets/img/pausar.png');
        this.load.image('btnResume', 'assets/img/renudar.png');
        this.load.image('paused', 'assets/img/paused.png');
        this.load.audio('backgroundMusic2', 'assets/audio/byte-blast-8-bit-arcade-music-background-music-for-video-208780.mp3');
        this.plataformas.preload();
        this.player.preload();
        this.player2.preload(); // Preload de Player2
    }

    create() {
        const { width, height } = this.sys.game.config;

        this.background = this.add.image(width / 2, height / 2, 'Computo').setOrigin(0.5);
        this.background.displayWidth = width;
        this.background.displayHeight = height;

        // Buttons
        this.botonRestart = this.add.image(width / 2 - 80, 40, 'btnRestart').setInteractive().setDepth(10);
        this.botonRestart.on('pointerdown', () => {
            this.stopBackgroundMusic();
            this.scene.restart();
        });

        this.botonMenu = this.add.image(width / 2, 40, 'btnMenu').setInteractive().setDepth(10);
        this.botonMenu.on('pointerdown', () => {
            this.stopBackgroundMusic();
            this.scene.start('niveles');
        });

        this.botonPauseResume = this.add.image(width / 2 + 80, 40, 'btnPause').setInteractive().setDepth(10);
        this.botonPauseResume.on('pointerdown', () => this.togglePause());

        this.pausedImage = this.add.image(width / 2, height / 2, 'paused').setOrigin(0.5).setVisible(false).setDepth(10);

        // Score text
        this.scoreText = this.add.text(width - 120, 16, 'Puntaje: 0', { fontSize: '32px', fill: '#000000' }).setOrigin(1, 0).setDepth(10);

        // Background music
        this.backgroundMusic = this.sound.add('backgroundMusic2', { loop: true, volume: 0.5 });
        this.backgroundMusic.play();

        // Create platforms, player, and player2
        this.plataformas.create();
        this.player.create();
        this.player2.create(); // Crea Player2

        // Check layers
        if (this.plataformas.layer1 && this.plataformas.layerLava) {
            this.moveMapDown(80);
        } else {
            console.error('layer1 or layerLava is not defined');
        }

        // Collisions and overlaps
        this.physics.add.collider(this.player.Player, this.plataformas.layer1);
        this.physics.add.overlap(this.player.Player, this.plataformas.coins, this.collectCoin, null, this);
        this.physics.add.overlap(this.player.Player, this.plataformas.coinsF, this.collectSpecialCoin, null, this);
        this.physics.add.collider(this.player.Player, this.plataformas.layerLava, this.loseLevel, null, this);

        this.physics.add.collider(this.player2.Player, this.plataformas.layer1); // Colisión para Player2

        // Resize handling
        this.scale.on('resize', this.resize, this);
    }

    update(time, delta) {
        if (this.isPaused) {
            return;
        }
        this.player.update();
        this.player2.update(); // Actualiza Player2
    }

    togglePause() {
        this.isPaused = !this.isPaused;

        if (this.isPaused) {
            this.botonPauseResume.setTexture('btnResume');
            this.pausedImage.setVisible(true);
            this.player.Player.body.setVelocity(0);
            this.player.Player.body.setAcceleration(0);
            this.physics.world.pause();
            this.time.paused = true;
            this.disableButtons();
        } else {
            this.botonPauseResume.setTexture('btnPause');
            this.pausedImage.setVisible(false);
            this.physics.world.resume();
            this.time.paused = false;
            this.enableButtons();
        }
    }

    collectCoin(player, coin) {
        coin.disableBody(true, true);
        this.items.recolectaMonedas(coin);
        this.updateScore(250);
    }

    collectSpecialCoin(player, coinF) {
        coinF.disableBody(true, true);
        this.items.recolectaMonedaF(coinF);
    }

    updateScore(points) {
        this.score += points;
        this.scoreText.setText(`Puntaje: ${this.score}`);
    }

    moveMapDown(offset) {
        if (this.plataformas.layer1 && this.plataformas.layerLava) {
            this.plataformas.layer1.setY(this.plataformas.layer1.y + offset);
            this.plataformas.layerLava.setY(this.plataformas.layerLava.y + offset);
        }
    }

    stopBackgroundMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.stop();
        }
    }

    loseLevel() {
        this.stopBackgroundMusic();
        this.scene.start('GameOverScene');
    }

    resize(gameSize, baseSize, displaySize, resolution) {
        const { width, height } = gameSize;
        this.background.displayWidth = width;
        this.background.displayHeight = height;
        this.botonRestart.setPosition(width / 2 - 80, 40);
        this.botonMenu.setPosition(width / 2, 40);
        this.botonPauseResume.setPosition(width / 2 + 80, 40);
        this.pausedImage.setPosition(width / 2, height / 2);
        this.scoreText.setPosition(width - 120, 16);
    }

    disableButtons() {
        this.botonRestart.setInteractive(false);
        this.botonMenu.setInteractive(false);
        this.botonPauseResume.setInteractive(false);
    }

    enableButtons() {
        this.botonRestart.setInteractive(true);
        this.botonMenu.setInteractive(true);
        this.botonPauseResume.setInteractive(true);
    }
}
