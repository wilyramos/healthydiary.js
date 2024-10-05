(function() {
    let DB;

    document.addEventListener('DOMContentLoaded', () => {
        crearDB();
    
        
        
    });
    
    // Código de IndexedDB
    function crearDB() {
        // crear base de datos con la versión 1
        
        const createDB = window.indexedDB.open('crm', 1);
        createDB.onsuccess = function() {
                // if all is fine, assign the result to the instance
                DB = createDB.result;
                console.log('Database creada y lista');
                console.log(DB);
        };
        

        // si hay un error, lanzarlo
        createDB.onerror = function() {
            console.log('Hubo un error');
        };
    
        // this event only runs once and is ideal for creating the schema
        createDB.onupgradeneeded = function(e) {
            // el evento que se va a correr tomamos la base de datos
            const db = e.target.result;
            console.log(db);
    
            // definir el objectstore, primer parametro el nombre de la BD, segundo las opciones
            // keypath es de donde se van a obtener los indices
            const objectStore = db.createObjectStore('crm', { keyPath: 'id',  autoIncrement: true } );
    
            //createindex, nombre y keypath, 3ro los parametros
            objectStore.createIndex('habito', 'habito', { unique: false } );
            objectStore.createIndex('fecha', 'fecha', { unique: false } );
            objectStore.createIndex('notas', 'notas', { unique: false } );
            objectStore.createIndex('id', 'id', { unique: true } );
            console.log('Database creada y lista');
        };
    
    }

    function getHabitos() {
        clearHTML();
        let transaction = DB.transaction(['crm'], 'readwrite');
        
        openConexion.onerror = function() {
            console.log('Hubo un error');
        };

        openConexion.onerror = function() {
            console.log('Hubo un error');
        }

        openConexion.onsuccess = function() {
            DB = openConexion.result;
            const objectStore = DB.transaction('crm').objectStore('crm');

            objectStore.openCursor().onsuccess = function(e) {
                const cursor = e.target.result;
                if(cursor) {
                    console.log(cursor.value);
                    cursor.continue();
                }
            };
        };
    }

    function clearHTML() {
        while(habitos.firstChild) {
            habitos.removeChild(habitos.firstChild);
        }
    }
})();