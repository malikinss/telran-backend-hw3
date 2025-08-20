// index.ts

import Logger from "./Logger.ts";

const logger = new Logger();

logger.addHandlerMessage((obj) =>
	console.log(`[${obj.level.toUpperCase()}] ${obj.message}`)
);

logger.log("severe", "CRITICAL ERROR");
logger.log("warn", "Low disk space");
logger.log("info", "User logged in");
logger.log("debug", "Debugging x=42");
logger.log("trace", "Entered function foo()");
