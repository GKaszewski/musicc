import {FaHome, FaMusic, FaSearch, FaUser} from "react-icons/all";

const NavBar = () => {
    return <div className="w-full flex items-center justify-around md:justify-center md:gap-5 p-2 bg-red-300 select-none">
        <button className="text-white hover:text-gray-100 p-2">
            <FaHome/>
        </button>
        <button className="text-white hover:text-gray-100 p-2">
            <FaSearch />
        </button>
        <button className="text-white hover:text-gray-100 p-2">
            <FaMusic />
        </button>
        <button className="text-white hover:text-gray-100 p-2">
            <FaUser />
        </button>
    </div>
}

export default NavBar;
