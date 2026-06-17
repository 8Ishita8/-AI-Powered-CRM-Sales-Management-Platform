import { AsyncLocalStorage } from 'async_hooks';

// Setup AsyncLocalStorage to store request ID across asynchronous calls
export const asyncLocalStorage = new AsyncLocalStorage<string>();

export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG',
}

class Logger {
  private getRequestId(): string | undefined {
    return asyncLocalStorage.getStore();
  }

  private formatMessage(level: LogLevel, message: string, details?: any): string {
    const timestamp = new Date().toISOString();
    const requestId = this.getRequestId();
    const requestIdStr = requestId ? ` [ReqID: ${requestId}]` : '';
    const detailsStr = details 
      ? `\nDetails: ${typeof details === 'object' ? JSON.stringify(details, null, 2) : details}` 
      : '';
    return `[${timestamp}] [${level}]${requestIdStr}: ${message}${detailsStr}`;
  }

  public info(message: string, details?: any): void {
    console.log(this.formatMessage(LogLevel.INFO, message, details));
  }

  public warn(message: string, details?: any): void {
    console.warn(this.formatMessage(LogLevel.WARN, message, details));
  }

  public error(message: string, details?: any): void {
    console.error(this.formatMessage(LogLevel.ERROR, message, details));
  }

  public debug(message: string, details?: any): void {
    if (process.env.NODE_ENV !== 'production') {
      console.log(this.formatMessage(LogLevel.DEBUG, message, details));
    }
  }
}

export const logger = new Logger();
export default logger;
