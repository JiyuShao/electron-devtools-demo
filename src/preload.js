const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  ipcRenderer: {
    send: (...args) => ipcRenderer.send(...args),
  },
});


