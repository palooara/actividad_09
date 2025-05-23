const express = require("express");
const server = express();

const path = require("path");

const mongoose = require("mongoose");

// Conexión a la base de datos MongoDB
mongoose.connect("mongodb://localhost:27017/pruebaajax")
.then(() => console.log("Conectado a la base de datos"))
.catch(err => console.error("Error de conexión a la base de datos", err));

const Contacto = require("./contactoModel");

const PORT = 3000;

function pruebaMidd(req, res, next){
    console.log("pasó por nuestro middleware");
    next(); //llama al siguiente middleware
};

server.use(pruebaMidd); //llama y ejecuta los middleware

//usamos un middleware para ver el front
server.use(express.static(path.join(__dirname, "public"))); //middleware para servir archivos estaticos
//server.use(express.static(path.join(__dirname, "public"))); //otra forma de hacerlo


//Usamos el middleware para parsear el body de la petición
server.use(express.json());


server.post("/recibir", (req, res) => {
    //envio la confirmacion de que recibi los datos
    const contacto = new Contacto({
        nombre: req.body.nombre,
        email: req.body.email,
        fechaNacimiento: req.body.fechaNacimiento,
        id: req.body.id
    });

    console.log(req.body);
    console.log(contacto);

    contacto.save()
    .then(() => {
        console.log("Contacto guardado en la base de datos");
        res.status(200).send("Contacto guardado en la base de datos");
    });
});

server.use(( req, res) => {
    console.log("Ruta no encontrada: " + req.url);
    res.status(404).send(`<h1>404 Not Found</h1>`);
});


server.listen(PORT, () =>{
    console.log('servidor escuchando en el puerto http://localhost:' + PORT);
});  