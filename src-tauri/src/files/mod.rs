use std::{
    io::{self, Seek, Read},
    path::{Path, PathBuf},
};

use base64::{engine::general_purpose, Engine as _};
use id3::Tag;
use metaflac::Tag as FlacTag;
use walkdir::WalkDir;

use crate::{Cover, Metadata};

pub fn search_for_audio_files(dirs: Vec<PathBuf>, query: &str) -> Option<Vec<String>> {
    let mut audio_files: Vec<String> = Vec::new();
    let common_dirs = get_common_dirs();
    let mut search_dirs: Vec<PathBuf> = Vec::new();

    println!("Query: {}", query);

    for common_dir in common_dirs {
        if dirs.contains(&common_dir) {
            continue;
        }

        search_dirs.push(common_dir);
    }

    for dir in dirs {
        search_dirs.push(dir);
    }

    for dir in search_dirs {
        for entry in WalkDir::new(dir)
            .into_iter()
            .filter_map(Result::ok)
            .filter(|e| !e.file_type().is_dir())
        {
            let file_path = entry.path();
            if let Some(extension) = file_path.extension() {
                if extension == "mp3" || extension == "flac" || extension == "ogg" || extension == "wav"
                {
                    if file_path.file_name().unwrap().to_string_lossy().to_lowercase().contains(query) {
                        let audio_file = file_path.to_string_lossy().into_owned();
                        println!("Found audio file: {}", audio_file);
                        audio_files.push(audio_file);
                    }
                }
            }
        }
    }

    audio_files.sort_by(|a, b| a.to_lowercase().cmp(&b.to_lowercase()));

    if audio_files.is_empty() {
        return None;
    }

    Some(audio_files)
}

pub fn search_audio_files(dir: &Path) -> Vec<String> {
    let mut audio_files: Vec<String> = Vec::new();

    for entry in WalkDir::new(dir)
        .into_iter()
        .filter_map(Result::ok)
        .filter(|e| !e.file_type().is_dir())
    {
        let file_path = entry.path();
        if let Some(extension) = file_path.extension() {
            if extension == "mp3" || extension == "flac" || extension == "ogg" || extension == "wav"
            {
                let file = file_path.to_string_lossy().into_owned();
                if audio_files.contains(&file) {
                    continue;
                }
                audio_files.push(file);
            }
        }
    }

    audio_files.sort_by(|a, b| a.to_lowercase().cmp(&b.to_lowercase()));

    audio_files
}

pub fn get_common_dirs() -> Vec<PathBuf> {
    let mut paths = Vec::new();

    if let Some(desktop_dir) = dirs::desktop_dir() {
        paths.push(desktop_dir);
    }

    if let Some(download_dir) = dirs::download_dir() {
        paths.push(download_dir);
    }

    if let Some(music_dir) = dirs::audio_dir() {
        paths.push(music_dir);
    }

    paths
}

pub fn read_metadata_from_id3(file_path: &String) -> Metadata {
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
    }

    metadata
}

pub fn read_metadata_from_flac(file_path: &String) -> Metadata {
    let metadata: Metadata;
    let mut cover: Cover = Cover {
        data: "".to_string(),
        mime_type: "".to_string(),
    };

    let tag = FlacTag::read_from_path(file_path).unwrap();

    let title = tag.get_vorbis("TITLE").unwrap().next().unwrap_or("Unknown");
    let artist = tag
        .get_vorbis("ARTIST")
        .unwrap()
        .next()
        .unwrap_or("Unknown");
    let album = tag.get_vorbis("ALBUM").unwrap().next().unwrap_or("Unknown");

    println!("Title: {}", title);
    println!("Artist: {}", artist);
    println!("Album: {}", album);

    let blocks = tag.blocks();
    for block in blocks {
        match block {
            metaflac::block::Block::Picture(picture) => {
                let cover_data = general_purpose::STANDARD.encode(&picture.data);
                let cover_mime_type = picture.mime_type.clone();
                cover = Cover {
                    data: cover_data,
                    mime_type: cover_mime_type,
                };
            }
            _ => {}
        }
    }

    metadata = Metadata {
        title: title.to_string(),
        artist: artist.to_string(),
        album: album.to_string(),
        cover,
    };

    metadata
}

pub fn stream_audio_data(
    file_path: impl AsRef<Path>,
    start: u64,
    end: u64,
) -> Result<(Vec<u8>, usize), io::Error> {
    let mut file = std::fs::File::open(file_path.as_ref())?;
    let mut buffer = vec![0; (end - start) as usize];
    file.seek(io::SeekFrom::Start(start))?;
    let read_bytes = file.read(&mut buffer)?;
    println!("Read {} bytes", read_bytes);
    println!("Start: {}, End: {}", start, end);
    Ok((buffer, read_bytes))
}
