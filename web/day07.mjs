import { buildChapter, cProgram } from './lesson-factory.mjs';

const meta = {
  id:'day07', day:7, numeral:'Ⅶ', rune:'第七枚符文', title:'王冠决战',
  subtitle:'指针、状态修改、模块组合与交互', description:'让函数真正改变世界，并回应王冠的最后选择。',
  scene:'王冠大厅的七座火盆依次点亮，最后的符文要求你直接触碰内存中流动的力量。'
};
const p = (body, helpers='', headers='#include <stdio.h>') => cProgram(body, helpers, headers);
const playerType = String.raw`typedef struct { char name[20]; int hp, max_hp, atk, def, x, y, keys, gold, runes; } Player;`;
const monsterType = String.raw`typedef struct { char name[20]; int hp, max_hp, atk, def; } Monster;`;

export const day07 = buildChapter(meta, [
  { title:'地址水晶', knowledge:'地址与解引用', task:'定义hp=50与指针p，打印hp、通过*p读取的值，并证明地址一致。', expected:['HP: 50','Pointer value: 50','Same address: yes'], must:[[/int\s*\*\s*p\s*=\s*&hp/,'请让指针p保存hp的地址。']], solution:p(String.raw`    int hp = 50; int *p = &hp;
    printf("HP: %d\nPointer value: %d\n", hp, *p);
    printf("Same address: %s\n", p == &hp ? "yes" : "no");`) },
  { title:'远程治疗', knowledge:'结构体指针 ->', task:'heal_player通过指针把35生命治疗12点，但不超过50。', expected:'HP: 47/50', must:[[/\b[A-Za-z_]\w*\s*->\s*hp/,'请使用结构体指针的 ->hp 修改角色，指针名称可以自定。']], solution:p(String.raw`    Player hero = {"Aster",35,50,0,0,0,0,0,0,0};
    heal_player(&hero, 12);
    printf("HP: %d/%d\n", hero.hp, hero.max_hp);`, `${playerType}
void heal_player(Player *p, int amount) { p->hp += amount; if (p->hp > p->max_hp) p->hp = p->max_hp; }`) },
  { title:'巨斧的真实伤害', knowledge:'指针修改外部状态', task:'take_damage真正扣除main中的生命，并限制不低于0。', expected:['After 18: 22','After 50: 0'], solution:p(String.raw`    Player hero = {"Aster",40,40,0,0,0,0,0,0,0};
    take_damage(&hero, 18); printf("After 18: %d\n", hero.hp);
    take_damage(&hero, 50); printf("After 50: %d\n", hero.hp);`, `${playerType}
void take_damage(Player *p, int damage) { p->hp -= damage; if (p->hp < 0) p->hp = 0; }`) },
  { title:'盗贼递来的钥匙', knowledge:'指针成员修改', task:'add_key调用两次后，让main中的钥匙数从0变成2。', expected:'Keys: 2', solution:p(String.raw`    Player hero = {0};
    add_key(&hero); add_key(&hero);
    printf("Keys: %d\n", hero.keys);`, `${playerType}
void add_key(Player *p) { p->keys++; }`) },
  { title:'传送术修改坐标', knowledge:'一个指针修改两项', task:'move_player通过一个Player指针同时修改x与y。', expected:['Before: 2,3','After: 7,1'], solution:p(String.raw`    Player hero = {0}; hero.x=2; hero.y=3;
    printf("Before: %d,%d\n", hero.x, hero.y);
    move_player(&hero, 5, -2);
    printf("After: %d,%d\n", hero.x, hero.y);`, `${playerType}
void move_player(Player *p, int dx, int dy) { p->x += dx; p->y += dy; }`) },
  { title:'交换两件神器', knowledge:'int 指针交换', task:'swap_int交换攻击力12和21，展示交换前后。', expected:['Before: 12 21','After: 21 12'], solution:p(String.raw`    int sword=12, axe=21;
    printf("Before: %d %d\n", sword, axe);
    swap_int(&sword, &axe);
    printf("After: %d %d\n", sword, axe);`, String.raw`void swap_int(int *a, int *b) { int temp=*a; *a=*b; *b=temp; }`) },
  { title:'只读的生命侦测', knowledge:'const 指针参数', task:'player_alive只查看角色，分别检查10与0生命。', expected:['Alive: 1','Fallen: 0'], must:[[/const\s+Player\s*\*\s*[A-Za-z_]\w*/,'请使用 const Player * 指针参数，参数名称可以自定。']], solution:p(String.raw`    Player a={0}, b={0}; a.hp=10;
    printf("Alive: %d\nFallen: %d\n", player_alive(&a), player_alive(&b));`, `${playerType}
int player_alive(const Player *p) { return p->hp > 0; }`) },
  { title:'地图管理员', knowledge:'二维数组函数参数', task:'get_tile读取地图，set_tile修改地图中央格。', expected:['Before: .','After: k'], solution:p(String.raw`    char map[3][6] = {"#####", "#...#", "#####"};
    printf("Before: %c\n", get_tile(map,1,2));
    set_tile(map,1,2,'k');
    printf("After: %c\n", get_tile(map,1,2));`, String.raw`#define COLS 6
char get_tile(char map[][COLS], int y, int x) { return map[y][x]; }
void set_tile(char map[][COLS], int y, int x, char tile) { map[y][x]=tile; }`) },
  { title:'移动裁判', knowledge:'指针与二维地图', task:'try_move同步更新坐标和地图；向右移动应成功。', expected:['Moved: 1','Position: 2,1','#.@.#'], minLines:3, solution:p(String.raw`    char map[3][6]={"#####","#@..#","#####"}; Player hero={0}; hero.x=1; hero.y=1;
    int moved=try_move(&hero,map,1,0);
    printf("Moved: %d\nPosition: %d,%d\n%s\n",moved,hero.x,hero.y,map[1]);`, `${playerType}
#define COLS 6
int try_move(Player *p, char map[][COLS], int dx, int dy) {
    int nx=p->x+dx, ny=p->y+dy; if(nx<0||nx>=5||ny<0||ny>=3||map[ny][nx]=='#') return 0;
    map[p->y][p->x]='.'; p->x=nx; p->y=ny; map[ny][nx]='@'; return 1;
}`) },
  { title:'自动拾取符文', knowledge:'移动副作用', task:'移动到k格时增加钥匙并输出拾取日志。', expected:['You found a key!','Keys: 1','#.@.#'], solution:p(String.raw`    char map[3][6]={"#####","#@k.#","#####"}; Player hero={0}; hero.x=1; hero.y=1;
    move_and_pick(&hero,map,1,0);
    printf("Keys: %d\n%s\n",hero.keys,map[1]);`, String.raw`${playerType}
#define COLS 6
void move_and_pick(Player *p,char map[][COLS],int dx,int dy){int nx=p->x+dx,ny=p->y+dy;if(map[ny][nx]=='k'){p->keys++;printf("You found a key!\n");}map[p->y][p->x]='.';p->x=nx;p->y=ny;map[ny][nx]='@';}`) },
  { title:'会消耗钥匙的门', knowledge:'指针状态与门', task:'带1把钥匙走向D，开门后钥匙归0。', expected:['Door opened.','Keys: 0','Position: 2,1'], solution:p(String.raw`    char map[3][6]={"#####","#@D.#","#####"}; Player hero={0}; hero.x=1;hero.y=1;hero.keys=1;
    open_door(&hero,map,1,0);
    printf("Keys: %d\nPosition: %d,%d\n",hero.keys,hero.x,hero.y);`, String.raw`${playerType}
#define COLS 6
void open_door(Player*p,char map[][COLS],int dx,int dy){int nx=p->x+dx,ny=p->y+dy;if(map[ny][nx]=='D'){if(p->keys==0){printf("A growl waits behind the door.\n");return;}p->keys--;printf("Door opened.\n");}map[p->y][p->x]='.';p->x=nx;p->y=ny;map[ny][nx]='@';}`) },
  { title:'怪物也需要被修改', knowledge:'Monster 指针', task:'hit_monster扣血，monster_alive判断生死。', expected:['HP: 7 Alive: 1','HP: 0 Alive: 0'], solution:p(String.raw`    Monster m={"Wraith",20,20,0,0};
    hit_monster(&m,13); printf("HP: %d Alive: %d\n",m.hp,monster_alive(&m));
    hit_monster(&m,20); printf("HP: %d Alive: %d\n",m.hp,monster_alive(&m));`, `${monsterType}
void hit_monster(Monster*m,int d){m->hp-=d;if(m->hp<0)m->hp=0;}
int monster_alive(const Monster*m){return m->hp>0;}`) },
  { title:'战斗函数', knowledge:'指针战斗函数', task:'battle修改双方状态，返回1代表玩家获胜。', expected:['Battle result: 1','Player HP: 22 Monster HP: 0'], solution:p(String.raw`    Player hero={"Aster",30,30,9,2,0,0,0,0,0}; Monster m={"Guard",18,18,6,1};
    int won=battle(&hero,&m);
    printf("Battle result: %d\nPlayer HP: %d Monster HP: %d\n",won,hero.hp,m.hp);`, `${playerType}
${monsterType}
int battle(Player*p,Monster*m){while(p->hp>0&&m->hp>0){int d=p->atk-m->def;if(d<1)d=1;m->hp-=d;if(m->hp<=0){m->hp=0;break;}d=m->atk-p->def;if(d<1)d=1;p->hp-=d;if(p->hp<0)p->hp=0;}return p->hp>0;}`) },
  { title:'弱小但会逃跑的AI', knowledge:'战斗中的条件状态', task:'怪物生命低于四分之一且roll=80时成功逃跑。', expected:['Goblin tries to flee.','Escape success'], solution:p(String.raw`    Monster m={"Goblin",4,20,5,1}; int roll=80, escaped=0;
    if(m.hp*4<m.max_hp){printf("%s tries to flee.\n",m.name);if(roll>=50)escaped=1;}
    printf("Escape %s\n",escaped?"success":"failed");`, monsterType) },
  { title:'NPC的两句预言', knowledge:'const char* 字符串数组', task:'talk接收只读字符串，依次说出两句预言。', expected:['The crown remembers.','The ash still burns.'], minLines:2, solution:p(String.raw`    const char *dialogues[]={"The crown remembers.","The ash still burns."};
    for(int i=0;i<2;i++)talk(dialogues[i]);`, String.raw`void talk(const char *line){printf("%s\n",line);}`) },
  { title:'游戏状态机', knowledge:'enum 状态', task:'定义五种状态，根据BATTLE输出当前画面。', expected:'State: BATTLE', must:[[/\benum\s+/,'请使用 enum 定义状态。']], solution:p(String.raw`    GameState state=BATTLE;
    switch(state){case EXPLORE:printf("State: EXPLORE\n");break;case BATTLE:printf("State: BATTLE\n");break;case VICTORY:printf("State: VICTORY\n");break;case GAME_OVER:printf("State: GAME_OVER\n");break;case QUIT:printf("State: QUIT\n");break;}`, String.raw`typedef enum { EXPLORE, BATTLE, VICTORY, GAME_OVER, QUIT } GameState;`) },
  { title:'方向翻译器', knowledge:'指针输出参数', task:'direction_to_delta把w翻译为dx=0、dy=-1，无效方向返回0。', expected:['Valid: 1 dx: 0 dy: -1','Invalid: 0'], solution:p(String.raw`    int dx=9,dy=9;
    printf("Valid: %d ",direction_to_delta('w',&dx,&dy));printf("dx: %d dy: %d\n",dx,dy);
    printf("Invalid: %d\n",direction_to_delta('x',&dx,&dy));`, String.raw`int direction_to_delta(char d,int*dx,int*dy){*dx=0;*dy=0;if(d=='w')*dy=-1;else if(d=='s')*dy=1;else if(d=='a')*dx=-1;else if(d=='d')*dx=1;else return 0;return 1;}`) },
  { title:'可退出的探索循环', knowledge:'输入循环与安全退出', task:'连续读入d、x、q；移动一次、报告无效输入并安全退出。', input:'d\nx\nq\n', inputLabel:'d x q', expected:['Position: 2,1','Invalid direction','Quit safely'], minLines:3, solution:p(String.raw`    int x=1,y=1;char command;
    while(scanf(" %c",&command)==1){if(command=='q'){printf("Quit safely\n");break;}if(command=='d')x++;else if(command=='a')x--;else if(command=='w')y--;else if(command=='s')y++;else{printf("Invalid direction\n");continue;}printf("Position: %d,%d\n",x,y);}`) },
  { title:'王冠大厅前的彩排', knowledge:'地图、门与战斗组合', task:'在5×7地图中依次走到钥匙k、门D和守卫M的位置，拾钥匙、开门并击败守卫，输出关键日志。', expected:['Key collected','Door opened','Guard defeated','Runes: 7'], minLines:4, must:[[/char\s+map\s*\[\s*5\s*\]\s*\[\s*8\s*\]/,'请创建能保存5×7字符地图的二维数组。'],[/map\s*\[[^\]]+\]\s*\[[^\]]+\]/,'请读取或修改地图格子。']], solution:p(String.raw`    char map[5][8]={"#######","#@kDM.#","#.....#","#.....#","#######"};
    Player p={"Aster",30,30,10,3,1,1,0,0,6}; Monster g={"Guard",12,12,5,2};
    if(map[1][2]=='k'){map[p.y][p.x]='.';p.x=2;map[p.y][p.x]='@';p.keys++;printf("Key collected\n");}
    if(map[1][3]=='D'&&p.keys>0){map[p.y][p.x]='.';p.x=3;map[p.y][p.x]='@';p.keys--;printf("Door opened\n");}
    if(map[1][4]=='M'){while(g.hp>0&&p.hp>0){g.hp-=p.atk-g.def;if(g.hp>0)p.hp-=g.atk-p.def;}}
    if(g.hp<=0){map[p.y][p.x]='.';p.x=4;map[p.y][p.x]='@';p.runes++;printf("Guard defeated\n");}
    printf("Runes: %d\n",p.runes);`, `${playerType}
${monsterType}`) },
  { title:'毕业试炼：王冠的回应', knowledge:'结构体、指针、函数、输入与 switch', task:'只读取一次选择：1治疗、2献金、3查看王冠；依次输出选择反馈、最终状态和结局，不使用循环。三种有效选择都可以通关。', input:'2\n', inputLabel:'1、2 或 3（默认2）', expected:['Gold offered.','HP: 30 Gold: 20 Runes: 7','Ending: The crown accepts your vow.'], outputRule:{mode:'oneOf',alternatives:[
    {mode:'custom',includes:['Healing accepted.','HP: 45 Gold: 35 Runes: 7','Ending: The crown restores your light.'],minLines:3,ordered:true},
    {mode:'custom',includes:['Gold offered.','HP: 30 Gold: 20 Runes: 7','Ending: The crown accepts your vow.'],minLines:3,ordered:true},
    {mode:'custom',includes:['The crown reflects seven stars.','HP: 30 Gold: 35 Runes: 7','Ending: You choose wisdom.'],minLines:3,ordered:true}
  ]}, minLines:3, minutes:25, solution:p(String.raw`    Player hero={30,50,35,7};int choice;const char *ending;
    scanf("%d",&choice);
    switch(choice){case 1:heal_player(&hero);printf("Healing accepted.\n");ending="The crown restores your light.";break;case 2:offer_gold(&hero);printf("Gold offered.\n");ending="The crown accepts your vow.";break;case 3:printf("The crown reflects seven stars.\n");ending="You choose wisdom.";break;default:printf("The crown remains silent.\n");ending="No choice.";break;}
    print_player(&hero);
    printf("Ending: %s\n",ending);`, String.raw`typedef struct {int hp,max_hp,gold,runes;} Player;
void heal_player(Player*p){p->hp+=15;if(p->hp>p->max_hp)p->hp=p->max_hp;}
void offer_gold(Player*p){if(p->gold>=15)p->gold-=15;}
void print_player(const Player*p){printf("HP: %d Gold: %d Runes: %d\n",p->hp,p->gold,p->runes);}`) }
]);
