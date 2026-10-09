export function normalizeFrench(value) {
  return String(value??'').normalize('NFC').replace(/[’‘`]/g,"'").replace(/œ/g,'oe').replace(/Œ/g,'OE')
    .replace(/[.,!?;:«»“”\"]/g,'').replace(/\s*'\s*/g,"'").replace(/\s+/g,' ').trim().toLocaleLowerCase('fr');
}
export function gradeFrench(lesson, responses) {
  const checks=lesson.questions.map(question=>{
    const response=responses[question.id];
    const value=Array.isArray(response)?response.join(' '):String(response??'');
    // answers[0] is the model answer; further answers and optional alternates are equally accepted.
    const accepted=[...question.answers,...(question.alternates??[])];
    const passed=value.trim()!==''&&accepted.some(answer=>normalizeFrench(answer)===normalizeFrench(value));
    return {id:question.id,passed,actual:value,expected:question.answers[0],explanation:question.explanation};
  });
  const correct=checks.filter(check=>check.passed).length;
  return {passed:correct===checks.length,score:Math.round(correct/checks.length*100),correct,total:checks.length,checks};
}
// Stable per-question shuffling keeps drafts valid across reloads, without always placing the correct answer first.
export function shuffled(items, seed) {
  const result=[...items];let n=2166136261;
  for(const char of seed)n=Math.imul(n^char.charCodeAt(0),16777619)>>>0;
  for(let i=result.length-1;i>0;i--){n=(Math.imul(n,1664525)+1013904223)>>>0;const j=n%(i+1);[result[i],result[j]]=[result[j],result[i]];}
  return result;
}
