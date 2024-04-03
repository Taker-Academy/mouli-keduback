#!/bin/bash

if [ ! -d "node_modules" ]; then
  npm i
fi

npm start

echo "✅ All tests done, full trace written to trace.json"