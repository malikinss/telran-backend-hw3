# Homework 3: Logger functionality

## Task Definition

Update method log of the Logger according to the TODO comments

```ts
//TODO
//following emit should be performed only for matching specified level
//config should contain property log_level
//default value is "info"
//log_level is severe - only message with level severe may be logged
//log_level is warn - messages with levels severe and warn may be logged
//log_level is "info" or default value - messages with levels severe, warn and info may be logged
//log_level is debug - all messages except ones with level trace may be logged
//log_level is trace - message with any log level may be logged
```

Test this method
So far testing (not professional tests) based on different contents of the index.ts file and checking console / file

## Description 📝

This project implements a **custom Logger** in TypeScript with support for multiple log levels, timestamped messages, and colored console output. The Logger extends Node.js `EventEmitter`, allowing you to attach multiple handlers either for specific log levels or for all messages.

## Purpose 🎯

The purpose of this homework is to practice working with:

-   Event-driven programming using Node.js `EventEmitter`
-   Configurable log levels
-   Formatted and colorized console output
-   Proper separation of log handling logic

This Logger helps in monitoring application behavior, debugging, and logging important events with visual clarity.

## Features

-   Supports log levels: `severe`, `warn`, `info`, `debug`, `trace`
-   Configurable `log_level` via `config` (default is `info`)
-   Only messages matching or exceeding the configured log level are logged
-   Each log entry includes ISO timestamp
-   Color-coded console output with symbols:
    -   🔴 Severe (red)
    -   🟠 Warn (bright orange)
    -   🟡 Info (bright yellow)
    -   🟢 Debug (green)
    -   🔵 Trace (blue)
-   `addHandlerLevel` for string-based handling (e.g., writing to files)
-   `addHandlerMessage` for structured object handling (`level`, `message`, `timestamp`, `formattedMessage`)

## How It Works 🔍

1. **Initialization**  
   The Logger reads `log_level` from a `config` file or defaults to `"info"`.

2. **Logging a message**

    - The `log()` method checks if the message’s level meets the configured log level using `shouldLog()`.
    - If allowed, it generates a timestamp and formats the message with colors and symbols.
    - Emits the message to:
        - **Level-specific handlers** (`addHandlerLevel`) as a formatted string.
        - **Global message handlers** (`addHandlerMessage`) as an object containing `level`, `message`, `timestamp`, and `formattedMessage`.

3. **Handlers**  
   Users can attach multiple handlers:
    - `addHandlerLevel(level, handler)`: reacts to a specific log level.
    - `addHandlerMessage(handler)`: reacts to all logged messages.

## Output 📜

Example console output with colors and symbols:

```sh
[2025-08-20T16:30:00.000Z] 🔴 [SEVERE] CRITICAL ERROR
[2025-08-20T16:30:01.000Z] 🟠 [WARN] Low disk space
[2025-08-20T16:30:02.000Z] 🟡 [INFO] User logged in
[2025-08-20T16:30:03.000Z] 🟢 [DEBUG] Debugging x=42
[2025-08-20T16:30:04.000Z] 🔵 [TRACE] Entered function foo()
```

In addition, file handlers or other level-specific handlers receive formatted strings or objects as required.

## Usage 📦

1. **Install dependencies:**

```bash
npm install
```

2. **Run the project:**

```bash
npm run dev
```

3. **Attach handlers in `index.ts`:**

```ts
logger.addHandlerMessage((obj) => console.log(obj.formattedMessage));

logger.addHandlerLevel("debug", (msg) =>
	fs.writeFileSync("logs.txt", "\n" + msg, { flag: "a" })
);

logger.log("info", "User logged in");
```

4. **Configure log level in `config/default.json`:**

```json
{
	"log_level": "debug"
}
```

## Project Structure 🗂

```
HW3/
│
├─ index.ts               # Entry point, demonstrates usage
├─ Logger.ts              # Logger class implementation
├─ package.json           # NPM dependencies and scripts
├─ tsconfig.json          # TypeScript configuration
├─ config/
│   └─ default.json       # Configuration file with log_level
└─ logs.txt               # Example log output file
```

## Conclusion 🚀

This Logger provides a flexible and visually clear system for monitoring application events.  
It demonstrates the power of **EventEmitter**, **TypeScript typing**, and **console formatting**.

---

Made with ❤️ and `TypeScript` by Sam-Shepsl Malikin
