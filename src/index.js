/*
 * @Author: Jiyu Shao
 * @Date: 2022-12-23 15:29:33
 * @Last Modified by: Jiyu Shao
 * @Last Modified time: 2022-12-28 14:55:39
 * @Reference
 * - https://zhaomenghuan.js.org/blog/chrome-devtools.html
 * - https://www.electronjs.org/docs/latest/api/web-contents#contentssetdevtoolswebcontentsdevtoolswebcontents
 */
const path = require("path");
const {
  app,
  ipcMain,
  webContents,
  BrowserWindow,
  BrowserView,
} = require("electron");

const createWindow = () => {
  // Simulator Window
  const simulatorWindow = new BrowserWindow({
    useContentSize: false,
    titleBarStyle: "hidden",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      webSecurity: false,
      webviewTag: true,
    },
  });
  simulatorWindow.maximize();
  simulatorWindow.loadFile(path.join(__dirname, "index.html"));
  simulatorWindow.openDevTools({ mode: "detach" });

  // Devtools View
  const devtoolsView = new BrowserView();
  simulatorWindow.setBrowserView(devtoolsView);
  devtoolsView.setBounds({
    x: 500,
    y: 0,
    width: simulatorWindow.getBounds().width - 500,
    height: simulatorWindow.getBounds().height,
  });
  devtoolsView.setAutoResize({ width: true, height: true });

  ipcMain.on("open-devtools", (_event, simulatorContentsId) => {
    const simulator = webContents.fromId(simulatorContentsId);
    simulator.setDevToolsWebContents(devtoolsView.webContents);
    simulator.debugger.attach();
    simulator.openDevTools();
  });
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
