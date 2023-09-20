import React, { useState } from "react";
import { Card, Row, Col, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPenToSquare,
  faFloppyDisk,
  faCheck,
  faRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import "./singletodo.scss";

const SingleToDo = ({
  note,
  handleTodoItemEdit,
  triggerTodoItemEdit,
  handleNoteRemoval,
  addToCompleted,
  isComplete,
  handleUndo,
}) => {
  const [input, setInput] = useState(note.content);

  return (
    <Card
      border={isComplete && "success"}
      className={
        isComplete
          ? "bg-lightyarn my-2 d-flex justify-content-center"
          : " d-flex justify-content-center my-2"
      }
    >
      <Row className="align-items-center">
        {!isComplete && (
          <Col xs={3} sm={2}>
            <button
              type="button"
              variant="outline-success"
              onClick={(e) => addToCompleted(note.id)}
              className="todo-button complete"
              style={{ width: "100%" }}
            >
              <FontAwesomeIcon icon={faCheck} />
            </button>
          </Col>
        )}
        <Col className="d-flex align-items-center gap-2">
          {note.isUpdate ? (
            <Form.Control
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
              }}
              //ref={internalTodoInputRef}
            />
          ) : (
            <>
              <Card.Text className={isComplete ? "ms-4" : "ms-1"}>
                {note.content}
              </Card.Text>
            </>
          )}
        </Col>

        {!isComplete ? (
          <Col xs={3} className="d-flex justify-content-end ">
            <div style={{ width: "100%" }}>
              {" "}
              {note.isUpdate ? (
                <button
                  type="button"
                  onClick={(e) => {
                    handleTodoItemEdit(note.id, input);
                  }}
                  className="todo-button save"
                  style={{ width: "100%" }}
                >
                  <FontAwesomeIcon icon={faFloppyDisk} />
                </button>
              ) : (
                <>
                  {" "}
                  <button
                    type="button"
                    onClick={(e) => {
                      triggerTodoItemEdit(note.id);
                    }}
                    className="todo-button edit"
                    style={{ width: "50%" }}
                  >
                    <FontAwesomeIcon icon={faPenToSquare} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      handleNoteRemoval(note.id, e);
                    }}
                    className="todo-button delete"
                    style={{ width: "50%" }}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </>
              )}
            </div>
          </Col>
        ) : (
          <Col xs={3} className="d-flex  justify-content-end ">
            <div style={{ width: "100%" }}>
              {" "}
              <button
                type="button"
                onClick={(e) => {
                  handleUndo(note.id);
                }}
                className="todo-button save"
                style={{ width: "100%" }}
              >
                <FontAwesomeIcon icon={faRotateLeft} />
              </button>
            </div>
          </Col>
        )}
      </Row>
    </Card>
  );
};

export default SingleToDo;
