#!/bin/sh

# Create tables and seed if empty
node prisma/setup.mjs

# Fix ownership so nextjs user can read/write the database
chown -R nextjs:nodejs /app/prisma
chown -R nextjs:nodejs /app/public/uploads 2>/dev/null || true

# Drop to nextjs user for the app
exec su -s /bin/sh nextjs -c "node server.js"
