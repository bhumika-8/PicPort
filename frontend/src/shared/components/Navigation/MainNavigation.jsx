import React, { useState } from "react";
import { Link } from 'react-router-dom';

import "./MainNavigation.css";
import MainHeader from "./MainHeader";
import NavLinks from "./NavLinks";
import SideDrawer from "./SideDrawer";
import Backdrop from "../UIelements/BackDrop";
import { FaCamera } from "react-icons/fa";
const MainNavigation = props => {
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);
  const OpenDrawer = () => {
    setDrawerIsOpen(true);
  }

  const closeDrawer = () => {
    setDrawerIsOpen(false);
  }
  return (
    <React.Fragment>
      {drawerIsOpen && <Backdrop onClick={closeDrawer} />}
      <SideDrawer show={drawerIsOpen}>
        <nav className="main-navigation__drawer-nav">
          <NavLinks onClick={closeDrawer} />
        </nav>
      </SideDrawer>
      <MainHeader>
        <button className="main-navigation__menu-btn" onClick={OpenDrawer}>
          <span />
          <span />
          <span />
        </button>
        <h1 className="main-navigation__title">
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'inherit', textDecoration: 'none' }}>
            <FaCamera size={24} color="white" />
            <span>PicPort</span>
          </Link>
        </h1>
        <nav className="main-navigation__header-nav">
          <NavLinks />
        </nav>
      </MainHeader>
    </React.Fragment>
  );
};

export default MainNavigation;
