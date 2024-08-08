export class niveles extends Phaser.Scene {
    constructor() {
        super({ key: 'niveles' });
    }

    preload() {
        this.load.image('niveles', 'assets/img/print.jpg');
        this.load.image('btnNivel1', 'assets/img/nivel1.png');
        this.load.image('btnNivel2', 'assets/img/nivel2.png');
        this.load.image('btnMenu', 'assets/img/regresar.png');
        this.load.audio('backgroundMusic', 'assets/audio/pixel-fight-8-bit-arcade-music-background-music-for-video-208775.mp3');
    }

    create() {
        const { width, height } = this.sys.game.config;

        this.background = this.add.image(width / 2, height / 2, 'niveles').setOrigin(0.5);
        this.background.setDisplaySize(width, height);

        const buttonSize = 150; // Tamaño de los botones

        // Botón Nivel 1 (superior central)
        this.botonNivel1 = this.add.image(width / 2, height / 2 - 200, 'btnNivel1').setInteractive();
        this.botonNivel1.setDisplaySize(buttonSize, buttonSize);
        this.botonNivel1.on('pointerdown', () => this.scene.start('level1'));

        // Botón Nivel 2 (centro central)
        this.botonNivel2 = this.add.image(width / 2, height / 2, 'btnNivel2').setInteractive();
        this.botonNivel2.setDisplaySize(buttonSize, buttonSize);
        this.botonNivel2.on('pointerdown', () => this.scene.start('level3'));
        // Botón de menú (superior izquierdo)
        this.botonMenu = this.add.image(100, height - 100, 'btnMenu').setInteractive(); // Ajusta la posición según sea necesario
        this.botonMenu.setDisplaySize(buttonSize / 2, buttonSize / 2); // Tamaño más pequeño para el botón de menú
        this.botonMenu.on('pointerdown', () => this.scene.start('start'));

        // Música de fondo
        this.backgroundMusic = this.sound.add('backgroundMusic', { loop: true, volume: 0.5 });
        this.backgroundMusic.play();

        this.events.on('shutdown', () => {
            if (this.backgroundMusic.isPlaying) {
                this.backgroundMusic.stop();
            }
        });
    }

    resizeGame() {
        const { width, height } = this.sys.game.config;

        this.scale.resize(width, height);

        if (this.background) {
            this.background.setPosition(width / 2, height / 2);
            this.background.setDisplaySize(width, height);
        }
        if (this.botonNivel1) {
            this.botonNivel1.setPosition(width / 2, height / 2 - 200);
        }
        if (this.botonNivel2) {
            this.botonNivel2.setPosition(width / 2, height / 2);
        }
        if (this.botonMenu) {
            this.botonMenu.setPosition(100, height - 100);
        }
    }
}
