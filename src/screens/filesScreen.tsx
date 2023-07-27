import { useAppStore } from "../store/store";
import { SimpleGrid } from '@chakra-ui/react'
import DirectoryCard from "../components/directoryCard";
import SongCard from "../components/songCard";
import LibraryNavigation from "../components/libraryNavigation";
import RootDirectoryCard from "../components/rootDirectoryCard";

const FilesScreen = () => {
    const {files, selectedDirectory} = useAppStore(state => state);

    const prettify = (file: string) => {
        const split = file.split("\\");
        return split[split.length - 1];
    }

    const groupFilesByDirectory = () => {
        const grouped: { [key: string]: string[] } = {};
        files.forEach(file => {
            const split = file.split("\\");
            const dir = split.slice(0, split.length - 1).join("\\");
            if (grouped[dir]) {
                grouped[dir].push(file);
            } else {
                grouped[dir] = [file];
            }
        }
        );
        return grouped;
    }

    const getFilesInDirectory = (dir: string) => {
        const grouped = groupFilesByDirectory();
        return grouped[dir];
    }

    const groupedFiles = groupFilesByDirectory();
    const directories = Object.keys(groupedFiles);

    return (
		<>
			<div className="w-full h-full p-4 overflow-y-auto flex flex-col items-center ">
				{selectedDirectory == "" && (
					<>
						<h1 className="text-2xl font-bold">Library</h1>
						<SimpleGrid
							columns={3}
							spacing={10}
							className="w-full mt-4"
						>
							{directories.map((dir, i) => (
								<DirectoryCard
									key={`${dir}-${i}`}
									dirPath={dir}
									dirElements={groupedFiles[dir]}
								/>
							))}
						</SimpleGrid>
					</>
				)}
				{selectedDirectory != "" && (
					<>
						<LibraryNavigation />
                        <SimpleGrid
                        templateColumns={{sm: "repeat(1, 1fr)", md: "repeat(2, 1fr)", lg: "repeat(6, 1fr)"}}    
                            spacing={10}
                            className="w-full mt-4"
                        >
                            <RootDirectoryCard />
                            {getFilesInDirectory(selectedDirectory).map((file, i) => (
                                <SongCard key={`${file}-${i}`} songPath={file} />
                            ))}
                        </SimpleGrid>
					</>
				)}
			</div>
		</>
	);
};

export default FilesScreen;