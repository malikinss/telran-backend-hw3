import EventEmitter from "events";
type LogLevel = "severe" | "warn" | "info" | "debug" | "trace";
class Logger extends EventEmitter {
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
	log(level: LogLevel, message: string): void {
		this.emit(level, message);
		//TODO
		//following emit should be performed only for matching specified level
		//config should contain property log_level
		//default value is "info"
		//log_level is severe - only message with level severe may be logged
		//log_level is warn - messages with levels severe and warn may be logged
		//log_level is "info" or default value - messages with levels severe, warn and info may be logged
		//log_level is debug - all messages except ones with level trace may be logged
		//log_level is trace - message with any log level may be logged
		this.emit("message", { level, message });
	}
}
export default Logger;
