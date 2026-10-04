export class CSharpRuntime {
  constructor(onStatus = () => {}, factory = () => new Worker('/csharp/runner.worker.js', { type: 'module' })) {
    this.onStatus = onStatus;
    this.factory = factory;
    this.active = null;
  }
  run(source, inputs = ['']) {
    if (this.active) return Promise.reject(new Error('请等待上一段程序结束。'));
    if (source.length > 100000 || inputs.length > 12 || inputs.some(input => input.length > 10000)) return Promise.reject(new Error('代码或输入太长。'));
    return new Promise((resolve, reject) => {
      const worker = this.factory();
      const finish = (error, result) => {
        clearTimeout(this.active?.timer);
        worker.terminate();
        this.active = null;
        this.onStatus(error ? '运行已停止' : '准备就绪');
        if (error) reject(error); else resolve(result);
      };
      const arm = (milliseconds, phase) => {
        clearTimeout(this.active?.timer);
        this.active.timer = setTimeout(() => finish(new Error(phase === 'run' ? '运行超过 4 秒，已停止。请检查循环是否能结束。' : '编译器加载或编译超时，请重试。')), milliseconds);
      };
      this.active = { worker, finish, timer: null };
      this.onStatus('正在准备 C# 编译器…');
      arm(90000, 'load');
      worker.onmessage = ({ data }) => {
        if (data.type === 'phase') {
          this.onStatus(data.phase === 'run' ? '正在运行…' : '正在编译…');
          arm(data.phase === 'run' ? 4000 : 30000, data.phase);
        } else if (data.type === 'result') finish(null, data);
        else if (data.type === 'error') finish(new Error(data.message));
      };
      worker.onerror = event => finish(new Error(event.message || 'C# 编译器加载失败。'));
      worker.postMessage({ source, inputs });
    });
  }
  dispose() { this.active?.finish(new Error('课程已关闭。')); }
}
