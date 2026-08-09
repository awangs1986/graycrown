import { createServer } from 'node:http';

const port = Number(process.argv[2] ?? 42627);
const responseMode = process.argv[3] ?? 'content';
const server = createServer((request, response) => {
  if (request.method !== 'POST' || request.url !== '/v1/chat/completions') {
    response.writeHead(404).end();
    return;
  }
  let body = '';
  request.setEncoding('utf8');
  request.on('data', chunk => { body += chunk; });
  request.on('end', () => {
    const payload = JSON.parse(body || '{}');
    const isTest = JSON.stringify(payload.messages ?? []).includes('请回复 OK');
    const content = isTest ? 'OK' : '先检查 printf 语句末尾的分号，再重新提交。';
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(responseMode === 'reasoning' && isTest
      ? { choices: [{ finish_reason: 'length', message: { role: 'assistant', content: null, reasoning_content: content } }] }
      : { choices: [{ message: { role: 'assistant', content } }] }));
  });
});

server.listen(port, '127.0.0.1');
