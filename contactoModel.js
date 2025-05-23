const mongoose = require("mongoose");

const contactoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    email: { type: String, requiered: true},
    fechaNacimiento: { type: Date, required: true },
    id: { type: String, required: true }
});

const Contacto = mongoose.model("contacto", contactoSchema);

module.exports = Contacto;