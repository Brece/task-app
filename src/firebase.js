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
        const ref = doc(db, 'tasks', task.id);

        if (edit) {
            const docRef = await updateDoc(ref, {
                task: task.task,
                id: task.id,
                timestamp: serverTimestamp()
            });
            return;
        }

        const docRef = await setDoc(ref, {
            task: task.task,
            id: task.id,
            timestamp: serverTimestamp()
        });
    } catch (error) {
        console.error('Error writing new task to Firebase Database', error);
    }
}

async function deleteTask(task) {
    const ref = doc(db, 'tasks', task.id);

    const docRef = await setDoc(ref, {
        task: task.task,
            id: task.id,
            timestamp: serverTimestamp()
    })
    console.log(docRef);
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

    // FIXME:

    return tasksArray;
}

export { saveTask, loadTasks, deleteTask };
