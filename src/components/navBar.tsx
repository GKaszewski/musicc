import { FaHome, FaMusic, FaSearch, FaUser } from "react-icons/fa";
import { PiPlaylistFill } from "react-icons/pi";
import { useAppStore } from "../store/store";
import { Screens } from "../types";
import { ButtonGroup, CircularProgress, IconButton } from "@chakra-ui/react";

const NavBar = () => {
    const { setScreen, isLoadingSong } = useAppStore(state => state);

    const goToScreen = (screen: string) => {
        setScreen(screen as Screens);
    }

    return (
		<div className="w-full flex items-center justify-around md:justify-center md:gap-5 p-2 bg-red-300 select-none">
			{isLoadingSong && (
				<CircularProgress
					isIndeterminate
					color="white"
					size="1rem"
					className="mx-4"
				/>
			)}
			{isLoadingSong && <span className="flex-1" />}
			<ButtonGroup colorScheme="blackAlpha" variant="ghost">
				<IconButton
					onClick={() => goToScreen(Screens.Home)}
					icon={<FaHome />}
					aria-label="Home"
				/>
				<IconButton
					className="text-white hover:text-gray-100 p-2"
					onClick={() => goToScreen(Screens.Search)}
					icon={<FaSearch />}
					aria-label="Search"
				/>
				<IconButton
					className="text-white hover:text-gray-100 p-2"
					onClick={() => goToScreen(Screens.Library)}
					icon={<FaMusic />}
					aria-label="Library"
				/>
				<IconButton
					className="text-white hover:text-gray-100 p-2"
					onClick={() => goToScreen(Screens.Playlists)}
					icon={<PiPlaylistFill />}
					aria-label="Playlists"
				/>
				<IconButton
					className="text-white hover:text-gray-100 p-2"
					onClick={() => goToScreen(Screens.Settings)}
					icon={<FaUser />}
					aria-label="Settings"
				/>
			</ButtonGroup>
			{isLoadingSong && <span className="flex-1" />}
		</div>
	);
}

export default NavBar;
