/**
 * demoControles.js
 * -------------------
 * Demo ejecutable (no es una prueba formal) que arma la matriz
 * completa de 3 dispositivos (cada uno pasado por su Adapter) x 3
 * esquemas de controles (Bridge), y además muestra el cambio de
 * dispositivo en caliente sin perder el esquema activo.
 */

const { TecladoNativo, MandoNativo, PantallaTactilNativa } = require("./dispositivosNativos");
const { TecladoAdapter, MandoAdapter, PantallaTactilAdapter } = require("./adaptadoresDispositivo");
const { EsquemaEstandar, EsquemaInvertido, EsquemaAccesibilidad } = require("./esquemasConcretos");

// Tres dispositivos "físicos" distintos, todos empujando hacia
// arriba-derecha en mayor o menor medida
const teclado = new TecladoNativo();
teclado.presionar("d");
teclado.presionar("w");

const mando = new MandoNativo();
mando.moverStickIzquierdo(0.7, 0.7);

const pantalla = new PantallaTactilNativa(50);
pantalla.arrastrarJoystickVirtual(35, 35);

const dispositivos = [
  ["teclado", new TecladoAdapter(teclado)],
  ["mando", new MandoAdapter(mando)],
  ["pantalla táctil", new PantallaTactilAdapter(pantalla)],
];

const esquemas = [
  ["EsquemaEstandar", EsquemaEstandar],
  ["EsquemaInvertido", EsquemaInvertido],
  ["EsquemaAccesibilidad", EsquemaAccesibilidad],
];

console.log("Matriz de combinaciones (dispositivo x esquema de controles):\n");
for (const [nombreDispositivo, dispositivo] of dispositivos) {
  for (const [nombreEsquema, Esquema] of esquemas) {
    const resultado = new Esquema(dispositivo).procesarEntrada();
    const mov = `x:${resultado.mover.x.toFixed(2)} y:${resultado.mover.y.toFixed(2)}`;
    console.log(`[${nombreDispositivo} + ${nombreEsquema}] mover(${mov})`);
  }
}

console.log("\n--- Cambio de dispositivo en caliente, mismo esquema de controles ---");
const esquemaJugador = new EsquemaInvertido(new TecladoAdapter(teclado));
console.log("Dispositivo inicial:", esquemaJugador.dispositivoActual());
console.log("Resultado:", esquemaJugador.procesarEntrada());

esquemaJugador.cambiarDispositivo(new MandoAdapter(mando));
console.log("\nDispositivo tras cambiarDispositivo():", esquemaJugador.dispositivoActual());
console.log("Resultado (mismo EsquemaInvertido, ahora con el mando):", esquemaJugador.procesarEntrada());
