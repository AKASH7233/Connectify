import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';

// Convert URL to path for __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logDir = path.join(__dirname, '..', 'log'); // Define log directory

const { format } = winston;
const { combine, timestamp, printf, colorize, errors } = format;

// Updated function to capture and parse error stack trace
function parseErrorStack(err) {
    const stack = err.stack || '';
    const stackLines = stack.split('\n');
    // Adjusted to be more flexible in matching stack trace formats
    const callerLine = stackLines.find(line => line.includes('at '));
    if (callerLine) {
        const match = callerLine.match(/at\s+(.*?)\s+\((.+):(\d+):(\d+)\)/) || callerLine.match(/at\s+(.+):(\d+):(\d+)/);
        if (match) {
            return {
                functionName: match[1],
                filePath: match[2],
                line: match[3],
                column: match[4],
            };
        }
    }
    return { functionName: '', filePath: '', line: '', column: '' };
}

// Custom log format
const myFormat = printf(({ level, message, timestamp, stack, ...metadata }) => {
    let logMessage = `${timestamp} ${level}: ${message}`;
    if (metadata.error instanceof Error) {
        const { functionName, filePath, line, column } = parseErrorStack(metadata.error);
        logMessage += ` [Error in ${functionName} at ${filePath}:${line}:${column}]`;
    }
    return logMessage;
});

// Create a more advanced logger
const logger = winston.createLogger({
    level: 'info', // Lowest level of logs to capture
    format: combine(
        colorize(), // Add colors to the output
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Add timestamp
        errors({ stack: true }), // Ensure stack trace is captured where available
        myFormat // Use the custom format
    ),
    transports: [
        // Console transport
        new winston.transports.Console(),
        // Combined log file transport
        new winston.transports.File({ filename: path.join(logDir, 'combined.log') }),
        // Separate files for each level of logs
        new winston.transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }),
        new winston.transports.File({ filename: path.join(logDir, 'info.log'), level: 'info' }),
        new winston.transports.File({ filename: path.join(logDir, 'warn.log'), level: 'warn' }),
    ],
    exceptionHandlers: [
        // Handle uncaught exceptions
        new winston.transports.File({ filename: path.join(logDir, 'exceptions.log') })
    ],
    rejectionHandlers: [
        // Handle unhandled promise rejections
        new winston.transports.File({ filename: path.join(logDir, 'rejections.log') })
    ]
});

export default logger;