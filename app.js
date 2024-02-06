"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = require("path");
const fs = require("fs");
const settings = require("electron-settings");
const url_1 = require("url");
settings.configure({});
const preventDisplaySleepBlockId = electron_1.powerSaveBlocker.start('prevent-display-sleep');
let windows = {
    analyser: null,
    settings: null,
};
const args = process.argv.slice(1), serve = args.some((val) => val === '--serve');
function createWindow(hash = '') {
    const size = electron_1.screen.getPrimaryDisplay().workAreaSize;
    const window = new electron_1.BrowserWindow({
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
    }
    else {
        let pathIndex = './dist/index.html';
        // Local
        if (fs.existsSync(path.join(__dirname, '../dist/index.html'))) {
            pathIndex = './dist/index.html';
        }
        const url = new URL(path.join('file:', __dirname, pathIndex));
        window.loadURL((0, url_1.format)({
            pathname: url.pathname,
            hash,
            protocol: 'file:',
            slashes: true,
        }));
    }
    window.webContents.openDevTools();
    return window;
}
function appInit() {
    return __awaiter(this, void 0, void 0, function* () {
        if (electron_1.systemPreferences.getMediaAccessStatus('microphone') !== 'granted') {
            yield electron_1.systemPreferences.askForMediaAccess('microphone');
        }
        if (windows.settings === null) {
            windows.settings = createWindow();
            windows.settings.on('close', () => {
                windows.settings = null;
            });
        }
        if (windows.analyser === null) {
            windows.analyser = createWindow('analyser');
            windows.analyser.on('close', () => {
                windows.analyser = null;
            });
        }
    });
}
try {
    // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
    electron_1.app.on('ready', () => setTimeout(() => {
        appInit();
    }, 400));
    electron_1.app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            electron_1.app.quit();
        }
    });
    electron_1.app.on('activate', () => {
        appInit();
    });
    electron_1.app.on('quit', () => {
        if (electron_1.powerSaveBlocker.isStarted(preventDisplaySleepBlockId)) {
            electron_1.powerSaveBlocker.stop(preventDisplaySleepBlockId);
        }
    });
}
catch (e) {
    throw e;
}
electron_1.ipcMain.handle('get-displays', (event) => __awaiter(void 0, void 0, void 0, function* () {
    return electron_1.screen.getAllDisplays();
}));
electron_1.ipcMain.handle('read-settings', (event) => __awaiter(void 0, void 0, void 0, function* () {
    return settings.get();
}));
electron_1.ipcMain.handle('save-settings', (event, obj) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    (_a = windows.analyser) === null || _a === void 0 ? void 0 : _a.webContents.send('update-analyser', obj);
    return settings.set(obj);
}));
//# sourceMappingURL=app.js.map