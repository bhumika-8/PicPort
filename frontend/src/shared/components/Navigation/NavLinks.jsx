import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import "./NavLinks.css";
import { AuthContext } from "../../context/auth-context";
const NavLinks = props => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = () =>{
    auth.logout();        
    navigate("/auth");     
    if (props.onClick) props.onClick();
  }

  return <ul className="nav-links">
    <li>
      <NavLink to="/" onClick={props.onClick}>All Users</NavLink>
    </li>
    {auth.isLogged && (<li>
      <NavLink to={`/${auth.userId}/places`} onClick={props.onClick}>My Places</NavLink>
    </li>
    )}
    {auth.isLogged && (<li>
      <NavLink to="/places/new" onClick={props.onClick}>Add Place</NavLink>
    </li>
    )}
    {!auth.isLogged && (<li>
      <NavLink to="/auth" onClick={props.onClick}>Authenticate</NavLink>
    </li>
    )}
    {auth.isLogged && (
      <li>
        <button onClick={handleLogout}>LogOut</button>
      </li>
    )}


  </ul>
}

export default NavLinks;