use std::path::{Path, PathBuf};

use walkdir::WalkDir;

pub fn search_audio_files (dir: &Path) -> Vec<String> {
    let mut audio_files: Vec<String> = Vec::new();

    for entry in WalkDir::new(dir)
        .into_iter()
        .filter_map(Result::ok)
        .filter(|e| !e.file_type().is_dir()) {
            let file_path = entry.path();
            if let Some(extension) = file_path.extension() {
                if extension == "mp3" {
                    audio_files.push(file_path.to_string_lossy().into_owned());                }
            }
        }

    audio_files
}

pub fn get_common_dirs() -> Vec<PathBuf> {
    let mut paths = Vec::new();

    if let Some(home_dir) = dirs::home_dir() {
        paths.push(home_dir);
    }

    if let Some(desktop_dir) = dirs::desktop_dir() {
        paths.push(desktop_dir);
    }

    if let Some(document_dir) = dirs::document_dir() {
        paths.push(document_dir);
    }

    if let Some(download_dir) = dirs::download_dir() {
        paths.push(download_dir);
    }

    if let Some(music_dir) = dirs::audio_dir() {
        paths.push(music_dir);
    }

    if let Some(picture_dir) = dirs::picture_dir() {
        paths.push(picture_dir);
    }

    if let Some(video_dir) = dirs::video_dir() {
        paths.push(video_dir);
    }

    paths
}