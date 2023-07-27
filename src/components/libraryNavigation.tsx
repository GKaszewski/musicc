import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import { useAppStore } from "../store/store";


const LibraryNavigation = () => {
	const { selectedDirectory, setSelectedDirectory } = useAppStore(state => state);

	const getDirectoriesMap = () => {
		const directoriesMap: { [key: string]: string } = {};
		const split = selectedDirectory.split("\\");
		split.forEach((dir, i) => {
			directoriesMap[dir] = split.slice(0, i + 1).join("\\");
		}
		);

		console.log("Directories map", directoriesMap);
		return directoriesMap;
	}

	const directoriesMap = getDirectoriesMap();
	
	return <Breadcrumb>
		{Object.keys(directoriesMap).map((dir, i) => (
			<BreadcrumbItem key={`${dir}-${i}`}>
				<BreadcrumbLink>{dir}</BreadcrumbLink>
			</BreadcrumbItem>
		))}
	</Breadcrumb>

};

export default LibraryNavigation;