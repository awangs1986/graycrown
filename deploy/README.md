# Public learning site

Public builds use IndexedDB in each visitor's browser. They do not use the desktop
launcher's shared saves or AI settings. AI controls are hidden and the AI transport
rejects requests before any fetch. Learners should export progress before clearing
site data or switching devices.

## Build

Install Node.js, .NET 9 SDK + wasm-tools, and retrieve the actual Clang Git LFS asset.

```sh
npm ci
git lfs pull
npm run build:public
```

The output is `dist/public-site`. The public mode flag is in `web/.env.public`;
ordinary `build:web` retains the desktop behavior. The build also copies `LICENSE` and
`THIRD_PARTY_NOTICES.txt` into the site. Do not upload `data/save`, SSH credentials,
source attachments, or the desktop launcher.

## Hosting requirements

- Serve a dedicated static root on `learn.awangsawangs.xyz`, with HTTPS.
- Preserve existing sites and use a new versioned release directory.
- Set COOP `same-origin`, COEP `require-corp`, and CORP `same-origin`.
- Send WebAssembly with `application/wasm`; allow module JavaScript MIME types.
- Deny `/api/` and dotfiles. Never proxy to the desktop launcher.
- The C# worker needs its restrictive CSP, including a connect-src limited to this
  site's `/csharp/` directory. The template uses normalized `$uri` to cover aliases.
- Verify the new Nginx config before a graceful reload. Existing site configs are
  not edited, and no application service needs to be stopped.

The actual certificate paths and available Nginx includes must be inspected on the
server before installing configuration. Templates are not an instruction to replace
the global Nginx configuration.

## First deployment layout

- New files only under `/var/www/graycrown/`, with releases under `releases/`.
- `/var/www/graycrown/current` points to the selected release.
- `/etc/nginx/conf.d/graycrown-learn.conf` is this site's dedicated config.
- Existing site configuration checksums are recorded in
  `/var/www/graycrown/existing-nginx-before.sha256`.
- `learn-bootstrap.nginx.conf` enables only the HTTP ACME challenge route first.
- `learn.nginx.conf` is the final HTTPS site.
- `install-release.sh` downloads a specified HTTPS artifact, checks the expected
  SHA-256, extracts into its new release directory, obtains the domain certificate,
  backs up this site's bootstrap config, validates and gracefully reloads Nginx.
  It is a first-install helper, not an automatic upgrade or cleanup tool.

For later updates, retain the previous release and config before changing the
`current` symlink. Rollback should restore that symlink/config, pass `nginx -t`,
and reload Nginx. Never delete or replace other sites or the global Nginx config.
