import {FaHome, FaMusic, FaSearch, FaUser} from "react-icons/all";
import { useAppStore } from "../store/store";
import { Screens } from "../types";
import { Button, ButtonGroup, IconButton } from "@chakra-ui/react";

const NavBar = () => {
    const { setScreen } = useAppStore(state => state);

    const goToScreen = (screen: string) => {
        setScreen(screen as Screens);
    }

    return (
		<div className="w-full flex items-center justify-around md:justify-center md:gap-5 p-2 bg-red-300 select-none">
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
					onClick={() => goToScreen(Screens.Settings)}
					icon={<FaUser />}
					aria-label="Settings"
				/>
			</ButtonGroup>
		</div>
	);
}

export default NavBar;
