const COMPILE_TIMEOUT_MS = 45_000;
const BATCH_COMPILE_TIMEOUT_MS = 240_000;
const RUN_TIMEOUT_MS = 4_000;

export function parseClangDiagnostics(stderr = '') {
  const diagnostics = [];
  const pattern = /(?:^|\n)(?:\/project\/)?main\.c:(\d+):(\d+):\s+(warning|error|fatal error):\s+([^\n]+)/g;
  for (const match of stderr.matchAll(pattern)) {
    diagnostics.push({
      line: Number(match[1]),
      column: Number(match[2]),
      level: match[3] === 'warning' ? 'warning' : 'error',
      message: translateDiagnostic(match[4].trim())
    });
  }
  return diagnostics;
}

function translateDiagnostic(message) {
  const translations = [
    [/expected ';'/i, "这里缺少分号 ';'。"],
    [/use of undeclared identifier '([^']+)'/i, '变量或函数“$1”尚未声明。'],
    [/expected expression/i, '这里需要一个有效的表达式。'],
    [/expected '\}'/i, "这里缺少右花括号 '}'。"],
    [/expected '\)'/i, "这里缺少右括号 ')'。"],
    [/missing terminating '"' character/i, '字符串缺少结束双引号。'],
    [/implicit declaration of function '([^']+)'/i, '函数“$1”未声明；请检查拼写或头文件。']
  ];
  for (const [pattern, text] of translations) if (pattern.test(message)) return message.replace(pattern, text);
  return message;
}

export class CompilerService {
  constructor(onStatus = () => {}, workerFactory = () => new Worker(new URL('./compiler.worker.mjs', import.meta.url), { type: 'module' }), replacementDelayMs = 2_500) {
    this.onStatus = onStatus;
    this.workerFactory = workerFactory;
    this.replacementDelayMs = replacementDelayMs;
    this.sequence = 0;
    this.pending = null;
    this.reserving = false;
    this.waiters = [];
    this.slots = [null, null, null];
    this.onStatus('loading', '正在预热 Clang 编译池…');
    this.slots.forEach((_, index) => this.replaceSlot(index));
  }

  replaceSlot(index) {
    const previous = this.slots[index];
    previous?.worker.terminate();
    const slot = { index, generation: (previous?.generation ?? 0) + 1, ready: false, busy: false, worker: this.workerFactory() };
    this.slots[index] = slot;
    slot.worker.onmessage = event => this.handleMessage(slot, event.data);
    slot.worker.onerror = event => this.handleWorkerFailure(slot, event.message || '编译沙箱发生错误');
    slot.worker.postMessage({ type: 'warmup' });
    return slot;
  }

  retireSlot(slot) {
    if (this.slots[slot.index] !== slot) return;
    slot.worker.terminate();
    slot.ready = false;
    slot.busy = true;
    setTimeout(() => {
      if (this.slots[slot.index] === slot) this.replaceSlot(slot.index);
    }, this.replacementDelayMs);
  }

  handleMessage(slot, message) {
    if (this.slots[slot.index] !== slot) return;
    if (message.type === 'ready') {
      slot.ready = true;
      slot.busy = false;
      this.releaseWaiter();
      return this.onStatus('ready', this.slots.every(item => item?.ready) ? 'Clang 编译池已就绪' : 'Clang WASM 已就绪');
    }
    if (message.type === 'fatal') {
      return this.handleWorkerFailure(slot, message.message || 'Clang 加载失败');
    }
    if (!this.pending || this.pending.slot !== slot || message.id !== this.pending.id) return;
    if (message.type === 'phase') {
      this.onStatus('loading', message.phase === 'running' ? '正在隔离运行…' : message.phase === 'compiling' ? 'Clang 正在编译…' : '正在准备编译器…');
      clearTimeout(this.pending.timer);
      const timeout = message.phase === 'running' ? RUN_TIMEOUT_MS : message.phase === 'batch-compiling' ? BATCH_COMPILE_TIMEOUT_MS : COMPILE_TIMEOUT_MS;
      this.pending.timer = setTimeout(() => this.timeout(message.phase), timeout);
      return;
    }
    if (message.type === 'result') {
      clearTimeout(this.pending.timer);
      const result = message.result;
      result.diagnostics = parseClangDiagnostics(result.stderr);
      const resolve = this.pending.resolve;
      this.pending = null;
      this.retireSlot(slot);
      const standbyReady = this.slots.some(item => item?.ready && !item.busy);
      this.onStatus(result.stage === 'internal' ? 'error' : standbyReady ? 'ready' : 'loading', result.stage === 'internal' ? '编译沙箱异常' : standbyReady ? '备用 Clang 已接管' : '正在补充 Clang 沙箱…');
      resolve(result);
    }
  }

  handleWorkerFailure(slot, message) {
    if (this.slots[slot.index] !== slot) return;
    if (this.pending?.slot === slot) {
      clearTimeout(this.pending.timer);
      const reject = this.pending.reject;
      this.pending = null;
      reject(new Error(message));
    }
    this.onStatus('error', '编译沙箱加载失败');
    this.replaceSlot(slot.index);
  }

  releaseWaiter() {
    const waiter = this.waiters.shift();
    if (!waiter) return;
    const slot = this.slots.find(item => item?.ready && !item.busy);
    if (!slot) { this.waiters.unshift(waiter); return; }
    clearTimeout(waiter.timer);
    slot.busy = true;
    waiter.resolve(slot);
  }

  acquireSlot() {
    const slot = this.slots.find(item => item?.ready && !item.busy);
    if (slot) { slot.busy = true; return Promise.resolve(slot); }
    return new Promise((resolve, reject) => {
      const waiter = { resolve, reject, timer: null };
      waiter.timer = setTimeout(() => {
        this.waiters = this.waiters.filter(item => item !== waiter);
        reject(new Error('编译器预热超时，请稍后重试。'));
      }, COMPILE_TIMEOUT_MS);
      this.waiters.push(waiter);
    });
  }

  timeout(phase) {
    const pending = this.pending;
    if (!pending) return;
    this.pending = null;
    this.replaceSlot(pending.slot.index);
    const stage = phase === 'running' ? 'run' : 'compile';
    pending.resolve({
      ok: false, stage, code: -1, output: '', stdout: '',
      stderr: stage === 'run' ? '程序运行超过 4 秒，已由沙箱强制停止。请检查是否存在死循环。' : '编译超过 45 秒，已强制停止。',
      diagnostics: []
    });
  }

  rejectPending(error) {
    if (!this.pending) return;
    clearTimeout(this.pending.timer);
    const reject = this.pending.reject;
    this.pending = null;
    reject(error);
  }

  async runJob(type, payload, timeout = COMPILE_TIMEOUT_MS) {
    if (this.pending || this.reserving) throw new Error('上一段代码仍在运行。');
    this.reserving = true;
    let slot;
    try { slot = await this.acquireSlot(); }
    finally { this.reserving = false; }
    const id = ++this.sequence;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => this.timeout(type === 'compile-batch' ? 'batch-compiling' : 'loading'), timeout);
      this.pending = { id, resolve, reject, timer, slot };
      slot.worker.postMessage({ type, id, ...payload });
    });
  }

  compileAndRun(source, stdin = '') {
    return this.runJob('compile-run', { source, stdin });
  }

  compileBatch(sources) {
    return this.runJob('compile-batch', { sources }, BATCH_COMPILE_TIMEOUT_MS);
  }
}
