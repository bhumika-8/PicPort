import React,{useContext} from "react";
import { NavLink } from "react-router-dom";
import "./NavLinks.css";
import { AuthContext } from "../../context/auth-context";
import { FaCamera } from "react-icons/fa";
const NavLinks = props=>{
    const auth=useContext(AuthContext)


    return <ul className="nav-links">
        <li>
            <NavLink to="/">All Users</NavLink>
      </li>
       {auth.isLogged&& (<li>
            <NavLink to={`/${auth.userId}/places`}>My Places</NavLink>
      </li>
    )}
       {auth.isLogged &&(<li>
            <NavLink to="/places/new">Add Place</NavLink>
      </li>
       )}
       {!auth.isLogged&& (<li>
            <NavLink to="/auth">Authenticate</NavLink>
      </li>
       )}
       {auth.isLogged && (
  <li>
    <button onClick={auth.logout}>LogOut</button>
  </li>
)}


    </ul>
}

export default NavLinks;