import { 
    collection, 
    query, 
    orderBy, 
    setDoc,
    updateDoc,
    deleteDoc,
    serverTimestamp, 
    doc,
    getDocs
} from 'firebase/firestore';
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
            await updateDoc(ref, newTask);
            return;
        }

        await setDoc(ref, newTask);
    } catch (error) {
        console.error('Error writing new task to Firebase Database', error);
    }
}

async function deleteTask(task) {
    try {
        const ref = doc(db, 'tasks', task.id);
        await deleteDoc(ref);
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
async function loadTasks () {
    try {
        let tasksArray = [];
        const recentTasksQuery = query(collection(db, 'tasks'), orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(recentTasksQuery);
        querySnapshot.forEach((doc) => {
            tasksArray.push(doc.data());
        });
        
        return tasksArray;
    } catch (error) {
        console.error('Error loading tasks from Firebase Database', error);
    }
}

export { saveTask, loadTasks, deleteTask, clearTasks };
