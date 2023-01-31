import * as vscode from "vscode";

export const getSettings = (group: string, keys: string[]) => {
  const settings = vscode.workspace.getConfiguration(group, null);
  return keys.reduce((acc, k) => {
    // @ts-ignore
    acc[k] = settings.get(k);
    return acc;
  }, {});
};
