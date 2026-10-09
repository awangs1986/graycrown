// Shared RPG rules. Rewards are derived from completed quest IDs, so replaying a
// trial or reopening a save can never award the same XP, gold or relic twice.
export function rewardFor(lesson, lessons) {
  const boss = !lessons.some(next => next.chapterId === lesson.chapterId && next.localIndex > lesson.localIndex);
  return { xp: boss ? 40 : 20, gold: boss ? 20 : 10, boss };
}
export function adventurer(state, lessons) {
  const done = new Set(state.completed);
  const rewards = lessons.filter(lesson => done.has(lesson.id)).reduce((sum, lesson) => {
    const reward = rewardFor(lesson, lessons);
    return { xp: sum.xp + reward.xp, gold: sum.gold + reward.gold };
  }, { xp: 0, gold: 0 });
  return { ...rewards, level: 1 + Math.floor(rewards.xp / 100), nextLevel: 100 - rewards.xp % 100 };
}
export function chapterComplete(chapter, state) {
  return chapter.lessons.every(lesson => state.completed.includes(lesson.id));
}
export function regionUnlocked(chapters, state, index) {
  return index >= 0 && index < chapters.length && (chapters[index].lessons.some(lesson => state.completed.includes(lesson.id)) || chapters.slice(0, index).every(chapter => chapterComplete(chapter, state)));
}
export function crystalsLeft(state, chapter) {
  const spent = chapter.lessons.filter(lesson => state.answerReveals?.includes(lesson.id)).length;
  return Math.max(0, 3 - spent);
}
export function attachAdventure(chapters, adventure) {
  chapters.forEach((chapter, index) => {
    const region = adventure.regions[index];
    if (!region || region.quests.length !== chapter.lessons.length) throw new Error(`Missing adventure quests: ${chapter.id}`);
    chapter.adventure = region;
    chapter.lessons.forEach((lesson, questIndex) => {
      const [title, story, aftermath] = region.quests[questIndex].split('|');
      if (!title || !story || !aftermath) throw new Error(`Incomplete adventure quest: ${lesson.id}`);
      lesson.adventure = { title, story, aftermath, npc: region.npc, quote: region.quote, boss: questIndex === chapter.lessons.length - 1 };
    });
  });
}
