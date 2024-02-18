declare global {
	interface Window {
		/**
		 * Electron application ContextBridge, this is used to communicate between
		 * the main and renderer processes.
		 * <br/>
		 * This is established by the `preload.cjs` script.
		 */
		electron: {
			send: (channel: string, data: any) => void;
			sendSync: (channel: string, data: any) => any;
			on: (channel: string, func: (...args: any[]) => void) => void;
            once: (channel: string, func: (...args: any[]) => void) => void;
		};
	}
}

export {};
