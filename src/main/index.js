const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');
const ffmpegStatic = require('ffmpeg-static');

let janelaPrincipal;

function obterCaminhoExecutavel(nomeExecutavel) {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, nomeExecutavel);
  }
  if (nomeExecutavel === 'ffmpeg.exe') {
    return ffmpegStatic;
  }
  return path.join(__dirname, '../../assets', nomeExecutavel);
}

function criarJanelaPrincipal() {
  janelaPrincipal = new BrowserWindow({
    width: 850,
    height: 650,
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  janelaPrincipal.loadFile(path.join(__dirname, '../renderer/index.html'));
}

app.whenReady().then(() => {
  ipcMain.handle('selecionar-pasta', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog(janelaPrincipal, {
      properties: ['openDirectory'],
    });
    if (canceled || filePaths.length === 0) {
      return null;
    }
    return filePaths[0];
  });

  ipcMain.handle('download-mp3', (evento, url, pastaDestino) => {
    const ytDlpPath = obterCaminhoExecutavel('yt-dlp.exe');
    const ffmpegPath = obterCaminhoExecutavel('ffmpeg.exe');

    if (!fs.existsSync(ytDlpPath)) {
      const erroMsg = 'FATAL: yt-dlp.exe não foi encontrado!';
      console.error(erroMsg, 'Caminho verificado:', ytDlpPath);
      return Promise.reject(new Error(erroMsg));
    }

    const templateSaida = path.join(pastaDestino, '%(title)s.%(ext)s');
    const args = ['--ffmpeg-location', ffmpegPath, '--encoding', 'utf8', '--progress', '-i', '--sleep-interval', '3', '--max-sleep-interval', '7', '-x', '--audio-format', 'mp3', '-o', templateSaida, url];

    return new Promise((resolver, rejeitar) => {
      const processo = spawn(ytDlpPath, args);

      let progresso = {
        progressoItem: 0,
        nomeFaixa: '',
        playlistAtual: 0,
        playlistTotal: 0,
      };

      const processarSaida = (dados) => {
        const saida = dados.toString('utf8');
        console.log(saida);

        const matchPlaylist = saida.match(/\[download\] Downloading item (\d+) of (\d+)/);
        if (matchPlaylist) {
          progresso.playlistAtual = parseInt(matchPlaylist[1], 10);
          progresso.playlistTotal = parseInt(matchPlaylist[2], 10);
        }

        const matchNome = saida.match(/\[download\] Destination: (.*)/) || saida.match(/\[ExtractAudio\] Destination: (.*)/);
        if (matchNome) {
          progresso.nomeFaixa = path.basename(matchNome[1]).replace(/\.webm$|\.m4a$|\.part$/, '.mp3');
        }

        const matchPorcentagem = saida.match(/\[download\]\s+([\d.]+)%/);
        if (matchPorcentagem) {
          progresso.progressoItem = parseFloat(matchPorcentagem[1]);
        }

        janelaPrincipal.webContents.send('download-progress', progresso);
      };

      processo.stdout.on('data', processarSaida);
      processo.stderr.on('data', processarSaida);

      processo.on('close', (codigo) => {
        if (codigo === 0) {
          progresso.progressoItem = 100;
          janelaPrincipal.webContents.send('download-progress', progresso);
          resolver({ success: true, message: 'Download(s) concluído(s) com sucesso!' });
        } else {
          rejeitar(new Error(`Processo finalizado com erro (código: ${codigo}). Verifique o log detalhado no console.`));
        }
      });

      processo.on('error', (erro) => {
        rejeitar(new Error(`Falha ao iniciar o processo: ${erro.message}`));
      });
    });
  });

  criarJanelaPrincipal();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      criarJanelaPrincipal();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
