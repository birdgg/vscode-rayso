import * as vscode from "vscode";
import { getSettings } from "./utils";

interface Options {
  code?: string;
  language?: string;
  theme?:
    | "breeze"
    | "candy"
    | "crimson"
    | "falcon"
    | "meadow"
    | "midnight"
    | "raindrop"
    | "sunset";
  background?: boolean;
  darkMode?: boolean;
  padding?: "16" | "32" | "64" | "128";
  title?: string;
}

const generateEncodedCode = (str: string) =>
  Buffer.from(str).toString("base64");

const getConfig = () => {
  const editor = vscode.window.activeTextEditor;
  const extensionSettings = getSettings("rayso", [
    "theme",
    "background",
    "darkMode",
    "padding",
  ]);
  let windowTitle = "";
  if (editor) {
    const activeFileName = editor.document.uri.path.split("/").pop();
    windowTitle = `${vscode.workspace.name} - ${activeFileName}`;
  }
  return {
    ...extensionSettings,
    title: windowTitle,
    language: editor?.document?.languageId,
  };
};

const generateRayUrl = (code: string) => {
  const objParams: Options = {
      ...getConfig(),
      code: generateEncodedCode(code),
    },
    parameters = Object.entries(objParams)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&");

  return "https://ray.so/#" + parameters;
};

function correctIndentation(text: string) {
  const lines = text.split("\n");
  const indents = lines.filter(Boolean).map((line) => {
    return (line.split(/[^\t\s]/)[0] || "").length;
  });
  const minimumLength = Math.min(...indents);
  return lines
    .map((x) => x.slice(minimumLength))
    .join("\n")
    .trim();
}

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand("raysocode.upload", () => {
    const { activeTextEditor, showErrorMessage, showInformationMessage } =
      vscode.window;

    if (!activeTextEditor) {
      return showErrorMessage(
        `You need to have an open editor to upload a code snippet to Ray.so.
  			Please select a file and make a text selection to upload a snippet.`
      );
    }

    const selectedContent = activeTextEditor.document.getText(
      activeTextEditor.selection
    );

    // * If there is no selected content,
    // * return an error message.
    if (!selectedContent) {
      return showErrorMessage(
        `You have to have text selected to upload a snippet to Ray.so.
  			Please select the text you would like to be included in your snippet.`
      );
    }

    // * Generate URL & open in default browser,
    // * then send success message.
    const url = generateRayUrl(correctIndentation(selectedContent));

    vscode.commands.executeCommand("vscode.open", vscode.Uri.parse(url));
  });

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
