#!/bin/sh
npx prisma migrate deploy

# Only seed on first run (when database is fresh)
if [ ! -f /app/prisma/.seeded ]; then
  npx prisma db seed
  touch /app/prisma/.seeded
fi

exec node server.js
