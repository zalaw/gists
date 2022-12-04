import React, { useRef } from "react";

function Modal(props) {
  const modalRef = useRef(null);

  const handleOutsideClick = (e) => {
    if (!modalRef.current.contains(e.target)) props.handleCloseModal();
  };

  return (
    <div className="modal-container" onClick={(e) => handleOutsideClick(e)}>
      <div ref={modalRef} className="modal">
        <pre>{props.content}</pre>
      </div>
    </div>
  );
}

export default Modal;
