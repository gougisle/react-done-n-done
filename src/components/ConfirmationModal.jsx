import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function ConfirmationModal({
  showConfirmModal,
  toggleConfirmModal,
  title,
  content,
  onConfirm,
  onCancel,
}) {
  return (
    <>
      <Modal
        show={showConfirmModal}
        onHide={toggleConfirmModal}
        className="text-center"
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <h2>{title}</h2>
          <div>{content}</div>
        </Modal.Body>

        <Modal.Footer className="justify-content-center">
          <Button variant="warning" onClick={onConfirm} className="px-3">
            Yes!
          </Button>
          <Button variant="secondary" onClick={onCancel} className="px-3">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
