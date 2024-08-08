import { Start } from "./start.js";
import { niveles } from "./niveles.js";
import { Level1 } from "./level1.js";
import {Level3} from "./level3.js";
import { GameOverScene } from "./gameoverscene.js";
import {VictoryScene} from "./VictoryScene.js"

let config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    scene: [Start, niveles, Level1,Level3, GameOverScene,VictoryScene],
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 },
            debug: false 
        }
    },
};

let game = new Phaser.Game(config);
