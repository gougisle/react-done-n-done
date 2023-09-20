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
  const [todoLists, setTodoLists] = useState([
    {
      id: 1,
      label: "Camping",
      todoArray: [
        { id: 1, content: "Pack for the camping trip", isUpdate: false },
      ],
    },
    {
      id: 2,
      label: "Grocery",
      todoArray: [
        { id: 1, content: "Buy steak and potatoes", isUpdate: false },
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

  //#region ToDo Functionality
  //DONE

  /*
    Refactoring Notes
    - Select the current focused list
    - create a new array of todo items from within that list
    - Edit the specified todo item within that list
    - Replace the existing todo items array in the current focused list
  */
  const addNewNote = () => {
    if (todoInputRef.current.value.length < 1) {
      toast.error("Notes must be at least 1 characters long.");
    } else {
      const timeStamp = new Date();
      const newTodoItemId = generateUID();
      const selectedListIdx = getIndexOfCurrentList();

      let newArrayOfTodoItems = todoLists[selectedListIdx].todoArray;

      newArrayOfTodoItems.unshift({
        id: newTodoItemId,
        content: todoInputRef.current.value,
        isUpdate: false,
        timeStamp: timeStamp,
      });

      setTodoLists((prevState) => {
        let newTodoLists = [...prevState];
        newTodoLists[selectedListIdx].todoArray = newArrayOfTodoItems;

        return newTodoLists;
      });
      todoInputRef.current.value = "";
    }
  };

  const triggerTodoItemEdit = (todoItemId) => {
    const selectedListIdx = getIndexOfCurrentList();
    let newArrayOfTodoItems = todoLists[selectedListIdx].todoArray;

    //create function to select index of specified item based on Id of the TodoItem and the index of the current list beingh displayed
    const selectedTodoIdx = getIndexOfTodoItemById(
      todoItemId,
      newArrayOfTodoItems
    );

    if (selectedTodoIdx >= 0) {
      setTodoLists((prevState) => {
        let newTodoLists = [...prevState];
        newTodoLists[selectedListIdx].todoArray[
          selectedTodoIdx
        ].isUpdate = true;

        return newTodoLists;
      });
    } else {
      console.log("triggerTodoItemEdit : something went wrong");
    }
  };

  const handleTodoItemEdit = (todoItemId, newTodoContent) => {
    const selectedListIdx = getIndexOfCurrentList();

    let newArrayOfTodoItems = todoLists[selectedListIdx].todoArray;

    const selectedTodoIdx = getIndexOfTodoItemById(
      todoItemId,
      newArrayOfTodoItems
    );

    if (selectedTodoIdx >= 0) {
      setTodoLists((prevState) => {
        let newTodoLists = [...prevState];
        newTodoLists[selectedListIdx].todoArray[selectedTodoIdx].content =
          newTodoContent;
        newTodoLists[selectedListIdx].todoArray[
          selectedTodoIdx
        ].isUpdate = false;
        return newTodoLists;
      });
    } else {
      console.error("handleTodoItemEdit: Something went wrong");
    }
  };

  const handleTodoItemRemoval = (todoItemId) => {
    const selectedListIndex = getIndexOfCurrentList();

    let newArrayOfTodoItems = todoLists[selectedListIndex].todoArray.filter(
      (item) => item.id !== todoItemId
    );

    setTodoLists((prevState) => {
      let ns = [...prevState];
      ns[selectedListIndex].todoArray = newArrayOfTodoItems;
      return ns;
    });
  };
  //#endregion

  //#region Utilities
  const onEnterKeyPress = (e) => {
    if (e.key === "Enter") addNewNote();
  };
  const getIndexOfCurrentList = () => {
    return todoLists.findIndex((item) => item.id === selectedListId);
  };

  const getIndexOfTodoItemById = (todoItemId, arrayOfTodoItems) => {
    return arrayOfTodoItems.findIndex((item) => item.id === todoItemId);
  };

  function generateUID() {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 7);
    return timestamp + randomStr;
  }
  //#endregion

  const renderSelectedList = () => {
    const selectedListIdx = getIndexOfCurrentList();
    const selectedList = todoLists[selectedListIdx];

    return selectedList.todoArray.map(mapToDoItems);
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
          handleTodoItemEdit={handleTodoItemEdit}
          triggerTodoItemEdit={triggerTodoItemEdit}
          handleTodoItemRemoval={handleTodoItemRemoval}
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
          handleTodoItemEdit={handleTodoItemEdit}
          triggerTodoItemEdit={triggerTodoItemEdit}
          handleTodoItemRemoval={handleTodoItemRemoval}
          addToCompleted={addToCompleted}
          handleUndo={handleUndo}
          isComplete={false}
        ></SingleToDo>
      );
  };

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
                  onKeyDown={onEnterKeyPress}
                />
                <Button size="lg" variant="primary" onClick={addNewNote}>
                  <FontAwesomeIcon icon={faPlus} /> Todo
                </Button>
              </InputGroup>
            </Col>
          </Row>
          <Row>
            <Col style={{ height: "70vh", overflowY: "auto" }}>
              <div>{renderSelectedList()}</div>
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
