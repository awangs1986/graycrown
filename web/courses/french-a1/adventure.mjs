import { castNames, VILLAIN } from './art.mjs';
// RPG frame: the prankster Gribouille 先生 has scribbled over the speech bubbles of Paris.
// Every lesson repairs one comic panel; every unit ends with a boss fight against him.
export const adventure = {
  title: '巴黎漫画大冒险', subtitle: '法语 A1 · 原创漫画 RPG', emblem: '🥐', role: '见习漫画侦探', theme: 'comic-fr',
  prologue: '一个清晨，戴贝雷帽的捣蛋鬼 Gribouille 先生用墨水把巴黎所有的对话气泡都涂花了：咖啡馆点不了单，面包店报不出价，地铁广播变成了乱码。你和好朋友 Léa 从学校出发，走过街角、面包店、地铁站、市集、塞纳河畔和火车站，用法语把每一格漫画修好。答对就能发动招式击退捣乱，每打败一次 Gribouille 先生，就能把一页巴黎漫画收进你的漫画册。旅途从一句 bonjour 开始。',
  ending: '最后一个气泡回到了原位，Gribouille 先生的贝雷帽被风吹进了塞纳河。巴黎人又能用法语问候、点单、问路、看病和买车票了。你的漫画册装满了十二页——你已经能在熟悉的 A1 场景里读、写、听懂简单法语。Léa 递给你一张去下一站的车票：À bientôt !',
  regions: []
};
const R = (name, icon, npc, relic, quote, description) => ({ name, icon, npc, relic, quote, description });
export const regionInfo = {
  'fr-basics': R('街角小学', '✏️', 'anne', '字母页', '先读准字母和数字，法语之门就打开了。', '黑板上的字母和数字被涂乱了，跟 Anne 老师一起把它们念回来。'),
  fr01: R('蒙马特街角', '🗼', 'hugo', '问候页', 'Bonjour ! 一句问候，街角就不再陌生。', '街上的问候气泡被墨水弄花了，帮路人重新打招呼、自我介绍。'),
  fr02: R('街区邮局', '✉️', 'marie', '名片页', '说清名字、年龄和职业，信才不会寄错。', '邮局的登记卡被涂乱了，帮 Marie 核对每位顾客的信息。'),
  fr03: R('Léa 的公寓', '🏠', 'anne', '家庭页', '每个称呼，都连着一位家人。', '全家福的说明被搅乱了，用法语介绍家人和朋友。'),
  fr04: R('晨光面包店', '🥖', 'luc', '日常页', '一天从一根刚出炉的长棍面包开始。', '面包店的作息表乱了，用日常动词把一天理顺。'),
  'fr-time': R('地铁 1 号线', '🚇', 'luc', '时刻页', '报准时间，才赶得上下一班地铁。', '地铁广播的时间全乱了，用时间表达帮乘客赶上车。'),
  fr05: R('转角咖啡馆', '☕', 'camille', '点单页', 'Un café, s’il vous plaît ! 礼貌点单，热咖啡就来了。', '咖啡馆的菜单和账单被涂花了，帮 Camille 接好每一份点单。'),
  fr06: R('塞纳河畔', '🌉', 'zoe', '方向页', '先找到地标，再向前走一步。', '河畔的路牌被调了包，用方位和问路句帮游客找到地方。'),
  fr07: R('露天市集', '🧺', 'ines', '购物页', '颜色、尺码、价格——说清楚再买。', '市集的价签和天气预报都乱了，帮顾客买到想要的东西。'),
  'fr-invite': R('卢森堡花园', '🌳', 'ines', '邀请页', '一句邀请，就能多一个朋友。', '花园野餐的邀请卡被涂花了，用法语发出和回复邀请。'),
  'fr-health': R('街角药房', '➕', 'camille', '健康页', '先说清哪里不舒服，才能对症拿药。', '药房的问诊卡被搅乱了，用身体与健康词汇帮病人说明情况。'),
  fr08: R('巴黎里昂火车站', '🚆', 'paul', '启程页', '最后一段路，把学过的话都带上车。', 'Gribouille 先生躲进了火车站！买好车票、订好旅馆，完成最后的对决。')
};
const QUEST = {
  'vocab-meaning': '单词贴纸|{npc} 发现{place}的单词贴纸被 Gribouille 先生撕乱了，先认出它们的意思。|贴纸回到原位，画格重新有了颜色。',
  'vocab-choice': '找回对白|气泡里缺了一个法语单词，{npc} 等你挑出正确的那一个。|对白恢复完整，路人笑着说 Merci !',
  spelling: '描线工作|墨水被打翻了，请亲手把单词拼写出来，别忘了重音符号。|清晰的字母重新出现在画格里。',
  order: '拼回句子|Gribouille 先生把一句台词剪成了碎片，按顺序把它们拼回去。|台词拼好了，角色终于能开口说话。',
  'grammar-choice': '语法机关|{place}门口的语法机关需要正确的句式才能打开。|机关咔嗒一声打开了。',
  'grammar-text': '补全对白|{npc} 的台词少了几个词，补全它们让对话继续。|对话顺畅地进行下去。',
  drill: '连环陷阱|Gribouille 先生布置了一串语法陷阱，逐一拆除它们。|陷阱全部失效，前路畅通。',
  translate: '翻译气泡|有人只会说中文，帮他把想说的话写成法语气泡。|法语气泡升起，大家都听懂了。',
  listen: '广播电台|{place}的广播被干扰了，听清录音里的关键信息。|广播恢复清晰，人们按指示行动。',
  dictation: '速记员|把听到的法语一字不差地记下来，交给 {npc} 存档。|录音和文字终于对上了。',
  reading: '阅读漫画|一页便条或短文被涂花了，读懂它并回答问题。|你读懂了这一页，故事线重新连上。',
  practice: '街区巡逻|在{place}巡逻一圈，用本章的词汇、语法和听力处理各种小麻烦。|居民们对你说：Bravo !',
  exam: `Boss 战：${VILLAIN}|${VILLAIN}亲自出现在{place}！用本章全部知识与他对决，夺回这一页漫画。|${VILLAIN}狼狈逃走，{relic}收进了你的漫画册。`
};
adventure.prepare = chapters => {
  adventure.subtitle = `法语 A1 · ${chapters.length} 个巴黎街区 · ${chapters.reduce((n, c) => n + c.lessons.length, 0)} 格漫画`;
  adventure.regions = chapters.map(chapter => {
    const info = regionInfo[chapter.id];
    if (!info) throw new Error(`Unknown French adventure region: ${chapter.id}`);
    const fill = template => template.replaceAll('{npc}', castNames[info.npc]).replaceAll('{place}', info.name).replaceAll('{relic}', `「${info.relic}」`);
    return { ...info, npc: `${castNames[info.npc]} · Paris`, relicIcon: '▤', relicLore: `${chapter.title}：${chapter.goal}`, description: `${info.description}（${chapter.goal}）`, quests: chapter.lessons.map(lesson => fill(QUEST[lesson.key] ?? QUEST.practice)) };
  });
};
