//cargarcontactos productos desde el local storage
const cargarContactos = () => {
    let contactos = JSON.parse(localStorage.getItem("contactos"))||[];
    console.log(contactos); // Mostrar el array de contactos en la consola
    let tabla = document.getElementById("tablaContactos");
    tabla.innerHTML = ""; // Limpiar la tabla antes de cargar los contactos

    for (let i = 0; i < contactos.length; i++ ){
        let fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${contactos[i].id}</td>
            <td>${contactos[i].nombre}</td>
            <td>${contactos[i].email}</td>
            <td>${contactos[i].fechaNacimiento}</td>
            <td><button class="btn btn-danger" onclick="eliminarContacto(${i})">Eliminar</button></td>
        `;         
    tabla.appendChild(fila); // Agregar la fila a la tabla
    }
}


document.addEventListener("DOMContentLoaded",cargarContactos())