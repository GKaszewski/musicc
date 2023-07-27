// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod files;

use files::{read_metadata_from_id3, read_metadata_from_flac};
use serde::{Serialize, Deserialize};
use tauri::{CustomMenuItem, SystemTrayMenu, SystemTrayMenuItem, SystemTray, SystemTrayEvent};
use tauri::Manager;

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
    let extension = file_path.split('.').last().unwrap();
    if extension == "flac" {
        return read_metadata_from_flac(&file_path);
    }

    let metadata = read_metadata_from_id3(&file_path);
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
