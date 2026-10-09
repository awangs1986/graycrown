// Original A1 teaching material written for this project. French targets retain accents; Chinese explains the task.
// Unit sequence follows the CEFR A1 descriptors and the open (CC BY) Français interactif syllabus; see CREDITS.md.
// `legacy: true` marks units from the first release: their lesson IDs stay positional (fr01-01 … fr01-12) so saved progress keeps matching.
const c = (prompt, options, answer, explanation) => ({ type: 'choice', prompt, options, answers: [answer], explanation });
const w = (prompt, answers, explanation) => ({ type: 'text', prompt, answers, explanation });

const firstReleaseUnits = [
  {
    id: 'fr01', legacy: true, title: '你好，法语', goal: '打招呼、礼貌表达、自我介绍',
    grammar: '法语句首大写，句末用标点。je 是“我”，vous 可礼貌地表示“您”，tu 用于熟人。je + 元音常缩写成 j’：Je m’appelle Léa（我叫 Léa）。être（是）的现在时：je suis、tu es、il/elle est、nous sommes、vous êtes、ils/elles sont。问名字：Comment tu t’appelles ?（熟人）/ Comment vous appelez-vous ?（礼貌）。用 Et toi ? / Et vous ? 把问题抛回给对方。陈述句加上扬语调就是最简单的疑问句：Vous êtes Paul ?',
    pronunciation: '先听再模仿：bonjour 中的 on 是鼻化元音；salut 的末尾 t 通常不发音。é、è 会影响元音读音，不能随意去掉重音符号。法语 r 与汉语 r 不同；本课程用听辨和跟读练习，不自动评分发音。',
    vocabulary: [['bonjour','你好（白天，较正式）'],['salut','嗨（熟人之间）'],['au revoir','再见'],['merci','谢谢'],["s'il vous plaît",'请（礼貌用语）'],['oui','是的'],['non','不是／不'],['pardon','对不起／请再说一遍']],
    sentence: "Je m'appelle Léa.", sentenceMeaning: '我叫 Léa。',
    translate: ['我是 Paul。', ['Je suis Paul.', "Je m'appelle Paul.", "Moi, c'est Paul."]],
    translate2: ['你叫什么名字？（对熟人）', ["Comment tu t'appelles ?", "Tu t'appelles comment ?", "Comment t'appelles-tu ?"]],
    grammarChoice: ['礼貌地向陌生人问好，选哪个？', ['Bonjour !','Salut, mon pote !','Bonne nuit !'], 'Bonjour !', 'Bonjour 适用于白天的礼貌问候；salut 更随意，bonne nuit 是晚安。'],
    grammarText: ['补全：Je ___ Léa.（我是 Léa。）', ['suis'], 'être 与 je 搭配使用 suis。'],
    listen: ['Bonjour ! Je m’appelle Hugo.', '说话者叫什么？', ['Hugo','Léa','Paul'], 'Hugo'],
    dictation: ['Merci.', ['Merci.']],
    reading: ['Bonjour. Je suis Léa. Je suis française. Au revoir !', 'Léa 在最后做了什么？', ['道别','询问价格','点餐'], '道别'],
    reviewGrammar: ['补全：Vous ___ Paul ?（您是 Paul 吗？）', ['êtes'], 'vous 对应 êtes。问句也可保留陈述句词序，通过语调提问。'],
    examAudio: ['Bonjour, je m’appelle Paul. Merci et au revoir.', '录音里出现的是哪种结束语？', ['Au revoir.','À demain.','Bonne nuit.'], 'Au revoir.'],
    examSentence: ['Comment vous appelez-vous ?', '您叫什么名字？'],
    drills: [
      c('礼貌地问陌生人的名字，选哪个？', ['Comment vous appelez-vous ?','Comment tu t’appelles, madame ?','Tu es qui ?'], 'Comment vous appelez-vous ?', '对陌生人用 vous：Comment vous appelez-vous ?'),
      w('补全：Je m’appelle Léa. Et ___ ?（你呢？对朋友说）', ['toi'], 'Et toi ? 用于熟人；对陌生人说 Et vous ?'),
      c('“她是法国人”的正确形式是？', ['Elle est française.','Elle es française.','Elle suis française.'], 'Elle est française.', 'être：il/elle est；国籍形容词随主语变成阴性 française。'),
      w('补全：Nous ___ amis.（我们是朋友。使用 être。）', ['sommes'], 'être 与 nous 对应 sommes。')
    ],
    examItems: [
      c('晚上见到邻居打招呼，选哪个？', ['Bonsoir !','Bonne nuit !','Salut, à demain !'], 'Bonsoir !', 'Bonsoir 是晚上见面时的问候；Bonne nuit 是睡前道晚安。'),
      w('补全：Ils ___ à Paris.（他们在巴黎。使用 être。）', ['sont'], 'être 与 ils/elles 对应 sont。')
    ]
  },
  {
    id: 'fr02', legacy: true, title: '介绍自己', goal: '年龄、国籍、职业与数字',
    grammar: '表达年龄用 avoir（有）：J’ai vingt ans（我20岁），不是 Je suis vingt。avoir：j’ai、tu as、il/elle a、nous avons、vous avez、ils/elles ont。职业在 être 后通常不加冠词：Je suis médecin。国籍形容词常随性别变化：français/française、chinois/chinoise。来自某地：Je viens de Chine。\n疑问句的三种常见形式：① 语调上扬：Tu as quel âge ? ② Est-ce que + 陈述句（词序不变）：Est-ce que tu es étudiant ? ③ 疑问词：Quel âge as-tu ?、Où habites-tu ?（你住哪里？）、D’où viens-tu ?（你从哪里来？）。quel 随名词变化：quel âge、quelle nationalité。住在城市用 à：J’habite à Lyon；阴性国家用 en：en Chine、en France；阳性国家用 au：au Canada。',
    pronunciation: '数字先慢读再连读。1–10：un, deux, trois, quatre, cinq, six, sept, huit, neuf, dix；11–16：onze, douze, treize, quatorze, quinze, seize；17–19 用 dix-sept 等；20/30/40/50/60 是 vingt/trente/quarante/cinquante/soixante，70 是 soixante-dix，80 是 quatre-vingts，90 是 quatre-vingt-dix，100 是 cent。vingt et un 表示21。听年龄时尤其注意 deux 与 douze。',
    vocabulary: [['étudiant','男学生'],['étudiante','女学生'],['médecin','医生'],['français','法国的／法语'],['chinois','中国的／汉语'],['vingt','二十'],['trente','三十'],['cent','一百']],
    sentence: "J'ai vingt ans.", sentenceMeaning: '我二十岁。',
    translate: ['我是一名医生。', ['Je suis médecin.']],
    translate2: ['你住在哪里？', ['Où habites-tu ?', 'Tu habites où ?', 'Où est-ce que tu habites ?', 'Où habitez-vous ?', 'Vous habitez où ?', 'Où est-ce que vous habitez ?']],
    grammarChoice: ['“她二十岁”应该怎么说？', ['Elle a vingt ans.','Elle est vingt ans.','Elle ont vingt ans.'], 'Elle a vingt ans.', '年龄用 avoir；elle 对应 a。'],
    grammarText: ['补全：Nous ___ trente ans.（我们三十岁。）', ['avons'], 'avoir 与 nous 对应 avons。'],
    listen: ['Je m’appelle Marie. J’ai trente ans. Je suis médecin.', 'Marie 几岁？', ['三十岁','十三岁','二十岁'], '三十岁'],
    dictation: ['Vingt.', ['vingt']],
    reading: ['Je suis Li. Je viens de Chine. Je suis étudiant. J’ai vingt ans.', 'Li 的职业／身份是什么？', ['学生','医生','教师'], '学生'],
    reviewGrammar: ['补全：Tu ___ quel âge ?（你多大？）', ['as'], 'avoir 与 tu 对应 as；quel âge 用于询问年龄。'],
    examAudio: ['Bonjour, je m’appelle Luc. J’ai vingt ans. Je suis étudiant.', 'Luc 的年龄与身份是？', ['二十岁，学生','三十岁，医生','二十岁，医生'], '二十岁，学生'],
    examSentence: ['Est-ce que tu es étudiant ?', '你是学生吗？'],
    drills: [
      c('把 Tu es étudiant. 变成一般疑问句，哪个正确？', ['Est-ce que tu es étudiant ?','Est-ce tu es étudiant ?','Est-ce que es-tu étudiant ?'], 'Est-ce que tu es étudiant ?', 'Est-ce que + 完整陈述句（词序不变）就构成一般疑问句。'),
      w('补全：___ âge as-tu ?（你几岁？）', ['Quel'], 'âge 是阳性单数，疑问形容词用 quel。'),
      c('“我住在中国”，国家前用哪个介词？', ['J’habite en Chine.','J’habite à Chine.','J’habite au Chine.'], 'J’habite en Chine.', '阴性国家名前用 en：en Chine、en France；阳性用 au：au Canada；城市用 à。'),
      w('补全：Elle est ___.（她是中国人。使用 chinois 的阴性形式。）', ['chinoise'], '阴性国籍形容词通常加 e：chinois → chinoise。')
    ],
    examItems: [
      c('“你从哪里来？”哪个正确？', ['D’où viens-tu ?','Où viens-tu de ?','De où tu viens ?'], 'D’où viens-tu ?', 'de + où 省音为 d’où。'),
      w('补全：Il habite ___ Canada.（他住在加拿大。）', ['au'], 'Canada 是阳性国家名，用 au。')
    ]
  },
  {
    id: 'fr03', legacy: true, title: '家人和朋友', goal: '冠词、物主形容词、性数配合',
    grammar: '名词有阴阳性。un/une/des 表示一个／一些，le/la/les 表示特指的“这／那”。元音前 le/la 省音为 l’。复数通常加 s（往往不发音）。mon/ma/mes 表示“我的”，随被拥有的名词变化，而非随拥有者性别变化：mon frère、ma sœur、mes parents。形容词通常随名词配合：petit/petite、grands/grandes。C’est 是“这是”，Ce sont 是“这些是”。\n物主形容词全套：mon/ma/mes（我的）、ton/ta/tes（你的）、son/sa/ses（他的／她的）、notre/nos、votre/vos、leur/leurs。元音开头的阴性名词前用 mon/ton/son：mon amie。介绍身份用 C’est + 名词（C’est mon père），描述性质用 Il/Elle est + 形容词（Il est grand）。',
    pronunciation: 'frère 与 mère 含 è，注意和 été 的 é 区分。sœur 的 œ 是一个元音组合。les amis 常发生联诵，les 的 s 在元音前听起来像 z。不要把所有词末 s 都读出来。',
    vocabulary: [['la mère','母亲'],['le père','父亲'],['la sœur','姐妹'],['le frère','兄弟'],['les parents','父母'],['un ami','一个男性朋友'],['une amie','一个女性朋友'],['petite','小的／矮的（阴性）']],
    sentence: "C'est ma sœur.", sentenceMeaning: '这是我的姐妹。',
    translate: ['这是我的兄弟。', ["C'est mon frère.", 'Voici mon frère.']],
    translate2: ['这些是我的父母。', ['Ce sont mes parents.', 'Voici mes parents.']],
    grammarChoice: ['选出正确的“我的母亲”。', ['ma mère','mon mère','mes mère'], 'ma mère', 'mère 是阴性单数，用 ma。'],
    grammarText: ['补全：Ce ___ mes parents.（这些是我的父母。）', ['sont'], '复数介绍用 Ce sont；parents 是复数。'],
    listen: ['Voici ma famille. Mon frère s’appelle Paul. Ma sœur s’appelle Julie.', 'Julie 是说话者的谁？', ['姐妹','母亲','男性朋友'], '姐妹'],
    dictation: ['Mon frère.', ['mon frère']],
    reading: ['C’est ma mère. Elle s’appelle Anne. Elle est médecin. Mon père est professeur.', 'Anne 的职业是什么？', ['医生','教师','学生'], '医生'],
    reviewGrammar: ['补全：Elle est ___.（她个子小，使用 petit 的正确形式。）', ['petite'], 'elle 对应阴性形容词 petite。'],
    examAudio: ['C’est mon ami Hugo. Il a vingt ans. Il a une sœur.', 'Hugo 有什么家人？', ['一个姐妹','两个兄弟','一个女儿'], '一个姐妹'],
    examSentence: ['Il est jeune et sympathique.', '他年轻又友好。'],
    drills: [
      c('“他的姐妹”应选哪个？', ['sa sœur','son sœur','ses sœur'], 'sa sœur', '物主形容词随被拥有的名词变化：sœur 是阴性单数，所以用 sa，与拥有者是男是女无关。'),
      w('补全：___ amie s’appelle Julie.（我的女性朋友叫 Julie。）', ['Mon'], '元音开头的阴性名词前用 mon 代替 ma，便于发音：mon amie。'),
      c('描述“他个子高”，哪个正确？', ['Il est grand.','C’est grand.','Il est un grand.'], 'Il est grand.', '描述人用 Il/Elle est + 形容词；C’est + 名词用于介绍身份。'),
      w('补全：Mes sœurs sont ___.（我的姐妹们个子高。使用 grand 的正确形式。）', ['grandes'], '阴性复数形容词：grand → grandes。')
    ],
    examItems: [
      c('“你们的父母”应选哪个？', ['vos parents','votre parents','vous parents'], 'vos parents', '复数名词前用 vos；votre 用于单数名词。'),
      w('补全：___ ma mère.（这是我的母亲。）', ["C'est"], 'C’est + 名词用于介绍身份。')
    ]
  },
  {
    id: 'fr04', legacy: true, title: '一天的生活', goal: '现在时、时间、否定与日常活动',
    grammar: '规则 -er 动词：parler → je parle、tu parles、il/elle parle、nous parlons、vous parlez、ils/elles parlent。否定把动词放在 ne…pas 中：Je ne travaille pas。元音前 ne→n’：Je n’étudie pas。星期：lundi, mardi, mercredi, jeudi, vendredi, samedi, dimanche；le lundi 表示“每周一”。整点：Il est huit heures；à huit heures 表示“在八点”。起床 Je me lève 先作为固定表达认识，下一单元“时间与作息”会系统学习代词式动词和更多报时方式。',
    pronunciation: 'parle、parles、parlent 在普通现在时中通常同音，书写时仍要配合主语。heures 的 h 不发音，deux heures 有联诵。练习先听懂整点，再听 et demie（半点）。',
    vocabulary: [['travailler','工作'],['étudier','学习'],['manger','吃'],['parler','说话'],['le matin','早晨'],['le soir','晚上'],['huit heures','八点'],['lundi','星期一']],
    sentence: 'Je travaille le matin.', sentenceMeaning: '我早晨工作。',
    translate: ['我不工作。', ['Je ne travaille pas.']],
    translate2: ['我们星期一学习法语。', ['Nous étudions le français lundi.', 'Le lundi, nous étudions le français.', 'Lundi, nous étudions le français.', 'Nous étudions le français le lundi.', 'On étudie le français lundi.', 'On étudie le français le lundi.']],
    grammarChoice: ['nous + parler 的正确形式是？', ['nous parlons','nous parlez','nous parlent'], 'nous parlons', '规则 -er 动词与 nous 配合通常用 -ons。'],
    grammarText: ['补全：Vous ___ français.（使用 parler：你们说法语。）', ['parlez'], 'vous 对应 -ez：parlez。'],
    listen: ['Le lundi, je travaille à huit heures. Le soir, j’étudie le français.', '星期一几点开始工作？', ['八点','十八点','七点'], '八点'],
    dictation: ['Il est huit heures.', ['Il est huit heures.','Il est 8 heures.']],
    reading: ['Je m’appelle Sam. Je me lève à sept heures. Je travaille le matin. Le dimanche, je ne travaille pas.', 'Sam 星期日是否工作？', ['不工作','早晨工作','晚上工作'], '不工作'],
    reviewGrammar: ['补全：Je ___ lève à sept heures.', ['me'], 'se lever 是代词式动词，je 搭配 me。'],
    examAudio: ['Il est neuf heures. Aujourd’hui, nous étudions le français. Nous ne travaillons pas.', '今天他们做什么？', ['学习法语，不工作','工作，不学习','九点吃晚饭'], '学习法语，不工作'],
    examSentence: ['Je ne travaille pas le dimanche.', '我星期日不工作。'],
    drills: [
      c('tu + manger 的正确形式是？', ['tu manges','tu mange','tu mangez'], 'tu manges', '-er 动词与 tu 搭配加 -es。'),
      w('补全：Ils ___ le soir.（他们晚上工作。使用 travailler。）', ['travaillent'], 'ils/elles 对应 -ent，词尾不发音。'),
      c('“她不说英语”哪个正确？', ['Elle ne parle pas anglais.','Elle ne parle anglais pas.','Elle pas parle anglais.'], 'Elle ne parle pas anglais.', 'ne 在变位动词前，pas 在变位动词后。'),
      w('补全：Je n’___ pas le dimanche.（我星期日不学习。使用 étudier。）', ['étudie'], '元音开头的动词前 ne 变成 n’：je n’étudie pas。')
    ],
    examItems: [
      c('“星期三”是哪一个？', ['mercredi','mardi','jeudi'], 'mercredi', 'lundi 一、mardi 二、mercredi 三、jeudi 四、vendredi 五、samedi 六、dimanche 日。'),
      w('补全：Nous ne ___ pas le matin.（我们早上不吃东西。使用 manger。）', ['mangeons'], 'manger 与 nous 写成 mangeons，保留 e 使 g 读 [ʒ]。')
    ]
  },
  {
    id: 'fr05', legacy: true, title: '在咖啡馆', goal: '点餐、数量、部分冠词与价格',
    grammar: '可数物品可用 un/une；不确定数量用 du（阳性）、de la（阴性）、de l’（元音前）、des（复数）：du pain、de l’eau。数量后常用 de：un kilo de pommes。否定通常变成 de/d’：Je ne bois pas de café。Je voudrais… 是初学者可直接使用的礼貌点餐句型。Combien ça coûte ? 询问价格。boire：je bois、nous buvons、vous buvez；prendre：je prends、vous prenez。\n在市场：Je voudrais un kilo de tomates / une bouteille d’eau / deux baguettes。店员常问 Et avec ceci ?（还要别的吗？）结束时说 C’est tout, merci.（就这些，谢谢。）',
    pronunciation: 'eau 发一个类似 o 的元音，不按三个字母分别念。café 末尾 é 要读出；pain 是鼻化元音。deux euros 的两个词通常联诵。',
    vocabulary: [['un café','一杯咖啡'],['un thé','一杯茶'],["de l'eau",'一些水'],['du pain','一些面包'],['une pomme','一个苹果'],["l'addition",'账单'],['un euro','一欧元'],['un kilo','一千克']],
    sentence: 'Je voudrais un café.', sentenceMeaning: '我想要一杯咖啡。',
    translate: ['我想要一杯茶。', ['Je voudrais un thé.', "Je voudrais un thé, s'il vous plaît.", "Un thé, s'il vous plaît.", 'Je prends un thé.']],
    translate2: ['请问多少钱？', ['Combien ça coûte ?', 'Ça coûte combien ?', "C'est combien ?", "Combien ça coûte, s'il vous plaît ?", "C'est combien, s'il vous plaît ?"]],
    grammarChoice: ['选出正确的“一些水”。', ["de l'eau",'du eau','de la eau'], "de l'eau", 'eau 以元音开头，使用 de l’。'],
    grammarText: ['补全：Je ne bois pas ___ café.', ['de'], '否定句中，部分冠词通常变为 de。'],
    listen: ['Bonjour, je voudrais un café et un verre d’eau, s’il vous plaît.', '客人点了什么？', ['咖啡和水','茶和面包','苹果和茶'], '咖啡和水'],
    dictation: ["L'addition, s'il vous plaît.", ["L'addition, s'il vous plaît."]],
    reading: ['Menu : café 2 euros ; thé 3 euros ; sandwich 5 euros. Le café et le sandwich coûtent 7 euros.', '一杯茶多少钱？', ['3欧元','2欧元','5欧元'], '3欧元'],
    reviewGrammar: ['补全：un kilo ___ pommes', ['de'], '表示明确数量时，数量表达后用 de。'],
    examAudio: ['Le café coûte deux euros. Le thé coûte trois euros. Je prends un thé.', '客人选择的饮品多少钱？', ['三欧元','两欧元','五欧元'], '三欧元'],
    examSentence: ['Je voudrais un kilo de pommes.', '我想要一公斤苹果。'],
    drills: [
      c('“一些奶酪”（fromage 为阳性）应选？', ['du fromage','de la fromage','des fromage'], 'du fromage', '阳性单数不可数名词前用 du。'),
      w('补全：Je voudrais ___ viande.（我想要一些肉。viande 为阴性。）', ['de la'], '阴性单数用 de la。'),
      c('“一瓶水”哪个正确？', ['une bouteille d’eau','une bouteille de l’eau','une bouteille du eau'], 'une bouteille d’eau', '数量表达后直接用 de/d’，不用 du/de la/de l’。'),
      w('补全：Vous ___ un café ?（您要一杯咖啡吗？使用 prendre。）', ['prenez'], 'prendre 与 vous 对应 prenez。')
    ],
    examItems: [
      c('否定句“我不吃肉”哪个正确？', ['Je ne mange pas de viande.','Je ne mange pas de la viande.','Je ne mange pas viande.'], 'Je ne mange pas de viande.', '否定句中 du/de la/des 一般变成 de。'),
      w('补全：Nous ___ de l’eau.（我们喝水。使用 boire。）', ['buvons'], 'boire：je bois、nous buvons、vous buvez。')
    ]
  },
  {
    id: 'fr06', legacy: true, title: '城市与住处', goal: '问路、位置、交通、房间与疑问句',
    grammar: '复习疑问句：Où est… ? 询问“……在哪里”；Est-ce qu’il y a… ? 询问“有没有……”。位置：à gauche（左）、à droite（右）、devant（前）、derrière（后）、près de（附近）。à+le=au，à+les=aux；de+le=du，de+les=des。Il y a 表示“有”。aller：je vais、tu vas、il va、nous allons、vous allez、ils vont。venir（来）：je viens、tu viens、il vient、nous venons、vous venez、ils viennent。命令式去掉主语：Allez tout droit（直走）、Tournez à gauche（左转）、Prenez la première rue à droite（走右边第一条街）、Traversez la place（穿过广场）。',
    pronunciation: 'où（哪里）带重音，与 ou（或者）区别在书写和意义，读音相同。rue 的 u 与 vous 的 ou 读音不同。请反复听 rue 和 vous，观察嘴唇形状。',
    vocabulary: [['la gare','火车站'],['la rue','街道'],['à gauche','向左／在左边'],['à droite','向右／在右边'],['tout droit','一直向前'],['la chambre','房间／卧室'],['la cuisine','厨房'],['le bus','公交车']],
    sentence: 'Je vais à la gare.', sentenceMeaning: '我去火车站。',
    translate: ['车站在哪里？', ['Où est la gare ?', 'Où se trouve la gare ?', 'La gare est où ?', "Où est la gare, s'il vous plaît ?", "Où se trouve la gare, s'il vous plaît ?"]],
    translate2: ['请向右转。', ['Tournez à droite.', "Tournez à droite, s'il vous plaît.", 'Tourne à droite.', 'Allez à droite.']],
    grammarChoice: ['“我去咖啡馆”中 à + le 应怎样写？', ['Je vais au café.','Je vais à le café.','Je vais aux café.'], 'Je vais au café.', 'à 与 le 缩合为 au。'],
    grammarText: ['补全：Il y ___ une cuisine.（有一个厨房。）', ['a'], 'Il y a 是表达“有”的固定结构。'],
    listen: ['Pour aller à la gare, allez tout droit, puis à gauche.', '先直走，然后往哪边？', ['左边','右边','后方'], '左边'],
    dictation: ['La gare est à droite.', ['La gare est à droite.']],
    reading: ['Mon appartement a deux chambres et une cuisine. Il est près de la gare. Je prends le bus pour travailler.', '公寓靠近哪里？', ['火车站','学校','医院'], '火车站'],
    reviewGrammar: ['补全：Nous ___ à la gare.（使用 aller。）', ['allons'], 'aller 与 nous 对应 allons。'],
    examAudio: ['Bonjour, où est le café ? Le café est à droite, près de la gare.', '咖啡馆的位置是？', ['右边，车站附近','左边，车站后面','直走，学校附近'], '右边，车站附近'],
    examSentence: ['Prenez la première rue à droite.', '走右边第一条街。'],
    drills: [
      c('“他们去医院”中 à + l’hôpital 的正确形式？', ['Ils vont à l’hôpital.','Ils vont au hôpital.','Ils vont à le hôpital.'], 'Ils vont à l’hôpital.', '元音或哑音 h 开头的名词前用 à l’，不缩合成 au。'),
      w('补全：Tournez ___ gauche.（向左转。）', ['à'], '方向：à gauche、à droite。'),
      c('“药店在银行旁边”哪个正确？', ['La pharmacie est à côté de la banque.','La pharmacie est à côté la banque.','La pharmacie est côté de la banque.'], 'La pharmacie est à côté de la banque.', 'à côté de = 在……旁边；短语中的 à 和 de 都不能省。'),
      w('补全：Vous ___ de la gare ?（您是从车站来的吗？使用 venir。）', ['venez'], 'venir 与 vous 对应 venez。')
    ],
    examItems: [
      c('“有没有厨房？”哪个正确？', ['Est-ce qu’il y a une cuisine ?','Est-ce que il y a une cuisine ?','Il y a est-ce une cuisine ?'], 'Est-ce qu’il y a une cuisine ?', 'que 遇元音省音为 qu’：est-ce qu’il y a。'),
      w('补全：Je vais ___ cinéma.（我去电影院。）', ['au'], 'à + le = au。')
    ]
  },
  {
    id: 'fr07', legacy: true, title: '喜好、天气与购物', goal: '表达喜好、选择物品、询问尺寸与天气',
    grammar: '表达喜好：J’aime le cinéma、J’adore la musique、Je n’aime pas le sport。喜好后一般用定冠词。faire：je fais、tu fais、il fait、nous faisons、vous faites、ils font。天气多用 faire：Il fait beau/froid/chaud，另有 Il pleut、Il neige。季节：au printemps、en été、en automne、en hiver。颜色形容词通常放在名词后并配合：une robe bleue、des chaussures noires。指示形容词：ce livre、cet ami（阳性元音前）、cette robe、ces chaussures。疑问形容词 quel/quelle/quels/quelles 随名词变化：Quelle taille ?。运动、爱好和邀请会在下一单元继续练习。',
    pronunciation: 'chaud 末尾 d 通常不发音；froid 末尾 d 也通常不发音。chaussures 的 ch 类似“sh”，不要读成英语 chair 的起始音。喜好句先听语气，再分辨 aime 与 n’aime pas。',
    vocabulary: [['le cinéma','电影／电影院'],['le sport','运动'],['la musique','音乐'],['une robe','一条连衣裙'],['les chaussures','鞋子'],['bleu','蓝色的（阳性）'],['il pleut','下雨了'],['il fait froid','天气冷']],
    sentence: "J'aime la musique.", sentenceMeaning: '我喜欢音乐。',
    translate: ['我不喜欢运动。', ["Je n'aime pas le sport.", "Moi, je n'aime pas le sport."]],
    translate2: ['今天天气很好。', ["Il fait beau aujourd'hui.", "Aujourd'hui, il fait beau.", "Il fait très beau aujourd'hui.", "Aujourd'hui, il fait très beau."]],
    grammarChoice: ['选出正确的“这条连衣裙”。', ['cette robe','ce robe','cet robe'], 'cette robe', 'robe 是阴性单数，用 cette。'],
    grammarText: ['补全：___ taille ?（什么尺码？taille 是阴性。）', ['Quelle'], '阴性单数疑问形容词为 quelle。'],
    listen: ['Il pleut aujourd’hui. Je ne fais pas de sport. J’écoute de la musique.', '说话者今天做什么？', ['听音乐','做运动','买鞋'], '听音乐'],
    dictation: ['Il fait froid.', ['Il fait froid.']],
    reading: ['Je voudrais cette robe bleue. Elle coûte vingt euros. Les chaussures coûtent trente euros.', '连衣裙是什么颜色？', ['蓝色','红色','黑色'], '蓝色'],
    reviewGrammar: ['补全：Vous ___ du sport ?（使用 faire。）', ['faites'], 'faire 与 vous 对应 faites。'],
    examAudio: ['J’aime le cinéma, mais je n’aime pas le sport. Demain, il va faire beau.', '说话者不喜欢什么？', ['运动','电影','晴天'], '运动'],
    examSentence: ['Il fait froid en hiver.', '冬天天气冷。'],
    drills: [
      c('“冬天”前面用哪个介词？', ['en hiver','au hiver','à hiver'], 'en hiver', '季节：en été、en automne、en hiver，但 au printemps。'),
      w('补全：J’ai une robe ___.（我有一条红色的连衣裙。使用 rouge。）', ['rouge'], 'rouge 以 e 结尾，阴阳性同形。'),
      c('“这些鞋子”哪个正确？', ['ces chaussures','cettes chaussures','ce chaussures'], 'ces chaussures', '复数名词前一律用 ces。'),
      w('补全：Les chaussures sont ___.（鞋子是黑色的。使用 noir 的正确形式。）', ['noires'], 'chaussures 是阴性复数：noir → noires。')
    ],
    examItems: [
      c('“这个朋友”（ami 为阳性、元音开头）应选？', ['cet ami','ce ami','cette ami'], 'cet ami', '阳性单数名词以元音或哑音 h 开头时，ce 变为 cet。'),
      w('补全：___ chaussures préférez-vous ?（您更喜欢哪双鞋？）', ['Quelles'], 'chaussures 是阴性复数，用 quelles。')
    ]
  },
  {
    id: 'fr08', legacy: true, title: '周末出行', goal: '日期、近期计划与 A1 综合交流',
    grammar: '近期计划用 aller 的现在时 + 动词原形：Je vais visiter Paris。pouvoir：je peux、vous pouvez；vouloir：je veux、vous voulez。礼貌询问可用 Vous pouvez répéter ?。简单叙述昨天做过的事可用常见复合过去时：J’ai visité Paris（avoir+过去分词）；这里仅识别和练习规则 -er→-é，不扩展到完整过去时体系。日期：le deux mai。月份：janvier, février, mars, avril, mai, juin, juillet, août, septembre, octobre, novembre, décembre。\n刚刚做完某事用 venir de + 动词原形：Je viens d’arriver（我刚到）。订房、买票：Je voudrais réserver une chambre pour deux nuits.（我想订一个房间住两晚）Un aller-retour pour Lyon, s’il vous plaît.（一张去里昂的往返票）',
    pronunciation: 'train 和 pain 都有鼻化元音，但鼻化不是在元音后额外加一个清楚的 n。visiter 的 -er 与 visité 的 -é 通常同音，因此判断时间还要听 vais 或 ai。',
    vocabulary: [['demain','明天'],["aujourd'hui",'今天'],['hier','昨天'],['un billet','一张票'],['le train','火车'],['visiter','参观'],['mai','五月'],['samedi','星期六']],
    sentence: 'Je vais visiter Paris.', sentenceMeaning: '我打算参观巴黎。',
    translate: ['我想要一张去巴黎的票。', ['Je voudrais un billet pour Paris.', "Je voudrais un billet pour Paris, s'il vous plaît.", "Un billet pour Paris, s'il vous plaît.", 'Je veux un billet pour Paris.']],
    translate2: ['我刚到巴黎。', ["Je viens d'arriver à Paris."]],
    grammarChoice: ['“我们打算参观巴黎”的正确句子是？', ['Nous allons visiter Paris.','Nous allons visitons Paris.','Nous avons visiter Paris.'], 'Nous allons visiter Paris.', '近期将来时为 aller 的变位 + 动词原形。'],
    grammarText: ['补全：Hier, j’ai ___ Paris.（使用 visiter 的过去分词。）', ['visité'], '规则 -er 动词的常见过去分词把 -er 改为 -é。'],
    listen: ['Demain, samedi, je vais à Paris en train. Le train part à neuf heures.', '火车几点出发？', ['九点','七点','十九点'], '九点'],
    dictation: ['Je voudrais un billet.', ['Je voudrais un billet.']],
    reading: ['Bonjour ! Je m’appelle Léa. Samedi, le deux mai, je vais visiter Paris avec ma sœur. Nous prenons le train à huit heures. Je voudrais deux billets.', 'Léa 需要几张票？', ['两张','一张','三张'], '两张'],
    reviewGrammar: ['补全：Vous ___ répéter, s’il vous plaît ?（使用 pouvoir。）', ['pouvez'], 'pouvoir 与 vous 对应 pouvez；这是请求重复时常用的礼貌表达。'],
    examAudio: ['Bonjour, je m’appelle Marie. J’ai trente ans. Demain, je vais à Paris avec ma sœur. Nous prenons le train à huit heures. Je voudrais deux billets, s’il vous plaît.', '哪一项与录音一致？', ['Marie三十岁，和姐妹乘八点的火车去巴黎，需要两张票','Marie二十岁，独自乘九点的火车去巴黎','Marie三十岁，和兄弟乘公交去巴黎'], 'Marie三十岁，和姐妹乘八点的火车去巴黎，需要两张票'],
    examSentence: ['Nous allons prendre le train demain.', '我们明天要坐火车。'],
    drills: [
      c('“他们打算明天出发”哪个正确？', ['Ils vont partir demain.','Ils vont partent demain.','Ils allons partir demain.'], 'Ils vont partir demain.', '近期将来时：aller 变位 + 动词原形。'),
      w('补全：Le train arrive le quatorze ___.（火车七月十四日到。用法语写“七月”。）', ['juillet'], '日期写作 le + 数字 + 月份：le quatorze juillet。'),
      c('“我刚吃过饭”哪个正确？', ['Je viens de manger.','Je vais manger.','Je viens manger.'], 'Je viens de manger.', 'venir de + 原形 表示刚刚完成；aller + 原形 表示将要。'),
      w('补全：Je voudrais ___ une chambre.（我想预订一个房间。使用 réserver。）', ['réserver'], 'je voudrais 后面接动词原形。')
    ],
    examItems: [
      c('“我们昨天参观了卢浮宫”哪个正确？', ['Hier, nous avons visité le Louvre.','Hier, nous allons visiter le Louvre.','Hier, nous sommes visité le Louvre.'], 'Hier, nous avons visité le Louvre.', '过去发生的事用 avoir + 过去分词；aller + 原形表示将来。'),
      w('补全：Tu ___ répéter, s’il te plaît ?（你能重复一下吗？使用 pouvoir。）', ['peux'], 'pouvoir 与 tu 对应 peux。')
    ]
  }
];

const extraVocabulary = [
  [["bonsoir","晚上好"],["bonne nuit","晚安"],["à demain","明天见"],["madame","女士"],["monsieur","先生"],["comment","怎样"],["bien","好"],["enchanté","很高兴认识你（男性说）"]],
  [["le nom","姓名／姓氏"],["le prénom","名字"],["une adresse","一个地址"],["le téléphone","电话"],["dix","十"],["douze","十二"],["quarante","四十"],["cinquante","五十"]],
  [["le fils","儿子"],["la fille","女儿／女孩"],["le mari","丈夫"],["la femme","妻子／女人"],["grand","高大的（阳性）"],["grande","高大的（阴性）"],["jeune","年轻的"],["sympathique","友好的"]],
  [["se lever","起床"],["dormir","睡觉"],["lire","阅读"],["écrire","写"],["midi","中午十二点"],["minuit","午夜十二点"],["dimanche","星期日"],["et demie","半点（时间用语）"]],
  [["le lait","牛奶"],["le fromage","奶酪"],["le riz","米饭／大米"],["le poisson","鱼"],["la viande","肉"],["les légumes","蔬菜"],["le petit-déjeuner","早餐"],["le dîner","晚餐"]],
  [["la salle de bains","浴室"],["le salon","客厅"],["la maison","房子"],["près de","在……附近"],["devant","在……前面"],["derrière","在……后面"],["la pharmacie","药店"],["un hôpital","一家医院"]],
  [["rouge","红色的"],["noir","黑色的（阳性）"],["blanc","白色的（阳性）"],["la taille","尺码／身高"],["cher","贵的（阳性）"],["il fait chaud","天气热"],["il fait beau","天气晴好"],["pourquoi","为什么"]],
  [["janvier","一月"],["février","二月"],["juillet","七月"],["août","八月"],["un hôtel","一家旅馆"],["une réservation","一项预订"],["partir","出发／离开"],["arriver","到达"]]
];
firstReleaseUnits.forEach((unit, index) => unit.vocabulary.push(...extraVocabulary[index]));

// Units added in the 2026 revision. Their lesson IDs are key-based (e.g. fr-basics-listen), never positional.
const basics = {
  id: 'fr-basics', title: '法语入门', goal: '字母与拼读、数字 0–20、tu 与 vous、课堂用语',
  grammar: '法语字母表与英语一样有 26 个字母，但读音不同：A [a]、E [ə]、I [i]、O [o]、U [y]；G 读 [ʒe]、J 读 [ʒi]、H 读 [aʃ]、W 读 double vé、Y 读 i grec。逐个字母拼写叫 épeler：Comment ça s’écrit ?（怎么写？）重音符号也要念出来：é = e accent aigu、è = e accent grave、ç = c cédille。\ntu 用于朋友、家人和孩子；vous 用于陌生人、长辈和正式场合，也表示“你们”。\n课堂用语：Répétez, s’il vous plaît.（请重复。）Je ne comprends pas.（我不明白。）Comment dit-on « merci » en chinois ?（merci 用中文怎么说？）',
  pronunciation: '词末辅音字母通常不发音（petit、vous），但 c、r、f、l 常发音（avec、bonjour、neuf、il）。ou 读 [u]，u 读 [y]：嘴型像发“乌”，舌位像发“衣”。数字 0–20：zéro, un, deux, trois, quatre, cinq, six, sept, huit, neuf, dix, onze, douze, treize, quatorze, quinze, seize, dix-sept, dix-huit, dix-neuf, vingt。six、dix 单独读时末尾 x 读 [s]。',
  vocabulary: [['zéro','零'],['un','一'],['deux','二'],['trois','三'],['quatre','四'],['cinq','五'],['six','六'],['sept','七'],['huit','八'],['neuf','九'],['onze','十一'],['quinze','十五'],['seize','十六'],['dix-sept','十七'],["l'alphabet",'字母表'],['épeler','（逐个字母）拼写']],
  sentence: 'Je ne comprends pas.', sentenceMeaning: '我不明白。',
  translate: ['请再说一遍。', ["Répétez, s'il vous plaît.", "Vous pouvez répéter, s'il vous plaît ?", "Répète, s'il te plaît.", "Pardon, vous pouvez répéter ?"]],
  translate2: ['我不明白。', ['Je ne comprends pas.']],
  grammarChoice: ['和老师（陌生成年人）说话，应该用哪个代词称呼对方？', ['vous','tu','il'], 'vous', '对陌生人、长辈和正式场合用 vous；tu 用于熟人、家人和孩子。'],
  grammarText: ['补全：Comment ça s’___ ?（怎么拼写？）', ['écrit'], 'Comment ça s’écrit ? 用来询问拼写；écrit 来自动词 écrire（写）。'],
  listen: ['Bonjour ! Mon numéro, c’est le douze. Et toi ?', '说话者的号码是多少？', ['12','2','20'], '12'],
  dictation: ['Quinze.', ['quinze', '15']],
  reading: ['Professeur : Bonjour ! Comment vous appelez-vous ? — Étudiant : Je m’appelle Marc, M-A-R-C. — Professeur : Merci, Marc. Répétez, s’il vous plaît : seize.', '老师最后请学生做什么？', ['重复一个数字','拼写名字','说再见'], '重复一个数字'],
  reviewGrammar: ['补全：Je ne ___ pas.（我不明白。使用 comprendre。）', ['comprends'], 'comprendre 与 je 搭配为 comprends；ne…pas 把动词夹在中间表示否定。'],
  examAudio: ['Un, deux, trois, quatre, cinq. Six, sept, huit, neuf, dix. Onze, douze, treize !', '录音最后一个数字是？', ['13','12','16'], '13'],
  examSentence: ['Comment dit-on merci en chinois ?', '“merci”用中文怎么说？'],
  drills: [
    c('字母 Y 在法语里怎么念？', ['i grec','ou','u'], 'i grec', 'Y 读作 i grec（“希腊的 i”）；W 读作 double vé。'),
    w('用法语写数字“十四”。', ['quatorze'], '14 = quatorze；11–16 各有独立的单词：onze, douze, treize, quatorze, quinze, seize。'),
    c('“十八”的正确写法是？', ['dix-huit','huit-dix','dixhuit'], 'dix-huit', '17–19 用 dix + 数字并加连字符：dix-sept, dix-huit, dix-neuf。'),
    c('和朋友打招呼问“你好吗？”，哪种最自然？', ['Ça va ?','Comment allez-vous ?','Vous allez bien, monsieur ?'], 'Ça va ?', 'Ça va ? 用于熟人之间；Comment allez-vous ? 是用 vous 的礼貌说法。')
  ],
  examItems: [
    c('字母 ç 怎么称呼？', ['c cédille','c accent grave','c accent aigu'], 'c cédille', 'ç 叫 c cédille，读 [s]，如 français、ça。'),
    w('补全：Comment dit-on « bonjour » ___ chinois ?（用中文怎么说？）', ['en'], '“用某种语言”用 en：en chinois、en français。')
  ]
};

const time = {
  id: 'fr-time', title: '时间与作息', goal: '报时、日常作息、代词式动词与 -ir 动词',
  grammar: '报时：Il est huit heures（8:00）、huit heures et quart（8:15）、huit heures et demie（8:30）、neuf heures moins le quart（8:45）、neuf heures moins dix（8:50）。中午 midi，午夜 minuit。问时间：Quelle heure est-il ? 问几点做某事：À quelle heure… ?\n代词式动词带一个与主语一致的代词：je me lève、tu te lèves、il/elle se lève、nous nous levons、vous vous levez、ils/elles se lèvent；元音前 me/te/se 省音：je m’habille。\n规则 -ir 动词 finir：je finis、tu finis、il finit、nous finissons、vous finissez、ils finissent。频率副词：toujours（总是）、souvent（经常）、parfois（有时），一般放在变位动词后。',
  pronunciation: 'quart 的 t 不发音；moins 的 s 不发音。heure 的 h 不发音，所以 une heure、trois heures 要连读。finissons 中的 ss 读 [s]。',
  vocabulary: [['se coucher','睡觉（上床）'],["s'habiller",'穿衣服'],['se doucher','淋浴'],['finir','结束／完成'],['et quart','一刻（时间用语）'],['moins le quart','差一刻'],['tôt','早'],['tard','晚'],['toujours','总是'],['souvent','经常'],['parfois','有时'],['le déjeuner','午餐'],['une heure','一小时／一点钟'],['le week-end','周末'],['la semaine','一周'],['après','之后']],
  sentence: 'Je me lève à sept heures.', sentenceMeaning: '我七点起床。',
  translate: ['现在几点？', ['Quelle heure est-il ?', 'Il est quelle heure ?', 'Quelle heure il est ?']],
  translate2: ['我十一点睡觉。', ['Je me couche à onze heures.', 'Je me couche à 11 heures.', 'Je me couche à 23 heures.', 'Je me couche à vingt-trois heures.']],
  grammarChoice: ['8:45 用法语怎么说？', ['neuf heures moins le quart','huit heures et quart','huit heures moins le quart'], 'neuf heures moins le quart', 'moins le quart 表示“差一刻”：8:45 = 九点差一刻。'],
  grammarText: ['补全：Nous nous ___ à sept heures.（我们七点起床。使用 se lever。）', ['levons'], 'nous 对应 levons，代词也用 nous：nous nous levons。'],
  listen: ['Le matin, je me lève à six heures et demie. Je finis le travail à cinq heures.', '说话者几点起床？', ['六点半','六点一刻','五点'], '六点半'],
  dictation: ['Il est midi.', ['Il est midi.', 'Il est 12 heures.', 'Il est douze heures.']],
  reading: ['Paul se lève tôt, à six heures. Il se douche et il s’habille. Il déjeune à midi. Le soir, il finit le travail à sept heures et il se couche tard.', 'Paul 几点下班？', ['七点','六点','中午'], '七点'],
  reviewGrammar: ['补全：Tu ___ à quelle heure ?（你几点结束？使用 finir。）', ['finis'], 'finir 与 tu 对应 finis。'],
  examAudio: ['Quelle heure est-il ? Il est dix heures et quart. Le cours finit à onze heures.', '课程几点结束？', ['十一点','十点一刻','十点'], '十一点'],
  examSentence: ['Elle se couche à minuit.', '她午夜睡觉。'],
  drills: [
    c('“你几点起床？”哪个正确？', ['À quelle heure tu te lèves ?','À quelle heure tu me lèves ?','Quelle heure tu lèves ?'], 'À quelle heure tu te lèves ?', 'tu 对应代词 te；“几点”用 À quelle heure。'),
    w('补全：Je m’___ vite.（我很快穿好衣服。使用 s’habiller。）', ['habille'], 's’habiller 与 je：je m’habille（元音前 me 省音）。'),
    c('vous + finir 的正确形式是？', ['vous finissez','vous finez','vous finisez'], 'vous finissez', '-ir 动词复数加 -iss-：nous finissons、vous finissez、ils finissent。'),
    w('用法语写出 7:15（使用 et quart）。', ['sept heures et quart', '7 heures et quart'], '一刻用 et quart：sept heures et quart。')
  ],
  examItems: [
    c('“他们经常很晚睡觉”哪个正确？', ['Ils se couchent souvent tard.','Ils se couche souvent tard.','Ils couchent se souvent tard.'], 'Ils se couchent souvent tard.', 'ils 对应 se couchent；频率副词放在变位动词后。'),
    w('补全：Elles ___ à midi.（她们中午结束。使用 finir。）', ['finissent'], 'finir 与 ils/elles 对应 finissent。')
  ]
};

const invite = {
  id: 'fr-invite', title: '爱好与邀请', goal: '谈论爱好，发出、接受与拒绝邀请，写简短消息',
  grammar: '谈爱好：faire du sport / de la natation（faire + de + 定冠词）；球类游戏用 jouer à：jouer au tennis、jouer au foot；乐器用 jouer de：jouer du piano、jouer de la guitare。\n邀请：Tu veux venir au cinéma samedi ? / Ça te dit d’aller au café ? / On va au parc ?（口语中 on 常表示“我们”，变位同 il）。接受：Oui, avec plaisir ! / D’accord ! / Bonne idée !；拒绝：Désolé(e), je ne peux pas. / Je suis occupé(e).；用 parce que 说明原因：parce que je travaille。\nvouloir：je veux、tu veux、il veut、nous voulons、vous voulez、ils veulent；pouvoir：je peux、tu peux、il peut、nous pouvons、vous pouvez、ils peuvent，后面接动词原形。短消息开头写 Salut Léa !，结尾写 Bises 或 À bientôt !',
  pronunciation: 'veux、peux 中的 eu 是圆唇元音 [ø]。avec plaisir 中 plaisir 的 s 读 [z]。on va 中的 on 是鼻化元音，不要读成“昂”。',
  vocabulary: [['inviter','邀请'],["d'accord",'好的／同意'],['avec plaisir','乐意'],['désolé','抱歉的（阳性）'],['occupé','忙的（阳性）'],['le tennis','网球'],['la natation','游泳（运动）'],['la guitare','吉他'],['le foot','足球'],['le parc','公园'],['une fête','一个聚会'],['ce soir','今晚'],['libre','有空的'],['bonne idée','好主意'],['à bientôt','回头见'],['parce que','因为']],
  sentence: 'Tu veux venir au cinéma ?', sentenceMeaning: '你想来看电影吗？',
  translate: ['抱歉，我不能去。', ['Désolé, je ne peux pas.', 'Désolée, je ne peux pas.', 'Désolé, je ne peux pas venir.', 'Désolée, je ne peux pas venir.', 'Je suis désolé, je ne peux pas.', 'Je suis désolée, je ne peux pas.']],
  translate2: ['好的，很乐意！', ["D'accord, avec plaisir !", 'Oui, avec plaisir !', 'Avec plaisir !', "Oui, d'accord, avec plaisir !"]],
  grammarChoice: ['“我弹吉他”哪个正确？', ['Je joue de la guitare.','Je joue à la guitare.','Je fais la guitare.'], 'Je joue de la guitare.', '乐器用 jouer de：jouer de la guitare、jouer du piano；球类用 jouer à。'],
  grammarText: ['补全：Tu ___ venir samedi ?（你想星期六来吗？使用 vouloir。）', ['veux'], 'vouloir 与 tu 对应 veux，后接动词原形 venir。'],
  listen: ['Salut Hugo ! On va au parc samedi ? — Désolé, je ne peux pas, je travaille.', 'Hugo 为什么拒绝？', ['他要工作','他生病了','他不喜欢公园'], '他要工作'],
  dictation: ["D'accord, à samedi !", ["D'accord, à samedi !"]],
  reading: ['Salut Léa ! Il y a une fête chez moi samedi soir. Tu es libre ? Tu peux venir avec ton frère. Réponds-moi vite ! Bises, Nina', 'Nina 邀请 Léa 做什么？', ['参加周六晚上的聚会','周六去打网球','周日一起学习'], '参加周六晚上的聚会'],
  reviewGrammar: ['补全：Nous ne ___ pas venir.（我们不能来。使用 pouvoir。）', ['pouvons'], 'pouvoir 与 nous 对应 pouvons。'],
  examAudio: ['Bonjour Marc, tu veux jouer au tennis dimanche matin ? — Oui, avec plaisir ! À dimanche !', 'Marc 的回答是？', ['接受邀请','拒绝邀请','改到星期六'], '接受邀请'],
  examSentence: ['Je ne peux pas parce que je travaille.', '我去不了，因为我要工作。'],
  drills: [
    c('“他们踢足球”哪个正确？', ['Ils jouent au foot.','Ils jouent du foot.','Ils jouent le foot.'], 'Ils jouent au foot.', '球类运动用 jouer à：à + le foot = au foot。'),
    w('补全：Je fais ___ natation.（我游泳。natation 为阴性。）', ['de la'], 'faire + de la + 阴性运动名词。'),
    c('礼貌地拒绝邀请，哪句合适？', ['Désolé, je suis occupé.','Non, je ne veux pas, au revoir.','Bonne idée !'], 'Désolé, je suis occupé.', '拒绝时先道歉，再说明原因，更礼貌。'),
    w('补全：Vous ___ dîner avec nous ?（您愿意和我们吃晚饭吗？使用 vouloir。）', ['voulez'], 'vouloir 与 vous 对应 voulez。')
  ],
  examItems: [
    c('“我们今晚去咖啡馆吧？”（口语）哪个正确？', ['On va au café ce soir ?','On allons au café ce soir ?','On vont au café ce soir ?'], 'On va au café ce soir ?', 'on 的动词变位与 il 相同：on va。'),
    w('补全：Je ne viens pas ___ je travaille.（我不来，因为我要工作。）', ['parce que'], '说明原因用 parce que。')
  ]
};

const health = {
  id: 'fr-health', title: '身体与健康', goal: '身体部位、描述症状、在药店和诊所交流',
  grammar: '说哪里疼：J’ai mal à la tête / au ventre / aux dents（avoir mal à + 定冠词；à + le = au，à + les = aux）。生病、疲劳：Je suis malade / fatigué(e)，J’ai de la fièvre（发烧）。\n义务与建议：devoir + 动词原形（Vous devez rester au lit，您得卧床休息）；Il faut + 动词原形（Il faut boire de l’eau，需要多喝水）。devoir：je dois、tu dois、il doit、nous devons、vous devez、ils doivent。\n药店：Je voudrais quelque chose contre la toux.（我想要治咳嗽的药。）医生常问：Qu’est-ce qui ne va pas ?（哪里不舒服？）Depuis quand ?（从什么时候开始？）',
  pronunciation: 'mal 的 l 要发出来；tête 中 ê 读开口的 [ɛ]。aux dents 要联诵：aux 的 x 读 [z]。fièvre 的 è 同样是开口音。',
  vocabulary: [['la tête','头'],['le ventre','肚子'],['la gorge','喉咙'],['le dos','背'],['les dents','牙齿'],['malade','生病的'],['fatigué','疲惫的（阳性）'],['un médicament','一种药'],['le bras','手臂'],['la jambe','腿'],['la main','手'],['le pied','脚'],['la fièvre','发烧'],['un rendez-vous','一个预约'],['la toux','咳嗽'],['se reposer','休息']],
  sentence: "J'ai mal à la tête.", sentenceMeaning: '我头疼。',
  translate: ['我肚子疼。', ["J'ai mal au ventre."]],
  translate2: ['我生病了。', ['Je suis malade.']],
  grammarChoice: ['“我牙疼”哪个正确？', ["J'ai mal aux dents.","J'ai mal à les dents.","J'ai mal au dents."], "J'ai mal aux dents.", 'à + les 缩合为 aux：avoir mal aux dents。'],
  grammarText: ['补全：Vous ___ rester au lit.（您得卧床休息。使用 devoir。）', ['devez'], 'devoir 与 vous 对应 devez，后接动词原形。'],
  listen: ['Bonjour docteur. J’ai mal à la gorge et j’ai de la fièvre depuis hier.', '病人从什么时候开始发烧？', ['从昨天','从今天早上','从上周'], '从昨天'],
  dictation: ['Je suis fatigué.', ['Je suis fatigué.', 'Je suis fatiguée.']],
  reading: ['Pharmacien : Bonjour, qu’est-ce qui ne va pas ? — Client : J’ai mal au dos. — Pharmacien : Prenez ce médicament deux fois par jour, et il faut vous reposer.', '药剂师建议吃药的频率是？', ['一天两次','一天一次','一天三次'], '一天两次'],
  reviewGrammar: ['补全：Il ___ boire de l’eau.（需要多喝水。）', ['faut'], 'Il faut + 动词原形 表示“需要／必须”。'],
  examAudio: ['Qu’est-ce qui ne va pas ? — J’ai mal au bras et à la jambe. — Vous devez prendre un rendez-vous avec le médecin.', '病人哪里疼？', ['手臂和腿','头和肚子','背和脚'], '手臂和腿'],
  examSentence: ['Il faut prendre un médicament.', '需要吃药。'],
  drills: [
    c('“他背疼”哪个正确？', ['Il a mal au dos.','Il est mal au dos.','Il a mal à le dos.'], 'Il a mal au dos.', '用 avoir mal à；à + le = au。'),
    w('补全：J’ai mal ___ jambe.（我腿疼。jambe 为阴性。）', ['à la'], '阴性单数用 à la。'),
    c('nous + devoir 的正确形式是？', ['nous devons','nous doivons','nous devez'], 'nous devons', 'devoir：nous devons、vous devez、ils doivent。'),
    w('补全：Elle est ___.（她很累。使用 fatigué 的阴性形式。）', ['fatiguée'], '阴性形容词加 e：fatigué → fatiguée。')
  ],
  examItems: [
    c('在药店想买治咳嗽的药，哪句合适？', ['Je voudrais quelque chose contre la toux.','Je voudrais une toux, s’il vous plaît.','J’ai mal à la toux.'], 'Je voudrais quelque chose contre la toux.', 'contre + 症状 表示“治……的”。'),
    w('补全：Ils ___ se reposer.（他们必须休息。使用 devoir。）', ['doivent'], 'devoir 与 ils/elles 对应 doivent。')
  ]
};

const byId = Object.fromEntries(firstReleaseUnits.map(unit => [unit.id, unit]));
export const units = [basics, byId.fr01, byId.fr02, byId.fr03, byId.fr04, time, byId.fr05, byId.fr06, byId.fr07, invite, health, byId.fr08];

// The A1 graduation test uses its own cumulative items instead of re-asking unit practice questions.
export const finalReview = [
  c('“我叫 Tom，今年十八岁”哪个正确？', ["Je m'appelle Tom et j'ai dix-huit ans.","Je m'appelle Tom et je suis dix-huit ans.","Je suis appelle Tom et j'ai dix-huit ans."], "Je m'appelle Tom et j'ai dix-huit ans.", '名字用 s’appeler，年龄用 avoir … ans。'),
  w('补全：___ habitez-vous ?（您住在哪里？）', ['Où'], 'Où 表示“哪里”，注意重音符号：ou 是“或者”。'),
  c('“他们的孩子们”应选？', ['leurs enfants','leur enfants','ses enfant'], 'leurs enfants', '复数名词前用 leurs。'),
  w('用法语写出 10:30（使用 et demie）。', ['dix heures et demie', '10 heures et demie'], '半点用 et demie。'),
  c('“我不喝咖啡”哪个正确？', ['Je ne bois pas de café.','Je ne bois pas du café.','Je bois ne pas café.'], 'Je ne bois pas de café.', '否定句中部分冠词变为 de。'),
  w('补全：Pour aller à la gare, tournez ___ droite.', ['à'], '方向：à droite、à gauche。'),
  c('“明天会下雨”哪个正确？', ['Demain, il va pleuvoir.','Demain, il pleut hier.','Demain, il a plu.'], 'Demain, il va pleuvoir.', '近期将来时：il va + pleuvoir。'),
  w('补全：J’ai mal ___ tête.（我头疼。）', ['à la'], 'avoir mal à + la tête。')
];

// Optional external practice. Links only; no third-party content is copied into the course.
export const furtherPractice = [
  { label: 'TV5MONDE · Apprendre le français（A1 练习）', url: 'https://apprendre.tv5monde.com/fr/exercices/a1-debutant' },
  { label: 'RFI · Le français facile（A1 练习）', url: 'https://francaisfacile.rfi.fr/fr/exercices/a1/' },
  { label: 'Français interactif（UT Austin，CC BY 4.0）', url: 'https://www.laits.utexas.edu/fi/' }
];
