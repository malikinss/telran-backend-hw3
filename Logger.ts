// Logger.ts

import EventEmitter from "events";
import config from "config";

export enum LogLevel {
	Severe = "severe",
	Warn = "warn",
	Info = "info",
	Debug = "debug",
	Trace = "trace",
}

const CONFIG_PROP_NAME = "log_level";
const DEFAULT_LOG_LEVEL: LogLevel = LogLevel.Info;

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
		try {
			const levelFromConfig = config.has(CONFIG_PROP_NAME)
				? (config.get<string>(CONFIG_PROP_NAME) as LogLevel)
				: DEFAULT_LOG_LEVEL;

			if (
				!Object.values(LogLevel).includes(levelFromConfig as LogLevel)
			) {
				console.warn(
					`Invalid log level in config: "${levelFromConfig}", using default "${DEFAULT_LOG_LEVEL}"`
				);
				this.logLevel = DEFAULT_LOG_LEVEL;
			} else {
				this.logLevel = levelFromConfig as LogLevel;
			}
		} catch (err) {
			console.error(
				"Failed to read log_level from config, using default.",
				err
			);
			this.logLevel = DEFAULT_LOG_LEVEL;
		}
	}

	// Priority mapping for log levels
	private static levelPriority: Record<LogLevel, number> = {
		[LogLevel.Trace]: 0,
		[LogLevel.Debug]: 1,
		[LogLevel.Info]: 2,
		[LogLevel.Warn]: 3,
		[LogLevel.Severe]: 4,
	};

	// Map of log levels to their corresponding symbols
	private static symbols: Record<LogLevel, string> = {
		[LogLevel.Severe]: "🔴",
		[LogLevel.Warn]: "🟠",
		[LogLevel.Info]: "🟡",
		[LogLevel.Debug]: "🟢",
		[LogLevel.Trace]: "🔵",
	};

	// Map of log levels to their corresponding colors
	private static colors: Record<LogLevel, string> = {
		[LogLevel.Severe]: "\x1b[31m",
		[LogLevel.Warn]: "\x1b[38;5;208m",
		[LogLevel.Info]: "\x1b[93m",
		[LogLevel.Debug]: "\x1b[32m",
		[LogLevel.Trace]: "\x1b[34m",
	};

	/**
	 * Adds a handler function for a specific log level.
	 * The handler receives a formatted string with timestamp, level, and message.
	 *
	 * @param level - The log level to handle
	 * @param handler - Callback function to handle messages of this level
	 *
	 * @example
	 * logger.addHandlerLevel("info", (message) => {
	 *   console.log(`Info handler: ${message}`);
	 * });
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
	 *
	 * @example
	 * logger.addHandlerMessage(({ level, formattedMessage }) => {
	 *   console.log(`Global handler [${level}]: ${formattedMessage}`);
	 * });
	 */
	addHandlerMessage(
		handler: (obj: { level: LogLevel; formattedMessage: string }) => void
	): void {
		this.on("message", handler);
	}

	/**
	 * Checks if a message should be logged based on its level.
	 *
	 * @param level - The log level of the message
	 * @returns True if the message should be logged, false otherwise
	 */
	private shouldLog(level: LogLevel): boolean {
		return (
			Logger.levelPriority[level] >= Logger.levelPriority[this.logLevel]
		);
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
		const symbol = Logger.symbols[level];
		const color = Logger.colors[level];

		return `${color}${symbol}[${level.toUpperCase()}]\x1b[0m`;
	}
}

/**
 * Exports the Logger class as the default export.
 */
export default Logger;
