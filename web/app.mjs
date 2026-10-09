import { courses, getCourse, localized } from './course-registry.mjs';
import { PUBLIC_SITE } from './deployment.mjs';
import { emptyLibrary, loadLibrary, normalizeLibrary, withCourseProgress, writeLibrary } from './save-store.mjs';

const $ = selector => document.querySelector(selector);
let library = emptyLibrary();
let player = null;
let transition = false;
let storageAvailable = false;
let saveChain = Promise.resolve();
const tr = (en, zh) => library.language === 'zh-CN' ? zh : en;

function report(error) {
  $('#libraryStatus').textContent = error.message;
  $('#libraryStatus').hidden = false;
}

function persist() {
  const snapshot = structuredClone(library);
  const operation = saveChain.catch(() => {}).then(() => {
    if (!storageAvailable) throw new Error(tr('Reload after restoring access to your local save.', '请恢复本地存档访问后刷新页面。'));
    return writeLibrary(snapshot);
  });
  saveChain = operation;
  return operation;
}

function renderLibrary() {
  document.documentElement.lang = library.language;
  document.title = tr('Gray Crown · Courses', '灰烬王冠 · 课程');
  $('#libraryLanguage').textContent = tr('中文', 'English');
  $('#libraryEyebrow').textContent = tr('YOUR LEARNING ADVENTURES', '开启你的学习旅程');
  $('#libraryTitle').textContent = tr('Choose your course', '选择一门课程');
  $('#libraryDescription').textContent = PUBLIC_SITE
    ? tr('Progress is saved in this browser. Export a backup before clearing browser data or changing devices. AI mentor is not available on this public site.', '进度保存在当前浏览器。清理浏览器数据或更换设备前，请导出备份。公开网页版暂不提供 AI 导师。')
    : tr('Each course has its own journey, drafts and progress.', '每门课程拥有独立的旅程、草稿和学习进度。');
  document.body.classList.toggle('public-learning-site', PUBLIC_SITE);
  $('#exportLibrary').textContent = tr('Export all progress', '导出全部课程进度');
  $('#importLibraryLabel').textContent = tr('Import backup', '导入备份');
  $('#courseCards').replaceChildren(...courses.map(course => {
    const card = document.createElement('article');
    card.className = 'course-card';
    card.dataset.courseId = course.id;
    const emblem = document.createElement('span');
    emblem.className = 'course-emblem';
    emblem.setAttribute('aria-hidden', 'true');
    const title = document.createElement('h2');
    title.textContent = localized(course.title, library.language);
    const description = document.createElement('p');
    description.textContent = localized(course.description, library.language);
    const button = document.createElement('button');
    button.className = 'primary-btn';
    button.type = 'button';
    button.disabled = course.status !== 'available' || !storageAvailable;
    button.textContent = course.status !== 'available'
      ? tr('Coming later', '待制作')
      : Object.hasOwn(library.courses, course.id) ? tr('Continue course', '继续学习') : tr('Enter course', '进入课程');
    button.addEventListener('click', () => openCourse(course.id));
    const started = Object.hasOwn(library.courses, course.id);
    const badge = document.createElement('span');
    badge.className = `course-badge${started ? ' started' : ''}`;
    badge.textContent = started ? tr('In progress', '学习中') : tr('New', '未开始');
    const head = document.createElement('div');
    head.className = 'course-card-head';
    head.append(emblem, badge);
    card.append(head, title, description, button);
    return card;
  }));
}

async function openCourse(id) {
  const course = getCourse(id);
  if (transition || player || !storageAvailable || course?.status !== 'available') return;
  transition = true;
  $('#libraryStatus').hidden = true;
  try {
    const module = await course.load();
    library.activeCourseId = id;
    await persist();
    // A course sees only its own progress. All writes pass through this captured ID.
    player = await module.mount($('#courseRoot'), {
      courseId: id,
      language: library.language,
      progress: structuredClone(library.courses[id] ?? null),
      async saveProgress(progress) {
        library = withCourseProgress(library, id, progress);
        // C v2 progress includes the interface language for legacy backup compatibility.
        if (['en', 'zh-CN'].includes(progress.language)) library.language = progress.language;
        document.documentElement.lang = library.language;
        $('#backToCourses').textContent = tr('← Courses', '← 返回课程');
        $('#activeCourseTitle').textContent = localized(course.title, library.language);
        await persist();
        return structuredClone(progress);
      }
    });
    $('#library').hidden = true;
    $('#courseRoot').hidden = false;
    $('#courseNavigation').hidden = false;
    $('#backToCourses').textContent = tr('← Courses', '← 返回课程');
    $('#activeCourseTitle').textContent = localized(course.title, library.language);
    window.scrollTo(0, 0);
  } catch (error) { report(error); }
  finally { transition = false; }
}

$('#backToCourses').addEventListener('click', async () => {
  if (transition || !player) return;
  transition = true;
  try {
    await player.flush();
    player.dispose();
    player = null;
    $('#courseRoot').hidden = true;
    $('#courseNavigation').hidden = true;
    $('#library').hidden = false;
    $('#libraryStatus').hidden = true;
    renderLibrary();
  } catch (error) { report(error); }
  finally { transition = false; }
});

$('#libraryLanguage').addEventListener('click', async () => {
  if (transition) return;
  library.language = tr('zh-CN', 'en');
  renderLibrary();
  try { await persist(); } catch (error) { report(error); }
});

$('#exportLibrary').addEventListener('click', () => {
  if (!storageAvailable) return;
  const url = URL.createObjectURL(new Blob([JSON.stringify(library, null, 2)], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `gray-crown-courses-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
});

$('#importLibrary').addEventListener('change', async event => {
  const file = event.target.files?.[0];
  event.target.value = '';
  if (!file || transition || !storageAvailable) return;
  transition = true;
  try {
    const backup = normalizeLibrary(JSON.parse(await file.text()));
    if (!confirm(tr('Import these courses? Matching courses will be replaced; other courses will be kept.', '导入这些课程进度？同名课程会被替换，其他课程会保留。'))) return;
    const previous = library;
    library = normalizeLibrary({ ...library, courses: { ...library.courses, ...backup.courses } });
    try { await persist(); } catch (error) { library = previous; throw error; }
    renderLibrary();
    $('#libraryStatus').hidden = true;
  } catch (error) { report(error); }
  finally { transition = false; }
});

try {
  library = await loadLibrary();
  storageAvailable = true;
} catch (error) { report(error); }
renderLibrary();
// Preserve the existing explicit regression entry point without loading C on the course shelf.
if (new URLSearchParams(location.search).has('regression')) await openCourse('c');
