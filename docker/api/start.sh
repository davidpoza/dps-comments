#!/bin/ash

if [ ! -f /usr/src/app/data/database.sqlite ]; then
  node scripts/db-init.js
fi
npm run start