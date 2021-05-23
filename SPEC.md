# Constraints

- Data embedded in WebAssembly module
- .wasm is fully self-contained, has everything needed to run a game/app
- 80kB binary format limit (including data sections)

# Roadmap - MVP
- V0.1 Spec
- Fixed size pixel output
- Keyboard input
- WAST text editor UI

# Module interface
- Author and title somewhere in the file
## Exports
### Functions
 - Init function
 - Render frame function
### Structs
 - Inputs
 - PixelBuffer
