import { dotnet } from './_framework/dotnet.js';

let exports;
let initialization;
function ready() {
  return initialization ??= initialize();
}
async function initialize() {
  const runtime = await dotnet.withDiagnosticTracing(false).create();
  exports = (await runtime.getAssemblyExports(runtime.getConfig().mainAssemblyName)).CourseRunner;
  const references = await (await fetch('./references.json')).json();
  for (const file of references) {
    const response = await fetch('./_framework/' + file);
    if (!response.ok) throw new Error('无法加载 C# 编译引用：' + file);
    const bytes = new Uint8Array(await response.arrayBuffer());
    let binary = '';
    for (let offset = 0; offset < bytes.length; offset += 8192) binary += String.fromCharCode(...bytes.subarray(offset, offset + 8192));
    exports.AddReference(btoa(binary));
  }
}
self.onmessage = async event => {
  try {
    const { source, inputs } = event.data;
    await ready();
    postMessage({ type: 'phase', phase: 'compile' });
    const compiled = JSON.parse(exports.Compile(source));
    if (!compiled.ok) return postMessage({ type: 'result', compiled, executions: [] });
    const executions = [];
    for (const input of inputs) {
      postMessage({ type: 'phase', phase: 'run' });
      executions.push(JSON.parse(exports.Run(input)));
    }
    postMessage({ type: 'result', compiled, executions });
  } catch (error) {
    postMessage({ type: 'error', message: error.message || String(error), detail: error.stack });
  }
};
