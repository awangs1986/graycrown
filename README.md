# Gray Crown · 灰烬王冠

<p align="right"><a href="README.zh-CN.md"><kbd>🇨🇳 中文</kbd></a></p>

**Gray Crown** is an offline learning application with a C adventure, a C# beginner course, and French A1.

Seven runes are scattered across the North. Players travel through 7 chapters and 140 short trials. Every trial has a vivid adventure story, a clear objective, up to three hints, and a built-in C editor. When the player submits code, the game compiles and runs it inside an isolated WebAssembly sandbox, then checks whether the result is correct.

The goal is not to turn a textbook into a question bank. It is to help learners understand C by making a choice, running code, reading the result, and trying again.

## Course packs

The home screen now provides a course shelf. The existing C adventure is an independent bundled course, with its own progress, drafts and rewards. Legacy C saves migrate automatically and retain a pre-migration backup. Export all courses from the shelf, or back up and reset only the current course from its settings.

All three courses are available:

| Course | Content | Goal |
| --- | --- | --- |
| C | Original 7 chapters, 140 trials | C syntax and programming fundamentals |
| C# | 8 chapters, 96 exercises, real compilation and 189 input/output cases | Build a console text RPG from scratch, step by step |
| French A1 | 12 units (alphabet → travel), 156 exercises, 192 vocabulary entries, 228 offline audio clips | Progressive vocabulary, sentences, grammar, listening and unit tests with fresh items |

The new courses use Chinese teaching explanations. C# accepts prefilled console input in the browser and exports source for a native .NET console project. French includes choices, typing, word ordering, dictation and reading; attributed synthetic audio supports slow playback. Course content credits: [web/courses/french-a1/CREDITS.md](web/courses/french-a1/CREDITS.md).

## C course gameplay

- 7 chapters × 20 quests: 140 short C programming trials.
- English is the default language. The first screen has a one-click switch to Chinese, and the choice is saved in the local JSON save.
- Every quest includes an RPG story, an objective, trial rules, three progressive hints, and a code editor.
- Learner code is compiled and executed with the bundled Clang/WebAssembly sandbox, with compiler diagnostics and program output shown in the UI.
- Each chapter has three Truth Crystals. Confirming the answer button reveals a reference solution and spends one crystal.
- After three consecutive failed submissions on one quest, the optional AI Mentor unlocks. It can be used once per chapter.
- Progress, drafts, hint records, and language choice are stored locally; no account is required.

## Running the Windows build

1. Keep `GrayCrown.exe` and the `data` folder together.
2. Double-click `GrayCrown.exe`; it starts a local service and opens the browser.
3. Python, Node.js, Rust, a C compiler, and other runtimes do not need to be installed separately.

Requirements: Windows 10/11 x64 and a modern browser with WebAssembly and SharedArrayBuffer support (the latest Edge or Chrome is recommended).

## Optional AI Mentor

Enter an OpenAI-compatible API URL, model name, and optional API key in Settings, then test the connection. The mentor only explains the current quest, code, compiler information, and output. It does not decide whether a solution passes and does not submit a solution for the player. When used, those materials are sent to the API service configured by the player.

## Run from source

Development requires Node.js, Rust, Git LFS and the .NET 9 SDK. Learners using a packaged build do not need these tools.

```powershell
dotnet workload install wasm-tools
git lfs pull
npm ci
npm run build:web
cargo run -- --data-dir ./data --no-open
```

`npm run dev` starts the Vite frontend only; saving and AI require the Rust launcher endpoints.

Build the web app and portable Windows package:

```powershell
npm run package:windows
```

The project uses Vite, CodeMirror, the Wasmer JavaScript SDK, a Rust launcher, and a bundled Clang WebAssembly compiler. See [ARCHITECTURE.md](ARCHITECTURE.md) for architecture, testing, and security details. See [THIRD_PARTY_NOTICES.txt](THIRD_PARTY_NOTICES.txt) for third-party components and their licenses.

## Free to adapt and use

Everyone is welcome to learn from this project, adapt it, build a new course, or use it for teaching, clubs, and personal projects. The project code is released under the MIT License, so you may use, modify, and redistribute it as long as the license and the terms of third-party components are respected. Issues, pull requests, new stories, and alternate worlds are welcome.

See [LICENSE](LICENSE).

### C# 与法语：RPG 冒险课程

- **C# · 王冠远征**：穿越雾港、集市、森林、地牢、镜塔、星图馆、英雄工坊与王城，完成 96 道符文委托，收集八枚核心；最终用 C# 编写可运行的控制台文字 RPG。
- **法语 · 晨钟之旅 A1**：扮演巡路信使，穿越十二个区域，在 156 组委托中学习问候、身份、家庭、日常、餐饮、问路、喜好与旅行。词汇、句子、语法和离线听力共同推动剧情。
- 两门课均包含开场故事、NPC 对话、地图解锁、守关试炼、经验/等级、金币、区域遗物、旅途日志及每区域三枚真知水晶。
- 已有课程存档可继续使用；重温已完成任务不会重复领取奖励。

### 法语宠物联盟

法语 A1 现为宝可梦风格的宠物收集冒险：24 种原创宠物、8 张可复用区域场景、8 类属性图标、初始伙伴选择和收集图鉴。156 组学习内容按回合挑战：答对发动招式，答错受到反击，体力耗尽可免费休整；全部回合完成后收服宠物。已有学习进度会自动解锁对应宠物，未结束的挑战可继续。
