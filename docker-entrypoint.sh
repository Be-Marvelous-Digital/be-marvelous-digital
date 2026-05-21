#!/bin/sh

# Run migrations and seed as root (volume is root-owned)
node node_modules/prisma/build/index.js migrate deploy

if [ ! -f /app/prisma/.seeded ]; then
  node node_modules/tsx/dist/cli.mjs prisma/seed.ts
  touch /app/prisma/.seeded
fi

# Fix ownership so nextjs user can read/write the database
chown -R nextjs:nodejs /app/prisma
chown -R nextjs:nodejs /app/public/uploads 2>/dev/null || true

# Drop to nextjs user for the app
exec su -s /bin/sh nextjs -c "node server.js"
