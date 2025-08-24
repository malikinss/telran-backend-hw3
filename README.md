# Homework 3: Logger functionality

## Task Definition

Update method `log` of the Logger according to the requirements:

-   `config` should contain property `log_level`
-   Default value is `"info"`
-   Logging rules:
    -   `log_level` = `severe` → log only `severe`
    -   `log_level` = `warn` → log `severe`, `warn`
    -   `log_level` = `info` (default) → log `severe`, `warn`, `info`
    -   `log_level` = `debug` → log everything except `trace`
    -   `log_level` = `trace` → log all messages

Testing is based on different contents of `index.ts` and checking console or file output.

---

## Description 📝

This project implements a **custom Logger** in TypeScript with support for multiple log levels, timestamped messages, and colored console output. The Logger extends Node.js `EventEmitter`, allowing you to attach multiple handlers for specific log levels or for all messages.

---

## Purpose 🎯

The purpose of this homework is to practice:

-   Event-driven programming using Node.js `EventEmitter`
-   Configurable log levels via `config`
-   Formatted and colorized console output
-   Strong typing with **TypeScript enums**
-   Handler-based logging architecture

---

## Features

-   ✅ Supports log levels: `severe`, `warn`, `info`, `debug`, `trace` via **enum `LogLevel`**
-   ✅ Configurable `log_level` in `config` (default: `info`)
-   ✅ Only messages matching or exceeding the configured log level are logged
-   ✅ Each log entry includes ISO timestamp
-   ✅ Color-coded console output with symbols:
    -   🔴 `severe` (red)
    -   🟠 `warn` (orange)
    -   🟡 `info` (yellow)
    -   🟢 `debug` (green)
    -   🔵 `trace` (blue)
-   ✅ `addHandlerLevel(level, handler)` for level-specific handling (e.g., writing to files)
-   ✅ `addHandlerMessage(handler)` for handling all messages

---

## How It Works 🔍

1. **Initialization**  
   The Logger reads `log_level` from a `config` file or defaults to `LogLevel.info`.

2. **Logging a message**

    - The `log()` method checks if the message’s level meets the configured log level using `shouldLog()`.
    - If allowed, it generates a timestamp and formats the message with colors and symbols.
    - Emits the message to:
        - **Level-specific handlers** (`addHandlerLevel`) as a formatted string.
        - **Global message handlers** (`addHandlerMessage`) as an object containing `level`, `formattedMessage`.

3. **Handlers**  
   Users can attach multiple handlers:
    - `addHandlerLevel(level, handler)`: reacts to a specific log level.
    - `addHandlerMessage(handler)`: reacts to all logged messages.

---

## Output 📜

Example console output with colors and symbols:

```sh
[2025-08-20T16:30:00.000Z] 🔴 [SEVERE] CRITICAL ERROR
[2025-08-20T16:30:01.000Z] 🟠 [WARN] Low disk space
[2025-08-20T16:30:02.000Z] 🟡 [INFO] User logged in
[2025-08-20T16:30:03.000Z] 🟢 [DEBUG] Debugging x=42
[2025-08-20T16:30:04.000Z] 🔵 [TRACE] Entered function foo()
```

---

## Usage 📦

1. **Install dependencies:**

```bash
npm install
```

2. **Run the project:**

```bash
npm run dev
```

3. **Example in `index.ts`:**

```ts
import Logger, { LogLevel } from "./Logger.js";

const logger = new Logger();

// Global handler for all messages
logger.addHandlerMessage((obj) => console.log(obj.formattedMessage));

// Level-specific handler
logger.addHandlerLevel(LogLevel.debug, (msg) =>
	fs.writeFileSync("logs.txt", "\n" + msg, { flag: "a" })
);

// Logging examples
logger.log(LogLevel.severe, "CRITICAL ERROR");
logger.log(LogLevel.warn, "Low disk space");
logger.log(LogLevel.info, "User logged in");
logger.log(LogLevel.debug, "Debugging x=42");
logger.log(LogLevel.trace, "Entered function foo()");
```

4. **Configure log level in `config/default.json`:**

```json
{
	"log_level": "debug"
}
```

---

## Project Structure 🗂

```
HW3/
│
├─ index.ts               # Entry point, demonstrates usage
├─ Logger.ts              # Logger class implementation with LogLevel enum
├─ package.json           # NPM dependencies and scripts
├─ tsconfig.json          # TypeScript configuration
├─ config/
│   └─ default.json       # Configuration file with log_level
└─ logs.txt               # Example log output file
```

---

## Conclusion 🚀

This Logger provides a flexible and visually clear system for monitoring application events.
It demonstrates the power of **EventEmitter**, **TypeScript enums**, and **console formatting**.

---

Made with ❤️ and `TypeScript` by Sam-Shepsl Malikin
