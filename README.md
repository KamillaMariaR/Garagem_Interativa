# 🚗 Garagem Interativa Full-Stack com Node.js, Express e MongoDB

Bem-vindo à Garagem Interativa! Este é um projeto web que simula uma garagem dinâmica, evoluído para uma aplicação full-stack. O frontend é construído com HTML5, CSS3 e JavaScript puro (Vanilla JS), enquanto o backend robusto é desenvolvido em Node.js com Express e se conecta a um banco de dados **MongoDB Atlas** para persistência de dados. A aplicação permite aos usuários criar, visualizar, deletar e interagir com diversos tipos de veículos, gerenciar seus históricos de manutenção e planejar viagens com uma previsão do tempo interativa.

## 📜 Descrição Detalhada

A Garagem Interativa oferece uma simulação rica do gerenciamento de uma coleção pessoal de veículos. Os usuários podem mergulhar em uma experiência interativa, onde cada veículo (Carro, Carro Esportivo, Caminhão, Moto) é modelado com princípios de Programação Orientada a Objetos em JavaScript no frontend.

**O coração da aplicação é a sua arquitetura Cliente-Servidor robusta.** O backend, construído com Node.js e Express, fornece uma API RESTful completa. Esta API gerencia todas as operações de **CRUD (Create, Read, Update, Delete)** para a frota de veículos, salvando os dados permanentemente em um banco de dados NoSQL (MongoDB). Além disso, o backend atua como um **proxy seguro para a API externa OpenWeatherMap**, protegendo a chave da API (API Key) no ambiente do servidor.

No frontend, os usuários podem adicionar novos veículos à sua frota através de um formulário intuitivo e visualizar todos os veículos cadastrados em uma tabela organizada. A funcionalidade de deletar permite a remoção de veículos com uma simples confirmação. A página inicial também exibe dinamicamente os veículos mais recentes como "destaques", buscando essa informação diretamente do banco de dados.

Para a simulação de interatividade nas páginas de detalhes de cada veículo, o projeto utiliza a API **LocalStorage** do navegador para salvar o estado momentâneo de cada veículo (ligado/desligado, velocidade, etc.), proporcionando uma experiência contínua e interativa sem a necessidade de recarregar a página a cada ação.

## ✨ Funcionalidades Principais

*   **Gerenciamento Completo da Frota com Banco de Dados:**
    *   **Adicionar Veículos (Create):** Formulário para cadastrar novos veículos (placa, marca, modelo, ano, cor) que são salvos no MongoDB.
    *   **Listar Veículos (Read):** Tabela na página inicial que exibe todos os veículos cadastrados, buscando os dados em tempo real da API.
    *   **Deletar Veículos (Delete):** Botão de exclusão para cada veículo na frota, com confirmação do usuário antes da remoção permanente do banco de dados.
*   **Conteúdo Dinâmico Servido pela API Backend:**
    *   **Veículos em Destaque:** A seção de destaques é alimentada pelos veículos mais recentes cadastrados no banco de dados.
    *   **Dicas de Manutenção e Serviços:** Listas informativas servidas pelo backend.
*   **Planejador de Viagem Avançado (com Backend Proxy):**
    *   Busca de Previsão do Tempo para qualquer cidade, com opções de período (1, 3, 5 dias).
    *   Alternador de Unidade de Temperatura (°C/°F) com preferência salva no LocalStorage.
    *   Destaques visuais para condições climáticas específicas.
*   **Interação Detalhada com Veículos (Simulação no Frontend):**
    *   Páginas dedicadas para cada tipo de veículo (Carro, Esportivo, Caminhão, Moto).
    *   Ações como Ligar, Desligar, Acelerar, Frear, e habilidades especiais (Turbo, Carregar Carga).
    *   Gerenciamento de manutenção (agendamento e registro) salvo via LocalStorage.
*   **Persistência de Dados Híbrida:**
    *   **MongoDB Atlas:** Usado como a fonte da verdade para os dados da frota de veículos (a lista principal).
    *   **LocalStorage API:** Usado para salvar o estado da *simulação* interativa (velocidade, combustível, etc.) nas páginas de detalhes, proporcionando resposta instantânea sem sobrecarregar o banco de dados com dados voláteis.

## 🛠️ Tecnologias Utilizadas

*   **Frontend:**
    *   HTML5, CSS3, JavaScript (ES6+ Vanilla JS)
    *   Programação Orientada a Objetos (POO)
    *   Fetch API, LocalStorage API
*   **Backend:**
    *   **Node.js:** Ambiente de execução do servidor.
    *   **Express.js:** Framework para criação da API RESTful.
    *   **MongoDB Atlas:** Banco de dados NoSQL como serviço para persistência de dados.
    *   **Mongoose:** ODM (Object Data Modeling) para modelar e interagir com o MongoDB de forma elegante.
    *   **Axios:** Cliente HTTP para comunicação com a API OpenWeatherMap.
    *   `cors` e `dotenv`: Middlewares essenciais para segurança e gerenciamento de ambiente.

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
*   **Node.js e npm:** [Instale o Node.js](https://nodejs.org/).
*   **Conta no MongoDB Atlas:** Crie uma conta gratuita no [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) e configure um cluster.
*   **Chave de API da OpenWeatherMap:** Obtenha uma chave gratuita da [OpenWeatherMap](https://openweathermap.org/appid).

### Passos para Configuração e Execução

1.  **Clone o Repositório:**
    ```bash
    git clone https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
    cd SEU_REPOSITORIO
    ```

2.  **Instale as Dependências:**
    ```bash
    npm install
    ```

3.  **Configure as Variáveis de Ambiente:**
    *   Na raiz do projeto, crie um arquivo chamado `.env`.
    *   Dentro do `.env`, adicione as seguintes linhas, substituindo pelos seus valores:
        ```env
        # Sua string de conexão do MongoDB Atlas (Vá em seu cluster > Connect > Drivers)
        MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/suaDatabase?retryWrites=true&w=majority

        # Sua chave da API da OpenWeatherMap
        OPENWEATHER_API_KEY=SUA_CHAVE_AQUI
        ```

4.  **Inicie o Servidor Backend:**
    ```bash
    node server.js
    ```
    Você deverá ver a mensagem: `✅ Servidor da GARAGEM INTERATIVA rodando na porta 3001` e `🚀 Conectado ao MongoDB Atlas via Mongoose!`. Mantenha este terminal aberto.

5.  **Acesse o Frontend no Navegador:**
    *   Abra o arquivo `index.html` diretamente no seu navegador.
    *   Para uma melhor experiência, use a extensão [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) no VS Code.

## 📋 Endpoints da API Backend

| Método   | Endpoint                          | Descrição                                         |
| :------- | :-------------------------------- | :------------------------------------------------ |
| `POST`   | `/api/veiculos`                   | Cria um novo veículo no banco de dados.           |
| `GET`    | `/api/veiculos`                   | Lista todos os veículos do banco de dados.        |
| `DELETE` | `/api/veiculos/:id`               | Deleta um veículo específico pelo seu ID.         |
| `GET`    | `/api/garagem/veiculos-destaque`  | Retorna os 4 veículos mais recentes como destaque. |
| `GET`    | `/api/dicas-manutencao/:tipo?`    | Retorna dicas de manutenção (gerais ou por tipo). |
| `GET`    | `/clima`                          | Proxy para a API OpenWeatherMap.                  |
| `GET`    | `/api/garagem/servicos-oferecidos`| Retorna a lista de serviços oferecidos.           |

## 📂 Estrutura do Projeto

*   `models/`
    *   `veiculo.js`: Define o Schema do Mongoose para os documentos de veículos no MongoDB.
*   `js/`
    *   Contém os scripts do frontend (classes `Veiculo`, `Garagem`, `main.js`, etc.).
*   `server.js`: O coração do backend.
*   `package.json`: Define as dependências do projeto.
*   `.env`: Armazena as chaves secretas e variáveis de ambiente.
*   `index.html` e `detalhes_*.html`: Páginas do frontend.
*   `style.css`: Folha de estilos.

## 💡 Melhorias Futuras

*   **Implementar a funcionalidade de Update (Editar):** Permitir que o usuário modifique os dados de um veículo já cadastrado.
*   **Autenticação de Usuário:** Criar um sistema de login para que cada usuário tenha sua própria garagem.
*   **Migrar Simulação para o Backend:** Salvar o estado interativo dos veículos (velocidade, combustível) no banco de dados para uma experiência multi-dispositivo.
*   **Deployment:** Publicar a aplicação em uma plataforma como Render ou Heroku.


## 📄 Licença

Este projeto está licenciado sob a [Licença MIT](https://opensource.org/licenses/MIT).

## 📞 Contato

Desenvolvido com ❤️ por **KamillaMariaR**.

*   **GitHub:** [KamillaMariaR](https://github.com/KamillaMariaR)

Sinta-se à vontade para contribuir, reportar issues ou sugerir melhorias!
