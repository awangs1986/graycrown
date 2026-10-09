# 独立课程包架构

应用仍由 Rust 启动器在 `127.0.0.1` 随机端口提供静态网页与 JSON 存档接口，打开默认浏览器。课程随应用打包，用户不需要登录。

## 主应用与课程包

- `web/app.mjs`：选课首页、课程加载与退出、全课程备份、共享界面语言。
- `web/course-registry.mjs`：受信任的内置课程目录。只有 `available` 且提供 `load()` 的课程可以进入；`planned` 课程仅展示范围。
- `web/save-store.mjs`：版本 3 存档、旧存档迁移、按课程 ID 更新进度。主应用不解释题型、章节或课程内部进度。
- `web/courses/c/manifest.mjs`：C 课程的稳定 ID、版本、双语名称和简介、题型、播放器加载函数。
- `web/courses/c/`：完整 C 课程包，拥有题库、参考答案、翻译、界面、编辑器、编译沙箱、判题和课程进度规则。
- `web/ai-service.mjs`：公共 AI 请求传输；Rust 根据受信任的 `courseId`（`c`、`csharp`、`french-a1`、`english-nce`）选择导师上下文；省略 ID 的旧请求仍使用 C 导师。

主应用不会导入 C 题库、编辑器或编译器。点击进入 C 课程才动态加载播放器；返回课程首页前等待保存，保存失败则保留当前界面；退出后销毁编辑器、编译 worker 和计时器。

## 课程播放器契约

课程目录中的 `load()` 返回提供 `mount(root, context)` 的模块。`mount` 将界面放入指定根元素，并返回生命周期对象。

```js
export async function mount(root, context) {
  // context.courseId: 当前课程的稳定 ID
  // context.language: 初始界面语言（en / zh-CN）
  // context.progress: 本课程的进度副本，没有存档时为 null
  // await context.saveProgress(progress): 保存本课程进度，失败时抛错
  return {
    async flush() { /* 保存最新输入，等待所有操作；失败时抛错 */ },
    dispose() { /* 释放资源、事件和根元素内容 */ }
  };
}
```

课程进度是课程自己定义和校验的 JSON 对象，建议包含内部版本号。可选 `language` 字段同步主应用的界面语言；它不是所学语言。保存回调捕获注册的课程 ID，课程不向回调提供其他课程的 ID。课程必须将 DOM 事件绑定到自身根元素，释放自身创建的资源，不直接读写 `/api/save`。

这是一套内置模块契约，不是外部插件沙箱。仅允许开发者随应用打包的课程代码；导入进度不会加载代码。C# 使用代码练习播放器，法语使用选择、填空、排序和音频练习播放器，各自决定交互与判题。两者复用 `web/courses/shared/` 中的章节导航、保存队列、备份与导师设置。

## 存档与兼容

`data/save/progress.json` 使用以下外层格式：

```json
{
  "version": 3,
  "language": "zh-CN",
  "activeCourseId": "c",
  "courses": {
    "c": { "version": 2, "started": false },
    "csharp": { "version": 1 },
    "french-a1": { "version": 1 },
    "english-nce": { "version": 1 }
  }
}
```

C# 和法语使用内部 v1 进度，记录当前题目、通关列表、作答草稿、尝试次数、最佳分数和辅助学习记录。C 包沿用自己的 v2 进度字段；外层 v3 与课程内部版本互不关联。章节、题目 ID 只需在各自课程内部唯一。

读取旧 v2 存档时，将原对象完整放入 `courses.c`。首次写入 v3 前，启动器将旧文件保留为 `progress.v2.bak.json`，后续写入继续生成 `progress.json.bak`。备份失败会停止覆盖。无法读取、损坏或未知版本的存档不会静默变成可覆盖的空白进度。

首页导出全部课程；导入按课程 ID 合并，同名课程替换，其他课程保留。C 内部设置只导出/导入当前课程，兼容旧 v2 C 备份。重置 C 不影响其他课程。暂未安装课程的进度也会保留。API 密钥另存在 `ai-settings.json`，不进入课程导出。

## C 编译运行

`compiler.worker.mjs` 只挂载内存中的 `/project`，没有宿主文件映射和网络网关。流程为 `main.c` → Clang/WASIX → `program.wasm` → stdout/stderr。普通编译最多 45 秒、运行最多 4 秒；使用预热 worker 池，每次运行后替换已使用的沙箱，退出课程时关闭整个池。

## C# 编译运行与课程

`web/courses/csharp/` 包含 8 章、96 道练习，按输出和变量 → 输入、类型与字符串 → 条件（先教 ?:，再用 TryParse 验证）→ 循环 → 方法（含重载、out）→ 集合（含排序、string.Join、LINQ 拓展）→ 类与对象（初始化器、构造、属性、封装、enum、try/catch、List<Hero>）→ RPG 整合（两个里程碑 + 毕业项目）推进。每题有显式、稳定的 `id`：首版题目保留原来的位置 ID（如 `cs03-08`），新增题目使用语义 ID（如 `cs-overload`），调整顺序不会让旧存档错位。`requiredPatterns` 用正则检查知识点，避免 `!` 被 `!=` 误判。每题都有知识说明、代码骨架、提示、参考解和输入输出判定。毕业项目包含移动、观察、战斗、药水、钥匙、胜负和退出路径，可下载 `Program.cs` 放入 `dotnet new console` 项目运行。

`runtime/csharp/` 使用 .NET 9 浏览器 WebAssembly 运行时和 Roslyn 4.14.0，真实编译 C# 12。学员无需安装 .NET。`scripts/build-csharp.mjs` 在开发机发布运行时和编译引用，网页按需加载。每次提交创建独立 worker，完成后销毁；加载上限 90 秒，编译上限 30 秒，每组输入运行上限 4 秒，输出上限 64 KB。

浏览器通过注入 `CourseConsole` 别名提供同步 `Console.ReadLine/Read/Write/WriteLine`，输入由练习输入框一次性提供。课程不提供完整桌面 .NET 环境或异步入口支持；下载的代码使用标准 Console，可在原生控制台交互运行。worker 的 CSP 只允许读取 `/csharp/` 下的运行时资源，禁止访问存档、AI 接口、外部网络或新建 worker；Rust 和 Vite 均设置此策略。课程包本身仍属于受信任应用代码。

## 法语 A1 课程与音频

`web/courses/french-a1/` 包含 12 单元、156 个练习、192 项词汇：入门（字母、拼读、数字）→ 问候 → 身份与疑问句 → 家庭 → 日常 → 时间与作息 → 餐饮 → 城市与住房 → 喜好、天气与衣着 → 爱好与邀请 → 身体与健康 → 旅行与计划。题型包含选择、填空、排序、听力理解、听写、阅读及综合测试。每单元 13 个练习，含 6 道以上不重复的语法题；章节测试和毕业测试使用练习中没出现过的新题（毕业测试含 14 小题）。翻译题可接受多种正确表达（`answers` 中任一项或可选 `alternates`）。首版 8 个单元的练习保留原位置 ID（如 `fr02-08`），新增练习使用语义 ID（如 `fr02-drill`、`fr-health-exam`）。课程教学说明采用中文；内容来源见 `CREDITS.md`。

`web/courses/english-nce/` 是对齐《新概念英语》第一、二册语法大纲的原创英语课程：25 单元（`en1-01`…`en1-15` 对应第一册，`en2-01`…`en2-10` 对应第二册）、325 个练习、250 项词汇、325 段离线 MP3（`web/public/audio/en`，`scripts/generate-english-audio.mjs` 生成）。课程 ID 为显式固定格式 `<单元>-<题型编号>`（如 `en1-01-01` 认识新词、`en1-01-13` Boss 综合测试），题型编号由 `LESSON_NUMBERS` 固定，不依赖数组位置。`judge.mjs` 比较时展开缩写（I'm = I am）、兼容英美拼写；`art.mjs` 是统一漫画风 SVG 组件库（地点、固定角色、日常道具），`course.mjs` 根据每道题的英文内容自动选择场景与道具，为每道题生成一幅插图；`battle.mjs` 沿用回合规则，对手是原创捣蛋鬼 Muddle 先生，收集物为“漫画册”页面。不使用任何宝可梦或第三方角色。内容声明见 `CREDITS.md`。

答案归一化接受大小写、常见标点、空格、弯引号及 œ/oe 等差异，但保留影响法语含义的重音差异。音频原文和参考答案作为学习辅助，使用情况计入进度。

228 段 WAV 随包离线提供，位于 `web/public/audio/fr/`。这是 Piper `fr_FR-siwis-medium` 合成语音，非真人录音；支持正常和慢速播放。来源、作者及 CC-BY 4.0 信息见该目录 `ATTRIBUTION.txt`。更改听力文本后需重新生成音频：

```sh
PIPER=/path/to/piper PIPER_MODEL=/path/to/fr_FR-siwis-medium.onnx npm run generate:french-audio
# 只生成缺失的音频：npm run generate:french-audio -- --missing
# 只重新生成指定片段：npm run generate:french-audio -- --ids fr07-exam
```

## 开发与构建

```sh
# 安装 Node.js、Rust、.NET 9 SDK 和 Git LFS 后：
dotnet workload install wasm-tools
git lfs pull
npm ci
npm run build:web
cargo build
```

启动器需能找到构建资源；开发时可使用 `cargo run -- --data-dir ./data --no-open`。单独运行 Vite 只提供前端，存档仍需要启动器接口。离线 Clang 位于 Git LFS：构建可分发应用前需运行 `git lfs pull`，确认 `.webc` 是完整文件而非 LFS 指针。

测试：`npm test` 运行 JavaScript 测试（含 140 道题真实编译运行）和 Rust 测试。Windows 的 Wasmer Node 限制保持原有跳过策略；`?regression` 仍可直接打开 C 浏览器回归入口。

## 课程验证命令

- `npm run test:csharp`：原生 .NET 编译运行 96 道参考程序的 189 组输入输出。可用 `GRAY_CROWN_DOTNET` 指定 dotnet 可执行文件。
- `npm run test:browser`：构建网页和 debug 启动器后，使用 Playwright 在临时存档中检查三个课程入口、浏览器 C# 参考程序、网络隔离、课程切换、法语音频和毕业 RPG。可用 `GRAY_CROWN_BROWSER_PATH` 指定 Chrome/Edge，`GRAY_CROWN_LAUNCHER` 指定启动器。
- `node --test tests/new-courses.test.mjs tests/library-save.test.mjs`：课程内容、判题、音频资源和独立存档检查。

三个课程均已内置并开放。C 课程保持原有 140 道题及其玩法；C# 与法语各自管理进度并逐题解锁。

## 公开网站部署模式

`npm run build:public` 构建独立的 `dist/public-site`，启用 `web/.env.public` 中的公开模式标志。`web/browser-storage.mjs` 将完整课程库保存在当前站点、当前浏览器的 IndexedDB 中，保存事务完成后才返回成功。访客不共用服务器存档；清理站点数据会删除本机进度，跨设备使用需要导出/导入备份。

公开模式不调用桌面启动器的存档和 AI 接口，隐藏 AI 操作入口并在请求模块内阻止调用。服务器只托管构建产物，拒绝 `/api/`，不运行 Rust 启动器。普通 `build:web` 保留本机版的存档和 AI 能力。

部署目标为 `https://learn.awangsawangs.xyz/`；HTTP 重定向到 HTTPS，以满足编译器的安全上下文要求。独立 Nginx 配置设置 COOP/COEP/CORP 和 C# worker 的专用 CSP。具体目录、初次安装步骤和配置见 `deploy/README.md`。

### Shared course adventure loop

C# and French A1 now mount the RPG shell in `web/courses/shared/player.mjs`.
Each course owns `adventure.mjs`: a prologue, ending, region NPCs, relics and a
briefing/success narrative for every existing lesson. The shared shell provides
start screen, region map, sequential quest unlocks, story/workbench layout,
victory settlement and inventory/journal. C# has 8 regions / 96 quests; French
has 12 regions / 156 quest groups. Existing compilers, graders and recordings
remain the mechanisms that decide quest completion.

`shared/adventure.mjs` derives XP, gold and levels from unique completed lesson
IDs (20 XP / 10 gold per ordinary quest, 40 / 20 per region finale), preventing
repeat rewards and crediting existing saves. A relic requires all quests in its
region. Each region grants three reference-answer crystals; revealing the same
answer again is free. Knowledge notes and hints remain available without spending
crystals. French listening transcripts are marked as assistance.

The per-course save remains version 1 with additive `answerReveals`,
`consecutiveFailures` and `mapChapter` fields. Missing fields receive defaults;
first-release lesson IDs, drafts, responses and completion records are preserved.
New units are inserted without locking previously completed regions. Desktop AI
help requires three consecutive unsuccessful submissions and is limited to one
use per region. Public builds continue to disable AI services.

### French creature battles

French A1 uses optional shared presentation hooks for starter choice, illustrated
map nodes, a regional habitat strip, the pet collection dialog and capture results.
C/C# do not supply these hooks. `french-a1/pets.mjs` owns 24 species, 8 attribute
icons and deterministic lesson-to-encounter assignments. Both atlases reside in
`web/public/art/french-pets`; CSS selects their cells without runtime image edits.

`french-a1/battle.mjs` turns a lesson into sequential question rounds. A correct
answer removes 20 opponent HP, an incorrect answer removes one of three companion
stamina points, and free camp recovery preserves cleared rounds. Once every round
is cleared, capture calls the existing completion/reward path. Capture is certain,
with no random learning gate. Pet ownership is derived from completed lesson IDs;
replays do not award duplicate XP/gold. Old completions automatically unlock pets.

Additive v1 fields `battles` and `companionId` preserve in-flight cleared rounds and
partner choice. Restored rounds are regraded against their saved responses before
being accepted; stamina is clamped and companion choices are validated against
starters/captured species. Skipping input never attacks. No learning content or
question/audio IDs were removed.
