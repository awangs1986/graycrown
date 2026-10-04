import { buildChapter, cProgram } from './lesson-factory.mjs';

const meta = {
  id:'day05', day:5, numeral:'Ⅴ', rune:'第五枚符文', title:'法师高塔',
  subtitle:'函数声明、参数、返回值与程序拆分', description:'把重复的法术封装成可以召唤的名字。',
  scene:'法师高塔的每一级台阶都刻着函数名，念对参数，石阶才会浮向更高处。'
};
const f = (helpers, body) => cProgram(body, helpers);

export const day05 = buildChapter(meta, [
  { title:'塔门的欢迎仪式', knowledge:'void 函数', task:'编写 print_title 与 print_line，在main中组合欢迎画面。', expected:['============','Ash Crown','============'], minLines:3, must:[[/void\s+print_title\s*\(/,'请定义 print_title。'],[/void\s+print_line\s*\(/,'请定义 print_line。']], solution:f(String.raw`void print_title(void) { printf("Ash Crown\n"); }
void print_line(void) { printf("============\n"); }`, String.raw`    print_line(); print_title(); print_line();`) },
  { title:'状态镜', knowledge:'函数参数', task:'让 print_status(hp,atk,def) 分三行显示属性。', expected:['HP: 40','ATK: 12','DEF: 7'], minLines:3, solution:f(String.raw`void print_status(int hp, int atk, int def) {
    printf("HP: %d\nATK: %d\nDEF: %d\n", hp, atk, def);
}`, String.raw`    print_status(40, 12, 7);`) },
  { title:'坐标水晶', knowledge:'多参数函数', task:'print_position显示坐标，并测试(2,3)与(8,5)。', expected:['Position: (2, 3)','Position: (8, 5)'], minLines:2, solution:f(String.raw`void print_position(int x, int y) { printf("Position: (%d, %d)\n", x, y); }`, String.raw`    print_position(2, 3);
    print_position(8, 5);`) },
  { title:'伤害公式卷轴', knowledge:'int 返回值', task:'calc_damage返回攻击减防御，最低为1；测试两种情况。', expected:['Damage A: 7','Damage B: 1'], solution:f(String.raw`int calc_damage(int atk, int def) {
    int damage = atk - def; return damage > 0 ? damage : 1;
}`, String.raw`    printf("Damage A: %d\n", calc_damage(12, 5));
    printf("Damage B: %d\n", calc_damage(4, 9));`) },
  { title:'生命守恒术', knowledge:'返回值与下限', task:'apply_damage返回扣血后生命，且不低于0。', expected:['HP A: 25','HP B: 0'], solution:f(String.raw`int apply_damage(int hp, int damage) {
    hp -= damage; return hp > 0 ? hp : 0;
}`, String.raw`    printf("HP A: %d\n", apply_damage(40, 15));
    printf("HP B: %d\n", apply_damage(8, 20));`) },
  { title:'治愈术的上限', knowledge:'函数边界', task:'heal不能让生命超过最大值，测试普通和溢出治疗。', expected:['Heal A: 35','Heal B: 50'], solution:f(String.raw`int heal(int hp, int amount, int max_hp) {
    hp += amount; return hp > max_hp ? max_hp : hp;
}`, String.raw`    printf("Heal A: %d\n", heal(20, 15, 50));
    printf("Heal B: %d\n", heal(45, 20, 50));`) },
  { title:'生死侦测魔法', knowledge:'布尔式返回值', task:'is_alive返回0或1，再由 print_alive_state讲述结果。', expected:['Alive','Fallen'], solution:f(String.raw`int is_alive(int hp) { return hp > 0; }
void print_alive_state(int alive) { printf("%s\n", alive ? "Alive" : "Fallen"); }`, String.raw`    print_alive_state(is_alive(9));
    print_alive_state(is_alive(0));`) },
  { title:'谁的剑更锋利', knowledge:'比较函数', task:'max_int返回两数中较大值。', expected:['Best: 17','Equal: 12'], solution:f(String.raw`int max_int(int a, int b) { return a > b ? a : b; }`, String.raw`    printf("Best: %d\n", max_int(17, 9));
    printf("Equal: %d\n", max_int(12, 12));`) },
  { title:'移动咒语组', knowledge:'小函数组合', task:'编写上下左右移动函数，让坐标从(2,2)走三步到(2,3)。', expected:'Position: (2, 3)', solution:f(String.raw`int move_left(int x) { return x - 1; }
int move_right(int x) { return x + 1; }
int move_up(int y) { return y + 1; }
int move_down(int y) { return y - 1; }`, String.raw`    int x = 2, y = 2;
    x = move_right(x); y = move_up(y); x = move_left(x);
    printf("Position: (%d, %d)\n", x, y);`) },
  { title:'生命条工匠', knowledge:'函数内循环', task:'print_bar用filled和empty打印 [######----]。', expected:'[######----]', solution:f(String.raw`void print_bar(int filled, int empty) {
    printf("[");
    for (int i = 0; i < filled; i++) printf("#");
    for (int i = 0; i < empty; i++) printf("-");
    printf("]\n");
}`, String.raw`    print_bar(6, 4);`) },
  { title:'门卫的职责划分', knowledge:'判断与显示分离', task:'can_open_door只判断，print_door_result只输出结果。', expected:['Door opens','Door locked'], solution:f(String.raw`int can_open_door(int keys) { return keys > 0; }
void print_door_result(int can_open) { printf("%s\n", can_open ? "Door opens" : "Door locked"); }`, String.raw`    print_door_result(can_open_door(1));
    print_door_result(can_open_door(0));`) },
  { title:'战利品计算师', knowledge:'公式函数', task:'reward_gold返回 monster_level*5+bonus，计算三只怪物赏金。', expected:['Reward 1: 13','Reward 2: 27','Reward 3: 41'], solution:f(String.raw`int reward_gold(int level, int bonus) { return level * 5 + bonus; }`, String.raw`    printf("Reward 1: %d\n", reward_gold(2, 3));
    printf("Reward 2: %d\n", reward_gold(5, 2));
    printf("Reward 3: %d\n", reward_gold(8, 1));`) },
  { title:'函数原型的预言', knowledge:'函数声明', task:'main前只放原型，main后定义 prophecy，并成功调用。', expected:'Seven runes remember your name.', must:[[/void\s+prophecy\s*\(void\)\s*;/,'请在main前声明函数原型。']], solution:String.raw`#include <stdio.h>

void prophecy(void);

int main(void) {
    prophecy();
    return 0;
}

void prophecy(void) {
    printf("Seven runes remember your name.\n");
}` },
  { title:'NPC的传话术', knowledge:'函数中的 switch', task:'talk_npc让三名NPC说不同台词；调用2号NPC。', expected:'Smith: Trust the steel.', solution:f(String.raw`void talk_npc(int id) {
    switch (id) {
        case 1: printf("Mage: Read the stars.\n"); break;
        case 2: printf("Smith: Trust the steel.\n"); break;
        case 3: printf("Ranger: Follow the moss.\n"); break;
        default: printf("Silence.\n");
    }
}`, String.raw`    talk_npc(2);`) },
  { title:'房间编号器', knowledge:'嵌套调用', task:'用 enter_room(next_room(3))进入第4号房。', expected:'Enter room 4', must:[[/enter_room\s*\(\s*next_room\s*\(/,'请使用嵌套函数调用。']], solution:f(String.raw`int next_room(int room) { return room + 1; }
void enter_room(int room) { printf("Enter room %d\n", room); }`, String.raw`    enter_room(next_room(3));`) },
  { title:'一回合决斗', knowledge:'函数流水线', task:'组合calc_damage、apply_damage、print_status完成一回合。', expected:['Damage: 7','Enemy HP: 13'], solution:f(String.raw`int calc_damage(int atk, int def) { int d = atk - def; return d > 0 ? d : 1; }
int apply_damage(int hp, int damage) { hp -= damage; return hp > 0 ? hp : 0; }
void print_status(int hp) { printf("Enemy HP: %d\n", hp); }`, String.raw`    int damage = calc_damage(12, 5);
    int enemy_hp = apply_damage(20, damage);
    printf("Damage: %d\n", damage);
    print_status(enemy_hp);`) },
  { title:'纯函数的占卜', knowledge:'无副作用函数', task:'score_battle只返回评分，不在函数内打印。', expected:'Battle score: 103', solution:f(String.raw`int score_battle(int hp, int gold, int keys) { return hp + gold * 2 + keys * 5; }`, String.raw`    printf("Battle score: %d\n", score_battle(48, 25, 1));`) },
  { title:'高塔电梯的边界', knowledge:'clamp 函数', task:'clamp把楼层限制在1到9，测试-2、5、15。', expected:['Floor: 1','Floor: 5','Floor: 9'], minLines:3, solution:f(String.raw`int clamp(int value, int min, int max) {
    if (value < min) return min;
    if (value > max) return max;
    return value;
}`, String.raw`    printf("Floor: %d\n", clamp(-2, 1, 9));
    printf("Floor: %d\n", clamp(5, 1, 9));
    printf("Floor: %d\n", clamp(15, 1, 9));`) },
  { title:'拆解一段混乱咒语', knowledge:'单一职责', task:'用至少4个小函数完成标题、房间、宝箱、金币与状态剧情。', expected:['Ash Crown','Enter room 3','Chest found','Gold: 15'], minLines:4, solution:f(String.raw`void title(void) { printf("Ash Crown\n"); }
void room(int n) { printf("Enter room %d\n", n); }
void chest(void) { printf("Chest found\n"); }
int gain_gold(int gold, int amount) { return gold + amount; }
void status(int gold) { printf("Gold: %d\n", gold); }`, String.raw`    int gold = 5;
    title(); room(3); chest(); gold = gain_gold(gold, 10); status(gold);`) },
  { title:'章节试炼：镜像骑士', knowledge:'六函数战斗', task:'用计算、扣血、治疗、存活、状态、结局六类函数组织短战斗。', expected:['Round 1 Hero: 33 Knight: 26','Victory'], minLines:4, solution:f(String.raw`int damage(int atk, int def) { int d = atk - def; return d > 0 ? d : 1; }
int hurt(int hp, int d) { hp -= d; return hp > 0 ? hp : 0; }
int heal(int hp, int n, int max) { hp += n; return hp > max ? max : hp; }
int alive(int hp) { return hp > 0; }
void status(int r, int h, int k) { printf("Round %d Hero: %d Knight: %d\n", r, h, k); }
void ending(int win) { printf("%s\n", win ? "Victory" : "Defeat"); }`, String.raw`    int hero = 36, knight = 34, round = 0;
    while (alive(hero) && alive(knight)) {
        round++; knight = hurt(knight, damage(12, 4));
        if (alive(knight)) hero = hurt(hero, damage(9, 6));
        if (round == 2) hero = heal(hero, 2, 36);
        status(round, hero, knight);
    }
    ending(alive(hero));`) }
]);
