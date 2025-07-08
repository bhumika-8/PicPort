import React from 'react';
import './UserItem.css';
import { Link } from "react-router-dom";
const UserItem = props => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    return (
        <li className='user-item'>
            <Link to={`/${props.id}/places`}>
                <div className="user-item__content">

                    <div className="user-item__image">
                        <img src={`${props.image}`} alt={props.name} />
                    </div>
                    <div className="user-item__info">
                        <h2>{props.name}</h2>
                        <h3>{props.placeCount}
                            {props.placeCount === 1 ? ' Place' : ' Places'}
                        </h3>
                    </div>
                </div>
            </Link>
        </li>
    )

};

export default UserItem;