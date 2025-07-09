// server.js (VERSÃO MODIFICADA COM CONEXÃO AO BANCO DE DADOS)

// === IMPORTAÇÕES ===
// Note que usamos 'require' pois seu projeto está configurado para CommonJS
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mongoose = require('mongoose'); // <-- 1. Importamos o Mongoose
require('dotenv').config(); // Carrega variáveis do .env (MONGO_URI, etc)

const app = express();
const PORT = process.env.PORT || 3001;

// === MIDDLEWARE ===
app.use(cors());
app.use(express.json());

// === CONEXÃO COM O BANCO DE DADOS (MongoDB com Mongoose) ===
const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            console.error("ERRO FATAL: Variável de ambiente MONGO_URI não definida!");
            process.exit(1); // Encerra a aplicação se a URI não estiver configurada
        }

        await mongoose.connect(mongoUri);

        console.log("🚀 Conectado ao MongoDB Atlas via Mongoose!");

        // Opcional: Ouvir eventos de conexão para mais logs
        mongoose.connection.on('error', (err) => console.error("❌ Mongoose erro de conexão:", err));
        mongoose.connection.on('disconnected', () => console.warn("⚠️ Mongoose desconectado!"));

    } catch (err) {
        console.error("❌ ERRO FATAL: Falha ao conectar ao MongoDB:", err.message);
        process.exit(1); // Encerra se a conexão inicial falhar
    }
};

// === DEFINIÇÃO DOS MODELOS (Mongoose Schemas) ===
// Um Schema é o "molde" de como os dados serão guardados no banco.
const veiculoSchema = new mongoose.Schema({
    id: Number,
    modelo: String,
    ano: Number,
    destaque: String,
    imagemUrl: String
});

// O Model é a ferramenta para interagir com a coleção "veiculos" no banco.
const Veiculo = mongoose.model('Veiculo', veiculoSchema);

// --- DADOS MOCKADOS (Vamos manter alguns por enquanto, mas os veículos virão do banco!) ---

// ESTES DADOS SERÃO IGNORADOS, POIS A ROTA AGORA BUSCA DO BANCO
/*
const veiculosDestaque = [
    { id: 1, modelo: "Honda Civic G10", ano: 2021, ... },
    ...
];
*/

const servicosOferecidos = [
    { nome: "Troca de Óleo e Filtro", descricao: "Utilizamos óleos sintéticos e semi-sintéticos de alta qualidade.", precoEstimado: "R$ 250,00" },
    { nome: "Alinhamento e Balanceamento", descricao: "Equipamentos de última geração para garantir a estabilidade do seu veículo.", precoEstimado: "R$ 150,00" },
    { nome: "Revisão de Freios", descricao: "Inspeção completa de pastilhas, discos e fluido de freio.", precoEstimado: "R$ 300,00" },
    { nome: "Diagnóstico Eletrônico", descricao: "Identificação de falhas com scanner automotivo especializado.", precoEstimado: "R$ 120,00" }
];

const viagensPopulares = [
    { id: 1, destino: "Serra Gaúcha", pais: "Brasil", descricao: "Estradas sinuosas...", imagemUrl: "imagens/serra-gaucha.jpg" },
    { id: 2, destino: "Rota 66", pais: "EUA", descricao: "A icônica 'Mother Road'...", imagemUrl: "imagens/rota-66.jpg" },
    { id: 3, destino: "Deserto do Atacama", pais: "Chile", descricao: "Uma aventura off-road...", imagemUrl: "imagens/atacama.jpg" }
];

const dicasManutencao = { /* ... seu objeto de dicas ... */ };


// === ROTAS DA API ===

// Rota de Teste
app.get('/api', (req, res) => {
    res.json({ message: "API da Garagem Interativa está funcionando e conectada ao DB!" });
});

// Rota para Veículos em Destaque (AGORA BUSCANDO DO BANCO DE DADOS!)
app.get('/api/garagem/veiculos-destaque', async (req, res) => {
    console.log('GET /api/garagem/veiculos-destaque - Recebido! Buscando no DB...');
    try {
        // Usa o Model 'Veiculo' para encontrar (.find()) todos os documentos na coleção.
        const veiculosDoBanco = await Veiculo.find({});
        
        // Se não encontrar nenhum, pode-se inserir os dados iniciais uma única vez
        if (veiculosDoBanco.length === 0) {
            console.log("Banco de veículos vazio. Inserindo dados iniciais...");
            const veiculosIniciais = [
                { id: 1, modelo: "Honda Civic G10", ano: 2021, destaque: "Confiabilidade e Economia", imagemUrl: "imagens/civic-removebg-preview.png" },
                { id: 2, modelo: "Pagani Huayra", ano: 2020, destaque: "Performance Extrema", imagemUrl: "imagens/paganiRosa-removebg-preview.png" },
                { id: 3, modelo: "Mercedes-Benz Actros", ano: 2022, destaque: "Robustez para Longas Distâncias", imagemUrl: "imagens/caminhão-removebg-preview.png" },
                { id: 4, modelo: "Kawasaki Ninja ZX-6R", ano: 2023, destaque: "Agilidade e Estilo Esportivo", imagemUrl: "imagens/kawasaki-Photoroom.png" }
            ];
            await Veiculo.insertMany(veiculosIniciais);
            console.log("Dados iniciais inseridos!");
            res.json(veiculosIniciais);
        } else {
            res.json(veiculosDoBanco);
        }

    } catch (error) {
        console.error("Erro ao buscar veículos no banco de dados:", error);
        res.status(500).json({ message: "Erro ao buscar dados dos veículos." });
    }
});

// Rota para Serviços Oferecidos (continua usando dados mockados por enquanto)
app.get('/api/garagem/servicos-oferecidos', (req, res) => {
    console.log('GET /api/garagem/servicos-oferecidos - Recebido!');
    res.json(servicosOferecidos);
});

// ... (Suas outras rotas: /api/viagens-populares, /api/dicas-manutencao, /clima) ...
// Nenhuma alteração necessária nelas por agora.
app.get('/api/viagens-populares', (req, res) => {
    console.log('GET /api/viagens-populares - Recebido!');
    res.json(viagensPopulares);
});

app.get('/api/dicas-manutencao/:tipo?', (req, res) => { /* ... seu código ... */ });

app.get('/clima', async (req, res) => { /* ... seu código ... */ });


// === INICIALIZAÇÃO DO SERVIDOR ===
// Criamos uma função para garantir que o servidor só inicie APÓS a conexão com o banco.
const startServer = async () => {
    await connectDB(); // Primeiro, tenta conectar ao banco.

    app.listen(PORT, () => {
        console.log(`✅ Servidor da GARAGEM INTERATIVA rodando na porta ${PORT}`);
        console.log(`Acesse a API de teste em http://localhost:${PORT}/api`);
    });
};

// Chama a função para iniciar todo o processo.
startServer();
