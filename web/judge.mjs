export function visibleOutput(value = '', language = 'zh-CN') {
  return value.replaceAll(' ', '·').replaceAll('\t', '→').replaceAll('\n', '↵\n') || (language === 'zh-CN' ? '(空输出)' : '(empty output)');
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

function describeOutputRule(rule, language) {
  const zh = language === 'zh-CN';
  if (rule.mode === 'oneOf') return (rule.alternatives ?? []).map(item => describeOutputRule(item, language)).join(zh ? '\n—— 或 ——\n' : '\n—— OR ——\n');
  if (rule.mode === 'exact') return Array.isArray(rule.value) ? rule.value.join(zh ? '\n—— 或 ——\n' : '\n—— OR ——\n') : rule.value;
  return zh
    ? `至少 ${rule.minLines ?? 0} 行，并${rule.ordered ? '按顺序' : ''}包含 ${(rule.includes ?? []).join('、')}`
    : `At least ${rule.minLines ?? 0} line(s), containing ${(rule.includes ?? []).join(', ')}${rule.ordered ? ' in this order' : ''}`;
}

export function gradeLesson(lesson, source, execution, language = 'zh-CN') {
  const zh = language === 'zh-CN';
  const tests = [];
  if (!execution.ok) {
    tests.push({ passed: false, name: zh ? '编译与运行' : 'Compile and Run', message: execution.stage === 'compile' ? (zh ? '代码尚未通过 Clang 编译。' : 'The code did not pass Clang compilation.') : (zh ? '程序没有正常结束。' : 'The program did not finish normally.') });
    return { passed: false, execution, tests };
  }

  const outputRule = lesson.validation.output;
  const outputPassed = matchesOutputRule(outputRule, execution.output);
  tests.push({
    passed: outputPassed,
    name: zh ? '冒险结果' : 'Adventure Result',
    message: outputPassed ? (zh ? '程序输出与任务目标一致。' : 'The program output matches the objective.') : (zh ? '输出内容、大小写、空格或换行仍与目标不同。' : 'The text, capitalization, spaces, or newlines do not yet match the objective.'),
    actual: execution.output,
    expected: describeOutputRule(outputRule, language)
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
    tests.push({ passed, name: zh ? '知识点要求' : 'Required C Technique', message: passed ? (zh ? '指定的 C 语言写法已经出现。' : 'The required C technique is present.') : (zh ? rule.message : 'Use the C construct required by this quest.') });
  }
  if (Number.isInteger(lesson.validation.maxPrintf)) {
    const count = (clean.match(/\bprintf\s*\(/g) ?? []).length;
    tests.push({ passed: count <= lesson.validation.maxPrintf, name: zh ? 'printf 次数' : 'printf Count', message: count <= lesson.validation.maxPrintf ? (zh ? `使用了 ${count} 次 printf。` : `Used printf ${count} time(s).`) : (zh ? `最多只能使用 ${lesson.validation.maxPrintf} 次 printf，目前有 ${count} 次。` : `Use at most ${lesson.validation.maxPrintf} printf call(s); found ${count}.`) });
  }
  const printfCount = (clean.match(/\bprintf\s*\(/g) ?? []).length;
  if (Number.isInteger(lesson.validation.exactPrintf)) {
    tests.push({ passed: printfCount === lesson.validation.exactPrintf, name: zh ? 'printf 次数' : 'printf Count', message: printfCount === lesson.validation.exactPrintf ? (zh ? `恰好使用了 ${printfCount} 次 printf。` : `Used exactly ${printfCount} printf call(s).`) : (zh ? `必须恰好使用 ${lesson.validation.exactPrintf} 次 printf，目前有 ${printfCount} 次。` : `Use exactly ${lesson.validation.exactPrintf} printf call(s); found ${printfCount}.`) });
  }
  if (Number.isInteger(lesson.validation.minPrintf)) {
    tests.push({ passed: printfCount >= lesson.validation.minPrintf, name: zh ? 'printf 次数' : 'printf Count', message: printfCount >= lesson.validation.minPrintf ? (zh ? `使用了 ${printfCount} 次 printf。` : `Used printf ${printfCount} time(s).`) : (zh ? `至少需要使用 ${lesson.validation.minPrintf} 次 printf，目前有 ${printfCount} 次。` : `Use at least ${lesson.validation.minPrintf} printf call(s); found ${printfCount}.`) });
  }
  if (Number.isInteger(lesson.validation.minDeclarations)) {
    const declarationPattern = /\b(?:int|char|float|double)\s+([^;]+);/g;
    let declarationCount = 0;
    for (const match of clean.matchAll(declarationPattern)) declarationCount += match[1].split(',').length;
    tests.push({ passed: declarationCount >= lesson.validation.minDeclarations, name: zh ? '变量声明数量' : 'Variable Declarations', message: declarationCount >= lesson.validation.minDeclarations ? (zh ? `检测到 ${declarationCount} 个变量声明。` : `Found ${declarationCount} variable declaration(s).`) : (zh ? `至少需要声明 ${lesson.validation.minDeclarations} 个变量，目前检测到 ${declarationCount} 个。` : `Declare at least ${lesson.validation.minDeclarations} variables; found ${declarationCount}.`) });
  }
  return { passed: tests.every(test => test.passed), execution, tests };
}
