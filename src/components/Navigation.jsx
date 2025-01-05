import React from "react";
import { Link } from "react-router-dom";

import navigationBg from '../assets/Navigation.svg'

function Navigation() {
    return (
        <div className="navigation-div">
            <div>Navigation Bar</div>
            <div>
            <Link to="/maps">Maps </Link>
            <Link to="/">Al </Link>
            <Link to="/SOS">SOS </Link>
            </div>
        </div>
    );
}

export default Navigation;