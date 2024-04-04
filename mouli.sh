#!/bin/bash

if [ ! -d "node_modules" ]; then
  npm i
fi

./api_life_check.sh

if [ $? -ne 0 ]; then
  exit 1
fi

npm start

echo "✅ All tests done, full trace written to trace.json"

./check_leaked_env.sh