import {
  app,
  BrowserWindow,
  ipcMain,
  screen,
  systemPreferences,
  powerSaveBlocker,
} from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import * as settings from 'electron-settings';
import { format } from 'url';

settings.configure({});

const preventDisplaySleepBlockId = powerSaveBlocker.start(
  'prevent-display-sleep'
);

interface Windows {
  settings: BrowserWindow | null;
  analyser: BrowserWindow | null;
}

let windows: Windows = {
  analyser: null,
  settings: null,
};

const args = process.argv.slice(1),
  serve = args.some((val: string): boolean => val === '--serve');

function createWindow(hash: string = ''): BrowserWindow {
  const size = screen.getPrimaryDisplay().workAreaSize;

  const window = new BrowserWindow({
    // x: 0,
    // y: 0,
    // width: size.width,
    // height: size.height,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: serve,
      contextIsolation: false, // false if you want to run e2e test with Spectron
    },
  });

  if (serve) {
    const debug = require('electron-debug');
    debug();

    require('electron-reloader')(module);

    window.loadURL(`http://localhost:4200#${hash}`);
  } else {
    let pathIndex = './dist/index.html';

    // Local
    if (fs.existsSync(path.join(__dirname, '../dist/index.html'))) {
      pathIndex = './dist/index.html';
    }

    const url = new URL(path.join('file:', __dirname, pathIndex));

    window.loadURL(
      format({
        pathname: url.pathname,
        hash,
        protocol: 'file:',
        slashes: true,
      })
    );
  }

  // window.webContents.openDevTools();

  return window;
}

async function appInit() {
  if (systemPreferences.getMediaAccessStatus('microphone') !== 'granted') {
    await systemPreferences.askForMediaAccess('microphone');
  }

  if (windows.settings === null) {
    windows.settings = createWindow();

    windows.settings.on('close', (): void => {
      windows.settings = null;
    });
  }

  if (windows.analyser === null) {
    windows.analyser = createWindow('analyser');

    windows.analyser.on('close', (): void => {
      windows.analyser = null;
    });
  }
}

try {
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  app.on('ready', () =>
    setTimeout((): void => {
      appInit();
    }, 400)
  );

  app.on('window-all-closed', (): void => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', (): void => {
    appInit();
  });

  app.on('quit', (): void => {
    if (powerSaveBlocker.isStarted(preventDisplaySleepBlockId)) {
      powerSaveBlocker.stop(preventDisplaySleepBlockId);
    }
  });
} catch (e) {
  throw e;
}

ipcMain.handle('get-displays', async (event) => {
  return screen.getAllDisplays();
});

ipcMain.handle('read-settings', async (event) => {
  return settings.get();
});

ipcMain.handle('save-settings', async (event, obj) => {
  windows.analyser?.webContents.send('update-analyser', obj);
  return settings.set(obj);
});
