SyncArena — Mezcla Facade + Decorator (arranque de partidas)
====================================================================

Archivos:
- subsistemas.js              -> ServicioRecursos, ServicioConexion, ServicioPartidas (simulados)
- partidaServicio.js          -> Interfaz comun: la implementan la fachada y los decoradores
- partidaFacade.js            -> Facade: iniciarPartida() carga recursos, crea la partida y
                                 conecta jugadores en una llamada (con rollback si algo falla)
- partidaDecorator.js         -> Decorator abstracto
- decoradoresConcretos.js     -> LoggingDecorator, MetricasDecorator, NotificacionesDecorator
- facade_decorator.test.js    -> 13 pruebas con el test runner nativo de Node
- demoFacadeDecorator.js      -> Demo ejecutable (reloj de metricas SIMULADO para que la
                                 salida sea reproducible)

Como ejecutar:
1. Requiere Node.js 18+ (probado con Node 22)
2. Correr todas las pruebas:      node --test
3. Correr la demo:                node demoFacadeDecorator.js

MetricasDecorator usa por defecto performance.now(); en las pruebas y en la demo se le
inyecta un reloj falso/simulado para no depender del tiempo real de la maquina.

No requiere `npm install`, no usa dependencias externas.
