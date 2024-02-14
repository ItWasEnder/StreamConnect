/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
import axios from 'axios';
import windowStateManager from 'electron-window-state';
import { app, BrowserWindow, ipcMain } from 'electron';
import serve from 'electron-serve';
import { fileURLToPath } from 'url';
import path from 'path';
// import electronReloader from 'electron-reloader';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serveURL = serve({ directory: '.' });
const port = process.env.PORT || 5173;
const devmode = !app.isPackaged;
let window;



console.log('Electron version', process.versions.electron);
console.log(`------`);
console.log(path.join(__dirname, 'assets', 'streamconnect.ico'));
console.log(path.join(__dirname, 'preload.cjs'));
console.log(`------`);

function createWindow() {
	let windowState = windowStateManager({
		defaultWidth: 800,
		defaultHeight: 600
	});

	window = new BrowserWindow({
		backgroundColor: 'whitesmoke',
		// icon: path.join(__dirname, 'assets', 'streamconnect.ico'),
		minHeight: 450,
		minWidth: 600,
		autoHideMenuBar: true,
		webPreferences: {
			contextIsolation: true,
			nodeIntegration: true,
			devTools: true,
			preload: path.join(__dirname, 'preload.cjs')
		},
		x: windowState.x,
		y: windowState.y,
		width: windowState.width,
		height: windowState.height
	});

	windowState.manage(window);

	// Open the DevTools console
	window.webContents.openDevTools();

	window.once('ready-to-show', () => {
		window.show();
		window.focus();
	});

	window.on('closed', () => {
		app.quit();
	});

	return window;
}

function loadVite(port) {
	window.loadURL(`http://localhost:${port}`).catch((e) => {
		console.log('Error loading URL, retrying', e);
		setTimeout(() => {
			loadVite(port);
		}, 200);
	});
}

function createMainWindow() {
	window = createWindow();

	window.once('close', () => {
		window = null;
	});

	if (devmode) {
		loadVite(port);
	} else {
		serveURL(window);
	}
}

app.once('ready', createMainWindow);

app.on('activate', () => {
	if (!window) {
		createMainWindow();
	}
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});
