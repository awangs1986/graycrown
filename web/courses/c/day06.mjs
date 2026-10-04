import { buildChapter, cProgram } from './lesson-factory.mjs';

const meta = {
  id:'day06', day:6, numeral:'Ⅵ', rune:'第六枚符文', title:'星图遗迹',
  subtitle:'数组、字符串、二维地图、结构体与基础输入', description:'一次保存许多星光，并让地图真正移动。',
  scene:'星图遗迹的穹顶悬着成百上千颗记忆，每一组数据都等待被装进同一个容器。'
};
const p = (body, helpers='', headers='#include <stdio.h>') => cProgram(body, helpers, headers);

export const day06 = buildChapter(meta, [
  { title:'五颗星尘', knowledge:'一维数组', task:'用数组保存3、7、11、5、9，先打印第三颗，再循环打印全部。', expected:['Third: 11','All: 3 7 11 5 9'], must:[[/int\s+[A-Za-z_]\w*\s*\[\s*5\s*\]/,'请定义长度为5的int数组，数组名称可以自定。']], solution:p(String.raw`    int stars[5] = {3, 7, 11, 5, 9};
    printf("Third: %d\nAll:", stars[2]);
    for (int i = 0; i < 5; i++) printf(" %d", stars[i]);
    printf("\n");`) },
  { title:'被污染的水晶', knowledge:'数组修改', task:'数组4,-3,8,2中负数代表污染；将其修复为0。', expected:['Pollution at: 1','Fixed: 4 0 8 2'], solution:p(String.raw`    int energy[4] = {4, -3, 8, 2};
    for (int i = 0; i < 4; i++) if (energy[i] < 0) { printf("Pollution at: %d\n", i); energy[i] = 0; }
    printf("Fixed:"); for (int i = 0; i < 4; i++) printf(" %d", energy[i]); printf("\n");`) },
  { title:'伤害记录石板', knowledge:'数组统计', task:'统计六回合伤害5,9,4,12,7,11的总和、平均和最高值。', expected:['Total: 48','Average: 8.0','Max: 12'], solution:p(String.raw`    int damage[6] = {5, 9, 4, 12, 7, 11};
    int total = 0, max = damage[0];
    for (int i = 0; i < 6; i++) { total += damage[i]; if (damage[i] > max) max = damage[i]; }
    printf("Total: %d\nAverage: %.1f\nMax: %d\n", total, total / 6.0, max);`) },
  { title:'四方向星盘', knowledge:'平行数组', task:'用dx/dy数组记录上下左右，并逐项输出位移。', expected:['Up: 0,-1','Down: 0,1','Left: -1,0','Right: 1,0'], minLines:4, solution:p(String.raw`    int dx[4] = {0, 0, -1, 1}, dy[4] = {-1, 1, 0, 0};
    const char *name[4] = {"Up", "Down", "Left", "Right"};
    for (int i = 0; i < 4; i++) printf("%s: %d,%d\n", name[i], dx[i], dy[i]);`) },
  { title:'英雄的真名', knowledge:'C 字符串', task:'保存Aster，用%s和逐字符两种方式打印。', expected:['Name: Aster','Letters: A s t e r'], minLines:2, solution:p(String.raw`    char name[20] = "Aster";
    printf("Name: %s\nLetters:", name);
    for (int i = 0; name[i] != '\0'; i++) printf(" %c", name[i]);
    printf("\n");`) },
  { title:'物品陈列柜', knowledge:'二维字符数组', task:'保存Key、Herb、Rune、Sword并打印编号清单。', expected:['1. Key','4. Sword'], minLines:4, solution:p(String.raw`    char items[4][10] = {"Key", "Herb", "Rune", "Sword"};
    for (int i = 0; i < 4; i++) printf("%d. %s\n", i + 1, items[i]);`) },
  { title:'背包寻物', knowledge:'字符查找', task:'在字符串cloak中寻找字母k并输出位置。', expected:'Key letter at: 4', solution:p(String.raw`    char item[] = "cloak"; int found = -1;
    for (int i = 0; item[i] != '\0'; i++) if (item[i] == 'k') { found = i; break; }
    if (found >= 0) printf("Key letter at: %d\n", found); else printf("No key\n");`) },
  { title:'一行会变化的地图', knowledge:'字符串原地修改', task:'把#.@..k#中的@向右移动一格，打印前后地图。', expected:['Before: #.@..k#','After:  #..@.k#'], solution:p(String.raw`    char map[] = "#.@..k#";
    printf("Before: %s\n", map);
    map[2] = '.'; map[3] = '@';
    printf("After:  %s\n", map);`) },
  { title:'遗迹全景图', knowledge:'二维地图', task:'定义并循环打印含墙、地板、玩家、钥匙和门的4×7地图。', expected:['#######','#@.k.D#'], minLines:4, solution:p(String.raw`    char map[4][8] = {"#######", "#@.k.D#", "#.....#", "#######"};
    for (int y = 0; y < 4; y++) printf("%s\n", map[y]);`) },
  { title:'数一数石墙', knowledge:'二维数组统计', task:'统计指定地图中的墙、地板和特殊物件数量。', expected:['Walls: 18','Floors: 7','Special: 3'], solution:p(String.raw`    char map[4][8] = {"#######", "#@.k.D#", "#.....#", "#######"};
    int walls = 0, floors = 0, special = 0;
    for (int y = 0; y < 4; y++) for (int x = 0; x < 7; x++) {
        if (map[y][x] == '#') walls++; else if (map[y][x] == '.') floors++; else special++;
    }
    printf("Walls: %d\nFloors: %d\nSpecial: %d\n", walls, floors, special);`) },
  { title:'地图上的一步', knowledge:'二维地图条件更新', task:'玩家从(1,1)尝试右移到地板，更新@并打印地图。', expected:['Moved','#.@...#'], minLines:5, solution:p(String.raw`    char map[4][8] = {"#######", "#@....#", "#..#..#", "#######"};
    int x = 1, y = 1, nx = 2, ny = 1;
    if (map[ny][nx] != '#') { map[y][x] = '.'; map[ny][nx] = '@'; printf("Moved\n"); }
    else printf("Bump!\n");
    for (int row = 0; row < 4; row++) printf("%s\n", map[row]);`) },
  { title:'封装英雄档案', knowledge:'struct 结构体', task:'定义Player，保存名字、HP、攻防、坐标和钥匙并打印。', expected:['Player: Aster','HP: 40 ATK: 12 DEF: 7','Position: 2,3 Keys: 1'], must:[[/struct\s+Player/,'请定义 Player 结构体。']], solution:p(String.raw`    struct Player { char name[20]; int hp, atk, def, x, y, keys; };
    struct Player hero = {"Aster", 40, 12, 7, 2, 3, 1};
    printf("Player: %s\nHP: %d ATK: %d DEF: %d\nPosition: %d,%d Keys: %d\n",
        hero.name, hero.hp, hero.atk, hero.def, hero.x, hero.y, hero.keys);`) },
  { title:'怪物图鉴', knowledge:'结构体数组', task:'创建三只怪物，打印名字和HP，并找出攻击最高者。', expected:['Slime HP: 12','Wolf HP: 20','Golem HP: 35','Strongest: Golem'], minLines:4, solution:p(String.raw`    struct Monster { char name[12]; int hp, atk; } monsters[3] = {
        {"Slime", 12, 3}, {"Wolf", 20, 7}, {"Golem", 35, 11}
    };
    int best = 0;
    for (int i = 0; i < 3; i++) { printf("%s HP: %d\n", monsters[i].name, monsters[i].hp); if (monsters[i].atk > monsters[best].atk) best = i; }
    printf("Strongest: %s\n", monsters[best].name);`) },
  { title:'结构体进入函数', knowledge:'typedef 与结构体参数', task:'print_player显示角色，player_power返回攻击加防御。', expected:['Aster HP: 40','Power: 19'], solution:p(String.raw`    Player hero = {"Aster", 40, 12, 7};
    print_player(hero);
    printf("Power: %d\n", player_power(hero));`, String.raw`typedef struct { char name[20]; int hp, atk, def; } Player;
void print_player(Player p) { printf("%s HP: %d\n", p.name, p.hp); }
int player_power(Player p) { return p.atk + p.def; }`) },
  { title:'队伍状态板', knowledge:'结构体数组统计', task:'创建三名玩家，打印成员并计算总HP。', expected:['Aster: 40','Bram: 32','Cyra: 28','Team HP: 100'], minLines:4, solution:p(String.raw`    Player team[3] = {{"Aster",40},{"Bram",32},{"Cyra",28}};
    int total = 0;
    for (int i = 0; i < 3; i++) { printf("%s: %d\n", team[i].name, team[i].hp); total += team[i].hp; }
    printf("Team HP: %d\n", total);`, String.raw`typedef struct { char name[20]; int hp; } Player;`) },
  { title:'遗迹询问你的名字', knowledge:'scanf 字符串输入', task:'读取一个不含空格的名字，再由石像欢迎。', input:'Aster\n', inputLabel:'Aster', expected:'Welcome, Aster!', must:[[/scanf\s*\(\s*"%19s"/,'请用 %19s 限制输入长度。']], solution:p(String.raw`    char name[20];
    scanf("%19s", name);
    printf("Welcome, %s!\n", name);`) },
  { title:'祭坛索要贡品', knowledge:'scanf 与条件', task:'读入金币30和贡品18，足够则输出余额。', input:'30 18\n', inputLabel:'30 18', expected:['Offering accepted','Gold: 12'], solution:p(String.raw`    int gold, offer;
    scanf("%d%d", &gold, &offer);
    if (gold >= offer) { gold -= offer; printf("Offering accepted\nGold: %d\n", gold); }
    else printf("Offering refused\n");`) },
  { title:'方向符文输入', knowledge:'scanf 字符与 switch', task:'读入d，更新Player坐标并打印。', input:'d\n', inputLabel:'d', expected:'Position: 3,2', solution:p(String.raw`    Player p = {2, 2}; char direction;
    scanf(" %c", &direction);
    switch (direction) { case 'w': p.y--; break; case 's': p.y++; break; case 'a': p.x--; break; case 'd': p.x++; break; }
    printf("Position: %d,%d\n", p.x, p.y);`, String.raw`typedef struct { int x, y; } Player;`) },
  { title:'一次真正的地图移动', knowledge:'输入、边界与地图', task:'读入d，检查边界与墙壁，移动角色并重画地图。', input:'d\n', inputLabel:'d', expected:['Moved','#.@..#'], minLines:5, solution:p(String.raw`    char map[4][7] = {"######", "#@...#", "#..#.#", "######"};
    int x = 1, y = 1, nx = x, ny = y; char d;
    scanf(" %c", &d); if (d == 'w') ny--; else if (d == 's') ny++; else if (d == 'a') nx--; else if (d == 'd') nx++;
    if (nx >= 0 && nx < 6 && ny >= 0 && ny < 4 && map[ny][nx] != '#') { map[y][x]='.'; map[ny][nx]='@'; printf("Moved\n"); }
    else printf("Bump!\n");
    for (int row=0; row<4; row++) printf("%s\n", map[row]);`) },
  { title:'章节试炼：星图守卫', knowledge:'地图、结构体与三回合战斗', task:'读入一次方向；移动到怪物格后进行最多3回合自动战斗并输出状态。', input:'d\n', inputLabel:'d', expected:['Encounter!','Round 1 Player: 25 Guard: 11','Victory','Player HP: 20 Guard HP: 0'], minLines:4, solution:p(String.raw`    char map[3][7] = {"######", "#@M..#", "######"};
    Player p = {1,1,30,9}; Monster m = {20,5}; char d;
    scanf(" %c", &d); int nx = p.x + (d=='d') - (d=='a');
    if (map[p.y][nx] == 'M') {
        printf("Encounter!\n");
        for (int r=1; r<=3 && p.hp>0 && m.hp>0; r++) {
            m.hp -= p.atk; if (m.hp > 0) p.hp -= m.atk;
            if (m.hp < 0) m.hp = 0;
            printf("Round %d Player: %d Guard: %d\n", r, p.hp, m.hp);
        }
        printf("%s\n", m.hp==0 ? "Victory" : "Battle paused");
    }
    printf("Player HP: %d Guard HP: %d\n", p.hp, m.hp);`, String.raw`typedef struct { int x,y,hp,atk; } Player;
typedef struct { int hp,atk; } Monster;`) }
]);
