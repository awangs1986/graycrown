# 灰烬王冠 · Gray Crown

<p align="right"><a href="README.md"><kbd>🇬🇧 English</kbd></a></p>

**灰烬王冠**是一款离线课程学习应用，包含 C 语言冒险、C# 入门、法语 A1，对齐新概念英语 1–2 册大纲的英语漫画 RPG，以及改编自 OpenStax 的经典物理入门。

七枚符文散落在北境。玩家会沿着章节地图完成 7 章、140 道短题：每道题都有一段生动的冒险故事、明确的任务目标、最多 3 个提示，以及一个内置的 C 语言编辑器。写下代码后，游戏会在隔离的 WebAssembly 编译沙箱中编译、运行并判断答案是否正确。

这不是把教材换成题库，而是让学习者通过一次次“做出选择、运行代码、看到结果”来理解 C 语言。

## 课程包

应用首页现在提供课程选择，现有 C 课程已作为独立内置课程包。各课程的进度、草稿和奖励分别保存；旧 C 存档会自动迁移，并保留迁移前备份。首页可导出全部课程，课程内可单独备份和重置当前课程。

所有课程均可直接进入：

| 课程 | 内容 | 完成目标 |
| --- | --- | --- |
| C 语言 | 原有 7 章、140 道冒险题 | C 语法与编程基础 |
| C# 入门 | 8 章、96 题，真实编译运行、189 组输入输出判定 | 由浅入深，从零写出控制台文字 RPG DEMO |
| 法语 A1 | 12 单元（字母入门 → 出行计划）、156 个练习、192 项词汇、228 段离线音频 | 逐步学习词汇、句子、语法、听力，章节测试使用全新题目 |
| 英语 · 漫画城（新概念 1–2 册大纲） | 25 单元（对齐第一册 15 个 + 第二册 10 个）、325 个任务、250 项词汇、325 段离线 MP3、每题一幅原创漫画插图 | 按新概念语法顺序编写的原创对话与小故事；判题兼容缩写和英美拼写 |
| 经典物理入门（改编自 OpenStax） | 11 单元、33 个“先讲解后测验”阶段 + 11 次单元测试、158 道题（110 道数值题）、33 张真实照片、离线 KaTeX 公式 | 每阶段先讲概念、公式与分步例题，读完才解锁测验；数值题容许 2% 误差并支持单位换算。来源见 [web/courses/physics/CREDITS.md](web/courses/physics/CREDITS.md) |
| 奥数思维课（小学 → 初中，中文） | 4 个学段、15 单元、30 关“先讲解后测验” + 15 次单元测试、150 道题、30 段 Remotion 动画例题（带中文字幕） | 每关先讲思维方法（生活引入、动画例题、分步解答、提示），再测验。来源见 [web/courses/olympiad/CREDITS.md](web/courses/olympiad/CREDITS.md) |

C# 和法语课程采用中文教学说明。C# 支持下载代码，在 .NET 控制台项目继续运行；浏览器练习预先填写输入。法语提供选择、填空、排序、听写、阅读和综合测试，音频为有来源标注的合成语音，可慢速播放。课程内容来源与致谢见 [web/courses/french-a1/CREDITS.md](web/courses/french-a1/CREDITS.md)、[web/courses/english-nce/CREDITS.md](web/courses/english-nce/CREDITS.md)（英语课程仅对齐新概念大纲，内容全部原创）。

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

### 奥数思维课（小学 → 初中）

中文原创为主（没有找到许可证允许改编的中文奥数开源课程，核查记录见 [CREDITS](web/courses/olympiad/CREDITS.md)）。例外：初中开头的“解方程：等式的性质”单元改编自 OpenStax《Prealgebra 2e》§8.1–8.2，文件 `web/courses/olympiad/content-openstax.mjs` 采用 **CC BY-NC-SA 4.0（非商业、相同方式共享），不是 MIT**。学段与单元：小学低年级（找规律与数列、巧算与植树、图形计数与一笔画）→ 中年级（和差和倍与年龄、鸡兔同笼与盈亏、行程）→ 高年级（工程与浓度、数论、加乘原理与容斥、抽屉原理与逻辑、几何面积）→ 初中（解方程：等式的性质、绝对值与不等式、配方与因式分解、辅助线与数学归纳）。每关强调一种思维方法（画图、假设、倒推、枚举、转化、对称……），例题配一段儿童蜡笔插画风格的 Remotion 预渲染动画（rough.js 手绘线条 + 站酷快乐体 ZCOOL KuaiLe，30 段 WebM 合计约 25 MB，`web/public/video/olympiad/*.webm`，海报图 + WebVTT 中文字幕，开启“减少动态效果”时只显示海报和分步文字）。重新渲染动画：`cd remotion && npm install && node render.mjs`。
