// Original English lessons for Gray Crown. The unit order follows the grammar syllabus of
// New Concept English Book 1 (aligned only: every text, dialogue and exercise here is newly written).
import { c, w } from './items.mjs';

export const book1a = [
  {
    id: 'en1-01', book: 1, title: '打扰一下！', goal: '礼貌搭话、确认物品：Is this your…?', place: 'cafe', cast: ['leo', 'mia'],
    grammar: '一般疑问句把 is 提到句首：This is your bag. → Is this your bag?\n肯定回答：Yes, it is.　否定回答：No, it isn\'t.（isn\'t = is not）\n搭话先说 Excuse me.（打扰一下），没听清可以说 Pardon? / Sorry?，别人帮忙后说 Thank you (very much).\nyour = 你的／你们的，my = 我的。',
    tips: '句首字母大写，问句以问号结尾。Excuse me 中的 x 读 /ks/；Thank you 的 th 要把舌尖轻放在上下齿之间。',
    vocabulary: [['excuse me', '打扰一下'], ['yes', '是的'], ['umbrella', '雨伞'], ['no', '不是'], ['coat', '外套'], ['pen', '钢笔'], ['watch', '手表'], ['ticket', '票'], ['thank you', '谢谢'], ['pardon', '请再说一遍']],
    sentence: 'Is this your coat?', sentenceMeaning: '这是你的外套吗？',
    translate: ['打扰一下！这是你的雨伞吗？', ['Excuse me! Is this your umbrella?', 'Excuse me, is this your umbrella?']],
    translate2: ['是的，它是。非常感谢。', ['Yes, it is. Thank you very much.', 'Yes, it is. Thanks a lot.', 'Yes, it is. Thank you so much.', 'Yes, it is. Thanks very much.']],
    grammarChoice: ['把 “This is your pen.” 变成问句：', ['Is this your pen?', 'This is your pen?', 'Is your this pen?'], 'Is this your pen?', '一般疑问句把 is 移到句首：Is this …?'],
    grammarText: ['否定回答：Is this your watch? — No, it ___.', ["isn't", 'is not'], "否定简短回答用 No, it isn't.（is not 的缩写）"],
    listen: ['Excuse me! Is this your ticket? Yes, it is. Thank you.', '对话里提到的是什么东西？', ['票', '手表', '外套'], '票'],
    dictation: ['Thank you very much.', ['Thank you very much.']],
    reading: ['Mia: Excuse me! Is this your pen?\nLeo: Pardon?\nMia: Is this your pen?\nLeo: No, it isn\'t. My pen is blue.\nMia: Oh, sorry!', 'Leo 的回答是什么？', ['不是他的笔', '是他的笔', '他没有回答'], '不是他的笔'],
    reviewGrammar: ['补全：___ this your coat? — Yes, it is.', ['Is'], '问句以 Is 开头。'],
    examAudio: ['Excuse me. Is this your watch? No, it isn\'t. Sorry!', '物品是不是对方的？', ['不是', '是', '没听清'], '不是'],
    examSentence: ['Excuse me, is this your ticket?', '打扰一下，这是你的票吗？'],
    drills: [
      c('别人帮你捡起雨伞，你应该说：', ['Thank you very much.', 'Excuse me.', 'Pardon?'], 'Thank you very much.', '表达感谢用 Thank you (very much).'),
      w('补全：___ me! Is this your bag?（打扰一下！）', ['Excuse'], 'Excuse me 用于礼貌搭话。'),
      c('没听清对方的话，可以说：', ['Pardon?', 'Thank you.', 'Yes, it is.'], 'Pardon?', 'Pardon? / Sorry? 请对方再说一遍。'),
      w('肯定回答：Is this your umbrella? — Yes, it ___.', ['is'], "肯定简短回答 Yes, it is. 不缩写成 Yes, it's.")
    ],
    examItems: [
      c('“这是我的票。” 正确的是：', ['This is my ticket.', 'This is your ticket?', 'Is my this ticket.'], 'This is my ticket.', 'my = 我的；陈述句 is 在主语后。'),
      w('补全：Is this ___ watch?（你的）', ['your'], 'your = 你的。')
    ]
  },
  {
    id: 'en1-02', book: 1, title: '很高兴认识你', goal: '介绍自己与他人：be 动词、a/an、国籍和职业', place: 'office', cast: ['grant', 'leo'],
    grammar: 'be 动词：I am（I\'m）、you are（you\'re）、he/she/it is（he\'s/she\'s）、we/they are。\n职业名词前要加 a/an：辅音音素前用 a（a teacher），元音音素前用 an（an engineer, an office worker）。\n问名字：What\'s your name? 问职业：What\'s your job? / What do you do?\n国籍：I\'m Chinese. She\'s English. He\'s from France.',
    tips: 'an 的选择看读音而不是字母：an hour（h 不发音），a university（u 读 /juː/）。Nice to meet you 中 meet you 常连读。',
    vocabulary: [['teacher', '老师'], ['engineer', '工程师'], ['nurse', '护士'], ['student', '学生'], ['driver', '司机'], ['Chinese', '中国人／中国的'], ['English', '英国人／英语'], ['name', '名字'], ['job', '工作'], ['friend', '朋友']],
    sentence: "I'm an engineer.", sentenceMeaning: '我是一名工程师。',
    translate: ['很高兴认识你。', ['Nice to meet you.', "It's nice to meet you.", 'Pleased to meet you.', 'Glad to meet you.']],
    translate2: ['她是一名护士。', ['She is a nurse.', "She's a nurse."]],
    grammarChoice: ['选择正确的冠词：She is ___ engineer.', ['an', 'a', 'the'], 'an', 'engineer 以元音音素开头，用 an。'],
    grammarText: ['补全：They ___ students.（他们是学生。）', ['are', "'re"], 'they 搭配 are。'],
    listen: ["Hello, I'm Tom. I'm a driver. I'm English.", 'Tom 的职业是什么？', ['司机', '老师', '工程师'], '司机'],
    dictation: ["What's your name?", ["What's your name?", 'What is your name?']],
    reading: ["Mr Grant: Good morning. I'm Paul Grant. I'm a teacher.\nLeo: Nice to meet you, Mr Grant. I'm Leo Chen. I'm Chinese.\nMr Grant: Are you a student, Leo?\nLeo: Yes, I am.", 'Leo 是什么身份？', ['学生', '老师', '司机'], '学生'],
    reviewGrammar: ['补全：I ___ Chinese.（我是中国人。）', ['am', "'m"], 'I 搭配 am。'],
    examAudio: ["This is my friend Anna. She's a nurse. She isn't a teacher.", 'Anna 是做什么的？', ['护士', '老师', '学生'], '护士'],
    examSentence: ['He is a teacher.', '他是一名老师。'],
    drills: [
      c('选择正确形式：He ___ my friend.', ['is', 'are', 'am'], 'is', 'he/she/it 搭配 is。'),
      w('补全冠词：I\'m ___ office worker.', ['an'], 'office 以元音音素开头，用 an。'),
      c('问对方的工作，选哪句？', ["What's your job?", "What's your name?", 'How are you?'], "What's your job?", 'job = 工作。'),
      w('补全：We ___ from China.', ['are', "'re"], 'we 搭配 are。')
    ],
    examItems: [
      c('选择正确的句子：', ['She is an English teacher.', 'She is a English teacher.', 'She are an English teacher.'], 'She is an English teacher.', 'English 以元音音素开头，冠词用 an；she 搭配 is。'),
      w('补全：___ you a driver? — No, I\'m not.', ['Are'], 'you 的疑问句以 Are 开头。')
    ]
  },
  {
    id: 'en1-03', book: 1, title: '它是什么颜色？', goal: '颜色、服装与 What colour…? / 形容词作表语', place: 'shop', cast: ['ada', 'mia'],
    grammar: '问颜色：What colour is your dress? — It\'s green.\n形容词可以放在 be 后面：My shirt is new. 也可以放在名词前：a new shirt。\n形容词没有单复数变化：a red hat / two red hats。\nWhat colour 在英式拼写里是 colour，美式是 color，两者都可以。',
    tips: '注意 white /waɪt/ 与 wait 的读音相同；brown 里的 ow 读 /aʊ/。',
    vocabulary: [['red', '红色的'], ['blue', '蓝色的'], ['green', '绿色的'], ['white', '白色的'], ['black', '黑色的'], ['dress', '连衣裙'], ['shirt', '衬衫'], ['hat', '帽子'], ['new', '新的'], ['old', '旧的；老的']],
    sentence: 'My new dress is green.', sentenceMeaning: '我的新裙子是绿色的。',
    translate: ['你的帽子是什么颜色的？', ['What colour is your hat?', 'What color is your hat?']],
    translate2: ['它是黑白相间的。', ['It is black and white.', "It's black and white."]],
    grammarChoice: ['选择正确的语序：', ['This is a red shirt.', 'This is a shirt red.', 'This is red a shirt.'], 'This is a red shirt.', '形容词放在名词前：a red shirt。'],
    grammarText: ['补全：What ___ is your coat? — It\'s blue.', ['colour', 'color'], '问颜色用 What colour…?'],
    listen: ["Is your new hat white? No, it isn't. It's red.", '帽子是什么颜色？', ['红色', '白色', '蓝色'], '红色'],
    dictation: ["It's a new shirt.", ["It's a new shirt.", 'It is a new shirt.']],
    reading: ["Ada: Good afternoon. Can I help you?\nMia: Yes. Is this dress new?\nAda: Yes, it is. It's green and white.\nMia: Nice! And that hat?\nAda: That hat is old, but it's very nice.", '那顶帽子是怎样的？', ['旧的，但很好看', '新的，绿白色', '红色的新帽子'], '旧的，但很好看'],
    reviewGrammar: ['补全：My shoes ___ black.（我的鞋是黑色的。）', ['are'], 'shoes 是复数，用 are。'],
    examAudio: ["Look at my shirt. It isn't new. It's old and blue.", '衬衫是怎样的？', ['旧的蓝色衬衫', '新的蓝色衬衫', '旧的白衬衫'], '旧的蓝色衬衫'],
    examSentence: ['What colour is her dress?', '她的裙子是什么颜色的？'],
    drills: [
      c('“两顶红帽子” 的正确表达：', ['two red hats', 'two reds hats', 'two hats reds'], 'two red hats', '形容词没有复数形式。'),
      w('补全：Your coat is ___.（新的）', ['new'], 'new = 新的。'),
      c('回答 What colour is the sky today?', ["It's blue.", "Yes, it is.", "It's a sky."], "It's blue.", '问颜色时直接说颜色。'),
      w('补全：This is ___ old watch.', ['an'], 'old 以元音音素开头，用 an。')
    ],
    examItems: [
      c('选择正确的句子：', ['Her shirt is white.', 'Her shirt white is.', 'Her shirt are white.'], 'Her shirt is white.', 'shirt 单数，用 is；形容词放在 be 后。'),
      w('补全：It\'s ___ old green umbrella.', ['an'], 'old 以元音音素开头，冠词用 an。')
    ]
  },
  {
    id: 'en1-04', book: 1, title: '看那些人！', goal: '名词复数、these/those、描述人的形容词', place: 'park', cast: ['mia', 'sam', 'leo'],
    grammar: 'this（这个）→ these（这些）；that（那个）→ those（那些）。\n名词复数：一般加 -s（book → books）；以 s, x, ch, sh 结尾加 -es（box → boxes）；辅音 + y 变 -ies（city → cities）；不规则：man → men, woman → women, child → children。\n描述人：tall/short（高/矮），fat/thin（胖/瘦），young/old（年轻/老）。\nThese are my friends. Those men are tall.',
    tips: '复数 -s 有三种读音：/s/（books）、/z/（pens）、/ɪz/（boxes）。these 的 ee 要读长音。',
    vocabulary: [['tall', '高的'], ['short', '矮的；短的'], ['young', '年轻的'], ['busy', '忙碌的'], ['tired', '累的'], ['man', '男人'], ['woman', '女人'], ['child', '孩子'], ['dog', '狗'], ['tree', '树']],
    sentence: 'Those children are very busy.', sentenceMeaning: '那些孩子非常忙。',
    translate: ['这些是我的朋友。', ['These are my friends.']],
    translate2: ['那些男人很高。', ['Those men are tall.', 'Those men are very tall.']],
    grammarChoice: ['选择正确的复数：one child, two ___', ['children', 'childs', 'childes'], 'children', 'child 的复数是不规则的 children。'],
    grammarText: ['补全：___ are my shoes.（这些）', ['These'], 'these + are + 复数名词。'],
    listen: ['Look at those women. They are young and tall.', '那些女人是怎样的？', ['年轻又高', '老而矮', '又累又忙'], '年轻又高'],
    dictation: ['These dogs are tired.', ['These dogs are tired.']],
    reading: ["Sam: Look! Who are those people?\nMia: That's Mr Hill. He's old, but he's very strong.\nSam: And those two women?\nMia: They're nurses. They're busy today.", '那两位女士今天怎样？', ['很忙', '很累', '很老'], '很忙'],
    reviewGrammar: ['补全复数：one box, two ___', ['boxes'], '以 x 结尾的名词加 -es。'],
    examAudio: ['These men are not tired. They are busy.', '这些男人怎样？', ['很忙，不累', '很累', '又老又矮'], '很忙，不累'],
    examSentence: ['These women are very young.', '这些女人很年轻。'],
    drills: [
      c('“那些树” 的正确形式：', ['those trees', 'that trees', 'those tree'], 'those trees', 'those 后接复数名词。'),
      w('补全复数：one woman, two ___', ['women'], 'woman 的复数是 women。'),
      c('选择正确的句子：', ['This man is short.', 'These man is short.', 'This men is short.'], 'This man is short.', 'this + 单数名词 + is。'),
      w('补全复数：one city, two ___', ['cities'], '辅音字母 + y 结尾，变 y 为 i 再加 -es。')
    ],
    examItems: [
      c('选择正确的句子：', ['Those dogs are very big.', 'That dogs are very big.', 'Those dog is very big.'], 'Those dogs are very big.', 'those + 复数名词 + are。'),
      w('补全复数：one man, three ___', ['men'], 'man 的复数是 men。')
    ]
  },
  {
    id: 'en1-05', book: 1, title: '这是谁的？', goal: 'whose、名词所有格 \'s、物主代词', place: 'home', cast: ['rose', 'sam'],
    grammar: '问物主：Whose is this bag? / Whose bag is this?\n名词所有格：Tom\'s car（Tom 的车）；复数名词以 s 结尾只加撇号：my parents\' house。\n形容词性物主代词放在名词前：my, your, his, her, its, our, their。\n名词性物主代词单独使用：mine, yours, his, hers, ours, theirs。It\'s mine.（它是我的。）',
    tips: '注意区分 whose 与 who\'s（= who is），读音相同、拼写不同。its（它的）没有撇号；it\'s = it is。',
    vocabulary: [['whose', '谁的'], ['mine', '我的（东西）'], ['yours', '你的（东西）'], ['bag', '包'], ['key', '钥匙'], ['shoes', '鞋子'], ['glasses', '眼镜'], ['camera', '相机'], ['brother', '兄弟'], ['sister', '姐妹']],
    sentence: "Whose keys are these?", sentenceMeaning: '这些是谁的钥匙？',
    translate: ['这是我妹妹的相机。', ["This is my sister's camera.", "It's my sister's camera.", "This is my little sister's camera.", "This is my younger sister's camera."]],
    translate2: ['那些鞋是你的吗？', ['Are those shoes yours?', 'Are those your shoes?']],
    grammarChoice: ['“这是 Leo 的包。” 正确的是：', ["This is Leo's bag.", 'This is Leo bag.', "This is bag Leo's."], "This is Leo's bag.", "人名 + 's 表示所属。"],
    grammarText: ['补全：Is this your pen? — Yes, it\'s ___.（我的）', ['mine'], '名词性物主代词 mine 单独使用。'],
    listen: ["Whose glasses are these? They're Grandma's.", '眼镜是谁的？', ['奶奶的', '弟弟的', '老师的'], '奶奶的'],
    dictation: ['Whose camera is this?', ['Whose camera is this?']],
    reading: ["Grandma Rose: Sam, whose shoes are these?\nSam: They aren't mine. They're my brother's.\nGrandma Rose: And this bag?\nSam: That's my bag. Thank you, Grandma!", '那双鞋是谁的？', ['Sam 的兄弟的', 'Sam 的', '奶奶的'], 'Sam 的兄弟的'],
    reviewGrammar: ['补全：This is Mia. ___ coat is green.（她的）', ['Her'], 'her = 她的（放在名词前）。'],
    examAudio: ["Is this your key, Leo? No, it isn't mine. It's my sister's.", '钥匙是谁的？', ['Leo 姐妹的', 'Leo 的', '不知道'], 'Leo 姐妹的'],
    examSentence: ['These glasses are not mine.', '这副眼镜不是我的。'],
    drills: [
      c('选择正确的物主代词：Tom and Ann are here. This is ___ car.', ['their', 'they', 'theirs'], 'their', 'their + 名词 = 他们的……'),
      w('补全：Is this bag ___?（你的）', ['yours'], '名词性物主代词 yours。'),
      c('“我父母的房子” 正确的是：', ["my parents' house", "my parent's houses", "my parents's house"], "my parents' house", '以 s 结尾的复数名词只加撇号。'),
      w('补全：___ umbrella is this? — It\'s Mr Grant\'s.', ['Whose'], '问物主用 whose。')
    ],
    examItems: [
      c('选择正确的句子：', ['The cat is eating its food.', "The cat is eating it's food.", 'The cat is eating it food.'], 'The cat is eating its food.', "its 表示“它的”，没有撇号；it's = it is。"),
      w('补全：These books are ___.（她的）', ['hers'], 'hers = 她的（东西）。')
    ]
  },
  {
    id: 'en1-06', book: 1, title: '它在哪里？', goal: 'there is / there are、方位介词', place: 'kitchen', cast: ['mia', 'rose'],
    grammar: '表示“某处有某物”：There is a cup on the table. There are some eggs in the fridge.\n疑问：Is there a…? / Are there any…? 否定：There isn\'t a… / There aren\'t any…\n方位介词：in（在里面）、on（在上面）、under（在下面）、near（在附近）、next to（紧挨着）、between A and B（在 A 和 B 之间）、behind（在后面）、in front of（在前面）。\n问位置：Where is the milk? — It\'s in the fridge.',
    tips: "There's 是 There is 的缩写；There are 一般不缩写。",
    vocabulary: [['kitchen', '厨房'], ['table', '桌子'], ['fridge', '冰箱'], ['cup', '杯子'], ['plate', '盘子'], ['milk', '牛奶'], ['egg', '鸡蛋'], ['under', '在……下面'], ['near', '在……附近'], ['between', '在……之间']],
    sentence: 'There are two cups on the table.', sentenceMeaning: '桌上有两个杯子。',
    translate: ['冰箱里有一些牛奶。', ['There is some milk in the fridge.', "There's some milk in the fridge."]],
    translate2: ['盘子在哪里？', ['Where are the plates?', 'Where is the plate?', "Where's the plate?"]],
    grammarChoice: ['选择正确形式：There ___ three eggs in the box.', ['are', 'is', 'am'], 'are', 'three eggs 是复数，用 there are。'],
    grammarText: ['补全：The cat is ___ the table.（在桌子下面）', ['under'], 'under = 在……下面。'],
    listen: ["Where's the milk? It's in the fridge, next to the eggs.", '牛奶在哪里？', ['冰箱里', '桌子上', '杯子里'], '冰箱里'],
    dictation: ['There is a plate on the table.', ['There is a plate on the table.', "There's a plate on the table."]],
    reading: ["Mia: Grandma, are there any eggs?\nGrandma Rose: Yes, there are. They're in the fridge.\nMia: Is there any bread?\nGrandma Rose: No, there isn't. Sorry!", '厨房里缺什么？', ['面包', '鸡蛋', '冰箱'], '面包'],
    reviewGrammar: ['补全：Are there ___ cups in the kitchen?（任何、一些）', ['any'], '疑问句和否定句一般用 any。'],
    examAudio: ['There is a big table in the kitchen. There are four chairs near it.', '厨房里有几把椅子？', ['四把', '两把', '一把'], '四把'],
    examSentence: ['The plates are between the cups.', '盘子在杯子之间。'],
    drills: [
      c('“桌子附近有一把椅子。” 正确的是：', ['There is a chair near the table.', 'There are a chair near the table.', 'A chair there is near table.'], 'There is a chair near the table.', '单数用 there is。'),
      w("补全：___ there a fridge in the kitchen? — Yes, there is.", ['Is'], '单数疑问句 Is there…?'),
      c('选择：The bank is ___ the shop and the cafe.', ['between', 'under', 'on'], 'between', 'between A and B = 在 A 和 B 之间。'),
      w("补全否定：There ___ any milk.（没有牛奶）", ["isn't", 'is not'], '不可数名词用 there isn\'t any。')
    ],
    examItems: [
      c('选择正确的句子：', ["There aren't any eggs in the fridge.", "There isn't any eggs in the fridge.", "There aren't some eggs in the fridge."], "There aren't any eggs in the fridge.", '复数否定 there aren\'t any。'),
      w('补全：The cup is ___ the plate.（在盘子上）', ['on'], 'on = 在……上面。')
    ]
  },
  {
    id: 'en1-07', book: 1, title: '你在做什么？', goal: '现在进行时：am/is/are + doing', place: 'park', cast: ['leo', 'sam'],
    grammar: '现在进行时表示此刻正在发生：be + 动词-ing。I am reading. She is running. They are playing.\n-ing 规则：一般加 -ing（read → reading）；以不发音 e 结尾去 e（write → writing）；重读闭音节双写末尾辅音（run → running, sit → sitting, swim → swimming）。\n疑问：What are you doing? Is he sleeping? 否定：I\'m not working.',
    tips: '常和 now、look、listen 连用：Look! The dog is swimming.',
    vocabulary: [['run', '跑'], ['swim', '游泳'], ['read', '读'], ['write', '写'], ['sleep', '睡觉'], ['play', '玩；打（球）'], ['ball', '球'], ['bike', '自行车'], ['now', '现在'], ['look', '看']],
    sentence: 'The children are playing with a ball.', sentenceMeaning: '孩子们正在玩球。',
    translate: ['你现在在做什么？', ['What are you doing now?', 'What are you doing?']],
    translate2: ['看！那只狗在游泳。', ['Look! The dog is swimming.', "Look! That dog is swimming.", "Look! The dog's swimming."]],
    grammarChoice: ['选择正确形式：Listen! Mia ___ .', ['is singing', 'sings', 'are singing'], 'is singing', '此刻正在发生，用 is + -ing。'],
    grammarText: ['写出 -ing 形式：run → ___', ['running'], 'run 双写 n 再加 -ing。'],
    listen: ["Where's Sam? He's in the park. He's riding his bike.", 'Sam 正在做什么？', ['骑自行车', '游泳', '读书'], '骑自行车'],
    dictation: ['She is writing a letter.', ['She is writing a letter.', "She's writing a letter."]],
    reading: ["Leo: Hi, Sam! Are you sleeping?\nSam: No, I'm not. I'm reading a comic.\nLeo: Come on! We're playing football in the park.\nSam: OK. I'm coming!", 'Sam 一开始在做什么？', ['看漫画', '睡觉', '踢足球'], '看漫画'],
    reviewGrammar: ['补全：They ___ swimming now.', ['are', "'re"], 'they 搭配 are。'],
    examAudio: ["Look at Mr Grant! He isn't sitting. He's running in the park.", 'Grant 先生正在做什么？', ['在公园跑步', '坐着', '睡觉'], '在公园跑步'],
    examSentence: ['Are you reading a book now?', '你现在在读书吗？'],
    drills: [
      c('写出 write 的 -ing 形式：', ['writing', 'writeing', 'writting'], 'writing', '以不发音 e 结尾，去 e 加 -ing。'),
      w('补全：I ___ not sleeping. I\'m reading.', ['am'], 'I 搭配 am。'),
      c('选择正确的问句：', ['What is she doing?', 'What she is doing?', 'What does she doing?'], 'What is she doing?', '特殊疑问句：疑问词 + be + 主语 + -ing。'),
      w('写出 -ing 形式：swim → ___', ['swimming'], 'swim 双写 m 再加 -ing。')
    ],
    examItems: [
      c('选择正确的句子：', ['The boys are sitting under a tree.', 'The boys are siting under a tree.', 'The boys is sitting under a tree.'], 'The boys are sitting under a tree.', 'sit → sitting（双写 t），复数主语用 are。'),
      w('补全：Look! It ___ raining.', ['is', "'s"], 'it 搭配 is。')
    ]
  },
  {
    id: 'en1-08', book: 1, title: '请把它递给我', goal: '祈使句、宾格代词、Which one?', place: 'kitchen', cast: ['rose', 'leo'],
    grammar: '祈使句用动词原形开头：Open the window. Give me the cup, please.\n否定祈使句：Don\'t + 动词原形：Don\'t close the door.\n宾格代词放在动词或介词后：me, you, him, her, it, us, them。Give it to me. Look at them.\n问“哪一个”：Which one? — The red one. 用 one/ones 代替前面的名词。',
    tips: 'please 放在句首或句末都很礼貌：Please sit down. / Sit down, please.',
    vocabulary: [['give', '给'], ['open', '打开'], ['close', '关上'], ['window', '窗户'], ['door', '门'], ['knife', '刀'], ['spoon', '勺子'], ['bread', '面包'], ['which', '哪一个'], ['please', '请']],
    sentence: 'Please give me the big spoon.', sentenceMeaning: '请把那把大勺子给我。',
    translate: ['请不要关门。', ["Please don't close the door.", "Don't close the door, please.", "Please do not close the door.", "Don't shut the door, please.", "Please don't shut the door."]],
    translate2: ['哪一把？——那把新的。', ['Which one? The new one.', 'Which one? — The new one.']],
    grammarChoice: ['选择正确的宾格：Where is Tom? I can\'t see ___.', ['him', 'he', 'his'], 'him', '动词 see 后用宾格 him。'],
    grammarText: ['补全：Give ___ to me, please.（它）', ['it'], '宾格 it。'],
    listen: ["Leo, please open the window. It's hot in here.", '奶奶让 Leo 做什么？', ['开窗', '关门', '递面包'], '开窗'],
    dictation: ["Don't open the door.", ["Don't open the door.", 'Do not open the door.']],
    reading: ["Grandma Rose: Leo, give me a knife, please.\nLeo: Which one? The big one?\nGrandma Rose: No, the small one. And some bread, too.\nLeo: Here you are.", '奶奶要哪一把刀？', ['小的那把', '大的那把', '新的那把'], '小的那把'],
    reviewGrammar: ['补全：These spoons are dirty. Please wash ___.（它们）', ['them'], '复数宾格 them。'],
    examAudio: ["Please don't close the window. Give me the spoons, please.", '说话人要什么？', ['勺子', '刀', '面包'], '勺子'],
    examSentence: ['Please open the door for us.', '请为我们开门。'],
    drills: [
      c('“别坐在那里！” 正确的是：', ["Don't sit there!", 'No sit there!', 'Not sit there!'], "Don't sit there!", '否定祈使句：Don\'t + 动词原形。'),
      w('补全：Please help ___.（我们）', ['us'], '宾格 us。'),
      c('选择：I like these shoes, but I want the black ___.', ['ones', 'one', 'it'], 'ones', '代替复数名词用 ones。'),
      w('补全：Mia is here. Give the bread to ___.（她）', ['her'], '宾格 her。')
    ],
    examItems: [
      c('选择正确的句子：', ['Look at them.', 'Look at they.', 'Look at their.'], 'Look at them.', '介词 at 后用宾格 them。'),
      w('补全：___ one is your coat? — The green one.', ['Which'], 'Which one? 问哪一个。')
    ]
  }
];
