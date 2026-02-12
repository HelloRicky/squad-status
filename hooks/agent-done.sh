#!/bin/bash
# Post-hook: Agent completed task
./hooks/update-status.sh "$1" "idle"
