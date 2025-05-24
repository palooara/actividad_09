let contactos = JSON.parse(localStorage.getItem("contactos")) || [];

document.getElementById("btnEnviar").addEventListener("click", function(e){
    e.preventDefault(); // Evitar el envío del formulario


    const nombre = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const fechaNacimiento = document.getElementById("fechaNacimiento").value;
    const id = document.getElementById("id").value;

    const formulario = document.getElementById("formulario");

    if(nombre === "" || email === "" || fechaNacimiento === "") {
        alert("Por favor, completa todos los campos.");
        return;
    }
    
    
    const xhr = new XMLHttpRequest();
    xhr.open("POST","http://localhost:3000/contactos", true);
    // configurar el encabezado de contenido que vamos a enviar
    xhr.setRequestHeader("Content-Type","application/json;charset=UTF-8");
    
    xhr.onload = function(){
        if(xhr.status === 200){
            console.log("Respuesta del servidor: " + xhr.responseText);
        }else{
            console.log("Error en la petición: " + xhr.statusText);
        }
    };
    
    const contacto = {
        nombre: nombre,
        email: email,
        fechaNacimiento: fechaNacimiento,
        id: id
    };

    contactos.push(contacto); // Agregar el contacto al array
    
    xhr.send(JSON.stringify(contacto)); // Enviar el contacto al servidor

    localStorage.setItem("contactos", JSON.stringify(contactos)); // Guardar el array en el local storage
    
    console.log(JSON.stringify(contactos)); // Mostrar el contacto guardado en la consola

    formulario.reset(); // Limpiar el formulario
});

//cargar contactos desde el local storage
const cargarContactos = () => {
    let contactos = JSON.parse(localStorage.getItem("contactos"))||[];
    console.log(contactos); // Mostrar el array de contactos en la consola
    let tabla = document.getElementById("tablaContactos");
    tabla.innerHTML = ""; // Limpiar la tabla antes de cargar los contactos

    for (let i = 0; i < contactos.length; i++ ){
        let fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${i + 1}</td>
            <td>${contactos[i].nombre}</td>
            <td>${contactos[i].email}</td>
            <td>${contactos[i].fechaNacimiento}</td>
            <td><button class="btn btn-danger" onclick="eliminarContacto(${i})">Eliminar</button></td>
            <td><button class="btn btn-warning" onclick="editarContacto(${i})">Editar</button></td>
        `;         
    tabla.appendChild(fila); // Agregar la fila a la tabla
    }
}

document.addEventListener("DOMContentLoaded", () => {
    fetch("http://localhost:3000/contactos")
        .then(response => response.json())
        .then(data => {
            localStorage.setItem("contactos", JSON.stringify(data)); // Guardar los contactos con sus _id en localStorage
            cargarContactos(); // Mostrar los contactos en la tabla
        })
        .catch(error => console.error("Error al obtener contactos:", error));
});

//función para eliminar contactos

function eliminarContacto(index) {
    let contactos = JSON.parse(localStorage.getItem("contactos")) || [];
    
    const idEliminar = contactos[index]._id; // Guardar el ID antes de eliminar el contacto
    
    if (!idEliminar) {
        console.error("Error: el contacto no tiene un ID válido.");
        return;
    }

    contactos.splice(index, 1); // Eliminar el contacto del array
    localStorage.setItem("contactos", JSON.stringify(contactos)); // Guardar el nuevo array en localStorage
    cargarContactos(); // Recargar la tabla de contactos

    const xhr = new XMLHttpRequest();
    xhr.open("DELETE", `http://localhost:3000/contactos/${idEliminar}`, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onload = function() {
        if (xhr.status === 200) {
            console.log("Contacto eliminado del servidor: " + xhr.responseText);
        } else {
            console.log("Error al eliminar el contacto del servidor: " + xhr.statusText);
        }
    };
    xhr.send(); // Enviar la solicitud de eliminación al servidor
}

function editarContacto(index) {
    let contactos = JSON.parse(localStorage.getItem("contactos")) || [];
    const contacto = contactos[index];

    // Convertir fecha al formato correcto antes de asignarla
    const fechaNacimientoFormateada = new Date(contacto.fechaNacimiento).toISOString().split("T")[0];

    document.getElementById("name").value = contacto.nombre;
    document.getElementById("email").value = contacto.email;
    document.getElementById("fechaNacimiento").value = fechaNacimientoFormateada;
    document.getElementById("id").value = contacto._id; // Guardar el ID del contacto a editar

    const contactoEditado = {
        nombre: document.getElementById("name").value,
        email: document.getElementById("email").value,
        fechaNacimiento: document.getElementById("fechaNacimiento").value, // Asegurar que tenga solo "YYYY-MM-DD"
        _id: contacto._id // Mantener el ID del contacto original
    };

    const xhr = new XMLHttpRequest();
    xhr.open("PUT", `http://localhost:3000/contactos/${contacto._id}`, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xhr.onload = function() {
        if (xhr.status === 200) {
            console.log("Contacto editado en el servidor: " + xhr.responseText);
            // Actualizar los datos en localStorage después de la edición
            contactos[index] = contactoEditado;
            localStorage.setItem("contactos", JSON.stringify(contactos));
            cargarContactos(); // Recargar la lista de contactos en la página
        } else {
            console.log("Error al editar el contacto en el servidor: " + xhr.statusText);
        }
    };

    xhr.send(JSON.stringify(contactoEditado)); // ¡Aquí está la corrección!
}