mod ai;

use percent_encoding::percent_decode_str;
use serde::{Deserialize, Serialize};
use serde_json::{Value, json};
use std::env;
use std::fs;
use std::io::{self, Read};
use std::net::{IpAddr, Ipv4Addr, SocketAddr, TcpListener};
use std::path::{Component, Path, PathBuf};
use std::thread;
use std::time::Duration;
use tiny_http::{Header, Method, Request, Response, Server, StatusCode};

const APP_VERSION: &str = env!("CARGO_PKG_VERSION");
const MAX_SAVE_BYTES: u64 = 10 * 1024 * 1024;

#[derive(Debug)]
struct Config {
    data_dir: PathBuf,
    port: u16,
    open_browser: bool,
}

#[derive(Debug, Serialize, Deserialize)]
struct SaveEnvelope {
    version: u32,
    #[serde(flatten)]
    rest: serde_json::Map<String, Value>,
}

fn main() -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    let config = parse_config()?;
    let web_root = config.data_dir.join("app");
    let save_path = config.data_dir.join("save").join("progress.json");
    let ai_settings_path = config.data_dir.join("save").join("ai-settings.json");

    if !web_root.join("index.html").is_file() {
        return Err(format!("找不到网页资源：{}", web_root.display()).into());
    }

    let listener = TcpListener::bind(SocketAddr::new(
        IpAddr::V4(Ipv4Addr::LOCALHOST),
        config.port,
    ))?;
    let address = listener.local_addr()?;
    let server = Server::from_listener(listener, None)?;
    let url = format!("http://127.0.0.1:{}/", address.port());

    println!("灰烬王冠第二版已启动：{url}");
    println!("存档文件：{}", save_path.display());
    println!("关闭此窗口即可停止程序。\n");

    if config.open_browser {
        let browser_url = url.clone();
        thread::spawn(move || {
            thread::sleep(Duration::from_millis(350));
            if let Err(error) = webbrowser::open(&browser_url) {
                eprintln!("无法自动打开浏览器：{error}");
            }
        });
    }

    for request in server.incoming_requests() {
        if let Err(error) = handle_request(
            request,
            &web_root,
            &save_path,
            &ai_settings_path,
            address.port(),
        ) {
            eprintln!("请求处理失败：{error}");
        }
    }
    Ok(())
}

fn parse_config() -> Result<Config, Box<dyn std::error::Error + Send + Sync>> {
    let executable = env::current_exe()?;
    let executable_dir = executable.parent().unwrap_or_else(|| Path::new("."));
    let mut data_dir = env::var_os("ASH_CROWN_DATA_DIR")
        .map(PathBuf::from)
        .unwrap_or_else(|| executable_dir.join("data"));
    let mut port = 0_u16;
    let mut open_browser = true;
    let mut arguments = env::args().skip(1);

    while let Some(argument) = arguments.next() {
        match argument.as_str() {
            "--data-dir" => {
                let value = arguments.next().ok_or("--data-dir 缺少路径")?;
                data_dir = PathBuf::from(value);
            }
            "--port" => {
                let value = arguments.next().ok_or("--port 缺少端口")?;
                port = value.parse()?;
            }
            "--no-open" => open_browser = false,
            _ => return Err(format!("未知参数：{argument}").into()),
        }
    }

    Ok(Config {
        data_dir,
        port,
        open_browser,
    })
}

fn handle_request(
    mut request: Request,
    web_root: &Path,
    save_path: &Path,
    ai_settings_path: &Path,
    port: u16,
) -> io::Result<()> {
    let path = request.url().split('?').next().unwrap_or("/").to_owned();
    if path == "/api/health" && request.method() == &Method::Get {
        return respond_json(
            request,
            StatusCode(200),
            &json!({"ok": true, "version": APP_VERSION}),
        );
    }
    if path == "/api/save" && request.method() == &Method::Get {
        return read_save(request, save_path);
    }
    if path == "/api/save" && request.method() == &Method::Put {
        if !origin_is_local(&request, port) {
            return respond_json(
                request,
                StatusCode(403),
                &json!({"ok": false, "error": "请求来源不受信任"}),
            );
        }
        return write_save(request, save_path);
    }
    if path == "/api/ai-settings" && request.method() == &Method::Get {
        let (status, value) = ai::read_public_settings(ai_settings_path);
        return respond_json(request, status, &value);
    }
    if path == "/api/ai-settings" && request.method() == &Method::Put {
        if !origin_is_local(&request, port) {
            return respond_json(
                request,
                StatusCode(403),
                &json!({"ok": false, "error": "请求来源不受信任"}),
            );
        }
        let (status, value) = ai::write_settings(&mut request, ai_settings_path);
        return respond_json(request, status, &value);
    }
    if path == "/api/ai/test" && request.method() == &Method::Post {
        if !origin_is_local(&request, port) {
            return respond_json(
                request,
                StatusCode(403),
                &json!({"ok": false, "error": "请求来源不受信任"}),
            );
        }
        let (status, value) = ai::test_connection(ai_settings_path);
        return respond_json(request, status, &value);
    }
    if path == "/api/ai/tutor" && request.method() == &Method::Post {
        if !origin_is_local(&request, port) {
            return respond_json(
                request,
                StatusCode(403),
                &json!({"ok": false, "error": "请求来源不受信任"}),
            );
        }
        let (status, value) = ai::tutor(&mut request, ai_settings_path);
        return respond_json(request, status, &value);
    }
    if path == "/api/ai/compiler-explain" && request.method() == &Method::Post {
        if !origin_is_local(&request, port) {
            return respond_json(
                request,
                StatusCode(403),
                &json!({"ok": false, "error": "请求来源不受信任"}),
            );
        }
        let (status, value) = ai::explain_compiler(&mut request, ai_settings_path);
        return respond_json(request, status, &value);
    }
    if request.method() != &Method::Get && request.method() != &Method::Head {
        return respond_text(request, StatusCode(405), "Method Not Allowed", "text/plain");
    }
    serve_static(request, web_root, &path)
}

fn origin_is_local(request: &Request, port: u16) -> bool {
    let expected = format!("http://127.0.0.1:{port}");
    request
        .headers()
        .iter()
        .find(|header| header.field.equiv("Origin"))
        .map(|header| header.value.as_str() == expected)
        .unwrap_or(true)
}

fn read_save(request: Request, save_path: &Path) -> io::Result<()> {
    if !save_path.is_file() {
        return respond_json(
            request,
            StatusCode(200),
            &json!({"version": 2, "started": false}),
        );
    }
    let bytes = fs::read(save_path)?;
    let value: Value = serde_json::from_slice(&bytes).unwrap_or_else(|_| {
        json!({"version": 2, "started": false, "recoveryWarning": "本地存档损坏，已返回空白进度"})
    });
    respond_json(request, StatusCode(200), &value)
}

fn write_save(mut request: Request, save_path: &Path) -> io::Result<()> {
    let mut bytes = Vec::new();
    request
        .as_reader()
        .take(MAX_SAVE_BYTES + 1)
        .read_to_end(&mut bytes)?;
    if bytes.len() as u64 > MAX_SAVE_BYTES {
        return respond_json(
            request,
            StatusCode(413),
            &json!({"ok": false, "error": "存档超过10MB限制"}),
        );
    }
    let envelope: SaveEnvelope = match serde_json::from_slice(&bytes) {
        Ok(value) => value,
        Err(error) => {
            return respond_json(
                request,
                StatusCode(400),
                &json!({"ok": false, "error": format!("JSON格式错误：{error}")}),
            );
        }
    };
    if envelope.version != 2 {
        return respond_json(
            request,
            StatusCode(400),
            &json!({"ok": false, "error": "只接受version=2的存档"}),
        );
    }

    if let Some(parent) = save_path.parent() {
        fs::create_dir_all(parent)?;
    }
    let formatted = serde_json::to_vec_pretty(&envelope)?;
    let temporary = save_path.with_extension("json.tmp");
    let backup = save_path.with_extension("json.bak");
    fs::write(&temporary, formatted)?;
    if save_path.exists() {
        let _ = fs::copy(save_path, &backup);
        fs::remove_file(save_path)?;
    }
    fs::rename(&temporary, save_path)?;
    respond_json(request, StatusCode(200), &json!({"ok": true}))
}

fn serve_static(request: Request, web_root: &Path, request_path: &str) -> io::Result<()> {
    let decoded = percent_decode_str(request_path)
        .decode_utf8()
        .map_err(|_| io::Error::new(io::ErrorKind::InvalidInput, "invalid URL encoding"))?;
    let relative = if decoded == "/" {
        PathBuf::from("index.html")
    } else {
        PathBuf::from(decoded.trim_start_matches('/'))
    };
    if relative
        .components()
        .any(|component| !matches!(component, Component::Normal(_)))
    {
        return respond_text(request, StatusCode(400), "Invalid path", "text/plain");
    }
    let file_path = web_root.join(relative);
    if !file_path.is_file() {
        return respond_text(request, StatusCode(404), "Not Found", "text/plain");
    }
    let mime = mime_guess::from_path(&file_path)
        .first_or_octet_stream()
        .essence_str()
        .to_string();
    let bytes = fs::read(file_path)?;
    let mut response = Response::from_data(bytes).with_status_code(StatusCode(200));
    response.add_header(header("Content-Type", &mime));
    add_security_headers(&mut response);
    request.respond(response)
}

fn respond_json(request: Request, status: StatusCode, value: &Value) -> io::Result<()> {
    let body = serde_json::to_vec_pretty(value)?;
    let mut response = Response::from_data(body).with_status_code(status);
    response.add_header(header("Content-Type", "application/json; charset=utf-8"));
    response.add_header(header("Cache-Control", "no-store"));
    add_security_headers(&mut response);
    request.respond(response)
}

fn respond_text(request: Request, status: StatusCode, body: &str, mime: &str) -> io::Result<()> {
    let mut response = Response::from_string(body).with_status_code(status);
    response.add_header(header("Content-Type", mime));
    add_security_headers(&mut response);
    request.respond(response)
}

fn add_security_headers<R: Read>(response: &mut Response<R>) {
    response.add_header(header("Cross-Origin-Opener-Policy", "same-origin"));
    response.add_header(header("Cross-Origin-Embedder-Policy", "require-corp"));
    response.add_header(header("Cross-Origin-Resource-Policy", "same-origin"));
    response.add_header(header("X-Content-Type-Options", "nosniff"));
    response.add_header(header(
        "Content-Security-Policy",
        "default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; worker-src 'self' blob:;",
    ));
}

fn header(name: &str, value: &str) -> Header {
    Header::from_bytes(name.as_bytes(), value.as_bytes()).expect("valid static header")
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn save_envelope_requires_version() {
        let parsed = serde_json::from_str::<SaveEnvelope>(r#"{"version":2,"gold":10}"#).unwrap();
        assert_eq!(parsed.version, 2);
        assert_eq!(parsed.rest.get("gold"), Some(&json!(10)));
    }

    #[test]
    fn decoded_paths_reject_parent_components() {
        let decoded = percent_decode_str("../secret").decode_utf8().unwrap();
        let path = PathBuf::from(decoded.as_ref());
        assert!(
            path.components()
                .any(|part| !matches!(part, Component::Normal(_)))
        );
    }
}
