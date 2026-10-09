import { castNames } from './art.mjs';
// RPG frame: Mr Muddle has scrambled the speech bubbles of Comic City. Every lesson restores one panel.
export const adventure = {
  title: '漫画城英语大冒险', subtitle: '新概念 1–2 册大纲 · 原创漫画 RPG', emblem: '💬', role: '见习漫画英雄', theme: 'comic',
  prologue: '一夜之间，捣蛋鬼 Muddle 先生把漫画城里所有的对话气泡都搅乱了：咖啡馆的人说不出“打扰一下”，车站广播变成乱码，故事书里的结局也不见了。你和好朋友 Leo、Mia 一起，从街角咖啡馆出发，穿过二十五个街区，用英语把每一格漫画修好。第一册是漫画城的日常街区，第二册是讲故事的海岸小镇。答对就能发动招式击退 Muddle 的捣乱，每修好一章，就能把一页漫画收进你的漫画册。',
  ending: '最后一个对话气泡回到了原位，Muddle 先生的帽子被风吹进了海里。漫画城的居民又能用英语问候、购物、讲故事了。你的漫画册已经装满二十五页——从 “Excuse me!” 到 “It must have been the dog!”，你已经走完了新概念一、二册大纲对应的全部语法旅程。',
  regions: []
};
const R = (name, icon, npc, relic, quote, description) => ({ name, icon, npc, relic, quote, description });
export const regionInfo = {
  'en1-01': R('街角咖啡馆', '☕', 'mia', '问候页', 'Excuse me! 一句礼貌的开场，就能打开对话。', '咖啡馆里的失物都分不清主人了，帮客人确认物品。'),
  'en1-02': R('新朋友办公室', '🪪', 'grant', '名片页', '先说清你是谁，别人才记得住你。', '办公室的名牌被搅乱，帮大家重新介绍自己。'),
  'en1-03': R('彩虹服装店', '🎨', 'ada', '颜色页', '没有颜色的漫画格，就像没有形容词的句子。', 'Muddle 偷走了衣服的颜色，用英语把它们涂回来。'),
  'en1-04': R('阳光公园', '🌳', 'mia', '人群页', 'This one, these ones——数清楚再说话。', '公园里的人和物都在“复制”，分清单数和复数。'),
  'en1-05': R('奶奶的家', '🏠', 'rose', '失物页', 'Whose is it? 物归原主的魔法问句。', '奶奶家的东西全混在一起，帮每件物品找到主人。'),
  'en1-06': R('乱糟糟厨房', '🍳', 'rose', '方位页', 'There is… There are… 先看清，再开口。', '厨房的东西被搬乱了，用方位介词把它们放回原处。'),
  'en1-07': R('正在进行广场', '🚲', 'sam', '动作页', '此刻正在发生的事，要用 -ing 抓住。', '广场上每个人都在做事，说出他们正在做什么。'),
  'en1-08': R('请求小厨房', '🥄', 'rose', '礼貌页', 'Please 是最短的魔法咒语。', '用祈使句和宾格代词，帮奶奶准备晚餐。'),
  'en1-09': R('日常闹钟塔', '⏰', 'sam', '作息页', '每天都做的事，用一般现在时记录。', '闹钟塔停了，用日常习惯的句子让时间重新走动。'),
  'en1-10': R('街角小店', '🛒', 'ada', '购物页', 'How much? How many? 先分清能不能数。', '小店的价签全乱了，帮顾客买到想要的东西。'),
  'en1-11': R('能力学校', '🏫', 'grant', '规则页', 'can 是能力，must 是规则。', '学校的校规被涂改了，用情态动词恢复秩序。'),
  'en1-12': R('昨日车站', '🚉', 'bell', '回忆页', '昨天发生的事，动词要换上过去式。', '车站的失物登记写错了时间，帮警官还原昨天的经过。'),
  'en1-13': R('明日机场', '✈️', 'mia', '计划页', 'going to 是计划，will 是预测与决定。', '航班计划和天气预报都乱了，把未来说清楚。'),
  'en1-14': R('经历相册馆', '📸', 'leo', '经历页', '做过的事留下的结果，用现在完成时说。', '相册里的经历被打乱，用 have done 把它们整理好。'),
  'en1-15': R('比一比大街', '🏁', 'sam', '冠军页', '-er than，the -est——比赛开始！', '大街上的比赛结果全反了，用比较级和最高级判定冠军。'),
  'en2-01': R('故事海岸·入口', '📖', 'bell', '开篇页', 'One day… 每个好故事都从过去时开始。', '海岸小镇的故事书缺了经过，按时间顺序把故事讲完。'),
  'en2-02': R('海岸图书馆', '📚', 'grant', '冠词页', 'a、an、the——小词也能改变故事。', '图书馆的书名丢了冠词，帮管理员把它们补回来。'),
  'en2-03': R('暴风雨之夜', '🕯️', 'rose', '烛光页', '当……的时候，正在……', '暴风雨夜里停电了，用过去进行时还原那个晚上。'),
  'en2-04': R('海港公司', '💼', 'lin', '时间线页', 'for 一段时间，since 一个起点。', '公司的时间线被搅乱，分清现在完成时和一般过去时。'),
  'en2-05': R('潮汐车站', '🚆', 'mia', '先后页', '过去的过去，用 had done。', '列车时刻表的先后顺序乱了，用过去完成时理清。'),
  'en2-06': R('石桥村', '🌉', 'grant', '历史页', '重点在“被做了什么”时，用被动语态。', '村子的历史牌坊被涂改，用被动语态写回去。'),
  'en2-07': R('如果花园', '🌦️', 'mia', '假设页', 'If… 现实与假设，时态各不相同。', '花园的天气机器失灵，用条件句做出两套计划。'),
  'en2-08': R('传话诊所', '📞', 'lin', '传话页', '转述别人的话，时态要往后退一步。', '诊所的留言被传错了，用间接引语准确转述。'),
  'en2-09': R('秘方咖啡馆', '🍰', 'ada', '秘方页', 'who、which、whose，把信息连成一句。', '咖啡馆的秘方卡被拆散，用定语从句把描述拼完整。'),
  'en2-10': R('侦探灯塔', '🔍', 'bell', '推理页', 'must、might、can\'t——证据决定把握。', '灯塔下发生了怪事，用推测情态动词找出真相。')
};
const QUEST = {
  'vocab-meaning': ['单词贴纸|{npc} 发现{place}的单词贴纸被 Muddle 先生撕乱了，先认出它们的意思。|贴纸回到原位，画格重新有了颜色。'],
  'vocab-choice': ['找回对白|气泡里缺了一个英语单词，{npc} 等你挑出正确的那一个。|对白恢复完整，路人点头微笑。'],
  spelling: ['描线工作|墨水被打翻了，请亲手把单词拼写出来，替画师描好线。|清晰的字母重新出现在画格里。'],
  order: ['拼回句子|Muddle 把一句台词剪成了碎片，按顺序把它们拼回去。|台词拼好了，角色终于能开口说话。'],
  'grammar-choice': ['语法机关|{place}门口的语法机关需要正确的句式才能打开。|机关咔嗒一声打开了。'],
  'grammar-text': ['补全对白|{npc} 的台词少了几个词，补全它们让对话继续。|对话顺畅地进行下去。'],
  drill: ['连环陷阱|Muddle 布置了一串语法陷阱，逐一拆除它们。|陷阱全部失效，前路畅通。'],
  translate: ['翻译气泡|有人只会说中文，帮他把想说的话写成英语气泡。|英语气泡升起，大家都听懂了。'],
  listen: ['广播电台|{place}的广播被干扰了，听清录音里的关键信息。|广播恢复清晰，人们按指示行动。'],
  dictation: ['速记员|把听到的英语一字不差地记下来，交给速记员存档。|录音和文字终于对上了。'],
  reading: ['阅读漫画|一页对话或小故事被打乱，读懂它并回答问题。|你读懂了这一页，故事线重新连上。'],
  practice: ['街区巡逻|在{place}巡逻一圈，用本章学到的词汇、语法和听力处理各种小麻烦。|居民们给你竖起大拇指。'],
  exam: ['Boss 战：Muddle 先生|Muddle 先生亲自出现在{place}！用本章全部知识与他对决，夺回这一页漫画。|Muddle 先生狼狈逃走，{relic}收进了你的漫画册。']
};
adventure.prepare = chapters => {
  adventure.subtitle = `新概念 1–2 册大纲 · ${chapters.length} 个街区 · ${chapters.reduce((n, c) => n + c.lessons.length, 0)} 格漫画`;
  adventure.regions = chapters.map(chapter => {
    const info = regionInfo[chapter.id];
    if (!info) throw new Error(`Unknown English adventure region: ${chapter.id}`);
    const npc = `${castNames[info.npc]} · ${chapter.book === 1 ? '漫画城' : '故事海岸'}`;
    const fill = template => template.replaceAll('{npc}', castNames[info.npc]).replaceAll('{place}', info.name).replaceAll('{relic}', `「${info.relic}」`);
    return { ...info, npc, relicIcon: '▤', relicLore: `${chapter.title}：${chapter.goal}`, description: `${info.description}（${chapter.book === 1 ? '第一册' : '第二册'}大纲 · ${chapter.goal}）`, quests: chapter.lessons.map(lesson => fill(QUEST[lesson.key][0])) };
  });
};
