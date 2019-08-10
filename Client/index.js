/** electron */
const electron = require('electron')
const app = electron.app
let mainWindow

/** version */  
const version = require('../package.json').version

/** Name */
const name = require('./package.json').name

app.on('ready', () => {
  if (!mainWindow) createMainWindow()
})

app.on('activate', () => {
  if (!mainWindow) createMainWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

function createMainWindow () {
  mainWindow = new electron.BrowserWindow({
    title: name + ' v' + version,
    width: 800,
    height: 600,
    icon: 'https://repository-images.githubusercontent.com/189825448/b441c500-8e39-11e9-99bb-2958359f548d',
    webPreferences: {
      nodeIntegration: true
    },
    autoHideMenuBar: true
  }).on('close', () => {
    mainWindow = null
  })
  mainWindow.loadFile('./src/index.html')
}
