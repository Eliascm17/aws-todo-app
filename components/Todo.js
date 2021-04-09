import { useState } from "react";
import { API } from "aws-amplify";
import { updateTodo as UpdateTodo } from "../src/graphql/mutations";
import { deleteTodo as DeleteTodo } from "../src/graphql/mutations";

const Todo = ({ completed, name, description, className, id, editing }) => {
  const [finished, setFinished] = useState(completed);
  const [deleteButtonClicked, setDeleteButtonClicked] = useState(false);

  const updateTodoCompleted = async (id) => {
    console.log(id, !finished);
    try {
      await API.graphql({
        query: UpdateTodo,
        variables: {
          input: { id: id, completed: !finished },
        },
      });
      console.log("note successfully updated!");
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
      console.log("successfully deleted note!");
    } catch (err) {
      console.log({ err });
    }
  };

  return (
    <div className={className}>
      <div className="my-auto mx-4">
        {finished ? (
          <button
            onClick={() => {
              setFinished(false);
              updateTodoCompleted(id);
            }}
          >
            <svg
              width="30"
              height="30"
              viewBox="0 0 30 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="15"
                cy="15"
                r="13"
                fill="#FAFAFA"
                stroke="#61A0FF"
                stroke-width="4"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M21.6947 10.2928C21.8822 10.4803 21.9875 10.7346 21.9875 10.9998C21.9875 11.265 21.8822 11.5193 21.6947 11.7068L13.6947 19.7068C13.5072 19.8943 13.2529 19.9996 12.9877 19.9996C12.7225 19.9996 12.4682 19.8943 12.2807 19.7068L8.28071 15.7068C8.09855 15.5182 7.99776 15.2656 8.00004 15.0034C8.00232 14.7412 8.10749 14.4904 8.29289 14.305C8.4783 14.1196 8.72911 14.0144 8.99131 14.0121C9.25351 14.0098 9.50611 14.1106 9.69471 14.2928L12.9877 17.5858L20.2807 10.2928C20.4682 10.1053 20.7225 10 20.9877 10C21.2529 10 21.5072 10.1053 21.6947 10.2928Z"
                fill="#61A0FF"
              />
            </svg>
          </button>
        ) : (
          <button
            onClick={() => {
              setFinished(true);
              updateTodoCompleted(id);
            }}
          >
            <svg
              width="30"
              height="30"
              viewBox="0 0 30 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="15"
                cy="15"
                r="13"
                fill="#FAFAFA"
                stroke="#61A0FF"
                stroke-width="4"
              />
            </svg>
          </button>
        )}
      </div>
      <div className="flex my-auto mr-6 w-full justify-between">
        {finished ? (
          <div className="flex flex-col">
            <div className="text-lg text-gray-700 line-through">{name}</div>
            <div className="text-sm text-gray-700 line-through">
              {description}
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="text-lg text-gray-700">{name}</div>
            <div className="text-sm text-gray-700">{description}</div>
          </div>
        )}
        {editing ? (
          <button
            className="flex-end"
            onClick={() => {
              setDeleteButtonClicked(true);
            }}
          >
            <svg
              className="w-8 h-8 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </button>
        ) : null}
        {deleteButtonClicked ? (
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
                        Delte Todo
                      </h3>
                      <h3
                        class="text-sm leading-6 font-medium text-gray-700"
                        id="modal-title"
                      >
                        Are you sure you want to delete this todo?
                      </h3>
                    </div>
                  </div>
                </div>
                <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={() => {
                      setDeleteButtonClicked(false);
                      deleteTodo(id);
                    }}
                    class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-400 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDeleteButtonClicked(false);
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
    </div>
  );
};

export default Todo;
