// server.js (Completo e Modificado)

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();

const Veiculo = require('./models/veiculo.js'); 
const Manutencao = require('./models/Manutencao.js'); // NOVO: Import do modelo de Manutenção

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


// === ROTAS DA API (ORGANIZADAS E SEM DUPLICATAS) ===

// 1. ROTAS DE VEÍCULOS (CRUD)
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

app.put('/api/veiculos/:id', async (req, res) => {
    console.log(`[PUT /api/veiculos/${req.params.id}] Requisição recebida.`);
    try {
        const veiculoAtualizado = await Veiculo.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true }
        );
        if (!veiculoAtualizado) {
            return res.status(404).json({ error: 'Veículo não encontrado para atualização.' });
        }
        res.json(veiculoAtualizado);
    } catch (error) {
        if (error.code === 11000) return res.status(409).json({ error: 'Já existe um veículo com esta placa.' });
        if (error.name === 'ValidationError') {
             const messages = Object.values(error.errors).map(val => val.message);
             return res.status(400).json({ error: messages.join(' ') });
        }
        res.status(500).json({ error: 'Erro interno ao atualizar veículo.' });
    }
});

app.delete('/api/veiculos/:id', async (req, res) => {
    console.log(`[DELETE /api/veiculos/${req.params.id}] Requisição recebida.`);
    try {
        // NOVO: Antes de deletar o veículo, deletar manutenções associadas (boa prática)
        await Manutencao.deleteMany({ veiculo: req.params.id });
        
        const veiculoDeletado = await Veiculo.findByIdAndDelete(req.params.id);
        if (!veiculoDeletado) return res.status(404).json({ error: 'Veículo não encontrado.' });
        
        res.json({ message: 'Veículo e suas manutenções foram deletados com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: 'Erro interno ao deletar veículo.' });
    }
});


// 2. ROTAS DE MANUTENÇÃO (NOVAS)
// Rota para CRIAR uma nova manutenção para um veículo específico
app.post('/api/veiculos/:veiculoId/manutencoes', async (req, res) => {
    console.log(`[POST /api/veiculos/${req.params.veiculoId}/manutencoes] Requisição para criar manutenção.`);
    try {
        const { veiculoId } = req.params;

        // 1. Validar se o veículo existe
        const veiculo = await Veiculo.findById(veiculoId);
        if (!veiculo) {
            return res.status(404).json({ error: 'Veículo não encontrado. Não é possível adicionar manutenção.' });
        }

        // 2. Criar a nova manutenção associando o ID do veículo
        const novaManutencao = await Manutencao.create({
            ...req.body,
            veiculo: veiculoId // Garante que a manutenção seja associada ao veículo correto
        });

        // 3. Retornar sucesso
        res.status(201).json(novaManutencao);

    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ error: messages.join(' ') });
        }
        console.error("Erro ao criar manutenção:", error);
        res.status(500).json({ error: 'Erro interno do servidor ao criar manutenção.' });
    }
});

// Rota para LISTAR todas as manutenções de um veículo específico
app.get('/api/veiculos/:veiculoId/manutencoes', async (req, res) => {
    console.log(`[GET /api/veiculos/${req.params.veiculoId}/manutencoes] Requisição para listar manutenções.`);
    try {
        const { veiculoId } = req.params;

        // (Opcional, mas bom) Validar se o veículo existe para dar um feedback melhor
        const veiculo = await Veiculo.findById(veiculoId);
        if (!veiculo) {
            return res.status(404).json({ error: 'Veículo não encontrado.' });
        }

        // Buscar todas as manutenções que pertencem a este veículo, ordenadas pela mais recente
        const manutencoes = await Manutencao.find({ veiculo: veiculoId }).sort({ data: -1 });

        res.status(200).json(manutencoes);

    } catch (error) {
        console.error("Erro ao buscar manutenções:", error);
        res.status(500).json({ error: 'Erro interno do servidor ao buscar manutenções.' });
    }
});


// 3. ROTA DE DESTAQUES (COM A LÓGICA FIXA)
app.get('/api/garagem/veiculos-destaque', (req, res) => {
    console.log("[GET /api/garagem/veiculos-destaque] Requisição recebida para destaques FIXOS.");
    const veiculosDestaqueOriginais = [
        { modelo: "Honda Civic", ano: "2021", destaque: "O carro confiável", imagemUrl: "imagens/civic-removebg-preview.png" },
        { modelo: "Pagani Huayra", ano: "2023", destaque: "A pura esportividade", imagemUrl: "imagens/paganiRosa-removebg-preview.png" },
        { modelo: "Mercedes-Benz Actros", ano: "2022", destaque: "Força para o trabalho", imagemUrl: "imagens/caminhão-removebg-preview.png" },
        { modelo: "Kawasaki Ninja", ano: "2024", destaque: "Velocidade em duas rodas", imagemUrl: "imagens/kawasaki-Photoroom.png" }
    ];
    res.json(veiculosDestaqueOriginais);
});


// 4. ROTA DE SERVIÇOS
app.get('/api/garagem/servicos-oferecidos', (req, res) => {
    console.log("[GET /api/garagem/servicos-oferecidos] Requisição recebida.");
    res.json(servicosOferecidos);
});


// 5. ROTA DE DICAS
app.get('/api/dicas-manutencao/:tipo?', (req, res) => {
    console.log(`[GET /api/dicas-manutencao] Requisição recebida para tipo: ${req.params.tipo || 'geral'}`);
    const tipo = req.params.tipo?.toLowerCase();
    res.json(dicasPorTipo[tipo] || dicasGerais);
});


// 6. ROTA DE CLIMA
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
        console.error("Erro na API de Clima:", error.message);
        res.status(error.response?.status || 500).json({ message: "Erro ao buscar dados do clima." });
    }
});


// INICIALIZAÇÃO DO SERVIDOR
const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => console.log(`✅ Servidor da GARAGEM INTERATIVA rodando na porta ${PORT}`));
};

startServer();