
    let DB;

    const formulario = document.querySelector('#health-form');

    document.addEventListener('DOMContentLoaded', () => {
        formulario.addEventListener('submit', validarHabit);
        conectarDB();

        if(window.indexedDB.open('crm', 1)) {
            getHabits();
        }
    });

    function conectarDB() {
        // ABRIR CONEXIÓN EN LA BD:

        let abrirConexion = window.indexedDB.open('crm', 1);

        // si hay un error, lanzarlo
        abrirConexion.onerror = function() {
            console.log('Hubo un error');
        };
    
        // si todo esta bien, asignar a database el resultado
        abrirConexion.onsuccess = function() {
            // guardamos el resultado
            DB = abrirConexion.result;
        };
    }


    function validarHabit(e) {
        e.preventDefault();


        const habit = document.querySelector('#habit').value;
        const date = document.querySelector('#date').value;
        const notes = document.querySelector('#notes').value;


        if(habit === '' || date === '' || notes === '') {
            imprimirAlerta('Todos los campos son obligatorios', 'error');
            return;
        }

        // añadir a la BD...
        // crear un nuevo objeto con toda la info
        const habito = {
            habit, 
            date,
            notes
        }
        // Generar un ID único
        habito.id = Date.now();
        console.log(habito);

        crearNuevoHabito(habito);
        getHabits();
        
    }

    function crearNuevoHabito(habito) {

        // NUEVO: 
        clearHTML();
        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');
        // console.log(objectStore);
        objectStore.add(habito);

        transaction.oncomplete = () => {
            console.log('habito Agregado');
            // Mostrar mensaje de que todo esta bien...
            imprimirAlerta('Se agregó correctamente');

            // clear form
            
        };

        transaction.onerror = () => {
            console.log('Hubo un error!');
            imprimirAlerta('Hubo un Error', 'error');
        };
    }

    function imprimirAlerta(mensaje, tipo) {
         // Crea el div

         const divMensaje = document.createElement('div');
         divMensaje.classList.add( "px-4", "py-3", "rounded",  "max-w-lg", "mx-auto", "mt-6", "text-center" );

         if(tipo === 'error') {
            divMensaje.classList.add('bg-red-100', "border-red-400", "text-red-700");
         } else {
             divMensaje.classList.add('bg-green-100', "border-green-400", "text-green-700");
         }
         
         // Mensaje de error
         divMensaje.textContent = mensaje;
 
         // Insertar en el DOM
        formulario.appendChild(divMensaje);

        console.log(formulario);
 
         // Quitar el alert despues de 3 segundos
         setTimeout( () => {
             divMensaje.remove();
         }, 3000);
    }

    function getHabits(){
        const openConnection = window.indexedDB.open('crm', 1);

        openConnection.onerror = function(){
            console.log('Hubo un error');
        };

        openConnection.onsuccess = function(){
            DB = openConnection.result;
            const objectStore = DB.transaction('crm').objectStore('crm');

            objectStore.openCursor().onsuccess = function(e){
                const cursor = e.target.result;

                if(cursor){

                    const { habit, date, notes, id } = cursor.value;
                    const listHabits = document.querySelector('#habits-list');
                    const row = document.createElement('tr');

                    row.innerHTML = `
                        <td class="px-6 py-4">${habit}</td>
                        <td class="px-6 py-4">${date}</td>
                        `;
                    const btnEliminar = document.createElement('button');
                    btnEliminar.classList.add('bg-red-500', 'hover:bg-red-700', 'px-4', 'py-2', 'rounded', 'text-white', 'uppercase', 'font-bold', 'eliminar');
                    btnEliminar.innerHTML = 'Eliminar';

                    btnEliminar.onclick = () => {
                        eliminarHabito(id);
                    }

                    row.appendChild(btnEliminar);
                    listHabits.appendChild(row);

                    const btnEditar = document.createElement('button');
                    btnEditar.classList.add('bg-green-500', 'hover:bg-green-700', 'px-4', 'py-2', 'rounded', 'text-white', 'uppercase', 'font-bold', 'editar');
                    btnEditar.innerHTML = 'Editar';

                    btnEditar.onclick = () => {
                        
                        editarHabito(cursor.value);
                        
                    }

                    row.appendChild(btnEditar);
                    listHabits.appendChild(row);

                    cursor.continue();
                    
                }else {
                    console.log('no registros');
                }
            }
        }
    }

    function eliminarHabito(id){
        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');

        objectStore.delete(id);

        transaction.oncomplete = function(){
            console.log('habito eliminado');
            clearHTML();
            getHabits();
        }

        transaction.onerror = function(){
            console.log('hubo un error');
        }
    }

    function editarHabito(habito){
        const { habit, date, notes, id } = habito;

        document.querySelector('#habit').value = habit;
        document.querySelector('#date').value = date;
        document.querySelector('#notes').value = notes;

        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');

        objectStore.put(habito);

        

        transaction.oncomplete = function(){
            clearHTML();
            console.log('habito editado');
            getHabits();

        }
        transaction.onerror = function(){
            console.log('hubo un error');
        }

        // clear form
        ;
    }

    function clearHTML() {
        const listHabits = document.querySelector('#habits-list');
        while(listHabits.firstChild){
            listHabits.removeChild(listHabits.firstChild);
        }
    }



