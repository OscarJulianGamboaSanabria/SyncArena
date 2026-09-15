SyncArena — Patron Prototype (spawn de enemigos y power-ups)
================================================================

Archivos:
- entidadPrototype.js      -> Clase base: mecanismo generico de clonacion (clonar())
- entidadesConcretas.js    -> Prototipos concretos: EnemigoZombie, EnemigoRobotArtillero,
                               PowerUpVida, PowerUpEscudoTemporal
- spawnRegistry.js         -> Registro que crea un prototipo por tipo (una sola vez) y
                               resuelve cada spawn clonandolo
- spawnRegistry.test.js    -> 10 pruebas con el test runner nativo de Node
- demoSpawn.js             -> Demo ejecutable de uso

Como ejecutar:
1. Requiere Node.js 18+ (probado con Node 22)
2. Correr todas las pruebas:      node --test
3. Correr la demo:                node demoSpawn.js

No requiere `npm install`, no usa dependencias externas.
