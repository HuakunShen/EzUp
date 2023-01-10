#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use aws_config::meta::region::RegionProviderChain;
use imgurs::ImgurClient;
use tauri::Manager;
use tauri::{CustomMenuItem, SystemTray, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

// #[tauri::command]
// async fn upload_imgur_from_url(url: &str) -> String {
//     let client = ImgurClient::new("8f1cbf4bf4b4193");
//     let info = client
//         .upload_image("https://www.ssh.com/hubfs/Imported_Blog_Media/Securing_applications_with_ssh_tunneling___port_forwarding-2.png")
//         .await
//         .unwrap();
//     format!("{}", info.data.link)
//     // format!("Hello, {}! You've been greeted from Rust!", name)
// }

#[tauri::command]
async fn upload_imgur_from_url(url: String) -> String {
    let client = ImgurClient::new("8f1cbf4bf4b4193");
    let upload_result = client.upload_image(&url).await;
    // upload_result.map_err(|err| err.to_string())?;
    let info = match upload_result {
        Ok(file) => file,
        Err(error) => panic!("Problem Uploading to Imgur: {:?}", error),
    };
    info.data.link
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
        .plugin(tauri_plugin_store::Builder::default().build())
        .invoke_handler(tauri::generate_handler![greet])
        .invoke_handler(tauri::generate_handler![upload_imgur_from_url])
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
