const { Schema, model } = require("mongoose");

const addressScrema = new Schema({
    country: {
        type: String,
        allowNull: false,
        default: null,
    },
    state: {
        type: String,
        allowNull: false,
        default: null,
    },
    city: {
        type: String,
        allowNull: false,
        default: null,
    },
    latitude: {
        type: Number,
        default: null,
    },
    longitude: {
        type: Number,
        default: null
    },
},
    {
        timestamps: true, //createdAt, updatedAt. Armazena automatico pelo mongoose dt de criação e atualização
    });

module.exports = model('Address', addressScrema);