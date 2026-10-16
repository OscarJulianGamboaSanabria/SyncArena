/**
 * dispositivoEntrada.js
 * ------------------------
 * Esta interfaz cumple DOS roles al mismo tiempo, que es justamente
 * el punto de mezclar Adapter y Bridge:
 *
 * - Es el "target" del patrón Adapter: cada dispositivo real
 *   (teclado, mando, pantalla táctil) tiene su propia API nativa
 *   incompatible, y un Adapter distinto por dispositivo la traduce
 *   hacia esta interfaz común.
 * - Es, a la vez, el "Implementor" del patrón Bridge: el esquema de
 *   controles (ver esquemaControl.js) no conoce ningún dispositivo
 *   concreto, solo conoce esta interfaz, y le pregunta por el estado
 *   normalizado de la entrada.
 *
 * Esa doble función es lo que permite que CUALQUIER combinación de
 * dispositivo x esquema de controles funcione sin una línea de código
 * adicional por combinación.
 */

class DispositivoEntrada {
  // Devuelve siempre la misma forma normalizada, sin importar el
  // dispositivo real: ejes en el rango [-1, 1] y acciones como boolean.
  leerEstado() {
    throw new Error("leerEstado() debe implementarse en el adapter concreto.");
  }

  nombre() {
    throw new Error("nombre() debe implementarse en el adapter concreto.");
  }
}

module.exports = { DispositivoEntrada };
