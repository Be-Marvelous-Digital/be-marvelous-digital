#!/bin/sh

# Create tables and seed if empty
node scripts/setup.mjs

# Fix ownership so nextjs user can read/write the database and uploads
chown -R nextjs:nodejs /app/data 2>/dev/null || true
chown -R nextjs:nodejs /app/public/uploads 2>/dev/null || true

# Drop to nextjs user for the app
exec su -s /bin/sh nextjs -c "node server.js"
