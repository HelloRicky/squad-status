#!/bin/bash
# Pre-hook: Agent starting task
./hooks/update-status.sh "$1" "working" "$2"
