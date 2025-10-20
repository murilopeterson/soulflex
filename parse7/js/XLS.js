class XLS {
    constructor(){
        
    }
}

const abrirDB = () => new Promise((resolve, reject) => {
  const req = indexedDB.open('meuDB', 1);
  req.onerror = () => reject(req.error);
  req.onsuccess = () => resolve(req.result);
  req.onupgradeneeded = (e) => {
    const db = e.target.result;
    db.createObjectStore('data', { keyPath: 'id' });
  };
});

// Operações genéricas (readwrite para put/delete, readonly para get/all)
const opDB = async (mode, fn) => {
  const db = await abrirDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(['data'], mode);
    const store = tx.objectStore('data');
    const req = fn(store);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
    tx.oncomplete = () => db.close();
  });
};

// Salvar (put = insert/update)
const salvar = (obj) => opDB('readwrite', (store) => store.put(obj));

// Ler por ID
const ler = (id) => opDB('readonly', (store) => store.get(id));

// Ler todos
const lerTodos = () => opDB('readonly', (store) => store.getAll());

// Deletar
const deletar = (id) => opDB('readwrite', (store) => store.delete(id));

// Exemplo de uso
(async () => {
  try {
    await salvar({ id: 1, valor: 'teste' });
    console.log(await ler(1)); // { id: 1, valor: 'teste' }
    console.log(await lerTodos()); // array com itens
    await deletar(1);
  } catch (e) { console.error(e); }
})();