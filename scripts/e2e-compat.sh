#!/bin/sh
set -eu

profile="${1:-}"
shift || true
case "$profile" in
  qb445) port=8090 ;;
  qb523) port=8091 ;;
  *)
    echo "Usage: $0 qb445|qb523" >&2
    exit 2
    ;;
esac

compose_file="docker/docker-compose.yml"
runtime_dir="docker/.runtime/$profile"
cleanup() {
  docker compose -f "$compose_file" --profile "$profile" down
}
trap cleanup EXIT INT TERM

pnpm run build
rm -rf "$runtime_dir"
mkdir -p "$runtime_dir/config" "$runtime_dir/downloads"
cp -R "docker/fixtures/$profile/config/." "$runtime_dir/config/"
docker compose -f "$compose_file" --profile "$profile" up -d --wait --build

password=adminadmin
if [ "$profile" = "qb523" ]; then
  password=$(
    docker compose -f "$compose_file" --profile "$profile" logs --no-color qb523 |
      sed -n 's/.*temporary password is provided for this session: //p' |
      tail -n 1
  )
  if [ -z "$password" ]; then
    echo "Unable to read qBittorrent 5.2.3 temporary WebUI password." >&2
    exit 1
  fi
fi

E2E_BASE_URL="http://127.0.0.1:$port" E2E_PASSWORD="$password" \
  pnpm exec playwright test "$@"
