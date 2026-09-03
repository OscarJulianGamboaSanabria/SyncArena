/**
 * singleton.js
 * ------------
 * Utilidad genérica para aplicar el patrón Singleton a cualquier clase
 * del motor SyncArena (GameServerManager, ConnectionPool, ConfigManager,
 * Logger, etc), sin repetir la lógica de "una sola instancia" en cada una.
 *
 * Nota sobre concurrencia en JS:
 * A diferencia de Python, JavaScript (Node.js) ejecuta el código en un
 * solo hilo con un event loop. Por eso aquí no hace falta un "lock" como
 * en la versión Python: no pueden existir dos llamadas a getInstance()
 * ejecutándose en el mismo instante. Aun así, esta utilidad se probó
 * lanzando muchas creaciones concurrentes (vía Promise.all) para
 * confirmar que todas resuelven a la misma instancia.
 */

function crearSingleton(ClaseBase) {
  let instancia = null;

  return class extends ClaseBase {
    constructor(...args) {
      if (instancia) {
        // Si ya existe una instancia, la devolvemos en vez de crear otra.
        // eslint-disable-next-line no-constructor-return
        return instancia;
      }
      super(...args);
      instancia = this;
    }

    /**
     * Utilidad SOLO para pruebas: permite "olvidar" la instancia guardada
     * para poder probar la clase desde cero en cada test. No debería
     * usarse en código de producción.
     */
    static resetInstance() {
      instancia = null;
    }
  };
}

module.exports = { crearSingleton };
