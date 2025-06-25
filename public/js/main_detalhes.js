// js/main_detalhes.js (NOVO ARQUIVO)

// Instancia a garagem. Ela vai carregar os dados do localStorage.
const garagem = new Garagem();

/**
 * Descobre qual veículo esta página representa verificando a existência
 * de um container de veículo específico no HTML.
 * @returns {string | null} O ID do veículo ('meuCarro', 'moto', etc.) ou null se não encontrar.
 */
function getVeiculoIdFromPage() {
    if (document.getElementById('carro-container')) return 'meuCarro';
    if (document.getElementById('carroEsportivo-container')) return 'carroEsportivo';
    if (document.getElementById('caminhao-container')) return 'caminhao';
    if (document.getElementById('moto-container')) return 'moto';
    return null;
}


// ==================================================================
// INICIALIZAÇÃO DA PÁGINA DE DETALHES DE UM VEÍCULO
// ==================================================================
window.onload = () => {
    console.log("Página de DETALHES carregada.");
    
    // 1. Carrega todos os dados dos veículos do localStorage
    garagem.carregarGaragem(); 

    // 2. Descobre qual veículo pertence a esta página
    const veiculoId = getVeiculoIdFromPage();

    // 3. Se um veículo foi identificado E ele existe na garagem...
    if (veiculoId && garagem.veiculos[veiculoId]) {
        const veiculo = garagem.veiculos[veiculoId];
        console.log(`Inicializando UI para o veículo: ${veiculoId}`);
        
        // 3a. Atualiza todos os elementos da UI para este veículo específico
        veiculo.atualizarDetalhes();
        veiculo.atualizarStatus();
        veiculo.atualizarVelocidadeDisplay();
        veiculo.atualizarPonteiroVelocidade();
        veiculo.atualizarInfoDisplay();
        
        // 3b. Preenche os campos de input (modelo/cor) com os dados atuais do veículo
        garagem.preencherInputsVeiculo(veiculoId, veiculo);
        
        // 3c. Exibe as informações e histórico na área designada
        garagem.exibirInformacoes(veiculoId);

        // 3d. Adiciona o listener para o botão de detalhes extras (que só existe nesta página)
        const btnExtras = document.querySelector(`.btn-detalhes-extras[data-veiculo-id="${veiculoId}"]`);
        if(btnExtras) {
            btnExtras.addEventListener('click', () => garagem.mostrarDetalhesExtras(veiculoId));
        }

    } else if (veiculoId) {
        // 4. Se o veículo não existe na garagem (ex: usuário limpou o cache)
        console.warn(`Veículo com ID '${veiculoId}' não encontrado na garagem. Peça para o usuário criar.`);
        const infoArea = document.getElementById('informacoesVeiculo');
        if (infoArea) {
            infoArea.textContent = `Este veículo ainda não está na sua garagem. Preencha os campos 'Modelo' e 'Cor' e clique em "Criar/Atualizar" para começar.`;
        }
    } else {
        // 5. Se nenhum container de veículo foi encontrado na página
        console.error("ERRO: Não foi possível identificar o veículo desta página de detalhes.");
    }

    console.log("Inicialização da página de detalhes completa.");
};