import { getMiniEditorWindow } from "./windows/miniEditor";
import { getRecorderWindow } from "./windows/recorder";


let focusStatus = [ 'focus', 'blur' ];
let indexMap = {
  recorder: 0,
  miniEditor: 1,
}

let timeeoutHandler: null | NodeJS.Timeout | undefined = null;

export function isFocus() {
  return focusStatus.includes('focus');
}

export function setFocusStatus(winName: 'recorder' | 'miniEditor', status: string) {
  focusStatus[indexMap[winName]] = status;
  if (status === 'focus') {
    if (timeeoutHandler) {
      clearTimeout(timeeoutHandler);
      timeeoutHandler = null;
    }
    // 激活 recorder
    let recorderWin = getRecorderWindow();
    if (recorderWin !== null) {
      recorderWin.setIgnoreMouseEvents(false);
      recorderWin.webContents.send('recoder:invokeFocusOrBlur', 'focus');
    }

    // 激活 miniEditor
    let miniEditorWin = getMiniEditorWindow();
    if (miniEditorWin !== null) {
      miniEditorWin.setIgnoreMouseEvents(false);
      miniEditorWin.webContents.send('miniEditor:invokeFocusOrBlur', 'focus');
    }
  } else {
    if (!focusStatus.includes('focus')) {
      timeeoutHandler = setTimeout(() => {
        let recorderWin = getRecorderWindow();
        // 不激活 recorder
        recorderWin?.setIgnoreMouseEvents(true);
        recorderWin?.webContents.send('recoder:invokeFocusOrBlur', 'blur')

        // 不激活 miniEditor
        let miniEditorWin = getMiniEditorWindow();
        miniEditorWin?.setIgnoreMouseEvents(true);
        miniEditorWin?.webContents.send('miniEditor:invokeFocusOrBlur', 'blur')
      }, 100);
    }
  }
}
