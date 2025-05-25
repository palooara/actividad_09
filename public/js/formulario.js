let contactos = JSON.parse(localStorage.getItem("contactos")) || [];

document.getElementById("btnEnviar").addEventListener("click", function(e){
    e.preventDefault();

    const nombre = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const fechaNacimiento = document.getElementById("fechaNacimiento").value;
    const id = document.getElementById("id").value;
    const formulario = document.getElementById("formulario");

    if (!nombre || !email || !fechaNacimiento) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    const contacto = {
        nombre,
        email,
        fechaNacimiento
    };

    const xhr = new XMLHttpRequest();

    if (id) {
        // Editar contacto existente
        contacto._id = id;
        xhr.open("PUT", `http://localhost:3000/contactos/${id}`, true);
    } else {
        // Crear nuevo contacto
        xhr.open("POST", "http://localhost:3000/contactos", true);
    }

    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xhr.onload = function(){
        if (xhr.status === 200 || xhr.status === 201) {
            console.log("Respuesta del servidor:", xhr.responseText);
            document.getElementById("formulario").reset();
            document.getElementById("id").value = "";
            fetchContactosDelServidor();
        } else {
            console.error("Error en la petición:", xhr.statusText);
        }
    };

    xhr.send(JSON.stringify(contacto));
});

// Función que actualiza la tabla y el localStorage
function fetchContactosDelServidor() {
    fetch("http://localhost:3000/contactos")
        .then(response => response.json())
        .then(data => {
            localStorage.setItem("contactos", JSON.stringify(data));
            cargarContactos();
        })
        .catch(error => console.error("Error al obtener contactos:", error));
}

// Cargar contactos desde el localStorage
const cargarContactos = () => {
    let contactos = JSON.parse(localStorage.getItem("contactos")) || [];
    let tabla = document.getElementById("tablaContactos");
    tabla.innerHTML = "";

    for (let i = 0; i < contactos.length; i++) {
        let fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${i + 1}</td>
            <td>${contactos[i].nombre}</td>
            <td>${contactos[i].email}</td>
            <td>${contactos[i].fechaNacimiento}</td>
            <td><button onclick="eliminarContacto(${i})">Eliminar</button></td>
            <td><button onclick="editarContacto(${i})">Editar</button></td>
        `;
        tabla.appendChild(fila);
    }
};

document.addEventListener("DOMContentLoaded", fetchContactosDelServidor);

// Función para eliminar contactos
function eliminarContacto(index) {
    let contactos = JSON.parse(localStorage.getItem("contactos")) || [];
    const idEliminar = contactos[index]._id;

    if (!idEliminar) {
        console.error("Error: el contacto no tiene un ID válido.");
        return;
    }

    contactos.splice(index, 1);
    localStorage.setItem("contactos", JSON.stringify(contactos));
    cargarContactos();

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
    xhr.send();
}

// Función para editar contactos
function editarContacto(index) {
    let contactos = JSON.parse(localStorage.getItem("contactos")) || [];
    const contacto = contactos[index];
    const fechaNacimientoFormateada = new Date(contacto.fechaNacimiento).toISOString().split("T")[0];

    document.getElementById("name").value = contacto.nombre;
    document.getElementById("email").value = contacto.email;
    document.getElementById("fechaNacimiento").value = fechaNacimientoFormateada;
    document.getElementById("id").value = contacto._id;
}