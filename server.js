// server.js (VERSÃO CORRETA PARA O PROJETO GARAGEM INTERATIVA)

const express = require('express');
const cors = require('cors'); // Pacote para habilitar o CORS
const axios = require('axios'); // Para fazer a chamada à API do OpenWeather
require('dotenv').config(); // Para carregar variáveis de ambiente

const app = express();
// Se você for fazer deploy no Render, use a variável de ambiente PORT. Senão, use a porta 3000.
const PORT = process.env.PORT || 3001;

// === MIDDLEWARE ===
// Habilita o CORS para todas as rotas. Essencial para o frontend poder acessar o backend.
app.use(cors());
app.use(express.json());

// === DADOS MOCKADOS (SIMULAÇÃO DE BANCO DE DADOS) ===

const veiculosDestaque = [
    { id: 1, modelo: "Honda Civic G10", ano: 2021, destaque: "Confiabilidade e Economia", imagemUrl: "imagens/civic-removebg-preview.png" },
    { id: 2, modelo: "Pagani Huayra", ano: 2020, destaque: "Performance Extrema", imagemUrl: "imagens/paganiRosa-removebg-preview.png" },
    { id: 3, modelo: "Mercedes-Benz Actros", ano: 2022, destaque: "Robustez para Longas Distâncias", imagemUrl: "imagens/caminhão-removebg-preview.png" },
    { id: 4, modelo: "Kawasaki Ninja ZX-6R", ano: 2023, destaque: "Agilidade e Estilo Esportivo", imagemUrl: "imagens/kawasaki-Photoroom.png" }
];

const servicosOferecidos = [
    { nome: "Troca de Óleo e Filtro", descricao: "Utilizamos óleos sintéticos e semi-sintéticos de alta qualidade.", precoEstimado: "R$ 250,00" },
    { nome: "Alinhamento e Balanceamento", descricao: "Equipamentos de última geração para garantir a estabilidade do seu veículo.", precoEstimado: "R$ 150,00" },
    { nome: "Revisão de Freios", descricao: "Inspeção completa de pastilhas, discos e fluido de freio.", precoEstimado: "R$ 300,00" },
    { nome: "Diagnóstico Eletrônico", descricao: "Identificação de falhas com scanner automotivo especializado.", precoEstimado: "R$ 120,00" }
];

const viagensPopulares = [
    { id: 1, destino: "Serra Gaúcha", pais: "Brasil", descricao: "Estradas sinuosas e paisagens deslumbrantes, ideal para uma viagem de carro ou moto.", imagemUrl: "https://i.imgur.com/kY7p6s8.jpeg" },
    { id: 2, destino: "Rota 66", pais: "EUA", descricao: "A icônica 'Mother Road' que cruza os Estados Unidos, um sonho para qualquer aventureiro.", imagemUrl: "https://i.imgur.com/gKEd1gC.jpeg" },
    { id: 3, destino: "Deserto do Atacama", pais: "Chile", descricao: "Uma aventura off-road por um dos desertos mais áridos e belos do mundo.", imagemUrl: "https://i.imgur.com/1vJdJdF.jpeg" }
];

const dicasManutencao = {
    gerais: [
        { dica: "Calibre os pneus semanalmente, incluindo o estepe." },
        { dica: "Verifique o nível do óleo do motor e da água do radiador a cada 15 dias." },
        { dica: "Não ande com o carro na 'reserva' do tanque, isso pode danificar a bomba de combustível." }
    ],
    carro: [
        { dica: "Faça o rodízio dos pneus a cada 10.000 km para um desgaste uniforme." },
        { dica: "Troque o filtro de ar do motor junto com a troca de óleo." }
    ],
    moto: [
        { dica: "Lubrifique e verifique a tensão da corrente a cada 500 km." },
        { dica: "Verifique o estado das pastilhas de freio regularmente." }
    ],
    caminhao: [
        { dica: "Verifique o sistema de freios pneumáticos e o nível de Arla 32 diariamente." },
        { dica: "Realize a lubrificação dos pontos de graxa do chassi conforme o manual." }
    ]
};


// === ROTAS DA API ===

// Rota de Teste
app.get('/api', (req, res) => {
    res.json({ message: "API da Garagem Interativa está funcionando!" });
});

// Rota para Veículos em Destaque
app.get('/api/garagem/veiculos-destaque', (req, res) => {
    console.log('GET /api/garagem/veiculos-destaque - Recebido!');
    res.json(veiculosDestaque);
});

// Rota para Serviços Oferecidos
app.get('/api/garagem/servicos-oferecidos', (req, res) => {
    console.log('GET /api/garagem/servicos-oferecidos - Recebido!');
    res.json(servicosOferecidos);
});

// Rota para Viagens Populares
app.get('/api/viagens-populares', (req, res) => {
    console.log('GET /api/viagens-populares - Recebido!');
    res.json(viagensPopulares);
});

// Rota para Dicas de Manutenção (Gerais e por tipo)
app.get('/api/dicas-manutencao/:tipo?', (req, res) => {
    const tipo = req.params.tipo;
    console.log(`GET /api/dicas-manutencao/${tipo || ''} - Recebido!`);
    if (tipo && dicasManutencao[tipo]) {
        res.json(dicasManutencao[tipo]);
    } else if (!tipo) {
        res.json(dicasManutencao.gerais);
    } else {
        res.status(404).json({ error: `Nenhuma dica encontrada para o tipo '${tipo}'. Tipos válidos: carro, moto, caminhao.` });
    }
});

// Rota para Previsão do Tempo (Proxy para OpenWeatherMap)
app.get('/clima', async (req, res) => {
    const cidade = req.query.cidade;
    const apiKey = process.env.OPENWEATHER_API_KEY;
    console.log(`GET /clima?cidade=${cidade} - Recebido!`);

    if (!apiKey) {
        console.error("ERRO: OPENWEATHER_API_KEY não encontrada no .env");
        return res.status(500).json({ message: "Chave da API do OpenWeather não está configurada no servidor." });
    }
    if (!cidade) {
        return res.status(400).json({ message: "O parâmetro 'cidade' é obrigatório." });
    }

    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${cidade}&appid=${apiKey}&units=metric&lang=pt_br`;

    try {
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        if (error.response) {
            console.error("Erro da API OpenWeather:", error.response.data);
            res.status(error.response.status).json({ message: error.response.data.message || "Erro ao buscar dados do clima (cidade não encontrada?)." });
        } else {
            console.error("Erro na requisição para OpenWeather:", error.message);
            res.status(500).json({ message: "Erro interno no servidor ao contatar a API de clima." });
        }
    }
});


// === INICIALIZAÇÃO DO SERVIDOR ===
app.listen(PORT, () => {
    console.log(`🚀 Servidor da GARAGEM INTERATIVA rodando na porta ${PORT}`);
    console.log(`Acesse a API de teste em http://localhost:${PORT}/api`);
});
