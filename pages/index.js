import Amplify, { API } from "aws-amplify";
import { useState } from "react";
import { v4 as uuid } from "uuid";
import Todo from "../components/Todo";
import config from "../src/aws-exports";
import {
  createTodo as CreateTodo,
  deleteTodo as DeleteTodo,
} from "../src/graphql/mutations";
import { listTodos as ListTodos } from "../src/graphql/queries";

const CLIENT_ID = uuid();

Amplify.configure(config);

export async function getStaticProps() {
  const todoData = await API.graphql({
    query: ListTodos,
  });

  return {
    props: {
      todos: todoData.data.listTodos.items,
    },
    revalidate: 1, // Every second revalidate static props
  };
}

export default function Home({ todos }) {
  const [listOfTodos, setListOfTodos] = useState(todos);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [todoInput, setTodoInput] = useState("");
  const [description, setDescription] = useState("");

  const createTodo = async (todo, description) => {
    const newTodo = {
      name: todo,
      description,
      clientId: CLIENT_ID,
      completed: false,
      id: uuid(),
    };

    try {
      await API.graphql({
        query: CreateTodo,
        variables: { input: newTodo },
      });

      setListOfTodos((list) => [...list, { ...newTodo }]);

      console.log("successfully created note!");
    } catch (err) {
      console.log("error: ", err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await API.graphql({
        query: DeleteTodo,
        variables: { input: { id } },
      });

      const index = listOfTodos.findIndex((t) => t.id === id);
      const todos = [
        ...listOfTodos.slice(0, index),
        ...listOfTodos.slice(index + 1),
      ];
      setListOfTodos(todos);

      console.log("successfully deleted note!");
    } catch (err) {
      console.log({ err });
    }
  };

  return (
    <div className="flex flex-col max-w-4xl mx-auto justify-center">
      <div className="text-gray-800 text-6xl my-10 text-center">
        Next.js + AWS Amplify + TailwindCSS Todo App
      </div>
      <div className="flex flex-col max-w-md min-w-full mx-auto justify-center">
        <div className="flex mx-auto mb-2 max-w-2xl w-full justify-end align-end">
          <button
            className="hover:bg-blue-600 active:bg-blue-600 bg-blue-400 rounded-md w-40 h-11 text-white text-xl justify-center"
            onClick={() => {
              setShowModal(true);
            }}
          >
            <div className="flex justify-center">
              Add Todo
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mt-1.5 ml-2"
              >
                <path
                  fillRule="evenodd"
                  clip-rule="evenodd"
                  d="M8 0C8.3031 0 8.5938 0.120408 8.80812 0.334735C9.02245 0.549062 9.14286 0.839753 9.14286 1.14286V6.85714H14.8571C15.1602 6.85714 15.4509 6.97755 15.6653 7.19188C15.8796 7.40621 16 7.6969 16 8C16 8.3031 15.8796 8.5938 15.6653 8.80812C15.4509 9.02245 15.1602 9.14286 14.8571 9.14286H9.14286V14.8571C9.14286 15.1602 9.02245 15.4509 8.80812 15.6653C8.5938 15.8796 8.3031 16 8 16C7.6969 16 7.40621 15.8796 7.19188 15.6653C6.97755 15.4509 6.85714 15.1602 6.85714 14.8571V9.14286H1.14286C0.839753 9.14286 0.549062 9.02245 0.334735 8.80812C0.120408 8.5938 0 8.3031 0 8C0 7.6969 0.120408 7.40621 0.334735 7.19188C0.549062 6.97755 0.839753 6.85714 1.14286 6.85714H6.85714V1.14286C6.85714 0.839753 6.97755 0.549062 7.19188 0.334735C7.40621 0.120408 7.6969 0 8 0Z"
                  fill="white"
                />
              </svg>
            </div>
          </button>
          <button
            className="w-11 h-11 ml-2 hover:bg-yellow-400 active:bg-yellow-400 bg-yellow-300 rounded-md w-3 h-5 text-white text-xl justify-center"
            onClick={() => {
              setEditing(!editing);
            }}
          >
            <div>
              <svg
                className="w-6 h-6 text-gray-900 mx-auto flex-shrink-0 flex items-center justify-center"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                ></path>
              </svg>
            </div>
          </button>
        </div>
        <div className="flex flex-col mx-auto my-4 min-w-full mb-10">
          {listOfTodos.map((todo) => (
            <Todo
              className="flex w-2xl w-full max-w-2xl mx-auto my-2 h-20 bg-white rounded-md shadow-md"
              editing={editing}
              key={todo.id}
              onClickDelete={() => {
                deleteTodo(todo.id);
              }}
              {...todo}
            />
          ))}
        </div>
      </div>
      {showModal ? (
        <div
          class="fixed z-10 inset-0 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
            ></div>

            <span
              class="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="sm:flex">
                  <div class="mt-3 text-center sm:mt-0 sm:mx-2 sm:text-left w-full">
                    <h3
                      class="text-lg leading-6 font-medium text-gray-900"
                      id="modal-title"
                    >
                      Create Todo
                    </h3>
                    <div>
                      <input
                        type="text"
                        placeholder="Enter a new Todo"
                        name="todo"
                        id="todo"
                        value={todoInput}
                        onChange={(e) => setTodoInput(e.target.value)}
                        class="mt-2 pl-2 py-2 text-4xl focus:ring-indigo-500 ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      ></input>
                      <textarea
                        id="description"
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="3"
                        class="shadow-sm pl-2 py-2 focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full text-sm border-gray-300 rounded-md"
                        placeholder="description"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    createTodo(todoInput, description);
                    setDescription("");
                    setTodoInput("");
                  }}
                  class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-400 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Add Todo
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                  }}
                  class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
