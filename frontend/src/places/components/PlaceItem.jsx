import React, { useState, useContext } from "react";
import "./PlaceItem.css";
import Button from "../../shared/components/UIelements/Button";
import Modal from "../../shared/components/UIelements/Modal";
import Map from "../../shared/components/UIelements/Map";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIelements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIelements/LoadingSpinner";

const PlaceItem = (props) => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const openMap = () => setShowMap(true);
  const closeMap = () => setShowMap(false);

  const showDeleteWarnHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        `http://localhost:5000/api/places/${props.id}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + auth.token // Only if you're using JWTs
        }
      );
      props.onDelete(props.id); // Notify parent to update UI
    } catch (err) {
      // Error will show in ErrorModal
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />

      <Modal
        show={showMap}
        onCancel={closeMap}
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item___modal-footer"
        footer={<Button onClick={closeMap}>Close</Button>}
      >
        <Map center={props.coordinates} zoom={14} />
      </Modal>

      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>Cancel</Button>
            <Button danger onClick={confirmDeleteHandler}>DELETE</Button>
          </React.Fragment>
        }
      >
        <p>Do you want to proceed and delete this place? Please note that this action cannot be undone!</p>
      </Modal>

      <li className="place-item">
        {isLoading && <LoadingSpinner asOverlay />}
        <div className="place-item-container">
          <div className="place-item__image">
            <img src={`http://localhost:5000/${props.image}`} alt={props.title} />
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openMap}> View On Map</Button>
            {auth.userId===props.creatorId && (<Button to={`/places/${props.id}`}>Edit</Button>)}
            {auth.userId===props.creatorId && (<Button danger onClick={showDeleteWarnHandler}>Delete</Button>)}
          </div>
        </div>
      </li>
    </React.Fragment>
  );
};

export default PlaceItem;
