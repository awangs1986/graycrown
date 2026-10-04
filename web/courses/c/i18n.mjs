export const EN = 'en';
export const ZH = 'zh-CN';

const englishChapters = [
  { rune:'The First Rune', title:'Fog Harbor', subtitle:'Program structure, printf, escapes, and variables', description:'Complete 20 short trials and wake the lighthouse above the sleeping coast.', scene:'Fog curls through a shattered harbor while the first rune glows beneath the tide.' },
  { rune:'The Second Rune', title:'Black-Iron Bazaar', subtitle:'Data types, assignment, arithmetic, and conversion', description:'Make numbers move between anvils, ledgers, and adventurers.', scene:'Red sparks leap from the bazaar chimneys as iron and coin ring through the streets.' },
  { rune:'The Third Rune', title:'Thornwood', subtitle:'Conditions, comparisons, logic, and switch', description:'Read every sign and choose a safe path through the living forest.', scene:'The thornwood listens to every decision; one false condition can wake the roots.' },
  { rune:'The Fourth Rune', title:'Echo Dungeon', subtitle:'for, while, do-while, and nested loops', description:'Turn repetition into a rhythm strong enough to cross the dungeon.', scene:'Footsteps repeat beneath the dungeon, and every echo marks another loop.' },
  { rune:'The Fifth Rune', title:'Mirror Tower', subtitle:'Functions, parameters, return values, and decomposition', description:'Break ancient spells into clear, reusable functions.', scene:'Mirrors climb into the clouds, reflecting each well-named spell a hundred times.' },
  { rune:'The Sixth Rune', title:'Starlit Ruins', subtitle:'Arrays, strings, maps, structures, and input', description:'Organize the ruins’ scattered records and rebuild their star map.', scene:'Cold stars shine through the ruins, waiting to be arranged into memory.' },
  { rune:'The Seventh Rune', title:'Crown Hall', subtitle:'Pointers, state changes, composition, and interaction', description:'Change the world through memory and answer the Crown’s final choice.', scene:'Seven braziers ignite as the Crown asks you to touch the power flowing through memory.' }
];

const englishTitles = [
  [
    'The First Word from the Dark','Three Bells of Fog Harbor','The Tavern Sign','The Bard’s Exact Words','The Treasure Map’s Strange Path','The Broken Prophecy','The Sword and Gate Mural','The Adventurer Registry','The Last Coins in Your Pocket','The Rusted Sword Plate','The Rune Compass','The Wounded Raven','The Percent Seal','The Alchemist’s Precise Measure','The Mark on the Wall','Whispers of Two Guards','Comments in the Captain’s Log','A Temporary Identity Card','The First Rune Appears','Chapter Trial: Departure Screen'
  ],
  [
    'The Blacksmith’s Sharpening Fee','Reforging the Rusted Sword','Ambush in the Alley','Moonwell Potion','What the Shield Truly Blocked','A Bounty for Three','Counting the Quiver','Double Day at the Giant’s Tavern','The Running Wolf’s Journey','Half a Potion for Each Mage','The Critical Crystal','The Swapping Portals','The Thief’s Switch','The Capital Tax Scroll','The Three-Ring Precedence Trap','The Experience Stairway','The Ancient Balance','Calibrating Rune Coordinates','The Battle Ledger','Chapter Trial: Black-Iron Arena'
  ],
  [
    'The Breathing Thorn Gate','One Life at the Cliff','The Forest Healer’s Diagnosis','The Unbreakable Gargoyle','Two Swaying Bridges','Poison-Fog Alarm','The Moonlit Passage','A Cave Without a Torch','Bargaining with a Goblin','The Coin of Fate','The Owl’s Direction Riddle','The Four-Season Altar','The Royal Chest with Two Keys','The Wolf in Traveler’s Clothes','Judgment of the Dice','Wind at the Map’s Edge','Three Battle Stances','The Ranger’s Dialogue Choice','Has Victory Truly Arrived?','Chapter Trial: Five Paths in the Mist'
  ],
  [
    'The Ten-Step Hall','The Fading Torch','The Bell That Rings at Least Once','Stone-Gate Countdown','The Coin Fountain','Five Heartbeats of Venom','The Ghost on Odd Floors','Find the True Chest','Carving a Health Bar','The Mage Loads a Spell','The Dungeon Brick Wall','The Hollow Chamber','Star Steps to the Altar','The Patrol Coordinate Table','A Combo That Grows Stronger','Rite of the Returning Dead','The Factorial Seal','A Game Loop That Can End','The Spiral Stair Stamina Log','Chapter Trial: Echo Arena'
  ],
  [
    'The Tower’s Welcome','The Status Mirror','The Coordinate Crystal','The Damage Formula Scroll','The Law of Life','The Healing Limit','The Life-Detection Spell','Whose Sword Is Sharper?','A Set of Movement Spells','The Health-Bar Artisan','Dividing the Gatekeeper’s Duties','The Loot Calculator','The Prophecy of Function Prototypes','The NPC’s Message','The Room Numberer','A One-Round Duel','The Pure Oracle','The Tower Lift’s Boundaries','Untangling a Chaotic Spell','Chapter Trial: Mirror Knight'
  ],
  [
    'Five Grains of Stardust','The Tainted Crystal','The Damage Record Tablet','The Four-Way Star Compass','The Hero’s True Name','The Item Cabinet','Searching the Backpack','A Map Line That Changes','Panorama of the Ruins','Count the Stone Walls','One Step on the Map','The Hero Archive','The Monster Compendium','A Structure Enters a Function','The Party Status Board','The Ruins Ask Your Name','The Altar Requests an Offering','The Direction Rune','A Real Step Across the Map','Chapter Trial: Guardian of the Star Map'
  ],
  [
    'The Address Crystal','Healing from Afar','The Great Axe’s True Damage','The Thief’s Key','Teleporting the Coordinates','Swapping Two Artifacts','Read-Only Life Detection','Keeper of the Map','The Movement Judge','Automatic Rune Pickup','The Door That Consumes a Key','Monsters Must Change Too','The Battle Function','A Cowardly Little AI','The NPC’s Two Prophecies','The Game State Machine','The Direction Translator','An Exploration Loop with an Exit','Rehearsal Before Crown Hall','Graduation Trial: The Crown Answers'
  ]
];

const englishTopics = [
  [
    'printf','newline escapes','multi-line output','escaped quotation marks','escaped backslashes','blank lines','ASCII art','int variables','variable assignment','int and char','multiple variables','status output','escaped percent signs','float and %.1f','continuous output','newline control','code comments','mixed variable types','story logs and variables','Day 1 integration'
  ],
  [
    'subtraction and assignment','chained addition','step-by-step subtraction','the += operator','expressions','integer division and remainder','the += and -= operators','the *= and /= operators','multiplication and accumulation','integer division and casts','float arithmetic','swapping with a temporary variable','state toggling','integer arithmetic','operator precedence','long and accumulation','sums and removal','coordinate assignment','combined expressions','three-round variable combat'
  ],
  [
    'if-else','comparison operators','else-if chains','minimum-damage branches','multiple conditions','logical OR ||','logical AND &&','logical NOT !','nested conditions','the ternary operator','switch with char','switch with integers','nested if','nested role checks','boundary conditions','ranges and edges','switch state changes','menu branches','combined victory conditions','integrated branching'
  ],
  [
    'for loops','while loops','do-while loops','countdown loops','loop accumulation','break','continue','search with break','two loops','same-line loop output','nested loops','nested-loop boundaries','nested-loop triangles','2D traversal','loop formulas and totals','double-loop logs','factorials','while(1) and break','loop boundaries','bounded combat loops'
  ],
  [
    'void functions','function parameters','multiple parameters','int return values','return values with lower bounds','function boundaries','boolean-style return values','comparison functions','composing small functions','loops inside functions','separating decisions and display','formula functions','function declarations','switch inside functions','nested calls','function pipelines','side-effect-free functions','clamp functions','single responsibility','six-function combat'
  ],
  [
    'one-dimensional arrays','array mutation','array statistics','parallel arrays','C strings','2D char arrays','character search','in-place string changes','2D maps','2D array statistics','conditional map updates','struct types','arrays of structs','typedef and struct parameters','struct-array statistics','scanf string input','scanf and conditions','scanf char input with switch','input, bounds, and maps','maps, structs, and three-round combat'
  ],
  [
    'addresses and dereferencing','struct pointers and ->','mutating external state through pointers','pointer member mutation','one pointer changing two fields','swapping through int pointers','const pointer parameters','2D array parameters','pointers with 2D maps','movement side effects','pointer state and doors','Monster pointers','pointer-based battle functions','conditional battle state','const char* string arrays','enum state','pointer output parameters','safe input loops with exit','maps, doors, and combat','structs, pointers, functions, input, and switch'
  ]
];

const textBySelector = {
  '.start-card .eyebrow': ['Seven-Day C Adventure','七日 C 语言冒险'],
  '.start-card h1': ['The Ashen Crown','灰烬王冠'],
  '.start-copy': ['Seven runes lie scattered across the North. Write real, runnable C code and make the sleeping Crown shine again.','七枚符文散落北境。写下真正能够运行的代码，让沉睡的王冠重新发光。'],
  '#continueBtn': ['Continue Journey','继续旅程'],
  '#newJourneyBtn': ['Begin a New Journey','开始新旅程'],
  '.local-note': ['Progress is stored in a local JSON file · No account required','进度保存为本机 JSON 文件 · 无需登录'],
  '.map-topbar .brand span:last-child, #challengeView .brand span:last-child': ['The Ashen Crown','灰烬王冠'],
  '.map-topbar .crumb': ['The Seven-Rune Road','七符文之路'],
  '#prevChapterBtn': ['← Previous Chapter','← 上一章'],
  '#nextChapterBtn': ['Next Chapter →','下一章 →'],
  '#prevQuestBtn': ['← Previous Quest','← 上一题'],
  '#nextQuestBtn': ['Next Quest →','下一题 →'],
  '#questPanel .section-title:nth-of-type(1)': ['⚔ Objective','⚔ 任务目标'],
  '#questPanel .section-title:nth-of-type(2)': ['✦ Trial Rules','✦ 试炼规则'],
  '#questPanel .section-title:nth-of-type(3)': ['◉ Three Hint Runes','◉ 三枚启示符文'],
  '#skipQuestBtn': ['Skip This Trial for Now','暂时跳过这项试炼'],
  '#attemptLabel': ['Run as often as you like; rewards are never deducted','可以反复运行，不会扣除奖励'],
  '#saveState': ['● Draft saved','● 草稿已保存'],
  '#answerBtn': ['🔮 Reveal Answer','🔮 查看正确答案'],
  '#runBtn': ['▶ Run Code','▶ 运行代码'],
  '#submitBtn': ['◆ Submit Rune','◆ 提交符文'],
  '.stdin-panel summary': ['Program Input (for scanf)','程序输入（给 scanf 使用）'],
  '[data-tab="console"]': ['Console','控制台'],
  '[data-tab="tests"]': ['Test Results','测试结果'],
  '[data-tab="compiler"]': ['Syntax Check','语法检查'],
  '#explainCompilerBtn': ['✨ Explain with AI','✨ AI解释错误'],
  '#completionDialog .eyebrow': ['Rune Response','符文响应'],
  '#completionTitle': ['Trial Complete','试炼完成'],
  '#stayBtn': ['Stay Here','留在本题'],
  '#nextAfterPassBtn': ['Next Quest →','前往下一题 →'],
  '#xpLabel': ['XP','经验'],
  '#goldLabel': ['Gold','金币'],
  '#answerDialog .eyebrow, #answerConfirmDialog .eyebrow': ['Crystal of Truth','真知水晶'],
  '#answerDialog h2': ['This Crystal Will Shatter','这枚水晶会碎掉'],
  '#closeAnswerBtn': ['Not Yet','暂不查看'],
  '#applyAnswerBtn': ['Insert into Editor','填入编辑器'],
  '#answerConfirmDialog h2': ['Spend One Crystal to Reveal the Answer?','消耗一枚水晶查看答案？'],
  '#cancelAnswerBtn': ['Not Now','暂不使用'],
  '#confirmAnswerBtn': ['Spend Crystal and Reveal','消耗水晶并查看'],
  '#aiConfirmDialog .eyebrow, #aiTutorDialog .eyebrow': ['AI Mentor','AI导师'],
  '#aiConfirmDialog h2': ['Summon This Chapter’s Only Mentor?','召唤本章唯一一次导师？'],
  '#cancelAiTutorBtn': ['Not Now','暂不使用'],
  '#confirmAiTutorBtn': ['Summon Mentor','确认召唤'],
  '#closeAiTutorBtn': ['Understood','我明白了'],
  '#settingsDialog > h2': ['Journey Settings','旅程设置'],
  '#settingsDialog > p': ['This course has its own progress in data/save/progress.json. Backups here contain only the C course.','本课程的独立进度保存在 data/save/progress.json。这里导入和导出的备份仅包含 C 课程。'],
  '.ai-settings-section h3': ['OpenAI-Compatible API','OpenAI兼容 API'],
  '#modelNameLabel': ['Model Name','模型名称'],
  '.ai-settings-section > p': ['The API key is stored separately in data/save/ai-settings.json and is never included in journey exports.','API Key单独保存在本机 data/save/ai-settings.json，不会进入旅程导出文件。'],
  '#saveAiSettingsBtn': ['Save AI Settings','保存AI设置'],
  '#testAiSettingsBtn': ['Test Connection','测试连接'],
  '#exportBtn': ['Export Journey','导出旅程'],
  '.file-label span': ['Import Journey','导入旅程'],
  '#resetProgressBtn': ['Reset C Course','重置 C 课程'],
  '#closeSettingsBtn': ['Close','关闭'],
  '#toastTitle': ['Notice','提示']
};

const attrsBySelector = {
  '#stdinInput': { placeholder:['Enter one value per line. Most early quests require no input.','每行输入一个值；本章题目暂时无需填写。'] },
  '#codeEditor': { 'aria-label':['C code editor','C语言代码编辑器'] },
  '#settingsBtn, #challengeSettingsBtn': { 'aria-label':['Settings','设置'] },
  '#backToMapBtn': { 'aria-label':['Back to chapter map','返回章节地图'] },
  '.chapter-switcher': { 'aria-label':['Chapter navigation','章节切换'] },
  '#chapterCards': { 'aria-label':['Seven-chapter map','七章地图'] },
  '#runtimeBadge': { title:['Local offline WebAssembly compiler sandbox','本机离线 WebAssembly 编译沙箱'] },
  '#fontDownBtn': { title:['Decrease font size','缩小字号'] },
  '#fontUpBtn': { title:['Increase font size','放大字号'] },
  '#resetCodeBtn': { title:['Restore starter code','恢复初始代码'] },
  '#aiApiKey': { placeholder:['Leave blank to keep the saved key; local services may not need one','留空则保留已保存的Key；本地服务可不填'] },
  '#aiModel': { placeholder:['Model name','模型名称'] },
  '.crystal-metric': { title:['Truth crystals remaining in this chapter','本章剩余真知水晶'] }
};

export function pick(language, english, chinese) {
  return language === ZH ? chinese : english;
}

export function applyStaticLanguage(language, root = document) {
  root.documentElement?.setAttribute('lang', language);
  document.title = pick(language, 'The Ashen Crown · C Trials', '灰烬王冠 · C语言试炼');
  for (const [selector, values] of Object.entries(textBySelector)) {
    root.querySelectorAll(selector).forEach(node => { node.textContent = pick(language, ...values); });
  }
  for (const [selector, attrs] of Object.entries(attrsBySelector)) {
    root.querySelectorAll(selector).forEach(node => {
      for (const [name, values] of Object.entries(attrs)) node.setAttribute(name, pick(language, ...values));
    });
  }
  root.querySelectorAll('[data-language-toggle]').forEach(button => {
    button.textContent = language === ZH ? 'EN' : '中文';
    button.title = language === ZH ? 'Switch to English' : '切换为中文';
    button.setAttribute('aria-label', button.title);
  });
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[char]);
}

function expectedAlternatives(rule) {
  if (!rule) return [];
  if (rule.mode === 'oneOf') return (rule.alternatives ?? []).map(item => expectedAlternatives(item).flat()).filter(items => items.length);
  if (rule.mode === 'exact') return [Array.isArray(rule.value) ? rule.value : [rule.value]];
  return [rule.includes ?? []];
}

function expectedHtml(rule) {
  const alternatives = expectedAlternatives(rule);
  if (!alternatives.length || !alternatives.some(lines => lines.length)) return '<em>the behavior described by the test</em>';
  return alternatives.map(lines => `<code>${lines.map(escapeHtml).join('<br>')}</code>`).join(' <strong>or</strong> ');
}

export function localizeChapter(chapter, language) {
  if (language === ZH) return chapter;
  return { ...chapter, ...englishChapters[chapter.day - 1] };
}

export function localizeLesson(lesson, language) {
  if (language === ZH) return lesson;
  const chapter = englishChapters[lesson.chapterIndex];
  const title = englishTitles[lesson.chapterIndex]?.[lesson.localIndex] ?? `Rune Trial ${lesson.localIndex + 1}`;
  const topic = englishTopics[lesson.chapterIndex]?.[lesson.localIndex] ?? 'C programming';
  const expected = expectedHtml(lesson.validation?.output);
  const input = lesson.defaultInput ? `<code>${escapeHtml(lesson.defaultInput.trim())}</code>` : 'None';
  return {
    ...lesson,
    title,
    difficulty: lesson.difficulty.startsWith('★★★') ? '★★★ Advanced' : lesson.difficulty.startsWith('★★☆') ? '★★☆ Beginner' : '★☆☆ Intro',
    knowledge: topic,
    quote: `“Every line you understand brings ${chapter.rune.toLowerCase()} closer.”`,
    story: `${chapter.scene} Your next challenge is “${title}.” Solve it with clear, working C code and let the rune record the result.`,
    objective: `Write a C program that uses <code>${escapeHtml(topic)}</code> to complete this event and produces ${expected}.`,
    rules: `Input: ${input}<br>Core skill: <code>${escapeHtml(topic)}</code><br>Recommended time: ${lesson.minutes} minutes`,
    hints: [
      `Focus on one tool first: <code>${escapeHtml(topic)}</code>. Match the required output exactly.`,
      `Work in three steps: prepare the data, process it, then print ${expected}.`,
      'Compile the smallest working version first. Then check semicolons, braces, format specifiers, spaces, and newlines.'
    ],
    passStory: `The fragment from “${title}” becomes a stream of light and flies deeper into ${chapter.title}.`
  };
}

export function localizeStarterCode(source, language) {
  if (language === ZH) return source;
  return source.replace(/^([ \t]*\/\/).*\p{Script=Han}.*$/gmu, '$1 Complete this trial here');
}

export function runtimeStatus(text, language) {
  if (language === ZH) return text;
  const translations = new Map([
    ['正在预热 Clang 编译池…','Warming up the Clang compiler pool…'], ['Clang 编译池已就绪','Clang compiler pool ready'],
    ['Clang WASM 已就绪','Clang WASM ready'], ['正在隔离运行…','Running in the sandbox…'],
    ['Clang 正在编译…','Clang is compiling…'], ['正在准备编译器…','Preparing compiler…'],
    ['编译沙箱异常','Compiler sandbox error'], ['备用 Clang 已接管','Backup Clang is active'],
    ['正在补充 Clang 沙箱…','Restoring the Clang sandbox…'], ['编译沙箱加载失败','Compiler sandbox failed to load']
  ]);
  return translations.get(text) ?? text;
}
