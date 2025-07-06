import React from "react";
import "./PlaceList.css";
import PlaceItem from "./PlaceItem";
import Button from "../../shared/components/UIelements/Button";
const PlaceList = props =>{
    if (props.items.length===0){
        return <div className="place-list center">
            <h3>No places found</h3>
            <Button to="/places/new">Share Place</Button>
        </div>
    }


    return <ul className="place-list">
        {props.items.map(place => <PlaceItem
  key={place.id}
  id={place.id}
  image={place.image}
  title={place.title}
  description={place.description}
  address={place.address}
  coordinates={place.location}
  creatorId={place.creator}
   onDelete={props.onDelete}
/>
)}
    </ul>;
}

export default PlaceList;