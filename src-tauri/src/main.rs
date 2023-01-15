#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
use aws_config::meta::region::RegionProviderChain;
use aws_sdk_s3::types::ByteStream;
use aws_sdk_s3::Config;
use aws_sdk_s3::{config, Client, Error, Region, PKG_VERSION};
use aws_types::Credentials;
use imgurs::{Error as ImgurError, ImageInfo, ImgurClient};
use tauri;
use tauri::Manager;
use tauri::{CustomMenuItem, SystemTray, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem};
use arboard;
use image::{DynamicImage, RgbaImage, ImageBuffer};
use uuid::{uuid, Uuid};
use std::path::{Path, PathBuf};
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
    let region3 = &region;
    let key2 = key.clone();
    let upload_result = client
        .put_object()
        .bucket(bucket2)
        .key(key)
        .body(body)
        .send()
        .await;
    match upload_result {
        Ok(response) => Ok(format!(
            "https://{}.s3.{}.amazonaws.com/{}",
            bucket2, region3, key2
        )),
        Err(error) => Err("Upload Error".to_string())
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

#[tauri::command]
fn image_to_file(filename: String) -> Result<String, String> {
    let mut clipboard = arboard::Clipboard::new().unwrap();
    let id = Uuid::new_v4();
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
        },
        Err(e) => Err("failed to save image".to_string()),
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
            image_to_file
        ])
        .plugin(tauri_plugin_store::Builder::default().build())
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
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
