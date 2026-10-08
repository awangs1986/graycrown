import { PUBLIC_SITE } from './deployment.mjs';

async function requestJson(url, options = {}) {
  if (PUBLIC_SITE) throw new Error('公开网页版暂不提供 AI 导师；课程、编译和判题均可直接使用。');
  const response = await fetch(url, { cache: 'no-store', ...options });
  const value = await response.json().catch(() => ({}));
  if (!response.ok || !value.ok) throw new Error(value.error || `请求失败（HTTP ${response.status}）`);
  return value;
}

export function loadAiSettings() {
  return requestJson('/api/ai-settings');
}

export function saveAiSettings(settings) {
  return requestJson('/api/ai-settings', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings)
  });
}

export function testAiConnection() {
  return requestJson('/api/ai/test', { method: 'POST' });
}

export function requestAiTutor(payload) {
  return requestJson('/api/ai/tutor', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
}

export function requestCompilerExplanation(payload) {
  return requestJson('/api/ai/compiler-explain', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
}
