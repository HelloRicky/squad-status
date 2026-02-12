#!/bin/bash
# Error hook: Agent encountered error
./hooks/update-status.sh "$1" "error" "$2"
