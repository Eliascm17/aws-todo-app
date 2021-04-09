import { useState } from "react";
import { API } from "aws-amplify";
import { updateTodo as UpdateTodo } from "../src/graphql/mutations";

const Todo = ({ completed, name, description, className, id }) => {
  const [finished, setFinished] = useState(completed);

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
      <div className="my-auto mr-6">
        {finished ? (
          <>
            <div className="text-lg text-gray-700 line-through">{name}</div>
            <div className="text-sm text-gray-700 line-through">
              {description}
            </div>
          </>
        ) : (
          <>
            <div className="text-lg text-gray-700">{name}</div>
            <div className="text-sm text-gray-700">{description}</div>
          </>
        )}
      </div>
    </div>
  );
};

export default Todo;
