import React from "react";
import { Link } from "react-router-dom";

import navigationBg from '../assets/Navigation.svg'

function Navigation() {
    return (
        <div className="navigation-div">
            <div>notAlone</div>
            <div>
            <Link to="/slides/maps">Maps </Link>
            <Link to="/slides/al">Al </Link>
            <Link to="/slides/sos">SOS </Link>
            </div>
        </div>
    );
}

export default Navigation;