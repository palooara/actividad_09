const express = require("express");
const server = express();

const path = require("path");

const PORT = 3000;

//Utiliamos un middleware para ver el frontend.

//middleware: función que está entre la petición y la respuesta del servidor. Resuelve ciertas coas antes de que el servidor envíe la respuesta. Tien 3 parámetros: req, res y next. El siguiente middleware se ejecuta después de que el anterior haya terminado.

function pruebaMidd(req, res, next){
    console.log("pasó por nuestro middleware");

    next(); //llama al siguiente middleware
}

server.use(pruebaMidd); //llama y ejecuta los middleware

//usamos un middleware para ver el front
server.use(express.static("public"));
//server.use(express.static(path.join(__dirname, "public"))); //otra forma de hacerlo



server.listen(PORT, () =>{
    console.log('servidor escuchando en el puerto http://localhost:' + PORT);
}); 