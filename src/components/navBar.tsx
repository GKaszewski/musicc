import {FaHome, FaMusic, FaSearch, FaUser} from "react-icons/all";
import { useAppStore } from "../store/store";
import { Screens } from "../types";

const NavBar = () => {
    const { setScreen } = useAppStore(state => state);

    const goToScreen = (screen: string) => {
        setScreen(screen as Screens);
    }

    return <div className="w-full flex items-center justify-around md:justify-center md:gap-5 p-2 bg-red-300 select-none">
        <button className="text-white hover:text-gray-100 p-2" onClick={() => goToScreen(Screens.Home)}>
            <FaHome/>
        </button>
        <button className="text-white hover:text-gray-100 p-2" onClick={() => goToScreen(Screens.Search)}>
            <FaSearch />
        </button>
        <button className="text-white hover:text-gray-100 p-2" onClick={() => goToScreen(Screens.Library)}>
            <FaMusic />
        </button>
        <button className="text-white hover:text-gray-100 p-2" onClick={() => goToScreen(Screens.Settings)}>
            <FaUser />
        </button>
    </div>
}

export default NavBar;
