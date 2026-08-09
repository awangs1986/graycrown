const baseSkeleton = `#include <stdio.h>

int main(void) {
    // 在这里编写代码

    return 0;
}`;

export const lessons = [
  {
    id: 'D1-Q01', title: '来自黑暗的第一句话', difficulty: '★☆☆ 入门', knowledge: 'printf', minutes: 8,
    quote: '“冒险者……如果你还能听见，就回答我。”',
    story: '你在一艘破碎的商船上醒来。浓雾吞没了海岸，木箱里的通讯水晶忽然亮起。你需要用第一段 C 语言程序回应它。',
    objective: '编写一个完整的 C 程序，输出 <code>Hello, Adventurer!</code>，并在结尾换行。',
    rules: '输入：无<br>必须使用：<code>printf</code><br>暂时不能使用：<code>scanf</code>、分支、循环',
    starterCode: baseSkeleton,
    hints: ['通讯水晶只能听见由 <code>printf</code> 发出的文字。', '把输出语句放在 <code>main</code> 函数的花括号里面。', '字符串放在双引号中；换行使用 <code>\\n</code>。'],
    validation: { output: { mode: 'exact', value: 'Hello, Adventurer!\n' }, code: [{ pattern: /\bprintf\s*\(/, message: '必须使用 printf 发出这句话。' }] },
    passStory: '通讯水晶的光芒稳定下来。远方的灯塔随之亮起，雾港第一次出现在你的视野中。'
  },
  {
    id: 'D1-Q02', title: '雾港的三声钟响', difficulty: '★☆☆ 入门', knowledge: '换行符', minutes: 8,
    quote: '“每一道钟声，都代表港口正在失去什么。”',
    story: '远处钟楼依次传来清晨、警报与封港三次钟声。守灯人要你把它们记录在同一份航海日志里。',
    objective: '只使用一次 <code>printf</code>，分三行输出 <code>Dawn Bell</code>、<code>Alarm Bell</code>、<code>Harbor Closed</code>，最后一行也要以换行结束。',
    rules: '输入：无<br>必须使用：一次 <code>printf</code><br>练习重点：三个 <code>\\n</code>（两个分隔三段文字，一个结束最后一行）',
    starterCode: baseSkeleton,
    hints: ['三段文字之间需要两个 <code>\\n</code>，这样它们会分别出现在三行。', '第三段文字末尾还要再放一个 <code>\\n</code>；因此总共使用三个换行符。', '完整结构是 <code>printf("Dawn Bell\\nAlarm Bell\\nHarbor Closed\\n");</code>。'],
    validation: { output: { mode: 'exact', value: 'Dawn Bell\nAlarm Bell\nHarbor Closed\n' }, code: [{ pattern: /\bprintf\s*\(/, message: '需要使用 printf。' }], maxPrintf: 1 },
    passStory: '三声钟响被完整记录。雾中的海鸟改变方向，像是在为你指路。'
  },
  {
    id: 'D1-Q03', title: '酒馆门口的木牌', difficulty: '★☆☆ 入门', knowledge: '多行输出', minutes: 8,
    quote: '“选吧，陌生人。雾散以前，门只开一次。”',
    story: '酒馆的木牌被风吹得不断摇晃，上面的三项选择已经模糊。重新写出菜单，让后来者知道该往哪里走。',
    objective: '分三行输出 <code>1) Enter</code>、<code>2) Ask</code>、<code>3) Leave</code>。',
    rules: '输入：无<br>允许一次或多次 <code>printf</code><br>顺序必须正确',
    starterCode: baseSkeleton,
    hints: ['每一项菜单占一行。', '可以写三个 printf，也可以在一个字符串中使用换行。', '逐字检查括号、空格和大小写。'],
    validation: { output: { mode: 'exact', value: '1) Enter\n2) Ask\n3) Leave\n' }, code: [{ pattern: /\bprintf\s*\(/, message: '需要使用 printf。' }] },
    passStory: '木牌重新变得清晰，酒馆的门锁发出一声轻响。'
  },
  {
    id: 'D1-Q04', title: '吟游诗人的原话', difficulty: '★☆☆ 入门', knowledge: '转义双引号', minutes: 10,
    quote: '“一句话如果少了引号，预言就会变成谣言。”',
    story: '吟游诗人坚持要你逐字记录他的警告，连双引号也不能遗漏。',
    objective: '输出 <code>The bard said, "Run!"</code> 并换行。',
    rules: '输入：无<br>必须让双引号出现在输出中<br>练习重点：<code>\\"</code>',
    starterCode: baseSkeleton,
    hints: ['字符串本身由双引号包围，内部双引号需要特殊写法。', '在需要显示的双引号前加反斜杠。', '核心片段是 <code>\\"Run!\\"</code>。'],
    validation: { output: { mode: 'exact', value: 'The bard said, "Run!"\n' }, code: [{ pattern: /\\"Run!\\"/, message: '请在字符串中使用转义双引号。' }] },
    passStory: '诗人满意地点头，把一枚刻着乌鸦的铜片交给了你。'
  },
  {
    id: 'D1-Q05', title: '藏宝图的奇怪路径', difficulty: '★★☆ 基础', knowledge: '反斜杠转义', minutes: 10,
    quote: '“地图不在羊皮纸上，它藏在一条路径里。”',
    story: '藏宝图只留下了一段旧世界路径。若少写一个反斜杠，密室就会永远消失。',
    objective: '输出 <code>C:\\AshKing\\map.txt</code> 并换行。',
    rules: '输入：无<br>输出中每个位置只有一个反斜杠<br>C 字符串里需要写成两个',
    starterCode: baseSkeleton,
    hints: ['反斜杠本身也是转义字符。', '要显示一个反斜杠，字符串中要连续写两个。', '路径开头可以写成 <code>C:\\\\AshKing</code>。'],
    validation: { output: { mode: 'exact', value: 'C:\\AshKing\\map.txt\n' }, code: [{ pattern: /C:\\\\AshKing\\\\map\.txt/, message: '请在C字符串中用两个反斜杠表示一个反斜杠。' }] },
    passStory: '路径化作一条发光的细线，指向酒馆地板下方。'
  },
  {
    id: 'D1-Q06', title: '断裂的预言碑', difficulty: '★☆☆ 入门', knowledge: '空行', minutes: 8,
    quote: '“缺失的那一行，正是王冠破碎的地方。”',
    story: '石碑上下两句之间留着一道裂缝。抄录预言时，必须保留这片沉默。',
    objective: '输出 <code>The crown was broken.</code>，空一行，再输出 <code>Seven runes remain.</code>。',
    rules: '输入：无<br>两句话之间必须有一个完整空行',
    starterCode: baseSkeleton,
    hints: ['空行意味着连续出现两个换行。', '第一句后需要两个 <code>\\n</code>。', '预期结构：第一句、换行、空行、第二句、换行。'],
    validation: { output: { mode: 'exact', value: 'The crown was broken.\n\nSeven runes remain.\n' } },
    passStory: '当最后一个句点落下，碑上的第一枚符文轮廓开始发光。'
  },
  {
    id: 'D1-Q07', title: '剑与门的壁画', difficulty: '★★☆ 创作', knowledge: 'ASCII 图案', minutes: 15,
    quote: '“门后有剑，还是剑守着门？”',
    story: '密室墙上只有褪色的轮廓。用字符补完壁画，古老机关才会承认你看懂了它。',
    objective: '使用若干次 <code>printf</code> 画出至少4行的ASCII小画，画面必须同时包含剑的符号 <code>+</code> 和门 <code>[]</code>。',
    rules: '输入：无<br>至少4行<br>输出必须包含 <code>+</code> 与 <code>[]</code>',
    starterCode: baseSkeleton,
    hints: ['先在纸上决定每一行画什么。', '每个 printf 可以负责一行，比较容易修改。', '先保证4行和两个指定符号，再增加其他装饰。'],
    validation: { output: { mode: 'custom', includes: ['+', '[]'], minLines: 4 }, code: [{ pattern: /\bprintf\s*\(/, message: '壁画需要通过 printf 输出。' }] },
    passStory: '壁画中的剑闪过银光，石门向内退开半步。'
  },
  {
    id: 'D1-Q08', title: '冒险者登记册', difficulty: '★★☆ 基础', knowledge: 'int 变量', minutes: 10,
    quote: '“没有等级的人，连失踪都不会被记录。”',
    story: '港口书记员推来一本厚重名册。你需要声明自己的初始等级，而不是把数字直接刻死在纸上。',
    objective: '定义 <code>int level = 1;</code>，输出 <code>Adventurer Level: 1</code>。数字必须来自变量。',
    rules: '输入：无<br>必须定义整数变量 <code>level</code><br>必须用 <code>%d</code> 输出它',
    starterCode: baseSkeleton,
    hints: ['整数可以保存在 int 类型的变量中。', '先声明 level，再把它作为 printf 的参数。', '格式字符串中的整数位置使用 <code>%d</code>。'],
    validation: { output: { mode: 'exact', value: 'Adventurer Level: 1\n' }, code: [{ pattern: /\bint\s+level\s*=\s*1\s*;/, message: '请定义 int level = 1;' }, { pattern: /printf\s*\([^;]*%d[^;]*level/, message: '数字必须通过 %d 和 level 变量输出。' }] },
    passStory: '书记员在你的名字旁盖下一级冒险者的蓝色印章。'
  },
  {
    id: 'D1-Q09', title: '怀里的最后一枚金币', difficulty: '★★☆ 基础', knowledge: '变量赋值', minutes: 12,
    quote: '“一枚不够启程。拿着，等你活着回来再还。”',
    story: '你原本只有一枚金币，酒馆老板又塞给你四枚。用同一个变量记录这次变化。',
    objective: '定义 <code>int gold = 1;</code> 并输出；把它改成5，再次输出。',
    rules: '输入：无<br>必须使用同一个 <code>gold</code> 变量<br>输出两行：<code>Gold: 1</code> 与 <code>Gold: 5</code>',
    starterCode: baseSkeleton,
    hints: ['变量声明后可以再次赋值。', '第一次 printf 后写 <code>gold = 5;</code>。', '两次输出都使用 <code>%d</code> 和 gold。'],
    validation: { output: { mode: 'exact', value: 'Gold: 1\nGold: 5\n' }, code: [{ pattern: /\bint\s+gold\s*=\s*1\s*;/, message: '请先把 gold 初始化为1。' }, { pattern: /\bgold\s*=\s*5\s*;/, message: '第一次输出后，请把 gold 改为5。' }] },
    passStory: '五枚金币在掌心发出轻响。你的旅程终于有了第一笔路费。'
  },
  {
    id: 'D1-Q10', title: '锈剑的铭牌', difficulty: '★★☆ 基础', knowledge: 'int 与 char', minutes: 12,
    quote: '“它很旧，但还记得自己曾经的品级。”',
    story: '铁匠从炉灰中捞出一块锈剑铭牌。记录攻击力和品级，它才愿意为这把剑重新开刃。',
    objective: '定义 <code>int atk = 7;</code> 和 <code>char rank = \'D\';</code>，分别输出 <code>ATK: 7</code> 与 <code>Rank: D</code>。',
    rules: '输入：无<br>整数使用 <code>%d</code><br>字符使用 <code>%c</code>',
    starterCode: baseSkeleton,
    hints: ['单个字符用 char 保存，并使用单引号。', '输出 char 时使用 %c。', '分别声明 atk 和 rank，再用两次 printf。'],
    validation: { output: { mode: 'exact', value: 'ATK: 7\nRank: D\n' }, code: [{ pattern: /\bint\s+atk\s*=\s*7\s*;/, message: '请定义攻击变量 atk。' }, { pattern: /\bchar\s+rank\s*=\s*\'D\'\s*;/, message: '请定义字符变量 rank。' }] },
    passStory: '铭牌上的D级刻痕重新显现，锈剑发出一声低鸣。'
  },
  {
    id: 'D1-Q11', title: '符文罗盘', difficulty: '★★☆ 基础', knowledge: '多个变量', minutes: 10,
    quote: '“它不指向北方，只指向失落的符文。”',
    story: '罗盘的双针分别停在3和8。把横纵坐标存进变量，记录第一枚符文的位置。',
    objective: '使用 <code>int x = 3, y = 8;</code>，输出 <code>Rune detected at (3, 8)</code>。',
    rules: '输入：无<br>两个数字都必须来自变量',
    starterCode: baseSkeleton,
    hints: ['一行可以声明两个相同类型的变量。', '格式字符串中需要两个 %d。', 'printf 后面的参数顺序应当是 x、y。'],
    validation: { output: { mode: 'exact', value: 'Rune detected at (3, 8)\n' }, code: [{ anyOf: [/\bint\s+x\s*=\s*3\s*,\s*y\s*=\s*8\s*;/, /\bint\s+x\s*=\s*3\s*;[\s\S]*\bint\s+y\s*=\s*8\s*;/, /\bint\s+y\s*=\s*8\s*;[\s\S]*\bint\s+x\s*=\s*3\s*;/], message: '请使用整数变量 x=3 和 y=8 保存坐标，可以合并或分开声明。' }] },
    passStory: '罗盘指针重合，雾港地下传来机关转动的声音。'
  },
  {
    id: 'D1-Q12', title: '受伤的信鸦', difficulty: '★★☆ 基础', knowledge: '状态输出', minutes: 10,
    quote: '“先别问信是谁写的，救活送信的人。”',
    story: '一只信鸦跌落在窗边。它的当前生命是27，最大生命是40。记录状态，炼金师才能决定药量。',
    objective: '定义 <code>hp</code> 和 <code>max_hp</code>，输出 <code>Raven HP: 27/40</code>。',
    rules: '输入：无<br>两个数字必须来自两个变量',
    starterCode: baseSkeleton,
    hints: ['当前生命和最大生命分别保存。', '格式字符串需要两个 %d，中间直接写 /。', '参数顺序是 hp、max_hp。'],
    validation: { output: { mode: 'exact', value: 'Raven HP: 27/40\n' }, code: [{ pattern: /\bint\s+[^;]*\bhp\s*=\s*27/, message: '请定义整数变量 hp=27，可以单独或合并声明。' }, { pattern: /\bint\s+[^;]*\bmax_hp\s*=\s*40/, message: '请定义整数变量 max_hp=40，可以单独或合并声明。' }] },
    passStory: '炼金师确认了剂量，信鸦重新睁开银灰色的眼睛。'
  },
  {
    id: 'D1-Q13', title: '密封蜡上的百分号', difficulty: '★★☆ 基础', knowledge: '%% 转义', minutes: 8,
    quote: '“结界还差最后十五格，但别让符号吞掉你的数字。”',
    story: '港口结界已经充能到85%。记录员提醒你：百分号在输出咒语里有自己的含义。',
    objective: '输出 <code>Seal Charge: 85%</code> 并换行。',
    rules: '输入：无<br>在 printf 的格式字符串中用 <code>%%</code> 显示一个百分号',
    starterCode: baseSkeleton,
    hints: ['printf 会把单个 % 当作格式符的开头。', '连续写两个百分号，输出时会变成一个。', '字符串结尾应包含 <code>85%%\\n</code>。'],
    validation: { output: { mode: 'exact', value: 'Seal Charge: 85%\n' }, code: [{ pattern: /85%%/, message: '请在格式字符串中写 %% 来输出百分号。' }] },
    passStory: '结界读数稳定下来，港口上空的裂纹停止扩散。'
  },
  {
    id: 'D1-Q14', title: '炼金师的精确刻度', difficulty: '★★☆ 基础', knowledge: 'float 与 %.1f', minutes: 12,
    quote: '“多一滴会睡三天，少一滴会完全没用。”',
    story: '月泉药剂只剩12.5毫升。炼金师要求你用一位小数准确记录，不能含糊。',
    objective: '定义 <code>float potion = 12.5f;</code>，输出 <code>Potion: 12.5 ml</code>。',
    rules: '输入：无<br>必须使用 float 变量<br>使用 <code>%.1f</code> 保留一位小数',
    starterCode: baseSkeleton,
    hints: ['带小数的数据可以用 float 保存。', 'float 字面量末尾可以加 f。', 'printf 中用 %.1f 输出一位小数。'],
    validation: { output: { mode: 'exact', value: 'Potion: 12.5 ml\n' }, code: [{ pattern: /\bfloat\s+potion\s*=\s*12\.5f?\s*;/, message: '请定义 float potion = 12.5f;' }, { pattern: /%\.1f/, message: '请使用 %.1f 输出一位小数。' }] },
    passStory: '刻度与药液表面严丝合缝，炼金师终于松开了皱紧的眉头。'
  },
  {
    id: 'D1-Q15', title: '墙上的暗号', difficulty: '★☆☆ 入门', knowledge: '连续输出', minutes: 8,
    quote: '“三道刻痕，少一道是假门，多一道是陷阱。”',
    story: '地下通道的墙上需要出现三枚连续的井号。你还不会循环，只能稳稳地发出三次刻印。',
    objective: '使用三次独立的 <code>printf</code>，最终在同一行显示 <code>###</code>，然后换行。',
    rules: '输入：无<br>必须恰好调用三次 printf<br>前两次不能提前换行',
    starterCode: baseSkeleton,
    hints: ['每次 printf 只输出一个 #。', '前两次不要写换行。', '第三次可以输出 # 和换行符。'],
    validation: { output: { mode: 'exact', value: '###\n' }, exactPrintf: 3 },
    passStory: '三道刻痕同时亮起，一段隐藏楼梯从墙后滑出。'
  },
  {
    id: 'D1-Q16', title: '两名守卫的耳语', difficulty: '★★☆ 基础', knowledge: '控制换行', minutes: 10,
    quote: '“口令要连在一起说，名字必须单独报上。”',
    story: '两名守卫隔着门缝核对身份。他们的问答必须出现在同一行，而你的名字要在下一行单独出现。',
    objective: '输出两行：<code>Guard A: Who goes there? Guard B: Friend.</code> 和 <code>Aster</code>。至少使用两次 <code>printf</code>。',
    rules: '输入：无<br>第一行包含两名守卫的问答<br>第二行只有角色名',
    starterCode: baseSkeleton,
    hints: ['第一次输出可以先不换行。', '第二次先接上 Guard B，再换行。', '最后再输出名字 Aster。'],
    validation: { output: { mode: 'exact', value: 'Guard A: Who goes there? Guard B: Friend.\nAster\n' }, minPrintf: 2 },
    passStory: '守卫确认了口令，铁门后的锁链一节节松开。'
  },
  {
    id: 'D1-Q17', title: '航海日志的注释', difficulty: '★★☆ 基础', knowledge: '代码注释', minutes: 12,
    quote: '“写给人的话留在纸上，写给水晶的话才会发出声音。”',
    story: '船长的日志混合了记录与命令。使用两种注释，让说明留在代码里，但不出现在运行结果中。',
    objective: '程序顶部写一段包含 <code>Day 1 - Fog Harbor</code> 的多行注释；输出前写一条单行注释；程序只输出 <code>Log restored.</code>。',
    rules: '输入：无<br>必须同时出现 <code>/* ... */</code> 与 <code>//</code><br>注释不能出现在输出中',
    starterCode: baseSkeleton,
    hints: ['多行注释由 /* 开始、*/ 结束。', '单行注释从 // 开始，到本行结束。', '两类注释都不会被 printf 输出。'],
    validation: { output: { mode: 'exact', value: 'Log restored.\n' }, code: [{ pattern: /\/\*[\s\S]*Day 1 - Fog Harbor[\s\S]*\*\//, message: '程序顶部需要包含指定文字的多行注释。', source: 'original' }, { pattern: /\/\/[^\n]*/, message: '输出语句前需要一条单行注释。', source: 'original' }] },
    passStory: '日志恢复后，一段被遗忘的航线在纸页背面浮现。'
  },
  {
    id: 'D1-Q18', title: '临时身份卡', difficulty: '★★★ 综合', knowledge: '多类型变量', minutes: 15,
    quote: '“名字会改变，身份会伪装，但数值不会说谎。”',
    story: '进入雾港内城前，你需要制作一张临时身份卡。边框、名字首字母和三项数值缺一不可。',
    objective: '定义名字首字母、等级、生命和金币四个变量，输出一张至少5行、带上下边框的身份卡。',
    rules: '输入：无<br>至少5行<br>必须包含4个变量的值<br>上下边框都必须包含 <code>=</code>',
    starterCode: baseSkeleton,
    hints: ['先声明 char initial，以及三个 int 变量。', '把每一行身份信息分开输出。', '推荐顺序：边框、名字、等级、HP与金币、边框。'],
    validation: { output: { mode: 'custom', includes: ['=', 'Name', 'Level', 'HP', 'Gold'], minLines: 5 }, code: [{ pattern: /\bchar\s+\w+\s*=/, message: '请用 char 保存名字首字母。' }], minDeclarations: 4 },
    passStory: '身份卡盖上雾港印章，你获得了进入内城的资格。'
  },
  {
    id: 'D1-Q19', title: '第一枚符文现身', difficulty: '★★★ 综合', knowledge: '剧情日志与变量', minutes: 15,
    quote: '“别眨眼。沉睡百年的东西，正准备醒来。”',
    story: '海水开始发光，密室中的木箱不断震动。记录符文现身的三个瞬间，并显示当前收集数量。',
    objective: '依次输出 <code>The sea glows.</code>、<code>The chest shakes.</code>、<code>The rune rises!</code>，最后用变量 <code>runes = 1</code> 输出 <code>Runes: 1</code>。',
    rules: '输入：无<br>共四行<br>最后的数字必须来自变量',
    starterCode: baseSkeleton,
    hints: ['前三行是固定剧情日志。', '第四行需要先定义整数变量 runes。', '使用 %d 输出 runes。'],
    validation: { output: { mode: 'exact', value: 'The sea glows.\nThe chest shakes.\nThe rune rises!\nRunes: 1\n' }, code: [{ pattern: /\bint\s+runes\s*=\s*1\s*;/, message: '请定义 int runes = 1;' }, { pattern: /printf\s*\([^;]*%d[^;]*runes/, message: '符文数量必须通过 runes 变量输出。' }] },
    passStory: '第一枚符文穿过木箱，悬停在你的掌心上方。整个雾港的雾都亮了一瞬。'
  },
  {
    id: 'D1-Q20', title: '章节试炼：启航画面', difficulty: '★★★ 章节收束', knowledge: 'Day 1 综合', minutes: 25,
    quote: '“让所有人看见你的名字。雾港将为你打开出海之门。”',
    story: '第一枚符文已经归位。离开雾港前，你要为自己的冒险制作一张启航画面，证明你已经学会让程序清楚地表达信息。',
    objective: '制作不少于8行的标题画面，包含游戏名 <code>Ash Crown</code>、边框、欢迎语、等级、HP、金币和 <code>Press Start</code>。至少4个数值或字符来自变量。',
    rules: '输入：无<br>至少8行<br>至少声明4个变量<br>必须出现所有指定信息',
    starterCode: baseSkeleton,
    hints: ['先列出8行内容，再逐行实现。', '先定义 level、hp、gold 和 rank，然后在状态行中使用格式符。', '先完成必须文字与变量，再添加边框；不需要复杂图案。'],
    validation: { output: { mode: 'custom', includes: ['Ash Crown', 'Welcome', 'Level', 'HP', 'Gold', 'Press Start'], minLines: 8 }, minDeclarations: 4 },
    passStory: '启航画面映在港口巨帆上。第一枚符文彻底点亮，通往黑铁集市的航线出现在海图中。'
  }
];

export const chapter = {
  id: 'day01',
  title: '雾港',
  subtitle: '程序结构、printf、转义字符与变量',
  total: lessons.length
};
