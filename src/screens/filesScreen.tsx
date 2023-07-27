import { useAppStore } from "../store/store";

const FilesScreen = () => {
    const {files} = useAppStore(state => state);

    const prettify = (file: string) => {
        const split = file.split("\\");
        return split[split.length - 1];
    }

    return <>
        <div className="w-full h-full overflow-y-auto flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold">Files</h1>
            <ul>
                {files.map((file, index) => <li key={index}>{prettify(file)}</li>)}
            </ul>
        </div>
    </>
};

export default FilesScreen;