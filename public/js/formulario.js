let contactos = JSON.parse(localStorage.getItem("contactos")) || [];

document.getElementById("btnEnviar").addEventListener("click", function(e){
    e.preventDefault(); // Evitar el envío del formulario


    const nombre = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const fechaNacimiento = document.getElementById("fechaNacimiento").value;
    const id = document.getElementById("id").value;

    const formulario = document.getElementById("formulario");

    if(nombre === "" || email === "" || fechaNacimiento === "" || id === "") {
        alert("Por favor, completa todos los campos.");
        return;
    }
    
    
    const xhr = new XMLHttpRequest();
    xhr.open("POST","http://localhost:3000/recibir", true);
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
            <td>${contactos[i].id}</td>
            <td>${contactos[i].nombre}</td>
            <td>${contactos[i].email}</td>
            <td>${contactos[i].fechaNacimiento}</td>
            <td><button class="btn btn-danger" onclick="eliminarContacto(${i})">Eliminar</button></td>
        `;         
    tabla.appendChild(fila); // Agregar la fila a la tabla
    }
}

document.addEventListener("DOMContentLoaded",cargarContactos());

//función para eliminar contactos

function eliminarContacto(index) {
    let contactos = JSON.parse(localStorage.getItem("contactos")) || [];
    contactos.splice(index, 1); // Eliminar el contacto del array
    localStorage.setItem("contactos", JSON.stringify(contactos)); // Guardar el array actualizado en el local storage
    cargarContactos(); // Recargar la tabla de contactos
};