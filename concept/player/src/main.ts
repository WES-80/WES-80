import "./style.css";

type Metadata = { title?: string, author?: string };

function getMetadata(module: WebAssembly.Module): Metadata {
  const decoder = new TextDecoder();
  const getSectionAsString = (name: string): string | undefined => {
    const section = WebAssembly.Module.customSections(module, name);
    if (section.length == 0) {
      return;
    }
  
    
    return decoder.decode(new Uint8Array(section[0]));
  }

  return {
    title: getSectionAsString('title'),
    author: getSectionAsString('author'),
  }
}

async function getFileData(event: DragEvent): Promise<ArrayBuffer | undefined> {
  const items = event.dataTransfer?.items;
  if (!items) {
    return;
  }

  return items[0]?.getAsFile()?.arrayBuffer();
}

function compileModule(fileData: ArrayBuffer): Promise<WebAssembly.Module> {
  return WebAssembly.compile(new Uint8Array(fileData));
}

function checkExists<T>(value: T | undefined | null, message: string): T {
  if (value == null) {
    throw new Error(message);
  }

  return value;
}

async function main() {
  const $app = checkExists(
    document.querySelector("#app"),
    "Cannot find root #app element",
  );

  const $dropZone = checkExists(
    $app.querySelector(".dropZone"),
    "Cannot find dropZone element",
  );

  $dropZone.addEventListener("drop", (event) => {
    event.preventDefault();

    if (event instanceof DragEvent) {
      getFileData(event)
        .then((fileData) => checkExists(fileData, "Drop did not include file data"))
        .then(compileModule)
        .then(getMetadata)
        .then((metadata) => console.log(metadata))
        .catch((error) => console.error(error));
    }
  });

  $dropZone.addEventListener("dragover", (event) => {
    event.preventDefault();
  });
}

main().catch((error) => console.error(error));
