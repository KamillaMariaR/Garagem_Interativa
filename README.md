# 🚗 Garagem Interativa com Backend e Planejador de Viagem

Este é um projeto de simulação web interativa de uma garagem, evoluído para uma aplicação full-stack com frontend construído em HTML, CSS e JavaScript puro (Vanilla JS), e um backend em Node.js com Express. Ele permite criar e interagir com diferentes tipos de veículos, gerenciar manutenções, e planejar viagens com uma previsão do tempo interativa fornecida através de nossa própria API. Todos os dados dos veículos e preferências de visualização são persistidos no navegador utilizando LocalStorage.

## Descrição Detalhada

Este projeto simula o gerenciamento de uma garagem pessoal, onde o usuário pode interagir com uma coleção de veículos e manter um registro de sua manutenção. A aplicação utiliza princípios de Orientação a Objetos em JavaScript para modelar diferentes tipos de veículos (Carro, Carro Esportivo, Caminhão, Moto) e registros de manutenção, com herança para compartilhar funcionalidades comuns.

A interface web intuitiva oferece seções dedicadas a cada veículo, onde é possível definir informações como modelo e cor, e executar ações como ligar/desligar, acelerar, frear, pintar ou abastecer. Veículos especializados como o Carro Esportivo incluem ações de turbo e o Caminhão permite carregar e descarregar peso, impactando seu desempenho.

Além da interação com os veículos, o projeto incorpora um sistema de gerenciamento de manutenção, um planejador de viagem e **conteúdo dinâmico servido por um backend próprio**. O usuário pode registrar serviços, agendar manutenções futuras e visualizar tudo em listas organizadas.

**Uma novidade significativa é a arquitetura Cliente-Servidor**. O backend Node.js não só serve dados estáticos (como dicas, serviços, destaques e viagens populares), mas também atua como um **proxy seguro** para a API OpenWeatherMap. Isso significa que o planejador de viagem agora consome a previsão do tempo de nossa própria API, que por sua vez busca os dados externamente, mantendo a chave da API (API Key) protegida no servidor.

Todos os dados dos veículos, seu estado atual (ligado/desligado, velocidade, combustível), histórico/agendamentos de manutenção, e as preferências do planejador de viagem (como unidade de temperatura) são salvos automaticamente no LocalStorage do navegador, garantindo que as informações persistam entre as sessões.

## ✨ Funcionalidades

O projeto oferece as seguintes funcionalidades principais:

*   **Criação/Atualização de Veículos:** Definir ou atualizar o modelo e a cor dos veículos.
*   **Interação com Veículos:**
    *   **Geral para todos:** Ligar, Desligar, Acelerar, Frear, Pintar, Abastecer.
    *   **Carro Esportivo:** Ativar e Desativar o Turbo.
    *   **Caminhão:** Carregar e Descarregar Carga.
*   **Gerenciamento de Manutenção:**
    *   Registrar Manutenção Concluída e Agendar Manutenção Futura.
    *   Visualizar Agendamentos Futuros e Histórico Concluído de cada veículo.
*   **Conteúdo Dinâmico via API Interna:**
    *   **Veículos em Destaque:** Exibe uma seleção de carros especiais na página inicial.
    *   **Serviços da Garagem:** Lista os serviços oferecidos.
    *   **Dicas de Manutenção:** Oferece dicas gerais e específicas por tipo de veículo.
    *   **Inspiração de Viagem:** Sugere destinos populares para uma "road trip".
*   **Planejador de Viagem (via Backend Proxy):**
    *   Busca de Previsão do tempo para qualquer cidade.
    *   Seleção de Período (1, 3 ou 5 dias).
    *   Expansão de Detalhes Diários para visualização horária.
    *   Destaque de Condições (chuva, temperaturas).
    *   Alternador de Unidade de Temperatura (°C / °F) com persistência.
*   **API de Detalhes Extras:** Botão para buscar informações simuladas para cada veículo.
*   **Persistência de Dados:** Uso de LocalStorage para salvar o estado da garagem.
*   **Lembretes de Agendamento:** Alerta para agendamentos próximos ao carregar a página.
*   **Atualização Visual:** Interface reflete o estado dos veículos com animações simples.

## 🛠️ Tecnologias Utilizadas

*   **Frontend:**
    *   HTML5, CSS3, JavaScript (ES6+ Vanilla JS)
    *   Programação Orientada a Objetos
    *   LocalStorage API
*   **Backend:**
    *   Node.js
    *   Express.js (para criar o servidor e as rotas da API)
    *   Axios (para comunicação do backend com a API OpenWeatherMap)
    *   CORS (para habilitar a comunicação segura entre domínios diferentes)
    *   Dotenv (para gerenciar variáveis de ambiente de forma segura)

## 🚀 Como Rodar o Projeto

Com a nova arquitetura, o projeto agora é executado em duas partes: o backend (servidor) e o frontend (navegador).

### Pré-requisitos
- [Node.js](https://nodejs.org/) instalado (que inclui o npm).
- Uma chave de API gratuita da [OpenWeatherMap](https://openweathermap.org/appid).

### Passos
1.  **Clone o Repositório:**
    ```bash
    git clone https://github.com/KamillaMariaR/carros-v2-09-04-2025.git
    ```
2.  **Navegue até a Pasta do Projeto:**
    ```bash
    cd carros-v2-09-04-2025 
    ```
3.  **Instale as Dependências do Backend:**
    ```bash
    npm install
    ```
4.  **Configure a Chave da API:**
    - Crie um arquivo chamado `.env` na raiz do projeto.
    - Dentro dele, adicione a seguinte linha, substituindo `SUA_CHAVE_AQUI` pela sua chave da OpenWeatherMap:
      ```
      OPENWEATHER_API_KEY_BACKEND=SUA_CHAVE_AQUI
      ```
5.  **Inicie o Servidor Backend:**
    - Abra um terminal e execute:
    ```bash
    node server.js
    ```
    - O terminal deve exibir: `🚀 Servidor backend da Garagem Inteligente rodando na porta 3000`. **Mantenha este terminal aberto.**

6.  **Inicie o Frontend:**
    - Se você usa o Visual Studio Code, instale a extensão [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer).
    - Clique com o botão direito no arquivo `index.html` e selecione "Open with Live Server".
    - O site abrirá no seu navegador e estará totalmente funcional, comunicando-se com o seu servidor local.

## 📋 Endpoints da API

O backend fornece os seguintes endpoints para o frontend consumir:

| Método | Caminho (Endpoint)                       | Descrição                                         |
| :----- | :--------------------------------------- | :------------------------------------------------ |
| `GET`  | `/clima?cidade={nome_da_cidade}`         | Retorna a previsão do tempo para a cidade especificada. |
| `GET`  | `/api/dicas-manutencao`                  | Retorna uma lista de dicas de manutenção gerais.     |
| `GET`  | `/api/dicas-manutencao/:tipoVeiculo`     | Retorna dicas específicas para um tipo de veículo.  |
| `GET`  | `/api/garagem/veiculos-destaque`         | Retorna uma lista de veículos em destaque.          |
| `GET`  | `/api/garagem/servicos-oferecidos`       | Retorna uma lista de serviços da garagem.           |
| `GET`  | `/api/viagens-populares`                 | Retorna uma lista de destinos de viagem populares.  |

## Estrutura do Projeto

*   `index.html`: Arquivo principal da interface.
*   `style.css`: Folha de estilos.
*   `server.js`: O servidor backend (Node.js/Express).
*   `.env`: Arquivo para variáveis de ambiente (chave da API).
*   `README.md`: Esta documentação.
*   `package.json` e `package-lock.json`: Arquivos de configuração do Node.js.
*   `imagens/`: Contém as imagens dos veículos.
*   `js/`: Contém os arquivos JavaScript do frontend:
    *   `manutencao.js`, `veiculo.js`, `carro.js`, `carroEsportivo.js`, `caminhao.js`, `moto.js`: As classes que modelam a aplicação.
    *   `garagem.js`: A classe `Garagem` que gerencia tudo.
    *   `main.js`: Script principal que inicializa a aplicação e gerencia os eventos.

## Melhorias Futuras

*   **Banco de Dados Real:** Substituir os dados "mock" no `server.js` por um banco de dados real (MongoDB, PostgreSQL, etc.).
*   **Autenticação de Usuário:** Criar um sistema de login para que cada usuário tenha sua própria garagem.
*   **Testes:** Implementar testes unitários e de integração para garantir a robustez do código.
*   **Deployment:** Publicar a aplicação em uma plataforma como Heroku, Render ou Vercel.

## Licença

Este projeto está licenciado sob a Licença MIT.

## Contato

[KamillaMariaR](https://github.com/KamillaMariaR)
