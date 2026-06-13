#!/bin/bash
set -euo pipefail

PROJECT_ID="${GAE_PROJECT_ID:-gujratitailors}"
APP_YAML="app.yaml"
STAGING_DIR="gujrati-tailors-ui"
DIST_DIR="dist/gujrati-tailors-ui"

echo "📦 Building production bundle..."
npm run build:prod

echo ""
echo "📁 Staging static files for app.yaml (${STAGING_DIR}/)..."
rm -rf "${STAGING_DIR}"
cp -R "${DIST_DIR}" "${STAGING_DIR}"

if [[ "${1:-}" == "--prepare-only" ]]; then
  echo ""
  echo "✅ Deploy bundle prepared (not deployed)."
  echo "   Staged: ${STAGING_DIR}/"
  echo "   Deploy when ready: npm run deploy"
  echo "   Prod URL: https://gujratitailors.appspot.com"
  exit 0
fi

echo ""
echo "☁️  Deploying to App Engine (project: ${PROJECT_ID})..."
gcloud app deploy "${APP_YAML}" --project="${PROJECT_ID}" --quiet

echo ""
echo "✅ Deployment successful!"
echo "🌐 Prod UI: https://gujratitailors.appspot.com"
echo "🔗 Backend: https://gujrati-tailors-backend.el.r.appspot.com"
