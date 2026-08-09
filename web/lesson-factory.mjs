const skeleton = `#include <stdio.h>

int main(void) {
    // 在这里完成本次试炼

    return 0;
}`;

export function cProgram(body, helpers = '', headers = '#include <stdio.h>') {
  return `${headers}\n\n${helpers ? `${helpers.trim()}\n\n` : ''}int main(void) {\n${body.trimEnd()}\n    return 0;\n}`;
}

function plain(value) {
  return value.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

export function makeLesson(chapter, number, spec) {
  const id = `D${chapter.day}-Q${String(number).padStart(2, '0')}`;
  const objective = spec.objective ?? spec.task;
  const expected = Array.isArray(spec.expected) ? spec.expected : [spec.expected];
  return {
    id,
    chapterId: chapter.id,
    chapterIndex: chapter.day - 1,
    localIndex: number - 1,
    title: spec.title,
    difficulty: spec.difficulty ?? (number >= 18 ? '★★★ 综合' : number >= 8 ? '★★☆ 基础' : '★☆☆ 入门'),
    knowledge: spec.knowledge,
    minutes: spec.minutes ?? (number === 20 ? 25 : number >= 16 ? 18 : 12),
    quote: spec.quote ?? `“${spec.title}不是障碍，而是第${chapter.day}枚符文留下的考验。”`,
    story: spec.story ?? `${chapter.scene}${spec.task}`,
    objective,
    rules: `输入：${spec.input ? `<code>${spec.inputLabel ?? spec.input.trim()}</code>` : '无'}<br>核心知识：<code>${spec.knowledge}</code><br>建议在 ${spec.minutes ?? (number === 20 ? 25 : number >= 16 ? 18 : 12)} 分钟内完成`,
    starterCode: spec.starterCode ?? skeleton,
    defaultInput: spec.input ?? '',
    hints: spec.hints ?? [
      `先锁定本题唯一的新武器：<code>${spec.knowledge}</code>，不要一次写完整段剧情。`,
      `把目标拆成“准备数据 → 处理数据 → 输出结果”三步：${plain(objective)}`,
      `先让最小示例通过编译，再补齐边界；注意分号、花括号和格式符。`
    ],
    validation: {
      output: spec.outputRule ?? { mode: 'custom', includes: expected.filter(Boolean), minLines: spec.minLines ?? 1, ordered: expected.length > 1 },
      code: (spec.must ?? []).map(([pattern, message]) => Array.isArray(pattern)
        ? { anyOf: pattern, message }
        : { pattern, message })
    },
    passStory: spec.passStory ?? `“${spec.title}”的符文碎片化作流光，飞向${chapter.title}深处。`,
    solution: spec.solution
  };
}

export function buildChapter(chapter, specs) {
  if (specs.length !== 20) throw new Error(`${chapter.id} 必须恰好包含20题，目前是${specs.length}题。`);
  const lessons = specs.map((spec, index) => makeLesson(chapter, index + 1, spec));
  return { ...chapter, total: lessons.length, lessons };
}
