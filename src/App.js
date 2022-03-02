import React from "react";
import { Overview } from './components/Overview';
import uniqid from 'uniqid';
import './css/main.css';

// Firebase
import { getFirebaseConfig } from './firebase.config';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  setDoc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import {
  getStorage,
  ref
} from 'firebase/storage';

export default class App extends React.Component {
  constructor() {
    super();
    // TODO: use Map() instead of Array for tasks
    this.state = {
      tasks: localStorage.length !== 0 ? JSON.parse(localStorage.getItem('tasks')) : [],
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

  handleInput(e) {
    this.setState({ input: e.target.value });
  }

  onSubmitTask(e) {
    e.preventDefault();
    const input = this.state.input;
    
    if (this.state.edit) {
      this.setState((state) => {
        let newTasksArray = state.tasks.map((task) => {
          if (task.id === state.editId) {
            task = { id: state.editId, input: input };
          }
          return task;
        });
        localStorage.setItem('tasks', JSON.stringify(newTasksArray));
        
        return {
          tasks: newTasksArray,
          input: '',
          editId: '',
          id: uniqid(),
          edit: false
        }
      });
      return;
    }

    const task = this.state.tasks.find((task) => task.input === input);

    if (input !== '' && task === undefined) {
      this.setState((state) => {
        const tasks = [...state.tasks, { id: state.id, input: state.input }];
        localStorage.setItem('tasks', JSON.stringify(tasks));

        return {
          tasks: tasks,
          input: '',
          id: uniqid()
        }
      });
    }
  }

  resetState() {
    this.setState(
      {
      tasks: [],
      input: ''
      }
    );
    localStorage.clear();
  }

  handleDelete(id) {
    this.setState((state) => {
      let newTasksArray = state.tasks.filter((task) => task.id !== id);
      localStorage.setItem('tasks',JSON.stringify(newTasksArray));
      return { tasks: newTasksArray }
    });
  }

  handleEdit(id) {
    const taskToEdit = this.state.tasks.find((task) => task.id === id);
    this.setState({
      edit: true,
      input: taskToEdit.input,
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
