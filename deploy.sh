#!/usr/bin/env bash
set -euo pipefail

REPO_URL="${REPO_URL:-https://github.com/NaraDev0/sakaii-portfolio.git}"
REPO_DIR="${REPO_DIR:-sakaii-portfolio}"
ADMIN_EMAIL_DEFAULT="${ADMIN_EMAIL_DEFAULT:-mikael@sakaii.org}"
SITE_URL_DEFAULT="${SITE_URL_DEFAULT:-https://sakaii.org}"
DIRECTUS_PUBLIC_URL_DEFAULT="${DIRECTUS_PUBLIC_URL_DEFAULT:-https://admin.sakaii.org}"
DIRECTUS_HEALTH_URL="${DIRECTUS_HEALTH_URL:-http://localhost:8055/server/health}"

BLUE="\033[0;34m"
GREEN="\033[0;32m"
RED="\033[0;31m"
YELLOW="\033[1;33m"
NC="\033[0m"

info() { echo -e "${BLUE}==>${NC} $*"; }
success() { echo -e "${GREEN}[OK] $*${NC}"; }
warn() { echo -e "${YELLOW}[WARN] $*${NC}"; }
fail() { echo -e "${RED}[ERROR] $*${NC}" >&2; exit 1; }

run_as_root() {
  if [ "$(id -u)" -ne 0 ]; then
    if command -v sudo >/dev/null 2>&1; then
      sudo "$@"
    else
      fail "Ce script doit etre lance en root ou avec sudo disponible."
    fi
  else
    "$@"
  fi
}

run_as_root_env() {
  local env_name="$1"
  local env_value="$2"
  shift 2

  if [ "$(id -u)" -ne 0 ]; then
    if command -v sudo >/dev/null 2>&1; then
      sudo env "${env_name}=${env_value}" "$@"
    else
      fail "Ce script doit etre lance en root ou avec sudo disponible."
    fi
  else
    env "${env_name}=${env_value}" "$@"
  fi
}

require_supported_os() {
  [ -r /etc/os-release ] || fail "Impossible de detecter l'OS."
  . /etc/os-release

  case "${ID}:${VERSION_ID}" in
    debian:12|ubuntu:24.04)
      success "OS supporte : ${PRETTY_NAME}"
      ;;
    *)
      warn "OS detecte : ${PRETTY_NAME:-inconnu}. Le script est teste pour Debian 12 et Ubuntu 24.04."
      read -r -p "Continuer quand meme ? [y/N] " answer
      case "${answer:-N}" in
        y|Y|yes|YES) ;;
        *) fail "Deploiement annule." ;;
      esac
      ;;
  esac
}

print_specs() {
  info "Specifications systeme"
  echo "  CPU      : $(nproc) vCPU"
  echo "  RAM      : $(free -h | awk '/^Mem:/ {print $2}')"
  echo "  Stockage : $(df -h / | awk 'NR==2 {print $4 " libres sur " $2}')"
  echo ""
}

install_dependencies() {
  info "Mise a jour des paquets"
  run_as_root apt-get update
  run_as_root_env DEBIAN_FRONTEND noninteractive apt-get upgrade -y

  info "Installation des dependances de base"
  run_as_root_env DEBIAN_FRONTEND noninteractive apt-get install -y curl git ca-certificates gnupg lsb-release openssl

  if command -v docker >/dev/null 2>&1; then
    success "Docker est deja installe : $(run_as_root docker --version)"
  else
    info "Installation de Docker via get.docker.com"
    curl -fsSL https://get.docker.com | run_as_root sh
    success "Docker installe : $(run_as_root docker --version)"
  fi

  if run_as_root docker compose version >/dev/null 2>&1; then
    success "Docker Compose plugin disponible : $(run_as_root docker compose version)"
  else
    info "Installation du plugin Docker Compose"
    run_as_root_env DEBIAN_FRONTEND noninteractive apt-get install -y docker-compose-plugin
    run_as_root docker compose version >/dev/null 2>&1 || fail "Docker Compose plugin introuvable apres installation."
    success "Docker Compose plugin installe : $(run_as_root docker compose version)"
  fi

  if command -v node >/dev/null 2>&1 && node -v | grep -Eq '^v20\.'; then
    success "Node.js 20 est deja installe : $(node --version)"
  else
    info "Installation de Node.js 20 LTS via NodeSource"
    curl -fsSL https://deb.nodesource.com/setup_20.x | run_as_root bash -
    run_as_root_env DEBIAN_FRONTEND noninteractive apt-get install -y nodejs
    node -v | grep -Eq '^v20\.' || fail "Node.js 20 attendu, version installee : $(node -v)"
    success "Node.js installe : $(node --version)"
  fi
}

clone_or_update_repo() {
  local target_dir="$PWD/$REPO_DIR"

  if [ -f "./docker-compose.yml" ] && [ -f "./seed.mjs" ]; then
    info "Depot deja present dans le dossier courant : $PWD"
    return
  fi

  if [ -d "$target_dir/.git" ]; then
    info "Depot existant detecte, mise a jour"
    git -C "$target_dir" pull origin main
  elif [ -d "$target_dir" ]; then
    fail "Le dossier $target_dir existe mais n'est pas un depot Git."
  else
    info "Clonage du depot"
    git clone "$REPO_URL" "$target_dir"
  fi

  cd "$target_dir"
}

configure_env() {
  if [ -f ".env" ]; then
    success ".env existe deja, il ne sera pas ecrase."
    return
  fi

  [ -f ".env.example" ] || fail ".env.example introuvable."
  cp .env.example .env

  local key secret admin_email admin_password generated_password site_url directus_public_url
  key="$(openssl rand -hex 32)"
  secret="$(openssl rand -hex 32)"

  read -r -p "Email admin Directus [$ADMIN_EMAIL_DEFAULT] : " admin_email
  admin_email="${admin_email:-$ADMIN_EMAIL_DEFAULT}"

  read -r -p "URL publique du site [$SITE_URL_DEFAULT] : " site_url
  site_url="${site_url:-$SITE_URL_DEFAULT}"

  read -r -p "URL publique de Directus [$DIRECTUS_PUBLIC_URL_DEFAULT] : " directus_public_url
  directus_public_url="${directus_public_url:-$DIRECTUS_PUBLIC_URL_DEFAULT}"

  generated_password="$(openssl rand -base64 18 | tr -d '=+/[:space:]' | cut -c1-20)"
  read -r -s -p "Mot de passe admin Directus [generer automatiquement] : " admin_password
  echo ""
  admin_password="${admin_password:-$generated_password}"

  sed -i "s|^DIRECTUS_KEY=.*|DIRECTUS_KEY=$key|" .env
  sed -i "s|^DIRECTUS_SECRET=.*|DIRECTUS_SECRET=$secret|" .env
  sed -i "s|^ADMIN_EMAIL=.*|ADMIN_EMAIL=$admin_email|" .env
  sed -i "s|^ADMIN_PASSWORD=.*|ADMIN_PASSWORD=$admin_password|" .env
  sed -i "s|^SITE_URL=.*|SITE_URL=$site_url|" .env
  sed -i "s|^DIRECTUS_PUBLIC_URL=.*|DIRECTUS_PUBLIC_URL=$directus_public_url|" .env
  sed -i "s|^PUBLIC_DIRECTUS_URL=.*|PUBLIC_DIRECTUS_URL=$directus_public_url|" .env

  success ".env cree avec des secrets uniques."
  echo ""
  echo "  Email admin      : $admin_email"
  echo "  Mot de passe     : $admin_password"
  echo "  URL site         : $site_url"
  echo "  URL Directus     : $directus_public_url"
  echo ""
  warn "Notez ces identifiants maintenant."
}

create_runtime_dirs() {
  info "Creation des dossiers runtime"
  mkdir -p directus/database directus/uploads directus/extensions
  touch directus/database/.gitkeep directus/uploads/.gitkeep directus/extensions/.gitkeep
}

start_stack() {
  info "Build et lancement Docker Compose"
  run_as_root docker compose up -d --build
}

wait_for_directus() {
  info "Attente de Directus (${DIRECTUS_HEALTH_URL})"
  local elapsed=0
  local timeout=120

  until curl -fsS "$DIRECTUS_HEALTH_URL" >/dev/null 2>&1; do
    if [ "$elapsed" -ge "$timeout" ]; then
      run_as_root docker compose logs --tail=120 directus || true
      fail "Directus n'est pas healthy apres ${timeout}s."
    fi
    sleep 5
    elapsed=$((elapsed + 5))
    echo "  ... ${elapsed}s"
  done

  success "Directus est healthy."
}

run_seed() {
  info "Lancement du seed Directus"
  DIRECTUS_URL="http://localhost:8055" node seed.mjs
  success "Seed termine."
}

final_summary() {
  local admin_email admin_password site_url directus_public_url
  admin_email="$(grep -E '^ADMIN_EMAIL=' .env | cut -d= -f2-)"
  admin_password="$(grep -E '^ADMIN_PASSWORD=' .env | cut -d= -f2-)"
  site_url="$(grep -E '^SITE_URL=' .env | cut -d= -f2-)"
  directus_public_url="$(grep -E '^DIRECTUS_PUBLIC_URL=' .env | cut -d= -f2-)"

  echo ""
  echo "============================================"
  echo "  Deploiement termine avec succes"
  echo "============================================"
  echo ""
  echo "  Site local      : http://localhost:4321"
  echo "  Admin local     : http://localhost:8055"
  echo ""
  echo "  URLs publiques :"
  echo "  Site            : ${site_url:-non configure}"
  echo "  Admin           : ${directus_public_url:-non configure}"
  echo ""
  echo "  Email admin     : $admin_email"
  echo "  Mot de passe    : $admin_password"
  echo ""
  echo "  Commandes utiles :"
  echo "  - Voir les logs    : docker compose logs -f"
  echo "  - Redemarrer       : docker compose restart"
  echo "  - Rebuild frontend : docker compose up -d --build frontend"
  echo "  - Relancer le seed : DIRECTUS_URL=http://localhost:8055 node seed.mjs"
  echo ""
}

echo "============================================"
echo "  Deploiement Sakaii Portfolio"
echo "  sakaii.org - Mikael Bouchet"
echo "============================================"
echo ""

require_supported_os
print_specs
install_dependencies
clone_or_update_repo
configure_env
create_runtime_dirs
start_stack
wait_for_directus
run_seed
final_summary
