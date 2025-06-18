// server.js
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000; // Mantendo a porta 3000 que você já usa
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY_BACKEND;

// Middleware para habilitar CORS
app.use(cors());
// Middleware para parsear JSON
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")))

// ====================================================================
// ===== NOVOS DADOS PARA A AULA 1 (Dicas de Manutenção) ==========
// ====================================================================

// Dados fixos para simular um banco de dados
const dicasManutencaoGerais = [
    { id: 1, dica: "Verifique o nível do óleo do motor regularmente." },
    { id: 2, dica: "Calibre os pneus semanalmente para maior segurança e economia." },
    { id: 3, dica: "Confira o fluido de arrefecimento (radiador) com o motor frio." },
    { id: 4, dica: "Teste os freios e fique atento a qualquer ruído estranho." },
    { id: 5, dica: "Verifique o funcionamento de todas as luzes do veículo." }
];

const dicasPorTipo = {
    carro: [
        { id: 10, dica: "Faça o rodízio dos pneus a cada 10.000 km para um desgaste uniforme." },
        { id: 11, dica: "Verifique o alinhamento e balanceamento a cada 6 meses." }
    ],
    moto: [
        { id: 20, dica: "Lubrifique e verifique a tensão da corrente frequentemente." },
        { id: 21, dica: "Inspecione as pastilhas de freio e o nível do fluido de freio." }
    ],
    caminhao: [
        { id: 30, dica: "Verifique o sistema de freios a ar e drene os reservatórios." },
        { id: 31, dica: "Inspecione o estado dos pneus e a pressão, especialmente sob carga." }
    ]
};

// ====================================================================
// ===== NOVAS ROTAS DA AULA 1 (Dicas de Manutenção) ================
// ====================================================================

// Endpoint para retornar todas as dicas de manutenção gerais
app.get('/api/dicas-manutencao', (req, res) => {
    console.log('[Servidor] Requisição recebida para /api/dicas-manutencao');
    res.json(dicasManutencaoGerais);
});

// Endpoint para retornar dicas por tipo de veículo
app.get('/api/dicas-manutencao/:tipoVeiculo', (req, res) => {
    const { tipoVeiculo } = req.params;
    console.log(`[Servidor] Requisição recebida para /api/dicas-manutencao/${tipoVeiculo}`);
    
    // Converte o parâmetro para minúsculas para corresponder às chaves do objeto
    const dicas = dicasPorTipo[tipoVeiculo.toLowerCase()];

    if (dicas) {
        res.json(dicas);
    } else {
        res.status(404).json({ error: `Nenhuma dica encontrada para o tipo: ${tipoVeiculo}` });
    }
});


// ====================================================================
// ===== ROTA EXISTENTE (Previsão do Tempo) ===========================
// ====================================================================
app.get('/clima', async (req, res) => {
    const { cidade } = req.query;

    if (!OPENWEATHER_API_KEY || OPENWEATHER_API_KEY.length < 30) {
        console.error('Chave da API OpenWeatherMap não configurada ou inválida no servidor.');
        return res.status(500).json({ message: 'Erro de configuração do servidor: Chave da API ausente ou inválida.' });
    }
    if (!cidade) {
        return res.status(400).json({ message: 'O parâmetro "cidade" é obrigatório.' });
    }

    const openWeatherUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(cidade)}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=pt_br`;

    try {
        console.log(`Backend: Recebida requisição para cidade: ${cidade}`);
        const response = await axios.get(openWeatherUrl);
        res.json(response.data);
        console.log(`Backend: Resposta da OpenWeatherMap enviada para o cliente para cidade: ${cidade}`);

    } catch (error) {
        console.error('Backend: Erro ao buscar dados do OpenWeatherMap:');
        if (error.response) {
            console.error(' - Status:', error.response.status);
            console.error(' - Data:', error.response.data);
            res.status(error.response.status).json({
                message: error.response.data.message || 'Erro ao contatar o serviço de clima externo.',
                details: error.response.data
            });
        } else if (error.request) {
            console.error(' - Error Request:', error.request);
            res.status(503).json({ message: 'Serviço de clima externo indisponível ou não respondeu.' });
        } else {
            console.error(' - Error Message:', error.message);
            res.status(500).json({ message: 'Erro interno no servidor ao processar a requisição de clima.' });
        }
    }
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor backend da Garagem Inteligente rodando na porta ${PORT}`);
    if (!OPENWEATHER_API_KEY || OPENWEATHER_API_KEY.length < 30) {
        console.warn('-----------------------------------------------------------------------------');
        console.warn('ATENÇÃO: A variável de ambiente OPENWEATHER_API_KEY_BACKEND não está configurada');
        console.warn('corretamente no arquivo .env. O endpoint de clima NÃO FUNCIONARÁ.');
        console.warn('Verifique se o arquivo .env existe e contém a chave correta.');
        console.warn('-----------------------------------------------------------------------------');
    } else {
        console.log('Chave da API OpenWeatherMap carregada com sucesso do .env.');
    }
});
