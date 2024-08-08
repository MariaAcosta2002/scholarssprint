export class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    preload() {
        this.load.image('gameOver', 'assets/img/gameover.jpg');
        this.load.image('btnRestart', 'assets/img/reinicia.png');
        this.load.image('btnMenu', 'assets/img/regresar.png');
        this.load.image('btnInicio', 'assets/img/equis.png');
        this.load.audio('gameOverMusic', 'assets/audio/game-over-38511.mp3'); // Agregar música de fondo si es necesario
    }

    create() {
        const { width, height } = this.sys.game.config;

        // Fondo de Game Over
        const gameOverImage = this.add.image(width / 2, height / 2, 'gameOver').setOrigin(0.5);
        gameOverImage.displayWidth = width;
        gameOverImage.displayHeight = height;

        // Música de fondo
        this.gameOverMusic = this.sound.add('gameOverMusic', { loop: true, volume: 0.5 });
        this.gameOverMusic.play();

        // Botones
        const buttonY = height / 2 + 200;
        const buttonSpacing = 150;
        const buttonStartX = width / 2 - buttonSpacing;

        this.createButton(buttonStartX, buttonY, 'btnRestart', () => {
            this.stopBackgroundMusic();
            this.scene.start('level3');
        });

        this.createButton(width / 2, buttonY, 'btnMenu', () => {
            this.stopBackgroundMusic();
            this.scene.start('niveles');
        });

        this.createButton(width / 2 + buttonSpacing, buttonY, 'btnInicio', () => {
            this.stopBackgroundMusic();
            this.scene.start('start');
        });
    }

    createButton(x, y, texture, onClick) {
        const button = this.add.image(x, y, texture).setInteractive();
        button.on('pointerover', () => button.setScale(1.1)); // Efecto de sobrevuelo
        button.on('pointerout', () => button.setScale(1)); // Restablecer tamaño
        button.on('pointerdown', onClick);
        return button;
    }

    stopBackgroundMusic() {
        if (this.gameOverMusic && this.gameOverMusic.isPlaying) {
            this.gameOverMusic.stop();
        }
    }

    shutdown() {
        this.stopBackgroundMusic();
    }
}
