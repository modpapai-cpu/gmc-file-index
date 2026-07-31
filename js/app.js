// =========================================
// GMC File Index Pro v2
// app.js
// Part 1A
// =========================================

import {
    getAllFiles,
    listenFiles,
    searchFiles,
    addFile,
    updateFile,
    deleteFile
} from "./firestore.js";

import {
    login,
    logout,
    checkAuth
} from "./auth.js";


// =========================================
// DOM
// =========================================

const searchInput = document.getElementById("searchInput");
const clearBtn = document.getElementById("clearBtn");

const fileNo = document.getElementById("fileNo");
const fileName = document.getElementById("fileName");
const resultList = document.getElementById("resultList");

const loginBtn = document.getElementById("loginBtn");

const loginModal = document.getElementById("loginModal");
const dashboardModal = document.getElementById("dashboardModal");
const fileModal = document.getElementById("fileModal");
const deleteModal = document.getElementById("deleteModal");

const closeLogin = document.getElementById("closeLogin");
const closeDashboard = document.getElementById("closeDashboard");
const closeFileModal = document.getElementById("closeFileModal");
const closeDeleteModal = document.getElementById("closeDeleteModal");

const adminEmail = document.getElementById("adminEmail");
const adminPassword = document.getElementById("adminPassword");
const adminLoginBtn = document.getElementById("adminLoginBtn");

const logoutBtn = document.getElementById("logoutBtn");

const addFileBtn = document.getElementById("addFileBtn");
const editFileBtn = document.getElementById("editFileBtn");
const deleteFileBtn = document.getElementById("deleteFileBtn");

const userManagementBtn = document.getElementById("userManagementBtn");

const userManagementModal = document.getElementById("userManagementModal");

const closeUserManagement = document.getElementById("closeUserManagement");

const fileModalTitle = document.getElementById("fileModalTitle");

const fileNumberInput = document.getElementById("fileNumberInput");
const fileNameInput = document.getElementById("fileNameInput");
// Only allow numbers in File Number
fileNumberInput.addEventListener("input", function () {

    this.value = this.value.replace(/\D/g, "");

});


const saveFileBtn = document.getElementById("saveFileBtn");

const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

const selectedDocId = document.getElementById("selectedDocId");

const deleteFileNo = document.getElementById("deleteFileNo");
const deleteFileName = document.getElementById("deleteFileName");

const toast = document.getElementById("toast");

// =========================================
// Toast
// =========================================

function showToast(message, type = "success") {

    toast.innerHTML = message;

    toast.className = "toast";

    switch (type) {

        case "success":
            toast.classList.add("success");
            break;

        case "error":
            toast.classList.add("error");
            break;

        case "warning":
            toast.classList.add("warning");
            break;

        case "info":
            toast.classList.add("info");
            break;

    }

    toast.classList.add("show");

    clearTimeout(window.toastTimer);

    window.toastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}


// =========================================
// Variables
// =========================================

let files = [];

let selectedFile = null;

let editMode = false;

let currentUser = null;

let pressTimer = null;
// =========================================
// Auto Logout
// =========================================

const IDLE_TIMEOUT = 15 * 60 * 1000;

let idleTimer = null;

let idleEvents = [
    "mousemove",
    "mousedown",
    "keydown",
    "click",
    "scroll",
    "touchstart"
];

function resetIdleTimer() {

    if (!currentUser) return;

    clearTimeout(idleTimer);

    idleTimer = setTimeout(async () => {

        stopIdleTracking();

        await logout();
        closeModal(loginModal);
        closeModal(dashboardModal);
        closeModal(fileModal);
        closeModal(deleteModal);
        alert(
            "Session expired.\n\nYou have been logged out due to inactivity."
        );

    }, IDLE_TIMEOUT);

}

function startIdleTracking() {

    stopIdleTracking();

    idleEvents.forEach(event => {

        document.addEventListener(
            event,
            resetIdleTimer,
            true
        );

    });

    resetIdleTimer();

}

function stopIdleTracking() {

    clearTimeout(idleTimer);

    idleEvents.forEach(event => {

        document.removeEventListener(
            event,
            resetIdleTimer,
            true
        );

    });

}


// =========================================
// Modal Functions
// =========================================

function openModal(modal) {

    modal.classList.add("show");

}

function closeModal(modal) {

    modal.classList.remove("show");

}

closeLogin.onclick = () => closeModal(loginModal);

closeDashboard.onclick = () => closeModal(dashboardModal);

closeFileModal.onclick = () => closeModal(fileModal);

closeDeleteModal.onclick = () => closeModal(deleteModal);
closeUserManagement.onclick = () => closeModal(userManagementModal);
// =========================================
// Realtime Firestore
// =========================================

listenFiles((data) => {

    files = data;

    const keyword = searchInput.value.trim();

    if (keyword === "") {

        showEmptyState();

        return;

    }

    renderList(searchFiles(files, keyword));

});


// =========================================
// Empty State
// =========================================

function showEmptyState() {

    fileNo.innerText = "-";

fileName.innerText = "Search a file...";

selectedFile = null;

selectedDocId.value = "";

editFileBtn.disabled = false;
deleteFileBtn.disabled = false;

editFileBtn.classList.add("disabled-btn");
deleteFileBtn.classList.add("disabled-btn");

    fileNo.innerText = "-";

    fileName.innerText = "Search a file...";

    selectedFile = null;

    selectedDocId.value = "";

    editFileBtn.disabled = false;
    deleteFileBtn.disabled = false;

    editFileBtn.classList.add("disabled-btn");
    deleteFileBtn.classList.add("disabled-btn");

}


// =========================================
// Render List
// =========================================

function renderList(list) {

    resultList.innerHTML = "";

    if (!list.length) {

        resultList.innerHTML = `
            <div class="empty">
                No File Found
            </div>
        `;

        fileNo.innerText = "-";

        fileName.innerText = "No Result";

        return;

    }

    list.forEach(file => {

        const item = document.createElement("div");

        item.className = "file-item";

        item.innerHTML = `
            <div class="left">${file.no}</div>
            <div class="right">${file.name}</div>
        `;

        // =============================
// File Select
// =============================



function selectFile() {

    document
        .querySelectorAll(".file-item")
        .forEach(x => x.classList.remove("selected-file"));

    item.classList.add("selected-file");

    selectedFile = file;

    selectedDocId.value = file.id;

    fileNo.innerText = file.no;

    fileName.innerText = file.name;

    editFileBtn.classList.remove("disabled-btn");
deleteFileBtn.classList.remove("disabled-btn");

}

// Desktop Click
item.addEventListener("click", () => {

    selectFile();

});

// Mobile Long Press
item.addEventListener("touchstart", () => {

    pressTimer = setTimeout(() => {

        selectFile();

mobileQuickMenu = true;

addFileBtn.style.display = "none";
logoutBtn.style.display = "none";

editFileBtn.style.display = "block";
deleteFileBtn.style.display = "block";

openModal(dashboardModal);

    }, 600);

});

// Cancel Long Press
item.addEventListener("touchend", () => {

    clearTimeout(pressTimer);

});

item.addEventListener("touchmove", () => {

    clearTimeout(pressTimer);

});

        resultList.appendChild(item);

    });

}


// =========================================
// Search
// =========================================

searchInput.addEventListener("input", () => {

    const keyword = searchInput.value.trim();

    if (!keyword) {

    showEmptyState();

    return;

}

    renderList(
        searchFiles(
            files,
            keyword
        )
    );

});


// =========================================
// Clear Search
// =========================================

clearBtn.addEventListener("click", () => {

    searchInput.value = "";

    showEmptyState();

});
// =========================================
// Authentication
// =========================================

checkAuth((user) => {

    currentUser = user;

    if (user) {

        loginBtn.innerHTML =
            '<i class="fa-solid fa-user"></i> <span>Dashboard</span>';

        startIdleTracking();

    } else {

    currentUser = null;

    loginBtn.innerHTML =
        '<i class="fa-solid fa-user-shield"></i> <span>Admin</span>';

        stopIdleTracking();

        closeModal(loginModal);
        closeModal(dashboardModal);
        closeModal(fileModal);
        closeModal(deleteModal);

    }

});


// =========================================
// Login Button
// =========================================

loginBtn.onclick = () => {

    if (currentUser) {
        mobileQuickMenu = false;

        addFileBtn.style.display = "block";
        logoutBtn.style.display = "block";

        editFileBtn.style.display = "block";
        deleteFileBtn.style.display = "block";
        openModal(dashboardModal);

    } else {

        adminEmail.value = "";
        adminPassword.value = "";
    
        openModal(loginModal);

    }

};

userManagementBtn.onclick = () => {

    closeModal(dashboardModal);

    openModal(userManagementModal);

};


// =========================================
// Admin Login
// =========================================

adminLoginBtn.onclick = async () => {

    const email = adminEmail.value.trim();

    const password = adminPassword.value;

    if (!email || !password) {

        showToast("⚠ Please Enter Email & Password", "warning");

        return;

    }

    adminLoginBtn.disabled = true;

    try {

        const result = await login(email, password);

        if (result.success) {

    closeModal(loginModal);

    adminPassword.value = "";

    

    resetIdleTimer();

    showToast("✅ Login Successful");

} else {

            showToast("❌ Invalid Email or Password", "error");

        }

    } catch (err) {

        console.error(err);

        if (
    err.code === "auth/invalid-credential" ||
    err.code === "auth/wrong-password" ||
    err.code === "auth/user-not-found"
) {

    showToast("❌ Invalid Email or Password", "error");

} else if (err.code === "auth/network-request-failed") {

    showToast("🌐 No Internet Connection", "warning");

} else {

    showToast("❌ Login Failed", "error");

}

    }

    adminLoginBtn.disabled = false;

};


// =========================================
// Logout
// =========================================

logoutBtn.onclick = async () => {

    stopIdleTracking();

    await logout();
    showToast("👋 Logged Out", "info");
};


// =========================================
// Close Modal (Outside Click)
// =========================================

window.addEventListener("click", (e) => {

    if (e.target === loginModal)
        closeModal(loginModal);

    if (e.target === dashboardModal)
        closeModal(dashboardModal);

    if (e.target === fileModal)
        closeModal(fileModal);

    if (e.target === deleteModal)
        closeModal(deleteModal);
    if (e.target === userManagementModal)
        closeModal(userManagementModal);

});


// =========================================
// Initial State
// =========================================

showEmptyState();
// =========================================
// Add File
// =========================================
let mobileQuickMenu = false;
addFileBtn.onclick = () => {

    editMode = false;

    selectedFile = null;

    selectedDocId.value = "";

    fileModalTitle.innerText = "Add File";

    fileNumberInput.value = "";

    fileNameInput.value = "";

    closeModal(dashboardModal);

    openModal(fileModal);

};


// =========================================
// Edit File
// =========================================

editFileBtn.onclick = () => {

    if (!selectedFile) {

        showToast("⚠ Please Select A File", "warning");

        return;

    }

    editMode = true;

    fileModalTitle.innerText = "Edit File";

    fileNumberInput.value = selectedFile.no;

    fileNameInput.value = selectedFile.name;

    closeModal(dashboardModal);

    openModal(fileModal);

};


// =========================================
// Save File
// =========================================

saveFileBtn.onclick = async () => {

    const no = String(fileNumberInput.value).trim();
// Only numbers allowed
if (!/^\d+$/.test(no)) {

    showToast("⚠ File Number must contain only digits", "warning");

    fileNumberInput.focus();

    return;

}
    const name = fileNameInput.value.trim();

    if (!no || !name) {

        showToast("⚠ Please Fill All Fields", "warning");

        return;

    }

    // Duplicate File No Check
    const duplicate = files.find(file => {

    const fileNo = String(file.no).trim();
    const inputNo = String(no).trim();

    if (editMode) {

        return (
            fileNo === inputNo &&
            file.id !== selectedDocId.value
        );

    }

    return fileNo === inputNo;

});

    if (duplicate) {

        showToast("⚠ File Number Already Exists", "warning");

        return;

    }

    saveFileBtn.disabled = true;

    try {

        if (editMode) {

            await updateFile(
                selectedDocId.value,
                no,
                name
            );

        } else {

            await addFile(
                no,
                name
            );

        }

        closeModal(fileModal);

if (editMode) {

    showToast("✏️ File Updated Successfully", "success");

} else {

    showToast("➕ File Added Successfully", "success");

}

    } catch (err) {

    console.error(err);

    if (err.message === "FILE_ALREADY_EXISTS") {

        showToast("⚠ File Number Already Exists", "warning");

    } else {

        showToast("❌ Failed To Save File", "error");

    }

}

    saveFileBtn.disabled = false;

};
// =========================================
// Delete File
// =========================================

deleteFileBtn.onclick = () => {

    if (!selectedFile) {

        showToast("⚠ Please Select A File", "warning");

        return;

    }

    deleteFileNo.innerText = selectedFile.no;

    deleteFileName.innerText = selectedFile.name;

    closeModal(dashboardModal);

    openModal(deleteModal);

};


// =========================================
// Confirm Delete
// =========================================

confirmDeleteBtn.onclick = async () => {

    if (!selectedFile) {

        closeModal(deleteModal);

        return;

    }

    confirmDeleteBtn.disabled = true;

    try {

        await deleteFile(selectedDocId.value);

        selectedFile = null;

        selectedDocId.value = "";

        fileNo.innerText = "-";

        fileName.innerText = "Search a file...";
        editFileBtn.disabled = false;
deleteFileBtn.disabled = false;
        editFileBtn.classList.add("disabled-btn");
        deleteFileBtn.classList.add("disabled-btn");
        closeModal(deleteModal);

showToast("🗑 File Deleted Successfully", "error");

        if (searchInput.value.trim() === "") {

            showEmptyState();

        } else {

            renderList(
                searchFiles(
                    files,
                    searchInput.value.trim()
                )
            );

        }

    } catch (err) {

        console.error(err);

        showToast("❌ Delete Failed", "error");

    }

    confirmDeleteBtn.disabled = false;

};


// =========================================
// Reset Selection
// =========================================

function resetSelection() {

    selectedFile = null;

    selectedDocId.value = "";

    fileNo.innerText = "-";

    fileName.innerText = "Search a file...";

    editFileBtn.disabled = false;
deleteFileBtn.disabled = false;

editFileBtn.classList.add("disabled-btn");
deleteFileBtn.classList.add("disabled-btn");

    document
        .querySelectorAll(".file-item")
        .forEach(item =>
            item.classList.remove("selected-file")
        );

}
