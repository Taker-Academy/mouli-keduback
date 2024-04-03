#!/bin/bash

output=$(sudo docker inspect kedubak | grep 'IPAddress":' | grep -oE '[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+')

echo "$output" > docker-ip.txt
