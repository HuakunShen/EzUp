# EzUp

<!-- @import "[TOC]" {cmd="toc" depthFrom=1 depthTo=6 orderedList=false} -->

<!-- code_chunk_output -->

- [EzUp](#-ezup)
  - [Installation](#-installation)
  - [Building](#-building)
    - [MacOS](#-macos)
  - [Updater](#-updater)

<!-- /code_chunk_output -->

Eazy Uploader is for easy image/file uploader.

Here is some demo screenshots.

<img src="https://hacker-storage.s3.us-east-2.amazonaws.com/2023/2/2/ezup-home.png" width="60%" />
<details>
<summary>More Images</summary>
<div>
    <img src="https://hacker-storage.s3.us-east-2.amazonaws.com/2023/2/2/ezup-services.png" width="60%" />
    <img src="https://hacker-storage.s3.us-east-2.amazonaws.com/2023/2/2/ezup-preference.png" width="60%" />
</div>
</details>

## Installation

Download from the latest release based on your platform.

For Mac you should download the `*.app.gz` file for now. Uncompress it and run `xattr -cr EzUp.app` to unlock. This is because the author didn't pay apple tax.

## Building

Set environment variables first

```bash
tauri signer generate -w ~/.tauri/ezup.key
export TAURI_PRIVATE_KEY="<private_key>"
export TAURI_PRIVATE_KEY=$(cat ~/.tauri/ezup.key) # if the private key is stored on disk
export TAURI_KEY_PASSWORD="<password if any>"
```

### MacOS

For universal build on darwin, the following command is required.

```bash
rustup target add x86_64-apple-darwin
```

Use `npm run build:mac:universal` to build a darwin universal app.

## Updater

```bash
tauri signer generate -w ~/.tauri/ezup.key # generate a pair of keys
```

- [vercel/hazel](https://github.com/vercel/hazel) (updater server)
- [Vercel Console](https://vercel.com/huakunshen/tauri-ezup-updater)
- [Deployed Updater Server](https://tauri-ezup-updater.vercel.app/)

Update Server for this app: https://tauri-ezup-updater.vercel.app/

How to deploy an update server for Tauri App in one click: https://github.com/HuakunShen/tauri-update-server
