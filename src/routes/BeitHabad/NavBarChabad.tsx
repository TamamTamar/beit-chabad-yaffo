import { DarkThemeToggle, Dropdown, Navbar, Tooltip } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiBox, FiUser, FiShoppingCart, FiSettings, FiUsers, FiTrendingUp, FiHeart } from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";
import UserAvatar from "../../components/UserAvatar";



const NavChabad = () => {
    const { isLoggedIn, user, logout } = useAuth();
    const navigate = useNavigate();
  
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;

    return (
        <Navbar fluid rounded style={{ width: '100%', direction: 'rtl' }}>
           <Navbar.Brand href="/">
    <img
        src="/img/LogoChabad (2).png"
        alt="בית חבד - יפו העתיקה"
        className="h-12 w-auto" 
    />
</Navbar.Brand>

            <div className="flex md:order-2 items-center">
               

               {/*  {isLoggedIn && user?.isAdmin && (
                    <>
                        <Link to="/admin/dashboard" className="mr-5 hidden md:block">
                            <Tooltip
                                content="Manage Shop"
                                placement="top"
                                className="text-xs bg-gray-700 text-white rounded px-2 py-1"
                            >
                                <FiSettings size={20} className="text-gray hover:text-gray-300" />
                            </Tooltip>
                        </Link>
                      
                    </>
                )} */}

                {isLoggedIn && (
                    <Dropdown
                        arrowIcon={false}
                        inline
                        label={
                            <UserAvatar firstName={user.name.first} lastName={user.name.last} />
                        }
                    >
                        <Dropdown.Header>
                            <span className="block text-xs">{user.name.first} {user.name.last}</span>
                            <span className="block truncate text-xs font-medium">{user.email}</span>
                        </Dropdown.Header>
                        <Dropdown.Divider />
                        {user.isAdmin && (
                            <>
                                <Dropdown.Item onClick={() => navigate("/beitChabad/admin")}>
                                    ניהול תוכן
                                </Dropdown.Item>
                                <Dropdown.Divider />
                            </>
                        )}
              
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={() => { logout(); navigate("/"); }}>התנתק</Dropdown.Item>
                    </Dropdown>
                )}

                {!isLoggedIn && (
                    <Tooltip content="Login" placement="bottom" className="text-xs bg-gray-700 text-white rounded px-1 py-1">
                        <Link to="/login" className="mr-4 flex items-center">
                            <FiUser size={20} className="text-gray hover:text-gray-300" />
                        </Link>
                    </Tooltip>
                )}

                <Navbar.Toggle />
                <DarkThemeToggle />
            
            </div>
            <Navbar.Collapse className="pr-4">
    <Navbar.Link href="/beitChabad" className={`text-s mr-0 ${isActive("/") ? "font-bold" : ""}`}>
        בית
    </Navbar.Link>
    <Navbar.Link href="/beitChabad" className={`text-s mr-8 ${isActive("/about") ? "font-bold" : ""}`}>
        אודות
    </Navbar.Link>
    <Navbar.Link href="/beitChabad" className={`text-s mr-0 ${isActive("/gallery") ? "font-bold" : ""}`}>
        גלריה
    </Navbar.Link>
    <Navbar.Link href="/beitChabad" className={`text-s mr-0 ${isActive("/contact") ? "font-bold" : ""}`}>
        מידע למטייל
    </Navbar.Link>

    <Navbar.Link href="/beitChabad" className={`text-s mr-0 ${isActive("/contact") ? "font-bold" : ""}`}>
        יצירת קשר
    </Navbar.Link>
    <Navbar.Link href="/beitChabad" className={`text-s mr-0 ${isActive("/contact") ? "font-bold" : ""}`}>
        הרשמה לארוחת שבת
    </Navbar.Link>
    
    <Navbar.Link
        href="/beitChabad"
        className={`text-s mr-10 py-4 px-5 rounded-md flex items-center gap-2 ${isActive("/beitChabad") ? "font-bold" : ""}`}
    >
        <FiHeart size={20} className="text-red" />
         אני רוצה לתרום 
    </Navbar.Link>


</Navbar.Collapse>

        </Navbar>
    );
}

export default NavChabad;