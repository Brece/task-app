import { 
    collection, 
    query, 
    orderBy, 
    setDoc,
    updateDoc,
    deleteDoc,
    serverTimestamp, 
    onSnapshot,
    doc
} from 'firebase/firestore';
import {
    getStorage,
    ref
} from 'firebase/storage';
import { db } from './firebase.config';

// save a new task on the Cloud Firestore
async function saveTask(task, edit=false) {
    // Add a new task entry to the Firebase database.
    try {
        // create a document with a custom document ID in collection 'tasks'
        // if collection 'tasks' doesn't exists it will be created
        const ref = doc(db, 'tasks', task.id);
        const newTask = {
            task: task.task,
            id: task.id,
            timestamp: serverTimestamp()
        };

        if (edit) {
            updateDoc(ref, newTask);
            return;
        }

        setDoc(ref, newTask);
    } catch (error) {
        console.error('Error writing new task to Firebase Database', error);
    }
}

async function deleteTask(task) {
    try {
        const ref = doc(db, 'tasks', task.id);
        deleteDoc(ref);
    } catch (error) {
        console.error('Error deleteting task from Firebase Database', error);
    }
}

async function clearTasks(taskArray) {
    try {
        taskArray.forEach((item) => {
            const ref = doc(db, 'tasks', item.id);
            deleteDoc(ref);
            return;
        });
    } catch (error) {
        console.error('Error deleteting task from Firebase Database', error);
    }
}
// Loads tasks history and listens for upcoming ones.
function loadTasks () {
    const recentTasksQuery = query(collection(db, 'tasks'), orderBy('timestamp', 'desc'));

    let tasksArray = [];
    // start listening to the query
    onSnapshot(recentTasksQuery, function(snapshot) {
        snapshot.docChanges().forEach(function(change) {
            if (change.type === 'removed') {
                // deleteTask(change.doc.id);
            } else {
                const task = change.doc.data();
                tasksArray.push(task);
            }
        })
    });

    return tasksArray;
}

export { saveTask, loadTasks, deleteTask, clearTasks };
