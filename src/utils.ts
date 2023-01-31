import * as vscode from "vscode";

export const getSettings = (group: string, keys: string[]) => {
  const settings = vscode.workspace.getConfiguration(group, null);
  return keys.reduce((acc, k) => {
    // @ts-ignore
    if (acc[k] === null) acc[k] = settings.get(k);
    return acc;
  }, {});
};
