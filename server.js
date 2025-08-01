// server.js (VERSÃO FINAL E MAIS ROBUSTA)

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();

const Veiculo = require('./models/veiculo.js'); 

const app = express();
const PORT = process.env.PORT || 3001;

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// CONEXÃO COM O BANCO DE DADOS
const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            console.error("ERRO FATAL: Variável de ambiente MONGO_URI não definida!");
            process.exit(1);
        }
        await mongoose.connect(mongoUri);
        console.log("🚀 Conectado ao MongoDB Atlas via Mongoose!");
    } catch (err) {
        console.error("❌ ERRO FATAL: Falha ao conectar ao MongoDB:", err.message);
        process.exit(1);
    }
};

// DADOS MOCKADOS
const servicosOferecidos = [
    { nome: "Troca de Óleo e Filtro", descricao: "Serviço completo com óleo de alta performance.", precoEstimado: "R$ 250,00" },
    { nome: "Alinhamento e Balanceamento", descricao: "Precisão para uma direção mais segura.", precoEstimado: "R$ 150,00" },
];
const dicasGerais = [{dica: "Verifique a calibragem dos pneus semanalmente."},{dica: "Troque o óleo do motor no prazo recomendado pelo fabricante."}];
const dicasPorTipo = {
    carro: [{dica: "Faça o rodízio dos pneus do carro a cada 10.000 km."}],
    moto: [{dica: "Lubrifique a corrente da moto regularmente."}],
};


// === ROTAS DA API ===

// VEÍCULOS
app.post('/api/veiculos', async (req, res) => {
    console.log("[POST /api/veiculos] Requisição recebida.");
    try {
        const veiculoCriado = await Veiculo.create(req.body);
        res.status(201).json(veiculoCriado);
    } catch (error) {
        if (error.code === 11000) return res.status(409).json({ error: 'Veículo com esta placa já existe.' });
        if (error.name === 'ValidationError') {
             const messages = Object.values(error.errors).map(val => val.message);
             return res.status(400).json({ error: messages.join(' ') });
        }
        res.status(500).json({ error: 'Erro interno ao criar veículo.' });
    }
});

app.get('/api/veiculos', async (req, res) => {
    console.log("[GET /api/veiculos] Requisição recebida.");
    try {
        const todosOsVeiculos = await Veiculo.find().sort({ createdAt: -1 });
        res.json(todosOsVeiculos);
    } catch (error) {
        res.status(500).json({ error: 'Erro interno ao buscar veículos.' });
    }
});

app.delete('/api/veiculos/:id', async (req, res) => {
    console.log(`[DELETE /api/veiculos/${req.params.id}] Requisição recebida.`);
    try {
        const veiculoDeletado = await Veiculo.findByIdAndDelete(req.params.id);
        if (!veiculoDeletado) return res.status(404).json({ error: 'Veículo não encontrado.' });
        res.json({ message: 'Veículo deletado com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: 'Erro interno ao deletar veículo.' });
    }
});

// DESTAQUES
app.get('/api/garagem/veiculos-destaque', async (req, res) => {
    console.log("[GET /api/garagem/veiculos-destaque] Requisição recebida.");
    try {
        const veiculosDoBanco = await Veiculo.find({}).sort({ createdAt: -1 }).limit(4);
        const veiculosFormatados = veiculosDoBanco.map(v => ({
            modelo: `${v.marca} ${v.modelo}`, ano: v.ano, destaque: `Placa: ${v.placa}`,
            imagemUrl: v.imagemUrl || 'imagens/civic-removebg-preview.png'
        }));
        res.json(veiculosFormatados);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar veículos para destaque." });
    }
});

// SERVIÇOS
app.get('/api/garagem/servicos-oferecidos', (req, res) => {
    console.log("[GET /api/garagem/servicos-oferecidos] Requisição recebida.");
    res.json(servicosOferecidos);
});

// DICAS
app.get('/api/dicas-manutencao/:tipo?', (req, res) => {
    console.log(`[GET /api/dicas-manutencao] Requisição recebida para tipo: ${req.params.tipo || 'geral'}`);
    const tipo = req.params.tipo?.toLowerCase();
    res.json(dicasPorTipo[tipo] || dicasGerais);
});

// CLIMA
app.get('/clima', async (req, res) => {
    const cidade = req.query.cidade;
    const apiKey = process.env.OPENWEATHER_API_KEY;
    console.log(`[GET /clima] Requisição recebida para cidade: ${cidade}`);
    if (!cidade || !apiKey) return res.status(400).json({ message: "Cidade ou chave de API não fornecida." });
    const url = `http://api.openweathermap.org/data/2.5/forecast?q=${cidade}&appid=${apiKey}&units=metric&lang=pt_br`;
    try {
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ message: "Erro ao buscar dados do clima." });
    }
});


// INICIALIZAÇÃO DO SERVIDOR
const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => console.log(`✅ Servidor da GARAGEM INTERATIVA rodando na porta ${PORT}`));
};

startServer();
