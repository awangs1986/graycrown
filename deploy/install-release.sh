#!/bin/sh
# Run only after the dedicated HTTP ACME vhost has been installed and nginx -t passes.
# Args: artifact HTTPS URL, expected SHA-256, release name, staged final nginx config.
set -eu
url=$1
expected=$2
release=$3
configuration=$4
case "$url" in https://*) ;; *) echo 'HTTPS artifact required'; exit 1;; esac
case "$release" in ''|*[!a-zA-Z0-9_-]*) echo 'Invalid release name'; exit 1;; esac
base=/var/www/graycrown
archive="$base/$release.https.tar.gz"
destination="$base/releases/$release"
test ! -e "$archive"
test ! -e "$destination/index.html"
curl --fail --location --retry 3 --connect-timeout 20 --max-time 900 --output "$archive" "$url"
printf '%s  %s\n' "$expected" "$archive" | sha256sum -c -
install -d -m 755 "$destination"
tar -xzf "$archive" --no-same-owner -C "$destination"
chmod -R u=rwX,go=rX "$destination"
test -s "$destination/index.html"
test "$(stat -c %s "$destination/compiler/clang-0.160000.1.webc")" -gt 1000000
# First deployment only: never overwrite an existing release selector.
ln -s "$destination" "$base/current"
certbot certonly --webroot -w /var/www/certbot -d learn.awangsawangs.xyz \
  --cert-name learn.awangsawangs.xyz --non-interactive --agree-tos \
  --register-unsafely-without-email --no-eff-email \
  --deploy-hook 'nginx -t && systemctl reload nginx'
backup=$(mktemp "$base/learn-nginx-before-final.XXXXXX")
cp -p /etc/nginx/conf.d/graycrown-learn.conf "$backup"
install -m 644 "$configuration" /etc/nginx/conf.d/graycrown-learn.conf
if ! nginx -t; then
  cp -p "$backup" /etc/nginx/conf.d/graycrown-learn.conf
  echo 'New config rejected; restored bootstrap configuration.'
  exit 1
fi
systemctl reload nginx
sha256sum -c "$base/existing-nginx-before.sha256"
curl --fail --silent --show-error --retry 5 --retry-all-errors --retry-delay 1 --head --resolve learn.awangsawangs.xyz:443:127.0.0.1 https://learn.awangsawangs.xyz/
curl --fail --silent --show-error --retry 5 --retry-all-errors --retry-delay 1 --head --resolve 1lap.cc:443:127.0.0.1 https://1lap.cc/
echo 'DEPLOYMENT COMPLETE'
