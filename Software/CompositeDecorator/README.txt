SyncArena — Mezcla Composite + Decorator (personajes, armas y objetos)
====================================================================

Archivos:
- entidadComponente.js          -> Interfaz comun a hojas, Grupo y decoradores
- entidadesHoja.js              -> Hojas: Personaje, Arma, Objeto
- grupo.js                      -> Composite: Grupo (contiene hojas u otros Grupos)
- efectoDecorator.js            -> Decorator abstracto (envuelve hojas O Grupos enteros)
- efectosConcretos.js           -> Escudo, VelocidadExtra, Invisibilidad, AuraLiderazgo
- composite_decorator.test.js   -> 10 pruebas con el test runner nativo de Node
- demoCompositeDecorator.js     -> Demo: escuadra mixta con efectos que expiran por turnos

Como ejecutar:
1. Requiere Node.js 18+ (probado con Node 22)
2. Correr todas las pruebas:      node --test
3. Correr la demo:                node demoCompositeDecorator.js

No requiere `npm install`, no usa dependencias externas.
