import "./style.css";
import { editor } from "monaco-editor";
import wabt from "wabt";
import { registerWat } from "./editor-extensions";

const editorDiv = document.querySelector<HTMLDivElement>("#editor");
const consoleContainer =
  document.querySelector<HTMLDivElement>("#console-container");
const sizeStatusContainer =
  document.querySelector<HTMLDivElement>("#size-status");

const defaultModule = `(module
  (func $add (param $lhs i32) (param $rhs i32) (result i32)
    local.get $lhs
    local.get $rhs
    i32.add)
  (export "add" (func $add))
  (export "add_again" (func $add))
)`;

let codeEditor: editor.IStandaloneCodeEditor | undefined;

const setupDropTarget = () => {
  const dropTarget = document.querySelector("#editor-file-drop-target");
  if (dropTarget == null) throw new Error("Drop target not found");

  const dragEnter = () => dropTarget.classList.remove("display-none");
  const dragExit = () => dropTarget.classList.add("display-none");

  const dragOver = (e: Event) => e.preventDefault();
  const drop = async (e: Event) => {
    e.preventDefault();
    const ev = e as DragEvent;
    dragExit();

    if (ev.dataTransfer?.items) {
      const item = ev.dataTransfer.items[0];
      if (item.kind !== "file") {
        alert("Only WASM files are supported");
        return;
      }

      const file = item.getAsFile();
      const fileData = await file?.arrayBuffer();
      if (fileData == null) {
        alert("Could not read file");
        return;
      }

      await loadWasm(new Uint8Array(fileData));
    }
  };

  document.querySelector("body")?.addEventListener("dragenter", dragEnter);
  document.querySelector("body")?.addEventListener("dragexit", dragExit);
  dropTarget.addEventListener("dragover", dragOver);
  dropTarget.addEventListener("drop", drop);
};

const start = () => {
  if (editorDiv == null) {
    throw new Error("#editor element not found");
  }

  setupDropTarget();
  registerWat();

  codeEditor = editor.create(editorDiv, {
    value: defaultModule,
    language: "wat",
    minimap: {
      enabled: false,
    },
  });
};

const maxBytes = 80 * 1024;

const loadWasm = async (wasmBytes: Uint8Array) => {
  const wabtModule = await wabt();

  const result = wabtModule.readWasm(wasmBytes, {});
  const txt = result.toText({});
  codeEditor?.setValue(txt);
};

const buildAndRun = async () => {
  if (codeEditor == null) throw new Error("Code editor not found");

  const wabtModule = await wabt();

  let wasmModule;
  try {
    wasmModule = wabtModule.parseWat("wes80.wat", codeEditor.getValue());
  } catch (e) {
    alert(e);
    console.error(e);
    return;
  }

  const wasm = wasmModule.toBinary({ log: true });
  const instantiatedModule = await WebAssembly.instantiate(wasm.buffer);
  const bytes = wasm.buffer.length;

  sizeStatusContainer!.textContent = `${bytes} bytes (${
    Math.round((bytes / maxBytes) * 10000) / 100
  }% full)`;

  const exportedNames = Object.keys(instantiatedModule.instance.exports);
  console.log(instantiatedModule.instance.exports);
  consoleContainer!.innerHTML =
    "This doesn't actually run anything yet, but here's a list of exports from the compiled module<h4>Exports</h4><ul>" +
    exportedNames
      .map((e) => `<li>${e} - ${instantiatedModule.instance.exports[e]}</li>`)
      .join("") +
    "</ul>";
};

start();
document
  .querySelector("#build-and-run")!
  .addEventListener("click", buildAndRun);
