#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
use arboard;
use aws_sdk_s3::types::ByteStream;
use aws_sdk_s3::Config;
use aws_sdk_s3::{Client, Region};
use aws_types::Credentials;
use image::{DynamicImage, ImageBuffer, RgbaImage};
use imgurs::{ImageInfo, ImgurClient};
use std::path::{Path, PathBuf};
use tauri;
use tauri::Manager;
use tauri::{CustomMenuItem, SystemTray, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem};
// use uuid::{uuid, Uuid};
// use error_chain::error_chain;
use std::fs::File;
use std::io::copy;
// use tempfile::Builder;
// use std::borrow::Cow;
use std::io::Cursor;
use window_vibrancy::{apply_vibrancy, NSVisualEffectMaterial};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn upload_s3(
    region: String,
    bucket: String,
    filename: String,
    key: String,
    access_key_id: String,
    secret_access_key: String,
) -> Result<String, String> {
    let bucket2 = &bucket;
    let creds = Credentials::from_keys(access_key_id, secret_access_key, None);
    let region2 = region.clone();
    let region3 = region.clone();
    let conf = Config::builder()
        .credentials_provider(creds)
        .region(Region::new(region2))
        .build();
    let client = Client::from_conf(conf);
    let body = ByteStream::from_path(Path::new(&filename)).await.unwrap();
    let key2 = key.clone();

    let key_path = Path::new(&key);
    let ext = key_path.extension().unwrap().to_str().unwrap();
    let content_type = match ext {
        "png" => "image/png",
        "jpeg" => "image/jpeg",
        "jpg" => "image/jpeg",
        "gif" => "image/gif",
        "bmp" => "image/bmp",
        "tiff" => "image/tiff",
        "svg" => "image/svg+xml",
        _ => "application/octet-stream",
    };

    let upload_result = client
        .put_object()
        .bucket(bucket2)
        .key(key)
        .body(body)
        .content_type(content_type)
        .send()
        .await;
    match upload_result {
        Ok(_response) => Ok(format!(
            "https://{}.s3.{}.amazonaws.com/{}",
            bucket2, region3, key2
        )),
        Err(_error) => Err("Upload Error".to_string()),
    }
    // upload_result.map_err(|err| err.to_string())
    // let url = format!("https://{}.s3.{}.amazonaws.com/{}", bucket, region, key);
    // Ok(url)
    // let upload_response = upload::upload_s3_object(&client, &bucket, &filename, &key);
    // format!("Hello, {}! You've been greeted from Rust!", "huakun")
}

#[tauri::command]
async fn upload_imgur_from_url(client_id: String, url: String) -> Result<ImageInfo, String> {
    let client = ImgurClient::new(&client_id);
    let upload_result = client.upload_image(&url).await;
    println!("{:?}", upload_result);
    // format!("Hello, {}! You've been greeted from Rust!", url)
    upload_result.map_err(|err| err.to_string())
}

/// Download a file from given url and save to given location
#[tauri::command]
async fn download_file(url: String, dest_dir: String) -> Result<String, String> {
    // let tmp_dir = Builder::new().prefix("ezup").tempdir().unwrap();
    let dest_dir_path = Path::new(&dest_dir);
    let response = reqwest::get(url).await.unwrap();
    let dest_file_path: PathBuf;
    let mut dest = {
        let fname = response
            .url()
            .path_segments()
            .and_then(|segments| segments.last())
            .and_then(|name| if name.is_empty() { None } else { Some(name) })
            .unwrap_or("tmp.bin");
        println!("file to download: '{}'", fname);
        dest_file_path = dest_dir_path.join(fname);
        let dest_file_path_clone = dest_file_path.clone();
        // println!("will be located under: '{:?}'", dest_file_path);
        File::create(dest_file_path_clone).unwrap()
    };
    // let content = response.text().await.unwrap();
    // let _copyResult = copy(&mut content.as_bytes(), &mut dest).unwrap();
    let bytes = response.bytes().await.map_err(|err| err.to_string())?;
    let mut content = Cursor::new(bytes);
    copy(&mut content, &mut dest).map_err(|err| err.to_string())?;

    // let metadata = dest.metadata().map_err(|err| err.to_string())?;
    // metadata.
    let dest_file_path_str = dest_file_path.into_os_string().into_string().unwrap();
    Ok(dest_file_path_str)
}

/// read image from clipboard and save to given location
#[tauri::command]
fn image_to_file(filename: String) -> Result<String, String> {
    let mut clipboard = arboard::Clipboard::new().unwrap();
    // let runtime_dir = tauri::api::path::runtime_dir().unwrap();
    // println!("{}", runtime_dir);
    // let runtime_d = tauri::api::path::cache_dir().unwrap();
    match clipboard.get_image() {
        Ok(img) => {
            // eprintln!("getting {}x{} image", img.width, img.height);
            let img2: RgbaImage = ImageBuffer::from_raw(
                img.width.try_into().unwrap(),
                img.height.try_into().unwrap(),
                img.bytes.into_owned(),
            )
            .unwrap();
            let img3 = DynamicImage::ImageRgba8(img2);
            let filename2 = filename.clone();
            img3.save(filename).unwrap();
            Ok(filename2)
        }
        Err(_e) => Err("failed to save image".to_string()),
    }
}

// pub async fn upload_object(
//     client: &Client,
//     bucket_name: &str,
//     file_name: &str,
//     key: &str,
// ) -> Result<(), Error> {
//     let body = ByteStream::from_path(Path::new(file_name)).await;
//     client
//         .put_object()
//         .bucket(bucket_name)
//         .key(key)
//         .body(body.unwrap())
//         .send()
//         .await?;

//     println!("Uploaded file: {}", file_name);
//     Ok(())
// }

fn main() {
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let hide = CustomMenuItem::new("hide".to_string(), "Hide");
    let show = CustomMenuItem::new("show".to_string(), "Show");
    let tray_menu = SystemTrayMenu::new()
        .add_item(quit)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(hide)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(show);

    let system_tray = SystemTray::new().with_menu(tray_menu);
    tauri::Builder::default()
        // .plugin(
        //     tauri_plugin_stronghold::Builder::new(|password| {
        //         // TODO: hash the password here with e.g. argon2, blake2b or any other secure algorithm
        //         todo!()
        //     })
        //     .build()
        // )
        .invoke_handler(tauri::generate_handler![
            greet,
            upload_imgur_from_url,
            upload_s3,
            image_to_file,
            download_file
        ])
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_clipboard::init())
        .setup(|app| {
            let window = app.get_window("main").unwrap();
            #[cfg(target_os = "macos")]
            apply_vibrancy(&window, NSVisualEffectMaterial::HudWindow, None, None)
                .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");
            Ok(())
        })
        .system_tray(system_tray)
        .on_system_tray_event(|app, event| match event {
            // SystemTrayEvent::LeftClick {
            //     position: _,
            //     size: _,
            //     ..
            // } => {
            //     println!("system tray received a left click");
            // }
            // SystemTrayEvent::RightClick {
            //     position: _,
            //     size: _,
            //     ..
            // } => {
            //     println!("system tray received a right click");
            // }
            // SystemTrayEvent::DoubleClick {
            //     position: _,
            //     size: _,
            //     ..
            // } => {
            //     println!("system tray received a double click");
            // }
            SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
                "quit" => {
                    std::process::exit(0);
                }
                "hide" => {
                    let window = app.get_window("main").unwrap();
                    window.hide().unwrap();
                }
                "show" => {
                    let window = app.get_window("main").unwrap();
                    window.show().unwrap();
                }
                _ => {}
            },
            _ => {}
        })
        .build(tauri::generate_context!())
        // .run(tauri::generate_context!())
        .expect("error while running tauri application")
        .run(|_app_handle, event| match event {
            tauri::RunEvent::ExitRequested { api, .. } => {
                api.prevent_exit();
            }
            _ => {}
        });
}
