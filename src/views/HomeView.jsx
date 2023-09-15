import React, { useState } from "react";
import { Container, Row, Col, InputGroup, Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import SingleToDo from "../components/SingleToDo";

const HomeView = () => {
  const [notesArray, setNotesArray] = useState([
    // { id: 0, content: "have a great day!" },
  ]);
  const [newNote, setNewNote] = useState("");
  const [completedList, setCompletedList] = useState([]);

  const addNewNote = () => {
    if (newNote.length < 1) {
      alert(
        "Sorry: Notes must be at least 1 characters long, please re-type and try again"
      );
    } else {
      const timeStamp = new Date();
      const newNoteId = notesArray.length + 1;
      setNotesArray((prevState) => {
        let notesArray = [...prevState];
        notesArray.unshift({
          id: newNoteId,
          content: newNote,
          isUpdate: false,
          timeStamp: timeStamp,
        });

        return notesArray;
      });

      setNewNote("");
    }
  };

  const handleNoteRemoval = (id, event) => {
    console.log(event);
    const newArray = notesArray.filter((item) => item.id !== id);
    setNotesArray(newArray);
  };

  const triggerNoteUpdate = (id) => {
    const selectedNoteIdx = notesArray.findIndex((item) => item.id === id);
    if (selectedNoteIdx >= 0) {
      setNotesArray((prevState) => {
        let ns = [...prevState];
        ns[selectedNoteIdx].isUpdate = true;
        return ns;
      });
    } else {
      console.log("triggerNoteUpdate : something went wrong");
    }
  };

  const saveUpdatedNote = (id) => {
    const selectedNoteIdx = notesArray.findIndex((item) => item.id === id);
    if (selectedNoteIdx >= 0) {
      setNotesArray((prevState) => {
        let ns = [...prevState];
        ns[selectedNoteIdx].isUpdate = false;
        ns[selectedNoteIdx].timeStamp = new Date();
        return ns;
      });
    } else {
      console.log("triggerNoteUpdate : something went wrong");
    }
  };

  const handleNoteUpdate = (id, event) => {
    const selectedNoteId = id;
    const textValue = event.target.value;

    const idxToEdit = notesArray.findIndex(
      (item) => item.id === selectedNoteId
    );
    console.log("NOTE Index for edit: ", idxToEdit);
    if (idxToEdit >= 0) {
      setNotesArray((prevState) => {
        const newStateArr = [...prevState];

        newStateArr[idxToEdit].content = textValue;

        return newStateArr;
      });
    } else {
      console.log("You are not accessing the index correctly");
    }
  };

  const addToCompleted = (id) => {
    setCompletedList((prevState) => {
      let ns = [...prevState];
      ns.push(id);
      return ns;
    });
  };

  const handleUndo = (id) => {
    setCompletedList((prevState) => {
      let ns = [...prevState];
      const idxToRemove = ns.findIndex((value) => value === id);

      ns.splice(idxToRemove, 1);
      return ns;
    });
  };

  const mapCompleted = (note) => {
    if (completedList.includes(note.id))
      return (
        <SingleToDo
          key={"Todo-" + note.id}
          note={note}
          handleNoteUpdate={handleNoteUpdate}
          saveUpdatedNote={saveUpdatedNote}
          triggerNoteUpdate={triggerNoteUpdate}
          handleNoteRemoval={handleNoteRemoval}
          addToCompleted={addToCompleted}
          handleUndo={handleUndo}
          isComplete={true}
        ></SingleToDo>
      );
  };

  const mapToDoItems = (note) => {
    if (!completedList.includes(note.id))
      return (
        <SingleToDo
          key={"Completed-" + note.id}
          note={note}
          handleNoteUpdate={handleNoteUpdate}
          saveUpdatedNote={saveUpdatedNote}
          triggerNoteUpdate={triggerNoteUpdate}
          handleNoteRemoval={handleNoteRemoval}
          addToCompleted={addToCompleted}
          handleUndo={handleUndo}
          isComplete={false}
        ></SingleToDo>
      );
  };
  return (
    <>
      <Container className="d-flex justify-content-center">
        <div className="w-100" style={{ maxWidth: "900px" }}>
          <Row className="mt-4 mb-2">
            <Col>
              <InputGroup className="mb-3">
                <Form.Control
                  placeholder="Ex. 'Pick up groceries at 3pm'"
                  value={newNote}
                  onChange={(e) => {
                    setNewNote(e.target.value);
                  }}
                />
                <Button size="lg" variant="primary" onClick={addNewNote}>
                  <FontAwesomeIcon icon={faPlus} /> Note
                </Button>
              </InputGroup>
            </Col>
          </Row>
          <Row>
            <Col style={{ maxHeight: "70vh", overflowY: "auto" }}>
              <div>
                {notesArray.length > 0 ? (
                  notesArray.map(mapToDoItems)
                ) : (
                  <h3 className="text-muted text-center">
                    <i>Add some notes...</i>
                  </h3>
                )}
              </div>
            </Col>
          </Row>
          <Row>
            <h4>Completed</h4>
            <Col>
              {" "}
              <div>
                {completedList.length > 0 && notesArray.map(mapCompleted)}
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </>
  );
};

export default HomeView;
