export class Start extends Phaser.Scene {
    constructor() {
        super({ key: 'start' });
        this.inicioJuegoSample = null;
    }

    preload() {
        this.load.image('poke1', 'assets/img/schoolars.jpg');
        this.load.image('start', 'assets/img/start.png');
        this.load.image('gameTitle', 'assets/img/sprint.png');
        this.load.audio('inicioJuego', 'assets/audio/Inicio.mp3');
    }

    create() {
        const { width, height } = this.sys.game.config; // Obtenemos las dimensiones del juego

        this.background = this.add.image(width / 2, height / 2, 'poke1').setOrigin(0.5);
        this.background.setDisplaySize(width, height);

        this.boton = this.add.image(width / 2, height / 1.3, 'start').setInteractive();
        this.boton.on('pointerdown', () => {
            this.scene.start('niveles');
        });

        this.gameTitle = this.add.image(width / 2, 100, 'gameTitle').setOrigin(0.5, 0); // Ajustamos la posición del título

        window.addEventListener('resize', this.resizeGame.bind(this));

        this.inicioJuegoSample = this.sound.add('inicioJuego');
        this.inicioJuegoSample.play();
        this.inicioJuegoSample.on('complete', () => {
            this.inicioJuegoSample.play();
        });

        this.events.on('shutdown', () => {
            if (this.inicioJuegoSample.isPlaying) {
                this.inicioJuegoSample.stop();
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
        if (this.boton) {
            this.boton.setPosition(width / 2, height / 1.3);
        }
        if (this.gameTitle) {
            this.gameTitle.setPosition(width / 2, 100); // Ajustamos la posición del título
        }
    }
}
