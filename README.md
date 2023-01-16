# EzUp

Eazy Uploader is for easy image/file uploader.

Here is some demo screenshots.

<div>
    <img src="https://huakun-brain.s3.us-east-2.amazonaws.com/2023/1/16/8b5952f9-0e2b-4eab-b994-29916911cd0f.png" width="60%" />
    <img src="https://huakun-brain.s3.us-east-2.amazonaws.com/2023/1/16/d84046a6-b213-4635-ac56-c649399f16df.png" width="60%" />
    <img src="https://huakun-brain.s3.us-east-2.amazonaws.com/2023/1/16/8e044453-2dfc-4f43-be28-e2666f33e5d0.png" width="60%" />
</div>

## Building

### MacOS

For universal build on darwin, the following command is required.

```bash
rustup target add x86_64-apple-darwin
```

USe `npm run build:mac:universal` to build a darwin universal app.
