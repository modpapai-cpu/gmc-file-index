// =========================================
// GMC File Index Pro
// Firestore Functions
// =========================================

import {
    db,
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
    orderBy,
    onSnapshot
} from "./firebase.js";

const COLLECTION_NAME = "files";


// =========================================
// Get All Files (One Time)
// =========================================
export async function getAllFiles() {

    const q = query(
        collection(db, COLLECTION_NAME),
        orderBy("no")
    );

    const snapshot = await getDocs(q);

    const files = [];

    snapshot.forEach((item) => {

        files.push({
            id: item.id,
            ...item.data()
        });

    });

    return files;
}


// =========================================
// Realtime Listener
// =========================================
export function listenFiles(callback) {

    const q = query(
        collection(db, COLLECTION_NAME),
        orderBy("no")
    );

    return onSnapshot(q, (snapshot) => {

        const files = [];

        snapshot.forEach((item) => {

            files.push({
                id: item.id,
                ...item.data()
            });

        });

        callback(files);

    });

}


// =========================================
// Add File
// =========================================
export async function addFile(fileNo, fileName) {

    const duplicateQuery = query(
        collection(db, COLLECTION_NAME),
        where("no", "==", Number(fileNo))
    );

    const duplicateSnapshot = await getDocs(duplicateQuery);

    if (!duplicateSnapshot.empty) {

        throw new Error("FILE_ALREADY_EXISTS");

    }

    return await addDoc(
        collection(db, COLLECTION_NAME),
        {
            no: Number(fileNo),
            name: fileName.trim()
        }
    );

}


// =========================================
// Update File
// =========================================
export async function updateFile(id, fileNo, fileName) {

    const ref = doc(db, COLLECTION_NAME, id);

    return await updateDoc(ref, {

        no: Number(fileNo),

        name: fileName.trim()

    });

}


// =========================================
// Delete File
// =========================================
export async function deleteFile(id) {

    const ref = doc(db, COLLECTION_NAME, id);

    return await deleteDoc(ref);

}


// =========================================
// Search Function
// =========================================
export function searchFiles(files, keyword) {

    keyword = keyword.toLowerCase().trim();

    if (!keyword) return [];

    return files.filter(file =>

        file.name.toLowerCase().includes(keyword) ||

        String(file.no).includes(keyword)

    );

}