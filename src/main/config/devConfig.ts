import path from 'path';

const devDataRoot = path.join(process.cwd(), './devData');
export default {
  userConfigPath: path.join(devDataRoot, '/config.json'),
  userConfig: {
    databasePath: path.join(devDataRoot, '/rem_user_data.db'),
    shortcuts: {
      activateRecorder: 'Alt+S', // 激活或反激活计时器
      minimizeRecorder: 'Alt+D', // 缩小和还原计时器
    },
  },
};
