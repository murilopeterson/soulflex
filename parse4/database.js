let db;
const dbName = "TaskDB";
const storeName = "tasks";

function createStorage(storename) {
    const request = indexedDB.open(dbName, 1);

    request.onupgradeneeded = function(event) {
        db = event.target.result;
        db.createObjectStore(storename, { keyPath: "id", autoIncrement: true });
    };

    request.onsuccess = function(event) {
        db = event.target.result;
    };
}

// Função para adicionar uma tarefa
function addTask(taskText) {
    if (!db) return;
    const transaction = db.transaction([storeName], "readwrite");
    const objectStore = transaction.objectStore(storeName);
    const request = objectStore.add({ task: taskText });

    request.onsuccess = function() {
        console.log("Tarefa adicionada!");
    };

    request.onerror = function(event) {
        console.error("Erro ao adicionar tarefa:", event.target.errorCode);
    };
}

// Função para listar todas as tarefas
function getTasks() {
    if (!db) return console.error("Crie o storage primeiro!");
    const transaction = db.transaction([storeName], "readonly");
    const objectStore = transaction.objectStore(storeName);
    const request = objectStore.getAll();

    request.onsuccess = function(event) {
        console.log("Tarefas:", event.target.result);
    };

    request.onerror = function(event) {
        console.error("Erro ao listar tarefas:", event.target.errorCode);
    };
}

// Função para atualizar uma tarefa
function updateTask(id, newTaskText) {
    if (!db) return console.error("Crie o storage primeiro!");
    const transaction = db.transaction([storeName], "readwrite");
    const objectStore = transaction.objectStore(storeName);
    const request = objectStore.get(id);

    request.onsuccess = function(event) {
        const task = event.target.result;
        if (task) {
            task.task = newTaskText;
            objectStore.put(task);
            console.log("Tarefa atualizada!");
        }
    };

    request.onerror = function(event) {
        console.error("Erro ao atualizar tarefa:", event.target.errorCode);
    };
}

// Função para excluir uma tarefa
function deleteTask(id) {
    if (!db) return console.error("Crie o storage primeiro!");
    const transaction = db.transaction([storeName], "readwrite");
    const objectStore = transaction.objectStore(storeName);
    const request = objectStore.delete(id);

    request.onsuccess = function() {
        console.log("Tarefa excluída!");
    };

    request.onerror = function(event) {
        console.error("Erro ao excluir tarefa:", event.target.errorCode);
    };
}