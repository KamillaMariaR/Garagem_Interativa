// js/main.js (VERSÃO FINAL E COMPLETA PARA A PÁGINA INICIAL)

// Variáveis Globais para a Página Principal
const garagem = new Garagem();
let dadosPrevisaoGlobal = null;
let unidadeTemperaturaAtual = 'C';
const CHAVE_STORAGE_UNIDADE_TEMP = 'unidadeTemperaturaPreferida';
const backendUrl = 'http://localhost:3001'; // <-- CORRIGIDO AQUI

// ==================================================================
// FUNÇÕES AUXILIARES (Previsão do tempo, Fetch, etc.)
// (Estas funções são as mesmas de antes, sem alterações)
// ==================================================================

function celsiusParaFahrenheit(celsius) { return (celsius * 9 / 5) + 32; }
function formatarTemperatura(tempCelsius) { return unidadeTemperaturaAtual === 'F' ? `${celsiusParaFahrenheit(tempCelsius).toFixed(1)}°F` : `${tempCelsius.toFixed(1)}°C`; }
function formatarTemperaturaInteira(tempCelsius) { return unidadeTemperaturaAtual === 'F' ? `${celsiusParaFahrenheit(tempCelsius).toFixed(0)}°F` : `${tempCelsius.toFixed(0)}°C`; }
function getClassPorTemperatura(tempCelsius) {
    if (tempCelsius < 5) return 'temp-grad-muito-frio';
    if (tempCelsius < 12) return 'temp-grad-frio';
    if (tempCelsius < 20) return 'temp-grad-ameno';
    if (tempCelsius < 28) return 'temp-grad-quente';
    return 'temp-grad-muito-quente';
}
function renderizarPrevisaoCompleta() {
    if (!dadosPrevisaoGlobal) return;
    const previsaoResultadoDiv = document.getElementById('previsao-tempo-resultado');
    if (!previsaoResultadoDiv) return;
    const numDias = parseInt(document.querySelector('input[name="numDias"]:checked').value, 10);
    const destacarChuva = document.getElementById('destaque-chuva').checked;
    const destacarTempBaixa = document.getElementById('destaque-temp-baixa-check').checked;
    const valorTempBaixa = parseFloat(document.getElementById('destaque-temp-baixa-valor').value);
    const destacarTempAlta = document.getElementById('destaque-temp-alta-check').checked;
    const valorTempAlta = parseFloat(document.getElementById('destaque-temp-alta-valor').value);
    let htmlConteudo = `<h3>Clima em ${dadosPrevisaoGlobal.cidadeNome}, ${dadosPrevisaoGlobal.pais} para ${numDias === 1 ? 'o próximo dia' : `os próximos ${numDias} dias`}</h3><div class="previsao-dias-container">`;
    if (dadosPrevisaoGlobal.previsoes && dadosPrevisaoGlobal.previsoes.length > 0) {
        dadosPrevisaoGlobal.previsoes.slice(0, numDias).forEach(previsaoDia => {
            const dataObj = new Date(previsaoDia.data + "T00:00:00");
            const diaSemana = dataObj.toLocaleDateString('pt-BR', { weekday: 'long' });
            const dataFormatada = dataObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
            const iconUrl = `https://openweathermap.org/img/wn/${previsaoDia.icone}@2x.png`;
            let classesCard = `previsao-dia-card forecast-card-clickable ${getClassPorTemperatura(previsaoDia.temperatura)}`;
            if (destacarChuva && previsaoDia.descricao.toLowerCase().includes('chuva')) classesCard += " highlight-rain";
            if (destacarTempBaixa && !isNaN(valorTempBaixa) && previsaoDia.temperaturaMin <= valorTempBaixa) classesCard += " highlight-temp-low";
            if (destacarTempAlta && !isNaN(valorTempAlta) && previsaoDia.temperaturaMax >= valorTempAlta) classesCard += " highlight-temp-high";
            htmlConteudo += `<div class="${classesCard.trim()}" data-forecast-date="${previsaoDia.data}"><div class="card-content-wrapper"><h4>${diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1)}, ${dataFormatada} (clique)</h4><img src="${iconUrl}" alt="${previsaoDia.descricao}" class="weather-icon-daily"><p><strong>Min:</strong> ${formatarTemperatura(previsaoDia.temperaturaMin)} / <strong>Max:</strong> ${formatarTemperatura(previsaoDia.temperaturaMax)}</p><p><strong>Temp.:</strong> ${formatarTemperatura(previsaoDia.temperatura)}</p><p><strong>Condição:</strong> <span style="text-transform: capitalize;">${previsaoDia.descricao}</span></p><p><strong>Umidade:</strong> ${previsaoDia.umidade.toFixed(0)}%</p><div class="detalhes-horarios-container" style="display: none;"></div></div></div>`;
        });
    } else { htmlConteudo += `<p class="not-found">Nenhuma previsão detalhada encontrada.</p>`; }
    htmlConteudo += '</div>';
    previsaoResultadoDiv.innerHTML = htmlConteudo;
}
async function fetchForecastData(nomeCidade = "") {
    const url = `${backendUrl}/clima?cidade=${encodeURIComponent(nomeCidade)}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Erro ao buscar previsão.');
        const previsoesPorDia = {};
        if (data.list && data.list.length > 0) {
            data.list.forEach(item => {
                const dataISO = item.dt_txt.split(' ')[0];
                if (!previsoesPorDia[dataISO]) previsoesPorDia[dataISO] = { data: dataISO, entradas: [], temp_min_dia: item.main.temp_min, temp_max_dia: item.main.temp_max, descricoesContador: {}, iconesContador: {}, umidadeSoma: 0, tempSoma: 0, countEntradas: 0, descricaoPrincipal: null, iconePrincipal: null, tempPrincipal: null };
                const dia = previsoesPorDia[dataISO];
                dia.entradas.push(item);
                dia.temp_min_dia = Math.min(dia.temp_min_dia, item.main.temp_min);
                dia.temp_max_dia = Math.max(dia.temp_max_dia, item.main.temp_max);
                const desc = item.weather[0].description;
                const iconBase = item.weather[0].icon.substring(0, 2);
                dia.descricoesContador[desc] = (dia.descricoesContador[desc] || 0) + 1;
                dia.iconesContador[iconBase] = (dia.iconesContador[iconBase] || 0) + 1;
                dia.umidadeSoma += item.main.humidity;
                dia.tempSoma += item.main.temp;
                dia.countEntradas++;
                const hora = parseInt(item.dt_txt.split(' ')[1].split(':')[0]);
                if (hora >= 12 && hora <= 15 && !dia.descricaoPrincipal) { dia.descricaoPrincipal = desc; dia.iconePrincipal = item.weather[0].icon; dia.tempPrincipal = item.main.temp; }
            });
        }
        const resultadoFinal = Object.values(previsoesPorDia).map(dia => {
            const descFinal = dia.descricaoPrincipal || Object.keys(dia.descricoesContador).reduce((a, b) => dia.descricoesContador[a] > dia.descricoesContador[b] ? a : b, "");
            const iconBaseFinal = Object.keys(dia.iconesContador).reduce((a, b) => dia.iconesContador[a] > dia.iconesContador[b] ? a : b, "");
            return { data: dia.data, temperaturaMin: dia.temp_min_dia, temperaturaMax: dia.temp_max_dia, temperatura: dia.tempPrincipal ?? (dia.tempSoma / dia.countEntradas), descricao: descFinal, icone: dia.iconePrincipal || `${iconBaseFinal}d` || '01d', umidade: dia.umidadeSoma / dia.countEntradas, entradasHorarias: dia.entradas };
        });
        return { cidadeNome: data.city?.name || "Desconhecida", pais: data.city?.country || "", previsoes: resultadoFinal };
    } catch (error) { throw error; }
}
async function buscarEExibirDicas(url, container) {
    if (!container) return;
    container.innerHTML = '<p class="loading">Buscando dicas...</p>';
    try {
        const response = await fetch(url);
        const dicas = await response.json();
        if (!response.ok) throw new Error(dicas.error || 'Erro ao buscar as dicas.');
        container.innerHTML = dicas.length > 0 ? '<ul>' + dicas.map(d => `<li>${d.dica}</li>`).join('') + '</ul>' : '<p>Nenhuma dica encontrada.</p>';
    } catch (error) { container.innerHTML = `<p class="error">${error.message}</p>`; }
}
// js/main.js
async function carregarVeiculosDestaque() {
    const container = document.getElementById('cards-veiculos-destaque');
    if (!container) return;
    container.innerHTML = '<p class="loading">Carregando destaques...</p>';
    try {
        const response = await fetch(`${backendUrl}/api/garagem/veiculos-destaque`);
        if (!response.ok) throw new Error('Falha ao carregar veículos em destaque.');
        const veiculos = await response.json();
        // AQUI é onde os dados do server.js são usados para criar o HTML
        container.innerHTML = veiculos.length > 0 ? veiculos.map(v => `
            <div class="veiculo-card">
                <img src="${v.imagemUrl}" alt="${v.modelo}" onerror="this.onerror=null;this.src='imagens/civic-removebg-preview.png';"> 
                <h3>${v.modelo} (${v.ano})</h3> 
                <p><strong>Destaque:</strong> ${v.destaque}</p>
            </div>`).join('') : '<p>Nenhum veículo em destaque.</p>';
    } catch (error) { container.innerHTML = `<p class="error" style="width: 100%;">${error.message}</p>`; }
}


async function carregarServicosGaragem() {
    const lista = document.getElementById('lista-servicos-oferecidos');
    if (!lista) return;
    lista.innerHTML = '<li class="nenhum">Carregando serviços...</li>';
    try {
        const response = await fetch(`${backendUrl}/api/garagem/servicos-oferecidos`);
        if (!response.ok) throw new Error('Falha ao carregar os serviços.');
        const servicos = await response.json();
        lista.innerHTML = servicos.length > 0 ? servicos.map(s => `<li><strong>${s.nome}</strong><span>${s.descricao} (Preço Estimado: ${s.precoEstimado})</span></li>`).join('') : '<li class="nenhum">Nenhum serviço disponível.</li>';
    } catch (error) { lista.innerHTML = `<li class="error">${error.message}</li>`; }
}
async function carregarViagensPopulares() {
    const container = document.getElementById('cards-viagens-populares');
    if (!container) return;
    container.innerHTML = '<p class="loading">Buscando inspirações...</p>';
    try {
        const response = await fetch(`${backendUrl}/api/viagens-populares`);
        if (!response.ok) throw new Error('Falha ao carregar inspirações de viagem.');
        const viagens = await response.json();
        container.innerHTML = viagens.length > 0 ? viagens.map(v => `<div class="viagem-card"><img src="${v.imagemUrl}" alt="${v.destino}" onerror="this.onerror=null;this.src='https://i0.statig.com.br/bancodeimagens/9z/32/eh/9z32eh9qamnwz2hgvu2eyjkdz.jpg';"><h3>${v.destino}, ${v.pais}</h3><p>${v.descricao}</p></div>`).join('') : '<p>Nenhuma viagem em destaque.</p>';
    } catch (error) { container.innerHTML = `<p class="error" style="width: 100%;">${error.message}</p>`; }
}

// ==================================================================
// INICIALIZAÇÃO DA PÁGINA PRINCIPAL (`index.html`)
// ==================================================================
window.onload = () => {
    console.log("Página PRINCIPAL (`index.html`) carregada. Inicializando...");

    // 1. Carrega os dados das seções da página inicial
    carregarVeiculosDestaque();
    carregarServicosGaragem();
    carregarViagensPopulares();

    // 2. Carrega a garagem do localStorage
    const carregou = garagem.carregarGaragem();

    // 3. Se for o primeiro acesso do usuário (localStorage vazio), cria os veículos padrão
    if (!carregou || Object.keys(garagem.veiculos).length === 0) {
        console.log("Primeiro acesso ou localStorage vazio. Criando veículos padrão...");
        garagem.criarCarro(); 
        garagem.criarMoto(); 
        garagem.criarCarroEsportivo(); 
        garagem.criarCaminhao();
    }
    
    // 4. Atualiza a lista de agendamentos (que existe na página inicial)
    garagem.atualizarListaAgendamentos();

    // 5. Configura os event listeners para os elementos que ESTÃO na página inicial
    const btnDicasGerais = document.getElementById('btn-buscar-dicas-gerais');
    const btnDicasEspecificas = document.getElementById('btn-buscar-dicas-especificas');
    const inputTipoVeiculo = document.getElementById('input-tipo-veiculo');
    const dicasContainer = document.getElementById('dicas-resultado-container');
    
    if (btnDicasGerais) {
        btnDicasGerais.addEventListener('click', () => buscarEExibirDicas(`${backendUrl}/api/dicas-manutencao`, dicasContainer));
    }
    if (btnDicasEspecificas && inputTipoVeiculo) { // Adicionada verificação para inputTipoVeiculo
        btnDicasEspecificas.addEventListener('click', () => { 
            if (inputTipoVeiculo.value.trim()) {
                buscarEExibirDicas(`${backendUrl}/api/dicas-manutencao/${inputTipoVeiculo.value.trim()}`, dicasContainer); 
            } else {
                alert('Digite um tipo de veículo.');
            }
        });
    }

    const verificarClimaBtn = document.getElementById('verificar-clima-btn');
    const destinoInput = document.getElementById('destino-viagem');
    const previsaoResultadoDiv = document.getElementById('previsao-tempo-resultado');
    const btnAlternarUnidade = document.getElementById('alternar-unidade-temp-btn');

    if (btnAlternarUnidade) {
        btnAlternarUnidade.addEventListener('click', () => { 
            unidadeTemperaturaAtual = unidadeTemperaturaAtual === 'C' ? 'F' : 'C'; 
            localStorage.setItem(CHAVE_STORAGE_UNIDADE_TEMP, unidadeTemperaturaAtual); 
            btnAlternarUnidade.textContent = `Mudar para ${unidadeTemperaturaAtual === 'C' ? '°F' : '°C'}`; 
            renderizarPrevisaoCompleta(); 
        });
    }

    if (verificarClimaBtn && destinoInput && previsaoResultadoDiv) { // Adicionadas verificações
        verificarClimaBtn.addEventListener('click', async () => {
            const cidade = destinoInput.value.trim();
            if (!cidade) { 
                previsaoResultadoDiv.innerHTML = '<p class="error">Digite uma cidade.</p>'; 
                return; 
            }
            previsaoResultadoDiv.innerHTML = '<p class="loading">Buscando previsão...</p>';
            try { 
                dadosPrevisaoGlobal = await fetchForecastData(cidade); 
                renderizarPrevisaoCompleta(); 
            } catch (error) { 
                previsaoResultadoDiv.innerHTML = `<p class="error">${error.message}</p>`; 
                dadosPrevisaoGlobal = null; 
            }
        });
    }

    if (previsaoResultadoDiv) {
        previsaoResultadoDiv.addEventListener('click', e => {
            const cardClicado = e.target.closest('.forecast-card-clickable');
            if (!cardClicado || !dadosPrevisaoGlobal) return;
            const detalhesContainer = cardClicado.querySelector('.detalhes-horarios-container');
            if (!detalhesContainer) return; // Adicionada verificação
            if (detalhesContainer.style.display === 'block') { 
                detalhesContainer.style.display = 'none'; 
                return; 
            }
            const previsaoDoDia = dadosPrevisaoGlobal.previsoes.find(p => p.data === cardClicado.dataset.forecastDate);
            if (previsaoDoDia?.entradasHorarias) {
                detalhesContainer.innerHTML = '<h5>Previsão Horária:</h5><div class="horarios-grid">' + previsaoDoDia.entradasHorarias.map(h => `<div class="horario-item"><span>${h.dt_txt.split(' ')[1].substring(0, 5)}</span><img src="https://openweathermap.org/img/wn/${h.weather[0].icon}.png" alt="${h.weather[0].description}"><span>${formatarTemperaturaInteira(h.main.temp)}</span></div>`).join('') + '</div>';
                detalhesContainer.style.display = 'block';
            }
        });
    }

    document.querySelectorAll('input[name="numDias"]').forEach(r => r.addEventListener('change', () => renderizarPrevisaoCompleta()));
    ['destaque-chuva', 'destaque-temp-baixa-check', 'destaque-temp-alta-check', 'destaque-temp-baixa-valor', 'destaque-temp-alta-valor'].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('change', () => renderizarPrevisaoCompleta());
        }
    });

    // 6. Verifica agendamentos próximos ao carregar a página principal
    garagem.verificarAgendamentosProximos();
    
    console.log("Inicialização da página principal completa.");
};
