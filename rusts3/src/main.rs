use error_chain::error_chain;
use std::io::copy;
use std::fs::File;
use tempfile::Builder;
use std::io::Cursor;

error_chain! {
     foreign_links {
         Io(std::io::Error);
         HttpRequest(reqwest::Error);
     }
}

#[tokio::main]
async fn main() -> Result<()> {
    let tmp_dir = Builder::new().prefix("example").tempdir()?;
    let target = "https://www.rust-lang.org/logos/rust-logo-512x512.png";
    let response = reqwest::get(target).await?;

    let mut dest = {
        let fname = response
            .url()
            .path_segments()
            .and_then(|segments| segments.last())
            .and_then(|name| if name.is_empty() { None } else { Some(name) })
            .unwrap_or("tmp.bin");

        println!("file to download: '{}'", fname);
        // let fname = tmp_dir.path().join(fname);
        println!("will be located under: '{:?}'", fname);
        File::create(fname)?
    };
    // let content =  response.text().await?;
    // copy(&mut content.as_bytes(), &mut dest)?;
    println!("{:?}", dest);
    let mut content =  Cursor::new(response.bytes().await?);
    copy(&mut content, &mut dest)?;
    Ok(())
}



// use std::fs;
// use std::io::copy;
// use std::io::Cursor;
// use std::fs::File;

// #[tokio::main]
// async fn main() -> Result<()> {

//     let object_path = "logos/rust-logo-512x512.png";
//     let target = format!("https://www.rust-lang.org/{}", object_path);  
//     let response = reqwest::get(&target).await?;

//     let mut dest = {
    
//         let fname = response
//             .url()
//             .path_segments()
//             .and_then(|segments| segments.last())
//             .and_then(|name| if name.is_empty() { None } else { Some(name) })
//             .unwrap_or("tmp.bin");
            
            
//         println!("file to download: '{}'", fname);

//         let object_prefix = &object_path[..object_path.rfind('/').unwrap()];
//         let object_name = &object_path[object_path.rfind('/').unwrap()+1..];
//         // let output_dir = format!("{}/{}", env::current_dir().unwrap().to_str().unwrap().to_string(), object_prefix);
//         let output_dir = "./images";
//         fs::create_dir_all(output_dir.clone())?;

//         println!("will be located under: '{}'", output_dir.clone());
                
//         let output_fname = format!("{}/{}", output_dir, object_name);
//         println!("Creating the file {}", output_fname);
        
//         File::create(output_fname)?
        
//     };

//     let mut content =  Cursor::new(response.bytes().await?);
//     copy(&mut content, &mut dest)?;

//     // let content =  response.text().await?;
//     // copy(&mut content.as_bytes(), &mut dest)?;
//     // Ok(())
// }

// extern crate reqwest;

// use std::fs;
// use std::fs::File;
// use std::io;
// use image::{DynamicImage, ImageFormat, ImageBuffer};

// // #[tokio::main]
// fn main() {
//     // let mut file = std::fs::File::create("image.png").unwrap();
//     // match resp {
//     //     Ok(res) => println!("Response OK"),
//     //     Err(err) => println!("Response Err")
//     // }
//     let resp = reqwest::blocking::get("https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png")
//         .unwrap()
//         .bytes()
//         .unwrap();
    
//     let vec = resp.to_vec();
//     // ImageBuffer::from_vec(width, height, buf)
//     // DynamicImage::ImageRgba8(vec);
//     let img = match DynamicImage::from_vec(vec, ImageFormat::Png) {
//         Ok(img) => img,
//         Err(e) => panic!("Failed to decode image: {:?}", e),
//     };
//     match fs::write("example.png", &vec) {
//         Ok(()) => println!("File written successfully"),
//         Err(e) => println!("Error writing file: {:?}", e),
//     }
//     // std::io::copy(&mut resp, &mut file);
// }

// // fn main() {
// //     let bytes = vec![1, 2, 3, 4];

// //     // Write the bytes to a file
// //     match fs::write("example.png", &bytes) {
// //         Ok(()) => println!("File written successfully"),
// //         Err(e) => println!("Error writing file: {:?}", e),
// //     }
// // }
