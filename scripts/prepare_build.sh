#!/usr/bin/env bash
PRIVATE_KEY_PATH="$HOME/.tauri/ezup.key";
if test -f "$PRIVATE_KEY_PATH"; then
    export TAURI_PRIVATE_KEY=$(cat ~/.tauri/ezup.key); # if the private key is stored on disk
    export TAURI_KEY_PASSWORD="";
else
    echo "Warning: Private Key File Not Found";
fi
