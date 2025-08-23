// index.ts

import Logger, { LogLevel } from "./Logger.ts";

const logger = new Logger();

// Adding handlers for different log levels
logger.addHandlerMessage((obj) => console.log(obj.formattedMessage));

// Test logging at various levels
logger.log(LogLevel.Severe, "CRITICAL ERROR");
logger.log(LogLevel.Warn, "Low disk space");
logger.log(LogLevel.Info, "User logged in");
logger.log(LogLevel.Debug, "Debugging x=42");
logger.log(LogLevel.Trace, "Entered function foo()");
