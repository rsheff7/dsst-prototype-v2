import * as fs from 'fs'
import * as path from 'path'

// Telemetry event schema - all events must conform to this structure
export interface TelemetryEvent {
  timestamp: string
  level: 'debug' | 'info' | 'warn' | 'error'
  category: 'pipeline' | 'inference' | 'pdf' | 'error'
  event: string
  metadata: Record<string, unknown>
}

// Telemetry logger - singleton pattern for structured logging
class TelemetryLogger {
  private static instance: TelemetryLogger
  private readonly logDir: string
  private readonly logFile: string
  private readonly maxFileSize: number = 10 * 1024 * 1024 // 10MB
  private readonly backupCount: number = 1
  private enabled: boolean

  private constructor() {
    // Log to ~/Library/Logs/DSST/dsst_structured.jsonl
    this.logDir = path.join(process.env.HOME || '', 'Library', 'Logs', 'DSST')
    this.logFile = path.join(this.logDir, 'dsst_structured.jsonl')
    this.enabled = process.env.DSST_TELEMETRY_ENABLED === 'true'
    
    // Ensure log directory exists
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true })
    }
  }

  static getInstance(): TelemetryLogger {
    if (!TelemetryLogger.instance) {
      TelemetryLogger.instance = new TelemetryLogger()
    }
    return TelemetryLogger.instance
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled
  }

  isEnabled(): boolean {
    return this.enabled
  }

  // Rotate log file if it exceeds max size
  private rotateIfNeeded(): void {
    if (!fs.existsSync(this.logFile)) return

    const stats = fs.statSync(this.logFile)
    if (stats.size < this.maxFileSize) return

    // Rotate: backup -> backup.1, current -> backup
    const backupFile = `${this.logFile}.1`
    
    if (fs.existsSync(backupFile)) {
      fs.unlinkSync(backupFile)
    }
    
    if (fs.existsSync(this.logFile)) {
      fs.renameSync(this.logFile, backupFile)
    }
  }

  // Write a single event to the log file
  private write(event: TelemetryEvent): void {
    if (!this.enabled) return

    try {
      this.rotateIfNeeded()
      const line = JSON.stringify(event) + '\n'
      fs.appendFileSync(this.logFile, line, 'utf8')
    } catch (error) {
      console.error('Failed to write telemetry event:', error)
    }
  }

  // Convenience methods for common event types

  logPipelineStart(lessonId: string, pdfSizeBytes: number): void {
    this.write({
      timestamp: new Date().toISOString(),
      level: 'info',
      category: 'pipeline',
      event: 'pipeline_start',
      metadata: { lesson_id: lessonId, pdf_size_bytes: pdfSizeBytes }
    })
  }

  logPdfExtractionComplete(durationMs: number, textLength: number): void {
    this.write({
      timestamp: new Date().toISOString(),
      level: 'info',
      category: 'pdf',
      event: 'pdf_extraction_complete',
      metadata: { duration_ms: durationMs, text_length: textLength }
    })
  }

  logInferenceStart(pass: string, passName: string): void {
    this.write({
      timestamp: new Date().toISOString(),
      level: 'info',
      category: 'inference',
      event: 'inference_start',
      metadata: { pass, pass_name: passName }
    })
  }

  logInferenceComplete(pass: string, durationMs: number, inputTokens: number, outputTokens: number): void {
    this.write({
      timestamp: new Date().toISOString(),
      level: 'info',
      category: 'inference',
      event: 'inference_complete',
      metadata: { pass, duration_ms: durationMs, input_tokens: inputTokens, output_tokens: outputTokens }
    })
  }

  logInferenceError(pass: string, errorCategory: string, errorMessage: string, durationMs: number): void {
    this.write({
      timestamp: new Date().toISOString(),
      level: 'error',
      category: 'error',
      event: 'inference_error',
      metadata: {
        pass,
        error_category: errorCategory,
        error_message: errorMessage,
        duration_ms: durationMs
      }
    })
  }

  logPipelineComplete(totalDurationMs: number, passCount: number): void {
    this.write({
      timestamp: new Date().toISOString(),
      level: 'info',
      category: 'pipeline',
      event: 'pipeline_complete',
      metadata: { total_duration_ms: totalDurationMs, pass_count: passCount }
    })
  }

  logPipelineError(errorCategory: string, errorMessage: string, totalDurationMs: number): void {
    this.write({
      timestamp: new Date().toISOString(),
      level: 'error',
      category: 'error',
      event: 'pipeline_error',
      metadata: {
        error_category: errorCategory,
        error_message: errorMessage,
        total_duration_ms: totalDurationMs
      }
    })
  }

  logDebug(message: string, metadata: Record<string, unknown> = {}): void {
    this.write({
      timestamp: new Date().toISOString(),
      level: 'debug',
      category: 'pipeline',
      event: 'debug',
      metadata: { message, ...metadata }
    })
  }
}

// Export singleton instance for use throughout the app
export const telemetry = TelemetryLogger.getInstance()