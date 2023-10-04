import React, { useState, useRef } from "react";
import {
  Container,
  Row,
  Col,
  InputGroup,
  Form,
  Button,
  Dropdown,
  Modal,
  FloatingLabel,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import SingleToDo from "../components/SingleToDo";
import AddNewListModal from "../components/AddNewListModal";
import ConfirmationModal from "../components/ConfirmationModal";
import { toast } from "react-toastify";
import "./todolistview.scss";

const TodoListView = () => {
  const [todoLists, setTodoLists] = useState([
    {
      id: 1,
      label: "Camping",
      todoArray: [
        {
          id: 1,
          content: "Pack for the camping trip",
          isUpdate: false,
          isComplete: false,
        },
      ],
    },
    {
      id: 2,
      label: "Grocery",
      todoArray: [
        {
          id: 1,
          content: "Buy steak and potatoes",
          isUpdate: false,
          isComplete: false,
        },
      ],
    },
    {
      id: 3,
      label: "Somthing Else",
      todoArray: [
        {
          id: 1,
          content: "Do something else",
          isUpdate: false,
          isComplete: false,
        },
      ],
    },
  ]);
  const [curentListIndex, setCurrentListIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfrimModal] = useState(false);
  const todoInputRef = useRef();
  const DEFAULT_TODO_ITEM = {
    id: generateUID(),
    content: "",
    isUpdate: false,
    isComplete: false,
    timeStamp: new Date(),
  };

  const DEFAUL_TODO_LIST = {
    id: generateUID(),
    label: "",
    todoArray: [],
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };
  const toggleConfirmModal = () => {
    setShowConfrimModal(!showConfirmModal);
  };

  //#region ToDo Functionality
  //DONE

  /*
    Refactoring Notes
    - Select the current focused list
    - create a new array of todo items from within that list
    - Edit the specified todo item within that list
    - Replace the existing todo items array in the current focused list
  */

  const addNewTodoList = (listName) => {
    if (listName.length < 1) {
      toast.error("List names must be at least 1 character long");
    } else {
      setTodoLists((prevState) => {
        let ns = [...prevState];
        ns.push({ ...DEFAUL_TODO_LIST, label: listName });
        return ns;
      });
      setShowModal(false);
    }
  };
  const addNewTodoItem = () => {
    if (todoInputRef.current.value.length < 1) {
      toast.error("Notes must be at least 1 characters long.");
    } else {
      //const timeStamp = new Date();
      const newTodoItemId = generateUID();

      let newArrayOfTodoItems = todoLists[curentListIndex].todoArray;

      newArrayOfTodoItems.unshift({
        ...DEFAULT_TODO_ITEM,
        id: newTodoItemId,
        content: todoInputRef.current.value,
      });

      setTodoLists((prevState) => {
        let newTodoLists = [...prevState];
        newTodoLists[curentListIndex].todoArray = newArrayOfTodoItems;
        return newTodoLists;
      });
      todoInputRef.current.value = "";
    }
  };

  const triggerTodoItemEdit = (todoItemId) => {
    let newArrayOfTodoItems = todoLists[curentListIndex].todoArray;
    //create function to select index of specified item based on Id of the TodoItem and the index of the current list beingh displayed
    const selectedTodoIdx = getIndexOfTodoItemById(
      todoItemId,
      newArrayOfTodoItems
    );

    if (selectedTodoIdx >= 0) {
      setTodoLists((prevState) => {
        let newTodoLists = [...prevState];
        newTodoLists[curentListIndex].todoArray[
          selectedTodoIdx
        ].isUpdate = true;

        return newTodoLists;
      });
    } else {
      console.log("triggerTodoItemEdit : something went wrong");
    }
  };

  const handleTodoItemEdit = (todoItemId, newTodoContent) => {
    let newArrayOfTodoItems = todoLists[curentListIndex].todoArray;

    const selectedTodoIdx = getIndexOfTodoItemById(
      todoItemId,
      newArrayOfTodoItems
    );

    if (selectedTodoIdx >= 0) {
      setTodoLists((prevState) => {
        let newTodoLists = [...prevState];
        newTodoLists[curentListIndex].todoArray[selectedTodoIdx].content =
          newTodoContent;
        newTodoLists[curentListIndex].todoArray[
          selectedTodoIdx
        ].isUpdate = false;
        return newTodoLists;
      });
    } else {
      console.error("handleTodoItemEdit: Something went wrong");
    }
  };

  const handleTodoItemRemoval = (todoItemId) => {
    let newArrayOfTodoItems = todoLists[curentListIndex].todoArray.filter(
      (item) => item.id !== todoItemId
    );

    setTodoLists((prevState) => {
      let ns = [...prevState];
      ns[curentListIndex].todoArray = newArrayOfTodoItems;
      return ns;
    });
  };

  const renderTodoItemsByCompleteStatus = (isCompleted) => {
    const selectedList = todoLists[curentListIndex];
    let resultingArrayOfItems = [];

    if (isCompleted) {
      const arrayOfCompletedItems = selectedList.todoArray.filter(
        (todo) => todo.isComplete === true
      );
      resultingArrayOfItems = arrayOfCompletedItems.map(mapToDoItems);
    } else {
      const arrayOfUncompletedItems = selectedList.todoArray.filter(
        (todo) => todo.isComplete === false
      );
      resultingArrayOfItems = arrayOfUncompletedItems.map(mapToDoItems);
    }

    //need condition to return array of comlete vs not complete

    return resultingArrayOfItems;
  };

  const addToCompleted = (todoItemId) => {
    let newArrayOfTodoItems = todoLists[curentListIndex].todoArray;

    const selectedTodoIdx = getIndexOfTodoItemById(
      todoItemId,
      newArrayOfTodoItems
    );
    setTodoLists((prevState) => {
      let ns = [...prevState];
      ns[curentListIndex].todoArray[selectedTodoIdx].isComplete = true;
      return ns;
    });
  };

  const handleUndo = (todoItemId) => {
    let newArrayOfTodoItems = todoLists[curentListIndex].todoArray;

    const selectedTodoIdx = getIndexOfTodoItemById(
      todoItemId,
      newArrayOfTodoItems
    );
    setTodoLists((prevState) => {
      let ns = [...prevState];
      ns[curentListIndex].todoArray[selectedTodoIdx].isComplete = false;
      return ns;
    });
  };

  const onDeleteList = () => {
    setTodoLists((prevState) => {
      let newArrayOfLists = [...prevState];
      newArrayOfLists.splice(curentListIndex, 1);
      return newArrayOfLists;
    });
  };
  //#endregion

  //#region Utilities
  const onEnterKeyPress = (e) => {
    if (e.key === "Enter") addNewTodoItem();
  };

  const getIndexOfCurrentList = (listId) => {
    return todoLists.findIndex((list) => list.id === listId);
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

  const handleListSelected = (id) => {
    //Everytime we change the list we set the index and hold that in state rather than the Id, becasue we have the
    //id as a parameter here and
    const currentlySelectedListIndex = getIndexOfCurrentList(id);
    setCurrentListIndex(currentlySelectedListIndex);
  };

  const mapToDoItems = (note) => {
    return (
      <SingleToDo
        key={"TodoItem-" + note.id}
        note={note}
        handleTodoItemEdit={handleTodoItemEdit}
        triggerTodoItemEdit={triggerTodoItemEdit}
        handleTodoItemRemoval={handleTodoItemRemoval}
        addToCompleted={addToCompleted}
        handleUndo={handleUndo}
        isComplete={note.isComplete}
      ></SingleToDo>
    );
  };

  return (
    <>
      <Container className="d-flex justify-content-center">
        <div className="w-100">
          <Row>
            <Col>
              <InputGroup className="justify-content-center mt-2">
                {" "}
                <Dropdown>
                  {/* <Dropdown.Toggle
                    variant="warning"
                    id="dropdown-basic"
                    disabled={todoLists.length < 1}
                  >
                    View Lists
                  </Dropdown.Toggle> */}
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
              </InputGroup>{" "}
            </Col>
          </Row>

          <Row className="mt-3 mb-3">
            <Col>
              <InputGroup className="w-100 justify-content-center">
                <Button variant="dark" onClick={toggleModal}>
                  Add New List
                </Button>
                <Form.Control
                  id="todo-input"
                  ref={todoInputRef}
                  placeholder="Ex. 'Pick up groceries at 3pm'"
                  onKeyDown={onEnterKeyPress}
                  style={{ maxWidth: "500px" }}
                />{" "}
                <Button
                  disabled={todoLists.length < 1}
                  size="lg"
                  variant="primary"
                  onClick={addNewTodoItem}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </Button>
              </InputGroup>
            </Col>
          </Row>

          {todoLists.length < 1 ? (
            <Row>
              <Col style={{ maxHeight: "70vh", overflowY: "auto" }}>
                Yow have no lists...
              </Col>
            </Row>
          ) : (
            <>
              <Row className="w-100 justify-content-center">
                <div className="todo-list-horizontal-container">
                  {todoLists.map((list, index) => {
                    return (
                      <button
                        key={list.id}
                        className="todo-list-button"
                        variant="outline-dark"
                        active={index === curentListIndex}
                        onClick={(e) => {
                          handleListSelected(list.id);
                        }}
                      >
                        {list.label}
                      </button>
                    );
                  })}
                </div>{" "}
              </Row>

              {/* </Row> */}
              <h4>
                <i>
                  {todoLists[curentListIndex] &&
                    todoLists[curentListIndex].label}
                </i>
                <Button
                  className="py-1 px-2 ms-2"
                  size="xs"
                  variant="outline-danger"
                  onClick={onDeleteList}
                >
                  <FontAwesomeIcon icon={faTrashAlt} />
                </Button>
              </h4>
              <Row>
                <Col style={{ maxHeight: "70vh", overflowY: "auto" }}>
                  <div>{renderTodoItemsByCompleteStatus(false)}</div>
                </Col>
              </Row>
              <Row>
                <hr />

                <Col style={{ maxHeight: "70vh", overflowY: "auto" }}>
                  {" "}
                  <div>{renderTodoItemsByCompleteStatus(true)}</div>
                </Col>
              </Row>
            </>
          )}
        </div>
      </Container>

      <AddNewListModal
        showModal={showModal}
        toggleModal={toggleModal}
        addNewTodoList={addNewTodoList}
      ></AddNewListModal>
      <ConfirmationModal
        showConfirmModal={showConfirmModal}
        title={"Are you sure?"}
        content={
          "This is your last todo list, are you sure that you want to delete it?"
        }
        onConfirm={onDeleteList}
        onCancel={toggleConfirmModal}
      />
    </>
  );
};

export default TodoListView;
