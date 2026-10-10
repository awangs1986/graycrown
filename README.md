# Gray Crown · 灰烬王冠

<p align="right"><a href="README.zh-CN.md"><kbd>🇨🇳 中文</kbd></a></p>

**Gray Crown** is an offline learning application with a C adventure, a C# beginner course, French A1, an English comic RPG aligned to the New Concept English Books 1–2 syllabus, and a classical physics foundations course adapted from OpenStax.

Seven runes are scattered across the North. Players travel through 7 chapters and 140 short trials. Every trial has a vivid adventure story, a clear objective, up to three hints, and a built-in C editor. When the player submits code, the game compiles and runs it inside an isolated WebAssembly sandbox, then checks whether the result is correct.

The goal is not to turn a textbook into a question bank. It is to help learners understand C by making a choice, running code, reading the result, and trying again.

## Course packs

The home screen now provides a course shelf. The existing C adventure is an independent bundled course, with its own progress, drafts and rewards. Legacy C saves migrate automatically and retain a pre-migration backup. Export all courses from the shelf, or back up and reset only the current course from its settings.

All four courses are available:

| Course | Content | Goal |
| --- | --- | --- |
| C | Original 7 chapters, 140 trials | C syntax and programming fundamentals |
| C# | 8 chapters, 96 exercises, real compilation and 189 input/output cases | Build a console text RPG from scratch, step by step |
| French A1 | 12 units (alphabet → travel), 156 exercises, 192 vocabulary entries, 228 offline audio clips | Progressive vocabulary, sentences, grammar, listening and unit tests with fresh items |
| English · Comic City (NCE 1–2 syllabus) | 25 units (15 Book-1-aligned + 10 Book-2-aligned), 325 quests, 250 vocabulary entries, 325 offline MP3 clips, one original comic panel per question | Original dialogues/stories following the NCE grammar sequence; contraction- and UK/US-spelling-tolerant grading |
| Classical Physics (adapted from OpenStax, Chinese) | 11 units, 33 teach→test stages + 11 unit exams, 158 questions (110 numeric), 33 realistic Commons photos, KaTeX formulas offline | Every stage: concept + formula + step-by-step worked example, then a quiz that unlocks only after reading; numeric judge accepts 2 % rounding, scientific notation and unit conversion. Credits: [web/courses/physics/CREDITS.md](web/courses/physics/CREDITS.md) |
| Math Olympiad Thinking (Chinese, original) | 4 stages (primary low/mid/high → junior high), 15 units, 30 teach→test stages + 15 exams, 150 questions, 30 Remotion-rendered worked-example videos with Chinese captions | Thinking methods first, then quiz. One unit (`web/courses/olympiad/content-openstax.mjs`) is adapted from OpenStax Prealgebra 2e and is **CC BY-NC-SA 4.0 (non-commercial), not MIT**. Credits: [web/courses/olympiad/CREDITS.md](web/courses/olympiad/CREDITS.md) |

The new courses use Chinese teaching explanations. C# accepts prefilled console input in the browser and exports source for a native .NET console project. French includes choices, typing, word ordering, dictation and reading; attributed synthetic audio supports slow playback. Course content credits: [web/courses/french-a1/CREDITS.md](web/courses/french-a1/CREDITS.md), [web/courses/english-nce/CREDITS.md](web/courses/english-nce/CREDITS.md) (aligned to the NCE syllabus, original content).

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

### 经典物理入门（改编自 OpenStax）

讲解与例题改编自 OpenStax《Physics》（流体单元改编自《College Physics》第 1 版），均为 CC BY 4.0，已译为简体中文并改写。11 个单元：测量与单位、一维运动、二维运动与抛体、牛顿定律与力、圆周运动与万有引力、功能与功率、动量与碰撞、转动与力矩、流体、振动波与声音、温度与热。每个阶段固定为“先讲解（概念 + KaTeX 公式 + 分步例题）→ 读完后解锁测验”，单元末先公式回顾再综合测试。数值题容许 2% 误差，支持科学计数法与单位换算；所有数值答案由测试脚本逐题重新计算。每个阶段配一张直接展示该物理现象的真实照片（Wikimedia Commons，逐张署名见 [CREDITS](web/courses/physics/CREDITS.md)）。界面为简洁的“实验笔记本”风格，不使用 RPG 元素。

### 英语 · 漫画城大冒险（新概念 1–2 册大纲）

对齐《新概念英语》第一、二册语法与话题顺序的原创英语课程：第一册对应 15 个街区（Is this your…? → 比较级），第二册对应 10 个故事海岸区域（叙事过去时 → 情态推测）。共 325 格漫画任务，含词汇、原创对话与小故事、语法、中译英（多种正确答案）、听力与听写。所有插图由共享漫画组件库 `shared/comic-kit.mjs` 的统一漫画风 SVG 组件（固定主角团 + 日常场景 + 道具）按题目内容自动组合；回合对战、经验、金币、遗物与漫画册收集保持 RPG 设计。内容声明：仅对齐大纲，课文与练习均为原创，见 [CREDITS](web/courses/english-nce/CREDITS.md)。

### 法语 · 巴黎漫画大冒险

法语 A1 与英语课程共用同一套漫画风 SVG 组件，换上巴黎主题：街角小学、蒙马特街角、邮局、公寓、面包店、地铁、咖啡馆、塞纳河畔、露天市集、卢森堡花园、药房和火车站共 12 个场景，原创固定角色 Léa、Hugo、Camille 等，每道题按法语内容自动配一幅日常生活插图。156 格漫画任务保持 RPG 设计：地图、回合对战（答对命中、答错反击、体力耗尽免费休息）和每章 Boss 战（捣蛋鬼 Gribouille 先生），通关收录“巴黎漫画册”。课程 ID 不变，已有学习进度与未完成的对战直接沿用。
