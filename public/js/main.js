// js/main.js

const garagem = new Garagem();
let dadosPrevisaoGlobal = null;
let unidadeTemperaturaAtual = 'C';
const CHAVE_STORAGE_UNIDADE_TEMP = 'unidadeTemperaturaPreferida';

// URL do nosso backend. Importante para todas as chamadas de API.
const backendUrl = 'http://localhost:3000';

// Funções de conversão de temperatura
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

// =======================================================================
// ===== NOVAS FUNÇÕES DO FRONTEND (AULA 1 - Dicas de Manutenção) ======
// =======================================================================

/**
 * Função genérica para buscar dados de um endpoint e exibir em um container.
 * @param {string} url - A URL completa da API para chamar.
 * @param {HTMLElement} container - O elemento HTML onde o resultado será exibido.
 */
async function buscarEExibirDicas(url, container) {
    container.innerHTML = '<p class="loading">Buscando dicas...</p>';
    try {
        const response = await fetch(url);
        const dicas = await response.json();

        if (!response.ok) {
            throw new Error(dicas.error || 'Erro ao buscar as dicas.');
        }

        if (dicas.length === 0) {
            container.innerHTML = '<p>Nenhuma dica encontrada para esta categoria.</p>';
            return;
        }

        let htmlDicas = '<ul>';
        dicas.forEach(item => {
            htmlDicas += `<li>${item.dica}</li>`;
        });
        htmlDicas += '</ul>';
        container.innerHTML = htmlDicas;

    } catch (error) {
        console.error("Erro ao buscar ou exibir dicas:", error);
        container.innerHTML = `<p class="error">${error.message}</p>`;
    }
}

// =======================================================================

window.onload = () => {
    console.log("window.onload disparado. Inicializando garagem...");
    const unidadeSalva = localStorage.getItem(CHAVE_STORAGE_UNIDADE_TEMP);
    if (unidadeSalva) { unidadeTemperaturaAtual = unidadeSalva; }
    const btnAlternarUnidade = document.getElementById('alternar-unidade-temp-btn');
    if (btnAlternarUnidade) { btnAlternarUnidade.textContent = `Mudar para ${unidadeTemperaturaAtual === 'C' ? '°F' : '°C'}`; }

    const carregou = garagem.carregarGaragem();
    if (!carregou || Object.keys(garagem.veiculos).length === 0) {
        garagem.criarCarro();
        garagem.criarMoto();
        garagem.criarCarroEsportivo();
        garagem.criarCaminhao();
        garagem.exibirInformacoes('meuCarro');
    } else {
        garagem.atualizarUICompleta();
    }
    garagem.atualizarListaAgendamentos();

    document.querySelectorAll('.btn-detalhes-extras').forEach(botao => {
        botao.addEventListener('click', async (event) => {
            const veiculoId = event.target.dataset.veiculoId;
            if (veiculoId) await garagem.mostrarDetalhesExtras(veiculoId);
        });
    });

    const verificarClimaBtn = document.getElementById('verificar-clima-btn');
    const destinoInput = document.getElementById('destino-viagem');
    const previsaoResultadoDiv = document.getElementById('previsao-tempo-resultado');

    if (btnAlternarUnidade) {
        btnAlternarUnidade.addEventListener('click', () => {
            unidadeTemperaturaAtual = unidadeTemperaturaAtual === 'C' ? 'F' : 'C';
            localStorage.setItem(CHAVE_STORAGE_UNIDADE_TEMP, unidadeTemperaturaAtual);
            btnAlternarUnidade.textContent = `Mudar para ${unidadeTemperaturaAtual === 'C' ? '°F' : '°C'}`;
            renderizarPrevisaoCompleta();
        });
    }

    document.querySelectorAll('input[name="numDias"]').forEach(radio => { radio.addEventListener('change', () => { if (dadosPrevisaoGlobal) renderizarPrevisaoCompleta(); }); });
    ['destaque-chuva', 'destaque-temp-baixa-check', 'destaque-temp-alta-check', 'destaque-temp-baixa-valor', 'destaque-temp-alta-valor'].forEach(id => {
        const elem = document.getElementById(id);
        if (elem) { elem.addEventListener('change', () => { if (dadosPrevisaoGlobal) renderizarPrevisaoCompleta(); }); }
    });

    if (verificarClimaBtn && destinoInput && previsaoResultadoDiv) {
        verificarClimaBtn.addEventListener('click', async () => {
            const nomeCidade = destinoInput.value.trim();
            if (!nomeCidade) {
                previsaoResultadoDiv.innerHTML = '<p class="error">Por favor, digite o nome da cidade.</p>';
                destinoInput.focus();
                return;
            }
            previsaoResultadoDiv.innerHTML = '<p class="loading">Buscando previsão...</p>';
            try {
                if (typeof fetchForecastData !== 'function') throw new Error('Função fetchForecastData não disponível.');
                dadosPrevisaoGlobal = await fetchForecastData(nomeCidade, 5);
                renderizarPrevisaoCompleta();
            } catch (error) {
                console.error("Erro ao buscar/exibir previsão (forecast):", error);
                previsaoResultadoDiv.innerHTML = `<p class="error">${error.message || 'Erro ao buscar a previsão.'}</p>`;
                dadosPrevisaoGlobal = null;
            }
        });

        previsaoResultadoDiv.addEventListener('click', (event) => {
            const cardClicado = event.target.closest('.forecast-card-clickable');
            if (cardClicado && dadosPrevisaoGlobal) {
                const dataSelecionada = cardClicado.dataset.forecastDate;
                const detalhesContainer = cardClicado.querySelector('.detalhes-horarios-container');
                if (detalhesContainer.style.display === 'block') {
                    detalhesContainer.style.display = 'none';
                    detalhesContainer.innerHTML = '';
                    return;
                }
                const previsaoDoDia = dadosPrevisaoGlobal.previsoes.find(p => p.data === dataSelecionada);
                if (previsaoDoDia && previsaoDoDia.entradasHorarias) {
                    let htmlHorarios = '<h5>Previsão Horária:</h5><div class="horarios-grid">';
                    previsaoDoDia.entradasHorarias.forEach(itemHorario => {
                        const hora = itemHorario.dt_txt.split(' ')[1].substring(0, 5);
                        const iconHorarioUrl = `https://openweathermap.org/img/wn/${itemHorario.weather[0].icon}.png`;
                        htmlHorarios += `<div class="horario-item"><span>${hora}</span><img src="${iconHorarioUrl}" alt="${itemHorario.weather[0].description}" title="${itemHorario.weather[0].description}"><span>${formatarTemperaturaInteira(itemHorario.main.temp)}</span></div>`;
                    });
                    htmlHorarios += '</div>';
                    detalhesContainer.innerHTML = htmlHorarios;
                    detalhesContainer.style.display = 'block';
                } else {
                    detalhesContainer.innerHTML = '<p>Detalhes horários não disponíveis.</p>';
                    detalhesContainer.style.display = 'block';
                }
            }
        });
    }

    // =======================================================================
    // ===== NOVOS EVENT LISTENERS (AULA 1 - Dicas de Manutenção) ==========
    // =======================================================================
    const btnDicasGerais = document.getElementById('btn-buscar-dicas-gerais');
    const btnDicasEspecificas = document.getElementById('btn-buscar-dicas-especificas');
    const inputTipoVeiculo = document.getElementById('input-tipo-veiculo');
    const dicasContainer = document.getElementById('dicas-resultado-container');

    if (btnDicasGerais && dicasContainer) {
        btnDicasGerais.addEventListener('click', () => {
            const url = `${backendUrl}/api/dicas-manutencao`;
            buscarEExibirDicas(url, dicasContainer);
        });
    }

    if (btnDicasEspecificas && inputTipoVeiculo && dicasContainer) {
        btnDicasEspecificas.addEventListener('click', () => {
            const tipoVeiculo = inputTipoVeiculo.value.trim();
            if (!tipoVeiculo) {
                alert('Por favor, digite um tipo de veículo.');
                inputTipoVeiculo.focus();
                return;
            }
            const url = `${backendUrl}/api/dicas-manutencao/${encodeURIComponent(tipoVeiculo)}`;
            buscarEExibirDicas(url, dicasContainer);
        });
    }

    garagem.verificarAgendamentosProximos();
    console.log("Inicialização completa.");
};
