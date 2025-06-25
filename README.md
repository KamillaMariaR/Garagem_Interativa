# 🚗 Garagem Interativa Full-Stack com Backend e Planejador de Viagem

Bem-vindo à Garagem Interativa! Este é um projeto web que simula uma garagem dinâmica, evoluído para uma aplicação full-stack. O frontend é construído com HTML5, CSS3 e JavaScript puro (Vanilla JS), enquanto o backend robusto é desenvolvido em Node.js com Express. A aplicação permite aos usuários criar, personalizar e interagir com diversos tipos de veículos, gerenciar seus históricos de manutenção e planejar viagens com uma previsão do tempo interativa, alimentada por nossa própria API backend. Para uma experiência contínua, todos os dados dos veículos e preferências de visualização são persistidos no navegador do usuário utilizando a API LocalStorage.

## 📜 Descrição Detalhada

A Garagem Interativa oferece uma simulação rica do gerenciamento de uma coleção pessoal de veículos. Os usuários podem mergulhar em uma experiência interativa, onde cada veículo (Carro, Carro Esportivo, Caminhão, Moto) é modelado com princípios de Programação Orientada a Objetos em JavaScript. A herança é utilizada para compartilhar funcionalidades comuns, enquanto características específicas de cada tipo de veículo são implementadas em suas respectivas classes.

A interface do usuário é projetada para ser intuitiva, com seções dedicadas para cada veículo. Nelas, é possível definir e atualizar informações cruciais como modelo e cor, além de executar uma gama de ações: ligar/desligar o motor, acelerar, frear, pintar o veículo com uma nova cor ou reabastecer o tanque. Veículos especializados, como o Carro Esportivo, vêm com a funcionalidade de ativar/desativar o turbo para um impulso extra de velocidade, e o Caminhão permite simular o carregamento e descarregamento de peso, o que realisticamente afeta seu desempenho de aceleração e frenagem.

Além da interação direta com os veículos, o projeto se destaca por um sistema completo de gerenciamento de manutenção. Os usuários podem registrar serviços de manutenção que já foram concluídos, incluindo data, tipo, custo e descrição, e também agendar manutenções futuras com observações. Todas essas informações são claramente visualizadas em listas organizadas por veículo e em uma lista consolidada de agendamentos futuros para toda a garagem na página inicial.

**Um avanço crucial neste projeto é sua arquitetura Cliente-Servidor robusta.** O backend, construído com Node.js e Express, não se limita a servir arquivos estáticos; ele também fornece dados dinâmicos através de uma API RESTful. Esta API serve informações como dicas de manutenção, listas de serviços oferecidos, veículos em destaque na garagem e inspirações para viagens. Mais significativamente, o backend atua como um **proxy seguro para a API externa OpenWeatherMap**. Isso significa que o componente de planejamento de viagem do frontend consome dados de previsão do tempo de nossa própria API (`/clima`), que, por sua vez, busca os dados da OpenWeatherMap. Essa abordagem protege a chave da API (API Key) do OpenWeatherMap, mantendo-a segura no ambiente do servidor e não expondo-a no código do cliente.

Para garantir que a experiência do usuário seja consistente entre as sessões de navegação, todos os dados dos veículos – incluindo seu estado atual (ligado/desligado, velocidade, nível de combustível), o histórico completo de manutenções realizadas e os agendamentos futuros – bem como as preferências do usuário no planejador de viagem (como a unidade de temperatura preferida) são salvos automaticamente no LocalStorage do navegador. Lembretes de agendamentos próximos são exibidos ao carregar a página inicial, ajudando o usuário a se manter atualizado.

## ✨ Funcionalidades Principais

A Garagem Interativa oferece um conjunto abrangente de funcionalidades:

*   **Criação e Atualização Dinâmica de Veículos:**
    *   Permite definir ou modificar o modelo e a cor para cada um dos quatro tipos de veículos disponíveis.
    *   Os dados são persistidos e recarregados, mantendo as personalizações do usuário.
*   **Interação Detalhada com Veículos:**
    *   **Funcionalidades Comuns (todos os veículos):** Ligar, Desligar, Acelerar (com feedback visual e sonoro simulado), Frear, Pintar (com escolha de cor) e Abastecer (com entrada de percentual).
    *   **Carro Esportivo:** Funcionalidades exclusivas de Ativar e Desativar o modo Turbo, afetando a aceleração e o consumo de combustível.
    *   **Caminhão:** Capacidade de Carregar e Descarregar Carga (em kg), com o peso da carga influenciando a aceleração e a frenagem.
*   **Sistema Completo de Gerenciamento de Manutenção:**
    *   Registrar Manutenção Concluída: Inclui data, tipo de serviço, custo e descrição opcional.
    *   Agendar Manutenção Futura: Inclui data, hora opcional, tipo de serviço e observações opcionais.
    *   Visualização de Histórico e Agendamentos: Cada página de detalhes do veículo exibe seu histórico de manutenção e agendamentos futuros. A página inicial mostra uma lista consolidada de todos os agendamentos futuros.
    *   Lembretes de Agendamento: Alertas são exibidos para manutenções agendadas para o dia atual ou o dia seguinte.
*   **Conteúdo Dinâmico Servido pela API Backend:**
    *   **Veículos em Destaque:** Uma seção na página inicial exibe uma seleção curada de veículos com suas imagens e características principais.
    *   **Serviços da Garagem:** Uma lista informativa dos serviços que a "Garagem Interativa" oferece.
    *   **Dicas de Manutenção:** Acesso a dicas de manutenção gerais e dicas específicas filtradas por tipo de veículo (carro, moto, caminhão).
    *   **Inspiração para Viagem:** Apresenta cards com destinos populares para viagens rodoviárias, incluindo imagens e descrições.
*   **Planejador de Viagem Avançado (Integrado com API Backend Proxy):**
    *   Busca de Previsão do Tempo: Permite ao usuário digitar o nome de qualquer cidade para obter a previsão.
    *   Seleção de Período de Previsão: Opções para visualizar a previsão para 1, 3 ou 5 dias.
    *   Detalhes Diários Expansíveis: Ao clicar em um card de previsão diária, o usuário pode ver uma previsão horária detalhada para aquele dia.
    *   Destaque Visual de Condições Climáticas: Opções para destacar visualmente dias com previsão de chuva, temperaturas abaixo de um limite especificado ou temperaturas acima de um limite especificado.
    *   Alternador de Unidade de Temperatura: Permite alternar entre Celsius (°C) e Fahrenheit (°F), com a preferência sendo salva no LocalStorage.
*   **API de Detalhes Extras do Veículo:**
    *   Um botão "Ver Detalhes Extras (API)" em cada página de veículo busca e exibe informações adicionais simuladas (como valor FIPE, recalls, consumo médio) a partir de dados mockados no frontend (para simular uma API externa mais complexa).
*   **Persistência de Dados Robusta:**
    *   Utilização intensiva da API LocalStorage para salvar o estado completo da garagem: todos os veículos, seus atributos (modelo, cor, status, velocidade, combustível), histórico de manutenção, agendamentos e preferências do usuário.
*   **Interface de Usuário Responsiva e Interativa:**
    *   Design limpo e organizado com feedback visual para ações do usuário.
    *   Animações simples (ex: barra de velocidade, efeitos de aceleração/frenagem) para melhorar a experiência.
    *   Navegação clara entre a página inicial e as páginas de detalhes de cada veículo.

## 🛠️ Tecnologias Utilizadas

*   **Frontend:**
    *   **HTML5:** Estrutura semântica das páginas web.
    *   **CSS3:** Estilização e layout, incluindo Flexbox e Grid para responsividade.
    *   **JavaScript (ES6+ Vanilla JS):** Lógica de toda a interface, interações, manipulação do DOM e consumo de APIs.
    *   **Programação Orientada a Objetos (POO):** Classes para modelar Veículos, Manutenção e a própria Garagem.
    *   **LocalStorage API:** Para persistência de dados no navegador do cliente.
    *   **Fetch API:** Para realizar requisições HTTP ao backend.
*   **Backend:**
    *   **Node.js:** Ambiente de execução para o JavaScript no lado do servidor.
    *   **Express.js:** Framework minimalista para Node.js, usado para criar o servidor web e as rotas da API RESTful.
    *   **Axios:** Cliente HTTP baseado em Promises para realizar a comunicação do backend com a API externa OpenWeatherMap.
    *   **`cors` (middleware):** Para habilitar o Cross-Origin Resource Sharing, permitindo que o frontend (rodando em um domínio/porta diferente) acesse a API backend.
    *   **`dotenv` (módulo):** Para gerenciar variáveis de ambiente de forma segura, como a chave da API OpenWeatherMap, mantendo-as fora do código-fonte.

## 🚀 Como Executar o Projeto Localmente

Com a arquitetura full-stack, o projeto requer a execução do servidor backend e o acesso ao frontend através de um navegador.

### Pré-requisitos
*   **Node.js e npm:** Certifique-se de ter o [Node.js](https://nodejs.org/) instalado em sua máquina. O npm (Node Package Manager) vem junto com o Node.js. Você pode verificar a instalação abrindo um terminal e digitando `node -v` e `npm -v`.
*   **Chave de API da OpenWeatherMap:** Você precisará de uma chave de API gratuita da [OpenWeatherMap](https://openweathermap.org/appid) para que a funcionalidade de previsão do tempo funcione.

### Passos para Configuração e Execução

1.  **Clone o Repositório:**
    Obtenha uma cópia local do projeto. Se você tiver Git instalado, use:
    ```bash
    git clone https://github.com/KamillaMariaR/carros-v2-09-04-2025.git
    ```
    Ou baixe o ZIP do repositório e extraia-o.

2.  **Navegue até a Pasta do Projeto:**
    Abra seu terminal ou prompt de comando e navegue até o diretório raiz do projeto clonado/extraído:
    ```bash
    cd carros-v2-09-04-2025
    ```

3.  **Instale as Dependências do Backend:**
    Dentro da pasta do projeto, execute o comando abaixo para instalar todos os pacotes Node.js listados no arquivo `package.json` (como Express, Axios, CORS, Dotenv):
    ```bash
    npm install
    ```

4.  **Configure a Chave da API OpenWeatherMap:**
    *   Na raiz do projeto (mesmo nível que `server.js` e `package.json`), crie um arquivo chamado `.env`.
    *   Dentro deste arquivo `.env`, adicione a seguinte linha, substituindo `SUA_CHAVE_AQUI` pela sua chave de API real da OpenWeatherMap:
        ```env
        OPENWEATHER_API_KEY=SUA_CHAVE_AQUI
        ```
        (Nota: No seu `server.js` você está usando `process.env.OPENWEATHER_API_KEY`. Certifique-se de que o nome da variável no arquivo `.env` seja `OPENWEATHER_API_KEY` e não `OPENWEATHER_API_KEY_BACKEND` como estava no README anterior, para corresponder ao código em `server.js`.)

5.  **Inicie o Servidor Backend:**
    No seu terminal, dentro da pasta raiz do projeto, execute o comando:
    ```bash
    node server.js
    ```
    Se tudo estiver correto, você verá uma mensagem como:
    `🚀 Servidor da GARAGEM INTERATIVA rodando na porta 3001`
    (ou a porta definida pela variável de ambiente `PORT`). **Mantenha este terminal aberto e rodando enquanto utiliza a aplicação.**

6.  **Acesse o Frontend no Navegador:**
    *   A maneira mais simples é abrir diretamente o arquivo `index.html` no seu navegador.
    *   Para uma melhor experiência de desenvolvimento, especialmente com JavaScript, recomenda-se usar uma extensão como o [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) para Visual Studio Code. Se você tiver essa extensão instalada, clique com o botão direito no arquivo `index.html` dentro do VS Code e selecione "Open with Live Server".
    *   O site abrirá no seu navegador (geralmente em um endereço como `http://127.0.0.1:5500/index.html` se estiver usando o Live Server). A aplicação frontend fará requisições ao seu servidor backend local (que está rodando na porta 3001).

Agora você deve conseguir interagir com todas as funcionalidades da Garagem Interativa!

## 📋 Endpoints da API Backend

O servidor backend (`server.js`) expõe os seguintes endpoints que são consumidos pela aplicação frontend:

| Método HTTP | Caminho (Endpoint)                       | Descrição Detalhada                                                                                                | Parâmetros de Query                               |
| :---------- | :--------------------------------------- | :----------------------------------------------------------------------------------------------------------------- | :------------------------------------------------ |
| `GET`       | `/api`                                   | Rota de teste para verificar se a API está funcionando. Retorna uma mensagem JSON de sucesso.                        | Nenhum                                            |
| `GET`       | `/clima`                                 | Atua como proxy para a API OpenWeatherMap. Retorna dados de previsão do tempo para a cidade especificada.              | `cidade` (obrigatório): Nome da cidade.             |
| `GET`       | `/api/dicas-manutencao`                  | Retorna uma lista de dicas de manutenção gerais, aplicáveis a todos os tipos de veículos.                             | Nenhum                                            |
| `GET`       | `/api/dicas-manutencao/:tipoVeiculo`     | Retorna dicas de manutenção específicas para o tipo de veículo fornecido (`carro`, `moto`, `caminhao`).                 | `:tipoVeiculo` (parâmetro de rota)                |
| `GET`       | `/api/garagem/veiculos-destaque`         | Retorna uma lista de objetos, cada um representando um veículo em destaque para exibição na página inicial.            | Nenhum                                            |
| `GET`       | `/api/garagem/servicos-oferecidos`       | Retorna uma lista de objetos, cada um descrevendo um serviço oferecido pela garagem, incluindo nome, descrição e preço. | Nenhum                                            |
| `GET`       | `/api/viagens-populares`                 | Retorna uma lista de objetos, cada um representando um destino de viagem popular com imagem, descrição e país.         | Nenhum                                            |

## 📂 Estrutura Detalhada do Projeto

carros-v2-09-04-2025/
├── .env # Arquivo para variáveis de ambiente (NÃO versionar com chaves reais)
├── imagens/ # Contém as imagens dos veículos e outras mídias
│ ├── caminhao-removebg-preview.png
│ ├── civic-removebg-preview.png
│ ├── kawasaki-Photoroom.png
│ └── paganiRosa-removebg-preview.png
├── js/ # Contém os arquivos JavaScript do frontend
│ ├── caminhao.js # Classe Caminhao (herda de Carro)
│ ├── carro.js # Classe Carro (herda de Veiculo)
│ ├── carroEsportivo.js # Classe CarroEsportivo (herda de Carro)
│ ├── garagem.js # Classe Garagem (gerencia os veículos e interações)
│ ├── main.js # Script principal para index.html (inicialização e eventos globais)
│ ├── main_detalhes.js # Script principal para páginas de detalhes de veículos
│ ├── manutencao.js # Classe Manutencao
│ ├── moto.js # Classe Moto (herda de Carro)
│ └── veiculo.js # Classe base Veiculo
├── node_modules/ # Dependências do Node.js (instaladas via npm install)
├── detalhes_caminhao.html # Página de detalhes para o Caminhão
├── detalhes_carro.html # Página de detalhes para o Carro
├── detalhes_esportivo.html # Página de detalhes para o Carro Esportivo
├── detalhes_moto.html # Página de detalhes para a Moto
├── index.html # Arquivo principal da interface do usuário (página inicial)
├── package-lock.json # Gerado automaticamente para registrar versões exatas das dependências
├── package.json # Define metadados do projeto e dependências do Node.js
├── README.md # Esta documentação
├── server.js # O servidor backend (Node.js/Express)
└── style.css # Folha de estilos principal para todas as páginas

## 💡 Melhorias Futuras e Possíveis Extensões

Este projeto serve como uma base sólida para muitas outras funcionalidades e aprendizados. Algumas ideias incluem:

*   **Persistência de Dados no Backend:**
    *   Substituir os dados "mock" no `server.js` (como `veiculosDestaque`, `servicosOferecidos`, etc.) e o LocalStorage por um banco de dados real (ex: MongoDB com Mongoose, PostgreSQL com Sequelize, ou SQLite para simplicidade).
    *   Permitir que os dados da garagem do usuário (veículos, manutenções) sejam salvos no servidor associados a uma conta de usuário.
*   **Autenticação e Contas de Usuário:**
    *   Implementar um sistema de registro e login de usuários (ex: usando JWT - JSON Web Tokens).
    *   Cada usuário teria sua própria garagem salva no banco de dados.
*   **Testes Automatizados:**
    *   Escrever testes unitários (ex: com Jest ou Mocha) para as classes JavaScript e para as funções do backend.
    *   Implementar testes de integração para as rotas da API.
    *   Considerar testes end-to-end (ex: com Cypress ou Puppeteer) para a interface do usuário.
*   **Deployment da Aplicação:**
    *   Publicar o backend e o frontend em uma plataforma de hospedagem (ex: Render, Heroku, Vercel para frontend e backend separados, ou uma VM na AWS/Google Cloud/Azure).
*   **Melhorias na Interface e Experiência do Usuário (UI/UX):**
    *   Utilizar um framework/biblioteca frontend (React, Vue, Angular, Svelte) para componentização e gerenciamento de estado mais avançado, se o projeto crescer.
    *   Adicionar mais animações, transições e feedback visual.
    *   Implementar um design mais responsivo para dispositivos móveis.
    *   Permitir upload de imagens para os veículos.
*   **Funcionalidades Adicionais:**
    *   Comparação de veículos.
    *   Cálculo de custos de viagem (combustível, pedágios).
    *   Integração com mapas para visualização de rotas.
    *   Notificações push para lembretes de manutenção.

## 📄 Licença

Este projeto está licenciado sob a [Licença MIT](https://opensource.org/licenses/MIT). Veja o arquivo `LICENSE` (se existir) para mais detalhes.

## 📞 Contato

Desenvolvido por **KamillaMariaR**.
*   GitHub: [KamillaMariaR](https://github.com/KamillaMariaR)

Sinta-se à vontade para contribuir, reportar issues ou sugerir melhorias!
