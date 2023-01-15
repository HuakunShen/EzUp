/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */

use aws_config::meta::region::RegionProviderChain;
use aws_sdk_s3::types::ByteStream;
use aws_sdk_s3::{config, Client, Config, Error, Region, PKG_VERSION};
use aws_types::Credentials;
use std::path::Path;
use std::process;
use structopt::StructOpt;

#[derive(Debug, StructOpt)]
struct Opt {
    /// The AWS Region.
    #[structopt(short, long)]
    region: Option<String>,

    /// The name of the bucket.
    #[structopt(short, long)]
    bucket: String,

    /// The name of the file to upload.
    #[structopt(short, long)]
    filename: String,

    /// The name of the object in the bucket.
    #[structopt(short, long)]
    key: String,

    /// Whether to display additional information.
    #[structopt(short, long)]
    verbose: bool,
}

// async fn upload_s3(client: &Client, region: &str, bucket: &str, filename: &str, key: &str) -> Result<String, Error> {
//     let body = ByteStream::from_path(Path::new(filename)).await;
//     match body {
//         Ok(b) => {
//             let resp = client
//                 .put_object()
//                 .bucket(bucket)
//                 .key(key)
//                 .body(b)
//                 .send()
//                 .await?;
//             let url = format!("https://{}.s3.{}.amazonaws.com/{}", bucket, region, key);
//             println!("{}", url);
//             Ok(url)
//         }
//     }
//     // Ok(())
// }

// snippet-end:[s3.rust.s3-helloworld]

/// Lists your buckets and uploads a file to a bucket.
/// # Arguments
///
/// * `-b BUCKET` - The bucket to which the file is uploaded.
/// * `-k KEY` - The name of the file to upload to the bucket.
/// * `[-r REGION]` - The Region in which the client is created.
///    If not supplied, uses the value of the **AWS_REGION** environment variable.
///    If the environment variable is not set, defaults to **us-west-2**.
/// * `[-v]` - Whether to display additional information.
#[tokio::main]
async fn main() -> Result<(), Error> {
    tracing_subscriber::fmt::init();

    let Opt {
        bucket,
        filename,
        key,
        region,
        verbose,
    } = Opt::from_args();
    // let bucket = "huakun-brain";
    // let filename = "/home/huakun/Pictures/a.png";
    // let region = "us-east-2";
    // let verbose = true;
    // let key = "ab.png";
    let region_provider = RegionProviderChain::first_try(region.map(Region::new))
        .or_default_provider()
        .or_else(Region::new("us-east-2"));

    // let region = Region::new("us-east-2");

    println!();

    if verbose {
        println!("S3 client version: {}", PKG_VERSION);
        println!(
            "Region:            {}",
            region_provider.region().await.unwrap().as_ref()
        );
        println!("Bucket:            {}", &bucket);
        println!("Filename:          {}", &filename);
        println!("Key:               {}", &key);
        println!();
    }
    // aws_configcrate::from_args();

    // use aws_types::config::SdkConfig;
    // Credentials::new("AKIA33M3SGN7XQAVLNVH", "zsZqmsjyUjxkbPIpHspLtiGUzmMZlV", None, None, provider_name)
    let creds = Credentials::from_keys(
        "AKIA33M3SGN7XQAVLNVH",
        "zsZqmsjyUjxkbPIpHspLtiGUzmMZlV/toAXEZNiV",
        None,
    );
    let region = "us-east-2";
    let conf = Config::builder()
        .credentials_provider(creds)
        .region(Region::new(region))
        .build();
    let client = Client::from_conf(conf);

    // let shared_config = aws_config::from_env().region(region_provider).load().await;
    // shared_config.credentials_provider()
    // let client = Client::new(&shared_config);

    // let sdk_config = aws_config::load_from_env().await;
    // let custom_credentials_provider = custom_provider(&sdk_config);
    // aws_config::from_env().region("us-east-2").credentials_provider(credentials_provider)
    let body = ByteStream::from_path(Path::new(&filename)).await.unwrap();
    let resp = client
        .put_object()
        .bucket(&bucket)
        .key(&key)
        .body(body)
        .send()
        .await?;
    let url = format!("https://{}.s3.{}.amazonaws.com/{}", bucket, region, key);
    // let upload_response = upload_s3(&client, &region, &bucket, &filename, &key)
    //     .await
    //     .unwrap();
    print!("{}", url);
    Ok(())
}
