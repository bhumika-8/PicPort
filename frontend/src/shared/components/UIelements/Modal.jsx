import React from "react";
import ReactDOM from "react-dom";
import "./Modal.css";
import Backdrop from "./BackDrop";

const ModalOverlay = (props) => {
  const content = (
    <div className={`modal ${props.className}`} style={props.style}>
      <header className={`modal__header ${props.headerClass}`}>
        <h2>{props.header}</h2>
      </header>
      <form
        onSubmit={props.onSubmit ? props.onSubmit : (event) => event.preventDefault()}
      >
        <div className={`modal__content ${props.contentClass}`}>
          {props.children}
        </div>
        <footer className={`modal__footer ${props.footerClass}`}>
          {props.footer}
        </footer>
      </form>
    </div>
  );

  return ReactDOM.createPortal(content, document.getElementById("modal-hook"));
};

const Modal = (props) => {
  if (!props.show) return null;

  return (
    <>
      <Backdrop onClick={props.onCancel} />
      <ModalOverlay {...props} />
    </>
  );
};

export default Modal;
