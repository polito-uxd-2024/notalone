import React from "react";
import { Link } from "react-router-dom";

import navigationBg from '../assets/Navigation.svg'

function Navigation() {
    return (
        <div className="navigation-div">
            <div>notAlone</div>
            <div>
            <Link to="/maps">Maps </Link>
            <Link to="/">Al </Link>
            <Link to="/sos">SOS </Link>
            </div>
        </div>
    );
}

export default Navigation;