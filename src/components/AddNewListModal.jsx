import React, { useRef } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

import { FloatingLabel } from "react-bootstrap";

export default function AddNewListModal({
  showModal,
  toggleModal,
  addNewTodoList,
}) {
  const modalInputRef = useRef();
  const onSaveListClicked = () => {
    addNewTodoList(modalInputRef.current.value);
  };

  return (
    <>
      <Modal show={showModal} onHide={toggleModal}>
        <Modal.Header closeButton>
          <Modal.Title>Name your new list below</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FloatingLabel controlId="floatingInput" label="List Name">
            <Form.Control type="text" placeholder="" ref={modalInputRef} />
          </FloatingLabel>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={toggleModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={onSaveListClicked}>
            Save List
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
