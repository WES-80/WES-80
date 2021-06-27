import { editor, languages } from "monaco-editor";

function addTokens() {
  languages.setMonarchTokensProvider("wat", {
    brackets: [{ open: "(", close: ")", token: "@brackets" }],
    keywords: ["module", "func", "local", "export", "i32", "f32", "i64", "f64"],
    tokenizer: {
      root: [
        [/\$[A-z_][A-z\d_]+/, "variable"],
        [/"[^"]*"/, "string"],
        { include: "common" },
      ],
      common: [
        [
          /[a-z_$][\w$]*/,
          {
            cases: {
              "@keywords": "keyword",
              "@default": "identifier",
            },
          },
        ],
      ],
    },
  });
}

function addCompletionItems() {
  languages.registerCompletionItemProvider("wat", {
    provideCompletionItems: () => {
      const suggestions: languages.CompletionItem[] = [
        // @ts-ignore Complains about range missing even though the docs don't use it and it doesn't seem required
        {
          label: "module",
          kind: languages.CompletionItemKind.Snippet,
          insertText: "(module $0)",
          documentation: "Module",
          insertTextRules:
            languages.CompletionItemInsertTextRule.InsertAsSnippet,
        },
        // @ts-ignore
        {
          label: "func",
          kind: languages.CompletionItemKind.Snippet,
          insertText:
            "(func \\$${1:name} (param \\$${2:paramname} ${3:i32}) (result ${4:i32}) $0)",
          documentation: "Function",
          insertTextRules:
            languages.CompletionItemInsertTextRule.InsertAsSnippet,
        },
        // @ts-ignore
        {
          label: "export",
          kind: languages.CompletionItemKind.Snippet,
          insertText: '(export "${1:export_name}" $0)',
          documentation: "Export something to be used by the host",
          insertTextRules:
            languages.CompletionItemInsertTextRule.InsertAsSnippet,
        },
      ];
      return { suggestions };
    },
  });
}

function addTheme() {
  editor.defineTheme("lightTheme", {
    base: "vs",
    inherit: false,
    colors: {},
    rules: [
      //{ token: 'keyword', foreground: '000088' },
      { token: "variable", foreground: "000044" },
      { token: "custom-error", foreground: "ff0000", fontStyle: "bold" },
      { token: "brace", foreground: "FFA500" },
    ],
  });
}

export function registerWat() {
  languages.register({ id: "wat" });
  addTokens();
  addTheme();
  addCompletionItems();
}
