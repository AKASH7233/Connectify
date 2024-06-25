const winston = require('winston');
const path = require('path');

const logDir = path.join(__dirname, '..', 'log'); // Define log directory

const { format } = winston;
const { combine, timestamp, printf, colorize, errors } = format;

// Custom log format
const myFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} ${level}: ${stack || message}`;
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