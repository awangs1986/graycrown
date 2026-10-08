const DATABASE = 'gray-crown-learning';

async function transaction(mode, operation) {
  const database = await new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE, 1);
    request.onupgradeneeded = () => request.result.createObjectStore('progress');
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(new Error('无法打开浏览器存档，请允许本站使用浏览器存储。'));
  });
  try {
    return await new Promise((resolve, reject) => {
      const tx = database.transaction('progress', mode);
      const request = operation(tx.objectStore('progress'));
      tx.oncomplete = () => resolve(request.result);
      tx.onabort = tx.onerror = () => reject(new Error('浏览器存档失败，请检查可用空间并导出进度备份。'));
    });
  } finally {
    database.close();
  }
}

export const readBrowserLibrary = () => transaction('readonly', store => store.get('library'));
export const writeBrowserLibrary = value => transaction('readwrite', store => store.put(value, 'library'));
