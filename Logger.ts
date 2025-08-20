// Logger.ts

import EventEmitter from "events";
import config from "config";

type LogLevel = "severe" | "warn" | "info" | "debug" | "trace";

const CONFIG_PROP_NAME = "log_level";
const DEFAULT_LOG_LEVEL: LogLevel = "info";

/**
 * Custom Logger class that extends EventEmitter.
 *
 * Features:
 * - Supports log levels: severe, warn, info, debug, trace
 * - Configurable log level via `config`
 * - Timestamped and color-coded console output
 * - Level-specific handlers and global message handler
 */
class Logger extends EventEmitter {
	private logLevel: LogLevel;

	/**
	 * Creates an instance of Logger.
	 * Initializes the log level from configuration or defaults to "info".
	 */
	constructor() {
		super();
		this.logLevel =
			(config.get<string>(CONFIG_PROP_NAME) as LogLevel) ||
			DEFAULT_LOG_LEVEL;
	}

	/**
	 * Adds a handler function for a specific log level.
	 * The handler receives a formatted string with timestamp, level, and message.
	 *
	 * @param level - The log level to handle
	 * @param handler - Callback function to handle messages of this level
	 */
	addHandlerLevel(
		level: LogLevel,
		handler: (message: string) => void
	): void {
		this.on(level, handler);
	}

	/**
	 * Adds a global handler for all log messages.
	 * The handler receives an object containing:
	 * - `level`: log level
	 * - `formattedMessage`: string with colored level, timestamp, and message
	 *
	 * @param handler - Callback function to handle all messages
	 */
	addHandlerMessage(
		handler: (obj: { level: LogLevel; formattedMessage: string }) => void
	): void {
		this.on("message", handler);
	}

	/**
	 * Determines if a message should be logged based on current log level.
	 *
	 * @param level - Log level of the message
	 * @returns `true` if the message should be logged, `false` otherwise
	 */
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

	/**
	 * Logs a message at the specified log level.
	 * - Checks if the message passes the configured log level
	 * - Adds timestamp
	 * - Formats message with colored level and symbols
	 * - Emits to level-specific handlers and global message handler
	 *
	 * @param level - The log level of the message
	 * @param message - The log message
	 */
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

			// Emit to handlers for specific log level
			this.emit(level, formattedMessage);

			// Emit to global message handlers
			this.emit("message", { ...logEntry, formattedMessage });
		}
	}

	/**
	 * Returns a color-coded and symbolized string for a given log level.
	 * Uses ANSI escape codes for colored console output.
	 *
	 * @param level - The log level
	 * @returns Formatted string with color, symbol, and uppercase level
	 */
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
			info: "\x1b[93m", // bright yellow
			debug: "\x1b[32m", // green
			trace: "\x1b[34m", // blue
		};

		return `${colors[level]}${
			symbols[level]
		} [${level.toUpperCase()}]\x1b[0m`;
	}
}

/**
 * Exports the Logger class as the default export.
 */
export default Logger;
