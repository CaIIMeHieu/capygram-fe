import React from "react"
import { Outlet } from "react-router-dom"
import Menu from "../components/Menu/Menu"
import ProgressBar from "@/components/ProgressBar/ProgressBar"
import "../styles/nprogress.css"

const LayoutMenu = () => {
    return (
        <div style={{ display: "flex", position: "relative" }}>
            <ProgressBar/>
            <Menu />
            <Outlet />
        </div>

    )
}
export default LayoutMenu;