import devConfig from './devConfig';
import prodConfig from './prodConfig';

// eslint-disable-next-line import/prefer-default-export
export const getDefaultConfig = (isDev: boolean) => {
  const { userConfig, ...cfg } = isDev ? devConfig : prodConfig;
  return {
    ...cfg,
    isDev,
    userConfig: {
      ...userConfig,
      shortcuts: {
        ...userConfig.shortcuts,
        startPauseRecorder: 'Ctrl+D', // 开始或暂停计时器
        stopRecorder: 'Ctrl+F', // 结束任务
      },
    },
  };
};
