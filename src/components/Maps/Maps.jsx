import React from "react"
import { Button } from "react-bootstrap"
import { Link } from "react-router";

function Maps(props) {
    const { handleTabClick } = props;
    return (
        <>
        Maps
        <Button><div onClick={(e) => handleTabClick(e, 2)}>Click</div></Button>
        </>
    )
}

export { Maps }