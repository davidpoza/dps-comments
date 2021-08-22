#!/bin/ash

if [ ! -f /usr/src/app/data/database.sql ]; then
  node scripts/db-init.js
fi
npm run start