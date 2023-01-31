import { CompleteConfig, UserConfig } from 'typings/main/config';
import fs from 'fs';
import { makeFileOrDir, writeFile } from '../util';
import { getDefaultConfig } from './defaultConfig';

class ConfigManger {
  config: null | CompleteConfig = null;

  // 初始化配置管理
  constructor() {
    const isdev = process.env.NODE_ENV !== 'production';
    this.config = getDefaultConfig(isdev);

    // 1. 进行配置文件的初始化和加载
    // 1.1 检测配置文件是否存在，不存在则写入
    let { userConfig } = this.config;
    const { userConfigPath } = this.config;
    makeFileOrDir(userConfigPath, true, JSON.stringify(userConfig));

    // 1.2 读取配置文件
    try {
      userConfig = JSON.parse(fs.readFileSync(userConfigPath, 'utf-8'));
    } catch (err) {
      console.log(err);
    }
    this.config.userConfig = {
      databasePath: userConfig?.databasePath || this.config.userConfigPath,
      shortcuts: {
        ...this.config.userConfig.shortcuts,
        ...userConfig?.shortcuts,
      },
    };

    // 1.3 重写配置文件
    this.updateUserConfigFile(this.config.userConfig);
  }

  updateUserConfigFile(newConfig: UserConfig) {
    writeFile(this.config?.userConfigPath || '', JSON.stringify(newConfig));
  }
}

let cfgManager: ConfigManger | null = null;

// eslint-disable-next-line import/prefer-default-export
export function getConfigManager() {
  if (cfgManager === null) {
    cfgManager = new ConfigManger();
  }
  return cfgManager;
}
