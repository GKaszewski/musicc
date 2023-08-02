// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod files;

use std::path::PathBuf;

use files::{read_metadata_from_id3, read_metadata_from_flac, stream_audio_data, search_for_audio_files};
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


#[derive(Serialize, Deserialize)]
pub struct StreamingData {
    data: Vec<u8>,
    read_bytes: usize,
}

#[derive(Serialize, Deserialize)]
pub struct AudioSearchResult {
    files: Vec<String>,
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
fn get_audio_files(dirs: Vec<PathBuf>) -> Vec<String> {
    let mut audio_files: Vec<String> = Vec::new();
    let mut directories: Vec<PathBuf> = Vec::new();

    for dir in files::get_common_dirs() {
        directories.push(dir);
    }

    for dir in dirs {
        directories.push(dir);
    }

    for dir in directories {
        audio_files.append(&mut files::search_audio_files(&dir));
    }

    audio_files
}

#[tauri::command(async)]
fn stream_audio_file(file_path: String, start: u64, end: u64) -> StreamingData {
    match stream_audio_data(file_path, start, end) {
        Ok((data, read_bytes)) => {
            let streaming_data = StreamingData {
                data: data,
                read_bytes: read_bytes,
            };
            streaming_data
        },
        Err(e) => {
            println!("Error: {}", e);
            StreamingData {
                data: Vec::new(),
                read_bytes: 0,
            }
        }
    }
}

#[tauri::command(async)]
fn search_audio_files(dirs: Vec<PathBuf>, query: String) -> AudioSearchResult {
    let result = search_for_audio_files(dirs, query.as_str());
    match result {
        Some(res) => {
            return AudioSearchResult {
                files: res,
            }
        },
        None => {
            return AudioSearchResult {
                files: Vec::new(),
            }
        }
    }
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
                    let item_handle = app.tray_handle().get_item(&id);
                    match id.as_str() {
                        "quit" => std::process::exit(0),
                        "hide" => {
                            let window = app.get_window("main").unwrap();
                            if window.is_visible().unwrap() {
                                window.hide().unwrap();
                                let _ = item_handle.set_title("Show");
                            } else {
                                window.show().unwrap();
                                let _ = item_handle.set_title("Hide");
                            }
                        },
                        _ => {}
                    }
                }
                _ => {}
            }
        })
        .invoke_handler(tauri::generate_handler![get_metadata, get_audio_files, stream_audio_file, search_audio_files])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
