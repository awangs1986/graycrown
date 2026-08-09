# Gray Crown · 灰烬王冠

<p align="right"><a href="README.zh-CN.md"><kbd>🇨🇳 中文</kbd></a></p>

**Gray Crown** is a story-driven quiz and coding challenge game for learning C fundamentals through an RPG adventure.

Seven runes are scattered across the North. Players travel through 7 chapters and 140 short trials. Every trial has a vivid adventure story, a clear objective, up to three hints, and a built-in C editor. When the player submits code, the game compiles and runs it inside an isolated WebAssembly sandbox, then checks whether the result is correct.

The goal is not to turn a textbook into a question bank. It is to help learners understand C by making a choice, running code, reading the result, and trying again.

## Gameplay

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

```powershell
npm install
npm run dev
```

Build the web app and portable Windows package:

```powershell
npm run package:windows
```

The project uses Vite, CodeMirror, the Wasmer JavaScript SDK, a Rust launcher, and a bundled Clang WebAssembly compiler. See [ARCHITECTURE.md](ARCHITECTURE.md) for architecture, testing, and security details. See [THIRD_PARTY_NOTICES.txt](THIRD_PARTY_NOTICES.txt) for third-party components and their licenses.

## Free to adapt and use

Everyone is welcome to learn from this project, adapt it, build a new course, or use it for teaching, clubs, and personal projects. The project code is released under the MIT License, so you may use, modify, and redistribute it as long as the license and the terms of third-party components are respected. Issues, pull requests, new stories, and alternate worlds are welcome.

See [LICENSE](LICENSE).
