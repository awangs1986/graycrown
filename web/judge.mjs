export function visibleOutput(value = '') {
  return value.replaceAll(' ', '·').replaceAll('\t', '→').replaceAll('\n', '↵\n') || '(空输出)';
}

function stripComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
}

function matchesOutputRule(rule, output) {
  if (rule.mode === 'oneOf') return (rule.alternatives ?? []).some(item => matchesOutputRule(item, output));
  if (rule.mode === 'exact') {
    const acceptedValues = Array.isArray(rule.value) ? rule.value : [rule.value];
    return acceptedValues.includes(output);
  }
  const lineCount = output.length ? output.replace(/\n$/, '').split('\n').length : 0;
  const required = rule.includes ?? [];
  if (!required.every(item => output.includes(item)) || lineCount < (rule.minLines ?? 0)) return false;
  if (!rule.ordered) return true;
  let cursor = 0;
  for (const item of required) {
    const index = output.indexOf(item, cursor);
    if (index < 0) return false;
    cursor = index + item.length;
  }
  return true;
}

function describeOutputRule(rule) {
  if (rule.mode === 'oneOf') return (rule.alternatives ?? []).map(describeOutputRule).join('\n—— 或 ——\n');
  if (rule.mode === 'exact') return Array.isArray(rule.value) ? rule.value.join('\n—— 或 ——\n') : rule.value;
  return `至少 ${rule.minLines ?? 0} 行，并${rule.ordered ? '按顺序' : ''}包含 ${(rule.includes ?? []).join('、')}`;
}

export function gradeLesson(lesson, source, execution) {
  const tests = [];
  if (!execution.ok) {
    tests.push({ passed: false, name: '编译与运行', message: execution.stage === 'compile' ? '代码尚未通过 Clang 编译。' : '程序没有正常结束。' });
    return { passed: false, execution, tests };
  }

  const outputRule = lesson.validation.output;
  const outputPassed = matchesOutputRule(outputRule, execution.output);
  tests.push({
    passed: outputPassed,
    name: '冒险结果',
    message: outputPassed ? '程序输出与任务目标一致。' : '输出内容、大小写、空格或换行仍与目标不同。',
    actual: execution.output,
    expected: describeOutputRule(outputRule)
  });

  const clean = stripComments(source);
  for (const rule of lesson.validation.code ?? []) {
    const sourceToCheck = rule.source === 'original' ? source : clean;
    const patterns = rule.anyOf ?? [rule.pattern];
    const passed = patterns.some(pattern => {
      const matched = pattern.test(sourceToCheck);
      pattern.lastIndex = 0;
      return matched;
    });
    tests.push({ passed, name: '知识点要求', message: passed ? '指定的 C 语言写法已经出现。' : rule.message });
  }
  if (Number.isInteger(lesson.validation.maxPrintf)) {
    const count = (clean.match(/\bprintf\s*\(/g) ?? []).length;
    tests.push({ passed: count <= lesson.validation.maxPrintf, name: 'printf 次数', message: count <= lesson.validation.maxPrintf ? `使用了 ${count} 次 printf。` : `最多只能使用 ${lesson.validation.maxPrintf} 次 printf，目前有 ${count} 次。` });
  }
  const printfCount = (clean.match(/\bprintf\s*\(/g) ?? []).length;
  if (Number.isInteger(lesson.validation.exactPrintf)) {
    tests.push({ passed: printfCount === lesson.validation.exactPrintf, name: 'printf 次数', message: printfCount === lesson.validation.exactPrintf ? `恰好使用了 ${printfCount} 次 printf。` : `必须恰好使用 ${lesson.validation.exactPrintf} 次 printf，目前有 ${printfCount} 次。` });
  }
  if (Number.isInteger(lesson.validation.minPrintf)) {
    tests.push({ passed: printfCount >= lesson.validation.minPrintf, name: 'printf 次数', message: printfCount >= lesson.validation.minPrintf ? `使用了 ${printfCount} 次 printf。` : `至少需要使用 ${lesson.validation.minPrintf} 次 printf，目前有 ${printfCount} 次。` });
  }
  if (Number.isInteger(lesson.validation.minDeclarations)) {
    const declarationPattern = /\b(?:int|char|float|double)\s+([^;]+);/g;
    let declarationCount = 0;
    for (const match of clean.matchAll(declarationPattern)) declarationCount += match[1].split(',').length;
    tests.push({ passed: declarationCount >= lesson.validation.minDeclarations, name: '变量声明数量', message: declarationCount >= lesson.validation.minDeclarations ? `检测到 ${declarationCount} 个变量声明。` : `至少需要声明 ${lesson.validation.minDeclarations} 个变量，目前检测到 ${declarationCount} 个。` });
  }
  return { passed: tests.every(test => test.passed), execution, tests };
}
