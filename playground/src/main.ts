import './style.css'
import {editor, languages} from 'monaco-editor';
import wabt from 'wabt';

const editorDiv = document.querySelector<HTMLDivElement>('#editor');
const consoleContainer = document.querySelector<HTMLDivElement>('#console-container');
const sizeStatusContainer = document.querySelector<HTMLDivElement>('#size-status');

const defaultModule = `(module
  (func $add (param $lhs i32) (param $rhs i32) (result i32)
    local.get $lhs
    local.get $rhs
    i32.add)
  (export "add" (func $add))
  (export "add_again" (func $add))
)`

let codeEditor: editor.IStandaloneCodeEditor | undefined;

const start = () => {
    if (editorDiv == null) {
        throw new Error('#editor element not found');
    }
    
    codeEditor = editor.create(editorDiv, {
        value: defaultModule,
        language: 'wat',
        minimap: {
            enabled: false
        }
    });
}

const maxBytes = 80 * 1024;

const buildAndRun = async () => {
    if(codeEditor == null) throw new Error('Code editor not found');

    const wabtModule = await wabt();

    let wasmModule;
    try {
        wasmModule = wabtModule.parseWat("wes80.wat", codeEditor.getValue());
    } catch (e) {
        alert(e);
        console.error(e);
        return;
    }

    const wasm = wasmModule.toBinary({log: true});
    const instantiatedModule = await WebAssembly.instantiate(wasm.buffer);
    const bytes = wasm.buffer.length;
    
    sizeStatusContainer!.textContent = `${bytes} bytes (${Math.round(bytes/maxBytes * 10000) / 100}% full)`
    
    const exportedNames = Object.keys(instantiatedModule.instance.exports);
    consoleContainer!.innerHTML = "This doesn't actually run anything yet, but here's a list of exports from the compiled module<h4>Exports</h4><ul>" + exportedNames.map(e => `<li>${e} - ${instantiatedModule.instance.exports[e]}</li>`).join('') + '</ul>'
    
}

start()
document.querySelector('#build-and-run')!.addEventListener('click', buildAndRun);