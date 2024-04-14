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

	interface EventMapping {
		event: string;
		conditions: Condition[];
	}

	interface FETrigger extends Trigger {
		__new?: boolean;
		__cd?: number;
	}

	interface Trigger {
		id: string;
		name: string;
		events: EventMapping[];
		actions: InternalRequest[];
		cooldown: number;
		log: boolean;
		enabled: boolean;
	}

	type ContextLike = Record<string, any>;

	type ProviderKey = {
		categoryId?: string;
		actions: string[];
	};

	interface InternalRequest {
		caller: string;
		requestId?: string;
		providerId: string;
		providerKey?: ProviderKey;
		bypass_cooldown?: boolean;
		context: ContextLike;
	}

	interface Condition {
		order: number;
		data_path: string;
		negate: boolean;
		ignore_case: boolean;
		operation: OperationType;
		value: string | number;
	}
}

export {};
