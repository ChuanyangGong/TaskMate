export interface UserConfig {
  shortcuts: {
    startPauseRecorder: string;
    stopRecorder: string;
    activateRecorder: string;
    minimizeRecorder: string;
  };
  databasePath: string;
}

export interface CompleteConfig {
  isDev: boolean;
  userConfig: UserConfig;
  userConfigPath: string;
}
