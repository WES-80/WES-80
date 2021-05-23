# Constraints

- Data embedded in WebAssembly module
- .wasm is fully self-contained, has everything needed to run a game/app
- 80kB binary format limit (including data sections)

# Roadmap - MVP
- V0.1 Spec
- Fixed size pixel output
- Keyboard input
- WAST text editor UI

# Runtime (core)
 
TODO(Christian)

# Runtime Frontend

TODO(Ben)

# Editor Frontend

TODO(Jordan)

# Test Modules

TODO(??)
 - It would be good to have a set of modules that test the IO, eg one for screen, one for controller input, that we can use while building the thing

# Module interface

```
// Metadata TODO(Ben)

Exports:
    init(): void;

    frame(): void; // Should be called 30 times per second (best effort)

    SCREEN: {
        // TODO(Josh)
    }

    CONTROLLER: {
        // TODO(Josh)
    }
```
