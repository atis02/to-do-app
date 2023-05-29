import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import "./App.css";
import BtnDarkMode from "./btnDarkMode/BtnDarkMode";
const getLocalStorage = (key) => {
  const local = localStorage.getItem(key);
  return JSON.parse(local);
};
const setLocalStorage = (key, value) =>
  localStorage.setItem(key, JSON.stringify(value));

function App() {
  const [inputText, setInputText] = useState("");
  const [tasks, setTasks] = useState([]);

  const handleChange = (event) => setInputText(event.target.value);

  const handleSubmit = () => {
    if (inputText !== "") {
      const newTask = {
        id: nanoid(),
        title: inputText,
        checked: false,
        deleted: false,
      };
      const updatedTasks = [...tasks, newTask];
      setLocalStorage("tasks", updatedTasks);
      setTasks(updatedTasks);
      setInputText("");
    }
  };
  const handleKeySubmit = (event) => event.code === "Enter" && handleSubmit();

  const handleDelete = (taskId) => {
    const changedArray = tasks.map((task) => {
      if (task.id === taskId) {
        task.deleted = true;
        return task;
      }
      return task;
    });
    setTasks(changedArray);
    setTimeout(() => {
      const cleanedArray = tasks.filter((task) => {
        if (!task.deleted) return task;
      });
      setTasks(cleanedArray);
      setLocalStorage("tasks", cleanedArray);
    }, 1000);
  };
  const handleCheck = (taskId) => {
    const updatedArray = tasks.map((task) => {
      if (task.id === taskId) task.checked = !task.checked;
      return task;
    });
    setTasks(updatedArray);
    setLocalStorage("tasks", updatedArray);
  };

  useEffect(() => {
    const localTasks = getLocalStorage("tasks");

    if (localTasks) setTasks(localTasks);
    else setLocalStorage("tasks", tasks);
  }, []);

  return (
    <>
      <BtnDarkMode />

      <div className="wrapper">
        <div className="todo-actions">
          <input
		  	className="todo-bginput"
            type="text"
            value={inputText}
            onChange={handleChange}
            onKeyDown={handleKeySubmit}
          />
          <button className="btn" onClick={handleSubmit}>
            Add task
          </button>
        </div>
        <ol className="todo-list">
          {tasks.map((task, index) => {
            if (!task.checked) {
              return (
                <li
                  key={`task-${index}`}
                  className={`todo-item ${task.deleted && "delete-animation"}`}
                >
                  <span className="todo-span">{task.title}</span>
                  <span className="todo-buttons">
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="btn delete"
                    >
                      X
                    </button>
                    <button
                      onClick={() => handleCheck(task.id)}
                      className="btn check"
                    >
                      Check
                    </button>
                  </span>
                </li>
              );
            }
          })}
          {tasks.map((task, index) => {
            if (task.checked) {
              return (
                <li key={`task-checked-${index}`} className="todo-item checked">
                  <span>{task.title}</span>
                  <span className="todo-buttons">
                    <button
                      className="btn delete"
                      onClick={() => handleDelete(task.id)}
                    >
                      X
                    </button>
                    <button
                      className="btn check"
                      onClick={() => handleCheck(task.id)}
                    >
                      Check
                    </button>
                  </span>
                </li>
              );
            }
          })}
        </ol>
      </div>
    </>
  );
}

export default App;
