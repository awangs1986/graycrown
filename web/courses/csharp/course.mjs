// Lesson IDs are explicit and stable: saved progress (shared/progress.mjs) is keyed by them.
// Older lessons keep the positional ID they had before the 2026 reordering, so existing saves map correctly.
const prelude = 'using System;\nusing System.Collections.Generic;\n\n';
const linqPrelude = 'using System;\nusing System.Collections.Generic;\nusing System.Linq;\n\n';
const t = (id, title, topic, teach, objective, code, output, options = {}) => ({ id, title, topic, teach, objective, solution: (options.linq ? linqPrelude : prelude) + code, tests: [{ input: '', output }], ...options });
const inputTests = (...pairs) => pairs.map(([input, output]) => ({ input, output }));

export const chapters = [
  {
    id: 'cs01', title: '雾港启程', subtitle: '输出、变量与表达式',
    introduction: '程序按从上到下的顺序执行。C# 区分大小写，语句通常以分号结束。Console.WriteLine(...) 输出一行文字；字符串放在双引号中。我们采用 C# 的顶层语句写法，不必先背诵 Main 方法。变量是有名字、有类型的储物格：int 存整数，string 存文字。',
    lessons: [
      t('cs01-01', '向港口问好', 'Console.WriteLine', 'Console 是控制台；WriteLine 会输出括号里的内容并换行。例：Console.WriteLine("Hi!");。双引号属于语法，不会出现在输出里。', '输出一行 Hello, Adventurer!。', 'Console.WriteLine("Hello, Adventurer!");', 'Hello, Adventurer!\n', { required: ['Console.WriteLine'] }),
      t('cs01-02', '两条航海日志', '执行顺序', '多条语句从上往下执行。每条 WriteLine 后都有一个换行，每条语句后需要分号。', '依次输出 Fog Harbor 和 The journey begins，各占一行。', 'Console.WriteLine("Fog Harbor");\nConsole.WriteLine("The journey begins");', 'Fog Harbor\nThe journey begins\n'),
      t('cs01-03', '同一行的欢迎语', 'Write 与 WriteLine', 'Write 不自动换行，WriteLine 自动换行。空格也是字符串的一部分。', '先用 Write 输出 Welcome, ，再用 WriteLine 输出 Hero!，合成一行。', 'Console.Write("Welcome, ");\nConsole.WriteLine("Hero!");', 'Welcome, Hero!\n', { required: ['Console.Write(', 'Console.WriteLine'] }),
      t('cs01-05', '写给未来自己的笔记', '注释', '// 后面直到行尾都是注释，不会执行。注释说明原因或意图；输出仍由语句产生。', '写一条 // 注释，程序只输出 Ready。', '// The journey starts here.\nConsole.WriteLine("Ready");', 'Ready\n', { requiredRaw: ['//'] }),
      t('cs01-04', '地图上的引号', '转义字符', '字符串中的双引号用反斜杠转义，反斜杠本身也要转义。', '输出 The sign says "North"，再输出 C:\\Map。', String.raw`Console.WriteLine("The sign says \"North\"");
Console.WriteLine("C:\\Map");`, 'The sign says "North"\nC:\\Map\n'),
      t('cs01-06', '初始生命值', 'int', 'int hp = 10; 声明整数变量并赋初值。之后可以读取 hp，不需要再次写类型。', '声明 int hp = 30，并用变量输出 30。', 'int hp = 30;\nConsole.WriteLine(hp);', '30\n', { required: ['int ', 'hp'] }),
      t('cs01-07', '英雄的名字', 'string', 'string 保存文字。变量名不加引号；写 "name" 会输出字面文字，而不是变量的内容。', '声明 string name = "Mira"，输出变量 name。', 'string name = "Mira";\nConsole.WriteLine(name);', 'Mira\n', { required: ['string ', 'name'] }),
      t('cs01-09', '治疗后的生命', '赋值', '= 表示把右边的结果放入左边的变量，不是数学中的相等判断。变量声明一次，之后可以反复赋值。', 'hp 初始为 12，输出它，再赋值为 20 并输出。', 'int hp = 12;\nConsole.WriteLine(hp);\nhp = 20;\nConsole.WriteLine(hp);', '12\n20\n', { required: ['hp ='] }),
      t('cs01-10', '修复铁剑', '算术表达式', '+、-、*、/ 表示加减乘除。括号能明确先算什么，乘除通常先于加减。', '用 attack=4 和 bonus=3，输出 (attack + bonus) * 2 的结果。', 'int attack = 4, bonus = 3;\nConsole.WriteLine((attack + bonus) * 2);', '14\n', { required: ['attack', 'bonus', '*'] }),
      t('cs01-11', '背包金币', '复合赋值', 'gold += 5 等价于 gold = gold + 5。-= 同理。先执行的变化会影响后续表达式。', '金币初始 10，获得 7，再花费 4，输出最终金币数。', 'int gold = 10;\ngold += 7;\ngold -= 4;\nConsole.WriteLine(gold);', '13\n', { required: ['+=', '-='] }),
      t('cs02-11', '倒数计数器', '自增与自减', 'count++ 让变量增加 1，count-- 让变量减少 1，它们分别是 count += 1 和 count -= 1 的简写。初学时把它们单独写成一条语句，最容易看清执行顺序。', '步数 steps 初始为 3。先用 ++ 增加 1 并输出，再用两次 -- 各减少 1 并输出。', 'int steps = 3;\nsteps++;\nConsole.WriteLine(steps);\nsteps--;\nsteps--;\nConsole.WriteLine(steps);', '4\n2\n', { required: ['++', '--'], hint: '++ 和 -- 都是单独一条语句，后面要加分号；输出两次，中间要减两次。' }),
      t('cs01-08', '制作角色名牌', '字符串插值', '$"Name: {name}" 将变量的值嵌入文字。字符串前的 $ 与花括号要同时出现。', '用 name="Mira" 和 level=1，通过插值输出 Mira Lv.1。', 'string name = "Mira";\nint level = 1;\nConsole.WriteLine($"{name} Lv.{level}");', 'Mira Lv.1\n', { required: ['$"', 'level'] }),
      t('cs01-12', '章节试炼：出发面板', '整合输出与变量', '把人物数据放入变量，再组织显示内容。逐项核对标签、空格、顺序和换行。', '声明 name="Mira"、hp=30、gold=10，输出三行 Name: Mira、HP: 30、Gold: 10。', 'string name = "Mira";\nint hp = 30, gold = 10;\nConsole.WriteLine($"Name: {name}");\nConsole.WriteLine($"HP: {hp}");\nConsole.WriteLine($"Gold: {gold}");', 'Name: Mira\nHP: 30\nGold: 10\n', { required: ['string ', 'int ', '$"'] })
    ]
  },
  {
    id: 'cs02', title: '集市交易', subtitle: '输入、类型转换与字符串',
    introduction: '本课程的“程序输入”按行提供给 Console.ReadLine()，每次读取消耗一行；输入读完时返回 null。?? 提供空值的替代值。int.Parse 把数字文字转换为整数，double 保存小数，char 保存单个字符；string 自带 Length、ToUpperInvariant、Contains、Substring 等常用方法。输入框不是实时终端，请在运行前填好所有输入。如何安全地处理无效数字，会在第 3 章用 TryParse 学习。',
    lessons: [
      t('cs02-01', '登记新名字', 'ReadLine 与 ??', 'string name = Console.ReadLine() ?? "Guest"; 读取一行；没有这一行时使用 Guest。注意空字符串与 null 不同。', '读取一行名字，输出 Hello, 名字!；没有输入时使用 Guest。', 'string name = Console.ReadLine() ?? "Guest";\nConsole.WriteLine($"Hello, {name}!");', '', { tests: inputTests(['Mira\n','Hello, Mira!\n'], ['Kai\n','Hello, Kai!\n'],['','Hello, Guest!\n']), required: ['Console.ReadLine'] }),
      t('cs02-02', '读取年龄', 'int.Parse', 'ReadLine 返回文字，int.Parse("12") 返回整数 12。我们先保证输入是合法整数，稍后学习验证。', '读取整数年龄，输出明年的年龄。', 'int age = int.Parse(Console.ReadLine() ?? "0");\nConsole.WriteLine(age + 1);', '', { tests: inputTests(['18\n','19\n'],['0\n','1\n']), required: ['int.Parse'] }),
      t('cs02-03', '两笔收入', '多行输入', '连续调用两次 ReadLine 会读两行，而不是两次读同一行。可以把中间值分别存入变量。', '读取两行整数，输出它们的和。', 'int a = int.Parse(Console.ReadLine() ?? "0");\nint b = int.Parse(Console.ReadLine() ?? "0");\nConsole.WriteLine(a + b);', '', { tests: inputTests(['7\n5\n','12\n'],['-2\n8\n','6\n']) }),
      t('cs02-04', '平分金币', '整数除法', '两个整数相除会丢弃小数部分。例如 9 / 2 是 4。不要把它误当作四舍五入。', '读取非负金币数，将它平均分给 3 人，输出每人获得的整数枚数。', 'int gold = int.Parse(Console.ReadLine() ?? "0");\nConsole.WriteLine(gold / 3);', '', { tests: inputTests(['10\n','3\n'],['2\n','0\n']), required: ['/'] }),
      t('cs02-05', '剩余的金币', '取余 %', 'a % b 是整数除法的余数。10 % 3 为 1，适合循环轮次、奇偶或剩余物品。', '读取非负金币数，输出分给 3 人之后的余数。', 'int gold = int.Parse(Console.ReadLine() ?? "0");\nConsole.WriteLine(gold % 3);', '', { tests: inputTests(['10\n','1\n'],['12\n','0\n']), required: ['%'] }),
      t('cs02-06', '药水的价格', 'double', 'double 能保存小数。double.Parse 将文字转成小数；本课程使用小数点 .。F1 把结果显示为一位小数。\n注意：本课程运行环境统一按小数点 . 解析和显示数字。若把程序下载到法语、德语等使用逗号作小数点的系统上运行，double.Parse("2.5") 可能报错、F1 也会显示成 2,5。正式项目可写 double.Parse(text, CultureInfo.InvariantCulture)，并在文件开头加 using System.Globalization;。', '读取药水单价，购买两瓶，输出一位小数的总价。', 'double price = double.Parse(Console.ReadLine() ?? "0");\nConsole.WriteLine((price * 2).ToString("F1"));', '', { tests: inputTests(['2.5\n','5.0\n'],['1.2\n','2.4\n']), required: ['double'] }),
      t('cs02-07', '真正的平均值', '显式类型转换', '(double)total 先把整数转换成小数，再进行除法。先做整数除法再转换，丢失的小数不会回来。', '读取总分和人数（大于 0），用小数除法输出平均分，保留一位小数。', 'int total = int.Parse(Console.ReadLine() ?? "0");\nint count = int.Parse(Console.ReadLine() ?? "1");\nConsole.WriteLine(((double)total / count).ToString("F1"));', '', { tests: inputTests(['7\n2\n','3.5\n'],['10\n4\n','2.5\n']), required: ['double'] }),
      t('cs02-08', '门是否开启', 'bool 与比较', 'bool 只有 true 和 false。hp > 0 是表达式，结果是布尔值。Console 输出时显示 True 或 False。', '读取生命值，输出它是否大于 0。', 'int hp = int.Parse(Console.ReadLine() ?? "0");\nbool alive = hp > 0;\nConsole.WriteLine(alive);', '', { tests: inputTests(['5\n','True\n'],['0\n','False\n']), required: ['bool'] }),
      t('cs02-09', '方向的一个字符', 'char', "char 保存一个字符，用单引号，例如 'N'。string 的 [0] 可以读取第一个字符，前提是字符串非空。", '输入保证是一个非空方向词。取第一个字符，输出它。', 'string direction = Console.ReadLine() ?? "North";\nchar first = direction[0];\nConsole.WriteLine(first);', '', { tests: inputTests(['North\n','N\n'],['South\n','S\n']), required: ['char'] }),
      t('cs-str-basics', '读懂英雄的名字', '字符串常用方法', 'text.Length 是字符数；ToUpperInvariant() 返回全大写的副本；Contains("a") 判断是否包含某段文字；Substring(start, length) 从 start 位置开始截取 length 个字符（位置从 0 开始）。这些方法都返回新值，不会修改原来的字符串。', '读取一个至少 3 个字符的英雄名，依次输出：字符数、全大写形式、前 3 个字符、是否包含小写字母 a（True 或 False）。', 'string name = Console.ReadLine() ?? "Hero";\nConsole.WriteLine(name.Length);\nConsole.WriteLine(name.ToUpperInvariant());\nConsole.WriteLine(name.Substring(0, 3));\nConsole.WriteLine(name.Contains("a"));', '', { tests: inputTests(['Mira\n','4\nMIRA\nMir\nTrue\n'],['Kevin\n','5\nKEVIN\nKev\nFalse\n']), required: ['.Length', 'Substring', 'Contains'], hint: 'Length 是属性，不加括号；Substring(0, 3) 取前三个字符。' }),
      t('cs02-12', '章节试炼：购物收据', '输入与计算整合', '先读数量，再读单价。让同一段程序适应不同输入；输出格式也是约定的一部分。', '依次读取整数数量和小数单价，输出 Total: 总价，保留一位小数。', 'int count = int.Parse(Console.ReadLine() ?? "0");\ndouble price = double.Parse(Console.ReadLine() ?? "0");\nConsole.WriteLine($"Total: {count * price:F1}");', '', { tests: inputTests(['3\n2.5\n','Total: 7.5\n'],['0\n9.9\n','Total: 0.0\n']) })
    ]
  },
  {
    id: 'cs03', title: '岔路森林', subtitle: '条件、逻辑与输入验证',
    introduction: 'if (条件) { ... } 只在条件为真时执行；else 处理另一条路。紧接着学习条件运算符 ?:，它把“二选一”写成一个表达式，本章后面会经常用到。== 比较是否相等，= 是赋值。&& 要求两边都成立，|| 要求至少一边成立，! 取反。大括号将多条语句组成一个代码块。最后用 TryParse 验证不可信的输入。',
    lessons: [
      t('cs03-01', '生死之门', 'if / else', 'if 与 else 只会选择其中一支。把输出放在对应的大括号中。', '读取 hp。大于 0 输出 Alive，否则输出 Defeated。', 'int hp = int.Parse(Console.ReadLine() ?? "0");\nif (hp > 0) Console.WriteLine("Alive");\nelse Console.WriteLine("Defeated");', '', { tests: inputTests(['1\n','Alive\n'],['0\n','Defeated\n'],['-3\n','Defeated\n']), required: ['if', 'else'] }),
      t('cs03-08', '较大的伤害', '条件运算符', 'if/else 选择执行哪一段语句；条件运算符 条件 ? 值A : 值B 则直接“算出”一个值：条件为真取值A，否则取值B。例如 int max = a > b ? a : b; 等价于先声明 max，再用 if/else 分别赋值。它适合“二选一且两边都是简单值”的情况，复杂逻辑仍写 if/else。本章后面的参考解法会经常使用这种写法。', '读取两个整数伤害，用 ?: 输出较大的值。', 'int a = int.Parse(Console.ReadLine() ?? "0");\nint b = int.Parse(Console.ReadLine() ?? "0");\nConsole.WriteLine(a > b ? a : b);', '', { tests: inputTests(['4\n9\n','9\n'],['7\n7\n','7\n']), requiredPatterns: [{ pattern: String.raw`[^?]\?(?![?.])[^;]*:`, label: '?:' }] }),
      t('cs03-02', '能否买药', '>= 边界', '>= 包括等于的情况。价格刚好够时也应允许购买。', '药水价格为 8。读取金币，够买则输出 Buy，否则输出 Save。', 'int gold = int.Parse(Console.ReadLine() ?? "0");\nConsole.WriteLine(gold >= 8 ? "Buy" : "Save");', '', { tests: inputTests(['8\n','Buy\n'],['7\n','Save\n']) }),
      t('cs03-03', '伤势分级', 'else if', 'else if 从上到下尝试条件，一旦命中就不再进入后续分支。把最紧急的情况放在前面。', 'hp<=0 输出 Defeated；1 到 9 输出 Danger；其余输出 Safe。', 'int hp = int.Parse(Console.ReadLine() ?? "0");\nif (hp <= 0) Console.WriteLine("Defeated");\nelse if (hp < 10) Console.WriteLine("Danger");\nelse Console.WriteLine("Safe");', '', { tests: inputTests(['0\n','Defeated\n'],['9\n','Danger\n'],['10\n','Safe\n']), required: ['else if'] }),
      t('cs03-04', '安全坐标', '逻辑与 &&', 'x >= 0 && x < 5 表示两个条件同时满足。&& 左边为假时不会计算右边。', '读取 x，0 到 4（含）输出 Inside，其余输出 Outside。', 'int x = int.Parse(Console.ReadLine() ?? "0");\nConsole.WriteLine(x >= 0 && x < 5 ? "Inside" : "Outside");', '', { tests: inputTests(['0\n','Inside\n'],['4\n','Inside\n'],['5\n','Outside\n'],['-1\n','Outside\n']), required: ['&&'] }),
      t('cs03-05', '两种通行证', '逻辑或 ||', '字符串可以用 == 比较内容。|| 只要求其中一项成立。', '读取 pass，值为 key 或 badge 时输出 Enter，否则输出 Locked。', 'string pass = Console.ReadLine() ?? "";\nConsole.WriteLine(pass == "key" || pass == "badge" ? "Enter" : "Locked");', '', { tests: inputTests(['key\n','Enter\n'],['badge\n','Enter\n'],['coin\n','Locked\n']), required: ['||'] }),
      t('cs03-06', '解除诅咒', '逻辑非 !', '!true 为 false，!false 为 true。把结果存入 bool 有助于表达“不是某种状态”。', '输入 true 或 false 表示是否被诅咒，输出能否休息（未被诅咒）。', 'bool cursed = bool.Parse(Console.ReadLine() ?? "false");\nConsole.WriteLine(!cursed);', '', { tests: inputTests(['true\n','False\n'],['false\n','True\n']), requiredPatterns: [{ pattern: '!(?!=)', label: '! 取反' }] }),
      t('cs03-07', '三条路线', 'switch', 'switch 按值选择 case；break 结束这一支，default 处理未列出的输入。', '输入 n 输出 North，s 输出 South，其他输入输出 Wait。使用 switch。', 'string cmd = Console.ReadLine() ?? "";\nswitch (cmd) {\ncase "n": Console.WriteLine("North"); break;\ncase "s": Console.WriteLine("South"); break;\ndefault: Console.WriteLine("Wait"); break;\n}', '', { tests: inputTests(['n\n','North\n'],['s\n','South\n'],['x\n','Wait\n']), required: ['switch'] }),
      t('cs03-09', '宽容的命令', 'Trim 与 ToLowerInvariant', 'Trim 去掉前后的空白，ToLowerInvariant 转为小写。先统一输入形式，再比较命令。', '读取命令，忽略首尾空格和大小写。是 heal 输出 Heal，否则输出 Unknown。', 'string cmd = (Console.ReadLine() ?? "").Trim().ToLowerInvariant();\nConsole.WriteLine(cmd == "heal" ? "Heal" : "Unknown");', '', { tests: inputTests([' HEAL \n','Heal\n'],['heal\n','Heal\n'],['run\n','Unknown\n']), required: ['Trim', 'ToLowerInvariant'] }),
      t('cs03-10', '验证药水数量', 'TryParse 与输入验证', 'int.TryParse(text, out int count) 尝试把文字转换成整数：返回 true 或 false 表示是否成功；成功时数字放进 count，失败时 count 为 0，程序不会因为格式错误而崩溃。out 的意思是“方法通过这个变量带回第二个结果”，第 5 章会自己写带 out 的方法。拿到结果后再用 && 检查范围：&& 的短路特性保证转换失败时不会继续比较。无效输入需要明确反馈，不能把它悄悄当作有效数量。', '输入可解析为 1 到 9 的整数时输出 Accepted，其他情况输出 Invalid。', 'bool ok = int.TryParse(Console.ReadLine(), out int count);\nConsole.WriteLine(ok && count >= 1 && count <= 9 ? "Accepted" : "Invalid");', '', { tests: inputTests(['1\n','Accepted\n'],['9\n','Accepted\n'],['0\n','Invalid\n'],['abc\n','Invalid\n']), required: ['TryParse'] }),
      t('cs03-11', '伤害下限', '状态与分支', '伤害不能是负数，否则攻击会意外治疗敌人。先计算，再修正，再输出。', '依次读取攻击与防御，伤害为 attack-defense，但最少为 1。输出伤害。', 'int attack = int.Parse(Console.ReadLine() ?? "0");\nint defense = int.Parse(Console.ReadLine() ?? "0");\nint damage = attack - defense;\nif (damage < 1) damage = 1;\nConsole.WriteLine(damage);', '', { tests: inputTests(['8\n3\n','5\n'],['2\n7\n','1\n']) }),
      t('cs03-12', '章节试炼：守门人', '组合条件', '把“拥有钥匙”和“等级足够”拆成布尔条件，再组合起来。测试要覆盖刚好达标与不达标。', '第一行输入 key 或 none，第二行输入等级。拥有 key 且等级>=3 时输出 Open，否则输出 Closed。', 'string item = Console.ReadLine() ?? "";\nint level = int.Parse(Console.ReadLine() ?? "0");\nConsole.WriteLine(item == "key" && level >= 3 ? "Open" : "Closed");', '', { tests: inputTests(['key\n3\n','Open\n'],['key\n2\n','Closed\n'],['none\n8\n','Closed\n']) })
    ]
  },
  {
    id: 'cs04', title: '回声地牢', subtitle: '循环与游戏主循环',
    introduction: '循环用来重复执行代码。for 包含起点、继续条件和每轮的变化；先掌握“0 到 n-1 共 n 次”这条边界规则。while 先检查条件；do/while 至少执行一次。每个循环都要考虑“什么时候结束”。break 退出最近的一层循环，continue 跳过本轮剩余部分。章末学习“读到输入结束为止”的循环写法。',
    lessons: [
      t('cs04-01', '五级台阶', 'for', 'for (int i=1; i<=3; i++) 会让 i 依次取 1、2、3。每轮循环后执行 i++。', '使用 for，逐行输出 1 到 5。', 'for (int i = 1; i <= 5; i++) Console.WriteLine(i);', '1\n2\n3\n4\n5\n', { required: ['for'] }),
      t('cs04-11', '有限的背包搜索', '循环边界', '0 到 n-1 一共 n 次，而 0 到 n 包含 n+1 次。程序边界通常从 0 开始。', '输入 n（0到10），逐行输出 Slot 0 到 Slot n-1。', 'int n = int.Parse(Console.ReadLine() ?? "0");\nfor (int i = 0; i < n; i++) Console.WriteLine($"Slot {i}");', '', { tests: inputTests(['2\n','Slot 0\nSlot 1\n'],['0\n','']) }),
      t('cs04-02', '熄灭的火把', 'while', 'while (条件) 在每轮开始时检查条件。循环体必须让条件有机会变成 false。', '读取非负整数 n，逐行从 n 倒数到 1；n=0 时不输出。', 'int n = int.Parse(Console.ReadLine() ?? "0");\nwhile (n > 0) { Console.WriteLine(n); n--; }', '', { tests: inputTests(['3\n','3\n2\n1\n'],['0\n','']), required: ['while'] }),
      t('cs04-03', '至少一次敲门', 'do / while', 'do { ... } while (条件); 先执行后判断，末尾需要分号。', '读取 n。先输出 Knock 并将 n 减 1，只要 n>0 就继续；n=0 也要敲一次。', 'int n = int.Parse(Console.ReadLine() ?? "0");\ndo { Console.WriteLine("Knock"); n--; } while (n > 0);', '', { tests: inputTests(['2\n','Knock\nKnock\n'],['0\n','Knock\n']), required: ['do ', 'while'] }),
      t('cs04-04', '一路收集金币', '累加器', 'sum 初始为 0，每轮把新值加进去。循环结束后再输出总计。', '读取 n（0到100），输出 1 到 n 的和。使用循环。', 'int n = int.Parse(Console.ReadLine() ?? "0");\nint sum = 0;\nfor (int i = 1; i <= n; i++) sum += i;\nConsole.WriteLine(sum);', '', { tests: inputTests(['4\n','10\n'],['0\n','0\n']), required: ['for'] }),
      t('cs04-05', '绘制生命条', '重复同一行输出', '循环内用 Write，结束后用一次 WriteLine，得到一整行。', '输入 hp（0到20），输出 hp 个 #，最后换行。', 'int hp = int.Parse(Console.ReadLine() ?? "0");\nfor (int i = 0; i < hp; i++) Console.Write("#");\nConsole.WriteLine();', '', { tests: inputTests(['4\n','####\n'],['0\n','\n']), required: ['for', 'Console.Write('] }),
      t('cs04-06', '跳过陷阱台阶', 'continue', 'continue 会直接进入下一轮；for 循环仍然执行递增部分。', '用循环输出 1 到 6，但跳过 3，每个数字一行。', 'for (int i = 1; i <= 6; i++) { if (i == 3) continue; Console.WriteLine(i); }', '1\n2\n4\n5\n6\n', { required: ['continue'] }),
      t('cs04-07', '找到第一扇门', 'break', '找到目标后可以 break，避免继续做无用的搜索。break 只退出最近的一层循环。', '从 1 开始检查编号，找到第一个能被 7 整除的编号时输出它并退出循环。', 'for (int i = 1; i <= 20; i++) { if (i % 7 == 0) { Console.WriteLine(i); break; } }', '7\n', { required: ['for', 'break'] }),
      t('cs04-08', '石墙的行与列', '嵌套循环', '外层负责行，内层负责列。每行的内层循环结束后再换行。', '输入行数与列数（0到5），输出相应大小的 * 矩形。', 'int rows = int.Parse(Console.ReadLine() ?? "0");\nint columns = int.Parse(Console.ReadLine() ?? "0");\nfor (int r = 0; r < rows; r++) {\n  for (int c = 0; c < columns; c++) Console.Write("*");\n  Console.WriteLine();\n}', '', { tests: inputTests(['2\n3\n','***\n***\n'],['1\n1\n','*\n']) }),
      t('cs04-10', '逐回合战斗', '循环更新状态', '每一轮都修改敌人的生命，直到生命不大于 0。使用 Math.Max 能把显示值限制在 0 以上。', '敌人 hp=10，每轮造成 4 点伤害；逐行输出每轮后的 hp，最低为 0。', 'int hp = 10;\nwhile (hp > 0) { hp = Math.Max(0, hp - 4); Console.WriteLine(hp); }', '6\n2\n0\n', { required: ['while'] }),
      t('cs04-09', '结束输入的信号', '哨兵值', '哨兵值表示“停止”，它本身不参与计算。ReadLine 在输入结束时返回 null，这时也应退出。\nstring? line; 中的 ? 表示这个字符串变量允许为 null。\nwhile ((line = Console.ReadLine()) != null) 把两步合成一步：先把读到的一行赋给 line，赋值表达式的结果就是 line 本身，再拿它和 null 比较。里层括号不能省略。后面的命令循环和 RPG 章节都会使用这种写法。', '逐行读取整数，遇到 0 或输入结束时停止，输出此前数字的和。', 'int sum = 0;\nstring? line;\nwhile ((line = Console.ReadLine()) != null) {\n  int n = int.Parse(line);\n  if (n == 0) break;\n  sum += n;\n}\nConsole.WriteLine(sum);', '', { tests: inputTests(['3\n4\n0\n99\n','7\n'],['5\n','5\n']), required: ['while', 'break'] }),
      t('cs04-12', '章节试炼：命令循环', 'while 与 switch', '游戏循环重复读取命令、更新状态、显示反馈。退出命令和输入结束都必须有出口。', '逐行读取命令：look 输出 Forest；rest 输出 Rested；quit 输出 Bye 并结束；其他命令输出 Unknown。', 'string? cmd;\nwhile ((cmd = Console.ReadLine()) != null) {\n  if (cmd == "quit") { Console.WriteLine("Bye"); break; }\n  switch (cmd) {\n    case "look": Console.WriteLine("Forest"); break;\n    case "rest": Console.WriteLine("Rested"); break;\n    default: Console.WriteLine("Unknown"); break;\n  }\n}', '', { tests: inputTests(['look\nrest\nquit\nlook\n','Forest\nRested\nBye\n'],['x\n','Unknown\n']), required: ['while', 'switch'] })
    ]
  },
  {
    id: 'cs05', title: '镜塔工坊', subtitle: '方法、参数与职责拆分',
    introduction: '方法把一个任务封装成有名字的步骤。void 表示不返回值；int 表示返回一个整数。参数是方法接收的数据，return 交还结果并结束方法。这里使用顶层程序中的局部方法，方法可以写在调用之后。方法内部的变量有自己的作用域。本章还会认识重载（同名不同参数）和 out 参数（带回多个结果）。',
    lessons: [
      t('cs05-01', '可重复的欢迎仪式', 'void 方法', 'void Greet() { ... } 定义方法，Greet(); 调用它。定义方法不会自动执行它。', '定义并调用 Greet() 两次，每次输出 Welcome。', 'Greet();\nGreet();\nvoid Greet() { Console.WriteLine("Welcome"); }', 'Welcome\nWelcome\n', { required: ['void Greet'] }),
      t('cs05-02', '把名字交给方法', '参数', '参数像方法自己的变量。调用 Greet("Kai") 时，参数 name 得到 Kai。', '读取名字，调用 Greet(string name)，输出 Hello, 名字。', 'Greet(Console.ReadLine() ?? "Guest");\nvoid Greet(string name) { Console.WriteLine($"Hello, {name}"); }', '', { tests: inputTests(['Mira\n','Hello, Mira\n'],['Kai\n','Hello, Kai\n']), required: ['void Greet', 'string name'] }),
      t('cs05-03', '伤害计算器', '返回值', 'return value; 把结果交给调用者。调用者可以保存、显示或继续计算这个结果。', '读取攻击与防御。用 int Damage(int attack,int defense) 返回至少为 1 的伤害并输出。', 'int a = int.Parse(Console.ReadLine() ?? "0");\nint d = int.Parse(Console.ReadLine() ?? "0");\nConsole.WriteLine(Damage(a, d));\nint Damage(int attack, int defense) { return Math.Max(1, attack - defense); }', '', { tests: inputTests(['8\n3\n','5\n'],['1\n5\n','1\n']), required: ['int Damage', 'return'] }),
      t('cs05-04', '治疗不能超上限', '多个参数', '方法可接收多个参数，顺序必须与定义对应。Math.Min(a,b) 返回较小值。', '依次读 hp、amount、maximum，用 Heal 方法返回不超过 maximum 的 hp+amount，并输出。', 'int hp = int.Parse(Console.ReadLine() ?? "0");\nint amount = int.Parse(Console.ReadLine() ?? "0");\nint maximum = int.Parse(Console.ReadLine() ?? "0");\nConsole.WriteLine(Heal(hp, amount, maximum));\nint Heal(int hp, int amount, int maximum) { return Math.Min(maximum, hp + amount); }', '', { tests: inputTests(['8\n5\n10\n','10\n'],['2\n3\n10\n','5\n']), required: ['int Heal'] }),
      t('cs05-05', '判断角色存活', 'bool 返回值', '方法也可以返回判断结果。把判断命名为 IsAlive，比在许多地方重复 hp>0 更清楚。', '用 bool IsAlive(int hp) 判断生命是否大于 0，读取 hp 并输出方法结果。', 'int hp = int.Parse(Console.ReadLine() ?? "0");\nConsole.WriteLine(IsAlive(hp));\nbool IsAlive(int hp) { return hp > 0; }', '', { tests: inputTests(['1\n','True\n'],['0\n','False\n']), required: ['bool IsAlive'] }),
      t('cs05-06', '名称修整器', 'string 返回值', '方法可以先处理字符串，再 return。返回的字符串不会自动覆盖原变量。', '读取角色名，用 CleanName 方法去除首尾空格，再返回大写名字并输出。', 'Console.WriteLine(CleanName(Console.ReadLine() ?? ""));\nstring CleanName(string name) { return name.Trim().ToUpperInvariant(); }', '', { tests: inputTests([' mira \n','MIRA\n'],['Kai\n','KAI\n']), required: ['string CleanName'] }),
      t('cs05-07', '局部变量的房间', '值参数与作用域', 'int 参数接收数值的副本。方法中修改参数，不会自动修改调用处的变量。', 'hp=10。Boost(int value) 输出 value+5。调用 Boost(hp) 后再输出 hp，观察原变量保持不变。', 'int hp = 10;\nBoost(hp);\nConsole.WriteLine(hp);\nvoid Boost(int value) { value += 5; Console.WriteLine(value); }', '15\n10\n', { required: ['void Boost'] }),
      t('cs05-08', '用返回值更新状态', '接回计算结果', '要让方法的计算更新外面的变量，写 hp = Heal(hp);。这一赋值清楚地表示状态改变。', '输入 hp，定义 Restore 返回 hp+3，调用并赋值给 hp，再输出 hp。', 'int hp = int.Parse(Console.ReadLine() ?? "0");\nhp = Restore(hp);\nConsole.WriteLine(hp);\nint Restore(int hp) { return hp + 3; }', '', { tests: inputTests(['4\n','7\n'],['0\n','3\n']), required: ['int Restore', 'hp = Restore'] }),
      t('cs05-09', '提前返回的守卫', 'early return', '发现无效情况后马上 return，可以减少层层嵌套。非 void 方法的每条路径都必须返回值。', '定义 Cost(int count)：count<=0 返回 0，否则返回 count*5。读取数量并输出结果。', 'int count = int.Parse(Console.ReadLine() ?? "0");\nConsole.WriteLine(Cost(count));\nint Cost(int count) { if (count <= 0) return 0; return count * 5; }', '', { tests: inputTests(['3\n','15\n'],['-2\n','0\n']), required: ['int Cost', 'return'] }),
      t('cs05-10', '默认的治疗量', '可选参数', '参数可指定默认值，例如 int amount=2。调用时省略这个参数就使用默认值。可选参数放在必填参数之后。', '定义 Heal(int hp,int amount=2) 返回 hp+amount。分别输出 Heal(5) 和 Heal(5,4)。', 'Console.WriteLine(Heal(5));\nConsole.WriteLine(Heal(5, 4));\nint Heal(int hp, int amount = 2) { return hp + amount; }', '7\n9\n', { required: ['int amount = 2'] }),
      t('cs-overload', '同名的两种描述', '方法重载', '同名方法可以有不同的参数列表（参数个数或类型不同），这叫重载；调用时编译器按实参挑选匹配的版本。只改返回类型不算重载。注意：顶层语句里的局部方法不能重载，所以这里把两个方法放进 static class Info 中，用 Info.Describe(...) 调用。static 表示不需要先 new 对象就能调用；class 会在第 7 章详细学习。', '在 static class Info 中定义两个 Describe：Describe(int hp) 返回 HP: 数值；Describe(string name, int hp) 返回 名字 HP: 数值。读取名字和生命，先后输出两个版本的结果。', 'string name = Console.ReadLine() ?? "Hero";\nint hp = int.Parse(Console.ReadLine() ?? "0");\nConsole.WriteLine(Info.Describe(hp));\nConsole.WriteLine(Info.Describe(name, hp));\nstatic class Info {\n public static string Describe(int hp) { return $"HP: {hp}"; }\n public static string Describe(string name, int hp) { return $"{name} HP: {hp}"; }\n}', '', { tests: inputTests(['Mira\n12\n','HP: 12\nMira HP: 12\n'],['Kai\n0\n','HP: 0\nKai HP: 0\n']), required: ['static class', 'Describe(int', 'Describe(string'], hint: '两个方法都写成 public static string Describe(...)，参数列表不同即可。' }),
      t('cs-out', '一次带回两个结果', 'out 参数', 'return 只能交回一个值。参数前加 out，表示方法必须给这个参数赋值，并把结果带回调用处：调用时写 MinMax(a, b, out int low, out int high)，方法结束后 low 和 high 就有了值。第 3 章用过的 int.TryParse(text, out int value) 正是这样把转换结果带回来的。', '读取两个整数。定义 void MinMax(int x, int y, out int min, out int max)，调用后先输出较小值，再输出较大值。', 'int a = int.Parse(Console.ReadLine() ?? "0");\nint b = int.Parse(Console.ReadLine() ?? "0");\nMinMax(a, b, out int low, out int high);\nConsole.WriteLine(low);\nConsole.WriteLine(high);\nvoid MinMax(int x, int y, out int min, out int max) { min = Math.Min(x, y); max = Math.Max(x, y); }', '', { tests: inputTests(['9\n4\n','4\n9\n'],['3\n3\n','3\n3\n'],['-2\n5\n','-2\n5\n']), required: ['out int', 'void MinMax'], hint: '方法里每个 out 参数都必须被赋值；调用时实参前也要写 out。' }),
      t('cs05-11', '组合两个小方法', '方法调用方法', '一个方法可以调用另一个。计算伤害与更新生命是两个不同职责。', '读取 hp、attack、defense。Damage 至少返回 1；Hit 调用 Damage，并将剩余生命限制为 0 以上。输出 Hit 的结果。', 'int hp = int.Parse(Console.ReadLine() ?? "0");\nint attack = int.Parse(Console.ReadLine() ?? "0");\nint defense = int.Parse(Console.ReadLine() ?? "0");\nConsole.WriteLine(Hit(hp, attack, defense));\nint Damage(int a, int d) { return Math.Max(1, a - d); }\nint Hit(int hp, int a, int d) { return Math.Max(0, hp - Damage(a, d)); }', '', { tests: inputTests(['10\n8\n3\n','5\n'],['2\n9\n0\n','0\n']), required: ['int Damage', 'int Hit'] }),
      t('cs05-12', '章节试炼：独立的战斗函数', '方法与循环整合', '方法内部也可以用循环。把战斗放进 Fight，主流程只负责读取输入和显示结果。', '输入敌人 hp 和每轮 damage（大于 0）。Fight 返回击败敌人需要的轮数；hp<=0 时为 0。', 'int hp = int.Parse(Console.ReadLine() ?? "0");\nint damage = int.Parse(Console.ReadLine() ?? "1");\nConsole.WriteLine(Fight(hp, damage));\nint Fight(int hp, int damage) { int rounds = 0; while (hp > 0) { hp -= damage; rounds++; } return rounds; }', '', { tests: inputTests(['10\n4\n','3\n'],['0\n3\n','0\n'],['8\n4\n','2\n']), required: ['int Fight', 'while'] })
    ]
  },
  {
    id: 'cs06', title: '星图档案', subtitle: '数组、List 与 Dictionary',
    introduction: '数组把同类型的多个值放在一起，索引从 0 开始，长度固定。List<T> 的长度可以变化，也能用下标访问；Dictionary<TKey,TValue> 按键查询。本章还会学习排序、string.Join，以及一道 LINQ 拓展题。',
    lessons: [
      t('cs06-01', '三瓶药水', '数组与索引', 'int[] values = { 2, 5, 8 }; 创建三个整数。values[0] 是第一个，Length 是元素数量。', '创建数组 {3,6,9}，输出第一个值，再输出数组长度。', 'int[] potions = { 3, 6, 9 };\nConsole.WriteLine(potions[0]);\nConsole.WriteLine(potions.Length);', '3\n3\n', { required: ['int[]', '.Length'] }),
      t('cs06-02', '改变一个格子', '数组赋值', 'items[index] = value 修改指定元素，不需要重新创建数组。索引必须小于 Length。', '数组初始 {1,2,3}。将索引 1 改成 7，然后逐行输出全部元素。', 'int[] items = { 1, 2, 3 };\nitems[1] = 7;\nfor (int i = 0; i < items.Length; i++) Console.WriteLine(items[i]);', '1\n7\n3\n', { required: ['[1] ='] }),
      t('cs06-03', '遍历伤害记录', 'foreach', 'foreach (int value in values) 会依次读取每个元素，不需要自己维护索引。', '创建 {4,2,7} 数组，用 foreach 累加，输出总伤害。', 'int[] hits = { 4, 2, 7 };\nint sum = 0;\nforeach (int hit in hits) sum += hit;\nConsole.WriteLine(sum);', '13\n', { required: ['foreach'] }),
      t('cs06-04', '拆分背包清单', 'Split', 'text.Split(",") 按逗号拆成字符串数组。Trim 可以去掉每项两端的空格。', '读取逗号分隔的物品名，逐行输出每项去掉首尾空格后的名字。', 'string[] items = (Console.ReadLine() ?? "").Split(",");\nforeach (string item in items) Console.WriteLine(item.Trim());', '', { tests: inputTests(['key, potion\n','key\npotion\n'],['sword\n','sword\n']), required: ['Split'] }),
      t('cs06-05', '会变大的背包', 'List<T>', 'List<string> 用于数量会变化的文字集合。Add 添加元素，Count 读取数量。', '创建空 List<string>，加入 sword 和 potion，先输出数量，再逐行输出内容。', 'var bag = new List<string>();\nbag.Add("sword");\nbag.Add("potion");\nConsole.WriteLine(bag.Count);\nforeach (string item in bag) Console.WriteLine(item);', '2\nsword\npotion\n', { required: ['List<string>', '.Add'] }),
      t('cs-list-index', '装备栏编号', 'List 下标与 for', 'List 和数组一样可以用下标访问：bag[0] 是第一项，bag.Count 是元素数量（数组用 Length，List 用 Count）。需要序号时用 for (int i = 0; i < bag.Count; i++)，显示给玩家时常写 i + 1。', '背包为 sword、shield、potion。先用 for 和 bag[i] 逐行输出 序号. 物品（序号从 1 开始），再读取玩家选择的序号（1 到 3），输出 Equip 物品。', 'var bag = new List<string> { "sword", "shield", "potion" };\nfor (int i = 0; i < bag.Count; i++) Console.WriteLine($"{i + 1}. {bag[i]}");\nint choice = int.Parse(Console.ReadLine() ?? "1");\nConsole.WriteLine($"Equip {bag[choice - 1]}");', '', { tests: inputTests(['2\n','1. sword\n2. shield\n3. potion\nEquip shield\n'],['3\n','1. sword\n2. shield\n3. potion\nEquip potion\n']), required: ['.Count', 'for'], hint: '玩家输入的序号从 1 开始，而下标从 0 开始，所以要写 bag[choice - 1]。' }),
      t('cs06-06', '使用一瓶药水', 'Contains 与 Remove', 'Contains 检查是否存在；Remove 删除第一个匹配元素并返回是否成功。', '背包为 potion、key、potion。删除一瓶 potion，输出剩余数量及是否仍有 potion。', 'var bag = new List<string> { "potion", "key", "potion" };\nbag.Remove("potion");\nConsole.WriteLine(bag.Count);\nConsole.WriteLine(bag.Contains("potion"));', '2\nTrue\n', { required: ['Remove', 'Contains'] }),
      t('cs06-07', '物品价格表', 'Dictionary', 'Dictionary<string,int> 按名字查找价格。TryGetValue 在键不存在时返回 false，避免直接索引抛异常。', '价格表 key=3、potion=5。输入物品名，存在时输出价格，否则输出 Unknown。', 'var prices = new Dictionary<string, int> { ["key"] = 3, ["potion"] = 5 };\nstring item = Console.ReadLine() ?? "";\nif (prices.TryGetValue(item, out int price)) Console.WriteLine(price);\nelse Console.WriteLine("Unknown");', '', { tests: inputTests(['potion\n','5\n'],['key\n','3\n'],['sword\n','Unknown\n']), required: ['Dictionary', 'TryGetValue'] }),
      t('cs06-08', '绘制二维地图', '二维数组', 'char[,] 表示二维字符数组，map[row,column] 指定行和列。GetLength(0) 是行数，GetLength(1) 是列数。', "创建两行地图 {'@','.'} 和 {'#','E'}，用两层循环输出 @. 与 #E。", "char[,] map = { { '@', '.' }, { '#', 'E' } };\nfor (int r = 0; r < map.GetLength(0); r++) {\n for (int c = 0; c < map.GetLength(1); c++) Console.Write(map[r,c]);\n Console.WriteLine();\n}", '@.\n#E\n', { required: ['char[,]', 'GetLength'] }),
      t('cs-join-sort', '排行榜', '排序与 string.Join', 'new int[n] 创建 n 个格子的整数数组（初始都是 0）。Array.Sort(scores) 把数组从小到大排列，直接修改原数组；List 用 list.Sort()。string.Join(", ", scores) 用指定分隔符把所有元素连成一个字符串，最后一个元素后面不会多出分隔符。', '读取一行逗号分隔的整数分数（可能带空格），从小到大排序后用 ", " 连接输出；第二行输出最高分。', 'string[] parts = (Console.ReadLine() ?? "").Split(",");\nint[] scores = new int[parts.Length];\nfor (int i = 0; i < parts.Length; i++) scores[i] = int.Parse(parts[i].Trim());\nArray.Sort(scores);\nConsole.WriteLine(string.Join(", ", scores));\nConsole.WriteLine(scores[scores.Length - 1]);', '', { tests: inputTests(['7,3,9\n','3, 7, 9\n9\n'],['5, 12, 1, 8\n','1, 5, 8, 12\n12\n'],['4\n','4\n4\n']), required: ['string.Join', 'Sort'], hint: '先 Split，再逐个 Trim + int.Parse 放进数组；排序后最后一个就是最高分。' }),
      t('cs-linq', '拓展：筛选重击', 'LINQ 入门', 'LINQ 是 C# 处理集合的一组查询方法，需要在文件开头加 using System.Linq;。Where(h => h > 5) 筛选出满足条件的元素，Count() 计数，Sum() 求和。h => h > 5 叫 lambda 表达式，读作“对每个 h，判断 h > 5”。这是一道拓展题：用 foreach 也能完成，LINQ 只是更简短的写法。', '伤害记录为 {4, 12, 7, 15, 3}。用 LINQ 的 Where 筛选出大于 5 的伤害，先输出个数，再输出它们的总和。', 'int[] hits = { 4, 12, 7, 15, 3 };\nvar big = hits.Where(h => h > 5);\nConsole.WriteLine(big.Count());\nConsole.WriteLine(big.Sum());', '3\n34\n', { linq: true, required: ['Where', 'Sum', 'using System.Linq'], hint: '确认文件开头有 using System.Linq;，再写 hits.Where(h => h > 5)。' }),
      t('cs-inventory-trial', '章节试炼：战利品清点', '集合整合', 'List 记住顺序，Dictionary 负责计数，两者配合很常见。counts.ContainsKey(item) 判断键是否存在；counts[item]++ 让已有数量加 1；新物品先设为 1 并加入顺序列表。', '逐行读取拾取的物品名（忽略首尾空格和空行），直到输入结束。按第一次出现的顺序逐行输出 物品 x数量。', 'var order = new List<string>();\nvar counts = new Dictionary<string, int>();\nstring? line;\nwhile ((line = Console.ReadLine()) != null) {\n string item = line.Trim();\n if (item == "") continue;\n if (counts.ContainsKey(item)) counts[item]++;\n else { counts[item] = 1; order.Add(item); }\n}\nforeach (string item in order) Console.WriteLine($"{item} x{counts[item]}");', '', { tests: inputTests(['potion\nkey\npotion\n','potion x2\nkey x1\n'],[' gem \n\ngem\ngem\n','gem x3\n'],['','']), required: ['Dictionary', 'List<string>'] })
    ]
  },
  {
    id: 'csoop', title: '英雄工坊', subtitle: '类、对象与异常处理',
    introduction: 'class 将相关数据与行为组织成一种类型；new 创建一个实例。本章按顺序学习：字段与对象初始化器 → 构造方法 → 属性 → 引用类型 → 实例方法 → private set 封装 → enum，最后用 try/catch 处理异常，并把多个对象放进 List<Hero>。C# 类是引用类型，两个变量可能指向同一个对象。',
    lessons: [
      t('cs06-09', '角色档案', 'class 与字段', 'class Hero { public int Hp; } 定义一种角色类型（蓝图）；new Hero() 按蓝图创建一个对象；hero.Hp 访问这个对象的字段。\nnew Hero { Name = "Mira", Hp = 20 } 叫对象初始化器：创建对象后立即给列出的公共字段赋值，等价于先 new Hero()，再逐行写 hero.Name = "Mira"; hero.Hp = 20;。类型声明放在顶层语句之后。', '定义 Hero，包含 Name 和 Hp。创建名字为 Mira、生命为 20 的角色，输出 Mira:20。', 'var hero = new Hero { Name = "Mira", Hp = 20 };\nConsole.WriteLine($"{hero.Name}:{hero.Hp}");\nclass Hero { public string Name = ""; public int Hp; }', 'Mira:20\n', { required: ['class Hero', 'new Hero', 'Name ='] }),
      t('cs06-10', '创建完整的角色', '构造方法', '构造方法与类同名、没有返回类型，在 new 时自动执行，用来保证对象一创建就拥有完整数据。new Hero(name, hp) 把实参交给构造方法的参数，再由构造方法赋给字段。下一题会把公开字段改写成属性。', '定义 Hero(string name,int hp) 构造方法和 Name、Hp 字段。读取名字及生命，用 new Hero(名字, 生命) 创建角色并输出 名字:生命。', 'string name = Console.ReadLine() ?? "Guest";\nint hp = int.Parse(Console.ReadLine() ?? "0");\nvar hero = new Hero(name, hp);\nConsole.WriteLine($"{hero.Name}:{hero.Hp}");\nclass Hero {\n public string Name;\n public int Hp;\n public Hero(string name, int hp) { Name = name; Hp = hp; }\n}', '', { tests: inputTests(['Mira\n20\n','Mira:20\n'],['Kai\n5\n','Kai:5\n']), required: ['public Hero(', 'new Hero('] }),
      t('cs-props', '用属性描述角色', '属性', '属性看起来像字段，但由 get/set 访问器控制读写。public int Hp { get; set; } 是自动属性，可读可写；public int MaxHp { get; } = 10; 只有 get，创建后只能读取，= 10 是初始值。C# 的习惯是：公开数据写成属性（首字母大写），字段尽量保持私有。之后的题目都使用属性写法。', '把 Hero 写成属性形式：Name { get; set; } 初始为 "Mira"，MaxHp { get; } = 10，Hp { get; set; }。读取生命值赋给 hero.Hp，输出形如 Mira 7/10 的一行。', 'var hero = new Hero();\nhero.Hp = int.Parse(Console.ReadLine() ?? "0");\nConsole.WriteLine($"{hero.Name} {hero.Hp}/{hero.MaxHp}");\nclass Hero {\n public string Name { get; set; } = "Mira";\n public int MaxHp { get; } = 10;\n public int Hp { get; set; }\n}', '', { tests: inputTests(['7\n','Mira 7/10\n'],['10\n','Mira 10/10\n']), requiredPatterns: [{ pattern: String.raw`\{\s*get;\s*set;\s*\}`, label: '{ get; set; }' }, { pattern: String.raw`\{\s*get;\s*\}`, label: '{ get; }' }] }),
      t('cs06-11', '对象真的改变了', '引用类型', 'class 是引用类型：变量里保存的是“指向对象的引用”。把 Hero 交给方法时，方法拿到的是同一个对象，因此能修改它的属性。这不同于第 5 章 int 参数的值副本。', '创建 Hp=10 的 Hero。Hurt(Hero hero) 将其 Hp 减 3，调用后输出原角色 Hp。', 'var hero = new Hero { Hp = 10 };\nHurt(hero);\nConsole.WriteLine(hero.Hp);\nvoid Hurt(Hero hero) { hero.Hp -= 3; }\nclass Hero { public int Hp { get; set; } }', '7\n', { required: ['class Hero', 'void Hurt'] }),
      t('cs-instance-method', '会受伤的角色', '实例方法', '方法也可以写在类里，成为实例方法。hero.TakeDamage(3) 作用于 hero 这个对象；方法内部直接写 Hp，指的就是“这个对象的 Hp”。把规则（例如生命不低于 0）放进类里，调用者就不必每次重复。', 'Hero 的 Hp 初始为 10。实现 void TakeDamage(int amount)：生命减少 amount，但不低于 0。读取两行伤害，每次调用后输出 Hp。', 'var hero = new Hero();\nfor (int i = 0; i < 2; i++) {\n hero.TakeDamage(int.Parse(Console.ReadLine() ?? "0"));\n Console.WriteLine(hero.Hp);\n}\nclass Hero {\n public int Hp { get; set; } = 10;\n public void TakeDamage(int amount) { Hp = Math.Max(0, Hp - amount); }\n}', '', { tests: inputTests(['3\n4\n','7\n3\n'],['8\n5\n','2\n0\n']), required: ['void TakeDamage', 'class Hero'] }),
      t('cs06-12', '受保护的生命值', '封装与 private set', 'public int Hp { get; private set; } 表示类外可以读取 Hp，但只有类自己的方法能修改它，这就是封装：外部想加血只能调用 Heal，生命上限规则就不会被绕过。MaxHp { get; } = 10 是只读属性。可以试着在类外写 hero.Hp = 99;，编译器会报错。', 'Hero 的 Hp 初始 4、MaxHp 为 10。Heal(int amount) 加血但不超上限。读取治疗量，调用后输出 Hp。', 'var hero = new Hero();\nhero.Heal(int.Parse(Console.ReadLine() ?? "0"));\nConsole.WriteLine(hero.Hp);\nclass Hero {\n public int Hp { get; private set; } = 4;\n public int MaxHp { get; } = 10;\n public void Heal(int amount) { Hp = Math.Min(MaxHp, Hp + amount); }\n}', '', { tests: inputTests(['3\n','7\n'],['20\n','10\n']), required: ['class Hero', 'void Heal', 'private set'] }),
      t('cs07-01', '游戏的三个阶段', 'enum', 'enum 为一组固定状态取名字，避免用意义不明的数字。GameState.Victory 这样访问成员，可用 == 比较，输出时显示成员名。enum 和 class 一样是类型声明，写在顶层语句之后。', '定义 GameState { Exploring, Victory, Defeat }。输入 win 输出 Victory，lose 输出 Defeat，其余输出 Exploring。', 'string cmd = Console.ReadLine() ?? "";\nGameState state = cmd == "win" ? GameState.Victory : cmd == "lose" ? GameState.Defeat : GameState.Exploring;\nConsole.WriteLine(state);\nenum GameState { Exploring, Victory, Defeat }', '', { tests: inputTests(['win\n','Victory\n'],['lose\n','Defeat\n'],['look\n','Exploring\n']), required: ['enum GameState'] }),
      t('cs-trycatch', '不怕乱输入', 'try / catch', 'int.Parse("abc") 会抛出 FormatException（格式异常），默认会让程序崩溃。把可能失败的代码放进 try { }，在 catch (FormatException) { } 中处理，程序就能继续运行。TryParse 适合处理“预料之中的无效输入”，try/catch 适合处理意外错误；两种写法都要能读懂。', '逐行读取直到输入结束。每行用 int.Parse 转换：成功输出 数字乘以 2，失败（FormatException）输出 Not a number。', 'string? line;\nwhile ((line = Console.ReadLine()) != null) {\n try {\n  int value = int.Parse(line);\n  Console.WriteLine(value * 2);\n } catch (FormatException) {\n  Console.WriteLine("Not a number");\n }\n}', '', { tests: inputTests(['4\nabc\n10\n','8\nNot a number\n20\n'],['x\n','Not a number\n']), required: ['try', 'catch', 'int.Parse'] }),
      t('cs-hero-list', '章节试炼：冒险小队', 'List<Hero>', 'List<Hero> 可以保存多个对象。foreach 取出的 hero 指向列表里的同一个对象，所以在循环里调用 hero.TakeDamage(3) 会真正修改小队成员。', '逐行读取 名字 生命（空格分隔）直到输入结束，用 new Hero(名字, 生命) 加入 List<Hero>。之后全员受到 3 点伤害（不低于 0），逐行输出：仍存活输出 名字 生命，否则输出 名字 down。最后输出 Alive: 存活人数。Hero 使用只读 Name、private set 的 Hp 和 TakeDamage 方法。', 'var party = new List<Hero>();\nstring? line;\nwhile ((line = Console.ReadLine()) != null) {\n string[] parts = line.Split(" ");\n party.Add(new Hero(parts[0], int.Parse(parts[1])));\n}\nint alive = 0;\nforeach (Hero hero in party) {\n hero.TakeDamage(3);\n if (hero.Hp > 0) { Console.WriteLine($"{hero.Name} {hero.Hp}"); alive++; }\n else Console.WriteLine($"{hero.Name} down");\n}\nConsole.WriteLine($"Alive: {alive}");\nclass Hero {\n public string Name { get; }\n public int Hp { get; private set; }\n public Hero(string name, int hp) { Name = name; Hp = hp; }\n public void TakeDamage(int amount) { Hp = Math.Max(0, Hp - amount); }\n}', '', { tests: inputTests(['Mira 10\nKai 2\n','Mira 7\nKai down\nAlive: 1\n'],['Lea 3\nBo 4\nZed 9\n','Lea down\nBo 1\nZed 6\nAlive: 2\n'],['','Alive: 0\n']), required: ['List<Hero>', 'class Hero', 'TakeDamage'] })
    ]
  },
  {
    id: 'cs07', title: '王冠试炼', subtitle: '组合成可玩的文字 RPG',
    introduction: '最终章把数据、方法、输入和循环连成游戏。先分别实现移动、物品、战斗和结局，再组合。游戏状态必须有唯一来源：不要只输出“获得钥匙”，还要真正改变 HasKey。角色统一使用属性写法。两个里程碑题把毕业项目拆成“地图与移动”“战斗与拾取”，最后再整合。先用短命令序列测试，再测试失败和退出路线。',
    lessons: [
      t('cs07-02', '移动一步', '坐标更新', '移动先算候选位置，再检查边界，最后决定是否更新状态。不要先越界再访问地图。', '位置 x=0，地图为 0 到 2。读取多行 right 或 left；每次输出更新后的位置，越界则保持原位。', 'int x = 0;\nstring? cmd;\nwhile ((cmd = Console.ReadLine()) != null) {\n int next = x + (cmd == "right" ? 1 : cmd == "left" ? -1 : 0);\n if (next >= 0 && next <= 2) x = next;\n Console.WriteLine(x);\n}', '', { tests: inputTests(['left\nright\nright\nright\n','0\n1\n2\n2\n'],['right\nleft\n','1\n0\n']) }),
      t('cs07-03', '只能捡一次的钥匙', '幂等的拾取', '拾取成功后要修改状态。第二次尝试不能重复增加物品。', '初始没有钥匙。逐行读取 take；第一次输出 Key taken，以后输出 Already taken。其他输入不输出。', 'bool hasKey = false;\nstring? cmd;\nwhile ((cmd = Console.ReadLine()) != null) {\n if (cmd != "take") continue;\n Console.WriteLine(hasKey ? "Already taken" : "Key taken");\n hasKey = true;\n}', '', { tests: inputTests(['take\ntake\n','Key taken\nAlready taken\n'],['look\ntake\n','Key taken\n']), }),
      t('cs07-04', '会消耗钥匙的门', '资源消耗', '开门需要钥匙且会消耗它。显示反馈和修改资源必须属于同一次动作。', '初始有一把钥匙。每行 open：有钥匙输出 Opened 并消耗；没有钥匙输出 Locked。其他命令不输出任何内容。', 'bool hasKey = true;\nstring? cmd;\nwhile ((cmd = Console.ReadLine()) != null) {\n if (cmd == "open") { Console.WriteLine(hasKey ? "Opened" : "Locked"); hasKey = false; }\n}', '', { tests: inputTests(['open\nopen\n','Opened\nLocked\n'],['wait\nopen\n','Opened\n']) }),
      t('cs07-05', '药水与生命', '多个状态同步', '一次治疗同时涉及药水数量和生命值。用完后再次请求，需要输出失败反馈且不能加血。', 'hp=5，只有一瓶药水。每行 heal：有药时加 4（上限10），输出 HP: 数值；无药输出 Empty。', 'int hp = 5, potions = 1;\nstring? cmd;\nwhile ((cmd = Console.ReadLine()) != null) {\n if (cmd != "heal") continue;\n if (potions == 0) Console.WriteLine("Empty");\n else { potions--; hp = Math.Min(10, hp + 4); Console.WriteLine($"HP: {hp}"); }\n}', '', { tests: inputTests(['heal\nheal\n','HP: 9\nEmpty\n'],['heal\n','HP: 9\n']) }),
      t('cs07-06', '敌人的反击', '战斗顺序', '玩家先攻击。如果敌人已经倒下，它就不应再反击。顺序不同，结局可能不同。', '输入玩家 hp、敌人 hp。玩家每轮伤害4，存活的敌人反击3。战斗结束输出玩家剩余 hp（最低0）与 Win 或 Lose，各一行。', 'int hp = int.Parse(Console.ReadLine() ?? "0");\nint enemy = int.Parse(Console.ReadLine() ?? "0");\nwhile (hp > 0 && enemy > 0) {\n enemy -= 4;\n if (enemy > 0) hp = Math.Max(0, hp - 3);\n}\nConsole.WriteLine(hp);\nConsole.WriteLine(hp > 0 ? "Win" : "Lose");', '', { tests: inputTests(['10\n8\n','7\nWin\n'],['2\n10\n','0\nLose\n'],['2\n4\n','2\nWin\n']) }),
      t('cs07-07', '胜利奖励仅一次', '防止重复奖励', '将敌人是否已败记录下来，不能因为再次收到 fight 命令就重复发放奖励。', '初始 gold=0。第一次 fight 击败敌人获得5金币；以后 fight 不增加。每次 fight 输出金币数。', 'int gold = 0;\nbool defeated = false;\nstring? cmd;\nwhile ((cmd = Console.ReadLine()) != null) {\n if (cmd != "fight") continue;\n if (!defeated) { gold += 5; defeated = true; }\n Console.WriteLine(gold);\n}', '', { tests: inputTests(['fight\nfight\n','5\n5\n'],['look\nfight\n','5\n']) }),
      t('cs07-08', 'NPC 的两种对话', '由状态驱动文本', '对话内容应该读取当前状态，而不是永远显示同一句话。', '没有钥匙时 talk 输出 Find the key；take 获得钥匙且不输出；有钥匙后 talk 输出 Open the gate。', 'bool hasKey = false;\nstring? cmd;\nwhile ((cmd = Console.ReadLine()) != null) {\n if (cmd == "take") hasKey = true;\n if (cmd == "talk") Console.WriteLine(hasKey ? "Open the gate" : "Find the key");\n}', '', { tests: inputTests(['talk\ntake\ntalk\n','Find the key\nOpen the gate\n'],['take\ntalk\n','Open the gate\n']) }),
      t('cs07-09', '安全退出的游戏', '退出与输入结束', '游戏必须处理 quit 和输入耗尽。读取 null 后继续循环会产生无限循环。', '逐行读取命令；quit 输出 Bye 并立即结束；其他命令输出 Continue。自然读到输入结束时输出 End。', 'bool quit = false;\nstring? cmd;\nwhile ((cmd = Console.ReadLine()) != null) {\n if (cmd == "quit") { Console.WriteLine("Bye"); quit = true; break; }\n Console.WriteLine("Continue");\n}\nif (!quit) Console.WriteLine("End");', '', { tests: inputTests(['look\nquit\nlook\n','Continue\nBye\n'],['look\n','Continue\nEnd\n'],['','End\n']) }),
      t('cs07-10', '把角色状态放在一起', '状态对象', '集中保存 Hp、Gold 和 HasKey，让不同方法修改同一份数据。沿用第 7 章的属性写法 { get; set; }；最终项目也会这样写。', '创建 Hero，Hp=10、Gold=0、HasKey=false。依次处理 hurt（生命减3，最低0）、loot（金币加5）、take（有钥匙）；最后输出 Hp Gold HasKey，以空格分隔。', 'var hero = new Hero();\nstring? cmd;\nwhile ((cmd = Console.ReadLine()) != null) {\n switch (cmd) {\n case "hurt": hero.Hp = Math.Max(0, hero.Hp - 3); break;\n case "loot": hero.Gold += 5; break;\n case "take": hero.HasKey = true; break;\n }\n}\nConsole.WriteLine($"{hero.Hp} {hero.Gold} {hero.HasKey}");\nclass Hero {\n public int Hp { get; set; } = 10;\n public int Gold { get; set; }\n public bool HasKey { get; set; }\n}', '', { tests: inputTests(['hurt\nloot\ntake\n','7 5 True\n'],['','10 0 False\n']), required: ['class Hero'] }),
      t('cs07-11', '毕业前演练：小竞技场', '对象、方法和主循环', '主循环只读取命令；把攻击放进 Attack 方法。角色状态由对象保存，输出由主流程统一组织。', 'Hero.Hp=10。每行 hit 调用 Attack(Hero)，造成3伤害且不低于0，随后输出 HP: 数值；死亡时输出 Defeat 并结束。quit 输出 Bye 并结束。', 'var hero = new Hero();\nstring? cmd;\nwhile ((cmd = Console.ReadLine()) != null) {\n if (cmd == "quit") { Console.WriteLine("Bye"); break; }\n if (cmd != "hit") continue;\n Attack(hero); Console.WriteLine($"HP: {hero.Hp}");\n if (hero.Hp == 0) { Console.WriteLine("Defeat"); break; }\n}\nvoid Attack(Hero hero) { hero.Hp = Math.Max(0, hero.Hp - 3); }\nclass Hero { public int Hp { get; set; } = 10; }', '', { tests: inputTests(['hit\nquit\n','HP: 7\nBye\n'],['hit\nhit\nhit\nhit\nhit\n','HP: 7\nHP: 4\nHP: 1\nHP: 0\nDefeat\n']), required: ['class Hero', 'void Attack'] }),
      t('cs-milestone-map', '里程碑一：地图与移动', '数组、循环与 switch', '毕业项目可以拆成几个可单独测试的里程碑。第一步只做地图：房间名放进数组，position 记录当前位置，命令循环负责移动和反馈。先统一命令格式（Trim + ToLowerInvariant），再分派。', '房间顺序为 Camp、Forest、Gate，起点 Camp。逐行读取命令（忽略首尾空格和大小写）：look 输出当前房间；left/right 移动一格并输出新房间，越界输出 Blocked；quit 输出 Bye 并结束；其他输出 Unknown。', 'string[] rooms = { "Camp", "Forest", "Gate" };\nint position = 0;\nstring? line;\nwhile ((line = Console.ReadLine()) != null) {\n string cmd = line.Trim().ToLowerInvariant();\n if (cmd == "quit") { Console.WriteLine("Bye"); break; }\n switch (cmd) {\n  case "look": Console.WriteLine(rooms[position]); break;\n  case "left":\n  case "right":\n   int next = position + (cmd == "right" ? 1 : -1);\n   if (next < 0 || next >= rooms.Length) Console.WriteLine("Blocked");\n   else { position = next; Console.WriteLine(rooms[position]); }\n   break;\n  default: Console.WriteLine("Unknown"); break;\n }\n}', '', { tests: inputTests(['look\nleft\nright\n RIGHT \nright\nquit\nlook\n','Camp\nBlocked\nForest\nGate\nBlocked\nBye\n'],['dance\n','Unknown\n']), required: ['string[]', 'switch', 'while'], minutes: 25 }),
      t('cs-milestone-fight', '里程碑二：战斗与拾取', '对象、方法与状态', '第二步只做战斗和钥匙。Hero 用属性保存 Hp 和 HasKey；Fight 方法负责一整场战斗；主循环根据“是否已获胜”决定 fight 和 take 的反馈。', '第一行是英雄初始 HP，用 new Hero { Hp = 数值 } 创建。之后逐行读取命令：fight 第一次调用 Fight(hero, 10)（敌人 HP=10，玩家先打 4，存活的敌人反击 3，玩家 HP 不低于 0），获胜输出 Won HP:数值，HP 为 0 输出 Defeat 并结束；再次 fight 输出 Clear。take 在获胜后且尚未拿钥匙时输出 Key taken，否则输出 Not available。look 输出 HP:数值 Key:True或False。其他命令不输出。', 'var hero = new Hero { Hp = int.Parse(Console.ReadLine() ?? "12") };\nbool won = false;\nstring? line;\nwhile ((line = Console.ReadLine()) != null) {\n string cmd = line.Trim().ToLowerInvariant();\n if (cmd == "fight") {\n  if (won) { Console.WriteLine("Clear"); continue; }\n  Fight(hero, 10);\n  if (hero.Hp == 0) { Console.WriteLine("Defeat"); break; }\n  won = true;\n  Console.WriteLine($"Won HP:{hero.Hp}");\n } else if (cmd == "take") {\n  if (won && !hero.HasKey) { hero.HasKey = true; Console.WriteLine("Key taken"); }\n  else Console.WriteLine("Not available");\n } else if (cmd == "look") Console.WriteLine($"HP:{hero.Hp} Key:{hero.HasKey}");\n}\nvoid Fight(Hero hero, int enemyHp) {\n while (hero.Hp > 0 && enemyHp > 0) {\n  enemyHp -= 4;\n  if (enemyHp > 0) hero.Hp = Math.Max(0, hero.Hp - 3);\n }\n}\nclass Hero {\n public int Hp { get; set; } = 12;\n public bool HasKey { get; set; }\n}', '', { tests: inputTests(['12\ntake\nfight\ntake\ntake\nfight\nlook\n','Not available\nWon HP:6\nKey taken\nNot available\nClear\nHP:6 Key:True\n'],['5\nfight\nlook\n','Defeat\n'],['9\nlook\nwait\n','HP:9 Key:False\n']), required: ['class Hero', 'void Fight'], minutes: 25 })
    ]
  }
];

const graduationCode = `var hero = new Hero();
string[] rooms = { "Camp", "Forest", "Gate" };
int position = 0;
bool enemyDefeated = false, keyCollected = false, ended = false;
Console.WriteLine("Crown Quest");
string? line;
while (!ended && (line = Console.ReadLine()) != null) {
    string cmd = line.Trim().ToLowerInvariant();
    switch (cmd) {
        case "look":
            Console.WriteLine($"{rooms[position]} HP:{hero.Hp} Gold:{hero.Gold} Key:{hero.HasKey}");
            break;
        case "left":
        case "right":
            int next = position + (cmd == "right" ? 1 : -1);
            if (next < 0 || next >= rooms.Length) Console.WriteLine("Blocked");
            else { position = next; Console.WriteLine(rooms[position]); }
            break;
        case "fight":
            if (position != 1) Console.WriteLine("No enemy");
            else if (enemyDefeated) Console.WriteLine("Clear");
            else {
                Fight(hero);
                if (hero.Hp == 0) { Console.WriteLine("Defeat"); ended = true; }
                else { enemyDefeated = true; hero.Gold += 5; Console.WriteLine($"Won HP:{hero.Hp} Gold:{hero.Gold}"); }
            }
            break;
        case "take":
            if (position == 1 && enemyDefeated && !keyCollected) {
                hero.HasKey = true; keyCollected = true; Console.WriteLine("Key taken");
            } else Console.WriteLine("Not available");
            break;
        case "heal":
            if (hero.Potions == 0) Console.WriteLine("Empty");
            else { hero.Potions--; hero.Hp = Math.Min(12, hero.Hp + 5); Console.WriteLine($"HP: {hero.Hp}"); }
            break;
        case "search":
            if (position != 1) Console.WriteLine("Nothing");
            else {
                hero.Hp = Math.Max(0, hero.Hp - 4); Console.WriteLine($"HP: {hero.Hp}");
                if (hero.Hp == 0) { Console.WriteLine("Defeat"); ended = true; }
            }
            break;
        case "open":
            if (position == 2 && hero.HasKey) { hero.HasKey = false; Console.WriteLine("Victory"); ended = true; }
            else Console.WriteLine("Locked");
            break;
        case "quit": Console.WriteLine("Bye"); ended = true; break;
        default: Console.WriteLine("Unknown"); break;
    }
}
if (!ended) Console.WriteLine("Journey paused.");
void Fight(Hero hero) {
    int enemyHp = 10;
    while (hero.Hp > 0 && enemyHp > 0) {
        enemyHp -= 4;
        if (enemyHp > 0) hero.Hp = Math.Max(0, hero.Hp - 3);
    }
}
class Hero {
    public int Hp { get; set; } = 12;
    public int Gold { get; set; }
    public int Potions { get; set; } = 1;
    public bool HasKey { get; set; }
}`;
chapters.at(-1).lessons.push(t(
  'cs07-12', '毕业项目：王冠远征', '可玩的控制台文字 RPG',
  '先创建 Hero 状态，再建立读取命令的循环，最后把移动、战斗和物品逐项接入。可以复制上一题的结构开始。先跑胜利路线，再检查失败、重复操作、边界和输入结束。毕业后可下载 Program.cs，放入 dotnet new console 创建的项目运行；正式 Console.ReadLine 可接收实时键盘输入。',
  '实现下方完整规则。输入为逐行命令，不区分大小写并忽略首尾空格。必须用 Hero 类保存角色、用 Fight 方法战斗，并用循环与 switch 分派命令。',
  graduationCode, '', {
    rules: [
      '初始输出 Crown Quest。英雄 HP=12、Gold=0、药水=1、无钥匙，位于 Camp。房间顺序：Camp、Forest、Gate。',
      'look：输出 房间 HP:数值 Gold:数值 Key:True或False。left/right：移动一格并输出新房间；越界输出 Blocked。',
      'fight：只在 Forest 有敌人；其他房间输出 No enemy。敌人 HP=10，玩家先打4，尚存活的敌人反击3；玩家生命不低于0。胜利获得5金币，输出 Won HP:数值 Gold:数值。已败的敌人再次战斗输出 Clear。',
      'take：只能在 Forest 击败敌人后捡一次钥匙，成功输出 Key taken，其他情况输出 Not available。',
      'heal：消耗一瓶药水，加5HP（最多12），输出 HP: 数值；无药输出 Empty。',
      'search：在 Forest 踩陷阱减4HP（最低0），输出 HP: 数值；其他房间输出 Nothing。',
      'open：只有在 Gate 且有钥匙才能消耗钥匙、输出 Victory 并结束；否则输出 Locked。HP归零时输出 Defeat 并立即结束。',
      'quit：输出 Bye 并结束。未知命令输出 Unknown。若尚未结束但输入已读完，输出 Journey paused.。结局后忽略剩余输入。'
    ],
    tests: inputTests(
      ['look\nright\nfight\ntake\nright\nopen\nlook\n', 'Crown Quest\nCamp HP:12 Gold:0 Key:False\nForest\nWon HP:6 Gold:5\nKey taken\nGate\nVictory\n'],
      ['left\nopen\nxyz\nquit\nright\n', 'Crown Quest\nBlocked\nLocked\nUnknown\nBye\n'],
      ['right\nsearch\nsearch\nsearch\nheal\n', 'Crown Quest\nForest\nHP: 8\nHP: 4\nHP: 0\nDefeat\n'],
      ['right\nfight\nfight\ntake\ntake\nheal\nheal\nlook\n', 'Crown Quest\nForest\nWon HP:6 Gold:5\nClear\nKey taken\nNot available\nHP: 11\nEmpty\nForest HP:11 Gold:5 Key:True\nJourney paused.\n'],
      ['right\nsearch\nsearch\nfight\n', 'Crown Quest\nForest\nHP: 8\nHP: 4\nDefeat\n'],
      ['', 'Crown Quest\nJourney paused.\n'],
      [' RIGHT \nRIGHT\nright\nopen\nquit\n', 'Crown Quest\nForest\nGate\nBlocked\nLocked\nBye\n']
    ),
    required: ['class Hero', 'void Fight', 'while', 'switch'],
    minutes: 45,
    demoInput: 'look\nright\nfight\ntake\nheal\nright\nopen\n',
    starter: prelude + '// 将你前面练习过的角色、方法和命令循环组合起来。\nConsole.WriteLine("Crown Quest");\n\n// TODO: 角色状态、地图、命令循环、战斗与结局\n'
  }
));


export const lessons = chapters.flatMap((chapter, chapterIndex) => chapter.lessons.map((lesson, localIndex) => Object.assign(lesson, {
  chapterId: chapter.id, chapterIndex, localIndex,
  starter: lesson.starter ?? (lesson.linq ? linqPrelude : prelude) + '// 先阅读知识说明，再在这里完成任务。\n',
  hints: [
    lesson.hint ?? `先确定本题要使用的知识点：${lesson.topic}。`,
    lesson.tests.some(test => test.input) ? '每次 ReadLine 读取一行。先把输入存入变量，再计算、更新状态，最后输出。' : '按任务要求逐项声明数据和执行动作；检查大小写、分号和输出顺序。',
    '用示例输入手算一次结果。遇到循环，检查初始值、继续条件和每轮更新；遇到分支，检查边界是否包含等号。'
  ],
  minutes: lesson.minutes ?? (chapterIndex < 2 ? 8 : chapterIndex < 5 ? 12 : 15)
})));
if (new Set(lessons.map(lesson => lesson.id)).size !== lessons.length) throw new Error('Duplicate C# lesson id');
