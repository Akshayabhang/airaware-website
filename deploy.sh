#!/bin/bash
# =============================================================================
# AirWave — Hostinger SSH Deployment Script
# Run this on the Hostinger server via SSH
# =============================================================================
# Usage:
#   1. SSH into your Hostinger server
#   2. Run: bash <(curl -s https://raw.githubusercontent.com/Akshayabhang/airaware-website/main/deploy.sh)
#   OR paste this script directly
# =============================================================================

set -e  # Exit on any error

echo "🚀 Starting AirWave deployment on Hostinger..."

# --- CONFIG ---
REPO_URL="https://github.com/Akshayabhang/airaware-website.git"
APP_DIR="$HOME/airwave"
PUBLIC_DIR="$HOME/public_html"
PORT=3001  # Node.js will run on this port

# --- Step 1: Install Node.js if not available ---
echo ""
echo "=== Step 1: Checking Node.js ==="
if ! command -v node &> /dev/null; then
  echo "Installing Node.js 20 via NVM..."
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
  source ~/.bashrc 2>/dev/null || source ~/.bash_profile 2>/dev/null || source ~/.profile 2>/dev/null
  nvm install 20
  nvm use 20
  nvm alias default 20
else
  echo "✅ Node.js found: $(node --version)"
fi

# --- Step 2: Install PM2 ---
echo ""
echo "=== Step 2: Setting up PM2 ==="
if ! command -v pm2 &> /dev/null; then
  npm install -g pm2
  echo "✅ PM2 installed"
else
  echo "✅ PM2 already installed: $(pm2 --version)"
fi

# --- Step 3: Clone/Update repo ---
echo ""
echo "=== Step 3: Getting latest code ==="
if [ -d "$APP_DIR" ]; then
  echo "Updating existing repo..."
  cd "$APP_DIR"
  git pull origin main
else
  echo "Cloning repo..."
  git clone "$REPO_URL" "$APP_DIR"
  cd "$APP_DIR"
fi

# --- Step 4: Create .env file ---
echo ""
echo "=== Step 4: Creating .env ==="
cat > "$APP_DIR/.env" << 'EOF'
DATABASE_URL=file:./prisma/dev.db
TURSO_DATABASE_URL=libsql://airaware-db-akshayabhang.turso.io
TURSO_AUTH_TOKEN=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODEyOTA3MDgsImlkIjoiMDE5ZWJkMzItZjcwMS03NmEyLWIyMmYtYzBkM2FiZjIzZTE4IiwicmlkIjoiNmZjNmY3NmItZGE0ZS00NjlmLWJiYzUtYzkwNGNhMjQwNjQ1In0.2v6fGfR3RA7f0Y4fW0apxpxXTOQ9ZBwB3hxvro4hMhQrqUDaMBJEMFydKPl7Th816KwC-bsjqQzWoxwggRaCAg
WAQI_API_TOKEN=1fc4ae82f08a552ec357ae466167387ac0f625ba
NEXT_PUBLIC_WINDY_API_KEY=XyKxx8NPN5bpDXi0rzjaNJO2D4wNgFf3
INDIAN_WEATHER_API_KEY=sk-live-XPEhdPccNUFNppHMrpv7UltCbjq2MXV9CHnxeErP
NEXT_PUBLIC_OWM_API_KEY=d33d0ca895d676b2b6d49f221d938c7f
PORT=3001
EOF
echo "✅ .env created"

# --- Step 5: Install dependencies ---
echo ""
echo "=== Step 5: Installing dependencies ==="
cd "$APP_DIR"
npm ci

# --- Step 6: Generate Prisma client ---
echo ""
echo "=== Step 6: Generating Prisma client ==="
npx prisma generate

# --- Step 7: Build Next.js app ---
echo ""
echo "=== Step 7: Building Next.js app ==="
npm run build
echo "✅ Build successful!"

# --- Step 8: Start/Restart with PM2 ---
echo ""
echo "=== Step 8: Starting app with PM2 ==="
pm2 delete airwave 2>/dev/null || true
pm2 start npm --name "airwave" -- start
pm2 save
pm2 startup 2>/dev/null || true

echo "✅ App running on port $PORT"
pm2 status

# --- Step 9: Set up .htaccess proxy ---
echo ""
echo "=== Step 9: Configuring web proxy ==="
cat > "$PUBLIC_DIR/.htaccess" << EOF
Options -MultiViews
RewriteEngine On

# Proxy all requests to Node.js app on port $PORT
RewriteRule ^(.*)$ http://127.0.0.1:$PORT/\$1 [P,L]

# Required for ProxyPass
ProxyPass / http://127.0.0.1:$PORT/
ProxyPassReverse / http://127.0.0.1:$PORT/
EOF

echo "✅ .htaccess configured"
echo ""
echo "🎉 AirWave deployment complete!"
echo "   App running at: http://127.0.0.1:$PORT"
echo "   Website: https://airaware.website"
echo ""
echo "   To check logs: pm2 logs airwave"
echo "   To restart:    pm2 restart airwave"
