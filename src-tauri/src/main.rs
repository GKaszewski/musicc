// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod files;

use id3::Tag;
use serde::{Serialize, Deserialize};
use tauri::{CustomMenuItem, SystemTrayMenu, SystemTrayMenuItem, SystemTray, SystemTrayEvent};
use tauri::Manager;

use base64::{Engine as _, engine::general_purpose};

#[derive(Serialize, Deserialize)]
pub struct Metadata {
    title: String,
    artist: String,
    album: String,
    cover: Cover,
}

#[derive(Serialize, Deserialize)]
pub struct Cover {
    data: String,
    mime_type: String,
}


#[tauri::command]
async fn get_metadata(file_path: String) -> Metadata {
    let metadata: Metadata;

    match Tag::read_from_path(file_path) {
        Ok(tag) => {
            let title = tag.title().unwrap_or("Unknown Title");
            let artist = tag.artist().unwrap_or("Unknown Artist");
            let album = tag.album().unwrap_or("Unknown Album");
            let cover: Cover;
            
            if let Some(picture) = tag.pictures().next() {
                let cover_data = general_purpose::STANDARD.encode(&picture.data);
                let cover_mime_type = picture.mime_type.clone();
                cover = Cover {
                    data: cover_data,
                    mime_type: cover_mime_type,
                };
            } else {
                cover = Cover {
                    data: "".to_string(),
                    mime_type: "".to_string(),
                };
            }

            println!("Title: {}", title);
            println!("Artist: {}", artist);
            println!("Album: {}", album);

            metadata = Metadata {
                title: title.to_string(),
                artist: artist.to_string(),
                album: album.to_string(),
                cover: cover,
            };
        }
        Err(why) => {
            println!("Error: {}", why);
            metadata = Metadata {
                title: "Unknown Title".to_string(),
                artist: "Unknown Artist".to_string(),
                album: "Unknown Album".to_string(),
                cover: Cover {
                    data: "".to_string(),
                    mime_type: "".to_string(),
                },
            };
        }
    };
    

    metadata
}

#[tauri::command(async)]
fn get_audio_files() -> Vec<String> {
    let mut audio_files: Vec<String> = Vec::new();

    for dir in files::get_common_dirs() {
        audio_files.append(&mut files::search_audio_files(&dir));
    }

    audio_files
}

fn main() {
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let hide = CustomMenuItem::new("hide".to_string(), "Hide");
    let tray_menu = SystemTrayMenu::new()
        .add_item(quit)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(hide);

    let tray = SystemTray::new().with_menu(tray_menu);

    tauri::Builder::default()
        .system_tray(tray)
        .on_system_tray_event(|app, event| {
            match event {
                SystemTrayEvent::MenuItemClick { id, .. } => {
                    match id.as_str() {
                        "quit" => std::process::exit(0),
                        "hide" => {
                            let window = app.get_window("main").unwrap();
                            window.hide().unwrap();
                        },
                        _ => {}
                    }
                }
                _ => {}
            }
        })
        .invoke_handler(tauri::generate_handler![get_metadata, get_audio_files])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
