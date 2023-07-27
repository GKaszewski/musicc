import React, {PropsWithChildren} from "react";
import { Metadata } from "../types";

type SongsContext = {
    currentSong: number,
    songsUrls: string[],
    songsMetadata: Metadata[]
}

type UpdateSongsContext = {
    setCurrentSong: (index: number) => void,
    setSongsUrls: (urls: string[]) => void
    setSongsMetadata: (metadata: Metadata[]) => void
}

const initialSongsContext: SongsContext = {
    currentSong: 0,
    songsUrls: [],
    songsMetadata: []
}

const initialUpdateSongsContext: UpdateSongsContext = {
    setCurrentSong: (index: number) => {
    },
    setSongsUrls: (urls: string[]) => {
    },
    setSongsMetadata: (metadata: Metadata[]) => {
    }
}

export const SongsContext = React.createContext(initialSongsContext)
export const SongsUpdateContext = React.createContext(initialUpdateSongsContext)

export const useSongs = () => React.useContext(SongsContext)
export const useSongsUpdate = () => React.useContext(SongsUpdateContext)

export const SongsProvider: React.FC<PropsWithChildren> = ({children}) => {
    const [currentSong, setCurrentSong] = React.useState<number>(0)
    const [songsUrls, setSongsUrls] = React.useState<string[]>([])
    const [songsMetadata, setSongsMetadata] = React.useState<Metadata[]>([])

    return <SongsContext.Provider value={{currentSong, songsUrls, songsMetadata}}>
        <SongsUpdateContext.Provider value={{setCurrentSong, setSongsUrls, setSongsMetadata}}>
            {children}
        </SongsUpdateContext.Provider>
    </SongsContext.Provider>
}
