import { defineConfig } from 'vite';

export default defineConfig({
  root: 'web',
  plugins: [{
    name: 'isolated-csharp-worker',
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        let pathname = '';
        try { pathname = decodeURIComponent((request.url ?? '').split('?')[0]).replace(/^\/+/, '/'); } catch { /* Vite rejects invalid paths. */ }
        if (pathname === '/csharp/runner.worker.js') {
          const host = request.headers.host ?? '';
          const origin = /^(?:localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/.test(host) ? `http://${host}/csharp/` : "'none'";
          response.setHeader('Content-Security-Policy', `default-src 'none'; script-src 'self' 'wasm-unsafe-eval'; connect-src ${origin}; worker-src 'none';`);
        }
        next();
      });
    }
  }],
  base: './',
  build: {
    outDir: '../data/app',
    emptyOutDir: true,
    target: 'es2022',
    sourcemap: false
  },
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Resource-Policy': 'same-origin'
    }
  }
});
