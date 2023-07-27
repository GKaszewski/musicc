import DisableContext from "./components/disableContext";
import {dialog, fs, invoke} from '@tauri-apps/api';
import {useEffect, useRef, useState} from "react";
import {AudioPlayerProvider} from "react-use-audio-player";
import NavBar from "./components/navBar";
import ControlsPanel from "./components/controlsPanel";
import HomePanel from "./components/homePanel";
import {getMatches} from "@tauri-apps/api/cli";
import {sendNotification} from "@tauri-apps/api/notification";
import {useSongs, useSongsUpdate} from "./context/songsContext";
import { Metadata } from "./types";

function App() {
    const [audioMetadata, setAudioMetadata] = useState<any | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const {songsUrls, currentSong, songsMetadata} = useSongs();
    const {setSongsUrls, setCurrentSong, setSongsMetadata} = useSongsUpdate();

    async function createUrlFromFilePath(selected: string) {
        const fileData = await fs.readBinaryFile(selected);
        const blob = new Blob([fileData], {type: 'audio/mpeg'});
        const url = URL.createObjectURL(blob);
        setSongsUrls([...songsUrls, url]);
        sendNotification({
            title: 'Audio file loaded',
            body: 'Audio file loaded successfully',
        });
    }

    const handleFileInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const audioUrls = Array.from(event.target.files).map(file => URL.createObjectURL(file));
            invoke("get_metadata", { filePath: audioUrls[0] }).then((metadata) => {
                console.log("Metadata", metadata);
            });
            setSongsUrls(audioUrls);
            setCurrentSong(0);
            sendNotification({
                title: 'Audio files loaded',
                body: 'Audio files loaded successfully',
            });
        }
    }

    const handleOpen = async () => {
        //fileInputRef.current?.click();

        const result = await dialog.open({
            multiple: true,
            filters: [
                { name: 'Audio', extensions: ['mp3', 'wav', 'ogg', 'flac'] },
            ]
        });

        if (result) {
            console.log('Audio result: ', result);
            if (result instanceof Array) {
                result.forEach(async (filePath: string) => {
                    await createUrlFromFilePath(filePath);
                    invoke("get_metadata", { filePath: filePath }).then(
                        (metadata) => {
                            console.log("Metadata", metadata);
                            setSongsMetadata([...songsMetadata, metadata as Metadata]);
                        }
                    );
                });
            } else {
                invoke("get_metadata", { filePath: result }).then(
                    (metadata) => {
                        console.log("Metadata", metadata);
                        setSongsMetadata([...songsMetadata, metadata as Metadata]);
                    }
                );

                createUrlFromFilePath(result);
            }
        }
    }

    useEffect(() => {
        getMatches().then(matches => {
            const audioPath = matches.args['audio_files'].value;
            if (audioPath) {
                createUrlFromFilePath(audioPath as string);
            }
        });
    }, [])

    return (
        <AudioPlayerProvider>
            <div className="w-full h-screen flex flex-col bg-gray-100">
                <DisableContext/>
                <input onChange={handleFileInputChange} ref={fileInputRef} type="file" accept="audio/*" multiple={true} hidden={true}/>
                <button onClick={handleOpen} className="px-4 py-2">Open</button>
                <HomePanel artSrc={null}/>
                <span className="flex-1"/>
                <ControlsPanel src={songsUrls[currentSong]}/>
                <NavBar/>
            </div>
        </AudioPlayerProvider>
    );
}

export default App;
