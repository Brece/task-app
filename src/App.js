import React from "react";
import { Overview } from './components/Overview';
import uniqid from 'uniqid';
import './css/main.css';

// Firebase
import { saveTask, loadTasks, deleteTask, clearTasks } from './firebase.js';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      tasks: [],
      input: '',
      edit: false,
      editId: '',
      id: uniqid()
    }
    this.onSubmitTask = this.onSubmitTask.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.resetState = this.resetState.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
  }

  // first initializing for updating the state and 
  componentDidMount() {
    (async () => {
      const tasks = await loadTasks();
      this.setState({...this.state, tasks: tasks});
    })();
  }
  
  handleInput(e) {
    this.setState({ input: e.target.value });
  }

  onSubmitTask(e) {
    e.preventDefault();
    const input = this.state.input;
    
    // edit task -- firebase
    if (this.state.edit) {
      const task = { id: this.state.editId, task: input };

      this.setState((state) => {
        let newTasksArray = state.tasks.map((item) => {
          if (item.id === state.editId) {
            item = task;
          }
          return item;
        });

        return {
          tasks: newTasksArray,
          input: '',
          editId: '',
          id: uniqid(),
          edit: false
        }
      });

      saveTask(task, this.state.edit);
      return;
    }

    // add task -- firebase
    let task = this.state.tasks.find((item) => item.task === input);

    if (input !== '' && task === undefined) {
      task = {
        task: input,
        id: this.state.id
      };

      this.setState((state) => {
        const tasks = [...state.tasks, task];

        return {
          tasks: tasks,
          input: '',
          id: uniqid()
        }
      });

      saveTask(task, this.state.edit);
    }
  }

  resetState() {
    const tasks = this.state.tasks.map((item) => {
      return  {...item};
    });
    clearTasks(tasks);

    this.setState(
      {
      tasks: [],
      input: ''
      }
    );
    localStorage.clear();
  }

  // delete task -- firebase
  handleDelete(id) {
    const task = this.state.tasks.find((item) => item.id === id);

    this.setState((state) => {
      let newTasksArray = state.tasks.filter((item) => item.id !== id);
      return { tasks: newTasksArray }
    });

    deleteTask(task);
  }

  handleEdit(id) {
    const taskToEdit = this.state.tasks.find((item) => item.id === id);
    this.setState({
      edit: true,
      input: taskToEdit.task,
      editId: taskToEdit.id
    });
  }

  render() {
    return (
    <div className="o-wrap">
      <form onSubmit={this.onSubmitTask} className="c-form">
        <label htmlFor="taskInput">Enter Task:</label>
        <input type='text' id="taskInput" placeholder="Enter your task..." value={this.state.input} onChange={this.handleInput} />
        <button type='submit' className="c-btn c-form__btn">Add Task</button>
      </form>
        <Overview tasks={this.state.tasks} handleDelete={this.handleDelete} handleEdit={this.handleEdit} />
        <button type='button' onClick={this.resetState} className="c-btn c-btn__delete-all">Delete all tasks</button>
    </div>
  )}
}
