// Logger.ts

import EventEmitter from "events";
import config from "config";

type LogLevel = "severe" | "warn" | "info" | "debug" | "trace";

const CONFIG_PROP_NAME = "log_level";
const DEFAULT_LOG_LEVEL: LogLevel = "info";

class Logger extends EventEmitter {
	private logLevel: LogLevel;

	constructor() {
		super();
		// Initialize log level from config or default to "info"
		this.logLevel =
			(config.get<string>(CONFIG_PROP_NAME) as LogLevel) ||
			DEFAULT_LOG_LEVEL;
	}

	addHandlerLevel(
		level: LogLevel,
		handler: (message: string) => void
	): void {
		this.on(level, handler);
	}

	addHandlerMessage(
		handler: (obj: { level: LogLevel; message: string }) => void
	): void {
		this.on("message", handler);
	}

	private shouldLog(level: LogLevel): boolean {
		const levels: LogLevel[] = [
			"trace",
			"debug",
			"info",
			"warn",
			"severe",
		];
		const currentLevelIndex = levels.indexOf(this.logLevel);
		const levelIndex = levels.indexOf(level);

		return levelIndex >= currentLevelIndex;
	}

	log(level: LogLevel, message: string): void {
		if (this.shouldLog(level)) {
			this.emit(level, message);
			this.emit("message", { level, message });
		}
	}
}

export default Logger;
