import React from "react"
import { Button } from "react-bootstrap"
import { Link } from "react-router";

function Maps(props) {
    const { handleTabClick } = props;
    return (
        <>
        Maps
        <Button><Link to={'/sos'} onClick={handleTabClick}>Click</Link></Button>
        </>
    )
}

export { Maps }