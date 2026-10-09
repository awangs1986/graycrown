import { createBattle } from './battle.mjs';
import { adventure, regionInfo } from './adventure.mjs';
import { comicPanel } from './art.mjs';
import { PUBLIC_SITE } from '../../deployment.mjs';
import { chapters, lessons, credits } from './course.mjs';
import { shuffled } from './judge.mjs';
import { createCoursePlayer, element, button } from '../shared/player.mjs';
import { chapterComplete } from '../shared/adventure.mjs';
// Loaded after the shared player stylesheet so the comic theme wins on equal specificity.
import './comic.css';

const panel = (scene, className = 'comic-figure') => { const node = element('figure', null, className); node.innerHTML = comicPanel(scene); return node; };
const cover = chapter => ({ place: chapter.place, cast: chapter.cast, props: chapter.lessons[0].questions[0].scene.props, caption: `${chapter.book === 1 ? 'BOOK 1' : 'BOOK 2'} · ${regionInfo[chapter.id].name}`, label: `${regionInfo[chapter.id].name} 封面` });
const presentation = {
  setup(ui, tools, showDialog) {
    tools.prepend(button('▤ 我的漫画册', () => {
      if (ui.busy) return;
      showDialog(`漫画册 · ${chapters.length} 页`, dialog => {
        const done = chapters.filter(chapter => chapterComplete(chapter, ui.state));
        dialog.append(element('p', `已收录 ${done.length} / ${chapters.length} 页。打败每章的 Muddle 先生即可收录该页。`));
        const grid = element('div', null, 'comic-book');
        for (const chapter of chapters) {
          const page = element('section', null, `comic-page ${chapterComplete(chapter, ui.state) ? '' : 'locked'}`);
          if (chapterComplete(chapter, ui.state)) page.append(panel(cover(chapter), 'comic-thumb'));
          else page.append(element('div', '?', 'comic-thumb comic-locked'));
          page.append(element('strong', `${regionInfo[chapter.id].icon} ${regionInfo[chapter.id].relic}`), element('small', chapter.title));
          grid.append(page);
        }
        dialog.append(grid, element('p', credits.syllabus, 'comic-credit'));
      });
    }));
  },
  start(card) {
    card.append(panel({ place: 'street', cast: ['leo', 'mia', 'sam'], bubble: "Let's fix Comic City!", caption: 'COMIC CITY · 第 0 页', label: 'Leo、Mia 和 Sam 出发' }, 'comic-figure comic-hero'));
    card.append(element('p', credits.syllabus, 'comic-credit'));
  },
  map(main, chapter) {
    main.append(panel({ ...cover(chapter), villain: true, burst: '?!' }, 'comic-figure comic-cover'));
  },
  node(node, lesson) { node.append(element('span', lesson.key === 'exam' ? 'BOSS · Muddle 先生' : `${lesson.questions.length} 格漫画`, 'comic-node-tag')); },
  victory(dialog, lesson) {
    const chapter = chapters[lesson.chapterIndex];
    dialog.prepend(panel({ place: chapter.place, cast: chapter.cast, bubble: lesson.key === 'exam' ? 'We did it!' : 'Great job!', burst: 'YES!', caption: lesson.title, label: '胜利画格' }, 'comic-figure comic-victory'));
  }
};

export async function mount(root, context) {
  return createCoursePlayer(root, context, { title: '英语 · 漫画城大冒险（新概念 1–2 册大纲）', subtitle: `${chapters.length} 个街区 · ${lessons.length} 格漫画任务 · 原创内容`, chapters, lessons, adventure, presentation }, ui => {
    const { body, lesson, chapter } = ui;
    const responses = ui.state.responses[lesson.id] && typeof ui.state.responses[lesson.id] === 'object' && !Array.isArray(ui.state.responses[lesson.id]) ? ui.state.responses[lesson.id] : {};
    ui.state.responses[lesson.id] = responses;
    const battle = createBattle(ui, responses);
    const media = []; let vocabularyAudio;
    const goal = element('p', null, 'unit-goal'); goal.append(element('span', `${chapter.book === 1 ? '第一册' : '第二册'}大纲 · 本章目标`), element('strong', chapter.goal)); body.append(goal);
    const vocab = element('details', null, 'learn-explanation'); vocab.append(element('summary', `本章词表与发音（${chapter.vocabulary.length} 项）`));
    const grid = element('div', null, 'vocabulary-grid');
    for (const item of chapter.vocabulary) {
      const card = element('div', null, 'vocabulary-card'), copy = element('div', item.en); copy.append(element('small', item.meaning));
      const play = button('▶', async () => { vocabularyAudio?.pause(); vocabularyAudio = new Audio(item.audio); try { await vocabularyAudio.play(); } catch { ui.notify('音频无法播放，请检查课程音频文件。'); } }); play.setAttribute('aria-label', `播放 ${item.en}`); card.append(play, copy); grid.append(card);
    }
    vocab.append(grid, element('p', `发音与朗读：${chapter.tips}`)); body.append(vocab);
    if (lesson.questions.some(q => q.audio)) body.append(element('p', '先听录音再回答，可以重复播放或调慢速度。需要帮助时再查看文字稿。', 'learn-explanation'));
    for (const [index, question] of lesson.questions.entries()) {
      const field = element('fieldset', null, 'french-question english-question'); field.dataset.questionId = question.id;
      const legend = element('legend'); legend.append(element('span', String(index + 1), 'question-number'), document.createTextNode(question.prompt)); field.append(legend);
      field.append(panel(question.scene));
      if (question.passage) field.append(element('p', question.passage, 'fr-passage en-passage'));
      if (question.audio) {
        const box = element('div', null, 'listening-box'); field.append(box);
        const audio = element('audio'); audio.controls = true; audio.preload = 'none'; audio.src = question.audio; audio.setAttribute('aria-label', `第${index + 1}题英语录音`); media.push(audio); box.append(audio);
        audio.addEventListener('play', () => { media.filter(item => item !== audio).forEach(item => item.pause()); vocabularyAudio?.pause(); });
        audio.addEventListener('error', () => ui.notify('无法加载听力音频。请检查安装包中的 audio/en 文件夹。'));
        const speed = button('慢速 0.8×', () => { audio.playbackRate = audio.playbackRate === 1 ? 0.8 : 1; speed.textContent = audio.playbackRate === 1 ? '慢速 0.8×' : '恢复正常速度'; }); box.append(speed);
        const transcript = element('details'); transcript.append(element('summary', '需要帮助：查看文字稿'), element('p', question.transcript));
        transcript.addEventListener('toggle', () => { if (transcript.open) { ui.state.assisted[lesson.id] = true; ui.save(); } }); box.append(transcript);
      }
      const saveAnswer = value => { responses[question.id] = value; ui.save(); field.querySelector('[aria-live]')?.replaceChildren(); };
      if (question.type === 'choice') {
        shuffled(question.options, question.id).forEach(option => {
          const label = element('label', null, 'french-choice'), input = element('input'); input.type = 'radio'; input.name = question.id; input.value = option; input.checked = responses[question.id] === option; input.setAttribute('aria-label', option);
          input.addEventListener('change', () => saveAnswer(option)); label.append(input, element('span', option)); field.append(label);
        });
      } else if (question.type === 'ordering') {
        let selected = Array.isArray(responses[question.id]) ? [...responses[question.id]] : [];
        const answer = element('div', null, 'word-answer'); answer.setAttribute('aria-label', '已选词语'); answer.dataset.placeholder = '点击下方单词，按顺序组成句子';
        const bank = element('div', null, 'word-bank');
        const redraw = () => {
          answer.replaceChildren(...selected.map((word, position) => button(word, () => { selected.splice(position, 1); saveAnswer([...selected]); redraw(); }, '')));
          const remaining = [...selected];
          bank.replaceChildren(...shuffled(question.tokens.map((word, position) => ({ word, position })), question.id).map(({ word }) => {
            const used = remaining.indexOf(word); const control = button(word, () => { selected.push(word); saveAnswer([...selected]); redraw(); }, '');
            if (used >= 0) { remaining.splice(used, 1); control.disabled = true; } return control;
          }));
        };
        redraw(); field.append(answer, bank, button('重新排列', () => { selected = []; saveAnswer([]); redraw(); }));
      } else {
        const input = element('input', null, 'french-answer english-answer'); input.type = 'text'; input.lang = 'en'; input.autocomplete = 'off'; input.spellcheck = false; input.setAttribute('aria-label', question.prompt); input.value = typeof responses[question.id] === 'string' ? responses[question.id] : '';
        input.addEventListener('input', () => saveAnswer(input.value)); field.append(input);
      }
      const message = element('div'); message.setAttribute('aria-live', 'polite'); field.append(message); body.append(field); battle.addQuestion(question, field, message);
    }
    battle.mountControls();
    if (!PUBLIC_SITE) body.append(button('召唤英语导师', () => ui.askTutor({ code: JSON.stringify(responses), objective: lesson.questions.map(q => q.prompt).join('\n'), compilerMessage: battle.feedback, output: '' })));
    const answers = element('div');
    body.append(button('◈ 真知水晶 · 参考答复', async () => {
      if (!await ui.revealAnswer()) return;
      answers.replaceChildren(...lesson.questions.map((q, index) => element('p', `${index + 1}. ${q.answers.slice(0, 3).join(' / ')} — ${q.explanation}`, 'learn-explanation')));
    }), answers);
    return () => { battle.dispose(); media.forEach(audio => { audio.pause(); audio.removeAttribute('src'); audio.load(); }); vocabularyAudio?.pause(); };
  });
}
