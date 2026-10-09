import { c, w } from './items.mjs';
// Book 2 alignment: short original narratives in the past, then the grammar points NCE Book 2 develops.
export const book2 = [
  {
    id: 'en2-01', book: 2, title: '讲一个小故事', goal: '叙述过去：一般过去时 + 时间顺序词', place: 'street', cast: ['leo', 'bell'],
    grammar: '讲故事主要用一般过去时，按时间顺序串联：First, … Then, … After that, … Finally, …\n时间状语：one day, last Saturday, at that moment, soon, later, in the end。\nwhen 引导时间状语从句：When I got home, the door was open.\n讲故事时注意主句与从句都用过去时，不要混入现在时。',
    tips: '朗读故事时，在逗号和连接词前稍作停顿，让听者跟上时间顺序。',
    vocabulary: [['one day', '有一天'], ['suddenly', '突然'], ['then', '然后'], ['finally', '最后'], ['notice', '注意到'], ['shout', '喊叫'], ['wallet', '钱包'], ['crowd', '人群'], ['street', '街道'], ['hurry', '匆忙']],
    sentence: 'Suddenly a man shouted in the street.', sentenceMeaning: '突然一个男人在街上大喊。',
    translate: ['有一天我在公园里发现了一个钱包。', ['One day I found a wallet in the park.', 'One day, I found a wallet in the park.']],
    translate2: ['最后，警察把它还给了他。', ['Finally, the police gave it back to him.', 'Finally the police gave it back to him.', 'In the end, the police gave it back to him.', 'Finally, the police returned it to him.', 'Finally, the police officer gave it back to him.']],
    grammarChoice: ['选择正确的动词形式：When I ___ the door, the cat ran out.', ['opened', 'open', 'opens'], 'opened', '叙述过去事件用一般过去时。'],
    grammarText: ['写出过去式：hurry → ___', ['hurried'], '辅音 + y 变 i 加 -ed。'],
    listen: ['Last Saturday Leo went to the market. Suddenly he noticed a small dog. It was lost.', 'Leo 在市场注意到了什么？', ['一只走失的小狗', '一个钱包', '一位警察'], '一只走失的小狗'],
    dictation: ['Then she hurried home.', ['Then she hurried home.']],
    reading: ["A Wallet in the Snow\nOne cold morning, Leo was walking to the station. Suddenly he noticed a black wallet in the snow. There was a lot of money in it. First he looked around, but the street was empty. Then he took the wallet to the police station. Later that day, an old man phoned him. 'Thank you,' he said. 'There was a photo of my wife in it.'", '钱包里对老人最重要的是什么？', ['他妻子的照片', '很多钱', '火车票'], '他妻子的照片'],
    reviewGrammar: ['补全：After that, we ___ (have) dinner in a small cafe.', ['had'], 'have 的过去式是 had。'],
    examAudio: ['One evening Mia heard a noise in the kitchen. She went downstairs. It was only the cat!', '厨房里的声音是什么？', ['猫', '小偷', '奶奶'], '猫'],
    examSentence: ['Finally the crowd went home.', '最后人群回家了。'],
    drills: [
      c('哪个词最适合放在故事结尾？', ['Finally', 'First', 'One day'], 'Finally', 'finally / in the end 表示最后。'),
      w('写出过去式：notice → ___', ['noticed'], '以 e 结尾直接加 -d。'),
      c('选择：When we arrived, the film ___ .', ['began', 'begins', 'begin'], 'began', '叙述过去事件，begin 的过去式 began。'),
      w('写出过去式：shout → ___', ['shouted'], '规则动词加 -ed。')
    ],
    examItems: [
      c('选择时态一致的句子：', ['When he saw me, he smiled.', 'When he sees me, he smiled.', 'When he saw me, he smiles.'], 'When he saw me, he smiled.', '叙述过去时主从句都用过去时。'),
      w('写出过去式：catch → ___', ['caught'], 'catch 的过去式不规则：caught。')
    ]
  },
  {
    id: 'en2-02', book: 2, title: '图书馆里的冠词', goal: '冠词 a/an/the 与零冠词', place: 'library', cast: ['mia', 'grant'],
    grammar: 'a/an：第一次提到、泛指“一个”：I bought a book.\nthe：再次提到或双方都知道的特指：The book is about the sea.\n独一无二的事物用 the：the sun, the moon, the internet。\n零冠词：泛指复数或不可数名词（Books are useful. I like music.）、三餐和球类（have lunch, play tennis）、语言和学科（English, maths）、by + 交通工具（by bus）、go to school/bed/work（按用途）。\n乐器前一般用 the：play the piano。',
    tips: 'the 在元音音素前读 /ði/（the apple），在辅音前读 /ðə/（the book）。',
    vocabulary: [['library', '图书馆'], ['novel', '小说'], ['author', '作者'], ['shelf', '书架'], ['borrow', '借入'], ['return', '归还'], ['piano', '钢琴'], ['music', '音乐'], ['sun', '太阳'], ['dictionary', '词典']],
    sentence: 'I borrowed a novel from the library.', sentenceMeaning: '我从图书馆借了一本小说。',
    translate: ['她每天放学后弹钢琴。', ['She plays the piano after school every day.', 'Every day she plays the piano after school.', 'She plays the piano every day after school.']],
    translate2: ['我们坐公交去图书馆。', ['We go to the library by bus.', 'We take the bus to the library.', 'We went to the library by bus.', 'We took the bus to the library.']],
    grammarChoice: ['选择：I saw ___ old man. ___ man was carrying a dictionary.', ['an … The', 'a … A', 'the … An'], 'an … The', '第一次提到用 an，再次提到用 the。'],
    grammarText: ['补全（需要冠词时填写，不需要时填 -）：We have ___ lunch at twelve.', ['-'], '三餐前一般不用冠词。'],
    listen: ['Mia borrowed a dictionary and a novel. The novel was very long.', '哪本书很长？', ['那本小说', '那本词典', '两本都长'], '那本小说'],
    dictation: ['The sun is very bright today.', ['The sun is very bright today.']],
    reading: ["The Wrong Book\nLast week Mia went to the library to borrow a novel. She found a book on the top shelf and took it home. When she opened the book, she laughed. It wasn't a novel. It was a dictionary of music! The next day she returned it and asked the librarian for help.", 'Mia 带回家的其实是什么书？', ['一本音乐词典', '一本小说', '一本钢琴书'], '一本音乐词典'],
    reviewGrammar: ['补全：Can you play ___ guitar?（填冠词）', ['the'], '乐器前一般用 the。'],
    examAudio: ['Mr Grant goes to work by bike. He usually has breakfast in a small cafe. The cafe is near the station.', 'Grant 先生怎么上班？', ['骑自行车', '坐公交', '走路'], '骑自行车'],
    examSentence: ['The author of this novel lives in London.', '这本小说的作者住在伦敦。'],
    drills: [
      c('选择正确的句子：', ['I like music.', 'I like the musics.', 'I like a music.'], 'I like music.', '泛指不可数名词不用冠词。'),
      w('补全冠词：Look at ___ moon!', ['the'], '独一无二的事物用 the。'),
      c('选择：She is ___ honest girl.', ['an', 'a', 'the'], 'an', 'honest 的 h 不发音，以元音音素开头。'),
      w('补全（不需要时填 -）：They play ___ football on Sundays.', ['-'], '球类运动前不用冠词。')
    ],
    examItems: [
      c('选择正确的句子：', ['Leo goes to school by train.', 'Leo goes to the school by a train.', 'Leo goes to school by the train.'], 'Leo goes to school by train.', 'go to school 与 by + 交通工具 都不用冠词。'),
      w('补全冠词：I bought a cake and ___ milk. The cake was delicious.（一些）', ['some'], '不可数名词用 some 表示“一些”。')
    ]
  },
  {
    id: 'en2-03', book: 2, title: '雨中的停电', goal: '过去进行时：was/were doing，与 when/while 连用', place: 'home', cast: ['rose', 'sam'],
    grammar: '过去进行时表示过去某一时刻正在进行的动作：At eight last night I was reading.\n长动作（过去进行时）被短动作（一般过去时）打断：I was watching TV when the lights went out.\nwhile + 进行中的长动作：While Grandma was cooking, Sam was doing his homework.\n否定：wasn\'t / weren\'t + -ing；疑问：What were you doing at nine?',
    tips: '听力中 was 常弱读 /wəz/，注意结合后面的 -ing 判断时态。',
    vocabulary: [['storm', '暴风雨'], ['while', '当……的时候'], ['candle', '蜡烛'], ['light', '灯；光'], ['dark', '黑暗的'], ['cook', '烹饪'], ['noise', '噪音'], ['wind', '风'], ['window', '窗户'], ['moment', '时刻']],
    sentence: 'We were having dinner when the lights went out.', sentenceMeaning: '我们正在吃晚饭时，灯灭了。',
    translate: ['昨晚九点你在做什么？', ['What were you doing at nine last night?', 'What were you doing at nine o\'clock last night?', 'What were you doing last night at nine?', "What were you doing at 9 last night?"]],
    translate2: ['奶奶做饭的时候，我在写作业。', ['While Grandma was cooking, I was doing my homework.', 'I was doing my homework while Grandma was cooking.', 'When Grandma was cooking, I was doing my homework.']],
    grammarChoice: ['选择：I ___ a bath when the phone rang.', ['was having', 'had', 'am having'], 'was having', '被打断的长动作用过去进行时。'],
    grammarText: ['补全：They ___ playing cards at that moment.', ['were'], 'they 搭配 were + -ing。'],
    listen: ['While Sam was reading, the wind suddenly opened the window.', '风打开窗户时 Sam 在做什么？', ['读书', '睡觉', '做饭'], '读书'],
    dictation: ['It was raining hard all night.', ['It was raining hard all night.']],
    reading: ["The Night of the Storm\nIt was a dark and windy night. Grandma Rose was cooking soup and Sam was watching a film. Suddenly there was a loud noise and all the lights went out. 'Don't worry,' said Grandma. She found some candles while Sam was looking for a torch. They ate the soup by candlelight. It was the best dinner of the year.", '停电后他们怎么吃晚饭？', ['点着蜡烛', '去了餐厅', '没吃晚饭'], '点着蜡烛'],
    reviewGrammar: ['补全：While I ___ (walk) home, I met an old friend.', ['was walking'], 'while 后接过去进行时的长动作。'],
    examAudio: ['At seven o\'clock Mia was not sleeping. She was writing an email to her cousin.', '七点时 Mia 在做什么？', ['写电子邮件', '睡觉', '打电话'], '写电子邮件'],
    examSentence: ['The children were sleeping when the storm began.', '暴风雨开始时孩子们正在睡觉。'],
    drills: [
      c('选择：What ___ you doing when I called?', ['were', 'was', 'did'], 'were', 'you 搭配 were。'),
      w('补全：It ___ snowing when we left.（单数）', ['was'], 'it 搭配 was。'),
      c('选择正确的句子：', ['The light went out while I was cooking.', 'The light was going out while I cooked suddenly.', 'The light goes out while I was cooking.'], 'The light went out while I was cooking.', '短动作用一般过去时，长动作用过去进行时。'),
      w('补全否定：We ___ watching TV. We were reading.', ["weren't", 'were not'], '否定 weren\'t + -ing。')
    ],
    examItems: [
      c('选择：He ___ when he fell off his bike.', ['was riding fast', 'rode fast was', 'is riding fast'], 'was riding fast', '被打断的长动作用过去进行时。'),
      w('补全：While Dad ___ (wash) the car, it started to rain.', ['was washing'], 'while 后用过去进行时。')
    ]
  },
  {
    id: 'en2-04', book: 2, title: '在公司工作多久了？', goal: '现在完成时与一般过去时对比、for / since', place: 'office', cast: ['grant', 'lin'],
    grammar: 'for + 一段时间：for three years；since + 起点：since 2020, since last May, since I was a child。\n从过去持续到现在：I have worked here for five years. She has lived in Leeds since 2019.\n问持续多久：How long have you known her?\n已结束的过去时间用一般过去时：I started this job in 2021.（不说 have started in 2021）\n短暂动词不能和 for/since 连用持续：buy → have had，come → have been here。',
    tips: '时间线小技巧：有明确过去时间点（when, ago, in 2020）→ 一般过去时；与现在有关、无具体时间或 for/since → 现在完成时。',
    vocabulary: [['since', '自从'], ['company', '公司'], ['manager', '经理'], ['meeting', '会议'], ['office', '办公室'], ['colleague', '同事'], ['email', '电子邮件'], ['month', '月份'], ['year', '年'], ['know', '认识；知道']],
    sentence: 'She has worked for this company since 2018.', sentenceMeaning: '她从 2018 年起就在这家公司工作。',
    translate: ['你认识她多久了？', ['How long have you known her?']],
    translate2: ['我在这里住了三年了。', ['I have lived here for three years.', "I've lived here for three years.", "I have been living here for three years.", "I've been living here for three years."]],
    grammarChoice: ['选择：I have been a manager ___ last June.', ['since', 'for', 'ago'], 'since', 'since + 时间起点。'],
    grammarText: ['补全：They have known each other ___ ten years.', ['for'], 'for + 一段时间。'],
    listen: ["Dr Lin has worked at this hospital for twelve years. She came here in 2014.", '林医生在这家医院工作了多少年？', ['十二年', '十四年', '两年'], '十二年'],
    dictation: ["We've had a meeting since nine.", ["We've had a meeting since nine.", 'We have had a meeting since nine.']],
    reading: ["New in the Office\nMr Grant's daughter started a new job last month. She has worked at a small travel company since then. She has already met all her colleagues and she has written more than a hundred emails! 'I haven't had a holiday yet,' she says, 'but I love this job.'", '她什么时候开始新工作的？', ['上个月', '去年', '十年前'], '上个月'],
    reviewGrammar: ['补全：I ___ (buy) this car in 2020.', ['bought'], '有具体过去时间 in 2020，用一般过去时。'],
    examAudio: ["How long have you been in this office? Since eight o'clock this morning!", '说话人从几点开始在办公室？', ['早上八点', '下午八点', '九点'], '早上八点'],
    examSentence: ['How long has he been a manager?', '他当经理多久了？'],
    drills: [
      c('选择正确的句子：', ['I have had this phone for two years.', 'I have bought this phone for two years.', 'I bought this phone since two years.'], 'I have had this phone for two years.', '持续状态用 have had，短暂动词 buy 不与 for 连用。'),
      w('补全：She has been ill ___ Monday.', ['since'], 'since + 起点。'),
      c('选择：When ___ you start learning English?', ['did', 'have', 'has'], 'did', '问具体过去时间用一般过去时。'),
      w('补全：We have ___ (be) friends for a long time.', ['been'], 'be 的过去分词 been。')
    ],
    examItems: [
      c('选择正确的句子：', ['He moved to Leeds two years ago.', 'He has moved to Leeds two years ago.', 'He has moved to Leeds since two years.'], 'He moved to Leeds two years ago.', 'ago 表示具体过去时间，用一般过去时。'),
      w('补全：I haven\'t seen him ___ last Christmas.', ['since'], 'since + 起点。')
    ]
  },
  {
    id: 'en2-05', book: 2, title: '火车已经开走了', goal: '过去完成时：had + 过去分词', place: 'station', cast: ['leo', 'mia'],
    grammar: '过去完成时表示“过去的过去”：在过去某一动作之前已经完成的事。\nWhen we arrived at the station, the train had left.（先开走，后到达）\n常与 by the time, before, after, already 连用：By the time I got home, everyone had gone to bed.\n结构对所有人称都一样：had + 过去分词；否定 hadn\'t。',
    tips: "I'd 可能是 I had 也可能是 I would，看后面是过去分词还是动词原形。",
    vocabulary: [['platform', '站台'], ['miss', '错过'], ['already', '已经'], ['before', '在……之前'], ['after', '在……之后'], ['passenger', '乘客'], ['announce', '宣布'], ['delay', '延误'], ['journey', '旅程'], ['realise', '意识到']],
    sentence: 'The train had already left the platform.', sentenceMeaning: '火车已经离开了站台。',
    translate: ['我们到达时，电影已经开始了。', ['When we arrived, the film had already started.', 'When we arrived, the film had started.', 'The film had already started when we arrived.', 'The film had started when we arrived.', 'When we got there, the film had already started.', 'When we arrived, the movie had already started.']],
    translate2: ['他意识到自己把票落在家里了。', ['He realised that he had left his ticket at home.', 'He realised he had left his ticket at home.', 'He realized that he had left his ticket at home.', 'He realized he had left his ticket at home.']],
    grammarChoice: ['选择：By the time Mia woke up, her brother ___ to school.', ['had gone', 'has gone', 'goes'], 'had gone', '在过去某时之前已完成，用过去完成时。'],
    grammarText: ['补全：After she ___ (finish) her work, she went home.', ['had finished'], '先完成的动作用 had + 过去分词。'],
    listen: ['When Leo reached the platform, the train had already gone. He had missed it by one minute.', 'Leo 错过火车多久？', ['一分钟', '十分钟', '一小时'], '一分钟'],
    dictation: ['The journey had been very long.', ['The journey had been very long.']],
    reading: ["Just in Time?\nLeo ran into the station at 9:58. He had bought his ticket online the night before, so he went straight to Platform 4. But the platform was empty. A voice announced, 'The 10:00 train to York has a delay of twenty minutes.' Leo sat down and laughed. He had run all the way for nothing.", 'Leo 为什么最后笑了？', ['他白跑了，火车延误了', '他赶上了火车', '他买错了票'], '他白跑了，火车延误了'],
    reviewGrammar: ['补全：I ___ never seen the sea before I visited Qingdao.', ['had'], '过去某时之前的经历用 had + 过去分词。'],
    examAudio: ["The passengers were angry because the plane hadn't arrived on time.", '乘客为什么生气？', ['飞机没有准时到', '火车开走了', '票卖完了'], '飞机没有准时到'],
    examSentence: ['She had never travelled by plane before.', '她以前从未坐过飞机。'],
    drills: [
      c('哪件事先发生？ When I got to the cafe, Mia had left.', ['Mia 离开', '我到达咖啡馆', '同时发生'], 'Mia 离开', 'had left 发生在 got to 之前。'),
      w('补全否定：He ___ eaten anything, so he was hungry.', ["hadn't", 'had not'], '否定 hadn\'t + 过去分词。'),
      c('选择：The shop ___ when we got there.', ['had closed', 'has closed', 'closes'], 'had closed', '在过去某一时刻之前已发生。'),
      w('写出过去分词：leave → ___', ['left'], 'leave 的过去分词 left。')
    ],
    examItems: [
      c('选择正确的句子：', ['I realised that I had lost my wallet.', 'I realised that I have lost my wallet yesterday.', 'I realise that I had lost my wallet.'], 'I realised that I had lost my wallet.', '“过去的过去”用过去完成时。'),
      w('补全：By six o\'clock, they ___ (cook) dinner.', ['had cooked'], 'by + 过去时间点，用过去完成时。')
    ]
  },
  {
    id: 'en2-06', book: 2, title: '这座桥是什么时候建的？', goal: '被动语态：be + 过去分词', place: 'countryside', cast: ['grant', 'sam'],
    grammar: '当动作的承受者更重要时用被动语态：be + 过去分词。\n一般现在时：English is spoken here. 一般过去时：The bridge was built in 1890.\n现在完成时：The road has been repaired. 情态动词：It must be done today.\n要提到动作执行者时用 by：The letter was written by my grandfather.\n只有及物动词才有被动语态。',
    tips: '听被动语态时抓住 was/were/is + -ed 或不规则过去分词（built, made, sold）。',
    vocabulary: [['build', '建造'], ['bridge', '桥'], ['farm', '农场'], ['grow', '种植'], ['repair', '修理'], ['village', '村庄'], ['visitor', '游客'], ['invent', '发明'], ['sell', '出售'], ['send', '寄；发送']],
    sentence: 'This old bridge was built in 1890.', sentenceMeaning: '这座旧桥建于 1890 年。',
    translate: ['这个村子里种了很多苹果。', ['A lot of apples are grown in this village.', 'Many apples are grown in this village.', 'Lots of apples are grown in this village.']],
    translate2: ['这封信是我爷爷写的。', ['This letter was written by my grandfather.', 'The letter was written by my grandfather.', 'This letter was written by my grandpa.']],
    grammarChoice: ['选择：The road ___ last month.', ['was repaired', 'repaired', 'is repairing'], 'was repaired', '路被修，过去时被动：was + 过去分词。'],
    grammarText: ['补全：English ___ spoken all over the world.', ['is'], '一般现在时被动：is + 过去分词。'],
    listen: ['The old farm was sold last year. Now it is visited by many tourists.', '农场去年怎么了？', ['被卖掉了', '被烧毁了', '被修好了'], '被卖掉了'],
    dictation: ['The parcel was sent yesterday.', ['The parcel was sent yesterday.']],
    reading: ["The Bridge Over the River\nThe small stone bridge in our village was built more than a hundred years ago. Last winter it was badly damaged by a storm. For three months, the village children were taken to school by boat! In spring the bridge was repaired, and now it is used by hundreds of people every day.", '冬天桥坏了以后，孩子们怎么上学？', ['坐船', '走路过桥', '不上学'], '坐船'],
    reviewGrammar: ['写出过去分词：build → ___', ['built'], 'build 的过去分词 built。'],
    examAudio: ['Many visitors come to the village every summer. They are shown around by the farmers.', '是谁带游客参观？', ['农民', '老师', '孩子们'], '农民'],
    examSentence: ['The telephone was invented in 1876.', '电话是 1876 年发明的。'],
    drills: [
      c('选择：These cars ___ in Germany.', ['are made', 'make', 'are making'], 'are made', '车被制造，用被动 are made。'),
      w('补全：The window ___ broken by a ball yesterday.', ['was'], '过去时被动 was + 过去分词。'),
      c('选择正确的被动句：', ['The house has been sold.', 'The house has sold by.', 'The house has been sell.'], 'The house has been sold.', '现在完成时被动：has been + 过去分词。'),
      w('写出过去分词：grow → ___', ['grown'], 'grow 的过去分词 grown。')
    ],
    examItems: [
      c('把 “Someone stole my bike.” 改为被动：', ['My bike was stolen.', 'My bike is stealing.', 'My bike stolen.'], 'My bike was stolen.', '过去时被动：was + stolen。'),
      w('补全：This work must ___ done today.', ['be'], '情态动词被动：must be + 过去分词。')
    ]
  },
  {
    id: 'en2-07', book: 2, title: '如果明天下雨……', goal: '条件句：if + 现在时 / will（真实条件）与 if + 过去时 / would（假设）', place: 'park', cast: ['mia', 'leo', 'sam'],
    grammar: '真实条件（第一类）：If it rains tomorrow, we will stay at home. if 从句用一般现在时，主句用 will + 原形。\n普遍事实（零类）：If you heat ice, it melts.\n假设、与现在事实相反（第二类）：If I had a lot of money, I would buy a farm. if 从句用一般过去时（be 常用 were），主句用 would + 原形。If I were you, I would…（给建议）\nunless = if not：We will go unless it rains.',
    tips: "I'd = I would（后接原形）。If I were you 是很常见的建议句型。",
    vocabulary: [['if', '如果'], ['unless', '除非'], ['picnic', '野餐'], ['cancel', '取消'], ['rich', '富有的'], ['would', '将会（虚拟）'], ['umbrella', '雨伞'], ['decide', '决定'], ['wet', '湿的'], ['warm', '温暖的']],
    sentence: 'If it rains, we will cancel the picnic.', sentenceMeaning: '如果下雨，我们就取消野餐。',
    translate: ['如果我是你，我会带上雨伞。', ['If I were you, I would take an umbrella.', "If I were you, I'd take an umbrella.", 'If I were you, I would bring an umbrella.', "If I were you, I'd bring an umbrella.", 'If I was you, I would take an umbrella.']],
    translate2: ['除非下雨，否则我们去野餐。', ['We will have a picnic unless it rains.', "We'll have a picnic unless it rains.", 'Unless it rains, we will have a picnic.', "Unless it rains, we'll have a picnic.", "We'll go on a picnic unless it rains.", 'We will go for a picnic unless it rains.', "We'll go for a picnic unless it rains."]],
    grammarChoice: ['选择：If you ___ now, you will catch the bus.', ['leave', 'will leave', 'left'], 'leave', '第一类条件句 if 从句用一般现在时。'],
    grammarText: ['补全：If I ___ rich, I would travel around the world.', ['were', 'was'], '与现在事实相反，be 用 were（口语也可 was）。'],
    listen: ["If it's warm on Saturday, we'll have a picnic by the lake.", '周六暖和的话，他们会做什么？', ['湖边野餐', '待在家', '去游泳'], '湖边野餐'],
    dictation: ["I would help you if I could.", ['I would help you if I could.', "I'd help you if I could."]],
    reading: ["Plan B\nThe children had planned a picnic for Sunday. 'If it rains, we'll cancel it,' said Mia. On Sunday morning the sky was grey. Sam looked out of the window. 'If we had a big tent, we could have the picnic in the rain!' Leo had a better idea. They decided to have the picnic on the living room floor.", '最后他们在哪里野餐？', ['客厅地板上', '湖边', '帐篷里'], '客厅地板上'],
    reviewGrammar: ['补全：If you heat water to 100°C, it ___ (boil).', ['boils'], '普遍事实：if + 现在时，主句也用现在时。'],
    examAudio: ["Sam says if he had a dog, he would walk it every day.", 'Sam 说如果有狗他会怎样？', ['每天遛它', '给它洗澡', '不会养'], '每天遛它'],
    examSentence: ['If you are tired, you should go to bed.', '如果你累了，就该去睡觉。'],
    drills: [
      c('选择：We will be late unless we ___ now.', ['hurry', 'will hurry', 'hurried'], 'hurry', 'unless 从句用一般现在时表将来。'),
      w('补全：If I had time, I ___ learn to play the piano.', ['would', "'d"], '假设句主句用 would + 原形。'),
      c('与现在事实相反：', ['If she lived near here, she would visit us more often.', 'If she lives near here, she would visit us more often.', 'If she lived near here, she will visit us more often.'], 'If she lived near here, she would visit us more often.', 'if + 过去时，主句 would + 原形。'),
      w('补全：If it ___ (be) sunny tomorrow, we will go swimming.', ['is'], '第一类条件句 if 从句用一般现在时。')
    ],
    examItems: [
      c('选择正确的建议：', ["If I were you, I'd see a doctor.", 'If I am you, I will see a doctor.', "If I were you, I'll see a doctor."], "If I were you, I'd see a doctor.", 'If I were you, I would… 给建议。'),
      w('补全：You will get wet ___ you take an umbrella.（除非）', ['unless'], 'unless = if not。')
    ]
  },
  {
    id: 'en2-08', book: 2, title: '她说了什么？', goal: '间接引语：时态后移、人称与时间词变化', place: 'office', cast: ['lin', 'leo'],
    grammar: '直接引语：Mia said, "I am tired." → 间接引语：Mia said (that) she was tired.\n主句是过去时（said/told）时，从句时态通常后移：am/is → was，will → would，can → could，现在完成时/过去时 → 过去完成时。\n人称和时间地点随之变化：today → that day，tomorrow → the next day，here → there。\ntell sb that…；ask sb if/whether…；ask sb to do sth：She asked me to close the door.\n间接疑问句用陈述语序：He asked where I lived.',
    tips: 'say 后不直接接人（said to me），tell 后直接接人（told me）。',
    vocabulary: [['say', '说'], ['tell', '告诉'], ['ask', '问；请求'], ['reply', '回答'], ['explain', '解释'], ['message', '消息'], ['busy', '忙的'], ['appointment', '预约'], ['advice', '建议'], ['repeat', '重复']],
    sentence: 'She told me that she was busy.', sentenceMeaning: '她告诉我她很忙。',
    translate: ['医生让我多喝水。', ['The doctor told me to drink more water.', 'The doctor asked me to drink more water.', 'The doctor told me to drink plenty of water.', 'The doctor told me to drink a lot of water.']],
    translate2: ['他问我住在哪里。', ['He asked me where I lived.', 'He asked where I lived.', 'He asked me where I live.']],
    grammarChoice: ['Leo said, "I will call you." 的间接引语：', ['Leo said that he would call me.', 'Leo said that I will call you.', 'Leo said me he would call.'], 'Leo said that he would call me.', 'will → would，人称随之变化。'],
    grammarText: ['补全：She ___ me that the shop was closed.（告诉）', ['told'], 'tell 的过去式 told，后面直接接人。'],
    listen: ["Dr Lin said that Leo's appointment was at three o'clock the next day.", '预约在什么时候？', ['第二天三点', '今天三点', '第二天十点'], '第二天三点'],
    dictation: ['He asked me to repeat the message.', ['He asked me to repeat the message.']],
    reading: ["A Message for Dr Lin\nWhen Dr Lin came back from lunch, the nurse gave her a message. 'Mr Hill phoned,' she explained. 'He said he couldn't come today because his car had broken down. He asked if he could come tomorrow morning.' Dr Lin smiled and told the nurse to book him in for nine o'clock.", 'Hill 先生为什么今天来不了？', ['他的车坏了', '他生病了', '他太忙'], '他的车坏了'],
    reviewGrammar: ['把 can 后移：Mia said she ___ swim.', ['could'], 'can → could。'],
    examAudio: ['My teacher asked me if I had finished my homework. I said I had.', '老师问了什么？', ['作业是否完成了', '住在哪里', '几点上课'], '作业是否完成了'],
    examSentence: ['He asked me where the station was.', '他问我车站在哪里。'],
    drills: [
      c('选择正确的间接疑问句：', ['She asked me what time it was.', 'She asked me what time was it.', 'She asked me what time is it?'], 'She asked me what time it was.', '间接疑问句用陈述语序。'),
      w('补全：He asked me ___ I liked coffee.（是否）', ['if', 'whether'], '一般疑问句转间接引语用 if/whether。'),
      c('选择：Tom ___, "I\'m hungry."', ['said', 'told', 'asked to'], 'said', '直接引语前用 said。'),
      w('补全："Close the door, please," she said. → She asked me ___ close the door.', ['to'], 'ask sb to do sth。')
    ],
    examItems: [
      c('"I have lost my key," Mia said. 的间接引语：', ['Mia said that she had lost her key.', 'Mia said that I have lost my key.', 'Mia told that she lost her key.'], 'Mia said that she had lost her key.', '现在完成时后移为过去完成时。'),
      w('时间词转换：tomorrow → the ___ day', ['next', 'following'], 'tomorrow 在间接引语中变为 the next/following day。')
    ]
  },
  {
    id: 'en2-09', book: 2, title: '那个戴红帽子的人', goal: '定语从句：who / which / that / whose', place: 'cafe', cast: ['ada', 'mia'],
    grammar: '定语从句修饰前面的名词：\nwho 指人：The woman who runs this cafe is very kind.\nwhich 指物：This is the cake which I made.\nthat 可指人或物（非正式时常用）：the bus that goes to the airport。\nwhose 表示所属：the boy whose bike was stolen。\n关系代词在从句中作宾语时可以省略：The book (that) I am reading is great.',
    tips: '朗读时定语从句与先行词连在一起读，不要在 who/which 前停顿太久。',
    vocabulary: [['who', '（指人的）关系代词'], ['which', '（指物的）关系代词'], ['whose', '……的（所属）'], ['waiter', '服务员'], ['menu', '菜单'], ['customer', '顾客'], ['order', '点菜；订购'], ['recipe', '食谱'], ['delicious', '美味的'], ['table', '桌子']],
    sentence: 'The cake which you made was delicious.', sentenceMeaning: '你做的蛋糕很好吃。',
    translate: ['那个戴红帽子的男人是我叔叔。', ['The man who is wearing a red hat is my uncle.', 'The man with the red hat is my uncle.', 'The man who wears a red hat is my uncle.', 'The man in the red hat is my uncle.', 'The man that is wearing a red hat is my uncle.', 'The man with a red hat is my uncle.']],
    translate2: ['这是我最喜欢的食谱。', ['This is my favourite recipe.', 'This is my favorite recipe.', 'This is the recipe that I like best.', 'This is the recipe which I like best.', 'This is the recipe I like best.']],
    grammarChoice: ['选择：The waiter ___ served us was very friendly.', ['who', 'which', 'whose'], 'who', '先行词是人，作主语用 who。'],
    grammarText: ['补全：This is the woman ___ son is a doctor.', ['whose'], 'whose 表示所属关系。'],
    listen: ['The customer who ordered the fish is sitting at the table near the window.', '点鱼的顾客坐在哪里？', ['靠窗的桌子', '门口', '吧台'], '靠窗的桌子'],
    dictation: ['The menu that they gave us was long.', ['The menu that they gave us was long.', 'The menu which they gave us was long.', 'The menu they gave us was long.']],
    reading: ["The Secret Recipe\nAda runs a small cafe which is famous for its apple cake. Every customer who tries the cake asks for the recipe. Ada always smiles and says, 'The recipe is a secret which my grandmother gave me.' Last week a girl whose mother is a cook guessed one of the secrets: a little bit of cheese!", '那个女孩猜到的秘密配料是什么？', ['一点奶酪', '很多糖', '柠檬'], '一点奶酪'],
    reviewGrammar: ['补全：I lost the umbrella ___ you gave me.（指物）', ['which', 'that'], '先行词是物，用 which/that（也可省略，但此处请填写）。'],
    examAudio: ['The waiter who works on Sundays is a student. He comes from Spain.', '周日上班的服务员是什么人？', ['一名学生', '厨师', '店主'], '一名学生'],
    examSentence: ['The woman who runs this cafe is very kind.', '经营这家咖啡馆的女人很和善。'],
    drills: [
      c('选择：This is the bus ___ goes to the airport.', ['that', 'who', 'whose'], 'that', '先行词是物，用 that/which。'),
      w('补全：The boy ___ bike was stolen called the police.', ['whose'], 'whose + 名词表示所属。'),
      c('哪个句子可以省略关系代词？', ['The film (that) we saw was funny.', 'The man (who) lives here is a nurse.', 'The dog (which) barks all night is ours.'], 'The film (that) we saw was funny.', '关系代词在从句中作宾语时才能省略。'),
      w('补全：People ___ live in glass houses should not throw stones.（指人）', ['who', 'that'], '先行词是人，用 who/that。')
    ],
    examItems: [
      c('选择正确的句子：', ['The recipe which she wrote is very easy.', 'The recipe who she wrote is very easy.', 'The recipe which she wrote it is very easy.'], 'The recipe which she wrote is very easy.', 'which 已代替宾语，从句中不能再加 it。'),
      w('补全：Do you know the girl ___ is talking to Mia?（指人）', ['who', 'that'], '先行词是人，作主语用 who/that。')
    ]
  },
  {
    id: 'en2-10', book: 2, title: '小侦探的推理', goal: '情态推测 must / might / can\'t 与 used to', place: 'street', cast: ['bell', 'sam', 'leo'],
    grammar: '对现在的推测：must（一定，很有把握）、might/may/could（可能）、can\'t（不可能）。\nThe lights are on. Someone must be at home. She can\'t be ill — I saw her running this morning.\n对过去的推测：must/might/can\'t + have + 过去分词：He must have forgotten.\nused to + 原形表示过去的习惯或状态（现在不再如此）：I used to live in a village. Did you use to…? I didn\'t use to like fish.',
    tips: "must have 常连读为 /ˈmʌstəv/，听起来像 \"musta\"。",
    vocabulary: [['must', '一定（推测）'], ['might', '可能'], ['clue', '线索'], ['footprint', '脚印'], ['thief', '小偷'], ['steal', '偷'], ['used to', '过去常常'], ['detective', '侦探'], ['probably', '大概'], ['mystery', '谜']],
    sentence: 'The thief must have climbed through the window.', sentenceMeaning: '小偷一定是从窗户爬进来的。',
    translate: ['我以前住在乡下。', ['I used to live in the countryside.', 'I used to live in the country.']],
    translate2: ['这不可能是 Leo 的，他没有红色的包。', ["This can't be Leo's. He doesn't have a red bag.", "This can't be Leo's. He hasn't got a red bag.", "It can't be Leo's. He doesn't have a red bag.", "It can't be Leo's. He hasn't got a red bag.", "This cannot be Leo's. He doesn't have a red bag."]],
    grammarChoice: ['地上全是湿脚印：', ['Someone must have come in from the rain.', 'Someone can\'t come in from the rain.', 'Someone used to come in from the rain.'], 'Someone must have come in from the rain.', '根据证据有把握地推测过去，用 must have + 过去分词。'],
    grammarText: ['补全：Sam ___ to be afraid of dogs, but now he loves them.', ['used'], 'used to 表示过去的状态，现在不再如此。'],
    listen: ["Officer Bell said the thief might be a young man, because the footprints were small and fast.", '警官认为小偷可能是谁？', ['一个年轻男子', '一位老人', '一个孩子'], '一个年轻男子'],
    dictation: ['It might rain this afternoon.', ['It might rain this afternoon.']],
    reading: ["The Missing Cake\nWhen Grandma came home, the cake on the kitchen table had gone. 'It can't have been the cat,' said Sam. 'The cat was asleep upstairs.' Leo found a clue: small, muddy footprints. 'Somebody must have come in from the garden,' he said. Just then they heard a noise. A happy dog was sitting under the table, with cream all over its nose!", '是谁吃了蛋糕？', ['一只狗', '猫', '小偷'], '一只狗'],
    reviewGrammar: ['补全：He isn\'t answering. He ___ be asleep.（可能）', ['might', 'may', 'could', 'must'], '推测可能性用 might/may/could；很有把握用 must。'],
    examAudio: ["When I was young, I used to walk to school. Now I take the bus.", '说话人以前怎么上学？', ['走路', '坐公交', '骑车'], '走路'],
    examSentence: ['The detective found an important clue.', '侦探找到了一条重要线索。'],
    drills: [
      c('她刚吃过一大份饭：', ["She can't be hungry.", 'She must be hungry.', 'She used to be hungry.'], "She can't be hungry.", '有把握地否定推测用 can\'t。'),
      w('补全：Did you ___ to play football?（used to 的疑问形式）', ['use'], 'Did you use to…? 疑问句中用 use。'),
      c('对过去的推测：', ['He might have missed the bus.', 'He might missed the bus.', 'He might has missed the bus.'], 'He might have missed the bus.', 'might have + 过去分词。'),
      w('补全：The ground is wet. It ___ have rained last night.（一定）', ['must'], '有把握的推测用 must。')
    ],
    examItems: [
      c('选择正确的句子：', ['I used to have long hair.', 'I use to have long hair.', 'I used to had long hair.'], 'I used to have long hair.', 'used to + 动词原形。'),
      w('补全：That ___ be Ada at the door. She\'s on holiday in Spain.（不可能）', ["can't", 'cannot'], "不可能用 can't。")
    ]
  }
];
