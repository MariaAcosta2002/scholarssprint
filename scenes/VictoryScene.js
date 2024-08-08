export class VictoryScene extends Phaser.Scene {
    constructor() {
        super({ key: 'VictoryScene' });
    }

    preload() {
        this.load.image('victoryBackground', 'assets/img/victoryBackground.jpg');
        this.load.image('btnRestart', 'assets/img/reinicia.png');
        this.load.image('btnMenu', 'assets/img/regresar.png');
    }

    create() {
        const { width, height } = this.sys.game.config;

        this.add.image(width / 2, height / 2, 'victoryBackground').setOrigin(0.5);
        
        // Buttons
        this.botonRestart = this.add.image(width / 2 - 80, height / 2 + 80, 'btnRestart').setInteractive().setDepth(10);
        this.botonMenu = this.add.image(width / 2 + 80, height / 2 + 80, 'btnMenu').setInteractive().setDepth(10);

        // Button events
        this.botonRestart.on('pointerdown', () => {
            this.scene.start('level3');
        });
        this.botonMenu.on('pointerdown', () => {
            this.scene.start('niveles');
        });

        // Stop any music if it's playing
        this.stopBackgroundMusic();
    }

    stopBackgroundMusic() {
        // Implement logic if needed to stop any background music here
    }
}
