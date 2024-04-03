#!/bin/bash

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
