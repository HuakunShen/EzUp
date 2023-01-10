use imgurs::ImgurClient;

#[tauri::command]
fn uploadImgurFromURL(url: &str) -> String {
    let client = ImgurClient::new("8f1cbf4bf4b4193");
    let info = client
        .upload_image("https://www.ssh.com/hubfs/Imported_Blog_Media/Securing_applications_with_ssh_tunneling___port_forwarding-2.png")
        .await
        .unwrap();
    
    // format!("Hello, {}! You've been greeted from Rust!", name)
}