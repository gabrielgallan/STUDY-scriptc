export class Logger {
	private serviceName: string;

	constructor(serviceName?: string) {
		this.serviceName = serviceName ?? 'Core';
	}

	private serializeData(data: unknown): unknown {
		if (data === null || data === undefined) {
			return data;
		}

		// If it's an Error, serialize it properly
		if (data instanceof Error) {
			return {
				message: data.message,
				stack: data.stack,
				name: data.name,
			};
		}

		// If it's an object, try to serialize nested objects
		if (typeof data === 'object') {
			try {
				// Use JSON.stringify with replacer to handle circular references and deep objects
				return JSON.parse(
					JSON.stringify(
						data,
						(_key, value) => {
							// Handle Error objects
							if (value instanceof Error) {
								return {
									message: value.message,
									stack: value.stack,
									name: value.name,
								};
							}
							// Handle Buffer
							if (Buffer.isBuffer(value)) {
								return `<Buffer ${value.length} bytes>`;
							}
							return value;
						},
						2,
					),
				);
			} catch {
				// If serialization fails, return string representation
				return String(data);
			}
		}

		return data;
	}

	info(message: string, data?: unknown) {
		const serializedData = data ? this.serializeData(data) : '';

		return console.log(
			`${this.timestamp()}\x1b[32m INFO [${this.serviceName}]\x1b[0m ${message}`,
			serializedData,
		);
	}

	error(message: string, error?: Error | unknown) {
		const serializedError = error ? this.serializeData(error) : '';

		return console.error(
			`${this.timestamp()}\x1b[38;2;244;63;94m ERROR [${this.serviceName}]\x1b[0m ${message}`,
			serializedError,
		);
	}

	warn(message: string, data?: unknown) {
		const serializedData = data ? this.serializeData(data) : '';

		return console.warn(
			`${this.timestamp()}\x1b[38;2;245;158;11m WARN [${this.serviceName}]\x1b[0m ${message}`,
			serializedData,
		);
	}

	debug(message: string, data?: unknown) {
		const serializedData = data ? this.serializeData(data) : '';

		return console.debug(
			`${this.timestamp()}\x1b[38;5;218m DEBUG [${this.serviceName}]\x1b[0m ${message}`,
			serializedData,
		);
	}

	private timestamp() {
		return `[${new Date().toISOString()}]`;
	}
}