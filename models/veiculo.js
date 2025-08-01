// models/veiculo.js

const mongoose = require('mongoose');

const veiculoSchema = new mongoose.Schema({
    placa: { 
        type: String, 
        required: [true, 'A placa é obrigatória.'],
        unique: true,
        uppercase: true,
        trim: true
    },
    marca: { 
        type: String, 
        required: [true, 'A marca é obrigatória.'] 
    },
    modelo: { 
        type: String, 
        required: [true, 'O modelo é obrigatório.'] 
    },
    ano: { 
        type: Number, 
        required: [true, 'O ano é obrigatório.'],
        min: [1900, 'O ano deve ser no mínimo 1900.'],
        max: [new Date().getFullYear() + 1, `O ano não pode ser maior que ${new Date().getFullYear() + 1}.`]
    },
    cor: { 
        type: String,
        trim: true
    }
}, { 
    timestamps: true 
});

const Veiculo = mongoose.model('Veiculo', veiculoSchema);

module.exports = Veiculo;