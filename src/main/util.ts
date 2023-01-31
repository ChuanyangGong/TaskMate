/* eslint import/prefer-default-export: off */
import { URL } from 'url';
import path from 'path';
import fs from 'fs';

export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
}

export function makeFileOrDir(
  targetPath: string,
  isFile: boolean,
  defaultContent: string | undefined | null
) {
  let exist = true;
  const pathList = targetPath.replace(/\//g, '\\').split('\\');
  let curPath = '';
  for (let i = 0; i < pathList.length; i += 1) {
    curPath = i === 0 ? pathList[i] : path.join(curPath, pathList[i]);
    if (!fs.existsSync(curPath)) {
      if (isFile && i === pathList.length - 1) {
        fs.writeFileSync(curPath, defaultContent ?? '');
      } else {
        fs.mkdirSync(curPath);
      }
      exist = false;
    }
  }
  return exist;
}

export function writeFile(targetPath: string, content: string): boolean {
  if (!fs.existsSync(targetPath)) {
    return false;
  }
  fs.writeFileSync(targetPath, content);
  return true;
}
