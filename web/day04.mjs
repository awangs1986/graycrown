import { buildChapter, cProgram } from './lesson-factory.mjs';

const meta = {
  id:'day04', day:4, numeral:'Ⅳ', rune:'第四枚符文', title:'回声地牢',
  subtitle:'for、while、嵌套循环、break 与 continue', description:'把重复的脚步变成可靠的咒语。',
  scene:'回声地牢把一次脚步复制成百次，只有掌握循环的人才能分辨真正的出口。'
};
const p = body => cProgram(body);

export const day04 = buildChapter(meta, [
  { title:'十步长廊', knowledge:'for 循环', task:'从第1步走到第10步，每步输出 Step n。', expected:['Step 1','Step 10'], minLines:10, must:[[/\bfor\s*\(/,'请使用 for 循环。']], solution:p(String.raw`    for (int i = 1; i <= 10; i++) printf("Step %d: the echo follows...\n", i);`) },
  { title:'逐渐熄灭的火把', knowledge:'while 循环', task:'亮度从5降到0，随后输出 Darkness!。', expected:['Light: 5','Light: 0','Darkness!'], minLines:7, must:[[/\bwhile\s*\(/,'请使用 while 循环。']], solution:p(String.raw`    int light = 5;
    while (light >= 0) { printf("Light: %d\n", light); light--; }
    printf("Darkness!\n");`) },
  { title:'至少响一次的警钟', knowledge:'do-while', task:'即使alarm初始为0，也让警钟至少响一次。', expected:'Alarm rings once!', must:[[/\bdo\b[\s\S]*\bwhile\s*\(/,'请使用 do-while；循环体可以使用或省略花括号。']], solution:p(String.raw`    int alarm = 0;
    do { printf("Alarm rings once!\n"); alarm--; } while (alarm > 0);`) },
  { title:'石门倒计时', knowledge:'递减循环', task:'输出3、2、1倒计时，再打开石门。', expected:['3... 2... 1...','The gate opens!'], minLines:2, solution:p(String.raw`    for (int i = 3; i >= 1; i--) printf("%d... ", i);
    printf("\nThe gate opens!\n");`) },
  { title:'金币喷泉', knowledge:'循环累计', task:'喷泉6次依次吐出1到6枚金币，输出最终总数。', expected:['Wave 1: 1','Wave 6: 6','Total: 21'], minLines:7, solution:p(String.raw`    int total = 0;
    for (int i = 1; i <= 6; i++) { total += i; printf("Wave %d: %d\n", i, i); }
    printf("Total: %d\n", total);`) },
  { title:'毒液的五次心跳', knowledge:'break', task:'30点生命每轮失去4点，最多5轮，归零时提前停止。', expected:['Beat 1 HP: 26','Beat 5 HP: 10'], must:[[/\bbreak\s*;/,'请使用 break 处理提前结束。']], solution:p(String.raw`    int hp = 30;
    for (int beat = 1; beat <= 5; beat++) {
        hp -= 4; if (hp < 0) hp = 0;
        printf("Beat %d HP: %d\n", beat, hp);
        if (hp == 0) break;
    }`) },
  { title:'幽灵只在奇数层', knowledge:'continue', task:'遍历1到10层，跳过偶数层，只输出奇数层低语。', expected:['Ghost on floor 1','Ghost on floor 9'], minLines:5, must:[[/\bcontinue\s*;/,'请使用 continue。']], solution:p(String.raw`    for (int floor = 1; floor <= 10; floor++) {
        if (floor % 2 == 0) continue;
        printf("Ghost on floor %d\n", floor);
    }`) },
  { title:'找到真正的宝箱', knowledge:'查找与 break', task:'检查1到12号箱，7号是真宝箱；输出编号和检查次数。', expected:['Treasure: 7','Checked: 7'], solution:p(String.raw`    int checked = 0;
    for (int chest = 1; chest <= 12; chest++) {
        checked++;
        if (chest == 7) { printf("Treasure: %d\n", chest); break; }
    }
    printf("Checked: %d\n", checked);`) },
  { title:'刻画生命条', knowledge:'两个循环', task:'用7个#和3个-输出 [#######---]。', expected:'[#######---]', solution:p(String.raw`    printf("[");
    for (int i = 0; i < 7; i++) printf("#");
    for (int i = 0; i < 3; i++) printf("-");
    printf("]\n");`) },
  { title:'法师加载咒语', knowledge:'同一行循环输出', task:'输出 Casting、5个点和 Fireball!，保持同一行。', expected:'Casting..... Fireball!', solution:p(String.raw`    printf("Casting");
    for (int i = 0; i < 5; i++) printf(".");
    printf(" Fireball!\n");`) },
  { title:'地牢的砖墙', knowledge:'嵌套循环', task:'打印4行8列的实心#墙。', expected:'########', minLines:4, must:[[/\b(?:for|while)\s*\([^)]*\)[\s\S]*\b(?:for|while)\s*\(/,'请使用两层循环；for 和 while 均可。']], solution:p(String.raw`    for (int row = 0; row < 4; row++) {
        for (int col = 0; col < 8; col++) printf("#");
        printf("\n");
    }`) },
  { title:'空心密室', knowledge:'嵌套循环与边界', task:'打印5×9房间，四周#、内部点号。', expected:['#########','#.......#'], minLines:5, solution:p(String.raw`    for (int row = 0; row < 5; row++) {
        for (int col = 0; col < 9; col++)
            printf("%c", row == 0 || row == 4 || col == 0 || col == 8 ? '#' : '.');
        printf("\n");
    }`) },
  { title:'通往祭坛的星阶', knowledge:'三角形嵌套循环', task:'从1颗星打印到6颗星的台阶。', expected:['*','******'], minLines:6, solution:p(String.raw`    for (int row = 1; row <= 6; row++) {
        for (int col = 0; col < row; col++) printf("*");
        printf("\n");
    }`) },
  { title:'巡逻坐标表', knowledge:'二维遍历', task:'输出3行4列区域的所有(x,y)坐标。', expected:['(0,0)','(3,2)'], minLines:3, solution:p(String.raw`    for (int y = 0; y < 3; y++) {
        for (int x = 0; x < 4; x++) printf("(%d,%d) ", x, y);
        printf("\n");
    }`) },
  { title:'连击越来越痛', knowledge:'循环公式与总和', task:'5连击，第n击造成base+n，base=3，输出总伤害。', expected:['Hit 1: 4','Hit 5: 8','Total: 30'], minLines:6, solution:p(String.raw`    int base = 3, total = 0;
    for (int hit = 1; hit <= 5; hit++) {
        int damage = base + hit; total += damage;
        printf("Hit %d: %d\n", hit, damage);
    }
    printf("Total: %d\n", total);`) },
  { title:'亡灵复苏仪式', knowledge:'双层循环日志', task:'3具骷髅各苏醒尝试2次，输出完整日志。', expected:['Skeleton 1 Try 1','Skeleton 3 Try 2'], minLines:6, solution:p(String.raw`    for (int skeleton = 1; skeleton <= 3; skeleton++)
        for (int attempt = 1; attempt <= 2; attempt++)
            printf("Skeleton %d Try %d\n", skeleton, attempt);`) },
  { title:'魔法数字的阶乘封印', knowledge:'阶乘', task:'循环计算5!并逐次输出当前结果。', expected:['1! = 1','5! = 120'], minLines:5, solution:p(String.raw`    int result = 1;
    for (int n = 1; n <= 5; n++) { result *= n; printf("%d! = %d\n", n, result); }`) },
  { title:'不会永远运行的游戏循环', knowledge:'while(1) 与 break', task:'无限循环模拟回合，到第4回合打印原因并退出。', expected:['Round 1','Round 4','Exit: gate opened'], minLines:5, solution:p(String.raw`    int round = 0;
    while (1) {
        round++; printf("Round %d\n", round);
        if (round == 4) { printf("Exit: gate opened\n"); break; }
    }`) },
  { title:'螺旋楼梯的体力账', knowledge:'循环边界', task:'50体力，爬第n层消耗n，算最多完整层数和剩余体力。', expected:['Floors: 9','Stamina: 5'], solution:p(String.raw`    int stamina = 50, floor = 0;
    while (stamina >= floor + 1) { floor++; stamina -= floor; }
    printf("Floors: %d\nStamina: %d\n", floor, stamina);`) },
  { title:'章节试炼：回声竞技场', knowledge:'有上限的战斗循环', task:'英雄与魔像轮流攻击，最多20回合，输出胜负和回合数。', expected:['Round 1 Hero: 39 Golem: 28','Victory','Rounds: 5'], minLines:6, solution:p(String.raw`    int hero = 45, golem = 36, round = 0;
    int hero_damage = 8, golem_damage = 6;
    while (hero > 0 && golem > 0 && round < 20) {
        round++; golem -= hero_damage;
        if (golem > 0) hero -= golem_damage;
        if (hero < 0) hero = 0; if (golem < 0) golem = 0;
        printf("Round %d Hero: %d Golem: %d\n", round, hero, golem);
    }
    printf("%s\nRounds: %d\n", hero > 0 ? "Victory" : "Defeat", round);`) }
]);
