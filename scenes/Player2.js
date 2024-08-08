export class Player2 {
    constructor(scene) {
        this.myScene = scene;
        this.startX = 1000;
        this.startY = 60;
        this.movementSpeed = 80; // Velocidad más lenta
        this.changeDirectionTime = 3000;
        this.lastDirectionChange = 0;
        this.isJumping = false;
        this.jumpThreshold = 200; // Distancia mínima para saltar
    }

    preload() {
        this.myScene.load.image('player2', 'assets/img/Malo/Malo3.png');
        this.myScene.load.image('bomb', 'assets/img/bomb.png');
    }

    create() {
        this.Player = this.myScene.physics.add.sprite(this.startX, this.startY, 'player2')
            .setBounce(0.2)
            .setCollideWorldBounds(true);
        this.Player.setScale(0.8); // Ajusta la escala del jugador
        this.Player.body.setSize(this.Player.width * 0.4, this.Player.height * 0.6);
        this.Player.body.setOffset(this.Player.width * 0.3, this.Player.height * 0.1);
        this.Player.body.gravity.y = 800; // Ajusta la gravedad para saltos más altos

        this.movingRight = true;

        this.bombs = this.myScene.physics.add.group();
        this.throwTimer = this.myScene.time.addEvent({
            delay: 1000,
            callback: this.throwBomb,
            callbackScope: this,
            loop: true
        });

        if (this.myScene.plataformas3 && this.myScene.plataformas3.layer1) {
            this.myScene.physics.add.collider(this.Player, this.myScene.plataformas3.layer1);
        }

        this.myScene.physics.add.collider(this.Player, this.myScene.player.Player, this.hitPlayer, null, this);
        this.myScene.physics.add.collider(this.bombs, this.myScene.player.Player, this.bombHitPlayer, null, this);
    }

    update() {
        const player = this.myScene.player.Player;

        if (player) {
            const distanceToPlayer = Phaser.Math.Distance.Between(this.Player.x, this.Player.y, player.x, player.y);

            if (distanceToPlayer < this.jumpThreshold) {
                if (this.Player.x < player.x) {
                    this.Player.setVelocityX(this.movementSpeed);
                    this.Player.flipX = false;
                } else {
                    this.Player.setVelocityX(-this.movementSpeed);
                    this.Player.flipX = true;
                }

                this.jump();
            } else {
                this.Player.setVelocityX(0);
            }

            this.bombs.children.iterate((bomb) => {
                if (Phaser.Math.Distance.Between(this.Player.x, this.Player.y, bomb.x, bomb.y) < 50) {
                    if (this.myScene.time.now - this.lastDirectionChange > this.changeDirectionTime) {
                        this.movingRight = !this.movingRight;
                        this.Player.setVelocityX(this.movingRight ? this.movementSpeed : -this.movementSpeed);
                        this.lastDirectionChange = this.myScene.time.now;
                    }
                }
            });
        }
    }

    jump() {
        if (this.Player.body.onFloor()) {
            this.Player.setVelocityY(-500); // Ajusta la velocidad del salto
        }
    }

    throwBomb() {
        if (this.isPaused) return;

        const bomb = this.bombs.create(this.Player.x, this.Player.y, 'bomb');
        bomb.setBounce(2);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), -200);

        this.myScene.time.addEvent({
            delay: 2000,
            callback: () => bomb.destroy(),
            callbackScope: this
        });
    }

    hitPlayer(player, enemy) {
        this.myScene.stopBackgroundMusic();
        this.myScene.scene.start('GameOverScene');
    }
}
