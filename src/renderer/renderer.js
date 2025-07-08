let pastaSelecionada = '';

// Mapeamento de elementos do DOM para evitar repetição de document.getElementById.
const elementos = {
  status: document.getElementById('status'),
  playlistStatus: document.getElementById('playlistStatus'),
  trackName: document.getElementById('trackName'),
  progressBar: document.getElementById('progressBar'),
  downloadBtn: document.getElementById('downloadBtn'),
  selectFolderBtn: document.getElementById('selectFolderBtn'),
  urlInput: document.getElementById('urlInput'),
  selectedFolderText: document.getElementById('selectedFolderText'),
};

/**
 * Reseta a interface para o estado inicial ou pós-operação.
 */
function resetarUI(mensagemInicial = 'Aguardando ação...') {
  elementos.status.textContent = mensagemInicial;
  elementos.playlistStatus.textContent = '';
  elementos.trackName.textContent = '';
  elementos.progressBar.value = 0;
  elementos.downloadBtn.disabled = false;
}

// Listener de progresso atualizado para receber o objeto completo.
window.electronAPI.onDownloadProgress(({ progressoItem, nomeFaixa, playlistAtual, playlistTotal }) => {
  elementos.progressBar.value = progressoItem;
  elementos.status.textContent = `Baixando... ${progressoItem.toFixed(1)}%`;

  if (nomeFaixa) {
    elementos.trackName.textContent = `Faixa: ${nomeFaixa}`;
  }

  if (playlistTotal > 0) {
    elementos.playlistStatus.textContent = `Música ${playlistAtual} de ${playlistTotal}`;
  }
});

// Adiciona o listener para o botão de selecionar pasta.
elementos.selectFolderBtn.addEventListener('click', async () => {
  try {
    const caminhoPasta = await window.electronAPI.selecionarPasta();
    if (caminhoPasta) {
      pastaSelecionada = caminhoPasta;
      elementos.selectedFolderText.textContent = `Pasta selecionada: ${caminhoPasta}`;
      elementos.status.textContent = 'Pasta de destino definida. Pronto para baixar.';
    }
  } catch (erro) {
    console.error('Erro ao selecionar pasta:', erro);
    elementos.status.textContent = `Erro ao selecionar pasta: ${erro.message}`;
  }
});

// Adiciona o listener para o botão de download.
elementos.downloadBtn.addEventListener('click', () => {
  const url = elementos.urlInput.value;
  realizarDownload(url, pastaSelecionada);
});

/**
 * Orquestra o processo de download no frontend.
 * @param {string} url A URL do vídeo/playlist.
 * @param {string} pastaDestino O caminho para salvar os arquivos.
 */
async function realizarDownload(url, pastaDestino) {
  if (!url || !pastaDestino) {
    elementos.status.textContent = 'Por favor, insira uma URL e selecione uma pasta de destino.';
    return;
  }

  // Prepara a UI para o download
  resetarUI('Iniciando conexão...');
  elementos.downloadBtn.disabled = true;

  try {
    const resultado = await window.electronAPI.downloadMp3(url, pastaDestino);
    elementos.status.textContent = resultado.message;
    elementos.playlistStatus.textContent = 'Todos os downloads foram concluídos!';
    elementos.trackName.textContent = '';
  } catch (erro) {
    console.error('Erro no processo de download:', erro);
    elementos.status.textContent = `Erro: ${erro.message}`;
    elementos.playlistStatus.textContent = 'Ocorreu uma falha durante o processo.';
  } finally {
    elementos.downloadBtn.disabled = false;
  }
}
