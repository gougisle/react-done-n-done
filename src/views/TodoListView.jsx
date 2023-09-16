import React, { useState, useRef } from "react";
import {
  Container,
  Row,
  Col,
  InputGroup,
  Form,
  Button,
  Dropdown,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import SingleToDo from "../components/SingleToDo";
import { toast } from "react-toastify";

const TodoListView = () => {
  function generateUID() {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 7);
    return timestamp + randomStr;
  }

  const uid = generateUID();
  console.log(uid);

  const [todoLists, setTodoLists] = useState([
    {
      id: 1,
      label: "Camping",
      todoArray: [
        { id: 1, content: "back for the campling trip", isUpdate: false },
      ],
    },
    {
      id: 2,
      label: "Grocery",
      todoArray: [
        { id: 1, content: "By steack and potatoes", isUpdate: false },
      ],
    },
    {
      id: 3,
      label: "Somthing Else",
      todoArray: [{ id: 1, content: "Do something else", isUpdate: false }],
    },
  ]);
  const [selectedListId, setSelectedListId] = useState(1);
  const [notesArray, setNotesArray] = useState([]);

  const [completedList, setCompletedList] = useState([]);
  const todoInputRef = useRef();

  const getIndexOfCurrentList = () => {
    return todoLists.findIndex((item) => item.id === selectedListId);
  };
  //DONE
  const addNewNote = () => {
    if (todoInputRef.current.value.length < 1) {
      toast.error("Notes must be at least 1 characters long.");
    } else {
      const timeStamp = new Date();
      const newNoteId = generateUID();
      const selectedListIdx = getIndexOfCurrentList();

      let newTodoItems = todoLists[selectedListIdx].todoArray;

      newTodoItems.unshift({
        id: newNoteId,
        content: todoInputRef.current.value,
        isUpdate: false,
        timeStamp: timeStamp,
      });

      setTodoLists((prevState) => {
        let newTodoLists = [...prevState];
        newTodoLists[selectedListIdx].todoArray = newTodoItems;

        return newTodoLists;
      });
    }
  };

  const handleNoteRemoval = (id, event) => {
    event.preventDefault();
    const newTodoArray = todoLists[selectedListId].todoArray.filter(
      (item) => item.id !== id
    );
    const selectedListIdx = getIndexOfCurrentList();

    setTodoLists((prevState) => {
      let newTodoLists = [...prevState];
      newTodoLists[selectedListIdx].todoArray = newTodoArray;

      return newTodoLists;
    });
    // const newArray = notesArray.filter((item) => item.id !== id);
    // setNotesArray(newArray);
  };

  const renderSelectedList = () => {
    const selectedListIdx = todoLists.findIndex(
      (item) => item.id === selectedListId
    );
    const selectedList = todoLists[selectedListIdx];

    return selectedList.todoArray.map(mapToDoItems);
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

  const handleListSelected = (id) => {
    setSelectedListId(id);
  };

  const mapCompleted = (note) => {
    if (completedList.includes(note.id))
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
          isComplete={true}
        ></SingleToDo>
      );
  };

  const mapToDoItems = (note) => {
    if (!completedList.includes(note.id))
      return (
        <SingleToDo
          key={"TodoItem-" + note.id}
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
  // const onEnterKeyPress = (e) => {
  //   if (e.key === "Enter") addNewNote();
  // };

  return (
    <>
      <Container fluid className="d-flex justify-content-center">
        <div className="w-100">
          <Row>
            <Col>
              <Button
                onClick={(e) => {
                  console.log(todoLists);
                }}
              >
                Check State
              </Button>
              <Button variant="secondary">Create New List</Button>
              <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  View Lists
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {todoLists.map((list, index) => {
                    return (
                      <Dropdown.Item
                        key={index}
                        onClick={(e) => {
                          handleListSelected(list.id);
                        }}
                      >
                        {list.label}
                      </Dropdown.Item>
                    );
                  })}
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </Row>
          <Row className="mt-4 mb-2">
            <Col>
              <InputGroup className="mb-3">
                <Form.Control
                  id="todo-input"
                  ref={todoInputRef}
                  placeholder="Ex. 'Pick up groceries at 3pm'"
                  // onChange={(e) => {
                  //   setNewNote(e.target.value);
                  // }}
                  //onKeyDown={onEnterKeyPress}
                />
                <Button size="lg" variant="primary" onClick={addNewNote}>
                  <FontAwesomeIcon icon={faPlus} /> Todo
                </Button>
              </InputGroup>
            </Col>
          </Row>
          <Row>
            <Col style={{ height: "70vh", overflowY: "auto" }}>
              <div>
                {renderSelectedList()}
                {/* {notesArray.length > 0 ? (
                  notesArray.map(mapToDoItems)
                ) : (
                  <h3 className="text-muted text-center">
                    <i>Add some notes...</i>
                  </h3>
                )} */}
              </div>
            </Col>
          </Row>
          <Row>
            <hr />

            <Col style={{ maxHeight: "70vh", overflowY: "auto" }}>
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

export default TodoListView;
