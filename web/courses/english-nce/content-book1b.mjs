import { c, w } from './items.mjs';

export const book1b = [
  {
    id: 'en1-09', book: 1, title: '我的一天', goal: '一般现在时：日常习惯、第三人称单数、频率副词', place: 'bedroom', cast: ['sam', 'rose'],
    grammar: '一般现在时表示习惯和经常发生的事：I get up at seven. We walk to school.\n第三人称单数（he/she/it）动词加 -s/-es：She works. He watches TV. It goes. have → has。\n否定和疑问借助 do/does：I don\'t like tea. Does he play tennis? — Yes, he does.\n频率副词放在实义动词前、be 动词后：I always get up early. She is never late.',
    tips: '时间表达：at seven o\'clock, at half past six, in the morning, on Sunday。',
    vocabulary: [['get up', '起床'], ['breakfast', '早餐'], ['always', '总是'], ['usually', '通常'], ['never', '从不'], ['morning', '早上'], ['evening', '晚上'], ['work', '工作；上班'], ['bus', '公共汽车'], ['homework', '家庭作业']],
    sentence: 'Sam usually goes to school by bus.', sentenceMeaning: 'Sam 通常坐公共汽车上学。',
    translate: ['我每天七点起床。', ['I get up at seven every day.', "I get up at seven o'clock every day.", 'Every day I get up at seven.', "Every day I get up at seven o'clock."]],
    translate2: ['她晚上不看电视。', ["She doesn't watch TV in the evening.", 'She does not watch TV in the evening.', "She doesn't watch television in the evening.", "She doesn't watch TV in the evenings."]],
    grammarChoice: ['选择正确形式：My father ___ to work by car.', ['goes', 'go', 'going'], 'goes', '第三人称单数 go → goes。'],
    grammarText: ['补全：___ your sister like milk? — Yes, she does.', ['Does'], '第三人称单数疑问句用 Does。'],
    listen: ['Grandma Rose always gets up at six. She has breakfast at seven.', '奶奶几点吃早餐？', ['七点', '六点', '八点'], '七点'],
    dictation: ['He never drinks coffee.', ['He never drinks coffee.']],
    reading: ["Sam's day\nI get up at seven. I have breakfast with Grandma. Then I go to school by bus. In the evening I do my homework. I never go to bed late.", 'Sam 晚上做什么？', ['写作业', '坐公交', '吃早餐'], '写作业'],
    reviewGrammar: ['写出第三人称单数：watch → ___', ['watches'], '以 ch 结尾加 -es。'],
    examAudio: ["Mia usually walks to school, but on Monday she goes by bike.", 'Mia 周一怎么上学？', ['骑自行车', '走路', '坐公交'], '骑自行车'],
    examSentence: ['She is never late for work.', '她上班从不迟到。'],
    drills: [
      c('选择正确的否定句：', ["I don't like coffee.", "I doesn't like coffee.", 'I not like coffee.'], "I don't like coffee.", 'I 的否定用 don\'t。'),
      w('写出第三人称单数：have → ___', ['has'], 'have 的第三人称单数是 has。'),
      c('频率副词的位置：', ['We always have lunch at one.', 'We have always lunch at one.', 'Always we have lunch at one o.'], 'We always have lunch at one.', '频率副词放在实义动词前。'),
      w('补全：Leo ___ (play) football on Saturday.', ['plays'], '第三人称单数 + -s。')
    ],
    examItems: [
      c('选择正确的问句：', ['Does he work in an office?', 'Do he work in an office?', 'Does he works in an office?'], 'Does he work in an office?', 'Does + 主语 + 动词原形。'),
      w('写出第三人称单数：study → ___', ['studies'], '辅音字母 + y，变 y 为 i 加 -es。')
    ]
  },
  {
    id: 'en1-10', book: 1, title: '去街角小店', goal: '可数与不可数名词、some/any、How much / How many', place: 'shop', cast: ['ada', 'leo'],
    grammar: '可数名词有单复数：an apple, two apples；不可数名词没有复数：milk, bread, rice, water, money。\n肯定句用 some，否定和疑问一般用 any；礼貌地提供或请求时问句也用 some：Would you like some tea?\nHow many + 可数复数：How many eggs?　How much + 不可数：How much milk? 问价格：How much is it? / How much are they?\n计量不可数名词：a bottle of milk, a loaf of bread, a kilo of rice, a cup of tea。',
    tips: '购物常用：I\'d like…（我想要……），Here you are.（给你。），That\'s two pounds fifty.',
    vocabulary: [['apple', '苹果'], ['rice', '大米；米饭'], ['cheese', '奶酪'], ['bottle', '瓶子'], ['kilo', '公斤'], ['money', '钱'], ['cheap', '便宜的'], ['expensive', '贵的'], ['pound', '英镑'], ['shop', '商店']],
    sentence: "I'd like a bottle of milk, please.", sentenceMeaning: '我想要一瓶牛奶。',
    translate: ['这些苹果多少钱？', ['How much are these apples?', 'How much are the apples?', 'How much do these apples cost?']],
    translate2: ['我们没有奶酪了。', ["We haven't got any cheese.", "We don't have any cheese.", 'We have no cheese.', "There isn't any cheese.", "We don't have any cheese left.", "We haven't got any cheese left."]],
    grammarChoice: ['选择：How ___ rice do you want?', ['much', 'many', 'any'], 'much', 'rice 不可数，用 How much。'],
    grammarText: ['补全：Are there ___ apples in the bag?', ['any'], '疑问句用 any。'],
    listen: ["How much is this cheese? It's three pounds. Oh, that's cheap!", '奶酪多少钱？', ['三英镑', '两英镑', '十英镑'], '三英镑'],
    dictation: ['How many eggs do you need?', ['How many eggs do you need?']],
    reading: ["Ada: Good morning, Leo. What would you like?\nLeo: A kilo of rice and some apples, please.\nAda: How many apples?\nLeo: Six, please. How much is that?\nAda: Four pounds twenty.", 'Leo 买了几个苹果？', ['六个', '四个', '二十个'], '六个'],
    reviewGrammar: ['补全：There is ___ water in the bottle.（一些）', ['some'], '肯定句用 some。'],
    examAudio: ["I'd like two bottles of water and some bread. Sorry, there isn't any bread today.", '今天缺什么？', ['面包', '水', '奶酪'], '面包'],
    examSentence: ['How many bottles of milk do we need?', '我们需要几瓶牛奶？'],
    drills: [
      c('哪一个是不可数名词？', ['money', 'pound', 'bottle'], 'money', 'money 不可数；pound、bottle 可数。'),
      w('补全：How ___ eggs are there?', ['many'], 'eggs 可数复数，用 How many。'),
      c('礼貌地提供食物：', ['Would you like some cake?', 'Would you like any cake?', 'Do you like a cake some?'], 'Would you like some cake?', '提供东西时问句也用 some。'),
      w('补全：This watch is very ___. It\'s 500 pounds!（贵的）', ['expensive'], 'expensive = 贵的。')
    ],
    examItems: [
      c('选择正确的句子：', ["There isn't any rice in the kitchen.", "There aren't any rice in the kitchen.", "There isn't some rice in the kitchen."], "There isn't any rice in the kitchen.", 'rice 不可数，用 isn\'t any。'),
      w('补全：How much ___ these shoes?', ['are'], 'shoes 复数，How much are…?')
    ]
  },
  {
    id: 'en1-11', book: 1, title: '你会……吗？', goal: '情态动词 can / must / mustn\'t、have to', place: 'classroom', cast: ['grant', 'mia', 'sam'],
    grammar: 'can + 动词原形表示能力或许可：I can swim. Can I open the window? 否定 can\'t（cannot）。\nmust 表示必须（说话人认为），mustn\'t 表示禁止：You must do your homework. You mustn\'t run in the classroom.\nhave to 表示客观上不得不：I have to get up early on Monday. 第三人称 has to；否定 don\'t have to = 不必。\n情态动词后永远用原形，第三人称也不加 -s：She can sing.（不是 cans/sings）',
    tips: 'can 在句中常弱读 /kən/，can\'t 读 /kɑːnt/，听力时注意 t 的有无和元音长短。',
    vocabulary: [['can', '能；会'], ['must', '必须'], ['quiet', '安静的'], ['late', '迟到的；晚的'], ['early', '早的'], ['sing', '唱歌'], ['dance', '跳舞'], ['help', '帮助'], ['lesson', '课'], ['classroom', '教室']],
    sentence: 'You must be quiet in the library.', sentenceMeaning: '在图书馆你必须保持安静。',
    translate: ['我能帮你吗？', ['Can I help you?', 'May I help you?', 'Could I help you?']],
    translate2: ['你不能在教室里跑。', ["You mustn't run in the classroom.", "You can't run in the classroom.", 'You must not run in the classroom.', 'You cannot run in the classroom.']],
    grammarChoice: ['选择正确的句子：', ['She can dance very well.', 'She cans dance very well.', 'She can dances very well.'], 'She can dance very well.', 'can 后接动词原形，自身不变化。'],
    grammarText: ['补全：It\'s Sunday. I don\'t ___ to go to school.（不必）', ['have'], "don't have to = 不必。"],
    listen: ["Mr Grant: You mustn't be late for the lesson. It starts at nine.", '课程几点开始？', ['九点', '八点', '十点'], '九点'],
    dictation: ['Can you sing this song?', ['Can you sing this song?']],
    reading: ["Mr Grant: Mia, can you help me, please?\nMia: Yes, of course.\nMr Grant: Please open the windows. And Sam, you must be quiet. The test starts now.\nSam: Sorry, Mr Grant.", '老师要求 Sam 怎样？', ['保持安静', '开窗', '帮忙'], '保持安静'],
    reviewGrammar: ['补全：My brother ___ to work on Saturdays.（不得不，第三人称）', ['has'], '第三人称单数 has to。'],
    examAudio: ["Can your sister swim? No, she can't, but she can dance.", '妹妹会做什么？', ['跳舞', '游泳', '唱歌'], '跳舞'],
    examSentence: ['We must not be late for school.', '我们上学一定不能迟到。'],
    drills: [
      c('表示“禁止”：', ["You mustn't smoke here.", "You don't have to smoke here.", 'You can smoke here.'], "You mustn't smoke here.", "mustn't 表示禁止。"),
      w('补全：___ I open the door? — Yes, you can.', ['Can', 'May'], '请求许可用 Can I…? / May I…?'),
      c('“我得早点起床。” 正确的是：', ['I have to get up early.', 'I have get up early.', 'I must to get up early.'], 'I have to get up early.', 'have to + 原形；must 后不加 to。'),
      w('补全：Leo can\'t ___ (swim).', ['swim'], 'can\'t 后用原形。')
    ],
    examItems: [
      c('选择正确的句子：', ['He has to help his mother.', 'He have to help his mother.', 'He has help his mother.'], 'He has to help his mother.', '第三人称单数用 has to + 原形。'),
      w('补全：You ___ be quiet. The baby is sleeping.（必须）', ['must'], 'must = 必须。')
    ]
  },
  {
    id: 'en1-12', book: 1, title: '昨天发生了什么', goal: '一般过去时：was/were、规则与不规则动词、ago', place: 'station', cast: ['leo', 'bell'],
    grammar: 'be 的过去式：I/he/she/it was；you/we/they were。Where were you yesterday? — I was at home.\n规则动词加 -ed：walk → walked, live → lived, stop → stopped, study → studied。\n常见不规则动词：go → went, have → had, see → saw, buy → bought, take → took, come → came, leave → left, lose → lost。\n否定和疑问用 did + 原形：I didn\'t see him. Did you take the train? — Yes, I did.\n时间词：yesterday, last week, two days ago, in 2020。',
    tips: '-ed 有三种读音：/t/（walked）、/d/（lived）、/ɪd/（wanted, needed）。',
    vocabulary: [['yesterday', '昨天'], ['ago', '……以前'], ['last', '上一个的'], ['train', '火车'], ['station', '车站'], ['lose', '丢失'], ['find', '找到'], ['arrive', '到达'], ['leave', '离开'], ['week', '星期；周']],
    sentence: 'The train left ten minutes ago.', sentenceMeaning: '火车十分钟前开走了。',
    translate: ['你昨天在哪里？', ['Where were you yesterday?']],
    translate2: ['上周我丢了钥匙。', ['I lost my keys last week.', 'Last week I lost my keys.', 'I lost my key last week.', 'Last week I lost my key.']],
    grammarChoice: ['选择正确形式：We ___ at the station at six yesterday.', ['were', 'was', 'are'], 'were', 'we 的过去式用 were。'],
    grammarText: ['写出过去式：go → ___', ['went'], 'go 的过去式不规则：went。'],
    listen: ['I lost my bag at the station yesterday, but a police officer found it.', '谁找到了包？', ['一位警察', '火车司机', '他的朋友'], '一位警察'],
    dictation: ['She arrived two hours ago.', ['She arrived two hours ago.']],
    reading: ["Officer Bell: Good afternoon. Can I help you?\nLeo: Yes. I lost my phone on the train this morning.\nOfficer Bell: Which train did you take?\nLeo: The 8:15 to London. I arrived here at nine.\nOfficer Bell: Wait a minute… Is this your phone?\nLeo: Yes! Thank you!", 'Leo 坐的火车几点出发？', ['8:15', '9:00', '8:50'], '8:15'],
    reviewGrammar: ['补全：___ you see the film last night? — Yes, I did.', ['Did'], '一般过去时疑问句用 Did + 原形。'],
    examAudio: ["Last week Mia was in Paris. She didn't take a plane. She went by train.", 'Mia 怎么去的巴黎？', ['坐火车', '坐飞机', '开车'], '坐火车'],
    examSentence: ['I did not see him yesterday.', '我昨天没有见到他。'],
    drills: [
      c('选择正确的否定句：', ["He didn't buy a ticket.", "He didn't bought a ticket.", 'He not bought a ticket.'], "He didn't buy a ticket.", "didn't 后用原形 buy。"),
      w('写出过去式：stop → ___', ['stopped'], '重读闭音节双写 p 加 -ed。'),
      c('选择：I ___ tired last night.', ['was', 'were', 'am'], 'was', 'I 的过去式用 was。'),
      w('写出过去式：see → ___', ['saw'], 'see 的过去式是 saw。')
    ],
    examItems: [
      c('选择正确的句子：', ['They came home three days ago.', 'They come home three days ago.', 'They came home ago three days.'], 'They came home three days ago.', 'ago 表示过去时间，放在时间段后，动词用过去式。'),
      w('写出过去式：study → ___', ['studied'], '辅音 + y 变 y 为 i 加 -ed。')
    ]
  },
  {
    id: 'en1-13', book: 1, title: '明天的计划', goal: '将来时：be going to 与 will、天气表达', place: 'airport', cast: ['mia', 'leo'],
    grammar: 'be going to + 原形表示已经打算好的计划，或根据迹象判断要发生：I\'m going to visit my aunt. Look at those clouds! It\'s going to rain.\nwill + 原形表示临时决定、预测或承诺：It will be sunny tomorrow. I\'ll help you.\n否定 won\'t（will not）；疑问 Will you…? / Are you going to…?\n天气：sunny, cloudy, rainy, windy, hot, cold；What\'s the weather like?',
    tips: "I'll 读作 /aɪl/；won't /wəʊnt/ 和 want /wɒnt/ 要区分清楚。",
    vocabulary: [['tomorrow', '明天'], ['next', '下一个的'], ['plan', '计划'], ['holiday', '假期'], ['plane', '飞机'], ['airport', '机场'], ['weather', '天气'], ['sunny', '晴朗的'], ['rain', '雨；下雨'], ['visit', '拜访；参观']],
    sentence: "We're going to visit London next week.", sentenceMeaning: '我们打算下周去伦敦。',
    translate: ['明天天气会怎么样？', ["What will the weather be like tomorrow?", "What's the weather going to be like tomorrow?", "What is the weather going to be like tomorrow?", "How will the weather be tomorrow?"]],
    translate2: ['我会帮你拿包。', ["I'll carry your bag.", 'I will carry your bag.', "I'll carry your bag for you.", "I'll help you with your bag.", "I will help you with your bag."]],
    grammarChoice: ['看见乌云：“要下雨了！”', ["It's going to rain!", 'It rains!', 'It rained!'], "It's going to rain!", '根据迹象判断将要发生，用 be going to。'],
    grammarText: ['补全：I ___ going to fly to Rome tomorrow.', ['am', "'m"], 'I 搭配 am going to。'],
    listen: ["Tomorrow it will be sunny and hot. Don't forget your hat!", '明天天气如何？', ['晴朗炎热', '下雨', '多云寒冷'], '晴朗炎热'],
    dictation: ['Our plane leaves at noon.', ['Our plane leaves at noon.']],
    reading: ["Mia: Are you going to stay at home this holiday?\nLeo: No, I'm not. I'm going to visit my uncle in Sydney.\nMia: Wow! When is your plane?\nLeo: Next Friday. I think it'll be very hot there.", 'Leo 假期打算做什么？', ['去悉尼看叔叔', '待在家里', '去伦敦'], '去悉尼看叔叔'],
    reviewGrammar: ['补全：It\'s cold. I ___ close the window.（临时决定，用缩写）', ["'ll", 'will'], '临时决定用 will（I\'ll）。'],
    examAudio: ["Next summer Grandma is going to visit Canada. She won't go by ship. She'll fly.", '奶奶打算怎么去加拿大？', ['坐飞机', '坐船', '坐火车'], '坐飞机'],
    examSentence: ['It will not rain tomorrow.', '明天不会下雨。'],
    drills: [
      c('临时决定：电话响了。', ["I'll answer it.", "I'm answering it yesterday.", 'I answered it tomorrow.'], "I'll answer it.", '说话时做出的决定用 will。'),
      w('补全否定：She ___ come tomorrow.（不会，用缩写）', ["won't", 'will not'], "won't = will not。"),
      c('选择：What ___ you going to do next weekend?', ['are', 'will', 'do'], 'are', 'be going to 的疑问句：What are you going to do?'),
      w('补全：___ it be windy tomorrow? — Yes, it will.', ['Will'], 'Will 引导疑问句。')
    ],
    examItems: [
      c('选择正确的句子：', ["They're going to have a holiday in May.", 'They going to have a holiday in May.', "They're going have a holiday in May."], "They're going to have a holiday in May.", 'be going to + 原形，三者缺一不可。'),
      w('补全：I think it ___ be sunny this afternoon.', ['will', "'ll"], '预测用 will。')
    ]
  },
  {
    id: 'en1-14', book: 1, title: '你曾经……吗？', goal: '现在完成时：have/has + 过去分词、ever/never、already/yet/just', place: 'home', cast: ['leo', 'mia'],
    grammar: '现在完成时连接过去与现在：have/has + 过去分词。I have finished my homework.（现在已经做完）\n经历：Have you ever been to Beijing? — No, I\'ve never been there.\njust（刚刚）、already（已经）放在 have 与分词之间；yet 用于否定句和疑问句句末：Have you eaten yet? I haven\'t eaten yet.\n常见过去分词：be → been, do → done, eat → eaten, see → seen, write → written, buy → bought, make → made。\n具体过去时间（yesterday, ago）用一般过去时，不用现在完成时。',
    tips: 'have been to = 去过（已回来）；have gone to = 去了（还没回来）。',
    vocabulary: [['ever', '曾经'], ['already', '已经'], ['yet', '还；已经（疑问、否定）'], ['just', '刚刚'], ['finish', '完成'], ['letter', '信'], ['cake', '蛋糕'], ['film', '电影'], ['clean', '打扫；干净的'], ['room', '房间']],
    sentence: 'Have you ever eaten Chinese food?', sentenceMeaning: '你吃过中国菜吗？',
    translate: ['我刚刚打扫完我的房间。', ['I have just cleaned my room.', "I've just cleaned my room.", "I've just finished cleaning my room.", 'I have just finished cleaning my room.']],
    translate2: ['你写完信了吗？', ['Have you finished the letter yet?', 'Have you written the letter yet?', 'Have you finished writing the letter yet?', 'Have you finished your letter yet?', 'Have you finished the letter?', 'Have you written the letter?']],
    grammarChoice: ['选择正确形式：She ___ already seen the film.', ['has', 'have', 'is'], 'has', '第三人称单数用 has + 过去分词。'],
    grammarText: ['写出过去分词：write → ___', ['written'], 'write 的过去分词是 written。'],
    listen: ["Have you made the cake yet? Yes, I've just finished it.", '蛋糕做好了吗？', ['刚刚做好', '还没做', '昨天做的'], '刚刚做好'],
    dictation: ["I've never been to London.", ["I've never been to London.", 'I have never been to London.']],
    reading: ["Mia: Have you cleaned your room yet, Leo?\nLeo: Yes, I have. I cleaned it this morning.\nMia: And have you written to Grandma?\nLeo: Not yet. I'm going to write the letter after lunch.", 'Leo 还没做哪件事？', ['给奶奶写信', '打扫房间', '吃午饭'], '给奶奶写信'],
    reviewGrammar: ['补全：I haven\'t finished my homework ___.（还）', ['yet'], 'yet 用于否定句句末。'],
    examAudio: ["Sam has already seen this film. He saw it last Sunday.", 'Sam 什么时候看的这部电影？', ['上周日', '今天', '还没看'], '上周日'],
    examSentence: ['She has just made a cake.', '她刚做了一个蛋糕。'],
    drills: [
      c('选择正确的句子：', ['I saw him two days ago.', 'I have seen him two days ago.', 'I have saw him two days ago.'], 'I saw him two days ago.', '有具体过去时间 ago，用一般过去时。'),
      w('写出过去分词：eat → ___', ['eaten'], 'eat 的过去分词是 eaten。'),
      c('“你去过上海吗？”', ['Have you ever been to Shanghai?', 'Did you ever go to Shanghai yesterday?', 'Have you ever gone Shanghai?'], 'Have you ever been to Shanghai?', '经历用 have been to。'),
      w('补全：We have ___ finished lunch.（已经）', ['already'], 'already 放在 have 与过去分词之间。')
    ],
    examItems: [
      c('Tom 去了巴黎，现在还在那里：', ['Tom has gone to Paris.', 'Tom has been to Paris.', 'Tom has go to Paris.'], 'Tom has gone to Paris.', 'have gone to = 去了还没回来。'),
      w('写出过去分词：do → ___', ['done'], 'do 的过去分词是 done。')
    ]
  },
  {
    id: 'en1-15', book: 1, title: '比一比', goal: '比较级与最高级、as…as', place: 'street', cast: ['sam', 'leo', 'mia'],
    grammar: '短形容词：tall → taller → the tallest；big → bigger → the biggest；easy → easier → the easiest。\n长形容词用 more / the most：expensive → more expensive → the most expensive。\n不规则：good → better → the best；bad → worse → the worst；far → farther/further → the farthest/furthest。\n比较两者用 than：Leo is taller than Sam. 三者以上用最高级：Mia is the youngest in her family.\n同级比较：as + 原级 + as：This bag is as heavy as that one.',
    tips: 'than 常弱读 /ðən/，听到 -er … than 就知道是在比较。',
    vocabulary: [['bigger', '更大的'], ['better', '更好的'], ['best', '最好的'], ['worse', '更糟的'], ['heavy', '重的'], ['fast', '快的'], ['slow', '慢的'], ['easy', '容易的'], ['difficult', '困难的'], ['than', '比']],
    sentence: 'My bike is faster than your bike.', sentenceMeaning: '我的自行车比你的快。',
    translate: ['这是城里最高的楼。', ['This is the tallest building in the city.', 'This is the tallest building in town.', 'This is the highest building in the city.', 'This is the highest building in town.', "It's the tallest building in the city.", "It's the tallest building in town."]],
    translate2: ['英语和数学一样容易。', ['English is as easy as maths.', 'English is as easy as math.', 'English is as easy as mathematics.']],
    grammarChoice: ['选择：This test is ___ than the last one.', ['more difficult', 'difficulter', 'most difficult'], 'more difficult', '长形容词比较级用 more。'],
    grammarText: ['写出最高级：good → the ___', ['best'], 'good 的最高级是 best。'],
    listen: ['The bus is slow. The train is faster, but the plane is the fastest.', '哪个最快？', ['飞机', '火车', '公交车'], '飞机'],
    dictation: ['This bag is heavier than that one.', ['This bag is heavier than that one.']],
    reading: ["Sam: My bike is bigger than Leo's.\nLeo: Yes, but mine is faster!\nMia: My bike is the oldest, but it's the best. It never breaks.\nSam: OK, let's have a race!", '谁的自行车最旧？', ['Mia 的', 'Leo 的', 'Sam 的'], 'Mia 的'],
    reviewGrammar: ['写出比较级：big → ___', ['bigger'], '重读闭音节双写 g 加 -er。'],
    examAudio: ["Today's weather is worse than yesterday's. It's colder and windier.", '今天天气和昨天比怎样？', ['更糟，更冷更多风', '更好，更暖和', '一样'], '更糟，更冷更多风'],
    examSentence: ['Maths is more difficult than English.', '数学比英语难。'],
    drills: [
      c('选择正确的最高级：', ['the most expensive', 'the expensivest', 'the more expensive'], 'the most expensive', '长形容词最高级用 the most。'),
      w('写出比较级：easy → ___', ['easier'], '辅音 + y 变 y 为 i 加 -er。'),
      c('选择：Your car is as fast ___ mine.', ['as', 'than', 'so'], 'as', 'as…as 表示同级比较。'),
      w('写出比较级：bad → ___', ['worse'], 'bad 的比较级不规则：worse。')
    ],
    examItems: [
      c('选择正确的句子：', ['Leo is the tallest boy in the class.', 'Leo is tallest boy in the class.', 'Leo is the taller boy in the class of all.'], 'Leo is the tallest boy in the class.', '最高级前加 the。'),
      w('写出最高级：big → the ___', ['biggest'], '双写 g 加 -est。')
    ]
  }
];
