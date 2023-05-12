# TaskMate

## 简介

哈喽，我是 Chuanyang，这是一个**时间记录小工具**的项目。由于我本人经常使用电脑进行工作和学习，并且需要定期总结、汇报自己一段时间内的工作内容、时长以及进度（例如组会汇报一周的工作、Work from home 时自己一天实际工作了多长时间），因此非常想要一个工具能够只使用键盘进行操作，就可以**快速的记录自己正在干的事情、什么时候开始的、什么时候结束的以及花了多少时间**，以便于在需要的时候可以查看到自己的工作记录。

该项目为原 Record Every Moment 项目的重构版，项目地址：https://github.com/ChuanyangGong/Record_every_moment。 该工具虽然有些简陋，但是满足了我最主要的需求，自发布以后一直陪伴着我至今。 新版更名为 TaskMate，借鉴了嘀嗒清单和 Todo 清单的界面，大大提升了美观程度，并使用了新的技术，可以说是跨越式的升级，欢迎大家来使用 ^.^。

## 功能介绍及使用教程

### 功能简介

该工具主要包括三部分，一个是计时器，一个是数据看板，最后一个是托盘。计时器用于记录当前正在进行的任务，数据看板用于查看、编辑、搜索已经记录的任务，或添加新的记录，托盘用于快速打开计时器或数据看板。

1. 计时器
   计时器存在三种状态，第一种状态是**激活状态**，在这个状态可以通过快捷键**开始、暂停、结束计时**，还可以**编辑任务记录的标题、详情和分类（未来还会有标签）**。

<div style="width: 100%"><image style="margin: 0 auto; width: 300px;" src="./.erb/img/recorder_activate.png" /></div>

第二种是**未激活**状态，在这个状态，计时器会隐藏编辑框，只显示计时情况，并且高度透明的显示在所有应用的最上方，并且支持点击穿透，不影响正常的办公。激活状态切换到未激活状态只需要任意点击屏幕的其他地方。

<div style="width: 100%"><image style="margin: 0 auto; width: 180px;" src="./.erb/img/recorder_not_activate.png" /></div>

最后一个状态是影藏状态，如果不想看到计时器也没有关系，可以将计时器缩小进行隐藏。

**最最重要的是，对于计时器的操作可以通过快捷键进行。包括：激活、不激活计时器，隐藏、显示计时器，开始计时、暂停计时、结束计时，这些最常使用的功能。目前记录分类的设定仍需使用鼠标，未来也将脱离对鼠标的依赖。**

2. 数据看板

数据看板用于查看、编辑、添加、删除任务记录。并且支持按分类、按关键词、按日期进行筛选。对于任务的编辑也是随改随存的。在任务详情部分还以友好的方式显示的完成该任务的时间分布情况，清晰的展现任务是分部分完成的还是一次性完成的。

<div style="width: 100%"><image style="margin: 0 auto; width: 800px;" src="./.erb/img/dashboard.png" /></div>

3. 托盘

最后一部分是托盘，可以通过托盘打开数据看板（双击应用图标），打开计时器（单击应用图标），或退出程序。

<div style="width: 100%"><image style="margin: 0 auto; width: 200px;" src="./.erb/img/tray.png" /></div>

### 使用教程

1. 计时器快捷键操作

- **Alt + X**：未选中状态 <==> 选中状态。快捷选中/不选中转换，该快捷键为全局快捷键，在使用其他程序的时候也有效，用于快速更改计时器状态。

> Demo: 使用 Alt + X 唤醒计时器，并直接编写标题和描述，然后设置任务分类。

![计时器快捷键唤起](https://github.com/ChuanyangGong/TaskMate/assets/41765158/a2e4e151-14da-4634-b7cb-d81212911e5e)

- **Alt + C**：缩小 <==> 恢复。快捷缩小计时器，或者恢复并激活计时器，该快捷键也是全局快捷键。
- **Ctrl + D**：开始 <==> 暂停。快捷开始计时或暂停计时。该快捷键只有在计时器被激活（选中）时才有效。
  > Demo: 使用 Ctrl + D 开始计时
- **Ctrl + F**：结束任务。该快捷键只有在计时器被激活（选中）时并且处于暂停状态才有效。

> Demo: 先使用 Ctrl + D 暂停任务，再使用 Ctrl + F 结束任务，此时该任务会被添加到记录中。

![快捷键结束](https://github.com/ChuanyangGong/TaskMate/assets/41765158/d541c30b-d3a2-4d83-a52a-dc56f2d371d4)

- 未激活状态下，鼠标无法点击计时器，鼠标的点击事件会穿透到下层的应用上。

![鼠标穿透](https://github.com/ChuanyangGong/TaskMate/assets/41765158/a0a0fab1-6454-413f-bf8d-dde295d2fc2d)

2. 托盘操作介绍

- 单击托盘：激活计时器
- 双击托盘：打开并激活数据面板
- 右键：打开菜单，里面有退出程序按钮

3. 数据看板操作介绍

- 鼠标移动到分类上会有一个 +，可以创建新的分类，还可以为分类创建别名，便于搜索。

![创建新分类](https://github.com/ChuanyangGong/TaskMate/assets/41765158/5565cb39-73b4-4618-8aaf-13332fdc4e57)

- 数据面板右上方有一个 + 号，可以添加一个任务记录，默认会往当前显示的分类内添加。

![创建新任务](https://github.com/ChuanyangGong/TaskMate/assets/41765158/443157ab-cffc-4cc1-be7c-207023d3ea08)

- 鼠标移动到任务记录上，最右边会显示 ...，目前点击该图标可以删除任务记录

- 任务记录详情部分可以修改完成该任务所占用的时间。

![编辑时间](https://github.com/ChuanyangGong/TaskMate/assets/41765158/eaa3bf43-f668-492a-a10f-79028011a4fd)

- 任务分类选择支持关键字搜索，且可以用自定义的别名进行搜索。

- 功能全览图
<div style="width: 100%"><image style="margin: 0 auto; width:800px;" src="./.erb/img/dashboard_guide.png" /></div>

## 下载链接

- windows 版：
  - 阿里云盘：https://www.aliyundrive.com/s/x3yztqKwGxW
  - 百度网盘：https://pan.baidu.com/s/1tywsetGG7bSfVNNf9yuN0Q?pwd=t5sb

## 项目最新动态

目前本项目只实现了最基本的功能，还有许多新功能还在开发中，欢迎大家提出宝贵的意见和建议。

**目前状态**：1.1.0 版本开发中
**上线时间**：待定

### 1.1.0 版本计划

#### 新功能

- [ ] 允许用户继续进行已经结束的任务
- [ ] Todo List 列表
- [ ] 常用日期范围快捷选项
- [ ] Reacorder 快捷键进行分类选择
- [ ] 将实现在 Recorder 上进行输入时，自动开始计时的功能，避免忘记开启计时。

#### 新优化

- [ ] 列表分页 & 懒加载

### 待定计划

#### 新功能

- [ ] 统计页面
- [ ] 归档功能
- [ ] 标签功能

#### 优化

- [ ] 缩小时回到原来的窗口大小

## 开发者指南

### 技术栈

- [Electron](https://www.electronjs.org/)：基于 Chromium 和 Node.js 的跨平台桌面应用开发框架。并使用了 [electron-react-boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate) 来作为项目基础，里面集成了 React、Webpack、Typescripe 等。
- [React](https://react.dev/)：前端框架。
- [Antd](https://ant.design/)：前端 UI 组件库。
- [SQLite](https://github.com/sqlite/sqlite)、[sequelize](https://sequelize.org/)、[umzug](https://github.com/sequelize/umzug)：使用 SQLite 来进行数据的存储，使用 sequelize 来进行数据库的操作，使用 umzug 来进行数据库的迁移。
- [MasterGo](https://mastergo.com/)：绘制项目原型。

### 项目启动步骤

首先，克隆本项目并切换到项目根目录

```
// 从 gitee 上克隆项目
git clone https://github.com/ChuanyangGong/TaskMate.git
// 或者从 github 上克隆项目
git clone https://gitee.com/g847714121/TaskMate.git
```

安装依赖

```
npm install
```

启动项目

```
npm run start
```

### 项目打包发布

打包发布

```
npm run package
```

在 `release\build` 文件夹里就会有打包发布的结果。

### 1.0.0 主要升级

- 使用了 electron-react-boilerplate 作为脚手架，而非之前直接基于原生 electron 进行开发。多界面热更新、Webpack 等功能都是脚手架自带的，免除了很多对于开发环境的配置工作。
- 使用 TypeScript 进行项目的开发，增加了代码的可读性和可维护性。
- 使用了 umzug 和 sequelize 来进行数据库的迁移和管理，使得用户进行软件升级变的更简单。
- 将数据与程序分离，将数据存储在用户目录下，而非之前的程序目录下，这样用户升级软件时不会丢失数据。
- 增加了分类功能，实现了在 React-every-moment 项目中未实现的编辑功能。
- 代码模块化更加清晰，每个界面都有自己独立的文件夹。
- 安装支持用户自定义安装路径。

## 联系方式

Email: cy_gong@foxmail.com
