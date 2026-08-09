import { buildChapter, cProgram } from './lesson-factory.mjs';

const meta = {
  id: 'day02', day: 2, numeral: 'Ⅱ', rune: '第二枚符文', title: '黑铁集市',
  subtitle: '数据类型、赋值、四则运算与类型转换',
  description: '让数字在铁砧与金币之间真正发生变化。',
  scene: '黑铁集市的烟囱喷出赤红火星，商贩的算盘像雨点一样作响。'
};

const p = body => cProgram(body);

export const day02 = buildChapter(meta, [
  { title:'铁匠的开刃费', knowledge:'减法与赋值', task:'你有30金币，开刃花12金币；用变量算出余额。', expected:'Gold: 18', must:[[[/\b[A-Za-z_]\w*\s*=\s*[A-Za-z_]\w*\s*-\s*[A-Za-z_]\w*/,/\b[A-Za-z_]\w*\s*-=\s*[A-Za-z_]\w*/], '请用变量减法或 -= 计算余额。']], solution:p(String.raw`    int gold = 30, cost = 12;
    gold = gold - cost;
    printf("Gold: %d\n", gold);`) },
  { title:'锈剑重铸', knowledge:'连续加法', task:'基础攻击7，锤炼增加4，火焰符文增加3；计算最终攻击。', expected:'Final ATK: 14', solution:p(String.raw`    int atk = 7, hammer = 4, rune = 3;
    int final_atk = atk + hammer + rune;
    printf("Final ATK: %d\n", final_atk);`) },
  { title:'巷口伏击', knowledge:'逐次减法', task:'45点生命连续承受6、8、5点伤害，逐次修改HP。', expected:'HP: 26', solution:p(String.raw`    int hp = 45;
    hp -= 6; hp -= 8; hp -= 5;
    printf("HP: %d\n", hp);`) },
  { title:'月泉药剂', knowledge:'+= 复合赋值', task:'生命从21恢复18点，同时报告治疗前后。', expected:['Before: 21','After: 39'], must:[[/\+=\s*18/, '请使用 += 完成治疗。']], minLines:2, solution:p(String.raw`    int hp = 21;
    printf("Before: %d\n", hp);
    hp += 18;
    printf("After: %d\n", hp);`) },
  { title:'盾牌真正挡住了多少', knowledge:'表达式', task:'攻击14、护甲5、生命40，计算实际伤害和剩余生命。', expected:['Damage: 9','HP: 31'], solution:p(String.raw`    int attack = 14, defense = 5, hp = 40;
    int damage = attack - defense;
    hp -= damage;
    printf("Damage: %d\nHP: %d\n", damage, hp);`) },
  { title:'三人分赏金', knowledge:'整数 / 与 %', task:'100金币由3人平分，输出每人所得和余数。', expected:['Each: 33','Remain: 1'], must:[[/\b[A-Za-z_]\w*\s*\/\s*[A-Za-z_]\w*/, '请使用整数除法，变量名称可以自定。'], [/\b[A-Za-z_]\w*\s*%\s*[A-Za-z_]\w*/, '请使用取余运算，变量名称可以自定。']], solution:p(String.raw`    int gold = 100, team = 3;
    printf("Each: %d\nRemain: %d\n", gold / team, gold % team);`) },
  { title:'箭袋清点', knowledge:'+= 与 -=', task:'20支箭，依次用4、捡7、再用3，计算最终数量。', expected:'Arrows: 20', solution:p(String.raw`    int arrows = 20;
    arrows -= 4; arrows += 7; arrows -= 3;
    printf("Arrows: %d\n", arrows);`) },
  { title:'巨人酒馆的双倍日', knowledge:'*= 与 /=', task:'6金币的麦酒先翻倍，再恢复原价，输出两个阶段。', expected:['Double: 12','Normal: 6'], solution:p(String.raw`    int price = 6;
    price *= 2; printf("Double: %d\n", price);
    price /= 2; printf("Normal: %d\n", price);`) },
  { title:'奔狼坐骑的路程', knowledge:'乘法与累加', task:'每小时18公里跑3小时，再传送25公里，算总路程。', expected:['Run: 54','Total: 79'], solution:p(String.raw`    int speed = 18, hours = 3;
    int distance = speed * hours;
    printf("Run: %d\n", distance);
    distance += 25;
    printf("Total: %d\n", distance);`) },
  { title:'法师的半瓶魔药', knowledge:'整数除法与强制转换', task:'5瓶药分给2人，分别输出整瓶结果和精确结果。', expected:['Whole: 2','Exact: 2.5'], must:[[/\((?:float|double)\)/, '请使用 float 或 double 强制类型转换。']], solution:p(String.raw`    int bottles = 5, mages = 2;
    printf("Whole: %d\n", bottles / mages);
    printf("Exact: %.1f\n", (float)bottles / mages);`) },
  { title:'暴击水晶', knowledge:'float 运算', task:'基础伤害16乘1.5倍，输出一位小数。', expected:'Critical: 24.0', solution:p(String.raw`    int base = 16;
    float rate = 1.5f, damage = base * rate;
    printf("Critical: %.1f\n", damage);`) },
  { title:'交换的传送门', knowledge:'临时变量交换', task:'红门2、蓝门9，只借助一个临时变量交换编号。', expected:['Before: 2 9','After: 9 2'], solution:p(String.raw`    int red = 2, blue = 9, temp;
    printf("Before: %d %d\n", red, blue);
    temp = red; red = blue; blue = temp;
    printf("After: %d %d\n", red, blue);`) },
  { title:'盗贼的开关机关', knowledge:'状态切换', task:'火把初始为0，用 1-torch 连续切换两次。', expected:['Switch 1: 1','Switch 2: 0'], must:[[/1\s*-\s*torch/, '请使用 1 - torch 切换状态。']], solution:p(String.raw`    int torch = 0;
    torch = 1 - torch; printf("Switch 1: %d\n", torch);
    torch = 1 - torch; printf("Switch 2: %d\n", torch);`) },
  { title:'王都税票', knowledge:'整数运算', task:'盔甲87金币，税为价格十分之一取整；输出税、总价和100金币的找零。', expected:['Tax: 8','Total: 95','Change: 5'], solution:p(String.raw`    int price = 87, tax = price / 10;
    int total = price + tax;
    printf("Tax: %d\nTotal: %d\nChange: %d\n", tax, total, 100 - total);`) },
  { title:'三枚戒指的优先级陷阱', knowledge:'运算优先级', task:'令base=5、gem=3，比较 base+gem*2 与 (base+gem)*2。', expected:['First: 11','Second: 16'], solution:p(String.raw`    int base = 5, gem = 3;
    printf("First: %d\n", base + gem * 2);
    printf("Second: %d\n", (base + gem) * 2);`) },
  { title:'经验值阶梯', knowledge:'long 与累加', task:'经验90，依次获得35和60，用long保存最终值。', expected:'EXP: 185', must:[[/\blong\s+/, '请使用 long 保存经验。']], solution:p(String.raw`    long exp = 90;
    exp += 35; exp += 60;
    printf("EXP: %ld\n", exp);`) },
  { title:'古老天平', knowledge:'求和与移除', task:'剑8、盾11、药水2，输出总重与拿掉盾后的重量。', expected:['Total: 21','Without shield: 10'], solution:p(String.raw`    int sword = 8, shield = 11, potion = 2;
    int total = sword + shield + potion;
    printf("Total: %d\nWithout shield: %d\n", total, total - shield);`) },
  { title:'符文坐标校准', knowledge:'坐标赋值', task:'从(2,4)右移2、上移1，再传送到(10,10)，报告三个阶段。', expected:['Start: 2,4','Move: 4,5','Warp: 10,10'], minLines:3, solution:p(String.raw`    int x = 2, y = 4;
    printf("Start: %d,%d\n", x, y);
    x += 2; y += 1; printf("Move: %d,%d\n", x, y);
    x = 10; y = 10; printf("Warp: %d,%d\n", x, y);`) },
  { title:'战后结算卷轴', knowledge:'组合表达式', task:'基础攻10、武器5、增益3、敌防7、生命40，算最终攻击、伤害和战后生命。', expected:['ATK: 18','Damage: 11','HP: 29'], solution:p(String.raw`    int base = 10, weapon = 5, buff = 3, defense = 7, hp = 40;
    int atk = base + weapon + buff, damage = atk - defense;
    hp -= damage;
    printf("ATK: %d\nDamage: %d\nHP: %d\n", atk, damage, hp);`) },
  { title:'章节试炼：黑铁竞技场', knowledge:'三回合变量战斗', task:'用变量完成固定三回合战斗，并逐回合输出双方生命。', expected:['Round 1 Hero: 37 Monster: 32','Round 2 Hero: 34 Monster: 24','Round 3 Hero: 31 Monster: 16'], minLines:3, solution:p(String.raw`    int hero_hp = 40, hero_atk = 10, hero_def = 3;
    int monster_hp = 40, monster_atk = 6, monster_def = 2;
    int hero_damage = hero_atk - monster_def;
    int monster_damage = monster_atk - hero_def;
    monster_hp -= hero_damage; hero_hp -= monster_damage;
    printf("Round 1 Hero: %d Monster: %d\n", hero_hp, monster_hp);
    monster_hp -= hero_damage; hero_hp -= monster_damage;
    printf("Round 2 Hero: %d Monster: %d\n", hero_hp, monster_hp);
    monster_hp -= hero_damage; hero_hp -= monster_damage;
    printf("Round 3 Hero: %d Monster: %d\n", hero_hp, monster_hp);`) }
]);
