import path from 'path';
import { app } from 'electron';

const prodDataRoot = path.join(app.getPath('userData'), 'dataBase');

export default {
  userConfigPath: path.join(prodDataRoot, '/config.json'),
  userConfig: {
    databasePath: path.join(prodDataRoot, '/rem_user_data.db'),
    shortcuts: {
      activateRecorder: 'Alt+X', // 激活或反激活计时器
      minimizeRecorder: 'Alt+C', // 缩小和还原计时器
    },
  },
};
