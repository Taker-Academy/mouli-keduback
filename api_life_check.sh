#!/bin/bash

echo "🔍 Health check for API"

# Load environment variables
set -a            
source .env
set +a

base_url="http://localhost:$PORT/user/me"

health_check() {
    url=$1
    response=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    if [ "$response" == "000" ]; then
          echo "❌ Impossible to reach API at $url"
          exit 1
    else
        echo "✅ Health check passed for $url"
        exit 0
    fi
}

health_check "$base_url"
