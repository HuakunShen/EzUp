# EzUp

Eazy Uploader is for easy image/file uploader.

Here is some demo screenshots.

<div>
    <img src="https://huakun-brain.s3.us-east-2.amazonaws.com/2023/1/16/8b5952f9-0e2b-4eab-b994-29916911cd0f.png" width="60%" />
    <img src="https://huakun-brain.s3.us-east-2.amazonaws.com/2023/1/16/d84046a6-b213-4635-ac56-c649399f16df.png" width="60%" />
    <img src="https://huakun-brain.s3.us-east-2.amazonaws.com/2023/1/16/8e044453-2dfc-4f43-be28-e2666f33e5d0.png" width="60%" />
</div>

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

USe `npm run build:mac:universal` to build a darwin universal app.

## Updater

```bash
tauri signer generate -w ~/.tauri/ezup.key # generate a pair of keys
```

- [vercel/hazel](https://github.com/vercel/hazel) (updater server)
- [Vercel Console](https://vercel.com/huakunshen/tauri-ezup-updater)
- [Deployed Updater Server](https://tauri-ezup-updater.vercel.app/)
https://i.imgur.com/154vzeT.png