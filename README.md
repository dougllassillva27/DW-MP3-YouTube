# DW MP3 YouTube

![Versão](https://img.shields.io/badge/versão-1.4.0-blue)
![Licença](https://img.shields.io/badge/licença-MIT-green)
![Plataforma](https://img.shields.io/badge/plataforma-Windows-informational)
![Tecnologia](https://img.shields.io/badge/tecnologia-Electron-9FEAF9)

Uma aplicação de desktop robusta para Windows, construída com Electron, para baixar áudio de vídeos e playlists do YouTube no formato MP3.

## Demonstração

![Demonstração da Aplicação](image_285b48.png)
_(Sugestão: Substitua `image_285b48.png` pelo nome do arquivo de imagem ou GIF que melhor representa a aplicação em funcionamento)._

## ✨ Funcionalidades

- **Download Simples e de Playlists:** Cole a URL de um vídeo ou de uma playlist completa para iniciar o download.
- **Conversão Automática para MP3:** O áudio é extraído e salvo diretamente no formato `.mp3`.
- **Feedback em Tempo Real:** Acompanhe o progresso com uma barra de status e informações detalhadas:
  - Porcentagem do download atual.
  - Contagem de progresso da playlist (ex: "Vídeo 5 de 200").
  - Nome da faixa sendo baixada.
- **Interface Intuitiva:** Uma tela única e limpa, fácil de usar.
- **Robusto e Resiliente:** Utiliza `yt-dlp` como motor, garantindo alta compatibilidade e resiliência contra atualizações do YouTube.
- **Proteção contra Rate-Limiting:** Inclui pausas automáticas entre os downloads de playlists para evitar bloqueios temporários do YouTube.
- **Empacotamento para Distribuição:** Pronto para ser empacotado em um instalador `.exe` para fácil distribuição.

## 🛠️ Tecnologias e Ferramentas

O projeto foi construído utilizando as seguintes tecnologias:

- **[Electron](https://www.electronjs.org/):** Framework para criar aplicações de desktop com JavaScript, HTML e CSS.
- **[Node.js](https://nodejs.org/):** Ambiente de execução para o backend da aplicação.
- **[yt-dlp](https://github.com/yt-dlp/yt-dlp):** Poderoso motor de linha de comando para download de vídeos, utilizado como núcleo da aplicação.
- **[FFmpeg](https://ffmpeg.org/):** Ferramenta essencial para a extração e conversão de áudio, utilizada pelo `yt-dlp`.
- **[electron-builder](https://www.electron.build/):** Ferramenta para empacotar e construir os instaladores da aplicação.

## ⚙️ Instalação e Configuração

Para executar este projeto localmente, siga os passos abaixo.

### Pré-requisitos

- **[Node.js](https://nodejs.org/)** (versão 18.x ou superior recomendada)
- **npm** (geralmente instalado com o Node.js)

### Passos

1.  **Clone o repositório:**

    ```bash
    git clone [https://github.com/seu-usuario/DW-MP3-YouTube.git](https://github.com/seu-usuario/DW-MP3-YouTube.git)
    cd DW-MP3-YouTube
    ```

2.  **Instale as dependências do projeto:**

    ```bash
    npm install
    ```

3.  **Adicione os Executáveis Externos:**
    - Baixe a última versão do `yt-dlp.exe` do [site oficial](https://github.com/yt-dlp/yt-dlp/releases/latest).
    - Coloque o arquivo `yt-dlp.exe` dentro da pasta `./assets/`.

A estrutura da pasta `assets` deve ficar assim:

```bash
/assets/
│
├── css/
│   └── style.css
├── icon.ico
└── yt-dlp.exe
```

## 🚀 Uso

### Modo de Desenvolvimento

Para executar a aplicação em modo de desenvolvimento, com acesso às ferramentas de depuração:

```bash
npm start
```

## Empacotamento para Produção

Para criar o instalador .exe distribuível:

```
npm run package
```

O instalador será gerado na pasta /dist.

Observação: No Windows, pode ser necessário executar este comando em um terminal com privilégios de administrador ou ter o Modo de Desenvolvedor ativado.

## 🏛️ Princípios de Arquitetura

Este projeto foi desenvolvido seguindo princípios de software que visam a qualidade, segurança e manutenibilidade:

Separação de Responsabilidades (SRP): A aplicação é dividida em três processos distintos:

Main: Orquestra as janelas e a lógica de backend (Node.js).

Renderer: Constrói e controla a interface com a qual o usuário interage (HTML/CSS/JS).

Preload: Atua como uma ponte segura entre o Main e o Renderer, expondo apenas as funcionalidades necessárias e prevenindo vulnerabilidades.

Segurança: O contextIsolation está ativado e a comunicação é feita exclusivamente via contextBridge, conforme as melhores práticas de segurança do Electron.

Robustez: A aplicação não depende de bibliotecas JavaScript frágeis para o download, mas sim de um processo externo robusto (yt-dlp), e empacota suas próprias dependências (como o FFmpeg) para funcionar de forma autocontida em qualquer máquina.

## 📄 Licença

Distribuído sob a Licença MIT.
