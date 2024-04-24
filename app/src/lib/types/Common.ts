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

enum OperationType {
	EQUALS = 'equals',
	CONTAINS = 'contains',
	STARTS_WITH = 'starts_with',
	GREATER_THAN = 'greater_than',
	LESS_THAN = 'less_than'
}

export type {
	EventMapping,
	FETrigger,
	Trigger,
	ContextLike,
	ProviderKey,
	InternalRequest,
	Condition,
	OperationType
};
