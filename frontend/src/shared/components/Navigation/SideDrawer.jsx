import React from "react";
import ReactDOM from "react-dom";
import "./SideDrawer.css";

const SideDrawer = (props) => {
  const content = (
    <aside className={`side-drawer ${props.show ? 'open' : ''}`} onClick={props.onClick}>
      <div className="drawer-content">
      {props.children}
      </div>
    </aside>
  );

  return ReactDOM.createPortal(content, document.getElementById("drawer-hook"));
};

export default SideDrawer;
