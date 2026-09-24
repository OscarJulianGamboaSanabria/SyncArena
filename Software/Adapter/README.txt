SyncArena — Patron Adapter (PhysicsAdapter)
==============================================

Archivos:
- motorFisico.js            -> Interfaz objetivo que el motor espera de cualquier backend de fisica
- libsExternas.js           -> Dos librerias de terceros SIMULADAS con APIs incompatibles entre si
                                (LitePhysicsEngine y ArcadePhysicsLib)
- physicsAdapters.js        -> Los adapters: LitePhysicsAdapter y ArcadePhysicsAdapter
                                (el aporte principal)
- physicsAdapters.test.js   -> 12 pruebas con el test runner nativo de Node
- demoPhysics.js            -> Demo ejecutable: mismo codigo cliente, dos backends distintos

Como ejecutar:
1. Requiere Node.js 18+ (probado con Node 22)
2. Correr todas las pruebas:      node --test
3. Correr la demo:                node demoPhysics.js

No requiere `npm install`, no usa dependencias externas.
