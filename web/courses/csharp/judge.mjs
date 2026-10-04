const normalizeOutput = output => String(output ?? '').replaceAll('\r\n','\n');
export function gradeCode(lesson, source, result) {
  const checks = [];
  if (!result.compiled?.ok) return { passed:false, score:0, checks:[{passed:false,label:'编译',message:result.compiled?.stderr||'编译没有成功。'}] };
  // Requirements teach the requested construct; multi-input execution decides behaviour.
  const withoutComments = source.replace(/\/\*[\s\S]*?\*\//g,'').replace(/\/\/[^\n]*/g,'');
  for (const construct of lesson.required ?? []) checks.push({passed:withoutComments.includes(construct),label:'知识点',message:`使用 ${construct} 完成本题。`});
  for (const construct of lesson.requiredRaw ?? []) checks.push({passed:source.includes(construct),label:'知识点',message:`保留 ${construct}。`});
  lesson.tests.forEach((test,index)=>{
    const actual=result.executions?.[index];
    checks.push({passed:Boolean(actual?.ok)&&normalizeOutput(actual.output)===normalizeOutput(test.output),label:`测试 ${index+1}`,message:actual?.ok?'输入和输出应与任务规则一致。':actual?.stderr||'没有运行结果。',input:test.input,expected:test.output,actual:actual?.output??''});
  });
  return {passed:checks.every(check=>check.passed),score:Math.round(checks.filter(check=>check.passed).length/checks.length*100),checks};
}
