// index.ts

import Logger from "./Logger.ts";

const logger = new Logger();

// Adding handlers for different log levels
logger.addHandlerMessage((obj) => console.log(obj.formattedMessage));

// Test logging at various levels
logger.log("severe", "CRITICAL ERROR");
logger.log("warn", "Low disk space");
logger.log("info", "User logged in");
logger.log("debug", "Debugging x=42");
logger.log("trace", "Entered function foo()");
