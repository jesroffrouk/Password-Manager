// utils function
function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("PWDMAN", 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      db.createObjectStore("Pwd");
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

function requestToPromise(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function cursorToPromise(request) {
  return new Promise((resolve,reject)=> {

    let data = {}
    request.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        data[cursor.key] = cursor.value
        cursor.continue()
      } else {
        console.log("Entries all displayed.");
        resolve(data)
      }
    }
    request.onerror = () => reject(request.error)
  })
}


// cleaning up db
export async function CleaningDB() {
  const db = await initDB();
  const tx = db.transaction("Pwd", "readwrite");
  const store = tx.objectStore("Pwd");
  await store.clear()
  db.close();
}

export async function dataExist() {
  const db = await initDB();
  const tx = db.transaction("Pwd", "readwrite");
  const store = tx.objectStore("Pwd");
  const accounts = (await requestToPromise(store.get("Accounts")))
  console.log(accounts)
  if(!accounts || Object.keys(accounts).length == 0){
    return false
  }
  db.close();
  return true
}



export async function AddfromFiles(data) {
  const db = await initDB();
  const tx = db.transaction("Pwd", "readwrite");
  const store = tx.objectStore("Pwd");
  const getRequest = store.get("Accounts");
  getRequest.onsuccess = () => {
    let accounts = getRequest.result || {};
    accounts = data.Accounts;
    const putRequest = store.put(accounts, "Accounts");
    putRequest.onsuccess = () => {
      window.dispatchEvent(new Event('db-updated'))
    };
};
  const getRequestHash = store.get("Hash");
  getRequestHash.onsuccess = () => {
    let Hash = getRequest.result || {};
    Hash = data.Hash;
    const putRequest = store.put(Hash, "Hash");
    putRequest.onsuccess = () => {
      console.log("Hash added from files")
    };
};
}

// adding a field
export async function addData(data) {
  // data should looks like {serviceName: facebook,data: {username,password,decrypt}}
  const db = await initDB();
  const tx = db.transaction("Pwd", "readwrite");
  const store = tx.objectStore("Pwd");
  const getRequest = store.get("Accounts");
  console.log(data)
  getRequest.onsuccess = () => {
    let accounts = getRequest.result || {};
    accounts[data.ServiceName] = data.Fields;

    const putRequest = store.put(accounts, "Accounts");
    putRequest.onsuccess = () => {
      window.dispatchEvent(new Event("db-updated"))
      db.close()
    };;
    putRequest.onerror = () => {
      db.close()
    }
};
}

export async function addHashPassword(hashPassword){
  const db = await initDB();
  const tx = db.transaction("Pwd","readwrite")
  const store = tx.objectStore("Pwd")
  const putRequest = store.put(hashPassword,"Hash")
  putRequest.onsuccess = () => {
    console.log('hash password set successful')
  }
  putRequest.onerror = () => {
    console.log('hash password failed')
  }
  db.close()
}


export async function RetriveHashPassword() {
  const db = await initDB();
  const tx = db.transaction("Pwd", "readonly");
  const store = tx.objectStore("Pwd");
  let hashPassword = (await requestToPromise(store.get("Hash"))) || "";
  return hashPassword
  // close db , later 
}

export async function RetriveData(ServiceName) {
  // it will be object , {serviceName,FieldName}
  const db = await initDB();
  const tx = db.transaction("Pwd", "readonly");
  const store = tx.objectStore("Pwd");
  let accounts = (await requestToPromise(store.get("Accounts"))) || {};
  const Value = accounts[ServiceName];
  return Value
  // close db , later 
}

// retriving all accounts using cursor
export async function RetriveAllData() {
  const db = await initDB();
  const tx = db.transaction("Pwd", "readonly");
  const store = tx.objectStore("Pwd");
  const data = (await cursorToPromise(store.openCursor())) || {}
  return data
}


export async function getAllServices(){
  const db = await initDB();
  const tx = db.transaction("Pwd", "readonly")
  const store = tx.objectStore("Pwd")
  let accounts = (await requestToPromise(store.get("Accounts"))) || {}
  return Object.keys(accounts)
  // filter to ignore hashpass
}

export async function DeleteData(ServiceName) {
  const db = await initDB();
  const tx = db.transaction("Pwd", "readwrite");
  const store = tx.objectStore("Pwd");
  const getRequest = store.get("Accounts");
  getRequest.onsuccess = () => {
    let accounts = getRequest.result || {}
    delete accounts[ServiceName]
    const putRequest = store.put(accounts, "Accounts");
    putRequest.onsuccess = () => {
      window.dispatchEvent(new Event("db-updated"))
      db.close()
    }
  }
;
}
