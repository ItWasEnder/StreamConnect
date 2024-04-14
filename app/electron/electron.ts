/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
import axios from 'axios';
import windowStateManager from 'electron-window-state';
import { app, BrowserWindow, ipcMain, session } from 'electron';
import serve from 'electron-serve';
import { fileURLToPath } from 'url';
import child_process from 'child_process';
import path from 'path';
import fs from 'fs';
import util from 'util';

app.commandLine.appendSwitch('log-file', 'C:/Users/ender/Documents/Dev/Git/StreamConnect/log.txt');
app.commandLine.appendSwitch('enable-logging');

const __thisFile = fileURLToPath(import.meta.url);
const __thisDir = path.dirname(__thisFile);
const __logFile = path.join(app.getPath('userData'), 'streamconnect.log');

const serveURL = serve({ directory: '.' });
const port = process.env.PORT || 5173;
const devmode = !app.isPackaged;

// if (devmode) {
// 	try {
// 		require('electron-reloader')(module, {
// 			watchRenderer: true,
// 			ignore: ['*.js', '*.map'],
// 			watch: ['*.{html,css}', '*.ts']
// 		});
// 	} catch (_) {}
// }

// Clear the log file
fs.writeFileSync(__logFile, '');

const logFileStream = fs.createWriteStream(__logFile, { flags: 'a' });

console.log = function () {
	logFileStream.write(util.format.apply(null, arguments) + '\n');
};

console.error = function () {
	logFileStream.write(util.format.apply(null, arguments) + '\n');
};

let window;

console.log('Electron version', process.versions.electron);
console.log(`------ ------ ------ ------`);
console.log(__logFile);
console.log(path.join(__thisDir, 'assets', 'streamconnect.ico'));
console.log(path.join(__thisDir, 'preload.cjs'));
console.log(`------ ------ ------ ------`);

try {
	runBackend();
} catch (e) {
	console.error(e);
}

function createWindow() {
	let windowState = windowStateManager({
		defaultWidth: 800,
		defaultHeight: 600
	});

	window = new BrowserWindow({
		backgroundColor: 'whitesmoke',
		// icon: path.join(__dirname, 'assets', 'streamconnect.ico'),
		minHeight: 480,
		minWidth: 900,
		autoHideMenuBar: true,
		webPreferences: {
			contextIsolation: true,
			nodeIntegration: true,
			devTools: true,
			preload: path.join(__thisDir, 'preload.cjs')
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
		if (window) {
			window.show();
			window.focus();
		}
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

	const mainSession = window.webContents.session.cookies;
	mainSession.get({}).then((cookies) => {
		console.log('cookies-load:', cookies);
	});

	if (devmode) {
		loadVite(port);
	} else {
		serveURL(window);
	}
}

function runBackend() {
	const userDataPath = devmode ? path.join(__thisDir, '..', '..') : app.getPath('userData');

	const backendPath = path.join(userDataPath, 'StreamConnect-Bridge');
	const scriptPath = path.join(backendPath, 'dist', 'index.cjs');

	if (!devmode) {
		const copyBackend = path.join(__thisDir, '..', 'StreamConnect-Bridge');

		console.log('dataPath', userDataPath);
		console.log('backendPath', backendPath);
		console.log('scriptPath', scriptPath);
		console.log('copyBackend', copyBackend);
		console.log(`------ ------ ------ ------`);

		const dist = path.join(backendPath, 'dist');

		if (!fs.existsSync(backendPath)) fs.mkdirSync(backendPath);
		if (!fs.existsSync(dist)) fs.mkdirSync(dist);

		const distFiles = fs.readdirSync(path.join(copyBackend, 'dist'));
		distFiles.forEach((file) => {
			const locFile = path.join(dist, file);
			if (fs.existsSync(locFile)) fs.unlinkSync(locFile);
			fs.copyFileSync(path.join(copyBackend, 'dist', file), locFile);
		});

		const proto = path.join(backendPath, 'proto');
		if (!fs.existsSync(proto)) fs.mkdirSync(proto);

		const protoFiles = fs.readdirSync(path.join(copyBackend, 'proto'));
		protoFiles.forEach((file) => {
			const locFile = path.join(proto, file);
			if (fs.existsSync(locFile)) fs.unlinkSync(locFile);
			fs.copyFileSync(path.join(copyBackend, 'proto', file), locFile);
		});

		const storage = path.join(backendPath, 'storage');
		if (!fs.existsSync(storage)) fs.mkdirSync(storage);
		const storageFiles = fs.readdirSync(path.join(copyBackend, 'storage'));
		storageFiles.forEach((file) => {
			const locFile = path.join(backendPath, 'storage', file);
			if (fs.existsSync(locFile)) return;
			fs.copyFileSync(path.join(copyBackend, 'storage', file), locFile);
		});
	}

	// check if the script exists
	if (!fs.existsSync(scriptPath)) {
		console.log('Script not found:', scriptPath);
		return;
	}

	const args = ['--data', backendPath, '--backend'];
	console.log('Running backend script:', scriptPath, args);

	const childProcess = child_process.fork(scriptPath, args, { stdio: 'pipe' });

	childProcess.stdout?.on('data', (data) => {
		console.log(`${data}`);
	});

	childProcess.stderr?.on('data', (data) => {
		console.error(`${data}`);
	});

	childProcess.on('close', (code) => {
		console.log(`child process exited with code ${code}`);
	});
}

ipcMain.on('set-cookie', async (event, data) => {
	console.log('set-cookie:', data);

	const { name, value } = data;

	if (!name || !value) {
		console.log('Invalid cookie data');
		return;
	}

	const mainSession = window.webContents.session.cookies;
	mainSession
		.set({
			url: `http://localhost:${port}`,
			name,
			value,
			path: '/',
			secure: true,
			httpOnly: true,
			sameSite: 'strict',
			session: false,
			expirationDate: 253375378405
		})
		.catch((e) => {
			console.error(e);
		});

	session.defaultSession.cookies.get({}).then((cookies) => {
		console.log('cookies:', cookies);
	});

	// const mainSession = window.webContents.session.cookies;
	// mainSession
	// 	.set({
	// 		url: `http://localhost:${port}`,
	// 		name: 'testItem',
	// 		value: 'dev=1',
	// 		path: '/',
	// 		secure: false,
	// 		httpOnly: false,
	// 		sameSite: 'strict',
	// 		expirationDate: 253375378405
	// 	})
	// 	.catch((e) => {
	// 		console.error(e);
	// 	});

	// session.defaultSession.cookies.get({}).then((cookies) => {
	// 	console.log('cookies:', cookies);
	// });
});

ipcMain.on('get-cookie', async (event, data) => {
	const cookies = await session.defaultSession.cookies.get({});
	window.webContents.send('get-cookie-reply', cookies);
});

app.once('ready', () => {
	createMainWindow();
});

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
