import { pino } from 'pino';

export class Logger {
  private static instance: Logger;
  private logger!: pino.Logger;

  private constructor() {
    // Initialize the logger with your desired configuration
    this.initializeLogger();
  }

  private initializeLogger(): void {
    this.logger = pino({
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
        },
      },
    });
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public info(message: string): void {
    this.logger.info(message);
  }

  public error(message: string): void {
    this.logger.error(message);
  }

  public warn(message: string): void {
    this.logger.warn(message);
  }

  public fatal(message: string): void {
    this.logger.fatal(message);
  }
}
