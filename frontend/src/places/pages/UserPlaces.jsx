import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PlaceList from '../components/PlaceList';
import { useHttpClient } from '../../shared/hooks/http-hook';
import LoadingSpinner from '../../shared/components/UIelements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIelements/ErrorModal';

const UserPlaces = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPlaces, setLoadedPlaces] = useState();
  const userId = useParams().userId;
const deletePlaceHandler = (deletedPlaceId) => {
  setLoadedPlaces(prevPlaces =>
    prevPlaces.filter(place => place.id.toString() !== deletedPlaceId.toString())
  );
};


  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/places/user/${userId}`
        );
        setLoadedPlaces(responseData.places);
      } catch (err) {
        // error handled by ErrorModal
      }
    };

    fetchPlaces();
  }, [sendRequest, userId]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <div className="center"><LoadingSpinner /></div>}
      {!isLoading && loadedPlaces && <PlaceList items={loadedPlaces} onDelete={deletePlaceHandler}/>}
    </React.Fragment>
  );
};

export default UserPlaces;
