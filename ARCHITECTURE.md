# 灰烬王冠第二版架构

第二版是一个 Windows x64 便携应用：原生 Rust 启动器在 `127.0.0.1` 随机端口提供静态网页和 JSON 存档 API，然后打开用户的默认浏览器。发布包不需要 Python、Node.js、Rust 或系统 C 编译器。

## 关键边界

- `灰烬王冠.exe`：本机静态服务、存档原子写入、浏览器启动。
- `data/app`：生产网页、CodeMirror 编辑器、Wasmer JS runtime、离线 Clang WebC。
- `data/save/progress.json`：版本化的可读 JSON 存档；覆盖前产生 `.bak`。
- `compiler.worker`：唯一可执行学员代码的区域。只挂载内存中的 `/project`，没有宿主文件映射，也没有网络网关。

编译流程：`main.c` → Clang/WASIX → `program.wasm` → Wasmer/WASIX → stdout/stderr。编译最多 45 秒，运行最多 4 秒；每次编译使用一次性 worker，完成或超时后直接终止并建立新沙箱。

## 构建

```powershell
npm install
npm test
npm run package:windows
```

Node.js 与 Rust 仅用于开发和打包，不会进入发布目录。
