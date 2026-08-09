import { buildChapter, cProgram } from './lesson-factory.mjs';

const meta = {
  id:'day03', day:3, numeral:'Ⅲ', rune:'第三枚符文', title:'岔路森林',
  subtitle:'if、逻辑运算、三目运算与 switch', description:'让每一次选择都通向真实的剧情。',
  scene:'岔路森林的枝叶遮住月光，每一条路都在低声许诺不同的结局。'
};
const p = body => cProgram(body);

export const day03 = buildChapter(meta, [
  { title:'会呼吸的荆棘门', knowledge:'if-else', task:'银钥匙变量为1时开门，否则被荆棘阻挡。', expected:'The gate opens.', must:[[/\bif\s*\(/,'请使用 if。'],[/\belse\b/,'请写出 else 分支。']], solution:p(String.raw`    int has_silver_key = 1;
    if (has_silver_key) printf("The gate opens.\n");
    else printf("Thorns seize your wrist.\n");`) },
  { title:'悬崖边的一点生命', knowledge:'比较运算', task:'根据hp是否大于0输出 Alive 或 Fallen。', expected:'Alive', solution:p(String.raw`    int hp = 1;
    if (hp > 0) printf("Alive\n");
    else printf("Fallen\n");`) },
  { title:'林中医师的诊断', knowledge:'else-if 阶梯', task:'hp=24时按健康、受伤、濒危、倒下四档诊断。', expected:'Critical', must:[[/else\s+if/,'请使用 else if 划分区间。']], solution:p(String.raw`    int hp = 24;
    if (hp > 70) printf("Healthy\n");
    else if (hp > 30) printf("Wounded\n");
    else if (hp > 0) printf("Critical\n");
    else printf("Fallen\n");`) },
  { title:'无法破防的石像鬼', knowledge:'最低伤害分支', task:'攻击8、防御12时，实际伤害最低仍为1。', expected:'Damage: 1', solution:p(String.raw`    int attack = 8, defense = 12;
    int damage = attack > defense ? attack - defense : 1;
    printf("Damage: %d\n", damage);`) },
  { title:'两座摇晃的吊桥', knowledge:'多条件判断', task:'队伍重60，两桥承重80和50，输出每座桥是否可走。', expected:['Bridge A: safe','Bridge B: unsafe'], solution:p(String.raw`    int weight = 60, a = 80, b = 50;
    printf("Bridge A: %s\n", a >= weight ? "safe" : "unsafe");
    printf("Bridge B: %s\n", b >= weight ? "safe" : "unsafe");`) },
  { title:'毒雾警报', knowledge:'逻辑或 ||', task:'中毒或生命低于20时发出 DANGER。', expected:'DANGER', must:[[/\|\|/,'请使用逻辑或 ||。']], solution:p(String.raw`    int poisoned = 0, hp = 16;
    if (poisoned || hp < 20) printf("DANGER\n");
    else printf("Safe\n");`) },
  { title:'月光密道', knowledge:'逻辑与 &&', task:'同时持有月石且为夜晚，密道才出现。', expected:'Secret path appears.', must:[[/&&/,'请使用逻辑与 &&。']], solution:p(String.raw`    int has_moonstone = 1, is_night = 1;
    if (has_moonstone && is_night) printf("Secret path appears.\n");
    else printf("Only cold stone.\n");`) },
  { title:'没有火把的洞穴', knowledge:'逻辑非 !', task:'has_torch为0时报告黑暗中的威胁。', expected:'Something approaches.', must:[[/!\s*has_torch/,'请使用 !has_torch。']], solution:p(String.raw`    int has_torch = 0;
    if (!has_torch) printf("Something approaches.\n");`) },
  { title:'哥布林商人的砍价', knowledge:'嵌套条件', task:'20金币、药价12、背包有空位时，用嵌套if依次检查金币与空位，完成购买并更新数值。', expected:['Bought potion','Gold: 8 Potions: 1'], must:[[/if\s*\([^)]*\)\s*\{[\s\S]*if\s*\(/,'请使用嵌套 if，先检查金币，再检查背包空位。']], solution:p(String.raw`    int gold = 20, price = 12, slots = 1, potions = 0;
    if (gold >= price) {
        if (slots > 0) {
            gold -= price; potions++;
            printf("Bought potion\nGold: %d Potions: %d\n", gold, potions);
        } else {
            printf("Backpack full\n");
        }
    } else {
        printf("Not enough gold\n");
    }`) },
  { title:'命运硬币', knowledge:'三目运算符', task:'luck=63时用三目运算选择幸运路线。', expected:'Lucky route', must:[[/\?[\s\S]*:/,'请使用三目运算符，分支写法和变量名称可以自定。']], solution:p(String.raw`    int luck = 63;
    const char *route = luck >= 50 ? "Lucky route" : "Cursed route";
    printf("%s\n", route);`) },
  { title:'猫头鹰的方向谜语', knowledge:'switch 字符分支', task:'方向字符d应翻译为 East。', expected:'East', must:[[/\bswitch\s*\(/,'请使用 switch。']], solution:p(String.raw`    char direction = 'd';
    switch (direction) {
        case 'w': printf("North\n"); break;
        case 'a': printf("West\n"); break;
        case 's': printf("South\n"); break;
        case 'd': printf("East\n"); break;
        default: printf("You hit a tree.\n");
    }`) },
  { title:'四季祭坛', knowledge:'switch 整数分支', task:'season=4时唤醒冬之精灵，并保留default。', expected:'Winter spirit', must:[[/\bdefault\s*:/,'请保留 default 分支。']], solution:p(String.raw`    int season = 4;
    switch (season) {
        case 1: printf("Spring spirit\n"); break;
        case 2: printf("Summer spirit\n"); break;
        case 3: printf("Autumn spirit\n"); break;
        case 4: printf("Winter spirit\n"); break;
        default: printf("The altar is silent.\n");
    }`) },
  { title:'双钥匙的王族宝箱', knowledge:'嵌套 if', task:'用嵌套if依次检查诅咒、金钥匙和银钥匙；全部满足时打开宝箱。', expected:'Royal chest opened.', must:[[/if\s*\([^)]*\)\s*\{[\s\S]*if\s*\(/,'请使用嵌套 if 逐层检查宝箱条件。']], solution:p(String.raw`    int cursed = 0, gold_key = 1, silver_key = 1;
    if (!cursed) {
        if (gold_key) {
            if (silver_key) printf("Royal chest opened.\n");
            else printf("Missing silver key.\n");
        } else {
            printf("Missing gold key.\n");
        }
    } else {
        printf("The chest is cursed.\n");
    }`) },
  { title:'伪装成旅人的狼人', knowledge:'嵌套角色判断', task:'角色标记N但满月为1时识破狼人。', expected:'Werewolf!', solution:p(String.raw`    char role = 'N'; int full_moon = 1;
    if (role == 'N') {
        if (full_moon) printf("Werewolf!\n");
        else printf("Harmless traveler.\n");
    } else printf("Enemy.\n");`) },
  { title:'骰子审判', knowledge:'边界条件', task:'roll=20时判定大成功，同时覆盖其余区间。', expected:'Critical success', solution:p(String.raw`    int roll = 20;
    if (roll == 1) printf("Critical failure\n");
    else if (roll == 20) printf("Critical success\n");
    else if (roll <= 9) printf("Failure\n");
    else printf("Success\n");`) },
  { title:'地图边缘的风', knowledge:'范围与边缘', task:'在10×6地图中判断坐标(0,3)属于边缘。', expected:'Edge tile', solution:p(String.raw`    int x = 0, y = 3;
    if (x < 0 || x >= 10 || y < 0 || y >= 6) printf("Outside\n");
    else if (x == 0 || x == 9 || y == 0 || y == 5) printf("Edge tile\n");
    else printf("Inside\n");`) },
  { title:'三种战斗姿态', knowledge:'switch 修改状态', task:'stance=2时进入防御姿态并输出攻击、防御、速度。', expected:['Defend','ATK: 6 DEF: 14 SPD: 5'], solution:p(String.raw`    int stance = 2, atk = 10, def = 8, speed = 5;
    switch (stance) {
        case 1: atk += 4; printf("Attack\n"); break;
        case 2: atk -= 4; def += 6; printf("Defend\n"); break;
        case 3: speed += 8; printf("Escape\n"); break;
        default: printf("Hesitate\n");
    }
    printf("ATK: %d DEF: %d SPD: %d\n", atk, def, speed);`) },
  { title:'守林人的对话选择', knowledge:'菜单分支', task:'choice=1时说出真相，输出守林人的回应。', expected:'The ranger lowers his bow.', solution:p(String.raw`    int choice = 1;
    switch (choice) {
        case 1: printf("The ranger lowers his bow.\n"); break;
        case 2: printf("The ranger takes your gold.\n"); break;
        case 3: printf("The forest turns hostile.\n"); break;
        default: printf("The ranger waits.\n");
    }`) },
  { title:'胜利真的到来了吗', knowledge:'组合胜负条件', task:'boss_hp=0、player_hp=12时判定胜利。', expected:'Victory', solution:p(String.raw`    int boss_hp = 0, player_hp = 12;
    if (boss_hp <= 0 && player_hp > 0) printf("Victory\n");
    else if (boss_hp <= 0 && player_hp <= 0) printf("Pyrrhic victory\n");
    else if (player_hp <= 0) printf("Defeat\n");
    else printf("Battle continues\n");`) },
  { title:'章节试炼：迷雾中的五岔路', knowledge:'综合条件分支', task:'根据HP、火把、钥匙、天气和道路选择生成结局；默认配置应打开遗迹。', expected:['Ancient ruin opened','Ending: Rune found'], minLines:2, solution:p(String.raw`    int hp = 35, torch = 1, key = 1, storm = 0, road = 4;
    if (hp <= 0) printf("Forced retreat\nEnding: Fallen\n");
    else if (road == 1 && !storm) printf("Safe camp\nEnding: Rest\n");
    else if (road == 2) printf("Lost in swamp\nEnding: Mud\n");
    else if (road == 3 && !torch) printf("Werewolf ambush\nEnding: Fight\n");
    else if (road == 4 && key) printf("Ancient ruin opened\nEnding: Rune found\n");
    else printf("Forced retreat\nEnding: Unknown\n");`) }
]);
