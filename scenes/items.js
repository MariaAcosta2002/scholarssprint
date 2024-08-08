export class Items {
    constructor(scene) {
        this.myScene = scene;
        this.GlodMoneda = 0; // Corregido el nombre de la variable
    }

    preload() {
        // Aquí puedes agregar cargas adicionales si es necesario
    }

    create() {
        // Aquí puedes agregar creaciones adicionales si es necesario
    }

    recolectaMonedas(data) {
        this.GlodMoneda++; // Incrementa el contador de monedas normales
        return true;
    }

    recolectaMonedaF(data) {
        // Lógica para ganar el juego al recolectar la moneda especial (MonedaF)
        this.myScene.scene.start('VictoryScene'); // Inicia la escena de victoria
        return true;
    }

    getGoldMoneda() {
        return this.GlodMoneda; // Retorna el número de monedas normales recolectadas
    }
}
