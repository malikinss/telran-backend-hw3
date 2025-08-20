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
		handler: (obj: { level: LogLevel; formattedMessage: string }) => void
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
			const logEntry = {
				level,
				message,
				timestamp: new Date().toISOString(),
			};

			const coloredLevel = this.getColoredLevel(level);
			const coloredTimestamp = `\x1b[36m[${logEntry.timestamp}]\x1b[0m`;

			const formattedMessage = `${coloredTimestamp} ${coloredLevel} ${message}`;

			// for addHandlerLevel - string
			this.emit(level, formattedMessage);

			// for addHandlerMessage - object
			this.emit("message", { ...logEntry, formattedMessage });
		}
	}

	private getColoredLevel(level: LogLevel): string {
		const symbols: Record<LogLevel, string> = {
			severe: "🔴",
			warn: "🟠",
			info: "🟡",
			debug: "🟢",
			trace: "🔵",
		};

		const colors: Record<LogLevel, string> = {
			severe: "\x1b[31m", // red
			warn: "\x1b[38;5;208m", // orange
			info: "\x1b[93m", // yellow
			debug: "\x1b[32m", // green
			trace: "\x1b[34m", // blue
		};

		return `${colors[level]}${
			symbols[level]
		} [${level.toUpperCase()}]\x1b[0m`;
	}
}

export default Logger;
