type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  category: string;
  message: string;
  data?: any;
}

class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private readonly MAX_LOGS = 1000; // Keep last 1000 logs in memory

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatTimestamp(): string {
    return new Date().toISOString();
  }

  private addLog(level: LogLevel, category: string, message: string, data?: any) {
    const logEntry: LogEntry = {
      timestamp: this.formatTimestamp(),
      level,
      category,
      message,
      data
    };

    this.logs.push(logEntry);
    
    // Keep only the last MAX_LOGS entries
    if (this.logs.length > this.MAX_LOGS) {
      this.logs = this.logs.slice(-this.MAX_LOGS);
    }

    // In development, also console log
    if (__DEV__) {
      const logMethod = {
        debug: console.debug,
        info: console.info,
        warn: console.warn,
        error: console.error
      }[level];

      logMethod(
        `[${logEntry.timestamp}] [${level.toUpperCase()}] [${category}]:`,
        message,
        data || ''
      );
    }

    return logEntry;
  }

  debug(category: string, message: string, data?: any) {
    return this.addLog('debug', category, message, data);
  }

  info(category: string, message: string, data?: any) {
    return this.addLog('info', category, message, data);
  }

  warn(category: string, message: string, data?: any) {
    return this.addLog('warn', category, message, data);
  }

  error(category: string, message: string, data?: any) {
    return this.addLog('error', category, message, data);
  }

  getLogs(
    options?: {
      level?: LogLevel;
      category?: string;
      limit?: number;
      startTime?: Date;
      endTime?: Date;
    }
  ): LogEntry[] {
    let filteredLogs = [...this.logs];

    if (options?.level) {
      filteredLogs = filteredLogs.filter(log => log.level === options.level);
    }

    if (options?.category) {
      filteredLogs = filteredLogs.filter(log => log.category === options.category);
    }

    if (options?.startTime) {
      filteredLogs = filteredLogs.filter(
        log => new Date(log.timestamp) >= options.startTime!
      );
    }

    if (options?.endTime) {
      filteredLogs = filteredLogs.filter(
        log => new Date(log.timestamp) <= options.endTime!
      );
    }

    if (options?.limit) {
      filteredLogs = filteredLogs.slice(-options.limit);
    }

    return filteredLogs;
  }

  clearLogs() {
    this.logs = [];
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

export const logger = Logger.getInstance(); 