# 独立课程包架构

应用仍由 Rust 启动器在 `127.0.0.1` 随机端口提供静态网页与 JSON 存档接口，打开默认浏览器。课程随应用打包，用户不需要登录。

## 主应用与课程包

- `web/app.mjs`：选课首页、课程加载与退出、全课程备份、共享界面语言。
- `web/course-registry.mjs`：受信任的内置课程目录。只有 `available` 且提供 `load()` 的课程可以进入；`planned` 课程仅展示范围。
- `web/save-store.mjs`：版本 3 存档、旧存档迁移、按课程 ID 更新进度。主应用不解释题型、章节或课程内部进度。
- `web/courses/c/manifest.mjs`：C 课程的稳定 ID、版本、双语名称和简介、题型、播放器加载函数。
- `web/courses/c/`：完整 C 课程包，拥有题库、参考答案、翻译、界面、编辑器、编译沙箱、判题和课程进度规则。
- `web/ai-service.mjs`：公共 AI 请求传输；Rust 根据受信任的 `courseId`（`c`、`csharp`、`french-a1`）选择导师上下文；省略 ID 的旧请求仍使用 C 导师。

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
    "french-a1": { "version": 1 }
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
