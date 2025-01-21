import "./Header.scss";
import Nav from "./NavBar";


function Header() {
    return (
        <header className="bg-gray-100 text-blue-950 dark:bg-gray-700 p-5 dark:text-white text-5xl font-extralight h-33 text-center">
          <Nav /> 
        </header>
    );
}

export default Header;