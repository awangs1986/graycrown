# 灰烬王冠 · Gray Crown

## 中文

**灰烬王冠**是一款用 RPG 游戏方式学习 C 语言基础的问答与编程挑战游戏。

七枚符文散落在北境。玩家会沿着章节地图完成 7 章、140 道短题：每道题都有一段生动的冒险故事、明确的任务目标、最多 3 个提示，以及一个内置的 C 语言编辑器。写下代码后，游戏会在隔离的 WebAssembly 编译沙箱中编译、运行并判断答案是否正确。

这不是把教材换成题库，而是让学习者通过一次次“做出选择、运行代码、看到结果”来理解 C 语言。

### 主要玩法

- 7 章 × 20 题，共 140 道适合短时间完成的 C 语言试炼。
- 默认英文，首屏即可一键切换中文；语言选择会保存到本地 JSON 存档。
- 每道题包含 RPG 故事、目标、试炼规则、3 个分级提示和代码编辑器。
- 使用真正的 Clang/WebAssembly 编译器运行学员代码，并显示编译错误和运行输出。
- 每章 3 枚“真知水晶”，可在确认后查看正确答案。
- 同一道题连续提交错误 3 次后，可以召唤每章仅一次的可选 AI 导师。
- 进度、草稿、提示记录和语言选择保存在本地，不需要账号。

### Windows 运行

1. 将 `GrayCrown.exe` 与 `data` 文件夹放在同一目录。
2. 双击 `GrayCrown.exe`，程序会启动本机服务并打开浏览器。
3. 不需要另外安装 Python、Node.js、Rust、C 编译器或其他运行库。

系统要求：Windows 10/11 x64，以及支持 WebAssembly 和 SharedArrayBuffer 的现代浏览器（推荐最新版 Edge 或 Chrome）。

### AI 导师（可选）

在设置中填写 OpenAI 兼容 API URL、模型名称和可选 API Key，然后测试连接。AI 导师只解释当前题目、代码、编译信息和输出，不负责通关判定，也不会直接替玩家提交答案。使用导师时，相关内容会发送到玩家自己配置的 API 服务。

### 从源码运行

```powershell
npm install
npm run dev
```

构建网页和 Windows 便携版：

```powershell
npm run package:windows
```

项目使用 Vite、CodeMirror、Wasmer JavaScript SDK、Rust 启动器和随包携带的 Clang WebAssembly 编译器。详细的架构说明、测试方式和安全边界请参阅 [ARCHITECTURE.md](ARCHITECTURE.md)。第三方组件及其许可证请参阅 [THIRD_PARTY_NOTICES.txt](THIRD_PARTY_NOTICES.txt)。

### 自由改编与使用

欢迎大家自由学习、改编、二次开发、制作自己的课程，或把它用于教学、社团和个人项目。项目代码采用 MIT License；你可以在遵守许可证和第三方组件条款的前提下自由使用、修改和分发。欢迎提交 Issue、Pull Request，或把故事和题目改编成你自己的世界观。

---

## English

**Gray Crown** is a story-driven quiz and coding challenge game for learning C fundamentals through an RPG adventure.

Seven runes are scattered across the North. Players travel through 7 chapters and 140 short trials. Every trial has a vivid adventure story, a clear objective, up to three hints, and a built-in C editor. When the player submits code, the game compiles and runs it inside an isolated WebAssembly sandbox, then checks whether the result is correct.

The goal is not to turn a textbook into a question bank. It is to help learners understand C by making a choice, running code, reading the result, and trying again.

### Gameplay

- 7 chapters × 20 quests: 140 short C programming trials.
- English is the default language. The first screen has a one-click switch to Chinese, and the choice is saved in the local JSON save.
- Every quest includes an RPG story, an objective, trial rules, three progressive hints, and a code editor.
- Learner code is compiled and executed with the bundled Clang/WebAssembly sandbox, with compiler diagnostics and program output shown in the UI.
- Each chapter has three Truth Crystals. Confirming the answer button reveals a reference solution and spends one crystal.
- After three consecutive failed submissions on one quest, the optional AI Mentor unlocks. It can be used once per chapter.
- Progress, drafts, hint records, and language choice are stored locally; no account is required.

### Running the Windows build

1. Keep `GrayCrown.exe` and the `data` folder together.
2. Double-click `GrayCrown.exe`; it starts a local service and opens the browser.
3. Python, Node.js, Rust, a C compiler, and other runtimes do not need to be installed separately.

Requirements: Windows 10/11 x64 and a modern browser with WebAssembly and SharedArrayBuffer support (the latest Edge or Chrome is recommended).

### Optional AI Mentor

Enter an OpenAI-compatible API URL, model name, and optional API key in Settings, then test the connection. The mentor only explains the current quest, code, compiler information, and output. It does not decide whether a solution passes and does not submit a solution for the player. When used, those materials are sent to the API service configured by the player.

### Run from source

```powershell
npm install
npm run dev
```

Build the web app and portable Windows package:

```powershell
npm run package:windows
```

The project uses Vite, CodeMirror, the Wasmer JavaScript SDK, a Rust launcher, and a bundled Clang WebAssembly compiler. See [ARCHITECTURE.md](ARCHITECTURE.md) for architecture, testing, and security details. See [THIRD_PARTY_NOTICES.txt](THIRD_PARTY_NOTICES.txt) for third-party components and their licenses.

### Free to adapt and use

Everyone is welcome to learn from this project, adapt it, build a new course, or use it for teaching, clubs, and personal projects. The project code is released under the MIT License, so you may use, modify, and redistribute it as long as the license and the terms of third-party components are respected. Issues, pull requests, new stories, and alternate worlds are welcome.

See [LICENSE](LICENSE).
