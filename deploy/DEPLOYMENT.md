# Deployment record — 2026-10-04

- Public URL: https://learn.awangsawangs.xyz/
- HTTP redirects to HTTPS (301).
- Release: `/var/www/graycrown/releases/20261004-public-1`.
- Selector: `/var/www/graycrown/current`.
- Site configuration: `/etc/nginx/conf.d/graycrown-learn.conf`.
- Artifact SHA-256: `3ba170c276d886a03acb5961db49c14702bdb658bc7ca14f5d8998a6c7abf082`.
- Let's Encrypt certificate expires 2027-01-02; Certbot renewal with Nginx reload hook configured.

## Observed deployment health

- Downloaded artifact SHA-256 matches before extraction.
- Public HTTPS landing page and C# worker return 200 with COOP/COEP/CORP headers.
- C# worker has its dedicated restrictive CSP.
- Direct origin HTTPS certificate validation succeeds for the learning hostname.
- Existing personal website returns 200 publicly and at the origin.
- Existing Nginx configuration hashes remain unchanged; `nginx -t` succeeds;
  Nginx and the existing website service remain active.
- The immediate request following the asynchronous Nginx reload briefly hit the
  previous worker's default certificate. A subsequent direct origin request and
  certificate inspection succeeded. The installer now retries these health checks.
- No connected browser was available in this session; no new browser UI test was run.

## Preservation and cleanup

Existing site content and configuration were not removed or replaced. An existing
missing identity-site certificate was reissued at its configured path to restore
Nginx configuration validity before adding the new site. Its application backend
was not changed.

The temporary HTTPS artifact transfer tunnel and local artifact server were stopped
after the checksum-verified download. Incomplete SSH transfer files remain within
the new `/var/www/graycrown/` deployment directory; no pre-existing content was deleted.

The public build uses browser-local IndexedDB progress and disables AI, as selected
by the user. The desktop build retains its original save and AI behavior.

## RPG adventure update — 2026-10-04

- Active release: `/var/www/graycrown/releases/20261004-adventure-2048`.
- Previous release retained: `/var/www/graycrown/releases/20261004-public-1`.
- Delta artifact SHA-256: `821aed8be576030b79190530892774377edf6b0872850e6a09f0d85df7f9aa75`.
- Copied previous release to a new directory, overlaid the new index and hashed
  JavaScript/CSS assets, then atomically switched the `current` symlink.
- Compiler binaries, audio, Nginx configuration and existing personal-site
  files were retained. No service restart or reload was needed.
- Public and desktop builds succeeded. The public index serves the new
  `index-D7rj-eut.js` entry. No browser interaction tests were run.
- Temporary artifact-only HTTP server and transfer tunnel stopped after upload.

## French course art update — 2026-10-04 (superseded)

- Earlier raster artwork delivered in the `20261004-pets-2110` release; replaced on 2026-10-10 by the shared SVG comic kit (no raster art).
  Artifact SHA-256: `c18f278dc2d7f9f974360b7d57a419651f7e57263553e9a5a30f8f240fc3ef53`.
- Final release: `/var/www/graycrown/releases/20261004-pets-2113`, including
  themed collection dialogs. Frontend delta SHA-256:
  `b0d0241359d5857efdfe581a7c463501cc85bbaea94c10df7b8ac2800bb7b89d`.
- Releases use copied predecessors and an atomic symlink switch. Previous
  releases, personal-site content, Nginx configuration, compilers and audio retained.
- Both public and desktop builds succeeded. No browser gameplay tests were run.
- That raster artwork and its provenance file were removed from the repository on 2026-10-10.

## Import-button alignment — 2026-10-04

- Release: `/var/www/graycrown/releases/20261004-buttons-2119`.
- Delta SHA-256: `79e11bdaf4cf74bbcaab67948591c78b5f4e18d515ce99f6572d7a9a219d4605`.
- Shared file-picker labels and adjacent buttons use matching centered layout,
  line height and toolbar alignment across the library and all course packs.
- Public/desktop builds succeeded. Previous release retained; no service reload.
