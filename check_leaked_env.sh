#!/bin/bash

set -a            
source .env
set +a

cd $REPO_PATH;

if [ $? -ne 0 ]; then
    echo "🚨 The REPO_PATH is not valid"
    exit 1
fi

if [ ! -d ".git" ]; then
    echo "🚨 This is not a git repository"
    exit 1
fi

result=$(git log --all --name-only --pretty=format:%H -- .env | tail -n 2 | head -n 1)

RED='\033[0;31m'    # Red color
GREEN='\033[0;32m'  # Green color
NC='\033[0m'        # No color (reset)

echo ""
echo "🕵️‍♂️ Let's see if .env was leaked? 😉🥁"
sleep 2

if [ -n "$result" ]; then
    echo -e "${RED}💥 💔 😱 LEAKED since $result ${NC} "
else
    echo -e "${GREEN}🌟 ✨ 🥳 OK${NC}"
fi

cd -