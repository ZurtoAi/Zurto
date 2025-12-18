/**
 * Logger utility for the extension
 */

import * as vscode from "vscode";

export type LogLevel = "debug" | "info" | "warn" | "error";

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

export class Logger {
  private outputChannel: vscode.OutputChannel;
  private level: LogLevel;

  constructor(level: LogLevel = "info") {
    this.outputChannel = vscode.window.createOutputChannel("Zurto");
    this.level = level;
  }

  setLevel(level: string): void {
    if (level in LOG_LEVELS) {
      this.level = level as LogLevel;
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= LOG_LEVELS[this.level];
  }

  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  }

  debug(message: string, ...args: unknown[]): void {
    if (this.shouldLog("debug")) {
      const formatted = this.formatMessage("debug", message);
      this.outputChannel.appendLine(formatted);
      if (args.length > 0) {
        this.outputChannel.appendLine(JSON.stringify(args, null, 2));
      }
    }
  }

  info(message: string, ...args: unknown[]): void {
    if (this.shouldLog("info")) {
      const formatted = this.formatMessage("info", message);
      this.outputChannel.appendLine(formatted);
      if (args.length > 0) {
        this.outputChannel.appendLine(JSON.stringify(args, null, 2));
      }
    }
  }

  warn(message: string, ...args: unknown[]): void {
    if (this.shouldLog("warn")) {
      const formatted = this.formatMessage("warn", message);
      this.outputChannel.appendLine(formatted);
      if (args.length > 0) {
        this.outputChannel.appendLine(JSON.stringify(args, null, 2));
      }
    }
  }

  error(message: string, error?: unknown): void {
    if (this.shouldLog("error")) {
      const formatted = this.formatMessage("error", message);
      this.outputChannel.appendLine(formatted);
      if (error) {
        if (error instanceof Error) {
          this.outputChannel.appendLine(`  ${error.message}`);
          if (error.stack) {
            this.outputChannel.appendLine(error.stack);
          }
        } else {
          this.outputChannel.appendLine(JSON.stringify(error, null, 2));
        }
      }
    }
  }

  showOutput(): void {
    this.outputChannel.show();
  }

  dispose(): void {
    this.outputChannel.dispose();
  }
}
