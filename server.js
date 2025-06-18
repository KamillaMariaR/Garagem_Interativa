// server.js (VERSÃO FINAL E COMPLETA GARANTIDA)
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY_BACKEND;

// Middlewares essenciais
app.use(cors());
app.use(express.json());

// ====================================================================
// ===== DADOS MOCK (Simulação de Banco de Dados) ===================
// ====================================================================
const dicasManutencaoGerais = [
    { id: 1, dica: "Verifique o nível do óleo do motor regularmente." },
    { id: 2, dica: "Calibre os pneus semanalmente para maior segurança e economia." },
    { id: 3, dica: "Confira o fluido de arrefecimento (radiador) com o motor frio." }
];
const dicasPorTipo = {
    carro: [{ id: 10, dica: "Faça o rodízio dos pneus a cada 10.000 km." }],
    moto: [{ id: 20, dica: "Lubrifique e verifique a tensão da corrente frequentemente." }],
    caminhao: [{ id: 30, dica: "Verifique o sistema de freios a ar e drene os reservatórios." }]
};
const veiculosDestaque = [
    { id: 10, modelo: "Mustang Mach-E", ano: 2024, destaque: "Performance Elétrica Icônica", imagemUrl: "https://www.ford.com/is/image/content/dam/vdm_ford/live/en_us/ford/nameplate/mustang-mach-e/2023/collections/dm/23_FRD_MME_52523.tif?croppathe=1_3x2&wid=720" },
    { id: 11, modelo: "Cybertruck", ano: 2024, destaque: "O Futuro da Resistência", imagemUrl: "https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Cybertruck-Main-Hero-Desktop-LHD.jpg" }
];
const servicosGaragem = [
    { id: "svc001", nome: "Diagnóstico Eletrônico Completo", descricao: "Verificação de todos os sistemas eletrônicos.", precoEstimado: "R$ 250,00" },
    { id: "svc002", nome: "Alinhamento e Balanceamento 3D", descricao: "Para uma direção perfeita e maior durabilidade dos pneus.", precoEstimado: "R$ 180,00" }
];
const viagensPopulares = [
    { id: 1, destino: "Viagem na Serra", pais: "Brasil", descricao: "Curta o frio e as belas paisagens com seu melhor veículo.", imagemUrl: "imagens/civic-removebg-preview.png" },
    { id: 2, destino: "Passeio Esportivo", pais: "Mônaco", descricao: "Sinta a velocidade em estradas sinuosas com um superesportivo.", imagemUrl: "imagens/paganiRosa-removebg-preview.png" }
];

// ====================================================================
// ===== ROTAS DA API ===============================================
// ====================================================================
app.get('/api/dicas-manutencao', (req, res) => res.json(dicasManutencaoGerais));
app.get('/api/dicas-manutencao/:tipoVeiculo', (req, res) => {
    const dicas = dicasPorTipo[req.params.tipoVeiculo.toLowerCase()];
    dicas ? res.json(dicas) : res.status(404).json({ error: `Nenhuma dica encontrada` });
});
app.get('/api/garagem/veiculos-destaque', (req, res) => res.json(veiculosDestaque));
app.get('/api/garagem/servicos-oferecidos', (req, res) => res.json(servicosGaragem));
app.get('/api/viagens-populares', (req, res) => res.json(viagensPopulares));

app.get('/clima', async (req, res) => {
    const { cidade } = req.query;
    if (!OPENWEATHER_API_KEY) return res.status(500).json({ message: 'Erro de configuração do servidor.' });
    if (!cidade) return res.status(400).json({ message: 'O parâmetro "cidade" é obrigatório.' });
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${cidade}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=pt_br`;
    try {
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ message: error.response?.data?.message || 'Erro' });
    }
});

// ====================================================================
// ===== INICIALIZAÇÃO DO SERVIDOR ====================================
// ====================================================================
app.listen(PORT, () => {
    console.log(`🚀 Servidor backend da Garagem Inteligente rodando na porta ${PORT}`);
});
