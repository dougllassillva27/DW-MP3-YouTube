const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  downloadMp3: (url, pastaDestino) => ipcRenderer.invoke('download-mp3', url, pastaDestino),
  selecionarPasta: () => ipcRenderer.invoke('selecionar-pasta'),
  onDownloadProgress: (callback) => ipcRenderer.on('download-progress', (_evento, valor) => callback(valor)),
});
