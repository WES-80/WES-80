TARGET := wasm32-unknown-unknown
WASMBIN := target/$(TARGET)/release/controller.wasm

all: build

serve: build
	python3 server.py

build:
	cargo build --target $(TARGET) --release
	wasm-strip $(WASMBIN)
	mkdir -p www/
	wasm-opt -o www/cartridge.wasm -Oz $(WASMBIN)
	ls -lh www/cartridge.wasm

clean:
	cargo clean
	rm -rf www/cartridge.wasm

.DEFAULT_GOAL := all
.PHONY: all build clean
