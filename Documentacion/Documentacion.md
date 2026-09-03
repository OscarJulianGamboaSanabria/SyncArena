# 🎮 SyncArena — Motor de Juegos Multijugador

# Semana Contextualización

> Un motor diseñado desde cero para dar vida a experiencias de juego en tiempo real, conectando a miles de jugadores en un mismo mundo compartido.
 <br>
**Alumnos:** <br>
Oscar Julian Gamboa Sanabria
 Jesus Javier Garcia Rojas

**Lenguaje Utilizado:** JavaScript

## 📖 ¿Qué es esto?

Un **motor de juegos multijugador** es la infraestructura de software que permite que varios jugadores interactúen entre sí, en tiempo real, dentro de un mismo entorno virtual. A diferencia de un motor de juego "tradicional" (enfocado en gráficos, físicas y renderizado local), un motor multijugador resuelve un problema mucho más complejo: **mantener sincronizado el estado del juego entre todos los clientes conectados, con la menor latencia posible y sin dar ventaja a nadie.**

Este proyecto busca construir esa base: un núcleo robusto, escalable y extensible sobre el cual se puedan montar distintos tipos de juegos (shooters, MOBAs, juegos casuales, etc.) sin tener que reinventar la rueda cada vez.

**SyncArena** nace justamente de esa idea: una **arena** donde todos los jugadores están perfectamente **sincronizados**, sin importar cuántos sean ni desde dónde se conecten. ⚡

---

## 🚀 Objetivo del Proyecto

Desarrollar un **motor de juegos multijugador** con foco en cuatro pilares fundamentales:

### 1. 🕹️ Gestión de partidas, jugadores y rankings

Sistema encargado de la creación, emparejamiento (_matchmaking_) y ciclo de vida de las partidas, así como del seguimiento de estadísticas y tablas de clasificación (_leaderboards_) que reflejan el desempeño de cada jugador.

### 2. 💬 Sistema de chat y comunidades

Módulo de comunicación en tiempo real entre jugadores, incluyendo chat de partida, chat global y la posibilidad de formar comunidades, clanes o grupos persistentes dentro del juego.

### 3. 💰 Microtransacciones y sistema de recompensas

Infraestructura económica del juego: compras dentro de la aplicación, monedas virtuales, tiendas y un sistema de recompensas (logros, misiones diarias, cofres, etc.) que mantiene el _engagement_ de los jugadores.

### 4. 📊 Escalabilidad para miles de jugadores concurrentes

Arquitectura pensada para crecer horizontalmente, distribuyendo la carga entre múltiples servidores y garantizando estabilidad incluso en picos masivos de usuarios conectados.

# Semana 3 — Singleton

## Aporte técnico: Patrón de diseño Singleton (versión JavaScript / Node.js) aplicado a la gestión de partidas, jugadores y ranking

**Alumnos:** Oscar Julian Gamboa Sanabria — Jesus Javier Garcia Rojas
**Módulo:** Gestión de partidas, jugadores y rankings 
**Patrón aportado:** Singleton (vía closure + clase)
**Pruebas:** node:test (test runner nativo de Node, sin dependencias externas)

---

## 1. ¿Qué es el patrón Singleton?

Singleton es un patrón de diseño creacional que garantiza que una clase tenga una única instancia durante toda la ejecución del programa, y ofrece un punto de acceso global a esa instancia. Cualquier parte del sistema que pida un objeto de esa clase recibe siempre la misma referencia, en lugar de crear copias independientes.

---

## 2. ¿Por qué aporta valor a SyncArena?

El objetivo central del proyecto es mantener sincronizado el estado del juego entre todos los clientes conectados. Eso solo es posible si existe un único punto de verdad para ese estado. Si el módulo de matchmaking, el de chat y el de ranking crearan cada uno su propia copia del gestor de partidas, el estado se desincronizaría entre jugadores — exactamente el problema que el proyecto busca resolver.

El aporte concreto de este documento es la clase `GameServerManager`, responsable del pilar 1 ("Gestión de partidas, jugadores y rankings"). Se implementa como Singleton mediante una función de orden superior reutilizable (`crearSingleton`), de forma que otros gestores del motor (conexión de red, configuración del servidor, logging) puedan adoptar el mismo mecanismo sin duplicar código.

### Nota sobre concurrencia en JavaScript

A diferencia de una versión en un lenguaje multihilo, Node.js ejecuta el código en un único hilo con un event loop: dos llamadas a `new GameServerManager()` nunca se ejecutan literalmente al mismo tiempo, así que no hace falta un mecanismo de bloqueo ("lock"). Aun así, se probó el escenario con 50 creaciones lanzadas de forma concurrente vía `Promise.all` para confirmar que todas resuelven a la misma instancia, incluso cuando hay trabajo asíncrono de por medio.

### Consideración honesta

Singleton es un patrón útil pero también criticado: si se abusa de él, genera estado global oculto y dificulta las pruebas unitarias. Por eso esta implementación incluye un método estático `resetInstance()` pensado solo para pruebas, y se recomienda reservar el patrón para gestores realmente únicos por servidor (partidas, conexiones, configuración), no para cualquier clase del motor.

---

## 3. Diagrama del mecanismo
![[Pasted image 20260903083338.png]]

```
Matchmaking      Chat      Ranking / Economía
      \            |            /
       \           |           /
        v          v          v
        GameServerManager
        (Singleton — una sola instancia)
        Estado compartido: partidas,
        jugadores, ranking
```

Los tres módulos piden cada uno su propia referencia con `new GameServerManager()`, pero el closure del Singleton hace que todos reciban el mismo objeto en memoria y, por lo tanto, vean siempre el mismo estado.

---

## 4. Implementación

### 4.1 Utilidad Singleton reutilizable — `singleton.js`

```javascript
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
```

### 4.2 Aplicación concreta — `gameServerManager.js`

```javascript
/**
 * gameServerManager.js
 * ---------------------
 * Aporte concreto al pilar "Gestión de partidas, jugadores y rankings"
 * de SyncArena, usando el patrón Singleton.
 *
 * Por qué Singleton aquí:
 * En un motor multijugador debe existir UN solo punto de verdad que sepa
 * qué partidas están activas, qué jugadores están conectados y cuál es
 * el ranking global. Si cada módulo (chat, matchmaking, economía) creara
 * su propia copia de este gestor, el estado se desincronizaría entre
 * jugadores -> justo el problema que SyncArena busca evitar.
 */
const { crearSingleton } = require("./singleton");

class Partida {
  constructor(idPartida) {
    this.idPartida = idPartida;
    this.jugadores = [];
    this.estado = "esperando"; // esperando | en_curso | finalizada
  }
}

class GameServerManagerBase {
  constructor() {
    this._partidas = new Map();
    this._jugadoresConectados = [];
    this._ranking = new Map();
  }

  // ---------- Gestión de partidas ----------
  crearPartida(idPartida) {
    if (this._partidas.has(idPartida)) {
      throw new Error(`La partida '${idPartida}' ya existe.`);
    }
    const partida = new Partida(idPartida);
    this._partidas.set(idPartida, partida);
    return partida;
  }

  unirJugadorAPartida(idPartida, jugador) {
    const partida = this._partidas.get(idPartida);
    if (!partida) {
      throw new Error(`La partida '${idPartida}' no existe.`);
    }
    if (!partida.jugadores.includes(jugador)) {
      partida.jugadores.push(jugador);
    }
  }

  finalizarPartida(idPartida) {
    const partida = this._partidas.get(idPartida);
    if (!partida) {
      throw new Error(`La partida '${idPartida}' no existe.`);
    }
    partida.estado = "finalizada";
  }

  obtenerPartida(idPartida) {
    return this._partidas.get(idPartida);
  }

  // ---------- Gestión de jugadores conectados ----------
  conectarJugador(jugador) {
    if (!this._jugadoresConectados.includes(jugador)) {
      this._jugadoresConectados.push(jugador);
    }
    if (!this._ranking.has(jugador)) {
      this._ranking.set(jugador, 0);
    }
  }

  desconectarJugador(jugador) {
    this._jugadoresConectados = this._jugadoresConectados.filter(
      (j) => j !== jugador
    );
  }

  jugadoresConectados() {
    return [...this._jugadoresConectados];
  }

  // ---------- Ranking ----------
  sumarPuntos(jugador, puntos) {
    const actual = this._ranking.get(jugador) || 0;
    this._ranking.set(jugador, actual + puntos);
  }

  obtenerRanking() {
    return [...this._ranking.entries()].sort((a, b) => b[1] - a[1]);
  }
}

// Aplicamos el Singleton genérico sobre la clase base
const GameServerManager = crearSingleton(GameServerManagerBase);

module.exports = { GameServerManager };
```

---

## 5. Pruebas de funcionamiento

Se implementaron 8 pruebas con el test runner nativo de Node (`node:test` + `assert`, sin dependencias externas como Jest), divididas en dos grupos: (a) pruebas que verifican el comportamiento del propio patrón Singleton (misma instancia, estado compartido, creaciones concurrentes) y (b) pruebas que verifican la lógica de negocio del gestor (partidas, jugadores, ranking).

### 5.1 Código de pruebas — `gameServerManager.test.js`

```javascript
/**
 * gameServerManager.test.js
 * ---------------------------
 * Pruebas de funcionamiento para el aporte Singleton de SyncArena en JS.
 * Usa el test runner nativo de Node (node:test) + assert, sin dependencias
 * externas.
 *
 * Ejecutar con: node --test
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const { GameServerManager } = require("./gameServerManager");

// ---------- Comportamiento del patrón Singleton ----------

test("misma instancia en llamadas repetidas", () => {
  GameServerManager.resetInstance();
  const instancia1 = new GameServerManager();
  const instancia2 = new GameServerManager();
  assert.strictEqual(instancia1, instancia2);
});

test("estado compartido entre referencias", () => {
  GameServerManager.resetInstance();
  const instancia1 = new GameServerManager();
  instancia1.conectarJugador("Oscar");
  const instancia2 = new GameServerManager(); // "otra" referencia
  assert.ok(instancia2.jugadoresConectados().includes("Oscar"));
});

test("una sola instancia con creaciones concurrentes (Promise.all)", async () => {
  GameServerManager.resetInstance();
  const crearInstanciaAsync = () =>
    new Promise((resolve) => {
      // Simula trabajo asíncrono antes de crear la instancia
      setImmediate(() => resolve(new GameServerManager()));
    });

  const instancias = await Promise.all(
    Array.from({ length: 50 }, () => crearInstanciaAsync())
  );

  const referenciaUnica = instancias[0];
  const todasIguales = instancias.every((i) => i === referenciaUnica);
  assert.ok(todasIguales, "Se crearon múltiples instancias del Singleton");
});

// ---------- Lógica de negocio del GameServerManager ----------

test("crear partida y unir jugadores", () => {
  GameServerManager.resetInstance();
  const gestor = new GameServerManager();
  gestor.crearPartida("partida_1");
  gestor.unirJugadorAPartida("partida_1", "Oscar");
  gestor.unirJugadorAPartida("partida_1", "Jesus");
  const partida = gestor.obtenerPartida("partida_1");
  assert.deepStrictEqual(partida.jugadores, ["Oscar", "Jesus"]);
  assert.strictEqual(partida.estado, "esperando");
});

test("no permite partidas duplicadas", () => {
  GameServerManager.resetInstance();
  const gestor = new GameServerManager();
  gestor.crearPartida("partida_1");
  assert.throws(() => gestor.crearPartida("partida_1"), /ya existe/);
});

test("finalizar partida", () => {
  GameServerManager.resetInstance();
  const gestor = new GameServerManager();
  gestor.crearPartida("partida_1");
  gestor.finalizarPartida("partida_1");
  assert.strictEqual(gestor.obtenerPartida("partida_1").estado, "finalizada");
});

test("conectar y desconectar jugador", () => {
  GameServerManager.resetInstance();
  const gestor = new GameServerManager();
  gestor.conectarJugador("Oscar");
  assert.ok(gestor.jugadoresConectados().includes("Oscar"));
  gestor.desconectarJugador("Oscar");
  assert.ok(!gestor.jugadoresConectados().includes("Oscar"));
});

test("ranking se ordena de mayor a menor", () => {
  GameServerManager.resetInstance();
  const gestor = new GameServerManager();
  gestor.conectarJugador("Oscar");
  gestor.conectarJugador("Jesus");
  gestor.sumarPuntos("Oscar", 50);
  gestor.sumarPuntos("Jesus", 120);
  gestor.sumarPuntos("Oscar", 30); // Oscar queda con 80
  const ranking = gestor.obtenerRanking();
  assert.deepStrictEqual(ranking[0], ["Jesus", 120]);
  assert.deepStrictEqual(ranking[1], ["Oscar", 80]);
});
```

### 5.2 Resultado real de la ejecución (`node --test`)
**Comando ejecucion desde carpeta Software:**
```
node --test Singleton/gameServerManager.test.js
```
![[Pasted image 20260903085119.png]]

Las 8 pruebas pasaron correctamente (8 pass, 0 fail), incluyendo la prueba con 50 creaciones lanzadas de forma concurrente vía `Promise.all`, lo que confirma que la implementación resuelve siempre a la misma instancia — un requisito realista para un servidor de juego con miles de jugadores conectados.

---

## 6. Demostración de uso entre módulos

El script `demoUso.js` simula tres módulos distintos (matchmaking, chat y ranking) pidiendo cada uno su propia instancia de `GameServerManager`, sin pasársela por parámetro. La salida real confirma con `===` (comparación de referencia) que el objeto es el mismo antes y después, y que el módulo de chat ve los jugadores que agregó matchmaking sin que se le haya informado directamente.

```
¿instancia1 === nueva llamada? true
[chat] Jugadores en arena_01: [ 'OscarJulian', 'JesusJavier' ]
[ranking] Tabla actual: [ [ 'JesusJavier', 150 ], [ 'OscarJulian', 100 ] ]
¿instancia1 === instancia2 (tras usar los módulos)? true
```

---

## 7. Conclusión

El patrón Singleton aporta al proyecto SyncArena un mecanismo simple y probado para resolver uno de sus problemas centrales: mantener un único estado consistente de partidas, jugadores y ranking, accesible desde cualquier módulo del motor sin riesgo de duplicación ni desincronización. La utilidad implementada en JavaScript es reutilizable para futuros gestores del proyecto (conexiones de red, configuración del servidor, logging), manteniendo el principio de no reinventar la rueda que persigue SyncArena.

# Semana 4 — Factory Method

## Aporte técnico: Patrón de diseño Factory Method aplicado al sistema de notificaciones

**Patrón aportado:** Factory Method (notificaciones)
**Lenguaje:** JavaScript (Node.js 22) 
**Pruebas:** node:test (test runner nativo de Node, sin dependencias externas)

---

## 1. ¿Qué es el patrón Factory Method?

Factory Method es un patrón de diseño creacional que define una interfaz común para crear objetos, pero deja que sean las subclases quienes decidan qué clase concreta instanciar. El código cliente trabaja siempre contra la clase abstracta (el "creador") y su producto, sin conocer las clases concretas creadas por dentro.

---

## 2. ¿Por qué aporta valor a SyncArena?

El motor necesita enviar notificaciones de tipos muy distintos: logros desbloqueados, invitaciones a partida, mensajes de chat, confirmaciones de compra — y es muy probable que en el futuro se agreguen más (misiones diarias, eventos de clan, etc). Si el código cliente decidiera con un if/switch gigante qué clase instanciar cada vez, cada tipo nuevo obligaría a tocar ese bloque en varios lugares del proyecto.

Con Factory Method, cada tipo de notificación tiene su propio **creador concreto** (`CreadorNotificacionLogro`, `CreadorNotificacionInvitacionPartida`, `CreadorNotificacionMensajeChat`, `CreadorNotificacionCompra`) que sabe construir su producto. El resto del motor solo conoce la clase abstracta `NotificacionCreator` y su método plantilla `notificar()`.

Agregar un tipo nuevo significa crear una clase nueva, no modificar código existente.

### Consideración honesta

Factory Method agrega una jerarquía de clases (un creador y un producto por tipo), lo cual es más código que un simple switch. Para 2 o 3 tipos fijos que jamás van a cambiar, esa complejidad extra puede no justificarse; aquí se justifica porque el catálogo de notificaciones de un juego en vivo crece constantemente.

---

## 3. Diagrama del mecanismo

Las flechas sólidas representan herencia (cada creador concreto extiende `NotificacionCreator`); las líneas punteadas representan qué producto construye cada creador. El código cliente solo conoce la caja superior e inferior, nunca las clases concretas del medio.
![[Pasted image 20260903083711.png]]

```
                  NotificacionCreator (abstracto)
                  + crearNotificacion(datos)   <- Factory Method
                  + notificar(datos)           <- método plantilla
                            ^
        ┌───────────────────┼───────────────────┬─────────────────────┐
        |                   |                   |                     |
CreadorNotificacionLogro  CreadorNotificacionInvitacionPartida  CreadorNotificacionMensajeChat  CreadorNotificacionCompra
        ┊                   ┊                   ┊                     ┊
        v                   v                   v                     v
 NotificacionLogro  NotificacionInvitacionPartida  NotificacionMensajeChat  NotificacionCompra
```

---

## 4. Implementación

### 4.1 Productos — `notificacion.js`

```javascript
/**
 * notificacion.js
 * ----------------
 * "Productos" del patrón Factory Method aplicado al envío de
 * notificaciones dentro de SyncArena.
 *
 * Todas las notificaciones comparten la misma interfaz (enviar,
 * obtenerResumen), pero cada una arma su contenido y su canal de
 * envío de forma distinta. Esta es la parte "variable" que el
 * Factory Method se encarga de ocultar del código cliente.
 */

class Notificacion {
  constructor(destinatario) {
    if (new.target === Notificacion) {
      throw new Error("Notificacion es abstracta, no se puede instanciar directamente.");
    }
    this.destinatario = destinatario;
    this.fecha = new Date();
  }

  // Cada subclase debe implementar cómo arma su mensaje
  obtenerMensaje() {
    throw new Error("obtenerMensaje() debe implementarse en la subclase.");
  }

  // Cada subclase debe decir por qué canal se envía
  obtenerCanal() {
    throw new Error("obtenerCanal() debe implementarse en la subclase.");
  }

  // Comportamiento común: "enviar" simplemente arma el paquete final.
  // (Aquí se simula el envío; en producción se conectaría con push,
  // websockets, correo, etc.)
  enviar() {
    const paquete = {
      canal: this.obtenerCanal(),
      destinatario: this.destinatario,
      mensaje: this.obtenerMensaje(),
      fecha: this.fecha.toISOString(),
    };
    return paquete;
  }
}

class NotificacionLogro extends Notificacion {
  constructor(destinatario, nombreLogro) {
    super(destinatario);
    this.nombreLogro = nombreLogro;
  }

  obtenerMensaje() {
    return `¡Desbloqueaste el logro "${this.nombreLogro}"!`;
  }

  obtenerCanal() {
    return "push";
  }
}

class NotificacionInvitacionPartida extends Notificacion {
  constructor(destinatario, idPartida, jugadorQueInvita) {
    super(destinatario);
    this.idPartida = idPartida;
    this.jugadorQueInvita = jugadorQueInvita;
  }

  obtenerMensaje() {
    return `${this.jugadorQueInvita} te invitó a la partida ${this.idPartida}.`;
  }

  obtenerCanal() {
    return "in_game";
  }
}

class NotificacionMensajeChat extends Notificacion {
  constructor(destinatario, remitente, textoPreview) {
    super(destinatario);
    this.remitente = remitente;
    this.textoPreview = textoPreview;
  }

  obtenerMensaje() {
    return `${this.remitente}: ${this.textoPreview}`;
  }

  obtenerCanal() {
    return "in_game";
  }
}

class NotificacionCompra extends Notificacion {
  constructor(destinatario, item, monto) {
    super(destinatario);
    this.item = item;
    this.monto = monto;
  }

  obtenerMensaje() {
    return `Compra confirmada: ${this.item} por $${this.monto}.`;
  }

  obtenerCanal() {
    return "email";
  }
}

module.exports = {
  Notificacion,
  NotificacionLogro,
  NotificacionInvitacionPartida,
  NotificacionMensajeChat,
  NotificacionCompra,
};
```

### 4.2 Creadores (Factory Method) — `notificacionCreator.js`

```javascript
/**
 * notificacionCreator.js
 * ------------------------
 * Patrón Factory Method aplicado al sistema de notificaciones de
 * SyncArena.
 *
 * Por qué Factory Method aquí:
 * El motor necesita enviar notificaciones de tipos muy distintos
 * (logros, invitaciones a partida, mensajes de chat, confirmaciones
 * de compra) y es muy probable que en el futuro se agreguen más tipos
 * (misiones diarias, eventos de clan, etc). Si el código cliente
 * decidiera con un `if/switch` gigante qué clase instanciar cada vez,
 * cada nuevo tipo de notificación obligaría a tocar ese código en
 * muchos lugares.
 *
 * Con Factory Method, cada tipo de notificación tiene su propio
 * "Creador" que sabe cómo construir su producto. El código cliente
 * solo conoce la clase abstracta `NotificacionCreator` y su método
 * `notificar()`; no necesita saber qué clase concreta de notificación
 * se está creando por dentro.
 */
const {
  NotificacionLogro,
  NotificacionInvitacionPartida,
  NotificacionMensajeChat,
  NotificacionCompra,
} = require("./notificacion");

/**
 * Creador abstracto. Define el "método plantilla" notificar(), que
 * usa el factory method crearNotificacion() sin saber qué subclase
 * de Notificacion se va a construir.
 */
class NotificacionCreator {
  // --- Factory Method: cada subclase concreta lo sobrescribe ---
  crearNotificacion(datos) {
    throw new Error("crearNotificacion() debe implementarse en la subclase.");
  }

  // --- Lógica común a TODOS los tipos de notificación ---
  notificar(datos) {
    const notificacion = this.crearNotificacion(datos);
    const paquete = notificacion.enviar();
    return paquete;
  }
}

class CreadorNotificacionLogro extends NotificacionCreator {
  crearNotificacion({ destinatario, nombreLogro }) {
    return new NotificacionLogro(destinatario, nombreLogro);
  }
}

class CreadorNotificacionInvitacionPartida extends NotificacionCreator {
  crearNotificacion({ destinatario, idPartida, jugadorQueInvita }) {
    return new NotificacionInvitacionPartida(destinatario, idPartida, jugadorQueInvita);
  }
}

class CreadorNotificacionMensajeChat extends NotificacionCreator {
  crearNotificacion({ destinatario, remitente, textoPreview }) {
    return new NotificacionMensajeChat(destinatario, remitente, textoPreview);
  }
}

class CreadorNotificacionCompra extends NotificacionCreator {
  crearNotificacion({ destinatario, item, monto }) {
    return new NotificacionCompra(destinatario, item, monto);
  }
}

/**
 * Registro de creadores disponibles por tipo. Esto es solo un punto
 * de entrada cómodo para el resto del motor; el patrón Factory Method
 * en sí vive en las clases de arriba.
 */
const creadoresPorTipo = {
  logro: new CreadorNotificacionLogro(),
  invitacion_partida: new CreadorNotificacionInvitacionPartida(),
  mensaje_chat: new CreadorNotificacionMensajeChat(),
  compra: new CreadorNotificacionCompra(),
};

function obtenerCreador(tipo) {
  const creador = creadoresPorTipo[tipo];
  if (!creador) {
    throw new Error(`No existe un creador de notificaciones para el tipo '${tipo}'.`);
  }
  return creador;
}

module.exports = {
  NotificacionCreator,
  CreadorNotificacionLogro,
  CreadorNotificacionInvitacionPartida,
  CreadorNotificacionMensajeChat,
  CreadorNotificacionCompra,
  obtenerCreador,
};
```

---

## 5. Pruebas de funcionamiento

9 pruebas con `node:test`: cada creador construye el producto correcto, el creador abstracto no puede usarse sin sobrescribir `crearNotificacion()`, `obtenerCreador()` resuelve bien por tipo, y el método plantilla `notificar()` produce el paquete esperado para cada tipo — incluyendo una prueba de código cliente polimórfico.

### 5.1 Código de pruebas — `notificacionCreator.test.js`

```javascript
/**
 * notificacionCreator.test.js
 * -----------------------------
 * Pruebas de funcionamiento para el Factory Method de notificaciones
 * de SyncArena. Usa el test runner nativo de Node (node:test).
 *
 * Ejecutar con: node --test
 */
const test = require("node:test");
const assert = require("node:assert/strict");

const {
  NotificacionLogro,
  NotificacionInvitacionPartida,
  NotificacionMensajeChat,
  NotificacionCompra,
} = require("./notificacion");

const {
  NotificacionCreator,
  CreadorNotificacionLogro,
  CreadorNotificacionCompra,
  obtenerCreador,
} = require("./notificacionCreator");

// ---------- Comportamiento del patrón Factory Method ----------

test("el creador de logros construye una NotificacionLogro", () => {
  const creador = new CreadorNotificacionLogro();
  const notificacion = creador.crearNotificacion({
    destinatario: "Oscar",
    nombreLogro: "Primera victoria",
  });
  assert.ok(notificacion instanceof NotificacionLogro);
});

test("no se puede instanciar el creador abstracto sin sobrescribir crearNotificacion", () => {
  const creadorBase = new NotificacionCreator();
  assert.throws(
    () => creadorBase.crearNotificacion({}),
    /debe implementarse en la subclase/
  );
});

test("obtenerCreador() devuelve el creador correcto según el tipo", () => {
  const creador = obtenerCreador("compra");
  assert.ok(creador instanceof CreadorNotificacionCompra);
});

test("obtenerCreador() lanza error si el tipo no existe", () => {
  assert.throws(() => obtenerCreador("tipo_inventado"), /No existe un creador/);
});

// ---------- El método plantilla notificar() funciona igual para todos ----------

test("notificar() de logro arma el paquete con canal push", () => {
  const creador = obtenerCreador("logro");
  const paquete = creador.notificar({ destinatario: "Oscar", nombreLogro: "Primera victoria" });
  assert.strictEqual(paquete.canal, "push");
  assert.strictEqual(paquete.destinatario, "Oscar");
  assert.match(paquete.mensaje, /Primera victoria/);
});

test("notificar() de invitación a partida arma el paquete con canal in_game", () => {
  const creador = obtenerCreador("invitacion_partida");
  const paquete = creador.notificar({
    destinatario: "Jesus",
    idPartida: "arena_01",
    jugadorQueInvita: "Oscar",
  });
  assert.strictEqual(paquete.canal, "in_game");
  assert.match(paquete.mensaje, /Oscar te invitó/);
});

test("notificar() de mensaje de chat arma el paquete con canal in_game", () => {
  const creador = obtenerCreador("mensaje_chat");
  const paquete = creador.notificar({
    destinatario: "Jesus",
    remitente: "Oscar",
    textoPreview: "¿Listo para la partida?",
  });
  assert.strictEqual(paquete.canal, "in_game");
  assert.match(paquete.mensaje, /¿Listo para la partida\?/);
});

test("notificar() de compra arma el paquete con canal email", () => {
  const creador = obtenerCreador("compra");
  const paquete = creador.notificar({ destinatario: "Oscar", item: "Skin Dragón", monto: 9.99 });
  assert.strictEqual(paquete.canal, "email");
  assert.match(paquete.mensaje, /Skin Dragón/);
});

// ---------- El código cliente no necesita conocer la clase concreta ----------

test("código cliente polimórfico: procesa notificaciones sin conocer su clase concreta", () => {
  const solicitudes = [
    { tipo: "logro", datos: { destinatario: "Oscar", nombreLogro: "Racha x10" } },
    {
      tipo: "invitacion_partida",
      datos: { destinatario: "Jesus", idPartida: "arena_02", jugadorQueInvita: "Oscar" },
    },
  ];

  const paquetes = solicitudes.map(({ tipo, datos }) => obtenerCreador(tipo).notificar(datos));

  assert.strictEqual(paquetes.length, 2);
  paquetes.forEach((paquete) => {
    assert.ok("canal" in paquete);
    assert.ok("mensaje" in paquete);
  });
});
```

### 5.2 Resultado real de la ejecución (`node --test`)
**Comando ejecucion desde carpeta Software:**
```
node --test FactoryMethod/notificacionCreator.test.js
```

![[Pasted image 20260903084709.png]]

---

## 6. Demostración de uso

El script `demoNotificaciones.js` simula 4 eventos distintos del motor y los despacha con `obtenerCreador(tipo).notificar(datos)`, sin que el código cliente mencione ninguna clase concreta de notificación.

```
[push] -> Oscar: ¡Desbloqueaste el logro "Primera victoria"!
[in_game] -> Jesus: Oscar te invitó a la partida arena_01.
[in_game] -> Oscar: Jesus: ¿Vamos de nuevo?
[email] -> Jesus: Compra confirmada: Skin Dragón por $9.99.
```