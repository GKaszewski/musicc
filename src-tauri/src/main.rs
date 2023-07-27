// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use id3::Tag;
use serde::{Serialize, Deserialize};
use tauri::{CustomMenuItem, SystemTrayMenu, SystemTrayMenuItem, SystemTray, SystemTrayEvent};
use tauri::Manager;

#[derive(Serialize, Deserialize)]
pub struct Metadata {
    title: String,
    artist: String,
    album: String,
}


#[tauri::command]
fn get_metadata(file_path: String) -> Metadata {
    let metadata: Metadata;

    match Tag::read_from_path(file_path) {
        Ok(tag) => {
            let title = tag.title().unwrap_or("Unknown Title");
            let artist = tag.artist().unwrap_or("Unknown Artist");
            let album = tag.album().unwrap_or("Unknown Album");

            println!("Title: {}", title);
            println!("Artist: {}", artist);
            println!("Album: {}", album);

            metadata = Metadata {
                title: title.to_string(),
                artist: artist.to_string(),
                album: album.to_string(),
            };
        }
        Err(why) => {
            println!("Error: {}", why);
            metadata = Metadata {
                title: "Unknown Title".to_string(),
                artist: "Unknown Artist".to_string(),
                album: "Unknown Album".to_string(),
            };
        }
    };
    

    metadata
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
        .invoke_handler(tauri::generate_handler![get_metadata])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
