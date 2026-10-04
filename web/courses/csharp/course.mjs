const prelude = 'using System;\nusing System.Collections.Generic;\nusing System.Linq;\n\n';
const t = (title, topic, teach, objective, code, output, options = {}) => ({ title, topic, teach, objective, solution: prelude + code, tests: [{ input: '', output }], ...options });
const inputTests = (...pairs) => pairs.map(([input, output]) => ({ input, output }));

export const chapters = [
  {
    id: 'cs01', title: '雾港启程', subtitle: '输出、变量与表达式',
    introduction: '程序按从上到下的顺序执行。C# 区分大小写，语句通常以分号结束。Console.WriteLine(...) 输出一行文字；字符串放在双引号中。我们采用 C# 的顶层语句写法，不必先背诵 Main 方法。变量是有名字、有类型的储物格：int 存整数，string 存文字。',
    lessons: [
      t('向港口问好', 'Console.WriteLine', 'Console 是控制台；WriteLine 会输出括号里的内容并换行。例：Console.WriteLine("Hi!");。双引号属于语法，不会出现在输出里。', '输出一行 Hello, Adventurer!。', 'Console.WriteLine("Hello, Adventurer!");', 'Hello, Adventurer!\n', { required: ['Console.WriteLine'] }),
      t('两条航海日志', '执行顺序', '多条语句从上往下执行。每条 WriteLine 后都有一个换行，每条语句后需要分号。', '依次输出 Fog Harbor 和 The journey begins，各占一行。', 'Console.WriteLine("Fog Harbor");\nConsole.WriteLine("The journey begins");', 'Fog Harbor\nThe journey begins\n'),
      t('同一行的欢迎语', 'Write 与 WriteLine', 'Write 不自动换行，WriteLine 自动换行。空格也是字符串的一部分。', '先用 Write 输出 Welcome, ，再用 WriteLine 输出 Hero!，合成一行。', 'Console.Write("Welcome, ");\nConsole.WriteLine("Hero!");', 'Welcome, Hero!\n', { required: ['Console.Write(', 'Console.WriteLine'] }),
      t('地图上的引号', '转义字符', '字符串中的双引号用反斜杠转义，反斜杠本身也要转义。', '输出 The sign says "North"，再输出 C:\\Map。', String.raw`Console.WriteLine("The sign says \"North\"");
Console.WriteLine("C:\\Map");`, 'The sign says "North"\nC:\\Map\n'),
      t('写给未来自己的笔记', '注释', '// 后面直到行尾都是注释，不会执行。注释说明原因或意图；输出仍由语句产生。', '写一条 // 注释，程序只输出 Ready。', '// The journey starts here.\nConsole.WriteLine("Ready");', 'Ready\n', { requiredRaw: ['//'] }),
      t('初始生命值', 'int', 'int hp = 10; 声明整数变量并赋初值。之后可以读取 hp，不需要再次写类型。', '声明 int hp = 30，并用变量输出 30。', 'int hp = 30;\nConsole.WriteLine(hp);', '30\n', { required: ['int ', 'hp'] }),
      t('英雄的名字', 'string', 'string 保存文字。变量名不加引号；写 "name" 会输出字面文字，而不是变量的内容。', '声明 string name = "Mira"，输出变量 name。', 'string name = "Mira";\nConsole.WriteLine(name);', 'Mira\n', { required: ['string ', 'name'] }),
      t('制作角色名牌', '字符串插值', '$"Name: {name}" 将变量的值嵌入文字。字符串前的 $ 与花括号要同时出现。', '用 name="Mira" 和 level=1，通过插值输出 Mira Lv.1。', 'string name = "Mira";\nint level = 1;\nConsole.WriteLine($"{name} Lv.{level}");', 'Mira Lv.1\n', { required: ['$"', 'level'] }),
      t('治疗后的生命', '赋值', '= 表示把右边的结果放入左边的变量，不是数学中的相等判断。变量声明一次，之后可以反复赋值。', 'hp 初始为 12，输出它，再赋值为 20 并输出。', 'int hp = 12;\nConsole.WriteLine(hp);\nhp = 20;\nConsole.WriteLine(hp);', '12\n20\n', { required: ['hp ='] }),
      t('修复铁剑', '算术表达式', '+、-、*、/ 表示加减乘除。括号能明确先算什么，乘除通常先于加减。', '用 attack=4 和 bonus=3，输出 (attack + bonus) * 2 的结果。', 'int attack = 4, bonus = 3;\nConsole.WriteLine((attack + bonus) * 2);', '14\n', { required: ['attack', 'bonus', '*'] }),
      t('背包金币', '复合赋值', 'gold += 5 等价于 gold = gold + 5。-= 同理。先执行的变化会影响后续表达式。', '金币初始 10，获得 7，再花费 4，输出最终金币数。', 'int gold = 10;\ngold += 7;\ngold -= 4;\nConsole.WriteLine(gold);', '13\n', { required: ['+=', '-='] }),
      t('章节试炼：出发面板', '整合输出与变量', '把人物数据放入变量，再组织显示内容。逐项核对标签、空格、顺序和换行。', '声明 name="Mira"、hp=30、gold=10，输出三行 Name: Mira、HP: 30、Gold: 10。', 'string name = "Mira";\nint hp = 30, gold = 10;\nConsole.WriteLine($"Name: {name}");\nConsole.WriteLine($"HP: {hp}");\nConsole.WriteLine($"Gold: {gold}");', 'Name: Mira\nHP: 30\nGold: 10\n', { required: ['string ', 'int ', '$"'] })
    ]
  },
  {
    id: 'cs02', title: '集市交易', subtitle: '输入、类型转换与数值',
    introduction: '本课程的“程序输入”按行提供给 Console.ReadLine()，每次读取消耗一行；输入读完时返回 null。?? 提供空值的替代值。int.Parse 把数字文字转换为整数；TryParse 能处理无效输入。输入框不是实时终端，请在运行前填好所有输入。',
    lessons: [
      t('登记新名字', 'ReadLine 与 ??', 'string name = Console.ReadLine() ?? "Guest"; 读取一行；没有这一行时使用 Guest。注意空字符串与 null 不同。', '读取一行名字，输出 Hello, 名字!；没有输入时使用 Guest。', 'string name = Console.ReadLine() ?? "Guest";\nConsole.WriteLine($"Hello, {name}!");', '', { tests: inputTests(['Mira\n','Hello, Mira!\n'], ['Kai\n','Hello, Kai!\n'],['','Hello, Guest!\n']), required: ['Console.ReadLine'] }),
      t('读取年龄', 'int.Parse', 'ReadLine 返回文字，int.Parse("12") 返回整数 12。我们先保证输入是合法整数，稍后学习验证。', '读取整数年龄，输出明年的年龄。', 'int age = int.Parse(Console.ReadLine() ?? "0");\nConsole.WriteLine(age + 1);', '', { tests: inputTests(['18\n','19\n'],['0\n','1\n']), required: ['int.Parse'] }),
      t('两笔收入', '多行输入', '连续调用两次 ReadLine 会读两行，而不是两次读同一行。可以把中间值分别存入变量。', '读取两行整数，输出它们的和。', 'int a = int.Parse(Console.ReadLine() ?? "0");\nint b = int.Parse(Console.ReadLine() ?? "0");\nConsole.WriteLine(a + b);', '', { tests: inputTests(['7\n5\n','12\n'],['-2\n8\n','6\n']) }),
      t('平分金币', '整数除法', '两个整数相除会丢弃小数部分。例如 9 / 2 是 4。不要把它误当作四舍五入。', '读取非负金币数，将它平均分给 3 人，输出每人获得的整数枚数。', 'int gold = int.Parse(Console.ReadLine() ?? "0");\nConsole.WriteLine(gold / 3);', '', { tests: inputTests(['10\n','3\n'],['2\n','0\n']), required: ['/'] }),
      t('剩余的金币', '取余 %', 'a % b 是整数除法的余数。10 % 3 为 1，适合循环轮次、奇偶或剩余物品。', '读取非负金币数，输出分给 3 人之后的余数。', 'int gold = int.Parse(Console.ReadLine() ?? "0");\nConsole.WriteLine(gold % 3);', '', { tests: inputTests(['10\n','1\n'],['12\n','0\n']), required: ['%'] }),
      t('药水的价格', 'double', 'double 能保存小数。double.Parse 将文字转成小数；本课程使用小数点 .。F1 把结果显示为一位小数。', '读取药水单价，购买两瓶，输出一位小数的总价。', 'double price = double.Parse(Console.ReadLine() ?? "0");\nConsole.WriteLine((price * 2).ToString("F1"));', '', { tests: inputTests(['2.5\n','5.0\n'],['1.2\n','2.4\n']), required: ['double'] }),
      t('真正的平均值', '显式类型转换', '(double)total 先把整数转换成小数，再进行除法。先做整数除法再转换，丢失的小数不会回来。', '读取总分和人数（大于 0），用小数除法输出平均分，保留一位小数。', 'int total = int.Parse(Console.ReadLine() ?? "0");\nint count = int.Parse(Console.ReadLine() ?? "1");\nConsole.WriteLine(((double)total / count).ToString("F1"));', '', { tests: inputTests(['7\n2\n','3.5\n'],['10\n4\n','2.5\n']), required: ['double'] }),
      t('门是否开启', 'bool 与比较', 'bool 只有 true 和 false。hp > 0 是表达式，结果是布尔值。Console 输出时显示 True 或 False。', '读取生命值，输出它是否大于 0。', 'int hp = int.Parse(Console.ReadLine() ?? "0");\nbool alive = hp > 0;\nConsole.WriteLine(alive);', '', { tests: inputTests(['5\n','True\n'],['0\n','False\n']), required: ['bool'] }),
      t('方向的一个字符', 'char', "char 保存一个字符，用单引号，例如 'N'。string 的 [0] 可以读取第一个字符，前提是字符串非空。", '输入保证是一个非空方向词。取第一个字符，输出它。', 'string direction = Console.ReadLine() ?? "North";\nchar first = direction[0];\nConsole.WriteLine(first);', '', { tests: inputTests(['North\n','N\n'],['South\n','S\n']), required: ['char'] }),
      t('不可信的数字', 'TryParse 与 out', 'int.TryParse(text, out int value) 返回能否转换，成功时 value 得到数字，失败时为 0，不会抛出格式异常。', '读取一行，先输出能否转成整数，再输出转换后的值。', 'bool ok = int.TryParse(Console.ReadLine(), out int value);\nConsole.WriteLine(ok);\nConsole.WriteLine(value);', '', { tests: inputTests(['42\n','True\n42\n'],['dragon\n','False\n0\n']), required: ['int.TryParse'] }),
      t('倒数计数器', '自增与自减', 'count++ 让变量增加 1；count-- 减少 1。单独写成语句最容易看清顺序。', '读取整数，先增加 1 并输出，再减少 2 并输出。', 'int count = int.Parse(Console.ReadLine() ?? "0");\ncount++;\nConsole.WriteLine(count);\ncount -= 2;\nConsole.WriteLine(count);', '', { tests: inputTests(['5\n','6\n4\n'],['0\n','1\n-1\n']), required: ['++'] }),
      t('章节试炼：购物收据', '输入与计算整合', '先读数量，再读单价。让同一段程序适应不同输入；输出格式也是约定的一部分。', '依次读取整数数量和小数单价，输出 Total: 总价，保留一位小数。', 'int count = int.Parse(Console.ReadLine() ?? "0");\ndouble price = double.Parse(Console.ReadLine() ?? "0");\nConsole.WriteLine($"Total: {count * price:F1}");', '', { tests: inputTests(['3\n2.5\n','Total: 7.5\n'],['0\n9.9\n','Total: 0.0\n']) })
    ]
  },
  {
    id: 'cs03', title: '岔路森林', subtitle: '条件、逻辑与输入验证',
    introduction: 'if (条件) { ... } 只在条件为真时执行；else 处理另一条路。== 比较是否相等，= 是赋值。&& 要求两边都成立，|| 要求至少一边成立，! 取反。大括号将多条语句组成一个代码块。',
    lessons: [
      t('生死之门', 'if / else', 'if 与 else 只会选择其中一支。把输出放在对应的大括号中。', '读取 hp。大于 0 输出 Alive，否则输出 Defeated。', 'int hp = int.Parse(Console.ReadLine() ?? "0");\nif (hp > 0) Console.WriteLine("Alive");\nelse Console.WriteLine("Defeated");', '', { tests: inputTests(['1\n','Alive\n'],['0\n','Defeated\n'],['-3\n','Defeated\n']), required: ['if', 'else'] }),
      t('能否买药', '>= 边界', '>= 包括等于的情况。价格刚好够时也应允许购买。', '药水价格为 8。读取金币，够买则输出 Buy，否则输出 Save。', 'int gold = int.Parse(Console.ReadLine() ?? "0");\nConsole.WriteLine(gold >= 8 ? "Buy" : "Save");', '', { tests: inputTests(['8\n','Buy\n'],['7\n','Save\n']) }),
      t('伤势分级', 'else if', 'else if 从上到下尝试条件，一旦命中就不再进入后续分支。把最紧急的情况放在前面。', 'hp<=0 输出 Defeated；1 到 9 输出 Danger；其余输出 Safe。', 'int hp = int.Parse(Console.ReadLine() ?? "0");\nif (hp <= 0) Console.WriteLine("Defeated");\nelse if (hp < 10) Console.WriteLine("Danger");\nelse Console.WriteLine("Safe");', '', { tests: inputTests(['0\n','Defeated\n'],['9\n','Danger\n'],['10\n','Safe\n']), required: ['else if'] }),
      t('安全坐标', '逻辑与 &&', 'x >= 0 && x < 5 表示两个条件同时满足。&& 左边为假时不会计算右边。', '读取 x，0 到 4（含）输出 Inside，其余输出 Outside。', 'int x = int.Parse(Console.ReadLine() ?? "0");\nConsole.WriteLine(x >= 0 && x < 5 ? "Inside" : "Outside");', '', { tests: inputTests(['0\n','Inside\n'],['4\n','Inside\n'],['5\n','Outside\n'],['-1\n','Outside\n']), required: ['&&'] }),
      t('两种通行证', '逻辑或 ||', '字符串可以用 == 比较内容。|| 只要求其中一项成立。', '读取 pass，值为 key 或 badge 时输出 Enter，否则输出 Locked。', 'string pass = Console.ReadLine() ?? "";\nConsole.WriteLine(pass == "key" || pass == "badge" ? "Enter" : "Locked");', '', { tests: inputTests(['key\n','Enter\n'],['badge\n','Enter\n'],['coin\n','Locked\n']), required: ['||'] }),
      t('解除诅咒', '逻辑非 !', '!true 为 false，!false 为 true。把结果存入 bool 有助于表达“不是某种状态”。', '输入 true 或 false 表示是否被诅咒，输出能否休息（未被诅咒）。', 'bool cursed = bool.Parse(Console.ReadLine() ?? "false");\nConsole.WriteLine(!cursed);', '', { tests: inputTests(['true\n','False\n'],['false\n','True\n']), required: ['!'] }),
      t('三条路线', 'switch', 'switch 按值选择 case；break 结束这一支，default 处理未列出的输入。', '输入 n 输出 North，s 输出 South，其他输入输出 Wait。使用 switch。', 'string cmd = Console.ReadLine() ?? "";\nswitch (cmd) {\ncase "n": Console.WriteLine("North"); break;\ncase "s": Console.WriteLine("South"); break;\ndefault: Console.WriteLine("Wait"); break;\n}', '', { tests: inputTests(['n\n','North\n'],['s\n','South\n'],['x\n','Wait\n']), required: ['switch'] }),
      t('较大的伤害', '条件运算符', '条件 ? 值A : 值B 是一个表达式，可以参与赋值。例如 int max = a > b ? a : b;。', '读取两个整数伤害，用 ?: 输出较大的值。', 'int a = int.Parse(Console.ReadLine() ?? "0");\nint b = int.Parse(Console.ReadLine() ?? "0");\nConsole.WriteLine(a > b ? a : b);', '', { tests: inputTests(['4\n9\n','9\n'],['7\n7\n','7\n']), required: [' ? '] }),
      t('宽容的命令', 'Trim 与 ToLowerInvariant', 'Trim 去掉前后的空白，ToLowerInvariant 转为小写。先统一输入形式，再比较命令。', '读取命令，忽略首尾空格和大小写。是 heal 输出 Heal，否则输出 Unknown。', 'string cmd = (Console.ReadLine() ?? "").Trim().ToLowerInvariant();\nConsole.WriteLine(cmd == "heal" ? "Heal" : "Unknown");', '', { tests: inputTests([' HEAL \n','Heal\n'],['heal\n','Heal\n'],['run\n','Unknown\n']), required: ['Trim', 'ToLowerInvariant'] }),
      t('验证药水数量', '验证与短路', '先 TryParse，再用 && 检查范围。无效输入需要明确反馈，不能把它悄悄当作有效数量。', '输入可解析为 1 到 9 的整数时输出 Accepted，其他情况输出 Invalid。', 'bool ok = int.TryParse(Console.ReadLine(), out int count);\nConsole.WriteLine(ok && count >= 1 && count <= 9 ? "Accepted" : "Invalid");', '', { tests: inputTests(['1\n','Accepted\n'],['9\n','Accepted\n'],['0\n','Invalid\n'],['abc\n','Invalid\n']), required: ['TryParse'] }),
      t('伤害下限', '状态与分支', '伤害不能是负数，否则攻击会意外治疗敌人。先计算，再修正，再输出。', '依次读取攻击与防御，伤害为 attack-defense，但最少为 1。输出伤害。', 'int attack = int.Parse(Console.ReadLine() ?? "0");\nint defense = int.Parse(Console.ReadLine() ?? "0");\nint damage = attack - defense;\nif (damage < 1) damage = 1;\nConsole.WriteLine(damage);', '', { tests: inputTests(['8\n3\n','5\n'],['2\n7\n','1\n']) }),
      t('章节试炼：守门人', '组合条件', '把“拥有钥匙”和“等级足够”拆成布尔条件，再组合起来。测试要覆盖刚好达标与不达标。', '第一行输入 key 或 none，第二行输入等级。拥有 key 且等级>=3 时输出 Open，否则输出 Closed。', 'string item = Console.ReadLine() ?? "";\nint level = int.Parse(Console.ReadLine() ?? "0");\nConsole.WriteLine(item == "key" && level >= 3 ? "Open" : "Closed");', '', { tests: inputTests(['key\n3\n','Open\n'],['key\n2\n','Closed\n'],['none\n8\n','Closed\n']) })
    ]
  },
  {
    id: 'cs04', title: '回声地牢', subtitle: '循环与游戏主循环',
    introduction: '循环用来重复执行代码。for 包含起点、继续条件和每轮的变化；while 先检查条件；do/while 至少执行一次。每个循环都要考虑“什么时候结束”。break 退出最近的一层循环，continue 跳过本轮剩余部分。',
    lessons: [
      t('五级台阶', 'for', 'for (int i=1; i<=3; i++) 会让 i 依次取 1、2、3。每轮循环后执行 i++。', '使用 for，逐行输出 1 到 5。', 'for (int i = 1; i <= 5; i++) Console.WriteLine(i);', '1\n2\n3\n4\n5\n', { required: ['for'] }),
      t('熄灭的火把', 'while', 'while (条件) 在每轮开始时检查条件。循环体必须让条件有机会变成 false。', '读取非负整数 n，逐行从 n 倒数到 1；n=0 时不输出。', 'int n = int.Parse(Console.ReadLine() ?? "0");\nwhile (n > 0) { Console.WriteLine(n); n--; }', '', { tests: inputTests(['3\n','3\n2\n1\n'],['0\n','']), required: ['while'] }),
      t('至少一次敲门', 'do / while', 'do { ... } while (条件); 先执行后判断，末尾需要分号。', '读取 n。先输出 Knock 并将 n 减 1，只要 n>0 就继续；n=0 也要敲一次。', 'int n = int.Parse(Console.ReadLine() ?? "0");\ndo { Console.WriteLine("Knock"); n--; } while (n > 0);', '', { tests: inputTests(['2\n','Knock\nKnock\n'],['0\n','Knock\n']), required: ['do ', 'while'] }),
      t('一路收集金币', '累加器', 'sum 初始为 0，每轮把新值加进去。循环结束后再输出总计。', '读取 n（0到100），输出 1 到 n 的和。使用循环。', 'int n = int.Parse(Console.ReadLine() ?? "0");\nint sum = 0;\nfor (int i = 1; i <= n; i++) sum += i;\nConsole.WriteLine(sum);', '', { tests: inputTests(['4\n','10\n'],['0\n','0\n']), required: ['for'] }),
      t('绘制生命条', '重复同一行输出', '循环内用 Write，结束后用一次 WriteLine，得到一整行。', '输入 hp（0到20），输出 hp 个 #，最后换行。', 'int hp = int.Parse(Console.ReadLine() ?? "0");\nfor (int i = 0; i < hp; i++) Console.Write("#");\nConsole.WriteLine();', '', { tests: inputTests(['4\n','####\n'],['0\n','\n']), required: ['for', 'Console.Write('] }),
      t('跳过陷阱台阶', 'continue', 'continue 会直接进入下一轮；for 循环仍然执行递增部分。', '用循环输出 1 到 6，但跳过 3，每个数字一行。', 'for (int i = 1; i <= 6; i++) { if (i == 3) continue; Console.WriteLine(i); }', '1\n2\n4\n5\n6\n', { required: ['continue'] }),
      t('找到第一扇门', 'break', '找到目标后可以 break，避免继续做无用的搜索。break 只退出最近的一层循环。', '从 1 开始检查编号，找到第一个能被 7 整除的编号时输出它并退出循环。', 'for (int i = 1; i <= 20; i++) { if (i % 7 == 0) { Console.WriteLine(i); break; } }', '7\n', { required: ['for', 'break'] }),
      t('石墙的行与列', '嵌套循环', '外层负责行，内层负责列。每行的内层循环结束后再换行。', '输入行数与列数（0到5），输出相应大小的 * 矩形。', 'int rows = int.Parse(Console.ReadLine() ?? "0");\nint columns = int.Parse(Console.ReadLine() ?? "0");\nfor (int r = 0; r < rows; r++) {\n  for (int c = 0; c < columns; c++) Console.Write("*");\n  Console.WriteLine();\n}', '', { tests: inputTests(['2\n3\n','***\n***\n'],['1\n1\n','*\n']) }),
      t('结束输入的信号', '哨兵值', '哨兵值表示“停止”，它本身不参与计算。ReadLine 返回 null 时也应退出，避免无限等待。', '逐行读取整数，遇到 0 或输入结束时停止，输出此前数字的和。', 'int sum = 0;\nstring? line;\nwhile ((line = Console.ReadLine()) != null) {\n  int n = int.Parse(line);\n  if (n == 0) break;\n  sum += n;\n}\nConsole.WriteLine(sum);', '', { tests: inputTests(['3\n4\n0\n99\n','7\n'],['5\n','5\n']), required: ['while', 'break'] }),
      t('逐回合战斗', '循环更新状态', '每一轮都修改敌人的生命，直到生命不大于 0。使用 Math.Max 能把显示值限制在 0 以上。', '敌人 hp=10，每轮造成 4 点伤害；逐行输出每轮后的 hp，最低为 0。', 'int hp = 10;\nwhile (hp > 0) { hp = Math.Max(0, hp - 4); Console.WriteLine(hp); }', '6\n2\n0\n', { required: ['while'] }),
      t('有限的背包搜索', '循环边界', '0 到 n-1 一共 n 次，而 0 到 n 包含 n+1 次。程序边界通常从 0 开始。', '输入 n（0到10），逐行输出 Slot 0 到 Slot n-1。', 'int n = int.Parse(Console.ReadLine() ?? "0");\nfor (int i = 0; i < n; i++) Console.WriteLine($"Slot {i}");', '', { tests: inputTests(['2\n','Slot 0\nSlot 1\n'],['0\n','']) }),
      t('章节试炼：命令循环', 'while 与 switch', '游戏循环重复读取命令、更新状态、显示反馈。退出命令和输入结束都必须有出口。', '逐行读取命令：look 输出 Forest；rest 输出 Rested；quit 输出 Bye 并结束；其他命令输出 Unknown。', 'string? cmd;\nwhile ((cmd = Console.ReadLine()) != null) {\n  if (cmd == "quit") { Console.WriteLine("Bye"); break; }\n  switch (cmd) {\n    case "look": Console.WriteLine("Forest"); break;\n    case "rest": Console.WriteLine("Rested"); break;\n    default: Console.WriteLine("Unknown"); break;\n  }\n}', '', { tests: inputTests(['look\nrest\nquit\nlook\n','Forest\nRested\nBye\n'],['x\n','Unknown\n']), required: ['while', 'switch'] })
    ]
  },
  {
    id: 'cs05', title: '镜塔工坊', subtitle: '方法、参数与职责拆分',
    introduction: '方法把一个任务封装成有名字的步骤。void 表示不返回值；int 表示返回一个整数。参数是方法接收的数据，return 交还结果并结束方法。这里使用顶层程序中的局部方法，方法可以写在调用之后。方法内部的变量有自己的作用域。',
    lessons: [
      t('可重复的欢迎仪式', 'void 方法', 'void Greet() { ... } 定义方法，Greet(); 调用它。定义方法不会自动执行它。', '定义并调用 Greet() 两次，每次输出 Welcome。', 'Greet();\nGreet();\nvoid Greet() { Console.WriteLine("Welcome"); }', 'Welcome\nWelcome\n', { required: ['void Greet'] }),
      t('把名字交给方法', '参数', '参数像方法自己的变量。调用 Greet("Kai") 时，参数 name 得到 Kai。', '读取名字，调用 Greet(string name)，输出 Hello, 名字。', 'Greet(Console.ReadLine() ?? "Guest");\nvoid Greet(string name) { Console.WriteLine($"Hello, {name}"); }', '', { tests: inputTests(['Mira\n','Hello, Mira\n'],['Kai\n','Hello, Kai\n']), required: ['void Greet', 'string name'] }),
      t('伤害计算器', '返回值', 'return value; 把结果交给调用者。调用者可以保存、显示或继续计算这个结果。', '读取攻击与防御。用 int Damage(int attack,int defense) 返回至少为 1 的伤害并输出。', 'int a = int.Parse(Console.ReadLine() ?? "0");\nint d = int.Parse(Console.ReadLine() ?? "0");\nConsole.WriteLine(Damage(a, d));\nint Damage(int attack, int defense) { return Math.Max(1, attack - defense); }', '', { tests: inputTests(['8\n3\n','5\n'],['1\n5\n','1\n']), required: ['int Damage', 'return'] }),
      t('治疗不能超上限', '多个参数', '方法可接收多个参数，顺序必须与定义对应。Math.Min(a,b) 返回较小值。', '依次读 hp、amount、maximum，用 Heal 方法返回不超过 maximum 的 hp+amount，并输出。', 'int hp = int.Parse(Console.ReadLine() ?? "0");\nint amount = int.Parse(Console.ReadLine() ?? "0");\nint maximum = int.Parse(Console.ReadLine() ?? "0");\nConsole.WriteLine(Heal(hp, amount, maximum));\nint Heal(int hp, int amount, int maximum) { return Math.Min(maximum, hp + amount); }', '', { tests: inputTests(['8\n5\n10\n','10\n'],['2\n3\n10\n','5\n']), required: ['int Heal'] }),
      t('判断角色存活', 'bool 返回值', '方法也可以返回判断结果。把判断命名为 IsAlive，比在许多地方重复 hp>0 更清楚。', '用 bool IsAlive(int hp) 判断生命是否大于 0，读取 hp 并输出方法结果。', 'int hp = int.Parse(Console.ReadLine() ?? "0");\nConsole.WriteLine(IsAlive(hp));\nbool IsAlive(int hp) { return hp > 0; }', '', { tests: inputTests(['1\n','True\n'],['0\n','False\n']), required: ['bool IsAlive'] }),
      t('名称修整器', 'string 返回值', '方法可以先处理字符串，再 return。返回的字符串不会自动覆盖原变量。', '读取角色名，用 CleanName 方法去除首尾空格，再返回大写名字并输出。', 'Console.WriteLine(CleanName(Console.ReadLine() ?? ""));\nstring CleanName(string name) { return name.Trim().ToUpperInvariant(); }', '', { tests: inputTests([' mira \n','MIRA\n'],['Kai\n','KAI\n']), required: ['string CleanName'] }),
      t('局部变量的房间', '值参数与作用域', 'int 参数接收数值的副本。方法中修改参数，不会自动修改调用处的变量。', 'hp=10。Boost(int value) 输出 value+5。调用 Boost(hp) 后再输出 hp，观察原变量保持不变。', 'int hp = 10;\nBoost(hp);\nConsole.WriteLine(hp);\nvoid Boost(int value) { value += 5; Console.WriteLine(value); }', '15\n10\n', { required: ['void Boost'] }),
      t('用返回值更新状态', '接回计算结果', '要让方法的计算更新外面的变量，写 hp = Heal(hp);。这一赋值清楚地表示状态改变。', '输入 hp，定义 Restore 返回 hp+3，调用并赋值给 hp，再输出 hp。', 'int hp = int.Parse(Console.ReadLine() ?? "0");\nhp = Restore(hp);\nConsole.WriteLine(hp);\nint Restore(int hp) { return hp + 3; }', '', { tests: inputTests(['4\n','7\n'],['0\n','3\n']), required: ['int Restore', 'hp = Restore'] }),
      t('提前返回的守卫', 'early return', '发现无效情况后马上 return，可以减少层层嵌套。非 void 方法的每条路径都必须返回值。', '定义 Cost(int count)：count<=0 返回 0，否则返回 count*5。读取数量并输出结果。', 'int count = int.Parse(Console.ReadLine() ?? "0");\nConsole.WriteLine(Cost(count));\nint Cost(int count) { if (count <= 0) return 0; return count * 5; }', '', { tests: inputTests(['3\n','15\n'],['-2\n','0\n']), required: ['int Cost', 'return'] }),
      t('默认的治疗量', '可选参数', '参数可指定默认值，例如 int amount=2。调用时省略这个参数就使用默认值。可选参数放在必填参数之后。', '定义 Heal(int hp,int amount=2) 返回 hp+amount。分别输出 Heal(5) 和 Heal(5,4)。', 'Console.WriteLine(Heal(5));\nConsole.WriteLine(Heal(5, 4));\nint Heal(int hp, int amount = 2) { return hp + amount; }', '7\n9\n', { required: ['int amount = 2'] }),
      t('组合两个小方法', '方法调用方法', '一个方法可以调用另一个。计算伤害与更新生命是两个不同职责。', '读取 hp、attack、defense。Damage 至少返回 1；Hit 调用 Damage，并将剩余生命限制为 0 以上。输出 Hit 的结果。', 'int hp = int.Parse(Console.ReadLine() ?? "0");\nint attack = int.Parse(Console.ReadLine() ?? "0");\nint defense = int.Parse(Console.ReadLine() ?? "0");\nConsole.WriteLine(Hit(hp, attack, defense));\nint Damage(int a, int d) { return Math.Max(1, a - d); }\nint Hit(int hp, int a, int d) { return Math.Max(0, hp - Damage(a, d)); }', '', { tests: inputTests(['10\n8\n3\n','5\n'],['2\n9\n0\n','0\n']), required: ['int Damage', 'int Hit'] }),
      t('章节试炼：独立的战斗函数', '方法与循环整合', '方法内部也可以用循环。把战斗放进 Fight，主流程只负责读取输入和显示结果。', '输入敌人 hp 和每轮 damage（大于 0）。Fight 返回击败敌人需要的轮数；hp<=0 时为 0。', 'int hp = int.Parse(Console.ReadLine() ?? "0");\nint damage = int.Parse(Console.ReadLine() ?? "1");\nConsole.WriteLine(Fight(hp, damage));\nint Fight(int hp, int damage) { int rounds = 0; while (hp > 0) { hp -= damage; rounds++; } return rounds; }', '', { tests: inputTests(['10\n4\n','3\n'],['0\n3\n','0\n'],['8\n4\n','2\n']), required: ['int Fight', 'while'] })
    ]
  },
  {
    id: 'cs06', title: '星图档案', subtitle: '数组、集合与角色对象',
    introduction: '数组把同类型的多个值放在一起，索引从 0 开始。List<T> 的长度可以变化，Dictionary<TKey,TValue> 按键查询。class 将相关数据与行为组织成对象；new 创建一个实例。C# 类是引用类型，两个变量可能指向同一个对象。',
    lessons: [
      t('三瓶药水', '数组与索引', 'int[] values = { 2, 5, 8 }; 创建三个整数。values[0] 是第一个，Length 是元素数量。', '创建数组 {3,6,9}，输出第一个值，再输出数组长度。', 'int[] potions = { 3, 6, 9 };\nConsole.WriteLine(potions[0]);\nConsole.WriteLine(potions.Length);', '3\n3\n', { required: ['int[]', '.Length'] }),
      t('改变一个格子', '数组赋值', 'items[index] = value 修改指定元素，不需要重新创建数组。索引必须小于 Length。', '数组初始 {1,2,3}。将索引 1 改成 7，然后逐行输出全部元素。', 'int[] items = { 1, 2, 3 };\nitems[1] = 7;\nfor (int i = 0; i < items.Length; i++) Console.WriteLine(items[i]);', '1\n7\n3\n', { required: ['[1] ='] }),
      t('遍历伤害记录', 'foreach', 'foreach (int value in values) 会依次读取每个元素，不需要自己维护索引。', '创建 {4,2,7} 数组，用 foreach 累加，输出总伤害。', 'int[] hits = { 4, 2, 7 };\nint sum = 0;\nforeach (int hit in hits) sum += hit;\nConsole.WriteLine(sum);', '13\n', { required: ['foreach'] }),
      t('拆分背包清单', 'Split', 'text.Split(",") 按逗号拆成字符串数组。Trim 可以去掉每项两端的空格。', '读取逗号分隔的物品名，逐行输出每项去掉首尾空格后的名字。', 'string[] items = (Console.ReadLine() ?? "").Split(",");\nforeach (string item in items) Console.WriteLine(item.Trim());', '', { tests: inputTests(['key, potion\n','key\npotion\n'],['sword\n','sword\n']), required: ['Split'] }),
      t('会变大的背包', 'List<T>', 'List<string> 用于数量会变化的文字集合。Add 添加元素，Count 读取数量。', '创建空 List<string>，加入 sword 和 potion，先输出数量，再逐行输出内容。', 'var bag = new List<string>();\nbag.Add("sword");\nbag.Add("potion");\nConsole.WriteLine(bag.Count);\nforeach (string item in bag) Console.WriteLine(item);', '2\nsword\npotion\n', { required: ['List<string>', '.Add'] }),
      t('使用一瓶药水', 'Contains 与 Remove', 'Contains 检查是否存在；Remove 删除第一个匹配元素并返回是否成功。', '背包为 potion、key、potion。删除一瓶 potion，输出剩余数量及是否仍有 potion。', 'var bag = new List<string> { "potion", "key", "potion" };\nbag.Remove("potion");\nConsole.WriteLine(bag.Count);\nConsole.WriteLine(bag.Contains("potion"));', '2\nTrue\n', { required: ['Remove', 'Contains'] }),
      t('物品价格表', 'Dictionary', 'Dictionary<string,int> 按名字查找价格。TryGetValue 在键不存在时返回 false，避免直接索引抛异常。', '价格表 key=3、potion=5。输入物品名，存在时输出价格，否则输出 Unknown。', 'var prices = new Dictionary<string, int> { ["key"] = 3, ["potion"] = 5 };\nstring item = Console.ReadLine() ?? "";\nif (prices.TryGetValue(item, out int price)) Console.WriteLine(price);\nelse Console.WriteLine("Unknown");', '', { tests: inputTests(['potion\n','5\n'],['key\n','3\n'],['sword\n','Unknown\n']), required: ['Dictionary', 'TryGetValue'] }),
      t('绘制二维地图', '二维数组', 'char[,] 表示二维字符数组，map[row,column] 指定行和列。GetLength(0) 是行数，GetLength(1) 是列数。', "创建两行地图 {'@','.'} 和 {'#','E'}，用两层循环输出 @. 与 #E。", "char[,] map = { { '@', '.' }, { '#', 'E' } };\nfor (int r = 0; r < map.GetLength(0); r++) {\n for (int c = 0; c < map.GetLength(1); c++) Console.Write(map[r,c]);\n Console.WriteLine();\n}", '@.\n#E\n', { required: ['char[,]', 'GetLength'] }),
      t('角色档案', 'class 与字段', 'class Hero { public int Hp; } 定义一种角色。new Hero() 创建对象；hero.Hp 访问这个对象的字段。类型声明放在顶层语句之后。', '定义 Hero，包含 Name 和 Hp。创建名字为 Mira、生命为 20 的角色，输出 Mira:20。', 'var hero = new Hero { Name = "Mira", Hp = 20 };\nConsole.WriteLine($"{hero.Name}:{hero.Hp}");\nclass Hero { public string Name = ""; public int Hp; }', 'Mira:20\n', { required: ['class Hero', 'new Hero'] }),
      t('创建完整的角色', '构造方法与属性', '构造方法与类同名，没有返回类型，在 new 时执行。public int Hp { get; set; } 是可读写属性。', '定义 Hero(string name,int hp) 构造方法和 Name、Hp 属性。读取名字及生命，创建角色并输出 名字:生命。', 'string name = Console.ReadLine() ?? "Guest";\nint hp = int.Parse(Console.ReadLine() ?? "0");\nvar hero = new Hero(name, hp);\nConsole.WriteLine($"{hero.Name}:{hero.Hp}");\nclass Hero {\n public string Name { get; set; }\n public int Hp { get; set; }\n public Hero(string name, int hp) { Name = name; Hp = hp; }\n}', '', { tests: inputTests(['Mira\n20\n','Mira:20\n'],['Kai\n5\n','Kai:5\n']), required: ['public Hero(', 'get;'] }),
      t('对象真的改变了', '引用类型', '把 Hero 交给方法时，方法能修改同一个对象的属性。这不同于先前 int 参数的值副本。', '创建 Hp=10 的 Hero。Hurt(Hero hero) 将其 Hp 减 3，调用后输出原角色 Hp。', 'var hero = new Hero { Hp = 10 };\nHurt(hero);\nConsole.WriteLine(hero.Hp);\nvoid Hurt(Hero hero) { hero.Hp -= 3; }\nclass Hero { public int Hp { get; set; } }', '7\n', { required: ['class Hero', 'void Hurt'] }),
      t('章节试炼：角色自我治疗', '对象的方法', '实例方法可以直接访问自身属性。将保护规则放进方法，调用者就不会忘记生命上限。', 'Hero 的 Hp 初始 4、MaxHp 为 10。Heal(int amount) 加血但不超上限。读取治疗量，调用后输出 Hp。', 'var hero = new Hero();\nhero.Heal(int.Parse(Console.ReadLine() ?? "0"));\nConsole.WriteLine(hero.Hp);\nclass Hero {\n public int Hp { get; private set; } = 4;\n public int MaxHp { get; } = 10;\n public void Heal(int amount) { Hp = Math.Min(MaxHp, Hp + amount); }\n}', '', { tests: inputTests(['3\n','7\n'],['20\n','10\n']), required: ['class Hero', 'void Heal'] })
    ]
  },
  {
    id: 'cs07', title: '王冠试炼', subtitle: '组合成可玩的文字 RPG',
    introduction: '最终章把数据、方法、输入和循环连成游戏。先分别实现移动、物品、战斗和结局，再组合。游戏状态必须有唯一来源：不要只输出“获得钥匙”，还要真正改变 HasKey。先用短命令序列测试，再测试失败和退出路线。',
    lessons: [
      t('游戏的三个阶段', 'enum', 'enum 为一组状态取名字，避免用不明意义的数字。枚举成员可用 == 比较。', '定义 GameState { Exploring, Victory, Defeat }。输入 win 输出 Victory，lose 输出 Defeat，其余输出 Exploring。', 'string cmd = Console.ReadLine() ?? "";\nGameState state = cmd == "win" ? GameState.Victory : cmd == "lose" ? GameState.Defeat : GameState.Exploring;\nConsole.WriteLine(state);\nenum GameState { Exploring, Victory, Defeat }', '', { tests: inputTests(['win\n','Victory\n'],['lose\n','Defeat\n'],['look\n','Exploring\n']), required: ['enum GameState'] }),
      t('移动一步', '坐标更新', '移动先算候选位置，再检查边界，最后决定是否更新状态。不要先越界再访问地图。', '位置 x=0，地图为 0 到 2。读取多行 right 或 left；每次输出更新后的位置，越界则保持原位。', 'int x = 0;\nstring? cmd;\nwhile ((cmd = Console.ReadLine()) != null) {\n int next = x + (cmd == "right" ? 1 : cmd == "left" ? -1 : 0);\n if (next >= 0 && next <= 2) x = next;\n Console.WriteLine(x);\n}', '', { tests: inputTests(['left\nright\nright\nright\n','0\n1\n2\n2\n'],['right\nleft\n','1\n0\n']) }),
      t('只能捡一次的钥匙', '幂等的拾取', '拾取成功后要修改状态。第二次尝试不能重复增加物品。', '初始没有钥匙。逐行读取 take；第一次输出 Key taken，以后输出 Already taken。其他输入不输出。', 'bool hasKey = false;\nstring? cmd;\nwhile ((cmd = Console.ReadLine()) != null) {\n if (cmd != "take") continue;\n Console.WriteLine(hasKey ? "Already taken" : "Key taken");\n hasKey = true;\n}', '', { tests: inputTests(['take\ntake\n','Key taken\nAlready taken\n'],['look\ntake\n','Key taken\n']), }),
      t('会消耗钥匙的门', '资源消耗', '开门需要钥匙且会消耗它。显示反馈和修改资源必须属于同一次动作。', '初始有一把钥匙。每行 open：有钥匙输出 Opened 并消耗；没有钥匙输出 Locked。', 'bool hasKey = true;\nstring? cmd;\nwhile ((cmd = Console.ReadLine()) != null) {\n if (cmd == "open") { Console.WriteLine(hasKey ? "Opened" : "Locked"); hasKey = false; }\n}', '', { tests: inputTests(['open\nopen\n','Opened\nLocked\n'],['wait\nopen\n','Opened\n']) }),
      t('药水与生命', '多个状态同步', '一次治疗同时涉及药水数量和生命值。用完后再次请求，需要输出失败反馈且不能加血。', 'hp=5，只有一瓶药水。每行 heal：有药时加 4（上限10），输出 HP: 数值；无药输出 Empty。', 'int hp = 5, potions = 1;\nstring? cmd;\nwhile ((cmd = Console.ReadLine()) != null) {\n if (cmd != "heal") continue;\n if (potions == 0) Console.WriteLine("Empty");\n else { potions--; hp = Math.Min(10, hp + 4); Console.WriteLine($"HP: {hp}"); }\n}', '', { tests: inputTests(['heal\nheal\n','HP: 9\nEmpty\n'],['heal\n','HP: 9\n']) }),
      t('敌人的反击', '战斗顺序', '玩家先攻击。如果敌人已经倒下，它就不应再反击。顺序不同，结局可能不同。', '输入玩家 hp、敌人 hp。玩家每轮伤害4，存活的敌人反击3。战斗结束输出玩家剩余 hp（最低0）与 Win 或 Lose，各一行。', 'int hp = int.Parse(Console.ReadLine() ?? "0");\nint enemy = int.Parse(Console.ReadLine() ?? "0");\nwhile (hp > 0 && enemy > 0) {\n enemy -= 4;\n if (enemy > 0) hp = Math.Max(0, hp - 3);\n}\nConsole.WriteLine(hp);\nConsole.WriteLine(hp > 0 ? "Win" : "Lose");', '', { tests: inputTests(['10\n8\n','7\nWin\n'],['2\n10\n','0\nLose\n'],['2\n4\n','2\nWin\n']) }),
      t('胜利奖励仅一次', '防止重复奖励', '将敌人是否已败记录下来，不能因为再次收到 fight 命令就重复发放奖励。', '初始 gold=0。第一次 fight 击败敌人获得5金币；以后 fight 不增加。每次 fight 输出金币数。', 'int gold = 0;\nbool defeated = false;\nstring? cmd;\nwhile ((cmd = Console.ReadLine()) != null) {\n if (cmd != "fight") continue;\n if (!defeated) { gold += 5; defeated = true; }\n Console.WriteLine(gold);\n}', '', { tests: inputTests(['fight\nfight\n','5\n5\n'],['look\nfight\n','5\n']) }),
      t('NPC 的两种对话', '由状态驱动文本', '对话内容应该读取当前状态，而不是永远显示同一句话。', '没有钥匙时 talk 输出 Find the key；take 获得钥匙且不输出；有钥匙后 talk 输出 Open the gate。', 'bool hasKey = false;\nstring? cmd;\nwhile ((cmd = Console.ReadLine()) != null) {\n if (cmd == "take") hasKey = true;\n if (cmd == "talk") Console.WriteLine(hasKey ? "Open the gate" : "Find the key");\n}', '', { tests: inputTests(['talk\ntake\ntalk\n','Find the key\nOpen the gate\n'],['take\ntalk\n','Open the gate\n']) }),
      t('安全退出的游戏', '退出与输入结束', '游戏必须处理 quit 和输入耗尽。读取 null 后继续循环会产生无限循环。', '逐行读取命令；quit 输出 Bye 并立即结束；其他命令输出 Continue。自然读到输入结束时输出 End。', 'bool quit = false;\nstring? cmd;\nwhile ((cmd = Console.ReadLine()) != null) {\n if (cmd == "quit") { Console.WriteLine("Bye"); quit = true; break; }\n Console.WriteLine("Continue");\n}\nif (!quit) Console.WriteLine("End");', '', { tests: inputTests(['look\nquit\nlook\n','Continue\nBye\n'],['look\n','Continue\nEnd\n'],['','End\n']) }),
      t('把角色状态放在一起', '状态对象', '集中保存 Hp、Gold 和 HasKey，让不同方法修改同一份数据。最终项目会沿用这种写法。', '创建 Hero，Hp=10、Gold=0、HasKey=false。依次处理 hurt（生命减3，最低0）、loot（金币加5）、take（有钥匙）；最后输出 Hp Gold HasKey，以空格分隔。', 'var hero = new Hero();\nstring? cmd;\nwhile ((cmd = Console.ReadLine()) != null) {\n switch (cmd) {\n case "hurt": hero.Hp = Math.Max(0, hero.Hp - 3); break;\n case "loot": hero.Gold += 5; break;\n case "take": hero.HasKey = true; break;\n }\n}\nConsole.WriteLine($"{hero.Hp} {hero.Gold} {hero.HasKey}");\nclass Hero { public int Hp = 10; public int Gold = 0; public bool HasKey = false; }', '', { tests: inputTests(['hurt\nloot\ntake\n','7 5 True\n'],['','10 0 False\n']), required: ['class Hero'] }),
      t('毕业前演练：小竞技场', '对象、方法和主循环', '主循环只读取命令；把攻击放进 Attack 方法。角色状态由对象保存，输出由主流程统一组织。', 'Hero.Hp=10。每行 hit 调用 Attack(Hero)，造成3伤害且不低于0，随后输出 HP: 数值；死亡时输出 Defeat 并结束。quit 输出 Bye 并结束。', 'var hero = new Hero();\nstring? cmd;\nwhile ((cmd = Console.ReadLine()) != null) {\n if (cmd == "quit") { Console.WriteLine("Bye"); break; }\n if (cmd != "hit") continue;\n Attack(hero); Console.WriteLine($"HP: {hero.Hp}");\n if (hero.Hp == 0) { Console.WriteLine("Defeat"); break; }\n}\nvoid Attack(Hero hero) { hero.Hp = Math.Max(0, hero.Hp - 3); }\nclass Hero { public int Hp = 10; }', '', { tests: inputTests(['hit\nquit\n','HP: 7\nBye\n'],['hit\nhit\nhit\nhit\nhit\n','HP: 7\nHP: 4\nHP: 1\nHP: 0\nDefeat\n']), required: ['class Hero', 'void Attack'] })
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
    public int Hp = 12;
    public int Gold = 0;
    public int Potions = 1;
    public bool HasKey = false;
}`;
chapters[6].lessons.push(t(
  '毕业项目：王冠远征', '可玩的控制台文字 RPG',
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
    demoInput: 'look\nright\nfight\ntake\nheal\nright\nopen\n',
    starter: prelude + '// 将你前面练习过的角色、方法和命令循环组合起来。\nConsole.WriteLine("Crown Quest");\n\n// TODO: 角色状态、地图、命令循环、战斗与结局\n'
  }
));

// Keep IDs stable; lesson order is used only for navigation, never as a save key.
export const lessons = chapters.flatMap((chapter, chapterIndex) => chapter.lessons.map((lesson, localIndex) => Object.assign(lesson, {
  id: `${chapter.id}-${String(localIndex + 1).padStart(2, '0')}`,
  chapterId: chapter.id, chapterIndex, localIndex,
  starter: lesson.starter ?? prelude + '// 先阅读知识说明，再在这里完成任务。\n',
  hints: [
    `先确定本题要使用的知识点：${lesson.topic}。`,
    lesson.tests.some(test => test.input) ? '每次 ReadLine 读取一行。先把输入存入变量，再计算、更新状态，最后输出。' : '按任务要求逐项声明数据和执行动作；检查大小写、分号和输出顺序。',
    '用示例输入手算一次结果。遇到循环，检查初始值、继续条件和每轮更新；遇到分支，检查边界是否包含等号。'
  ],
  minutes: chapterIndex < 2 ? 8 : chapterIndex < 6 ? 12 : localIndex === 11 ? 45 : 15
})));
