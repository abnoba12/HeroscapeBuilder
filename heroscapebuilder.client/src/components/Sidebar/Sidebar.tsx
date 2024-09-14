import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/img/logo.png";

const Sidebar: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false); // Tracks if sidebar is open
    const [activeMenu, setActiveMenu] = useState<string | null>(null); // Tracks which menu is expanded
    const location = useLocation(); // Get the current location

    const toggleSidebar = (): void => {
        setIsOpen(!isOpen);
    };

    const getColor = (): string => {
        if (location.pathname.startsWith("/army-cards")) {
            return "green";
        }
        if (location.pathname.startsWith("/units")) {
            return "blue"; 
        }
        if (location.pathname.startsWith("/game-play")) {
            return "light-blue";
        }
        return "black";
    };

    // Automatically expand the parent menu if on a child route
    useEffect(() => {
        if (location.pathname.startsWith("/army-cards")) {
            setActiveMenu("army-cards");
        } else if (location.pathname.startsWith("/units")) {
            setActiveMenu("units");
        } else if (location.pathname.startsWith("/game-play")) {
            setActiveMenu("game-play");
        }
    }, [location.pathname]);

    const toggleSubmenu = (menuName: string): void => {
        if (activeMenu === menuName) {
            setActiveMenu(null); // Close the active menu
        } else {
            setActiveMenu(menuName); // Open the clicked menu
        }
    };
    return (
        <div className={`sidebar ${isOpen ? "open" : ""}`} data-color={getColor()} data-active-color="info">
            <div className="logo">
                <a href="/" className="simple-text logo-mini">
                    <div className="logo-img"><img src={logo} alt="logo" /></div>
                </a>
                <a href="/" className="simple-text logo-normal">Heroscape Builder</a>
            </div>
            <div className="sidebar-wrapper ps">
                <ul className="nav sidebar-links">
                    <li className={`nav-item ${activeMenu === 'army-cards' ? 'active' : ''}`}>
                        <a href="#!" onClick={() => toggleSubmenu('army-cards')}><p>Army Cards</p></a>
                        {activeMenu === 'army-cards' && (
                            <ul className="submenu">
                                <li><Link to="/army-cards/standard" onClick={toggleSidebar}>Standard Cards</Link></li>
                                <li><Link to="/army-cards/threebyfive" onClick={toggleSidebar}>3x5 Index Cards</Link></li>
                                <li><Link to="/army-cards/fourbysix" onClick={toggleSidebar}>4x6 Index Cards</Link></li>
                                <li><Link to="/army-cards/printing" onClick={toggleSidebar}>Printing Cards</Link></li>
                            </ul>
                        )}
                    </li>
                    <li className={`nav-item ${activeMenu === 'units' ? 'active' : ''}`}>
                        <a href="#!" onClick={() => toggleSubmenu('units')}><p>Units</p></a>
                        {activeMenu === 'units' && (
                            <ul className="submenu">
                                <li><Link to="/units/unit-data" onClick={toggleSidebar}>Unit Data</Link></li>
                            </ul>
                        )}
                    </li>
                    {/*<li className={`nav-item ${activeMenu === 'contact' ? 'active' : ''}`}>*/}
                    {/*    <a href="#!" onClick={() => toggleSubmenu('contact')}><p>Terrain</p></a>*/}
                    {/*    {activeMenu === 'contact' && (*/}
                    {/*        <ul className="submenu">*/}
                    {/*            <li><Link to="/contact/email" onClick={toggleSidebar}>Email Us</Link></li>*/}
                    {/*            <li><Link to="/contact/call" onClick={toggleSidebar}>Call Us</Link></li>*/}
                    {/*        </ul>*/}
                    {/*    )}*/}
                    {/*</li>*/}
                    <li className={`nav-item ${activeMenu === 'game-play' ? 'active' : ''}`}>
                        <a href="#!" onClick={() => toggleSubmenu('game-play')}><p>Game Play</p></a>
                        {activeMenu === 'game-play' && (
                            <ul className="submenu">
                                <li><Link to="/game-play/game-play-calc" onClick={toggleSidebar}>Game Play Calculator</Link></li>
                            </ul>
                        )}
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;
