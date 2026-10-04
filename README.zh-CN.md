# 灰烬王冠 · Gray Crown

<p align="right"><a href="README.md"><kbd>🇬🇧 English</kbd></a></p>

**灰烬王冠**是一款离线课程学习应用，包含 C 语言冒险、C# 入门和法语 A1。

七枚符文散落在北境。玩家会沿着章节地图完成 7 章、140 道短题：每道题都有一段生动的冒险故事、明确的任务目标、最多 3 个提示，以及一个内置的 C 语言编辑器。写下代码后，游戏会在隔离的 WebAssembly 编译沙箱中编译、运行并判断答案是否正确。

这不是把教材换成题库，而是让学习者通过一次次“做出选择、运行代码、看到结果”来理解 C 语言。

## 课程包

应用首页现在提供课程选择，现有 C 课程已作为独立内置课程包。各课程的进度、草稿和奖励分别保存；旧 C 存档会自动迁移，并保留迁移前备份。首页可导出全部课程，课程内可单独备份和重置当前课程。

三个课程均可直接进入：

| 课程 | 内容 | 完成目标 |
| --- | --- | --- |
| C 语言 | 原有 7 章、140 道冒险题 | C 语法与编程基础 |
| C# 入门 | 7 章、84 题，真实编译运行、162 组输入输出判定 | 从零写出控制台文字 RPG DEMO |
| 法语 A1 | 8 单元、96 组练习、128 项词汇、152 段离线音频 | 逐步学习词汇、句子、语法、听力并完成综合练习 |

C# 和法语课程采用中文教学说明。C# 支持下载代码，在 .NET 控制台项目继续运行；浏览器练习预先填写输入。法语提供选择、填空、排序、听写、阅读和综合测试，音频为有来源标注的合成语音，可慢速播放。

## C 课程玩法

- 7 章 × 20 题，共 140 道适合短时间完成的 C 语言试炼。
- 默认英文，首屏即可一键切换中文；语言选择会保存到本地 JSON 存档。
- 每道题包含 RPG 故事、目标、试炼规则、3 个分级提示和代码编辑器。
- 使用真正的 Clang/WebAssembly 编译器运行学员代码，并显示编译错误和运行输出。
- 每章 3 枚“真知水晶”，可在确认后查看正确答案。
- 同一道题连续提交错误 3 次后，可以召唤每章仅一次的可选 AI 导师。
- 进度、草稿、提示记录和语言选择保存在本地，不需要账号。

## Windows 运行

1. 将 `GrayCrown.exe` 与 `data` 文件夹放在同一目录。
2. 双击 `GrayCrown.exe`，程序会启动本机服务并打开浏览器。
3. 不需要另外安装 Python、Node.js、Rust、C 编译器或其他运行库。

系统要求：Windows 10/11 x64，以及支持 WebAssembly 和 SharedArrayBuffer 的现代浏览器（推荐最新版 Edge 或 Chrome）。

## AI 导师（可选）

在设置中填写 OpenAI 兼容 API URL、模型名称和可选 API Key，然后测试连接。AI 导师只解释当前题目、代码、编译信息和输出，不负责通关判定，也不会直接替玩家提交答案。使用导师时，相关内容会发送到玩家自己配置的 API 服务。

## 从源码运行

开发需要 Node.js、Rust、Git LFS、.NET 9 SDK；安装 WebAssembly 工作负载后构建。学习者使用成品时不需要这些开发工具。

```powershell
dotnet workload install wasm-tools
git lfs pull
npm ci
npm run build:web
cargo run -- --data-dir ./data --no-open
```

`npm run dev` 仅启动 Vite 前端；保存和 AI 功能需要 Rust 启动器接口。

构建网页和 Windows 便携版：

```powershell
npm run package:windows
```

项目使用 Vite、CodeMirror、Wasmer JavaScript SDK、Rust 启动器和随包携带的 Clang WebAssembly 编译器。详细的架构说明、测试方式和安全边界请参阅 [ARCHITECTURE.md](ARCHITECTURE.md)。第三方组件及其许可证请参阅 [THIRD_PARTY_NOTICES.txt](THIRD_PARTY_NOTICES.txt)。

## 自由改编与使用

欢迎大家自由学习、改编、二次开发、制作自己的课程，或把它用于教学、社团和个人项目。项目代码采用 MIT License；你可以在遵守许可证和第三方组件条款的前提下自由使用、修改和分发。欢迎提交 Issue、Pull Request，或把故事和题目改编成你自己的世界观。

参阅 [LICENSE](LICENSE)。
